'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/use-toast';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order?: number;
  filename: string;
  mediaId: number;
}

interface GalleryData {
  id: number;
  full_name: string;
  gallery: {
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
        mime_type: string;
      };
    }>;
  };
}

interface DebugState {
  gallery?: {
    data: GalleryData | null;
    error: any;
  };
  processedImages?: GalleryImage[];
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState<DebugState>({});
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchGalleryImages() {
      try {
        console.log('Fetching images for sponsee ID:', params.id);

        // First, get the gallery ID for the sponsee
        const { data: sponseeData, error: sponseeError } = await supabase
          .from('sponsees')
          .select('gallery_id')
          .eq('id', params.id)
          .single();

        if (sponseeError) {
          console.error('Error fetching sponsee:', sponseeError);
          throw sponseeError;
        }

        if (!sponseeData?.gallery_id) {
          console.log('No gallery found for sponsee');
          setLoading(false);
          return;
        }

        // Then fetch the gallery with its media
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery')
          .select(
            `
            id,
            gallery_media (
              id,
              caption,
              _order,
              media_type,
              image_id,
              media:image_id (
                id,
                filename,
                mime_type
              )
            )
          `
          )
          .eq('id', sponseeData.gallery_id)
          .single();

        console.log('Gallery query result:', { galleryData, galleryError });
        setDebug((prev) => ({
          ...prev,
          gallery: { data: galleryData as any, error: galleryError },
        }));

        if (galleryError) {
          console.error('Error fetching gallery:', galleryError);
          throw galleryError;
        }

        if (!galleryData?.gallery_media) {
          console.log('No media found in gallery');
          setLoading(false);
          return;
        }

        // Transform the data into the format we need
        const processedImages = galleryData.gallery_media
          .filter((item: any) => item.media && item.media_type === 'image')
          .map((item: any) => {
            const imageUrl = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(item.media.filename)}`;

            console.log('Processing image:', {
              id: item.id,
              mediaId: item.image_id,
              filename: item.media.filename,
              order: item._order,
              url: imageUrl,
            });

            return {
              id: item.id,
              mediaId: item.image_id,
              url: imageUrl,
              caption: item.caption || undefined,
              order: item._order,
              filename: item.media.filename,
            };
          })
          .sort(
            (a: GalleryImage, b: GalleryImage) =>
              (a.order || 0) - (b.order || 0)
          );

        console.log('Processed images:', processedImages);
        setDebug((prev) => ({ ...prev, processedImages }));
        setImages(processedImages);
      } catch (error: any) {
        console.error('Error in fetchGalleryImages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gallery images. ' + error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGalleryImages();
  }, [params.id, supabase, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show debug information in development
  if (process.env.NODE_ENV === 'development' && images.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No images found in this gallery
            </div>
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(debug, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              No images found in this gallery
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={image.url}
                alt={image.caption || `Image ${image.filename}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {image.caption && (
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{image.caption}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
