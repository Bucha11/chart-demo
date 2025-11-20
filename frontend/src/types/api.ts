export interface AnalysisSummaryEntry {
  count: number;
  avg: number;
  min: number;
  max: number;
}

export interface Analysis {
  summary: Record<string, AnalysisSummaryEntry>;
  groupBy: Record<string, number>;
  perDay: Record<string, number>;
}

export interface UploadResponse {
  cacheHit: boolean;
  uploadId: string;
  analysis: Analysis;
  rawPreview: any[];
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  rowsCount: number;
  createdAt: string;
}
