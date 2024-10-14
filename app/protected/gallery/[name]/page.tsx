import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function GalleryPage({ params }) {
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

  // Fetch gallery media records
  const { data: galleryMediaRecords, error } = await supabase
    .from('gallery_media')
    .select('image_id, video_id, caption')
    .eq('_parent_id', galleryId);

  if (error) {
    console.error('Error fetching gallery media:', error);
    return <div>Error loading gallery: {error.message}</div>;
  }

  if (!galleryMediaRecords || galleryMediaRecords.length === 0) {
    return <div>No images found in the gallery</div>;
  }

  // Collect all image_ids
  const imageIds = galleryMediaRecords
    .map((record) => record.image_id)
    .filter((id) => id !== null && id !== undefined);

  // Fetch media data for all image_ids
  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .select('id, filename')
    .in('id', imageIds);

  if (mediaError) {
    console.error('Error fetching media data:', mediaError);
    return <div>Error loading gallery: {mediaError.message}</div>;
  }

  const mediaMap = mediaData.reduce((acc, media) => {
    acc[media.id] = media.filename;
    return acc;
  }, {});

  // Attach filenames to gallery media records
  const galleryMedia = galleryMediaRecords.map((record) => {
    const filename = mediaMap[record.image_id];
    return {
      ...record,
      filename,
    };
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {galleryData.sponsee.full_name}'s Gallery
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryMedia.map((item) => {
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
