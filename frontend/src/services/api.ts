import axios from 'axios';
import type { PredictionResult } from '../types';

// ─── Axios Instance ────────────────────────────────────────────────────
const getBaseURL = () => {
  try {
    const stored = localStorage.getItem('acousticspace_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      return settings.backendUrl || 'http://localhost:8000';
    }
  } catch {
    // ignore
  }
  return 'http://localhost:8000';
};

export const createApiClient = () =>
  axios.create({
    baseURL: getBaseURL(),
    timeout: 120000,
  });

// ─── Analyze Audio ─────────────────────────────────────────────────────
export const analyzeAudio = async (
  file: File,
  onUploadProgress?: (progress: number) => void
): Promise<PredictionResult> => {
  const client = createApiClient();

  const formData = new FormData();
  formData.append('file', file);

  const response = await client.post<PredictionResult>('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onUploadProgress(percent);
      }
    },
  });

  return response.data;
};

// ─── Health Check ──────────────────────────────────────────────────────
export const checkHealth = async (): Promise<boolean> => {
  try {
    const client = createApiClient();
    await client.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};
