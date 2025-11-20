import { DataRow, AnalysisResult } from '../types/data';

export function analyzeData(rows: DataRow[]): AnalysisResult {
  const summary: AnalysisResult['summary'] = {};
  const groupBy: AnalysisResult['groupBy'] = {};
  const perDay: AnalysisResult['perDay'] = {};

  if (!rows.length) {
    return { summary, groupBy, perDay };
  }

  const keys = Object.keys(rows[0]);

  const numericKeys = keys.filter((k) => rows.some((r) => typeof r[k] === 'number'));

  for (const key of numericKeys) {
    const nums = rows
      .map((r) => (typeof r[key] === 'number' ? (r[key] as number) : NaN))
      .filter((n) => !Number.isNaN(n));

    if (!nums.length) continue;

    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    summary[key] = { count, avg: sum / count, min, max };
  }

  for (const row of rows) {
    const raw = row['category'] ?? 'Unknown';
    const label = String(raw);
    groupBy[label] = (groupBy[label] || 0) + 1;
  }

  for (const row of rows) {
    const ts = row['timestamp'];
    if (!ts) continue;
    const date = new Date(String(ts));
    if (Number.isNaN(date.getTime())) continue;
    const dayKey = date.toISOString().slice(0, 10);
    perDay[dayKey] = (perDay[dayKey] || 0) + 1;
  }

  return { summary, groupBy, perDay };
}
