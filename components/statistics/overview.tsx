'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

interface GenderCounts {
  [key: string]: number;
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626'];

export function Overview() {
  const [data, setData] = useState([
    { name: 'Male', value: 0 },
    { name: 'Female', value: 0 },
    { name: 'Other', value: 0 },
  ]);

  useEffect(() => {
    async function fetchGenderData() {
      const supabase = createClient();
      const { data: sponsees, error } = await supabase
        .from('sponsees')
        .select('gender');

      if (error) {
        console.error('Error fetching gender data:', error);
        return;
      }

      const genderCounts = sponsees.reduce<GenderCounts>((acc, { gender }) => {
        const key = gender || 'Other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      setData([
        { name: 'Male', value: genderCounts['male'] || 0 },
        { name: 'Female', value: genderCounts['female'] || 0 },
        { name: 'Other', value: genderCounts['Other'] || 0 },
      ]);
    }

    fetchGenderData();
  }, []);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
