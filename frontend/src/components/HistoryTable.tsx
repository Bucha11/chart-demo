import React from 'react';
import { UploadHistoryItem } from '../types/api';

export default function HistoryTable({ items }: { items: UploadHistoryItem[] }) {
  return (
    <table border={1} cellPadding={6} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Filename</th>
          <th>Size</th>
          <th>Type</th>
          <th>Rows</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.id}>
            <td>{new Date(it.createdAt).toLocaleString()}</td>
            <td>{it.filename}</td>
            <td>{it.size}</td>
            <td>{it.mimeType}</td>
            <td>{it.rowsCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
