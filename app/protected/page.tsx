import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Select current logged-in sponsor data from the Sponsors table using email
  const { data: Sponsors } = await supabase
    .from("Sponsors")
    .select("*")
    .eq("Email", user.email);

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
    .from("Sponsees")
    .select("*")
    .in("id", Sponsors.map((sponsor) => sponsor.Sponsee_id));

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your Sponsored Child Details</h2>
        {Sponsees && Sponsees.length > 0 ? (
          Sponsees.map((sponsee) => (
            <div key={sponsee.id} className="bg-white shadow-md rounded-lg p-6 flex">
              <img
                src={sponsee.profile}
                alt={`${sponsee["First Name"]} ${sponsee["Last Name"]}`}
                className="w-32 h-32 rounded-full mr-6 object-cover"
              />
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold">
                  {sponsee["First Name"]} {sponsee["Last Name"]}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {sponsee.aspiration ? `Aspires to be a ${sponsee.aspiration}` : "Aspiration not provided"}
                </p>
                <p className="text-gray-800">{sponsee.bio}</p>
                <div className="flex gap-4 mt-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    <span className="icon-gender-male" /> {sponsee.gender}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="icon-location-pin" /> {sponsee.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="icon-calendar" /> {new Date(sponsee.bod).getFullYear()} years old
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="icon-book" /> Grade {sponsee.grade}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No sponsored children found.</p>
        )}
      </div>
    </div>
  );
}
