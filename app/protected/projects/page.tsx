'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/components/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  project_title: string;
  project_type: string;
  goal: string;
  impact: string;
  project_profile_picture_id: number | null;
  updated_at: string;
  created_at: string;
  gallery_id: number | null;
  profile_picture?: {
    id: number;
    filename: string;
  };
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        console.log('Auth Session:', { session, error: sessionError });

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          console.log('No session found, redirecting to login');
          toast({
            title: 'Authentication required',
            description: 'Please sign in to view projects',
            variant: 'destructive',
          });
          router.push('/login');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: 'Authentication Error',
          description:
            'There was a problem checking your authentication status',
          variant: 'destructive',
        });
        return false;
      }
    }

    async function fetchProjects() {
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          setLoading(false);
          return;
        }

        console.log('Fetching projects...');
        const { data: projectsData, error: projectsError } =
          await supabase.from('projects').select(`
            *,
            profile_picture:project_profile_picture_id (
              id,
              filename
            )
          `);

        console.log('Projects Query Result:', {
          data: projectsData,
          error: projectsError,
        });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }

        if (!projectsData) {
          console.log('No projects found');
          setProjects([]);
          return;
        }

        setProjects(projectsData);
      } catch (error) {
        console.error('Error in fetchProjects:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch projects. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        } else if (event === 'SIGNED_IN') {
          fetchProjects();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, toast, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <Skeleton className="h-64 md:w-72 w-full" />
              <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No projects found
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="relative h-64 md:w-72 w-full">
                  {project.profile_picture ? (
                    <Image
                      src={`https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
                        project.profile_picture.filename
                      )}`}
                      alt={project.project_title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 288px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6 space-y-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {project.project_title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {project.project_type} • Created{' '}
                      {format(new Date(project.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Goal</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.goal}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Impact</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.impact}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button
                      onClick={() =>
                        router.push(`/protected/projects/${project.id}`)
                      }
                      className="group"
                    >
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
