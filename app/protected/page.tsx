'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';
import {
  RefreshCw,
  Users,
  DollarSign,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { Overview } from '@/components/statistics/overview';
import { DonationTrends } from '@/components/statistics/donation-trends';

interface Sponsor {
  first_name: string;
  last_name: string;
  email: string;
}

interface DonationWithSponsor {
  id: number;
  donation_amount: number;
  donation_date: string;
  sponsor_name_id: number;
  sponsors: Sponsor | null;
}

interface DashboardStats {
  totalSponsees: number;
  totalDonations: number;
  averageDonation: number;
  activeSponsors: number;
  recentDonations: Array<{
    id: number;
    donation_amount: number;
    donation_date: string;
    email: string;
    name: string;
  }>;
  upcomingBirthdays: Array<{
    id: number;
    full_name: string;
    date_of_birth: string;
  }>;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSponsees: 0,
    totalDonations: 0,
    averageDonation: 0,
    activeSponsors: 0,
    recentDonations: [],
    upcomingBirthdays: [],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Fetch total sponsees
      const { data: sponsees } = await supabase.from('sponsees').select('*');
      const totalSponsees = sponsees?.length || 0;

      // Fetch total sponsors count
      const { count: sponsorsCount } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact', head: true });

      const activeSponsors = sponsorsCount || 0;

      // Fetch donations data
      const { data: donations } = await supabase
        .from('donation_collection')
        .select('*')
        .order('donation_date', { ascending: false });

      const totalDonations =
        donations?.reduce(
          (sum, d) => sum + (Number(d.donation_amount) || 0),
          0
        ) || 0;
      const averageDonation = donations?.length
        ? totalDonations / donations.length
        : 0;

      // Fetch recent donations with sponsor details
      const { data: recentDonationsWithSponsors } = await supabase
        .from('donation_collection')
        .select(
          `
          id,
          donation_amount,
          donation_date,
          sponsor_name_id,
          sponsors (
            first_name,
            last_name,
            email
          )
        `
        )
        .order('donation_date', { ascending: false })
        .limit(5);

      const recentDonations = (
        (recentDonationsWithSponsors || []) as unknown as DonationWithSponsor[]
      ).map((donation) => ({
        id: donation.id,
        donation_amount: donation.donation_amount,
        donation_date: donation.donation_date,
        email: donation.sponsors?.email || 'Unknown',
        name: donation.sponsors
          ? `${donation.sponsors.first_name} ${donation.sponsors.last_name}`
          : 'Unknown Sponsor',
      }));

      // Fetch upcoming birthdays
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const { data: upcomingBirthdays } = await supabase
        .from('sponsees')
        .select('id, full_name, date_of_birth')
        .order('date_of_birth');

      // Filter birthdays in the next 30 days
      const filteredBirthdays = (upcomingBirthdays || [])
        .filter((sponsee) => {
          if (!sponsee.date_of_birth) return false;
          const birthday = new Date(sponsee.date_of_birth);
          const nextBirthday = new Date(
            today.getFullYear(),
            birthday.getMonth(),
            birthday.getDate()
          );
          if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
          }
          return nextBirthday <= thirtyDaysFromNow && nextBirthday >= today;
        })
        .slice(0, 5);

      setStats({
        totalSponsees,
        totalDonations,
        averageDonation,
        activeSponsors,
        recentDonations,
        upcomingBirthdays: filteredBirthdays,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sponsees
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSponsees}</div>
            <p className="text-xs text-muted-foreground">
              Active sponsees in the program
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalDonations.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total donations received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Average Donation
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageDonation.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average donation amount
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sponsors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSponsors}</div>
            <p className="text-xs text-muted-foreground">
              Current active sponsors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Trends - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Monthly donation patterns</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <DonationTrends />
        </CardContent>
      </Card>

      {/* Gender Distribution and Upcoming Birthdays */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              Distribution of sponsees by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Birthdays</CardTitle>
            <CardDescription>Birthdays in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingBirthdays.map((sponsee) => (
                <div
                  key={sponsee.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{sponsee.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sponsee.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
