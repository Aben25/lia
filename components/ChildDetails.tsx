'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  MapPin,
  User,
  GraduationCap,
  Plus,
  Star,
  Info,
  Heart,
  BookOpen,
  LineChart,
  Calendar,
  ImageIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AcademicChart from './AcademicChart';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Child {
  id?: number;
  full_name?: string;
  about?: string;
  location?: string;
  date_of_birth?: string;
  grade?: string;
  gender?: string;
  profile_picture_url?: string;
  aspiration?: string;
  education?: string;
  hobby?: string;
  how_sponsorship_will_help?: string;
  family?: string;
  joined_sponsorship_program?: string;
  gallery_id?: number;
}

function formatDate(dateString?: string) {
  if (!dateString) return 'Not available';
  try {
    // Remove the time portion if it exists
    const datePart = dateString.split('T')[0];
    return format(parseISO(datePart), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

export default function Component({ child }: { child?: Child } = {}) {
  const [academicData, setAcademicData] = useState<
    {
      month: string;
      English: number;
      Mathematics: number;
      Physics: number;
      Biology: number;
      Chemistry: number;
      Geography: number;
    }[]
  >([]);

  useEffect(() => {
    const data = Array.from({ length: 10 }, (_, i) => ({
      month: [
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
      ][i],
      English: 80 + Math.random() * 20,
      Mathematics: 75 + Math.random() * 20,
      Physics: 70 + Math.random() * 20,
      Biology: 65 + Math.random() * 25,
      Chemistry: 75 + Math.random() * 20,
      Geography: 70 + Math.random() * 20,
    }));
    setAcademicData(data);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 p-2 sm:p-4 md:p-8">
      {/* Header Section - Always visible */}
      <Card className="bg-[#1e1e2f] border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Image Section */}
                <div className="relative w-full lg:w-auto flex justify-center lg:block">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg overflow-hidden ring-4 ring-white/10">
                    <img
                      src={
                        child?.profile_picture_url ||
                        '/placeholder.svg?height=256&width=256'
                      }
                      alt={child?.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {child?.id && (
                    <Link
                      href={`/protected/your-child/gallery/${child.id}`}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                    >
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        View Gallery
                      </Button>
                    </Link>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 w-full">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center lg:text-left">
                    {child?.full_name}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400">Date of Birth</p>
                        <p className="font-medium">
                          {formatDate(child?.date_of_birth)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium">{child?.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <Star className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400">Joined Program</p>
                        <p className="font-medium">
                          {formatDate(child?.joined_sponsorship_program)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <GraduationCap className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400">Education</p>
                        <p className="font-medium">{child?.education}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-1 p-1">
          <TabsTrigger value="personal" className="gap-2">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Personal Details</span>
            <span className="sm:hidden">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">About</span>
            <span className="sm:hidden">About</span>
          </TabsTrigger>
          <TabsTrigger value="sponsorship" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Sponsorship Impact</span>
            <span className="sm:hidden">Impact</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2">
            <LineChart className="w-4 h-4" />
            <span className="hidden sm:inline">Academic Progress</span>
            <span className="sm:hidden">Academic</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="personal">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4 sm:mb-6">
                  Personal Details
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      Family
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {child?.family}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      Aspiration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {child?.aspiration}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                      Hobby
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {child?.hobby}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4 sm:mb-6">
                  About {child?.full_name?.split(' ')[0]}
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {child?.about}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sponsorship">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4 sm:mb-6">
                  How Sponsorship Will Help
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                  <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                    <p className="whitespace-pre-line leading-relaxed">
                      {child?.how_sponsorship_will_help}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="dark:bg-gray-900 dark:border-gray-700">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4 sm:mb-6">
                  Academic Performance
                </h2>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-blue-100 dark:border-gray-700">
                  <AcademicChart data={academicData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
