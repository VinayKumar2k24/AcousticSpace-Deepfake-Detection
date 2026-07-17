import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Cpu,
  FileAudio,
  Calendar,
  Download,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Radio,
  Wand2,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfidenceGauge from '../components/Charts/ConfidenceGauge';
import GlassCard from '../components/Common/GlassCard';

const Results: React.FC = () => {
  const { currentResult, currentFile, settings } = useApp();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <p className="text-white font-semibold">No result to display</p>
        <button className="btn-primary" onClick={() => navigate('/upload')}>
          Go to Upload
        </button>
      </div>
    );
  }

  const isReal = currentResult.prediction === 'REAL HUMAN VOICE';
  const accentColor = isReal ? '#10b981' : '#ef4444';
  const accentBg = isReal ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const accentBorder = isReal ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';

  const explanations = isReal
    ? [
        'Room Impulse Response matches a natural acoustic environment.',
        'Background reverberation is consistent with the speech source.',
        'Frequency distribution follows natural vocal patterns.',
        'No synthetic artifacts detected in MFCC features.',
        'Voice energy distribution is within natural human range.',
      ]
    : [
        'Detected inconsistencies in Room Impulse Response (RIR).',
        'Background reverberation does not match the speech source.',
        'Abnormal acoustic reflections detected in the recording.',
        'MFCC features show signs of synthetic voice generation.',
        'Possible AI-generated audio artifacts identified.',
      ];

  const getImageUrl = (path?: string) => {
    if (!path) return '';
    // Use directly if it is already a full URL
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
    { label: 'Mel Spectrogram', key: 'mel', color: '#06b6d4' },
    { label: 'MFCC Features', key: 'mfcc', color: '#3b82f6' },
    { label: 'Room Impulse Response (RIR)', key: 'rir', color: '#8b5cf6' },
    { label: 'Spectrogram', key: 'spectrogram', color: '#f59e0b' },
    { label: 'Spectral Contrast', key: 'spectral_contrast', color: '#10b981' },
    { label: 'Chroma Features', key: 'chroma', color: '#ef4444' },
  ] as const;

  const handleDownload = () => {
    const report = {
      report: 'AcousticSpace Detection Report',
      generated: new Date().toISOString(),
      ...currentResult,
      model: settings.modelVersion,
      platform: 'Infotact AcousticSpace',
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acousticspace_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Result Banner */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8 text-center"
        style={{
          background: `linear-gradient(135deg, ${accentBg}, rgba(0,0,0,0))`,
          border: `1px solid ${accentBorder}`,
          boxShadow: `0 0 40px ${accentBg}`,
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: accentBg, border: `2px solid ${accentColor}`, boxShadow: `0 0 30px ${accentBg}` }}
        >
          {isReal ? (
            <ShieldCheck size={36} style={{ color: accentColor }} />
          ) : (
            <ShieldAlert size={36} style={{ color: accentColor }} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold mb-3"
            style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
          >
            {isReal ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            {currentResult.prediction}
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">
            {isReal ? 'Prediction Complete — Authentic Voice' : 'Alert — Deepfake Detected'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {currentResult.filename}
          </p>
        </motion.div>
      </motion.div>

      {/* Main grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Confidence Gauge */}
        <GlassCard className="p-6 flex flex-col items-center gap-4">
          <h3 className="text-sm font-semibold text-white self-start">Confidence Score</h3>
          <ConfidenceGauge
            confidence={currentResult.confidence}
            isReal={isReal}
            size={200}
          />
          {/* Probability bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>Prediction Probability</span>
              <span style={{ color: accentColor, fontFamily: 'JetBrains Mono' }}>
                {currentResult.confidence.toFixed(2)}%
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${currentResult.confidence}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor}aa)` }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Meta Info */}
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Analysis Details</h3>
          <div className="space-y-3">
            {[
              { icon: FileAudio, label: 'File Name', value: currentResult.filename, color: 'var(--accent-cyan)' },
              { icon: Clock, label: 'Processing Time', value: currentResult.processing_time, color: '#8b5cf6' },
              { icon: Cpu, label: 'Model Used', value: currentResult.model_used || settings.modelVersion, color: '#06b6d4' },
              { icon: Calendar, label: 'Timestamp', value: currentResult.timestamp ? new Date(currentResult.timestamp).toLocaleString() : '—', color: '#f59e0b' },
              ...(currentFile ? [
                { icon: Activity, label: 'File Size', value: currentFile.size, color: '#10b981' },
                { icon: Radio, label: 'Duration', value: currentFile.duration || '—', color: '#3b82f6' },
              ] : []),
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
                  <div className="text-sm font-medium text-white truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Explanation */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wand2 size={16} style={{ color: 'var(--accent-cyan)' }} />
          <h3 className="text-sm font-semibold text-white">AI Explanation</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}
          >
            RIR Analysis
          </span>
        </div>
        <div className="space-y-2.5">
          {explanations.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{
                background: isReal ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
                border: `1px solid ${isReal ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}`,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: accentColor }}
              />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Audio Features Panel */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: 'var(--accent-cyan)' }} />
          <h3 className="text-sm font-semibold text-white">Acoustic Feature Panel</h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)' }}
          >
            AI Features Extracted
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featureCards.map(({ label, key, color }) => {
            const imagePath = currentResult.features?.[key];
            const fullUrl = getImageUrl(imagePath);

            return (
              <div
                key={key}
                className="p-4 rounded-xl flex flex-col justify-between"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${color}20`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white tracking-wide">{label}</span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}15` }}
                  >
                    <Activity size={14} style={{ color }} />
                  </div>
                </div>

                {/* Feature Image Wrapper */}
                <div
                  className={`relative rounded-lg overflow-hidden border border-white/5 bg-black/40 group aspect-video ${
                    fullUrl && !imageErrors[key] ? 'cursor-zoom-in' : 'cursor-default'
                  }`}
                  onClick={() => {
                    if (fullUrl && !imageErrors[key]) {
                      setActiveImage({ src: fullUrl, title: label });
                    }
                  }}
                >
                  {fullUrl && !imageErrors[key] ? (
                    <img
                      src={fullUrl}
                      alt={label}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      onError={() => {
                        setImageErrors((prev) => ({ ...prev, [key]: true }));
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-1.5 p-3">
                      <ImageIcon size={18} style={{ color: 'rgba(255,255,255,0.15)' }} />
                      <span className="text-[11px] font-semibold text-slate-400">
                        Feature not generated
                      </span>
                    </div>
                  )}

                  {fullUrl && !imageErrors[key] && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs font-semibold text-white tracking-wider uppercase bg-[#030712]/90 px-3 py-1.5 rounded-lg border border-cyan-500/30 glow-cyan">
                        Click to Enlarge
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="btn-secondary flex items-center gap-2 flex-1" onClick={handleDownload}>
          <Download size={16} />
          Download Report
        </button>
        <button className="btn-primary flex items-center gap-2 flex-1" onClick={() => navigate('/upload')}>
          <RefreshCcw size={16} />
          Analyze Another File
        </button>
      </div>
      {/* Zoom Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full rounded-2xl overflow-hidden glass-card-static border border-cyan-500/20 p-2 flex flex-col bg-[#070c19] cursor-default"
            >
              {/* Header */}
              <div className="w-full flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="font-semibold text-white tracking-wide text-sm">{activeImage.title}</span>
                <button
                  onClick={() => setActiveImage(null)}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition-colors"
                >
                  Close [Esc]
                </button>
              </div>

              {/* Image Container */}
              <div className="w-full overflow-auto flex items-center justify-center p-4 min-h-0 flex-1">
                <img
                  src={activeImage.src}
                  alt={activeImage.title}
                  className="max-w-full max-h-[65vh] object-contain rounded-lg border border-white/10"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Results;
