import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';

// Lazy page imports
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Upload = React.lazy(() => import('./pages/Upload'));
const Results = React.lazy(() => import('./pages/Results'));
const History = React.lazy(() => import('./pages/History'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Settings = React.lazy(() => import('./pages/Settings'));
const About = React.lazy(() => import('./pages/About'));

// Page loading fallback
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full min-h-64">
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-1.5 h-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="wave-bar" />
        ))}
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  </div>
);

const AppLayout: React.FC = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 flex flex-col" style={{ marginLeft: '256px' }}>
      <Navbar />

      <main
        className="flex-1 overflow-y-auto"
        style={{
          marginTop: '72px',
          padding: '28px 28px',
          background: 'var(--bg-primary)',
        }}
      >
        {/* Background grid overlay */}
        <div className="fixed inset-0 bg-grid pointer-events-none" style={{ zIndex: 0, marginLeft: '256px', marginTop: '72px' }} />

        <div className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<History />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </div>
      </main>
    </div>
  </div>
);

const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </AppProvider>
);

export default App;
