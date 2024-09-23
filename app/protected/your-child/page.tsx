import ChildDetails from '@/components/ChildDetails';
import FetchDataSteps from '@/components/tutorial/fetch-data-steps';
import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  // Select current logged-in sponsor data from the Sponsors table using email
  const { data: Sponsors } = await supabase
    .from('Sponsors')
    .select('*')
    .eq('Email', user.email);

  // Handle the case where Sponsors might be null or undefined
  if (!Sponsors || Sponsors.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-12 p-8">
        <p>No sponsor data found.</p>
      </div>
    );
  }

  // Select sponsee data from the Sponsees table using Sponsee_id from the Sponsors table
  const { data: Sponsees } = await supabase
    .from('Sponsees')
    .select('*')
    .in(
      'id',
      Sponsors.map((sponsor) => sponsor.Sponsee_id)
    );

  // log the Sponsees data to the console

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Child</h1>

      <div className="flex flex-col gap-4">
        {Sponsees ? (
          Sponsees.map((child) => <ChildDetails key={child.id} child={child} />)
        ) : (
          <p>No sponsored children found.</p>
        )}
      </div>
    </div>
  );
}
