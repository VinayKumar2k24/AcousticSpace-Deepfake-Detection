import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Waves,
  LogOut,
  ChevronRight,
  Shield,
  Activity,
  FileBarChart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

/* ── Navigation Items ──────────────────────────────────────────────────── */
const MAIN_NAV = [
  { path: '/dashboard',        label: 'Dashboard',         icon: LayoutDashboard,  group: 'primary' },
  { path: '/audio-analysis',   label: 'Analyze Audio',     icon: Mic,              group: 'primary' },
  { path: '/analysis-history', label: 'Analysis History',  icon: History,          group: 'data'    },
  { path: '/statistics',       label: 'Model Insights',    icon: BarChart3,        group: 'data'    },
  { path: '/settings',         label: 'Settings',          icon: Settings,         group: 'system'  },
  { path: '/about',            label: 'Help & About',      icon: HelpCircle,       group: 'system'  },
];

/* ── Helpers ────────────────────────────────────────────────────────────── */
const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

/* ── Component ─────────────────────────────────────────────────────────── */
const Sidebar: React.FC = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { currentUser, logout, backendOnline } = useApp();
  const [logoutHover, setLogoutHover] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  /* Group separator labels */
  const groupLabels: Record<string, string> = {
    primary: 'Workspace',
    data:    'Intelligence',
    system:  'System',
  };

  const groups = ['primary', 'data', 'system'] as const;

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: 'var(--sidebar-width)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(2, 8, 24, 0.96)',
        borderRight: '1px solid rgba(6,182,212,0.10)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* ── Brand Header ──────────────────────────────────────────────── */}
      <div
        style={{
          padding: '18px 16px 16px',
          borderBottom: '1px solid rgba(6,182,212,0.08)',
          flexShrink: 0,
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(6,182,212,0.35)',
            }}
          >
            <Waves size={18} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ color: '#e8f0fe', fontWeight: 700, fontSize: '14px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              AcousticSpace
            </div>
            <div style={{ color: 'var(--cyan-500)', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', fontWeight: 600 }}>
              DEEPFAKE DETECTOR
            </div>
          </div>
        </div>

        {/* System status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '6px',
            background: backendOnline ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)',
            border: `1px solid ${backendOnline ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}`,
          }}
        >
          <span
            className="status-dot"
            style={{
              background: backendOnline ? 'var(--safe-500)' : 'var(--threat-500)',
              boxShadow: `0 0 5px ${backendOnline ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'}`,
              animation: backendOnline ? 'cyber-blink 2.5s ease-in-out infinite' : 'none',
            }}
          />
          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: backendOnline ? 'var(--safe-500)' : 'var(--threat-500)', letterSpacing: '0.06em' }}>
            {backendOnline ? 'MODEL ONLINE' : 'MODEL OFFLINE'}
          </span>
          <Shield size={9} style={{ color: backendOnline ? 'var(--safe-500)' : 'var(--threat-500)', marginLeft: 'auto' }} />
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }} className="no-scrollbar">
        {groups.map((group) => {
          const items = MAIN_NAV.filter(n => n.group === group);
          return (
            <div key={group} style={{ marginBottom: '6px' }}>
              {/* Group label */}
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-faint)',
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: '8px 10px 4px',
                }}
              >
                {groupLabels[group]}
              </div>

              {items.map((item) => {
                const Icon    = item.icon;
                const active  = isActive(item.path);

                return (
                  <NavLink key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        marginBottom: '1px',
                        cursor: 'pointer',
                        borderLeft: active ? '2px solid var(--cyan-500)' : '2px solid transparent',
                        background: active
                          ? 'linear-gradient(90deg, rgba(6,182,212,0.10), rgba(6,182,212,0.03))'
                          : 'transparent',
                        transition: 'all 0.15s ease',
                      }}
                      className={active ? '' : 'nav-item'}
                    >
                      <Icon
                        size={15}
                        style={{
                          color: active ? 'var(--cyan-500)' : 'var(--text-muted)',
                          flexShrink: 0,
                          transition: 'color 0.15s',
                        }}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: active ? 600 : 400,
                          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                          flex: 1,
                          letterSpacing: '0.01em',
                          transition: 'color 0.15s',
                        }}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <ChevronRight size={11} style={{ color: 'var(--cyan-500)', flexShrink: 0 }} />
                      )}
                    </motion.div>
                  </NavLink>
                );
              })}
            </div>
          );
        })}

        {/* ── Quick Analysis CTA ─────────────────────────────────────── */}
        <div style={{ padding: '10px 4px 4px' }}>
          <NavLink to="/audio-analysis" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.14) 0%, rgba(59,130,246,0.10) 100%)',
                border: '1px solid rgba(6,182,212,0.22)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Activity size={12} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                New Analysis
              </span>
              <ChevronRight size={11} style={{ color: 'var(--cyan-500)', marginLeft: 'auto' }} />
            </motion.div>
          </NavLink>
        </div>
      </nav>

      {/* ── User Card + Logout ─────────────────────────────────────────── */}
      <div
        style={{
          padding: '10px 8px 12px',
          borderTop: '1px solid rgba(6,182,212,0.08)',
          flexShrink: 0,
        }}
      >
        {/* User info */}
        {currentUser && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '8px 10px',
              borderRadius: '9px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '6px',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: 'white',
                flexShrink: 0,
                letterSpacing: '-0.02em',
              }}
            >
              {getInitials(currentUser.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.name}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'capitalize', fontFamily: 'JetBrains Mono, monospace' }}>
                {currentUser.role} · analyst
              </div>
            </div>
            <FileBarChart size={12} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
          </div>
        )}

        {/* Logout button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          onMouseEnter={() => setLogoutHover(true)}
          onMouseLeave={() => setLogoutHover(false)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 10px',
            borderRadius: '8px',
            background: logoutHover ? 'rgba(239,68,68,0.10)' : 'transparent',
            border: `1px solid ${logoutHover ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
            color: logoutHover ? '#ef4444' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <LogOut size={13} />
          Sign Out
        </motion.button>

        {/* Version footer */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em' }}>
            ACOUSTICSPACE v1.0 · AASIST ENGINE
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
