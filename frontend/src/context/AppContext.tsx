import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AppSettings, HistoryItem, PredictionResult, AudioFileInfo } from '../types';

// ─── Default Settings ──────────────────────────────────────────────────
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  backendUrl: 'http://localhost:8000',
  modelVersion: 'v1.0',
  inferenceThreshold: 0.5,
  audioSampleRate: 16000,
};

// ─── Context Shape ─────────────────────────────────────────────────────
interface AppContextValue {
  // History
  history: HistoryItem[];
  addToHistory: (result: PredictionResult, fileInfo?: Partial<AudioFileInfo>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;

  // Current analysis
  currentResult: PredictionResult | null;
  setCurrentResult: (result: PredictionResult | null) => void;
  currentFile: AudioFileInfo | null;
  setCurrentFile: (file: AudioFileInfo | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (v: number) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // System
  backendOnline: boolean;
  setBackendOnline: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('acousticspace_history');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('acousticspace_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [currentFile, setCurrentFile] = useState<AudioFileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backendOnline, setBackendOnline] = useState(false);

  // Persist history
  useEffect(() => {
    localStorage.setItem('acousticspace_history', JSON.stringify(history));
  }, [history]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('acousticspace_settings', JSON.stringify(settings));
  }, [settings]);

  const addToHistory = useCallback(
    (result: PredictionResult, fileInfo?: Partial<AudioFileInfo>) => {
      const item: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        filename: result.filename,
        prediction: result.prediction,
        confidence: result.confidence,
        processing_time: result.processing_time,
        timestamp: result.timestamp || new Date().toISOString(),
        fileSize: fileInfo?.size,
        duration: fileInfo?.duration,
        sampleRate: fileInfo?.sampleRate,
        model_used: result.model_used || settings.modelVersion,
        features: result.features,
      };
      setHistory((prev) => [item, ...prev].slice(0, 500));
    },
    [settings.modelVersion]
  );

  const clearHistory = useCallback(() => setHistory([]), []);

  const removeFromHistory = useCallback(
    (id: string) => setHistory((prev) => prev.filter((h) => h.id !== id)),
    []
  );

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        removeFromHistory,
        currentResult,
        setCurrentResult,
        currentFile,
        setCurrentFile,
        isAnalyzing,
        setIsAnalyzing,
        uploadProgress,
        setUploadProgress,
        settings,
        updateSettings,
        backendOnline,
        setBackendOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
