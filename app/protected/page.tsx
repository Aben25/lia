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

      console.log('Fetching statistics...');

      // Fetch total sponsors
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('*');

      if (sponsorsError) {
        console.error('Error fetching sponsors:', sponsorsError);
        throw sponsorsError;
      }

      const sponsorsCount = sponsorsData?.length || 0;

      // Fetch total children
      const { data: sponseesData, error: childrenError } = await supabase
        .from('sponsees')
        .select('*');

      if (childrenError) {
        console.error('Error fetching sponsees:', childrenError);
        throw childrenError;
      }

      const childrenCount = sponseesData?.length || 0;

      // Fetch donations
      const { data: donationsData, error: donationsError } = await supabase
        .from('donation_collection')
        .select('*')
        .order('donation_date', { ascending: false });

      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
        throw donationsError;
      }

      console.log('Donations data:', donationsData);

      const totalDonations =
        donationsData?.reduce(
          (sum, donation) => sum + (Number(donation.donation_amount) || 0),
          0
        ) || 0;

      const averageDonation =
        donationsData && donationsData.length > 0
          ? totalDonations / donationsData.length
          : 0;

      // Process donations trend
      const donationsTrend = (donationsData || []).reduce<
        Record<string, number>
      >((acc, donation) => {
        if (donation.donation_date) {
          const date = new Date(donation.donation_date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const key = `${month} ${year}`;
          acc[key] = (acc[key] || 0) + (Number(donation.donation_amount) || 0);
        }
        return acc;
      }, {});

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

      // Process sponsorships by country
      const sponsorshipsByCountry = (sponsorsData || []).reduce<
        Record<string, number>
      >((acc, sponsor) => {
        const country = sponsor.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {});

      const sponsorshipsByCountryArray = Object.entries(sponsorshipsByCountry)
        .map(([Country, count]) => ({ Country, count }))
        .sort((a, b) => b.count - a.count);

      // Process impact breakdown
      const impactBreakdown = (sponseesData || []).reduce<
        Record<string, number>
      >((acc, sponsee) => {
        const grade = sponsee.grade?.toString() || 'Unknown';
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {});

      const impactBreakdownArray = Object.entries(impactBreakdown)
        .map(([category, value]) => ({ category, value }))
        .sort((a, b) => b.value - a.value);

      console.log('Setting stats:', {
        totalSponsors: sponsorsCount,
        totalChildren: childrenCount,
        totalDonations,
        averageDonation,
        sponsorshipsByCountry: sponsorshipsByCountryArray,
        donationsTrend: donationsTrendArray,
        impactBreakdown: impactBreakdownArray,
      });

      setStats({
        totalSponsors: sponsorsCount,
        totalChildren: childrenCount,
        totalDonations,
        averageDonation,
        sponsorshipsByCountry: sponsorshipsByCountryArray,
        donationsTrend: donationsTrendArray,
        impactBreakdown: impactBreakdownArray,
      });
    } catch (err) {
      console.error('Error in fetchStatistics:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String(err.message)
            : 'An unknown error occurred';
      setError(`Failed to fetch statistics: ${errorMessage}`);
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
