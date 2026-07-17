import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Cpu, Wifi, WifiOff, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkHealth } from '../../services/api';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'System overview & analytics' },
  '/upload': { title: 'Audio Analysis', subtitle: 'Upload & analyze audio files' },
  '/results': { title: 'Analysis Results', subtitle: 'AI prediction & confidence report' },
  '/history': { title: 'Analysis History', subtitle: 'Past predictions & records' },
  '/statistics': { title: 'Model Statistics', subtitle: 'Performance metrics & charts' },
  '/settings': { title: 'Settings', subtitle: 'Configure system preferences' },
  '/about': { title: 'Help & About', subtitle: 'Documentation & project info' },
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { settings, backendOnline, setBackendOnline } = useApp();
  const [time, setTime] = useState(new Date());

  const pageInfo = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Health check polling
  useEffect(() => {
    const run = async () => {
      const ok = await checkHealth();
      setBackendOnline(ok);
    };
    run();
    const interval = setInterval(run, 30000);
    return () => clearInterval(interval);
  }, [settings.backendUrl, setBackendOnline]);

  return (
    <header
      className="fixed top-0 right-0 z-40 flex items-center justify-between px-6 py-4"
      style={{
        left: '256px',
        background: 'rgba(3, 7, 18, 0.9)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.1)',
        backdropFilter: 'blur(20px)',
        height: '72px',
      }}
    >
      {/* Page title */}
      <div>
        <h2 className="text-lg font-bold text-white leading-tight">{pageInfo.title}</h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Time */}
        <span
          className="text-sm hidden lg:block"
          style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          {time.toLocaleTimeString()}
        </span>

        {/* Backend Status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: backendOnline
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${backendOnline ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: backendOnline ? '#10b981' : '#ef4444',
          }}
        >
          {backendOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {backendOnline ? 'Backend Online' : 'Backend Offline'}
        </div>

        {/* GPU Status */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold hidden md:flex"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#8b5cf6',
          }}
        >
          <Cpu size={12} />
          GPU Ready
        </div>

        {/* Model version */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold hidden lg:flex"
          style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            color: 'var(--accent-cyan)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          <Shield size={12} />
          {settings.modelVersion || 'RIR-v1.0'}
        </div>

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(6,182,212,0.15)',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-radar-ping"
            style={{ background: 'var(--accent-cyan)' }}
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
