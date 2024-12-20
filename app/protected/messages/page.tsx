'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Chat } from '@/components/Chat';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [sponsorship, setSponsorship] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      try {
        // Get session using Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/sign-in');
          return;
        }

        // Get session details
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        // Fetch sponsorship details
        const { data: sponsorships, error: sponsorshipError } = await supabase
          .from('sponsorships')
          .select(
            `
            id,
            sponsor:sponsor_id(id, email, full_name),
            sponsee:sponsee_id(id, full_name)
          `
          )
          .or(`sponsor_id.eq.${user.id},sponsee_id.eq.${user.id}`)
          .single();

        if (sponsorshipError) {
          throw sponsorshipError;
        }

        if (sponsorships) {
          setSponsorship(sponsorships);
        }
      } catch (error: any) {
        console.error('Error:', error);
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/sign-in');
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session);
        getSession();
      }
    });

    getSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="bg-white rounded-lg shadow">
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!sponsorship) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <p>
          No sponsorship found. You need to be in a sponsorship to use the
          messaging system.
        </p>
      </div>
    );
  }

  if (!session) {
    router.push('/sign-in');
    return null;
  }

  const channelId = `sponsorship_${sponsorship.sponsor.id}_${sponsorship.sponsee.id}`;
  const channelName = `${sponsorship.sponsor.full_name} - ${sponsorship.sponsee.full_name}`;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <Chat
          userId={session.user.id}
          userName={session.user.email!}
          channelId={channelId}
          sponsorId={sponsorship.sponsor.id}
          sponseeId={sponsorship.sponsee.id}
          channelName={channelName}
        />
      </div>
    </div>
  );
}
