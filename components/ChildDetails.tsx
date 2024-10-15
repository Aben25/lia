import React from 'react';
import {
  User,
  MapPin,
  Calendar,
  BookOpen,
  Gift,
  School,
  Heart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface Child {
  id: number;
  full_name: string;
  location: string;
  date_of_birth: string;
  academic_progress: string;
  milestones: string;
  contributions_used_for: string;
  gender: string;
  profile_picture_id: number;
  gallery_id: number;
  bio: string;
  profile_picture_url?: string;
}

interface ChildDetailsProps {
  child: Child;
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

  const profileImageUrl =
    child.profile_picture_url || '/placeholder.svg?height=160&width=160';

  const academicProgressPercentage = () => {
    const progressMap: { [key: string]: number } = {
      'Pre-school': 20,
      Elementary: 40,
      'Middle School': 60,
      'High School': 80,
      College: 100,
    };
    return progressMap[child.academic_progress] || 0;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
          {child.full_name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {child.contributions_used_for || 'Contributions usage not specified'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-shrink-0">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-primary/10">
              <AvatarImage src={profileImageUrl} alt={child.full_name} />
              <AvatarFallback>{fallbackInitials || 'N/A'}</AvatarFallback>
            </Avatar>
            {Number.isInteger(child.gallery_id) && child.gallery_id > 0 && (
              <Link href={`/protected/gallery/${child.gallery_id}`} passHref>
                <Button variant="outline" className="mt-4 w-full">
                  View Gallery
                </Button>
              </Link>
            )}
          </div>
          <div className="flex-grow">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="bio">Bio</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoBadge icon={User} label="Gender" value={child.gender} />
                  <InfoBadge
                    icon={MapPin}
                    label="Location"
                    value={child.location}
                  />
                  <InfoBadge
                    icon={Calendar}
                    label="Age"
                    value={age !== null ? `${age} years old` : 'N/A'}
                  />
                  <InfoBadge
                    icon={School}
                    label="Education"
                    value={child.academic_progress}
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Academic Progress
                  </h4>
                  <Progress
                    value={academicProgressPercentage()}
                    className="w-full"
                  />
                </div>
              </TabsContent>
              <TabsContent value="bio" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {child.bio || 'No bio available'}
                </p>
              </TabsContent>
              <TabsContent value="milestones" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {child.milestones || 'No milestones available'}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="p-1.5">
        <Icon size={16} />
      </Badge>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
