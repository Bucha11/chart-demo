import { analyzeData } from '../src/services/analysisService';
import { DataRow } from '../src/types/data';

describe('analyzeData', () => {
  const rows: DataRow[] = [
    { category: 'A', amount: 10, timestamp: '2024-01-01T10:00:00Z' },
    { category: 'A', amount: 20, timestamp: '2024-01-01T11:00:00Z' },
    { category: 'B', amount: 30, timestamp: '2024-01-02T10:00:00Z' },
  ];

  it('calculates summary stats', () => {
    const result = analyzeData(rows);
    expect(result.summary.amount.count).toBe(3);
    expect(result.summary.amount.min).toBe(10);
    expect(result.summary.amount.max).toBe(30);
    expect(result.summary.amount.avg).toBeCloseTo(20);
  });

  it('groups by category', () => {
    const result = analyzeData(rows);
    expect(result.groupBy).toEqual({ A: 2, B: 1 });
  });

  it('aggregates per day', () => {
    const result = analyzeData(rows);
    expect(result.perDay['2024-01-01']).toBe(2);
    expect(result.perDay['2024-01-02']).toBe(1);
  });

  it('handles empty input', () => {
    const result = analyzeData([]);
    expect(result.summary).toEqual({});
    expect(result.groupBy).toEqual({});
    expect(result.perDay).toEqual({});
  });
});
