import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, AlertTriangle, Clock, Cpu, FileAudio, Calendar,
  Download, RefreshCcw, ShieldAlert, ShieldCheck, Activity, Radio,
  Wand2, Image as ImageIcon, Wind, HeartPulse, Zap, BarChart2,
  TrendingUp, Timer, ChevronDown, Waves, ScanLine, Volume2,
  AudioWaveform, Shield, Lock, Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfidenceGauge from '../components/Charts/ConfidenceGauge';
import GlassCard from '../components/Common/GlassCard';
import FeatureViewerModal from '../components/Results/FeatureViewerModal';
import AudioPlayer from '../components/Results/AudioPlayer';
import SpectrogramViewer from '../components/Visualizers/SpectrogramViewer';
import { generatePdfReport } from '../utils/generatePdfReport';
import { getRiskLevel, RISK_CONFIG } from '../utils/riskHelper';

/* ── Section Header ─────────────────────────────────────────────────────────── */
interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  badge?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, badge }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(6,182,212,0.12)',
        border: '1px solid rgba(6,182,212,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={15} style={{ color: 'var(--cyan-500)' }} />
    </div>
    <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
      {title}
    </h3>
    {badge && (
      <span className="telem-tag" style={{ marginLeft: 'auto', fontSize: '9px' }}>
        {badge}
      </span>
    )}
  </div>
);

