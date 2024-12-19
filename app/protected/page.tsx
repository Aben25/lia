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
  genderDistribution: Array<{ gender: string; count: number }>;
  ageDistribution: Array<{ ageGroup: string; count: number }>;
  locationDistribution: Array<{ location: string; count: number }>;
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
    genderDistribution: [],
    ageDistribution: [],
    locationDistribution: [],
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
      const { data: sponseesData, error: sponseesError } = await supabase
        .from('sponsees')
        .select('*');

      if (sponseesError) {
        console.error('Error fetching sponsees:', sponseesError);
        throw sponseesError;
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

      // Process gender distribution
      const genderCounts = (sponseesData || []).reduce<Record<string, number>>(
        (acc, sponsee) => {
          const gender = sponsee.gender || 'Unknown';
          acc[gender] = (acc[gender] || 0) + 1;
          return acc;
        },
        {}
      );

      const genderDistribution = Object.entries(genderCounts).map(
        ([gender, count]) => ({
          gender,
          count,
        })
      );

      // Process age distribution
      const ageGroups = (sponseesData || []).reduce<Record<string, number>>(
        (acc, sponsee) => {
          if (sponsee.date_of_birth) {
            const age =
              new Date().getFullYear() -
              new Date(sponsee.date_of_birth).getFullYear();
            const ageGroup =
              age < 5
                ? '0-4'
                : age < 10
                  ? '5-9'
                  : age < 15
                    ? '10-14'
                    : age < 20
                      ? '15-19'
                      : '20+';
            acc[ageGroup] = (acc[ageGroup] || 0) + 1;
          }
          return acc;
        },
        {}
      );

      const ageDistribution = Object.entries(ageGroups)
        .map(([ageGroup, count]) => ({
          ageGroup,
          count,
        }))
        .sort((a, b) => {
          const aStart = parseInt(a.ageGroup.split('-')[0]);
          const bStart = parseInt(b.ageGroup.split('-')[0]);
          return aStart - bStart;
        });

      // Process location distribution
      const locationCounts = (sponseesData || []).reduce<
        Record<string, number>
      >((acc, sponsee) => {
        const location = sponsee.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});

      const locationDistribution = Object.entries(locationCounts)
        .map(([location, count]) => ({
          location,
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 locations

      console.log('Setting stats:', {
        totalSponsors: sponsorsCount,
        totalChildren: childrenCount,
        totalDonations,
        averageDonation,
        sponsorshipsByCountry: sponsorshipsByCountryArray,
        donationsTrend: donationsTrendArray,
        impactBreakdown: impactBreakdownArray,
        genderDistribution,
        ageDistribution,
        locationDistribution,
      });

      setStats({
        totalSponsors: sponsorsCount,
        totalChildren: childrenCount,
        totalDonations,
        averageDonation,
        sponsorshipsByCountry: sponsorshipsByCountryArray,
        donationsTrend: donationsTrendArray,
        impactBreakdown: impactBreakdownArray,
        genderDistribution,
        ageDistribution,
        locationDistribution,
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
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Sponsors
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-blue-500">
                    {stats.totalSponsors}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active sponsors supporting children
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Children Sponsored
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-green-500">
                    {stats.totalChildren}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total children receiving support
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Donations
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-purple-500">
                    ${stats.totalDonations.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cumulative donations received
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Monthly Donation
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="text-3xl font-bold text-orange-500">
                    ${stats.averageDonation.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per sponsor monthly contribution
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Donations Trend */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Donations by Month</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly donation amounts over time
                </p>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.donationsTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="amount"
                      name="Amount"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations" className="space-y-4">
            {/* Sponsorships by Country */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Sponsorships by Country</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution of sponsors across different countries
                </p>
              </CardHeader>
              <CardContent className="px-0">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.sponsorshipsByCountry}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="Country"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      name="Sponsors"
                      fill="#4361ee"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender Distribution */}
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.genderDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="gender"
                      >
                        {stats.genderDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index === 0 ? '#4361ee' : '#00C49F'}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="middle"
                        align="left"
                        layout="vertical"
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Age Distribution */}
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Age Distribution</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.ageDistribution} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="ageGroup"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis axisLine={false} tickLine={false} />
                      <Bar
                        dataKey="count"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Grade Level Distribution */}
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Grade Level Distribution</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.impactBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="category"
                      >
                        {stats.impactBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="circle"
                        formatter={(value) => `Grade ${value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Location Distribution */}
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Top Locations</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Distribution of children across different regions
                  </p>
                </CardHeader>
                <CardContent className="px-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.locationDistribution}
                      layout="vertical"
                      barSize={20}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis
                        dataKey="location"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        width={150}
                      />
                      <Bar
                        dataKey="count"
                        fill="#8884d8"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AllStatistics;
