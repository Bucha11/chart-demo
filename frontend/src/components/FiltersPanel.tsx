import React from 'react';

interface Props {
  raw: any[];
  onChange: (rows: any[], opts: { groupField: string }) => void;
}

export default function FiltersPanel({ raw, onChange }: Props) {
  const [groupField, setGroupField] = React.useState<string>('category');
  const [minAmount, setMinAmount] = React.useState<string>('');
  const [maxAmount, setMaxAmount] = React.useState<string>('');
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  React.useEffect(() => {
    // apply filters on raw
    let rows = raw ?? [];

    if (fromDate) {
      const fromTs = new Date(fromDate).getTime();
      rows = rows.filter((r) => {
        const t = r.timestamp ? new Date(String(r.timestamp)).getTime() : NaN;
        return !isNaN(t) && t >= fromTs;
      });
    }

    if (toDate) {
      const toTs = new Date(toDate).getTime();
      rows = rows.filter((r) => {
        const t = r.timestamp ? new Date(String(r.timestamp)).getTime() : NaN;
        return !isNaN(t) && t <= toTs;
      });
    }

    if (minAmount !== '') {
      const m = Number(minAmount);
      rows = rows.filter((r) => typeof r.amount === 'number' ? r.amount >= m : !isNaN(Number(r.amount)) && Number(r.amount) >= m);
    }

    if (maxAmount !== '') {
      const m = Number(maxAmount);
      rows = rows.filter((r) => typeof r.amount === 'number' ? r.amount <= m : !isNaN(Number(r.amount)) && Number(r.amount) <= m);
    }

    // notify parent of filtered rows and current groupField
    onChange(rows, { groupField });
  }, [raw, fromDate, toDate, minAmount, maxAmount, groupField, onChange]);

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
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
