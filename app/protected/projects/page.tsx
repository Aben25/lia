'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/components/use-toast';
import { useRouter } from 'next/navigation';

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
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');

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

    // Set up auth state change listener
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-xl">
                    {project.project_title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {project.project_type}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Goal</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.goal}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.impact}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground pt-4">
                    Created{' '}
                    {format(new Date(project.created_at), 'MMM d, yyyy')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Projects Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.project_title}
                      </TableCell>
                      <TableCell>{project.project_type}</TableCell>
                      <TableCell>{project.goal}</TableCell>
                      <TableCell>{project.impact}</TableCell>
                      <TableCell>
                        {format(new Date(project.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
