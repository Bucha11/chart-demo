import { parse } from 'csv-parse/sync';
import { DataRow } from '../types/data';

export function parseCsvBuffer(buffer: Buffer): DataRow[] {
  const text = buffer.toString('utf-8');

  let records: any[];
  try {
    records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (e) {
    throw new Error('Malformed CSV file');
  }

  return normalizeRecords(records);
}

export function parseJsonBuffer(buffer: Buffer): DataRow[] {
  let data: any;
  try {
    data = JSON.parse(buffer.toString('utf-8'));
  } catch {
    throw new Error('Malformed JSON file');
  }

  if (!Array.isArray(data)) {
    throw new Error('JSON root should be an array');
  }

  return normalizeRecords(data);
}

function normalizeRecords(records: any[]): DataRow[] {
  return records.map((raw) => {
    const row: DataRow = {};
    for (const [key, value] of Object.entries(raw)) {
      if (value === '' || value === null || value === undefined) {
        row[key] = null;
      } else if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
        row[key] = Number(value);
      } else {
        row[key] = value as string;
      }
    }
    return row;
  });
}
