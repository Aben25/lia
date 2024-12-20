'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Target,
  Users,
  Image as ImageIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GalleryImage {
  id: string;
  caption: string | null;
  order: number;
  mediaId: number;
  filename: string;
  url: string;
}

interface ProjectDetails {
  id: number;
  project_title: string;
  project_type: string;
  goal: string;
  impact: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string | null;
  budget: number;
  project_profile_picture_id: number | null;
  gallery_id: number | null;
  created_at: string;
  updated_at: string;
  profile_picture?: {
    id: number;
    filename: string;
  };
  gallery?: {
    id: number;
    gallery_media: Array<{
      id: string;
      caption: string | null;
      _order: number;
      media_type: 'image' | 'video';
      image_id: number;
      media: {
        id: number;
        filename: string;
      };
    }>;
  };
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        setLoading(true);
        console.log('Fetching project details for ID:', params.id);

        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(
            `
            *,
            profile_picture:project_profile_picture_id (
              id,
              filename
            ),
            gallery:gallery_id (
              id,
              gallery_media (
                id,
                caption,
                _order,
                media_type,
                image_id,
                media:image_id (
                  id,
                  filename
                )
              )
            )
          `
          )
          .eq('id', params.id)
          .single();

        console.log('Project query result:', { projectData, projectError });

        if (projectError) {
          console.error('Error fetching project:', projectError);
          throw projectError;
        }

        if (!projectData) {
          console.log('No project found');
          toast({
            title: 'Error',
            description: 'Project not found',
            variant: 'destructive',
          });
          router.push('/protected/projects');
          return;
        }

        setProject(projectData);
      } catch (error) {
        console.error('Error in fetchProjectDetails:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [params.id, supabase, toast, router]);

  const getGalleryImages = (): GalleryImage[] => {
    if (!project?.gallery?.gallery_media) return [];

    return project.gallery.gallery_media
      .filter((item) => item.media_type === 'image' && item.media)
      .map((item) => ({
        id: item.id,
        caption: item.caption,
        order: item._order,
        mediaId: item.image_id,
        filename: item.media.filename,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Media/${item.media.filename}`,
      }))
      .sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const galleryImages = getGalleryImages();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/protected/projects')}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {project.project_title}
          </h1>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Created {format(new Date(project.created_at), 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {project.profile_picture && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Media/${project.profile_picture.filename}`}
                    alt={project.project_title}
                    fill
                    className="object-cover"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.jpg';
                      target.onerror = null;
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {galleryImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Project Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
                    >
                      <Image
                        src={image.url}
                        alt={image.caption || 'Gallery image'}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                          target.onerror = null;
                        }}
                      />
                      {image.caption && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-sm line-clamp-2">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Type</h3>
                <p className="text-muted-foreground">{project.project_type}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Status</h3>
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                  {project.status || 'Active'}
                </div>
              </div>
              {project.budget && (
                <div>
                  <h3 className="font-semibold mb-1">Budget</h3>
                  <p className="text-muted-foreground">
                    ${project.budget.toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Goal</h3>
                <p className="text-muted-foreground">{project.goal}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Impact</h3>
                <p className="text-muted-foreground">{project.impact}</p>
              </div>
              {project.description && (
                <div>
                  <h3 className="font-semibold mb-1">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Start Date</h3>
                <p className="text-muted-foreground">
                  {project.start_date
                    ? format(new Date(project.start_date), 'MMM d, yyyy')
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">End Date</h3>
                <p className="text-muted-foreground">
                  {project.end_date
                    ? format(new Date(project.end_date), 'MMM d, yyyy')
                    : 'Ongoing'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedImage?.caption || 'Gallery Image'}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative aspect-[16/9] mt-2">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Gallery image'}
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                  target.onerror = null;
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
