import { useState } from 'react';
import { api } from '../api/client';
import { Analysis, UploadResponse, UploadHistoryItem } from '../types/api';

export function useDataAnalysis() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [rawPreview, setRawPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);

  async function uploadFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysis(response.data.analysis);
      setRawPreview(response.data.rawPreview);
      await fetchHistory();
    } catch (e: any) {
      setError(e.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function fetchHistory() {
    try {
      const resp = await api.get<{ uploads: UploadHistoryItem[] }>('/history');
      setHistory(resp.data.uploads);
    } catch (e) {
      console.error(e);
    }
  }

  return { analysis, rawPreview, loading, error, history, uploadFile, fetchHistory };
}
