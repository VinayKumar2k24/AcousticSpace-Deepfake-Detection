import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Wifi, WifiOff, Shield, Clock, ChevronDown,
  LogOut, User, Settings, Bell, Cpu, Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { checkHealth } from '../../services/api';

/* ── Page metadata ────────────────────────────────────────────────────── */
const PAGE_META: Record<string, { title: string; subtitle: string; tag: string }> = {
  '/dashboard':        { title: 'Command Center',      subtitle: 'System overview & analytics',             tag: 'OVERVIEW'   },
  '/audio-analysis':   { title: 'Audio Analyzer',      subtitle: 'Upload & run forensic analysis',          tag: 'ANALYSIS'   },
  '/results':          { title: 'Forensic Results',    subtitle: 'AI prediction & evidence report',         tag: 'RESULTS'    },
  '/analysis-history': { title: 'Analysis History',    subtitle: 'Complete forensic audit log',             tag: 'HISTORY'    },
  '/statistics':       { title: 'Model Insights',      subtitle: 'Performance metrics & model analytics',   tag: 'INSIGHTS'   },
  '/settings':         { title: 'System Settings',     subtitle: 'Configure inference & system parameters', tag: 'CONFIG'     },
  '/about':            { title: 'Help & About',         subtitle: 'Documentation & architecture reference',  tag: 'DOCS'       },
};

/* ── Helpers ────────────────────────────────────────────────────────────── */
const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const formatTime = (d: Date) =>
  d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/* ── Component ─────────────────────────────────────────────────────────── */
const Navbar: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { settings, backendOnline, setBackendOnline, currentUser, logout } = useApp();

  const [time, setTime]           = useState(new Date());
  const [userOpen, setUserOpen]   = useState(false);
  const [pingMs, setPingMs]       = useState<number | null>(null);
  const menuRef                   = useRef<HTMLDivElement>(null);

  const pageMeta = PAGE_META[location.pathname] ?? {
    title:    'AcousticSpace',
    subtitle: 'AI Audio Forensics Platform',
    tag:      'APP',
  };

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Health check with latency measurement */
  useEffect(() => {
    const run = async () => {
      const start = performance.now();
      try {
        const client = (await import('../../services/api')).createApiClient();
        await client.get('/health', { timeout: 5000 });
        setPingMs(Math.round(performance.now() - start));
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
        setPingMs(null);
      }
    };
    run();
    const interval = setInterval(run, 30000);
    return () => clearInterval(interval);
  }, [settings.backendUrl, setBackendOnline]);

  /* Close user menu on outside click */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    if (userOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userOpen]);

  const handleLogout = () => {
    setUserOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 'var(--sidebar-width)',
        height: 'var(--navbar-height)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px 0 22px',
        background: 'rgba(2,8,24,0.88)',
        borderBottom: '1px solid rgba(6,182,212,0.09)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Left: Page Identity ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {/* Route tag */}
        <div
          style={{
            padding: '3px 8px',
            borderRadius: '5px',
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.16)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: 'var(--cyan-500)',
            flexShrink: 0,
          }}
        >
          {pageMeta.tag}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

        {/* Page title */}
        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
            >
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {pageMeta.title}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1, marginTop: '2px' }}>
                {pageMeta.subtitle}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right: Telemetry Rail ───────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

        {/* Live clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
          className="hidden lg:flex"
        >
          <Clock size={11} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
            {formatTime(time)}
          </span>
        </div>

        {/* Backend status */}
        <div
          className="status-pill"
          style={{
            background: backendOnline ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${backendOnline ? 'rgba(16,185,129,0.20)' : 'rgba(239,68,68,0.20)'}`,
            color: backendOnline ? '#10b981' : '#ef4444',
          }}
        >
          {backendOnline
            ? <Wifi size={10} strokeWidth={2.5} />
            : <WifiOff size={10} strokeWidth={2.5} />
          }
          <span>
            {backendOnline ? 'API Online' : 'API Offline'}
            {pingMs !== null && backendOnline && (
              <span style={{ opacity: 0.65, marginLeft: '4px' }}>{pingMs}ms</span>
            )}
          </span>
        </div>

        {/* GPU / Model chip */}
        <div
          className="telem-tag hidden md:inline-flex"
          style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)', color: 'var(--purple-500)' }}
        >
          <Cpu size={10} strokeWidth={2.5} />
          GPU
        </div>

        {/* Model version */}
        <div className="telem-tag hidden lg:inline-flex">
          <Shield size={10} strokeWidth={2.5} />
          AASIST {settings.modelVersion || 'v1.0'}
        </div>

        {/* Notification bell */}
        <button
          className="btn-icon"
          style={{ position: 'relative' }}
          title="Notifications"
        >
          <Bell size={14} strokeWidth={1.8} />
          <span
            style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--cyan-500)',
              boxShadow: '0 0 5px rgba(6,182,212,0.7)',
            }}
            className="animate-cyber-blink"
          />
        </button>

        {/* User menu */}
        {currentUser && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setUserOpen(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '4px 10px 4px 4px',
                borderRadius: '9px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.22)';
                (e.currentTarget as HTMLElement).style.background  = 'rgba(6,182,212,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.background  = 'rgba(255,255,255,0.04)';
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                {getInitials(currentUser.name)}
              </div>

              {/* Name */}
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name.split(' ')[0]}
              </span>

              <ChevronDown
                size={11}
                style={{
                  color: 'var(--text-muted)',
                  transform: userOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {userOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    background: 'rgba(4,10,26,0.98)',
                    border: '1px solid rgba(6,182,212,0.16)',
                    borderRadius: '12px',
                    padding: '8px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(24px)',
                    zIndex: 200,
                  }}
                >
                  {/* User header */}
                  <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
                    <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ marginTop: '7px' }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.10em',
                          textTransform: 'uppercase',
                          background: 'rgba(6,182,212,0.10)',
                          border: '1px solid rgba(6,182,212,0.20)',
                          color: 'var(--cyan-500)',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: User,     label: 'Profile',  action: () => setUserOpen(false) },
                    { icon: Settings, label: 'Settings', action: () => { setUserOpen(false); navigate('/settings'); } },
                    { icon: Zap,      label: 'New Analysis', action: () => { setUserOpen(false); navigate('/audio-analysis'); } },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '7px 10px',
                        borderRadius: '7px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 400,
                        transition: 'all 0.15s',
                        textAlign: 'left',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                        (e.currentTarget as HTMLElement).style.color      = 'var(--text-primary)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'none';
                        (e.currentTarget as HTMLElement).style.color      = 'var(--text-secondary)';
                      }}
                    >
                      <item.icon size={13} />
                      {item.label}
                    </button>
                  ))}

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '5px 0' }} />

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '7px 10px',
                      borderRadius: '7px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: '12px',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
