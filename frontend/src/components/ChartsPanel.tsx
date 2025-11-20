import React from 'react';
import { Analysis } from '../types/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA55FF'];

function downloadJSON(obj: any, filename = 'analysis.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSVFromSummary(summary: Analysis['summary'], filename = 'summary.csv') {
  const header = ['metric', 'count', 'avg', 'min', 'max'];
  const rows = Object.entries(summary).map(([metric, v]) => [metric, String(v.count), String(v.avg), String(v.min), String(v.max)]);
  const csv = [header.join(','), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChartsPanel({ analysis, data }: { analysis: Analysis; data: any[] }) {
  const perDayData = Object.entries(analysis.perDay).map(([date, value]) => ({ date, value }));
  const groupData = Object.entries(analysis.groupBy).map(([name, value]) => ({ name, value }));
  const summaryKey = Object.keys(analysis.summary)[0];
  const barData = summaryKey
    ? Object.entries(analysis.summary).map(([metric, v]) => ({ metric, avg: v.avg }))
    : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={() => downloadJSON(analysis, 'analysis.json')}>Download JSON</button>
        <button onClick={() => downloadCSVFromSummary(analysis.summary, 'summary.csv')}>Download CSV</button>
      </div>
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
