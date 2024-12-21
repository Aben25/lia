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

const data = [
  {
    name: 'Q1',
    revenue: 4000,
    users: 2400,
    projects: 2400,
  },
  {
    name: 'Q2',
    revenue: 3000,
    users: 1398,
    projects: 2210,
  },
  {
    name: 'Q3',
    revenue: 2000,
    users: 9800,
    projects: 2290,
  },
  {
    name: 'Q4',
    revenue: 2780,
    users: 3908,
    projects: 2000,
  },
];

export function Analytics() {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#2563eb" />
          <Bar dataKey="users" fill="#16a34a" />
          <Bar dataKey="projects" fill="#dc2626" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
