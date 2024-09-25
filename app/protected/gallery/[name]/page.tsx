import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function GalleryPage() {
  const supabase = createClient();

  console.log('Fetching images from Worku folder...');

  // List all objects in the Worku folder
  const { data: objects, error } = await supabase
    .storage
    .from('profile')
    .list('Worku');

  if (error) {
    console.error('Error fetching images:', error);
    return <div>Error loading gallery: {error.message}</div>;
  }

  console.log('Fetched objects:', objects);

  if (!objects || objects.length === 0) {
    console.log('No images found in the gallery');
    return <div>No images found in the gallery</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Worku's Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {objects.map((object) => {
          console.log('Rendering image:', object.name);
          return (
            <div key={object.name} className="relative aspect-square">
              <Image
                src={`https://qkehakucnmertrgjgqrk.supabase.co/storage/v1/object/public/profile/Worku/${object.name}`}
                alt={object.name}
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
