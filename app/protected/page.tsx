'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface StatisticsState {
  totalSponsors: number;
  totalChildren: number;
  totalDonations: number;
  averageDonation: number;
  sponsorshipsByCountry: Array<{ Country: string; count: number }>;
  donationsTrend: Array<{ month: string; amount: number }>;
  impactBreakdown: Array<{ category: string; value: number }>;
}

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

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const supabase = createClient();

        // Fetch total sponsors
        const { count: sponsorsCount, error: sponsorsError } = await supabase
          .from('Sponsors')
          .select('*', { count: 'exact', head: true });

        if (sponsorsError) throw sponsorsError;

        // Fetch total children
        const { count: childrenCount, error: childrenError } = await supabase
          .from('Sponsees')
          .select('*', { count: 'exact', head: true });

        if (childrenError) throw childrenError;

        // Fetch donations
        const { data: donations, error: donationsError } = await supabase
          .from('Sponsors')
          .select('Amount, "First payment date (America/New_York)"');

        if (donationsError) throw donationsError;

        const totalDonations = donations.reduce(
          (sum, donation) => sum + (donation.Amount || 0),
          0
        );
        const averageDonation =
          donations.length > 0 ? totalDonations / donations.length : 0;

        // Process donations trend
        const donationsTrend = donations.reduce<Record<string, number>>(
          (acc, donation) => {
            const date = new Date(
              donation['First payment date (America/New_York)']
            );
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            acc[key] = (acc[key] || 0) + (donation.Amount || 0);
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
          .from('Sponsors')
          .select('Country');

        if (countryError) throw countryError;

        const sponsorshipsByCountry = sponsorsByCountry.reduce<
          Record<string, number>
        >((acc, sponsor) => {
          acc[sponsor.Country] = (acc[sponsor.Country] || 0) + 1;
          return acc;
        }, {});

        const sponsorshipsByCountryArray = Object.entries(sponsorshipsByCountry)
          .map(([Country, count]) => ({ Country, count }))
          .sort((a, b) => b.count - a.count);

        // For impact breakdown, we'll use the distribution of sponsored children by grade
        const { data: sponseesGrades, error: gradesError } = await supabase
          .from('Sponsees')
          .select('grade');

        if (gradesError) throw gradesError;

        const impactBreakdown = sponseesGrades.reduce<Record<string, number>>(
          (acc, sponsee) => {
            acc[sponsee.grade] = (acc[sponsee.grade] || 0) + 1;
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

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Sponsors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-500">
              {stats.totalSponsors}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Children Sponsored</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-500">
              {stats.totalChildren}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">
              ${stats.totalDonations.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Donation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              ${stats.averageDonation.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Donations Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.donationsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis allowDecimals={false} domain={[0, 'auto']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Breakdown (by Grade)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.impactBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsorships by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.sponsorshipsByCountry}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Country"
                scale="band"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis allowDecimals={false} domain={[0, 'auto']} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllStatistics;
