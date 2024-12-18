'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryMedia {
  id: number;
  mediaType: 'image' | 'video';
  caption?: string;
  filename: string;
  url: string;
  display_order: number;
}

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [media, setMedia] = useState<GalleryMedia[]>([]);
  const [sponseeName, setSponseeName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryMedia | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const supabase = createClient();
        console.log('Fetching gallery for sponsee ID:', params.id);

        // First, fetch the sponsee data
        const { data: sponseeData, error: sponseeError } = await supabase
          .from('sponsees')
          .select('id, full_name, gallery_id')
          .eq('id', params.id)
          .single();

        if (sponseeError) {
          console.error('Error fetching sponsee:', sponseeError);
          setError('Error fetching sponsee data');
          setLoading(false);
          return;
        }

        if (!sponseeData?.gallery_id) {
          console.error('No gallery found for sponsee');
          setError('No gallery found for this sponsee');
          setLoading(false);
          return;
        }

        console.log('Found sponsee:', sponseeData);
        setSponseeName(sponseeData.full_name);

        // Then fetch the gallery media
        const { data: galleryData, error: galleryError } = await supabase
          .from('gallery_media')
          .select(
            `
            id,
            mediaType,
            _order,
            caption,
            media:image_id (
              id,
              filename
            )
          `
          )
          .eq('_parent_id', sponseeData.gallery_id)
          .order('_order');

        if (galleryError) {
          console.error('Error fetching gallery media:', galleryError);
          setError('Error fetching gallery media');
          setLoading(false);
          return;
        }

        console.log('Found gallery media:', galleryData);

        if (galleryData) {
          const mediaItems = galleryData
            .filter((item) => item.media) // Filter out any items without media
            .map((item) => ({
              id: item.id,
              mediaType: item.mediaType || 'image',
              caption: item.caption,
              filename: item.media.filename,
              url: `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
                item.media.filename
              )}`,
              display_order: item._order || 0,
            }));
          setMedia(mediaItems);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/protected/your-child">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gallery
          </h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <Link href="/protected/your-child" className="mt-4 inline-block">
            <Button variant="outline">Go Back</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/protected/your-child">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {sponseeName}'s Gallery
          </h1>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => (
          <Card
            key={item.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            <div className="aspect-square relative">
              {item.mediaType === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.caption || ''}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            {selectedImage.mediaType === 'image' ? (
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || ''}
                width={1200}
                height={800}
                className="object-contain w-full h-full"
              />
            ) : (
              <video
                src={selectedImage.url}
                controls
                className="w-full h-full"
              />
            )}
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-lg">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {media.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No media available in the gallery.
          </p>
        </div>
      )}
    </div>
  );
}
