'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// This would be replaced with actual data from your database
const data = [
  {
    range: '0-50',
    count: 120,
  },
  {
    range: '51-100',
    count: 80,
  },
  {
    range: '101-200',
    count: 40,
  },
  {
    range: '201-500',
    count: 20,
  },
  {
    range: '500+',
    count: 10,
  },
];

export function DonationSummary() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="range"
            className="text-sm"
            label={{
              value: 'Donation Amount ($)',
              position: 'insideBottom',
              offset: -5,
            }}
          />
          <YAxis
            className="text-sm"
            label={{
              value: 'Number of Donations',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#2563eb"
            name="Number of Donations"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
