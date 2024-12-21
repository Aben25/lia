'use client';

import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface GalleryImage {
  id: string;
  caption: string | null;
  order: number;
  mediaId: number;
  filename: string;
  url: string;
}

interface GalleryPageProps {
  params: {
    id: string;
  };
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childName, setChildName] = useState<string>('');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadGallery() {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/sign-in');
          return;
        }

        // Fetch sponsor data
        const { data: sponsor, error: sponsorError } = await supabase
          .from('sponsors')
          .select('id')
          .eq('email', user.email)
          .single();

        if (sponsorError || !sponsor) {
          throw new Error('No sponsor data found');
        }

        // Verify the sponsor has access to this child's gallery
        const { data: sponsorship, error: sponsorshipError } = await supabase
          .from('sponsors_rels')
          .select('sponsees_id')
          .eq('parent_id', sponsor.id)
          .eq('sponsees_id', params.id)
          .single();

        if (sponsorshipError || !sponsorship) {
          throw new Error('You do not have access to this gallery');
        }

        // Fetch child's data
        const { data: child, error: childError } = await supabase
          .from('sponsees')
          .select('id, full_name, gallery_id')
          .eq('id', params.id)
          .single();

        if (childError || !child) {
          throw new Error('Child not found');
        }

        setChildName(child.full_name);

        // Fetch gallery media
        const { data: galleryMedia, error: mediaError } = await supabase
          .from('gallery_media')
          .select(
            `
            id,
            caption,
            _order,
            media_type,
            image_id,
            media:image_id (
              id,
              filename
            )
          `
          )
          .eq('_parent_id', child.gallery_id)
          .order('_order');

        if (mediaError) {
          throw new Error('Error loading gallery media');
        }

        const processedImages = (galleryMedia || [])
          .filter((item) => item.media_type === 'image' && item.media)
          .map((item) => ({
            id: item.id,
            caption: item.caption,
            order: item._order,
            mediaId: item.image_id,
            filename: item.media.filename,
            url: `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
              item.media.filename
            )}`,
          }));

        setImages(processedImages);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    }

    loadGallery();
  }, [params.id, router, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {childName}'s Gallery
        </h1>
      </div>

      {images.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              No images in the gallery yet.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.url}
                alt={image.caption || 'Gallery image'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {image.caption && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-lg font-medium">
                    {image.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-black/95">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            {selectedImage && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || 'Gallery image'}
                  fill
                  className="object-contain"
                  priority
                />
                {selectedImage.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-medium">
                      {selectedImage.caption}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
