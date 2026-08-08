import React from 'react';
import { motion } from 'framer-motion';

/* ── Variant system ──────────────────────────────────────────────────────── */
type CardVariant = 'default' | 'evidence' | 'human' | 'ai' | 'elevated';

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:  'glass-card',
  evidence: 'evidence-card',
  human:    'glass-card verdict-human',
  ai:       'glass-card verdict-ai',
  elevated: 'forensic-panel',
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  /** @deprecated Use variant="human" or variant="ai" */
  glow?: boolean;
  /** @deprecated */
  glowColor?: 'cyan' | 'blue' | 'green' | 'red' | 'purple';
  onClick?: () => void;
  animate?: boolean;
  /** Stagger delay for grid animations */
  delay?: number;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glow,
  glowColor,
  onClick,
  animate = true,
  delay = 0,
  style,
}) => {
  const baseClass = VARIANT_CLASSES[variant];

  if (!animate) {
    return (
      <div
        className={`glass-card-static ${className}`}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={onClick ? { y: -2, transition: { duration: 0.18 } } : undefined}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
