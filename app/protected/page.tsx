'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { createClient } from '@/utils/supabase/client';
import { RefreshCw } from 'lucide-react';

interface StatisticsState {
  totalSponsors: number;
  totalChildren: number;
  totalDonations: number;
  averageDonation: number;
  sponsorshipsByCountry: Array<{ Country: string; count: number }>;
  donationsTrend: Array<{ month: string; amount: number }>;
  impactBreakdown: Array<{ category: string; value: number }>;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF00FF',
  '#00FFFF',
  '#800080',
  '#008000',
];

const AllStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatisticsState>({
    totalSponsors: 0,
    totalChildren: 0,
    totalDonations: 0,
    averageDonation: 0,
    sponsorshipsByCountry: [],
    donationsTrend: [],
    impactBreakdown: [],
  });

  const fetchStatistics = async () => {
    try {
      const supabase = createClient();

      // Fetch total sponsors
      const { count: sponsorsCount, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact', head: true });

      if (sponsorsError) throw sponsorsError;

      // Fetch total children
      const { count: childrenCount, error: childrenError } = await supabase
        .from('sponsees')
        .select('*', { count: 'exact', head: true });

      if (childrenError) throw childrenError;

      // Fetch donations
      const { data: donations, error: donationsError } = await supabase
        .from('sponsors')
        .select('amount, first_payment_date');

      if (donationsError) throw donationsError;

      const totalDonations = donations.reduce(
        (sum, donation) => sum + (donation.amount || 0),
        0
      );
      const averageDonation =
        donations.length > 0 ? totalDonations / donations.length : 0;

      // Process donations trend
      const donationsTrend = donations.reduce<Record<string, number>>(
        (acc, donation) => {
          if (donation.first_payment_date) {
            const date = new Date(donation.first_payment_date);
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            acc[key] = (acc[key] || 0) + (donation.amount || 0);
          }
          return acc;
        },
        {}
      );

      const donationsTrendArray = Object.entries(donationsTrend)
        .map(([month, amount]) => {
          const [monthStr, yearStr] = month.split(' ');
          return {
            month,
            amount,
            date: new Date(
              parseInt(yearStr),
              new Date(`${monthStr} 1, 2000`).getMonth()
            ),
          };
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(({ month, amount }) => ({ month, amount }));

      // Fetch sponsorships by country
      const { data: sponsorsByCountry, error: countryError } = await supabase
        .from('sponsors')
        .select('country');

      if (countryError) throw countryError;

      const sponsorshipsByCountry = sponsorsByCountry.reduce<
        Record<string, number>
      >((acc, sponsor) => {
        if (sponsor.country) {
          acc[sponsor.country] = (acc[sponsor.country] || 0) + 1;
        }
        return acc;
      }, {});

      const sponsorshipsByCountryArray = Object.entries(sponsorshipsByCountry)
        .map(([Country, count]) => ({ Country, count }))
        .sort((a, b) => b.count - a.count);

      // For impact breakdown, we'll use the academic_progress field
      const { data: sponseesProgress, error: progressError } = await supabase
        .from('sponsees')
        .select('academic_progress');

      if (progressError) throw progressError;

      const impactBreakdown = sponseesProgress.reduce<Record<string, number>>(
        (acc, sponsee) => {
          if (sponsee.academic_progress) {
            acc[sponsee.academic_progress] =
              (acc[sponsee.academic_progress] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      const impactBreakdownArray = Object.entries(impactBreakdown)
        .map(([category, value]) => ({ category, value }))
        .sort((a, b) => b.value - a.value);

      setStats({
        totalSponsors: sponsorsCount || 0,
        totalChildren: childrenCount || 0,
        totalDonations,
        averageDonation,
        sponsorshipsByCountry: sponsorshipsByCountryArray,
        donationsTrend: donationsTrendArray,
        impactBreakdown: impactBreakdownArray,
      });
    } catch (err) {
      console.error('Error in fetchStatistics:', err);
      setError(
        `Failed to fetch statistics: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    color: string;
  }> = ({ title, value, color }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );

  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Statistics</h1>
        <Button onClick={fetchStatistics} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Total Sponsors"
                value={stats.totalSponsors}
                color="text-blue-500"
              />
              <StatCard
                title="Total Children Sponsored"
                value={stats.totalChildren}
                color="text-green-500"
              />
              <StatCard
                title="Total Donations"
                value={`$${stats.totalDonations.toFixed(2)}`}
                color="text-purple-500"
              />
              <StatCard
                title="Average Donation"
                value={`$${stats.averageDonation.toFixed(2)}`}
                color="text-orange-500"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sponsorships by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.sponsorshipsByCountry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Country" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Donations Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.donationsTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Impact Breakdown (by Grade)</CardTitle>
              </CardHeader>
              <CardContent className="w-full aspect-[2/1]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.impactBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={'80%'}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.impactBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AllStatistics;
