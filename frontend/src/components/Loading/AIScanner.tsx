import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Radio, Brain, Waves, Cpu, CheckCircle } from 'lucide-react';

/* ── Pipeline step definitions ────────────────────────────────────────────── */
const PIPELINE_STEPS = [
  {
    icon: Activity,
    label: 'Audio Decoding',
    detail: 'Normalizing sample rate to 16 kHz',
    color: '#06b6d4',
    duration: 1800,
  },
  {
    icon: Radio,
    label: 'Feature Extraction',
    detail: 'Spectral, MFCC & chroma analysis',
    color: '#3b82f6',
    duration: 2200,
  },
  {
    icon: Brain,
    label: 'AASIST Model Inference',
    detail: 'Graph attention network evaluation',
    color: '#8b5cf6',
    duration: 2400,
  },
  {
    icon: Waves,
    label: 'Room Impulse Response',
    detail: 'Environmental acoustic fingerprint',
    color: '#06b6d4',
    duration: 1600,
  },
  {
    icon: Cpu,
    label: 'Verdict Synthesis',
    detail: 'Confidence scoring & risk assessment',
    color: '#10b981',
    duration: 1200,
  },
];

/* ── Animated spectrum bars (decorative audio visualizer) ─────────────────── */
const SpectrumBars: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '32px' }}>
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{ scaleY: [0.2, 1, 0.3, 0.7, 0.2] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          delay: i * 0.07,
          ease: 'easeInOut',
        }}
        style={{
          width: '3px',
          height: `${8 + Math.sin(i * 0.6) * 12 + 10}px`,
          borderRadius: '2px',
          background: `linear-gradient(180deg, #06b6d4, #3b82f6)`,
          transformOrigin: 'bottom',
          opacity: 0.55 + Math.sin(i * 0.4) * 0.3,
        }}
      />
    ))}
  </div>
);

/* ── Main component ────────────────────────────────────────────────────────── */
const AIScanner: React.FC = () => {
  const [activeStep, setActiveStep]       = useState(0);
  const [completedSteps, setCompleted]    = useState<number[]>([]);
  const [elapsedMs, setElapsedMs]         = useState(0);

  /* Advance pipeline steps */
  useEffect(() => {
    let cumulativeDelay = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    PIPELINE_STEPS.forEach((step, i) => {
      // Activate step i
      const t1 = setTimeout(() => {
        setActiveStep(i);
      }, cumulativeDelay);
      timers.push(t1);

      cumulativeDelay += step.duration;

      // Mark step i complete after its duration
      const t2 = setTimeout(() => {
        setCompleted(prev => [...prev, i]);
      }, cumulativeDelay);
      timers.push(t2);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  /* Elapsed-time counter */
  useEffect(() => {
    const t = setInterval(() => setElapsedMs(ms => ms + 100), 100);
    return () => clearInterval(t);
  }, []);

  const progress = ((completedSteps.length / PIPELINE_STEPS.length) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2,8,24,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Subtle scan-line overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.015) 1px, transparent 1px)',
          backgroundSize: '100% 3px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          padding: '0 24px',
        }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Radar animation */}
          <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
            {[60, 76, 80].map((size, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  borderRadius: '50%',
                  border: `1px solid rgba(6,182,212,${0.35 - i * 0.10})`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'linear' }}
              />
            ))}

            {/* Radar sweep */}
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(6,182,212,0.35) 100%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center core */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(59,130,246,0.20))',
                border: '1px solid rgba(6,182,212,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AnimatePresence mode="wait">
                {React.createElement(PIPELINE_STEPS[activeStep].icon, {
                  key: activeStep,
                  size: 17,
                  color: PIPELINE_STEPS[activeStep].color,
                  strokeWidth: 2,
                })}
              </AnimatePresence>
            </div>
          </div>

          <div
            style={{
              fontSize: '10px',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--cyan-500)',
              marginBottom: '8px',
            }}
          >
            FORENSIC ANALYSIS IN PROGRESS
          </div>

          <h2
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            Processing Audio Sample
          </h2>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            AASIST v1.0 · Room Impulse Response · Breathing Pattern Analysis
          </p>

          {/* Spectrum visualizer */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <SpectrumBars />
          </div>
        </div>

        {/* ── Progress Bar ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Pipeline Progress
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--cyan-500)', fontWeight: 600 }}>
              {progress}%
            </span>
          </div>
          <div className="progress-track" style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              className="progress-fill"
              style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Pipeline Steps ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {PIPELINE_STEPS.map((step, i) => {
            const isDone    = completedSteps.includes(i);
            const isActive  = i === activeStep && !isDone;
            const isPending = i > activeStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{
                  opacity: isPending ? 0.35 : 1,
                  x: 0,
                }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '9px',
                  background: isActive
                    ? 'rgba(6,182,212,0.07)'
                    : isDone
                    ? 'rgba(16,185,129,0.05)'
                    : 'transparent',
                  border: `1px solid ${
                    isActive ? 'rgba(6,182,212,0.20)'
                    : isDone  ? 'rgba(16,185,129,0.15)'
                    : 'transparent'
                  }`,
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Step icon box */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isDone
                      ? 'rgba(16,185,129,0.12)'
                      : isActive
                      ? `${step.color}18`
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      isDone   ? 'rgba(16,185,129,0.30)'
                      : isActive ? `${step.color}35`
                      : 'rgba(255,255,255,0.07)'
                    }`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isDone
                    ? <CheckCircle size={13} style={{ color: '#10b981' }} strokeWidth={2.5} />
                    : React.createElement(step.icon, {
                        size: 13,
                        color: isActive ? step.color : 'var(--text-faint)',
                        strokeWidth: 2,
                      })
                  }
                </div>

                {/* Labels */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      color: isDone
                        ? '#10b981'
                        : isActive
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                      transition: 'color 0.3s',
                    }}
                  >
                    {step.label}
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginTop: '1px' }}
                    >
                      {step.detail}
                    </motion.div>
                  )}
                </div>

                {/* Active spinner */}
                {isActive && (
                  <div
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: '2px solid rgba(6,182,212,0.2)',
                      borderTopColor: 'var(--cyan-500)',
                      flexShrink: 0,
                    }}
                    className="animate-spin-slow"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Footer telemetry ──────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 0 0',
            borderTop: '1px solid rgba(6,182,212,0.08)',
          }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-faint)' }}>
            ACOUSTICSPACE ENGINE v1.0
          </span>
          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
            {(elapsedMs / 1000).toFixed(1)}s elapsed
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default AIScanner;
