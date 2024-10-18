import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

// Add type for params
interface GalleryPageProps {
  params: {
    gallery_id: string;
  };
}

interface GalleryMedia {
  image_id: number;
  filename: string;
  caption: string | null;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { gallery_id } = params;
  const galleryId = parseInt(gallery_id, 10);
  console.log('Parsed galleryId:', galleryId);

  if (isNaN(galleryId) || galleryId <= 0) {
    console.error('Invalid galleryId:', galleryId);
    return <div>Error loading gallery: Invalid gallery ID</div>;
  }

  const supabase = createClient();

  // Fetch gallery data including sponsee name
  const { data: galleryData, error: galleryError } = await supabase
    .from('gallery')
    .select(
      `
      id,
      name,
      description,
      sponsee:sponsee_id (
        full_name
      )
    `
    )
    .eq('id', galleryId)
    .single();

  if (galleryError) {
    console.error('Error fetching gallery data:', galleryError);
    return <div>Error loading gallery: {galleryError.message}</div>;
  }

  // Fetch gallery media data
  const { data: galleryMedia, error: mediaError } = await supabase
    .from('gallery_media')
    .select('image_id, filename, caption')
    .eq('_parent_id', galleryId);

  if (mediaError) {
    console.error('Error fetching gallery media:', mediaError);
    return <div>Error loading gallery media: {mediaError.message}</div>;
  }

  // Ensure galleryData is defined and has sponsee data
  if (
    !galleryData ||
    !galleryData.sponsee ||
    !Array.isArray(galleryData.sponsee) ||
    galleryData.sponsee.length === 0
  ) {
    return <div>No sponsee found for this gallery.</div>;
  }

  // Now TypeScript knows the exact shape of galleryData and galleryMedia
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {galleryData.sponsee[0].full_name}'s Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryMedia &&
          galleryMedia.map((item: GalleryMedia) => {
            if (!item.filename) return null;
            const imageUrl = `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/media/${encodeURIComponent(
              item.filename
            )}`;
            return (
              <div key={item.image_id} className="relative aspect-square">
                <Image
                  src={imageUrl}
                  alt={item.caption || ''}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
