import React from 'react';
import { Analysis } from '../types/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA55FF'];

export default function ChartsPanel({ analysis }: { analysis: Analysis }) {
  const perDayData = Object.entries(analysis.perDay).map(([date, value]) => ({ date, value }));
  const groupData = Object.entries(analysis.groupBy).map(([name, value]) => ({ name, value }));
  const summaryKey = Object.keys(analysis.summary)[0];
  const barData = summaryKey
    ? Object.entries(analysis.summary).map(([metric, v]) => ({ metric, avg: v.avg }))
    : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ height: 300 }}>
        <h3>Per Day</h3>
        <ResponsiveContainer>
          <LineChart data={perDayData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300 }}>
        <h3>Group By</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={groupData} dataKey="value" nameKey="name" label>
              {groupData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300, gridColumn: '1 / -1' }}>
        <h3>Summary (avg)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
