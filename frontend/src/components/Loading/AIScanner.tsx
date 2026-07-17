import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Radio, Activity, Wand2, Brain } from 'lucide-react';

const STEPS = [
  { icon: Activity, label: 'Processing Audio...', color: '#06b6d4' },
  { icon: Radio, label: 'Extracting Acoustic Features...', color: '#3b82f6' },
  { icon: Brain, label: 'Running AI Model...', color: '#8b5cf6' },
  { icon: Wand2, label: 'Analyzing Room Impulse Response...', color: '#06b6d4' },
  { icon: Cpu, label: 'Generating Prediction...', color: '#10b981' },
];

const AIScanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(3, 7, 18, 0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Scan line animation */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ background: 'linear-gradient(rgba(6,182,212,0.01) 1px, transparent 1px)', backgroundSize: '100% 4px' }}
      />

      <div className="relative flex flex-col items-center gap-8 px-8 max-w-md w-full">
        {/* Central animation */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${i * 56}px`,
                height: `${i * 56}px`,
                border: `1px solid rgba(6,182,212,${0.4 - i * 0.1})`,
              }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.04, 1] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* Radar sweep */}
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(6,182,212,0.4) 100%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center z-10 relative glow-cyan"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(59,130,246,0.3))', border: '1px solid rgba(6,182,212,0.5)' }}
          >
            <AnimatePresence mode="wait">
              {React.createElement(STEPS[activeStep].icon, {
                key: activeStep,
                size: 28,
                color: STEPS[activeStep].color,
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold gradient-text">AI Analysis in Progress</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            AcousticSpace RIR Engine is processing your audio
          </p>
        </div>

        {/* Wave bars */}
        <div className="flex items-end gap-1.5 h-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="wave-bar" />
          ))}
        </div>

        {/* Steps */}
        <div className="w-full space-y-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: i <= activeStep ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{
                    background: isDone
                      ? 'rgba(16,185,129,0.15)'
                      : isActive
                      ? `rgba(6,182,212,0.15)`
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isDone ? 'rgba(16,185,129,0.4)' : isActive ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <Icon size={13} style={{ color: isDone ? '#10b981' : isActive ? step.color : 'var(--text-muted)' }} />
                </div>

                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: isDone ? '#10b981' : isActive ? '#f1f5f9' : 'var(--text-muted)' }}
                >
                  {step.label}
                </span>

                {isDone && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-xs font-semibold"
                    style={{ color: '#10b981' }}
                  >
                    ✓
                  </motion.span>
                )}
                {isActive && (
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(6,182,212,0.3)', borderTopColor: 'var(--accent-cyan)' }} />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          Powered by Room Impulse Response (RIR) Analysis
        </p>
      </div>
    </div>
  );
};

export default AIScanner;
