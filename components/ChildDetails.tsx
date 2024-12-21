'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MessageCircle,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AcademicChart from './AcademicChart';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ImageGallery } from '@/components/ImageGallery';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

declare global {
  interface Window {
    Zeffy: any;
  }
}

interface DonationDistribution {
  id: number;
  donation_given_amount: number;
  distribution_type: string;
  donation_given_date: string;
  sponsee_name_id: number;
}

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
  joined_sponsorship_date?: string;
  gallery_id?: number;
  donations?: DonationDistribution[];
  totalDonations?: number;
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

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Preview Card
  if (!isExpanded) {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
            <img
              src={child?.profile_picture_url || '/placeholder-profile.jpg'}
              alt={`${child?.full_name}'s profile picture`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-profile.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{child?.full_name}</h2>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {child?.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4 mr-2" />
                {child?.education}
              </div>
            </div>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => setIsExpanded(true)}
            >
              View Details
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full Details View
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-4 top-4 bottom-4 md:inset-x-[10%] lg:inset-x-[15%] z-50 overflow-y-auto rounded-lg border bg-background shadow-lg">
        <div className="sticky top-0 z-20 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{child?.full_name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-full max-w-7xl mx-auto space-y-4 p-4">
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
                            '/placeholder-profile.jpg'
                          }
                          alt={`${child?.full_name}'s profile picture`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-profile.jpg';
                          }}
                        />
                      </div>
                      {child?.gallery_id && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" />
                              View Gallery
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-[90vw]">
                            <ImageGallery galleryId={child.gallery_id} />
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex items-center gap-3 text-gray-300">
                          <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                          <div>
                            <p className="text-sm text-gray-400">
                              Date of Birth
                            </p>
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
                            <p className="text-sm text-gray-400">
                              Joined Program
                            </p>
                            <p className="font-medium">
                              {formatDate(child?.joined_sponsorship_date)}
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

          {/* Donation Button */}
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
              onClick={() => setShowDonationModal(true)}
            >
              <Plus className="w-5 h-5" />
              Make a one-time donation
            </button>
          </div>

          {/* Donation Modal */}
          {showDonationModal && (
            <div
              className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-[9999] flex items-center justify-center p-4 cursor-pointer overflow-hidden"
              onClick={() => setShowDonationModal(false)}
              style={{
                position: 'fixed',
                minHeight: '100vh',
                minWidth: '100vw',
              }}
            >
              <div
                className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Make a one-time donation for {child?.full_name}
                  </h2>
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <iframe
                  title="Donation form powered by Zeffy"
                  src="https://www.zeffy.com/embed/donation-form/make-a-one-time-donation-for-your-sponsee"
                  className="w-full h-[600px]"
                />
              </div>
            </div>
          )}

          {/* Tabbed Content */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-6 gap-1 p-1">
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
              <TabsTrigger value="donations" className="gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="hidden sm:inline">Donations Received</span>
                <span className="sm:hidden">Donations</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2" disabled>
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Messages</span>
                <span className="text-xs text-blue-400">(Coming Soon)</span>
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

              <TabsContent value="donations">
                <Card className="dark:bg-gray-900 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-xl sm:text-2xl font-semibold text-blue-900 dark:text-blue-100">
                        Donations Received
                      </h2>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Total Donations
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${child?.totalDonations?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Distribution Type
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {child?.donations && child.donations.length > 0 ? (
                            child.donations.map((donation) => (
                              <TableRow key={donation.id}>
                                <TableCell>
                                  {formatDate(donation.donation_given_date)}
                                </TableCell>
                                <TableCell>
                                  ${donation.donation_given_amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell capitalize">
                                  {donation.distribution_type.replace(
                                    /_/g,
                                    ' '
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center py-4"
                              >
                                No donations recorded yet
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card className="dark:bg-gray-900 dark:border-gray-700">
                  <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-[300px]">
                    <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">
                      Messages Coming Soon
                    </h2>
                    <p className="text-gray-500 text-center">
                      Direct messaging with your sponsored child will be
                      available soon.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
