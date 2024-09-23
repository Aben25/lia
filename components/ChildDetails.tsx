import React from 'react';
import { User, MapPin, Calendar, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChildDetailsProps {
  child: {
    id: string;
    'First Name': string;
    'Last Name': string;
    aspiration: string | null;
    bio: string;
    gender: string;
    location: string;
    bod: string;
    grade: string;
    profile: string;
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

  const age = child.bod ? getAge(child.bod) : null;

  const getInitials = (name: string) => name.charAt(0).toUpperCase();
  const fallbackInitials = `${getInitials(child['First Name'] || '')}${getInitials(child['Last Name'] || '')}`;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
          {child['First Name'] || ''} {child['Last Name'] || ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40">
              <AvatarImage
                src={child.profile}
                alt={`${child['First Name'] || ''} ${child['Last Name'] || ''}`}
              />
              <AvatarFallback>{fallbackInitials || 'N/A'}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <p className="text-sm text-gray-600 mb-2 text-center sm:text-left">
              {child.aspiration
                ? `Aspires to be a ${child.aspiration}`
                : 'Aspiration not provided'}
            </p>
            <p className="text-gray-700 text-sm mb-4 text-center sm:text-left">
              {child.bio || 'No bio available'}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {child.gender && (
                <Badge variant="secondary" className="flex items-center">
                  <User size={16} className="mr-1" /> {child.gender}
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
              {child.grade && (
                <Badge variant="secondary" className="flex items-center">
                  <BookOpen size={16} className="mr-1" /> Grade {child.grade}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
