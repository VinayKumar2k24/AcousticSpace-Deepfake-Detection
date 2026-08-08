import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import Navbar from './components/Navbar/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';

/* ── Public pages ───────────────────────────────────────────────────────── */
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const Login       = React.lazy(() => import('./pages/Login'));
const Signup      = React.lazy(() => import('./pages/Signup'));

/* ── Protected pages ────────────────────────────────────────────────────── */
const Dashboard  = React.lazy(() => import('./pages/Dashboard'));
const Upload     = React.lazy(() => import('./pages/Upload'));
const Results    = React.lazy(() => import('./pages/Results'));
const History    = React.lazy(() => import('./pages/History'));
const Statistics = React.lazy(() => import('./pages/Statistics'));
const Settings   = React.lazy(() => import('./pages/Settings'));
const About      = React.lazy(() => import('./pages/About'));

/* ── Page loader ────────────────────────────────────────────────────────── */
const PageLoader: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      flexDirection: 'column',
      gap: '20px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '36px' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="wave-bar" />
      ))}
    </div>
    <p style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
      LOADING MODULE...
    </p>
  </div>
);

/* ── Public layout (no sidebar/navbar) ──────────────────────────────────── */
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

/* ── Protected app shell ────────────────────────────────────────────────── */
const AppLayout: React.FC = () => (
  <ProtectedRoute>
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--surface-0)',
      }}
    >
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 'var(--sidebar-width)',
          minWidth: 0,
        }}
      >
        {/* Fixed Navbar */}
        <Navbar />

        {/* Scrollable page content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            marginTop: 'var(--navbar-height)',
            padding: '24px 24px 32px',
            background: 'var(--surface-0)',
            position: 'relative',
          }}
        >
          {/* Forensic micro-grid background */}
          <div
            className="bg-grid"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              marginLeft: 'var(--sidebar-width)',
              marginTop: 'var(--navbar-height)',
            }}
          />

          {/* Ambient radial glow — very subtle */}
          <div
            style={{
              position: 'fixed',
              top: 'var(--navbar-height)',
              left: 'var(--sidebar-width)',
              right: 0,
              height: '50vh',
              background: 'radial-gradient(ellipse 70% 45% at 60% 0%, rgba(6,182,212,0.04) 0%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Route content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto' }}>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/dashboard"        element={<Dashboard />} />
                  <Route path="/audio-analysis"   element={<Upload />} />
                  <Route path="/results"          element={<Results />} />
                  <Route path="/analysis-history" element={<History />} />
                  <Route path="/statistics"       element={<Statistics />} />
                  <Route path="/settings"         element={<Settings />} />
                  <Route path="/about"            element={<About />} />
                  {/* Legacy path redirects */}
                  <Route path="/upload"   element={<Navigate to="/audio-analysis"   replace />} />
                  <Route path="/history"  element={<Navigate to="/analysis-history" replace />} />
                  {/* Default */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  </ProtectedRoute>
);

/* ── Root App ───────────────────────────────────────────────────────────── */
const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/login"  element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

        {/* Protected app routes */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;
