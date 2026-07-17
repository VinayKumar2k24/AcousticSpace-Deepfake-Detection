import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfidenceGaugeProps {
  confidence: number;
  isReal: boolean;
  size?: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  confidence,
  isReal,
  size = 200,
}) => {
  const [displayed, setDisplayed] = useState(0);

  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayed / 100) * circumference;

  const color = isReal ? '#10b981' : '#ef4444';
  const colorFaded = isReal ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)';
  const glowColor = isReal ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)';

  useEffect(() => {
    let start = 0;
    const end = confidence;
    const duration = 1400;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(parseFloat((eased * end).toFixed(1)));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplayed(end);
    };
    requestAnimationFrame(step);
  }, [confidence]);

  const tier =
    confidence >= 90 ? 'Very High' : confidence >= 75 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colorFaded}
            strokeWidth={12}
            strokeLinecap="round"
          />
          {/* Animated foreground arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          {/* Inner decorative ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 20}
            fill="none"
            stroke={`${color}20`}
            strokeWidth={1}
            strokeDasharray="4 8"
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-bold leading-none"
            style={{ fontSize: size * 0.18, color, fontFamily: 'JetBrains Mono, monospace' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {displayed.toFixed(1)}%
          </motion.span>
          <span className="text-xs font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
            Confidence
          </span>
        </div>
      </div>

      {/* Tier label */}
      <div
        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
        style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
      >
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
        {tier} Confidence
      </div>
    </div>
  );
};

export default ConfidenceGauge;
