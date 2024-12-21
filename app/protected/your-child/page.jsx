import ChildDetails from '@/components/ChildDetails';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  // Fetch sponsor data
  const { data: sponsor, error: sponsorError } = await supabase
    .from('sponsors')
    .select('id')
    .eq('email', user.email)
    .single();

  if (sponsorError || !sponsor) {
    console.error('Sponsor error:', sponsorError);
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>No sponsor data found. {sponsorError?.message}</p>
      </div>
    );
  }

  // Fetch sponsees data
  console.log('Sponsor ID:', sponsor.id);
  const { data: sponseesRelData, error: sponseesError } = await supabase
    .from('sponsors_rels')
    .select(
      `
      sponsees_id,
      sponsees (
        id,
        full_name,
        location,
        date_of_birth,
        grade,
        education,
        aspiration,
        hobby,
        about,
        how_sponsorship_will_help,
        family,
        joined_sponsorship_date,
        gender,
        profile_picture_id,
        gallery_id
      )
    `
    )
    .eq('parent_id', sponsor.id);

  if (sponseesError) {
    console.error('Detailed sponsees error:', sponseesError);
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>
          Error fetching sponsored children data. Details:{' '}
          {sponseesError.message}
        </p>
      </div>
    );
  }

  if (!sponseesRelData || sponseesRelData.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>No sponsored children found for your account.</p>
      </div>
    );
  }

  const sponseesList = sponseesRelData.map((rel) => rel.sponsees) || [];

  // Collect all profile_picture_ids
  const profilePictureIds = sponseesList
    .map((sponsee) => sponsee?.profile_picture_id)
    .filter((id) => id != null);

  // Fetch media data for all profile_picture_ids
  let mediaMap = {};
  if (profilePictureIds.length > 0) {
    const { data: mediaData, error: mediaError } = await supabase
      .from('media')
      .select('id, filename')
      .in('id', profilePictureIds);

    if (mediaError) {
      console.error('Error fetching media data:', mediaError);
    } else {
      mediaMap = mediaData.reduce((acc, media) => {
        acc[media.id] = media.filename;
        return acc;
      }, {});
    }
  }

  // Attach profile_picture_url to each sponsee
  sponseesList.forEach((sponsee) => {
    if (sponsee && sponsee.profile_picture_id) {
      const filename = mediaMap[sponsee.profile_picture_id];
      if (filename) {
        sponsee.profile_picture_url = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
          filename
        )}`;
      }
    }
  });

  // Fetch galleries for the sponsees
  const sponseeIds = sponseesList
    .map((sponsee) => sponsee?.id)
    .filter((id) => id != null);

  const { data: galleriesData, error: galleriesError } = await supabase
    .from('gallery')
    .select('id, sponsee_id')
    .in('sponsee_id', sponseeIds);

  if (galleriesError) {
    console.error('Error fetching galleries:', galleriesError);
  }

  // Build a map from sponsee_id to gallery id
  const galleryMap = (galleriesData || []).reduce((acc, gallery) => {
    acc[gallery.sponsee_id] = gallery.id;
    return acc;
  }, {});

  // Attach gallery_id to each sponsee
  sponseesList.forEach((sponsee) => {
    if (sponsee) {
      sponsee.gallery_id = galleryMap[sponsee.id];
    }
  });

  // Fetch donation distribution data for all sponsees
  const { data: donationData, error: donationError } = await supabase
    .from('donation_distribution')
    .select(
      'id, donation_given_amount, donation_given_date, distribution_type, sponsee_name_id'
    )
    .in('sponsee_name_id', sponseeIds)
    .order('donation_given_date', { ascending: false }); // Sort by date descending

  if (donationError) {
    console.error('Error fetching donation data:', donationError);
  }

  // Create a map of donations by sponsee ID
  const donationMap = (donationData || []).reduce((acc, donation) => {
    if (!acc[donation.sponsee_name_id]) {
      acc[donation.sponsee_name_id] = [];
    }
    acc[donation.sponsee_name_id].push(donation);
    return acc;
  }, {});

  // Attach donations to each sponsee
  sponseesList.forEach((sponsee) => {
    if (sponsee) {
      const donations = donationMap[sponsee.id] || [];
      sponsee.donations = donations;
      // Calculate total donations
      sponsee.totalDonations = donations.reduce(
        (sum, donation) => sum + (donation.donation_given_amount || 0),
        0
      );
    }
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Your Sponsored Children
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponseesList.length > 0 ? (
          sponseesList.map((child) => (
            <ChildDetails
              key={child.id}
              child={{ ...child, gender: child.gender || 'Unknown' }}
            />
          ))
        ) : (
          <p>No sponsored children found.</p>
        )}
      </div>
    </div>
  );
}
