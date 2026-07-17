import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  suffix?: string;
  glowColor?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = '#06b6d4',
  iconBg = 'rgba(6,182,212,0.12)',
  trend,
  suffix = '',
  glowColor = 'rgba(6,182,212,0.1)',
  delay = 0,
}) => {
  const [displayVal, setDisplayVal] = useState(0);
  const isNumeric = typeof value === 'number';
  const targetRef = useRef(value as number);

  useEffect(() => {
    if (!isNumeric) return;
    targetRef.current = value as number;
    let start = 0;
    const end = value as number;
    if (end === 0) { setDisplayVal(0); return; }
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplayVal(end);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, isNumeric]);

  const displayValue = isNumeric ? displayVal : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className="glass-card p-5 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${glowColor}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: iconBg }}
          >
            <Icon size={20} style={{ color: iconColor }} />
          </div>
          {trend && (
            <div
              className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: trend.value >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: trend.value >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="text-2xl font-bold text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {displayValue}{suffix}
          </div>
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {label}
          </div>
          {trend && (
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {trend.label}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
