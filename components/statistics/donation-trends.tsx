'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// This would be replaced with actual data from your database
const data = [
  { month: 'Jan', totalDonations: 4000, numberOfDonations: 120 },
  { month: 'Feb', totalDonations: 3000, numberOfDonations: 98 },
  { month: 'Mar', totalDonations: 6000, numberOfDonations: 150 },
  { month: 'Apr', totalDonations: 8000, numberOfDonations: 180 },
  { month: 'May', totalDonations: 5000, numberOfDonations: 135 },
  { month: 'Jun', totalDonations: 7000, numberOfDonations: 165 },
];

export function DonationTrends() {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            className="text-sm"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            className="text-sm"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            className="text-sm"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="totalDonations"
            stroke="#2563eb"
            strokeWidth={2}
            name="Total Donations ($)"
            dot={{ strokeWidth: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="numberOfDonations"
            stroke="#16a34a"
            strokeWidth={2}
            name="Number of Donations"
            dot={{ strokeWidth: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
