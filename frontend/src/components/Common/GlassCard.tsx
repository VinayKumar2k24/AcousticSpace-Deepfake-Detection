import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: 'cyan' | 'blue' | 'green' | 'red' | 'purple';
  onClick?: () => void;
  animate?: boolean;
}

const GLOW_CLASSES: Record<string, string> = {
  cyan: 'glow-cyan',
  blue: 'glow-blue',
  green: 'glow-green',
  red: 'glow-red',
  purple: '',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  glowColor = 'cyan',
  onClick,
  animate = true,
}) => {
  const glowClass = glow ? GLOW_CLASSES[glowColor] : '';

  if (!animate) {
    return (
      <div
        className={`glass-card-static ${glowClass} ${className}`}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.01 } : {}}
      className={`glass-card ${glowClass} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
