'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { RefreshCw } from 'lucide-react';

interface DonationStats {
  totalDonations: number;
  monthlyDonations: number;
  donationCount: number;
  averageDonation: number;
  recentDonations: Array<{
    donation_amount: number;
    description: string;
    donation_date: string;
  }>;
  donationsByMonth: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  donationDistribution: Array<{
    range: string;
    count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function MyContributions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    monthlyDonations: 0,
    donationCount: 0,
    averageDonation: 0,
    recentDonations: [],
    donationsByMonth: [],
    donationDistribution: [],
  });

  const fetchDonationStats = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get user's email
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user?.email) {
        throw new Error('User email not found');
      }

      // Fetch all donations for the user
      const { data: donations, error: donationsError } = await supabase
        .from('donation_collection')
        .select('*')
        .eq('email', user.email)
        .order('donation_date', { ascending: false });

      if (donationsError) throw donationsError;

      // Calculate total donations
      const totalDonations = donations.reduce(
        (sum, donation) => sum + (donation.donation_amount || 0),
        0
      );

      // Calculate monthly donations (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyDonations = donations
        .filter((donation) => {
          const donationDate = new Date(donation.donation_date);
          return (
            donationDate.getMonth() === currentMonth &&
            donationDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, donation) => sum + (donation.donation_amount || 0), 0);

      // Calculate average donation
      const averageDonation =
        donations.length > 0 ? totalDonations / donations.length : 0;

      // Get recent donations
      const recentDonations = donations.slice(0, 5).map((donation) => ({
        donation_amount: donation.donation_amount,
        description: donation.description,
        donation_date: new Date(donation.donation_date).toLocaleDateString(),
      }));

      // Calculate donations by month
      const donationsByMonth = donations.reduce<
        Record<string, { amount: number; count: number }>
      >((acc, donation) => {
        const date = new Date(donation.donation_date);
        const monthKey = date.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });

        if (!acc[monthKey]) {
          acc[monthKey] = { amount: 0, count: 0 };
        }

        acc[monthKey].amount += donation.donation_amount || 0;
        acc[monthKey].count += 1;

        return acc;
      }, {});

      // Convert to array and sort by date
      const donationsByMonthArray = Object.entries(donationsByMonth)
        .map(([month, stats]) => ({
          month,
          amount: stats.amount,
          count: stats.count,
        }))
        .sort((a, b) => {
          const [aMonth, aYear] = a.month.split(' ');
          const [bMonth, bYear] = b.month.split(' ');
          return (
            new Date(`${aMonth} 1, ${aYear}`).getTime() -
            new Date(`${bMonth} 1, ${bYear}`).getTime()
          );
        });

      // Calculate donation distribution
      const ranges = [
        { min: 0, max: 20, label: '$0-20' },
        { min: 20, max: 50, label: '$20-50' },
        { min: 50, max: 100, label: '$50-100' },
        { min: 100, max: Infinity, label: '$100+' },
      ];

      const donationDistribution = ranges.map((range) => ({
        range: range.label,
        count: donations.filter(
          (d) => d.donation_amount > range.min && d.donation_amount <= range.max
        ).length,
      }));

      setStats({
        totalDonations,
        monthlyDonations,
        donationCount: donations.length,
        averageDonation,
        recentDonations,
        donationsByMonth: donationsByMonthArray,
        donationDistribution,
      });
    } catch (err) {
      console.error('Error fetching donation stats:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch donation statistics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonationStats();
  }, []);

  const StatCard = ({
    title,
    value,
    description,
  }: {
    title: string;
    value: string | number;
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-red-500 p-4">Error: {error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Contributions</h1>
        <Button onClick={fetchDonationStats}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Contributions"
          value={`$${stats.totalDonations.toFixed(2)}`}
          description="Lifetime total"
        />
        <StatCard
          title="Monthly Contributions"
          value={`$${stats.monthlyDonations.toFixed(2)}`}
          description="Current month"
        />
        <StatCard
          title="Number of Donations"
          value={stats.donationCount}
          description="Total donations made"
        />
        <StatCard
          title="Average Donation"
          value={`$${stats.averageDonation.toFixed(2)}`}
          description="Per donation"
        />
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Donation Trends</TabsTrigger>
          <TabsTrigger value="recent">Recent Donations</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Donation Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.donationsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    name="Amount ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    stroke="#82ca9d"
                    name="Number of Donations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentDonations.map((donation, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{donation.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.donation_date}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${donation.donation_amount.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Donation Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.donationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ range, count, percent }) =>
                      `${range}: ${count} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {stats.donationDistribution.map((entry, index) => (
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
    </div>
  );
}
