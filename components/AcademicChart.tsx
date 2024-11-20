'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Props {
  data: Array<{
    month: string;
    English: number;
    Mathematics: number;
    Physics: number;
    Biology: number;
    Chemistry: number;
    Geography: number;
  }>;
}

export default function AcademicChart({ data }: Props) {
  const roundedData = data.map((item) => ({
    ...item,
    English: Math.round(item.English),
    Mathematics: Math.round(item.Mathematics),
    Physics: Math.round(item.Physics),
    Biology: Math.round(item.Biology),
    Chemistry: Math.round(item.Chemistry),
    Geography: Math.round(item.Geography),
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={roundedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[40, 100]} ticks={[40, 60, 80, 100]} />
          <Tooltip formatter={(value) => Math.round(Number(value))} />
          <Legend
            align="right"
            verticalAlign="bottom"
            layout="horizontal"
            wrapperStyle={{ marginTop: 20 }}
          />
          <Line
            type="linear"
            dataKey="English"
            stroke="#2196F3"
            name="English"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="Mathematics"
            stroke="#00BCD4"
            name="Mathematics"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="Physics"
            stroke="#FFC107"
            name="Physics"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="Biology"
            stroke="#673AB7"
            name="Biology"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="Chemistry"
            stroke="#F44336"
            name="Chemistry"
            strokeWidth={2}
          />
          <Line
            type="linear"
            dataKey="Geography"
            stroke="#424242"
            name="Geography"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
