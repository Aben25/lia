'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Overview } from '@/components/statistics/overview';
import { DonationTrends } from '@/components/statistics/donation-trends';
import { SponseeDistribution } from '@/components/statistics/sponsee-distribution';
import { DonationSummary } from '@/components/statistics/donation-summary';

export default function StatisticsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Statistics Dashboard
        </h2>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sponsees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">
              +180 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$128,724</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54.89</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sponsors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,823</div>
            <p className="text-xs text-muted-foreground">+43 this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Donation Trends and Sponsee Distribution */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>
              Monthly donation patterns and growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DonationTrends />
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Sponsee Distribution</CardTitle>
            <CardDescription>Distribution by education level</CardDescription>
          </CardHeader>
          <CardContent>
            <SponseeDistribution />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Breakdown of sponsees by gender</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Overview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Donation Summary</CardTitle>
            <CardDescription>
              Recent donation statistics and patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <DonationSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
