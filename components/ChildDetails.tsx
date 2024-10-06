import React from 'react';
import { User, MapPin, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ChildDetailsProps {
  child: {
    id: number;
    full_name: string;
    location: string;
    date_of_birth: string;
    academic_progress: string;
    milestones: string;
    contributions_used_for: string;
    Gender: string;
    profile_picture_id: number;
    gallery_id: number;
    profile_picture_filename: string;
    profile_picture_url: string; // Added this property
  };
}

export default function ChildDetails({ child }: ChildDetailsProps) {
  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = child.date_of_birth ? getAge(child.date_of_birth) : null;

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .join('');
  const fallbackInitials = getInitials(child.full_name);

  console.log('Child data in ChildDetails:', JSON.stringify(child, null, 2));

  const profileImageUrl =
    child.profile_picture_url ||
    (child.profile_picture_filename
      ? `https://ntckmekstkqxqgigqzgn.supabase.co/storage/v1/object/public/Media/${child.profile_picture_filename}`
      : null);

  console.log('Constructed Profile Image URL:', profileImageUrl);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
          {child.full_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} alt={child.full_name} />
              ) : (
                <AvatarFallback>{fallbackInitials || 'N/A'}</AvatarFallback>
              )}
            </Avatar>
            {/* Display debugging information */}
            <p className="mt-2 text-xs text-gray-500 break-all">
              Image URL: {profileImageUrl || 'Not available'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Filename: {child.profile_picture_filename || 'Not available'}
            </p>
            <Link href={`/protected/gallery/${child.gallery_id}`}>
              <Button variant="outline" className="mt-2">
                View Gallery
              </Button>
            </Link>
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <p className="text-sm text-gray-600 mb-2 text-center sm:text-left">
              {child.contributions_used_for ||
                'Contributions usage not specified'}
            </p>
            <p className="text-gray-700 text-sm mb-4 text-center sm:text-left">
              {child.milestones || 'No milestones available'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {child.Gender && (
                <Badge variant="secondary" className="flex items-center">
                  <User size={16} className="mr-1" /> {child.Gender}
                </Badge>
              )}
              {child.location && (
                <Badge variant="secondary" className="flex items-center">
                  <MapPin size={16} className="mr-1" /> {child.location}
                </Badge>
              )}
              {age !== null && (
                <Badge variant="secondary" className="flex items-center">
                  <Calendar size={16} className="mr-1" /> {age} years old
                </Badge>
              )}
              {child.academic_progress && (
                <Badge variant="secondary" className="flex items-center">
                  <BookOpen size={16} className="mr-1" />{' '}
                  {child.academic_progress}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
