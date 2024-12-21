'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ImageGalleryProps {
  galleryId: number;
}

interface GalleryImage {
  id: string;
  caption: string | null;
  order: number;
  mediaId: number;
  filename: string;
  url: string;
}

interface GalleryMediaResponse {
  id: string;
  caption: string | null;
  _order: number;
  media_type: string;
  image_id: number;
  media: {
    id: number;
    filename: string;
  };
}

export function ImageGallery({ galleryId }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryImages() {
      const supabase = createClient();

      // Fetch gallery media
      const { data: galleryMedia, error: mediaError } = (await supabase
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
        .eq('_parent_id', galleryId)
        .order('_order')) as {
        data: GalleryMediaResponse[] | null;
        error: any;
      };

      if (mediaError) {
        console.error('Error loading gallery media:', mediaError);
        setLoading(false);
        return;
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
    }

    fetchGalleryImages();
  }, [galleryId]);

  const handlePrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) =>
      prev === null ? null : prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) =>
      prev === null ? null : prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading gallery...
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="text-center text-muted-foreground">
        No images in gallery
      </div>
    );
  }

  return (
    <div>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.url}
              alt={image.caption || `Gallery image ${index + 1}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Expand className="w-6 h-6 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Slideshow Dialog */}
      <Dialog
        open={selectedImage !== null}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 text-white/70 hover:text-white z-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 text-white/70 hover:text-white z-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Current image */}
            {selectedImage !== null && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <img
                  src={images[selectedImage].url}
                  alt={
                    images[selectedImage].caption ||
                    `Gallery image ${selectedImage + 1}`
                  }
                  className="max-w-full max-h-full object-contain"
                />
                {images[selectedImage].caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <p className="text-white text-lg font-medium">
                      {images[selectedImage].caption}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
              {selectedImage !== null &&
                `${selectedImage + 1} / ${images.length}`}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
