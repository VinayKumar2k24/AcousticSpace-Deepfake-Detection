import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: number; label: string };
  suffix?: string;
  prefix?: string;
  glowColor?: string;
  delay?: number;
  /** Visual emphasis: default=standard, highlight=brighter border */
  emphasis?: 'default' | 'highlight';
  /** Optional sub-label shown beneath the metric value */
  subLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = '#06b6d4',
  iconBg    = 'rgba(6,182,212,0.10)',
  trend,
  suffix    = '',
  prefix    = '',
  glowColor = 'rgba(6,182,212,0.07)',
  delay     = 0,
  emphasis  = 'default',
  subLabel,
}) => {
  const [displayVal, setDisplayVal] = useState(0);
  const isNumeric = typeof value === 'number';
  const rafRef    = useRef<number>(0);

  /* Count-up animation for numeric values */
  useEffect(() => {
    if (!isNumeric) return;
    cancelAnimationFrame(rafRef.current);
    const end      = value as number;
    const duration = 900;
    let start      = 0;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    if (end === 0) { setDisplayVal(0); return; }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, isNumeric]);

  const displayValue = isNumeric ? displayVal : value;

  const TrendIcon = trend
    ? trend.value > 0 ? TrendingUp : trend.value < 0 ? TrendingDown : Minus
    : null;

  const trendColor = trend
    ? trend.value > 0 ? '#10b981' : trend.value < 0 ? '#ef4444' : '#94a3b8'
    : '#94a3b8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'rgba(9,20,40,0.70)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: emphasis === 'highlight'
          ? '1px solid rgba(6,182,212,0.25)'
          : '1px solid rgba(6,182,212,0.12)',
        borderRadius: '12px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      whileHover={{
        borderColor: 'rgba(6,182,212,0.22)',
        boxShadow: '0 6px 28px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(6,182,212,0.08)',
      }}
    >
      {/* Ambient corner glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          borderRadius: '0 12px 0 80px',
          background: `radial-gradient(circle at top right, ${glowColor}, transparent 65%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top row: icon + trend */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: iconBg,
              border: `1px solid ${iconColor}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={17} style={{ color: iconColor }} strokeWidth={2} />
          </div>

          {trend && TrendIcon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 7px',
                borderRadius: '5px',
                background: `${trendColor}12`,
                border: `1px solid ${trendColor}25`,
                color: trendColor,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              <TrendIcon size={10} strokeWidth={2.5} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        {/* Metric value */}
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '4px',
            letterSpacing: '-0.02em',
          }}
        >
          {prefix}{displayValue}{suffix}
        </div>

        {/* Label */}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.02em' }}>
          {label}
        </div>

        {/* Sub-label */}
        {subLabel && (
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
            {subLabel}
          </div>
        )}

        {/* Trend description */}
        {trend && (
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px' }}>
            {trend.label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
