export type DataRow = Record<string, string | number | null>;

export interface AnalysisResult {
  summary: Record<string, {
    count: number;
    avg: number;
    min: number;
    max: number;
  }>;
  groupBy: Record<string, number>;
  perDay: Record<string, number>;
}
