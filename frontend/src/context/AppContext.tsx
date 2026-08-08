import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AppSettings, HistoryItem, PredictionResult, AudioFileInfo } from '../types';

// ─── Auth Types ────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  createdAt: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

// ─── Demo Account ──────────────────────────────────────────────────────
const DEMO_USER: StoredUser = {
  id: 'demo-001',
  name: 'Demo Analyst',
  email: 'demo@acousticspace.ai',
  password: 'AcousticSpace@Demo2026',
  role: 'analyst',
  createdAt: '2025-01-01T00:00:00.000Z',
};

const STORAGE_KEYS = {
  HISTORY: 'acousticspace_history',
  SETTINGS: 'acousticspace_settings',
  USER: 'acousticspace_user',
  USER_STORE: 'acousticspace_user_store',
} as const;

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
  // Auth
  currentUser: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };

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

// ─── Helpers ───────────────────────────────────────────────────────────
function getUserStore(): StoredUser[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STORE);
    const users: StoredUser[] = stored ? JSON.parse(stored) : [];
    // Always ensure demo user exists
    if (!users.find((u) => u.email === DEMO_USER.email)) {
      users.push(DEMO_USER);
      localStorage.setItem(STORAGE_KEYS.USER_STORE, JSON.stringify(users));
    }
    return users;
  } catch {
    return [DEMO_USER];
  }
}

function saveUserStore(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEYS.USER_STORE, JSON.stringify(users));
}

// ─── Provider ──────────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ── Auth state ──────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // ── History ─────────────────────────────────────────────────────────
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // ── Settings ─────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(null);
  const [currentFile, setCurrentFile] = useState<AudioFileInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [backendOnline, setBackendOnline] = useState(false);

  // ── Persistence ──────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  // ── Auth actions ─────────────────────────────────────────────────────
  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const users = getUserStore();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }
    const { password: _pw, ...safeUser } = user;
    setCurrentUser(safeUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const signup = useCallback((name: string, email: string, password: string): { success: boolean; error?: string } => {
    if (!name.trim()) return { success: false, error: 'Full name is required.' };
    if (!email.includes('@')) return { success: false, error: 'Enter a valid email address.' };
    if (password.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };

    const users = getUserStore();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'analyst',
      createdAt: new Date().toISOString(),
    };

    saveUserStore([...users, newUser]);
    const { password: _pw, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { success: true };
  }, []);

  // ── History actions ──────────────────────────────────────────────────
  const addToHistory = useCallback(
    (result: PredictionResult, fileInfo?: Partial<AudioFileInfo>) => {
      const item: HistoryItem = {
        id: `AS-${Date.now().toString(36).toUpperCase()}`,
        filename: result.filename,
        prediction: result.prediction,
        confidence: result.confidence,
        processing_time: result.processing_time,
        inference_time: result.inference_time,
        timestamp: result.timestamp || new Date().toISOString(),
        fileSize: fileInfo?.size,
        duration: fileInfo?.duration,
        sampleRate: fileInfo?.sampleRate,
        model_used: result.model_used || settings.modelVersion,
        features: result.features,
        breathing: result.breathing,
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
        currentUser,
        login,
        logout,
        signup,
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