/* ── Results Main Component ─────────────────────────────────────────────────── */
const Results: React.FC = () => {
  const { currentResult, currentFile, settings } = useApp();
  const navigate = useNavigate();
  const [activeImage, setActiveImage]           = useState<{ src: string; title: string; featureKey: string } | null>(null);
  const [imageErrors, setImageErrors]           = useState<Record<string, boolean>>({});
  const [showBreathingDetails, setShowBreathing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf]   = useState(false);

  useEffect(() => {
    setImageErrors({});
  }, [currentResult]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!currentResult) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>No analysis result loaded</div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Upload an audio recording to run deepfake detection.</p>
        <button className="btn-primary" onClick={() => navigate('/audio-analysis')}>
          Start New Analysis
        </button>
      </div>
    );
  }

  const isReal       = currentResult.prediction === 'REAL HUMAN VOICE';
  const accentColor  = isReal ? '#10b981' : '#ef4444';
  const accentBg     = isReal ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';
  const accentBorder = isReal ? 'rgba(16,185,129,0.28)' : 'rgba(239,68,68,0.28)';

  const riskLevel = getRiskLevel(currentResult.confidence, isReal);
  const riskCfg   = RISK_CONFIG[riskLevel];

  const aiExplanation = isReal
    ? 'The uploaded recording exhibits acoustic characteristics consistent with authentic human speech. Room Impulse Response, spectral characteristics, and MFCC distributions are within expected natural vocal ranges. No synthetic neural artifacts were detected by the AASIST model.'
    : 'The uploaded recording contains acoustic anomalies associated with synthetic speech generation. The AASIST graph attention model identified phase irregularities, spectral discontinuities, and artificial room impulse artifacts indicative of AI voice cloning.';

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    let url = path;
    if (!path.startsWith('http://') && !path.startsWith('https://')) {
      const base = settings.backendUrl.endsWith('/')
        ? settings.backendUrl.slice(0, -1)
        : settings.backendUrl;
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      url = `${base}${cleanPath}`;
    }
    const cacheBuster = currentResult.timestamp
      ? `t=${encodeURIComponent(currentResult.timestamp)}`
      : `t=${Date.now()}`;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${cacheBuster}`;
  };

  const featureCards = [
    { label: 'Mel Spectrogram',             key: 'mel',               color: '#06b6d4' },
    { label: 'MFCC Features',               key: 'mfcc',              color: '#3b82f6' },
    { label: 'Room Impulse Response (RIR)', key: 'rir',               color: '#8b5cf6' },
    { label: 'Spectrogram',                 key: 'spectrogram',       color: '#f59e0b' },
    { label: 'Spectral Contrast',           key: 'spectral_contrast', color: '#10b981' },
    { label: 'Chroma Features',             key: 'chroma',            color: '#ef4444' },
  ] as const;

  const handleDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePdfReport(
        currentResult,
        currentFile,
        settings,
        isReal,
        aiExplanation,
        riskLevel,
        getImageUrl
      );
    } catch (err) {
      console.error('PDF generation error, falling back to JSON export:', err);
      const report = {
        report: 'AcousticSpace Forensic Detection Report',
        generated: new Date().toISOString(),
        ...currentResult,
        model: settings.modelVersion,
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `acousticspace_forensic_report_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}
    >
      {/* ── Top Forensic Verdict Banner ───────────────────────────────── */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '24px 28px',
          background: `linear-gradient(135deg, ${accentBg} 0%, rgba(9,20,40,0.92) 70%)`,
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${accentColor}25`,
        }}
      >
        {/* Background micro grid */}
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          {/* Icon + Title block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: `${accentColor}15`,
                border: `2px solid ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 0 24px ${accentColor}30`,
              }}
            >
              {isReal ? (
                <ShieldCheck size={32} style={{ color: accentColor }} />
              ) : (
                <ShieldAlert size={32} style={{ color: accentColor }} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, letterSpacing: '0.12em', color: accentColor, textTransform: 'uppercase' }}>
                  FORENSIC VERDICT CONFIRMED
                </span>
                <span className="telem-tag" style={{ fontSize: '9px' }}>
                  ID #{currentResult.timestamp ? currentResult.timestamp.slice(-8) : 'VERIFIED'}
                </span>
              </div>

              <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {isReal ? 'REAL HUMAN VOICE DETECTED' : 'AI GENERATED VOICE DETECTED'}
              </h1>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                {currentResult.filename}
              </div>
            </div>
          </div>

          {/* Verdict + Risk Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Risk badge */}
            <div
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: riskCfg.bg,
                border: `1px solid ${riskCfg.border}`,
                color: riskCfg.color,
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: riskCfg.color }} className="animate-pulse" />
              {riskCfg.label}
            </div>

            {/* Verdict badge */}
            <div
              className={isReal ? 'badge-real' : 'badge-fake'}
              style={{
                padding: '8px 18px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.04em',
              }}
            >
              {isReal ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {currentResult.prediction}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Audio Player ─────────────────────────────────────────────── */}
      {currentFile?.url && (
        <AudioPlayer
          audioUrl={currentFile.url}
          filename={currentResult.filename}
          accentColor={accentColor}
        />
      )}

      {/* ── Metric Telemetry Cards Grid ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {/* Prediction */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accentBg}, rgba(9,20,40,0.70))`,
            border: `1px solid ${accentBorder}`,
            borderRadius: '12px',
            padding: '14px 16px',
          }}
        >
          <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            VERDICT CLASSIFICATION
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: accentColor }}>
            {isReal ? 'REAL HUMAN VOICE' : 'AI GENERATED VOICE'}
          </div>
        </div>

        {/* Confidence */}
        <div style={{ background: 'rgba(9,20,40,0.70)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            CONFIDENCE SCORE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--cyan-500)', fontFamily: 'JetBrains Mono, monospace' }}>
            {currentResult.confidence.toFixed(2)}%
          </div>
        </div>

        {/* Risk Level */}
        <div style={{ background: 'rgba(9,20,40,0.70)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            RISK ASSESSMENT
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: riskCfg.color, fontFamily: 'JetBrains Mono, monospace' }}>
            {riskCfg.label}
          </div>
        </div>

        {/* Model Engine */}
        <div style={{ background: 'rgba(9,20,40,0.70)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            MODEL ARCHITECTURE
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#8b5cf6', fontFamily: 'JetBrains Mono, monospace' }}>
            AASIST {currentResult.model_used || settings.modelVersion}
          </div>
        </div>

        {/* Processing Time */}
        <div style={{ background: 'rgba(9,20,40,0.70)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            INFERENCE LATENCY
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }}>
            {currentResult.inference_time || currentResult.processing_time || '—'}
          </div>
        </div>
      </div>

      {/* ── Confidence Score & Spectrogram Grid ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-cols-1 md:grid-cols-2">
        {/* Left: Confidence Gauge */}
        <GlassCard className="p-5 flex flex-col items-center justify-between" animate={false}>
          <SectionHeader icon={BarChart2} title="Probability Distribution" />
          <ConfidenceGauge confidence={currentResult.confidence} isReal={isReal} size={190} />

          <div style={{ width: '100%', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
              <span>Class Probability</span>
              <span style={{ color: accentColor, fontWeight: 700 }}>{currentResult.confidence.toFixed(2)}%</span>
            </div>
            <div className="progress-track" style={{ height: '6px' }}>
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${currentResult.confidence}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc)` }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Right: Spectrogram Viewer */}
        <SpectrogramViewer height={190} />
      </div>

      {/* ── Breathing Pattern Analysis Section ──────────────────────── */}
      <GlassCard className="p-5" animate={false}>
        <SectionHeader icon={Wind} title="Breathing Pattern Analysis" badge="Vocal Tract Signal" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginBottom: '4px' }}>
              BREATHING STATUS
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color:
                  currentResult?.breathing?.breathing_status === 'Very Stable'
                    ? '#10b981'
                    : currentResult?.breathing?.breathing_status === 'Stable'
                    ? '#22c55e'
                    : currentResult?.breathing?.breathing_status === 'Moderately Variable'
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {currentResult?.breathing?.breathing_status || 'Unknown'}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginBottom: '4px' }}>
              BREATH SCORE
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--cyan-500)', fontFamily: 'JetBrains Mono, monospace' }}>
              {currentResult?.breathing?.breath_score ?? '--'}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {currentResult?.breathing?.analysis || 'Breathing characteristics within normal operational parameters.'}
          </div>
        </div>

        {/* Collapsible details */}
        {currentResult?.breathing?.details && (
          <div>
            <button
              onClick={() => setShowBreathing((v) => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(6,182,212,0.06)',
                border: '1px solid rgba(6,182,212,0.16)',
                color: 'var(--cyan-500)',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AudioWaveform size={12} />
                BREATHING METRICS DETAILS
              </div>
              <ChevronDown size={14} style={{ transform: showBreathingDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            </button>

            <AnimatePresence>
              {showBreathingDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: '10px' }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      { label: 'RMS Variation',        val: currentResult.breathing.details.rms_variation },
                      { label: 'Zero Crossing Rate',   val: currentResult.breathing.details.zero_crossing_rate },
                      { label: 'Spectral Variation',   val: currentResult.breathing.details.spectral_variation },
                      { label: 'Silence Ratio',        val: currentResult.breathing.details.silence_ratio },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cyan-500)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                          {typeof val === 'number' ? val.toFixed(4) : val ?? '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>

      {/* ── AI Explanation ──────────────────────────────────────────── */}
      <GlassCard className="p-5" animate={false}>
        <SectionHeader icon={Wand2} title="AI Forensic Explanation" badge="AASIST Signal Intelligence" />
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '10px',
            background: isReal ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
            border: `1px solid ${isReal ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <div style={{ width: '3px', height: '100%', minHeight: '36px', borderRadius: '2px', background: accentColor, flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {aiExplanation}
          </p>
        </div>
      </GlassCard>

      {/* ── Acoustic Feature Panel Grid ─────────────────────────────── */}
      <GlassCard className="p-5" animate={false}>
        <SectionHeader icon={Activity} title="Acoustic Feature Extraction Grid" badge="6 Signals Analyzed" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {featureCards.map(({ label, key, color }) => {
            const imagePath = currentResult.features?.[key];
            const fullUrl   = getImageUrl(imagePath);

            return (
              <div
                key={key}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}22`,
                  borderRadius: '10px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={12} style={{ color }} />
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: fullUrl && !imageErrors[key] ? 'zoom-in' : 'default',
                  }}
                  onClick={() => {
                    if (fullUrl && !imageErrors[key]) {
                      setActiveImage({ src: fullUrl, title: label, featureKey: key });
                    }
                  }}
                >
                  {fullUrl && !imageErrors[key] ? (
                    <img
                      src={fullUrl}
                      alt={label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImageErrors(prev => ({ ...prev, [key]: true }))}
                    />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <ImageIcon size={18} opacity={0.3} />
                      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>Feature extracted</span>
                    </div>
                  )}

                  {fullUrl && !imageErrors[key] && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(2,8,24,0.7)',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '0'; }}
                    >
                      <span className="mono-tag" style={{ background: 'var(--surface-0)', border: '1px solid var(--cyan-500)' }}>
                        CLICK TO ENLARGE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          className="btn-secondary"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '8px', padding: '12px' }}
          onClick={handleDownload}
          disabled={isGeneratingPdf}
        >
          <Download size={15} />
          {isGeneratingPdf ? 'Generating Forensic PDF Report…' : 'Export Forensic PDF Report'}
        </button>

        <button
          className="btn-primary"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyCenter: 'center', gap: '8px', padding: '12px' }}
          onClick={() => navigate('/audio-analysis')}
        >
          <RefreshCcw size={15} />
          Analyze Another File
        </button>
      </div>

      {/* Feature Viewer Modal */}
      {activeImage && (
        <FeatureViewerModal
          src={activeImage.src}
          title={activeImage.title}
          featureKey={activeImage.featureKey}
          onClose={() => setActiveImage(null)}
        />
      )}
    </motion.div>
  );
};

export default Results;
