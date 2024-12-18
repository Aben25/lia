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
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>No sponsor data found.</p>
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
        joined_sponsorship_program,
        Gender,
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

  const sponseesList = sponseesRelData?.map((rel) => rel.sponsees) || [];

  // Collect all profile_picture_ids
  const profilePictureIds = sponseesList
    .map((sponsee) => sponsee.profile_picture_id)
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
    const filename = mediaMap[sponsee.profile_picture_id];
    if (filename) {
      sponsee.profile_picture_url = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
        filename
      )}`;
    }
  });

  // Fetch galleries for the sponsees
  const sponseeIds = sponseesList.map((sponsee) => sponsee.id);

  const { data: galleriesData, error: galleriesError } = await supabase
    .from('gallery')
    .select('id, sponsee_id')
    .in('sponsee_id', sponseeIds);

  if (galleriesError) {
    console.error('Error fetching galleries:', galleriesError);
  }

  // Build a map from sponsee_id to gallery id
  const galleryMap = galleriesData.reduce((acc, gallery) => {
    acc[gallery.sponsee_id] = gallery.id;
    return acc;
  }, {});

  // Attach gallery_id to each sponsee
  sponseesList.forEach((sponsee) => {
    sponsee.gallery_id = galleryMap[sponsee.id];
  });

  return (
    <div className="flex-1 w-full">
      {sponseesList.length > 0 ? (
        sponseesList.map((child) => (
          <ChildDetails
            key={child.id}
            child={{ ...child, gender: child.Gender || 'Unknown' }}
          />
        ))
      ) : (
        <p>No sponsored children found.</p>
      )}
    </div>
  );
}
