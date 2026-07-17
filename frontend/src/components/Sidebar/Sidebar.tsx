import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic,
  Upload,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Cpu,
  ChevronRight,
  Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Audio Analysis', icon: Mic },
  { path: '/upload', label: 'Upload Audio', icon: Upload, sub: true },
  { path: '/history', label: 'Analysis History', icon: History },
  { path: '/statistics', label: 'Model Statistics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'Help', icon: HelpCircle },
];

const MAIN_NAV = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Audio Analysis', icon: Mic },
  { path: '/history', label: 'Analysis History', icon: History },
  { path: '/statistics', label: 'Model Statistics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'Help & About', icon: HelpCircle },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col"
      style={{
        background: 'rgba(3, 7, 18, 0.95)',
        borderRight: '1px solid rgba(6, 182, 212, 0.12)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(6, 182, 212, 0.1)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center glow-cyan"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
          >
            <Waves size={20} color="white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">AcousticSpace</h1>
            <p className="text-xs" style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
              DeepFake Detector
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="mt-3 text-xs leading-relaxed"
          style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}
        >
          "Detecting AI Generated Voices through Environmental Acoustics"
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4 px-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Navigation
        </p>

        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <NavLink key={item.path + item.label} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
                  isActive ? 'nav-active' : ''
                }`}
                style={
                  !isActive
                    ? { color: 'var(--text-secondary)' }
                    : {}
                }
              >
                <Icon
                  size={18}
                  className={`nav-icon flex-shrink-0 transition-all duration-200 ${
                    !isActive ? 'group-hover:text-cyan-400' : ''
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--accent-cyan)' }} />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(6, 182, 212, 0.1)' }}>
        <div
          className="glass-card-static p-3 rounded-xl"
          style={{ borderRadius: '12px' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              System
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Model</span>
              <span
                className="mono"
                style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}
              >
                RIR-v1.0
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Platform</span>
              <span style={{ color: 'var(--text-secondary)' }}>Infotact</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          © 2025 AcousticSpace v1.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
