// ─── Type Definitions for AcousticSpace ────────────────────────────────

export type Prediction = 'REAL HUMAN VOICE' | 'DEEPFAKE VOICE';

export interface AcousticFeatures {
  waveform?: string;
  mel?: string;
  mfcc?: string;
  spectrogram?: string;
  chroma?: string;
  spectral_contrast?: string;
  rir?: string;
}
export interface BreathingAnalysis {
  breath_score: number;
  breathing_status: string;
}

export interface PredictionResult {
  filename: string;
  prediction: Prediction;
  confidence: number;
  processing_time: string;
  timestamp?: string;
  model_used?: string;
  inference_time?: string;

  breathing?: {
    breath_score: number;
    breathing_status: string;
    analysis: string;

    details?: {
      rms_variation: number;
      zero_crossing_rate: number;
      spectral_variation: number;
      silence_ratio: number;
    };
  };

  features?: AcousticFeatures;
}

export interface HistoryItem {
  id: string;
  filename: string;
  prediction: Prediction;
  confidence: number;
  processing_time: string;
  inference_time?: string;
  timestamp: string;
  fileSize?: string;
  duration?: string;
  sampleRate?: string;
  model_used?: string;
  features?: AcousticFeatures;
  breathing?: {
    breath_score: number;
    breathing_status: string;
    analysis: string;
    details?: {
      rms_variation: number;
      zero_crossing_rate: number;
      spectral_variation: number;
      silence_ratio: number;
    };
  };
}

export interface AudioFileInfo {
  file: File;
  name: string;
  size: string;
  duration?: string;
  sampleRate?: string;
  format: string;
  url: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  backendUrl: string;
  modelVersion: string;
  inferenceThreshold: number;
  audioSampleRate: number;
}

export interface SystemStats {
  totalFiles: number;
  deepfakesDetected: number;
  humanVoices: number;
  averageConfidence: number;
  averageProcessingTime: string;
  systemStatus: 'online' | 'offline' | 'degraded';
  gpuStatus: 'available' | 'busy' | 'unavailable';
  modelVersion: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}
