import React from 'react';

export default function DataTable({ data }: { data: any[] }) {
  const [query, setQuery] = React.useState('');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [asc, setAsc] = React.useState(true);

  React.useEffect(() => {
    // reset search when data source changes
    setQuery('');
    setSortKey(null);
    setAsc(true);
  }, [data]);

  const q = query.trim().toLowerCase();
  const filtered = (data || []).filter((row) => {
    if (!q) return true;
    try {
      return JSON.stringify(row).toLowerCase().includes(q);
    } catch (e) {
      return false;
    }
  });

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va === vb) return 0;
      return (va > vb ? 1 : -1) * (asc ? 1 : -1);
    });
  }, [filtered, sortKey, asc]);

  const keys = data && data[0] ? Object.keys(data[0]) : [];

  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <table border={1} cellPadding={6} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k} onClick={() => { setSortKey(k); setAsc((s) => (sortKey === k ? !s : true)); }} style={{ cursor: 'pointer' }}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              {keys.map((k) => (
                <td key={k}>{String(row[k])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
