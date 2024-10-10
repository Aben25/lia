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

  // Select current logged-in sponsor data from the sponsors table using email
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

  // Select sponsees data through the sponsors_rels table
  const { data: sponsees, error: sponseesError } = await supabase
    .from('sponsors_rels')
    .select(
      `
      sponsees (
        id,
        full_name,
        location,
        date_of_birth,
        academic_progress,
        last_message,
        milestones,
        contributions_used_for,
        sponsorship_duration,
        donated_amount,
        last_update,
        Gender,
        profile_picture_id,
        gallery_id,
        bio
      )
    `
    )
    .eq('parent_id', sponsor.id);

  if (sponseesError) {
    console.error('Error fetching sponsees:', sponseesError);
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>Error fetching sponsored children data.</p>
      </div>
    );
  }

  // Fetch profile picture data for sponsees
  const sponseesList = await Promise.all(
    sponsees?.map(async (rel) => {
      const sponsee = rel.sponsees;

      if (sponsee.profile_picture_id) {
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('filename')
          .eq('id', sponsee.profile_picture_id)
          .single();

        if (mediaError) {
          console.error('Error fetching profile picture:', mediaError);
        } else {
          const filename = mediaData?.filename;
          if (filename) {
            // Construct the URL using the filename
            const profilePictureUrl = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(filename)}`;
            sponsee.profile_picture_url = profilePictureUrl;
            sponsee.profile_picture_filename = filename;
          }
        }
      } else {
        console.log('No profile_picture_id for sponsee:', sponsee.id);
      }
      return sponsee;
    }) || []
  );

  // Log the processed sponsees list
  console.log('Processed sponseesList:', JSON.stringify(sponseesList, null, 2));

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Child</h1>

      <div className="flex flex-col gap-4">
        {sponseesList.length > 0 ? (
          sponseesList.map((child) => (
            <ChildDetails key={child.id} child={child} />
          ))
        ) : (
          <p>No sponsored children found.</p>
        )}
      </div>
    </div>
  );
}
