import React from 'react';

export default function FiltersPanel({ raw }: { raw: any[] }) {
  const [groupField, setGroupField] = React.useState('category');
  const [minAmount, setMinAmount] = React.useState<string>('');
  const [maxAmount, setMaxAmount] = React.useState<string>('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <label>
        Group by:
        <select value={groupField} onChange={(e) => setGroupField(e.target.value)}>
          <option value="category">category</option>
          <option value="region">region</option>
        </select>
      </label>

      <label>
        From:
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </label>

      <label>
        To:
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </label>

      <label>
        Min amount:
        <input type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
      </label>

      <label>
        Max amount:
        <input type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
      </label>
    </div>
  );
}
