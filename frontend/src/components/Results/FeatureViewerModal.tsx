import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Info,
} from 'lucide-react';

// ─── Feature Descriptions ──────────────────────────────────────────────────────
const FEATURE_DESCRIPTIONS: Record<string, { short: string; detail: string }> = {
  mel: {
    short: 'Mel-scaled frequency representation',
    detail:
      'Displays the Mel-scaled frequency representation of the speech signal. Useful for observing overall acoustic energy distribution across perceptually meaningful frequency bands.',
  },
  mfcc: {
    short: 'Mel Frequency Cepstral Coefficients',
    detail:
      'Displays Mel Frequency Cepstral Coefficients extracted from speech. Useful for identifying vocal characteristics used by the AASIST AI detection model.',
  },
  spectrogram: {
    short: 'Frequency changes over time',
    detail:
      'Shows frequency changes over time in the audio signal. Helps visualize speech structure, phoneme transitions, and temporal patterns.',
  },
  chroma: {
    short: 'Harmonic pitch class distribution',
    detail:
      'Shows harmonic pitch distribution across the 12 chromatic pitch classes. Useful for analyzing tonal characteristics and identifying unnatural harmonic patterns.',
  },
  spectral_contrast: {
    short: 'Spectral peaks vs. valley difference',
    detail:
      'Shows the difference between spectral peaks and valleys across sub-bands. Useful for identifying acoustic texture and distinguishing natural speech resonance from synthetic artifacts.',
  },
  rir: {
    short: 'Estimated room acoustic response',
    detail:
      'Visualizes the estimated room acoustic response (RIR). Useful for identifying environmental consistency and detecting synthetic generation artifacts introduced by vocoders.',
  },
};

const getDescription = (featureKey: string) =>
  FEATURE_DESCRIPTIONS[featureKey] ?? {
    short: 'Acoustic feature visualization',
    detail: 'Extracted acoustic feature from the uploaded audio recording.',
  };

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureViewerModalProps {
  src: string;
  title: string;
  featureKey: string;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
const FeatureViewerModal: React.FC<FeatureViewerModalProps> = ({
  src,
  title,
  featureKey,
  onClose,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const desc = getDescription(featureKey);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 4));
      if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 0.5));
      if (e.key === '0') { setZoom(1); setPan({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Mouse pan handlers
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    },
    [zoom, pan]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [isDragging, dragStart]
  );

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  // Wheel zoom
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(Math.max(z - e.deltaY * 0.001, 0.5), 4));
  }, []);

  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // Download
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(src, { mode: 'cors' });
      const blob = await res.blob();
      const ext = blob.type.includes('png') ? 'png' : 'jpg';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${featureKey}_feature.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(src, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const zoomPct = Math.round(zoom * 100);

  return (
    <AnimatePresence>
      <motion.div
        key="fv-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(18px)' }}
      >
        {/* Modal panel */}
        <motion.div
          key="fv-panel"
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full flex flex-col rounded-2xl overflow-hidden"
          style={{
            maxWidth: 1000,
            maxHeight: '92vh',
            background: 'rgba(10,15,30,0.98)',
            border: '1px solid rgba(6,182,212,0.2)',
            boxShadow: '0 0 80px rgba(6,182,212,0.08), 0 32px 80px rgba(0,0,0,0.7)',
          }}
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {/* Feature info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-white font-semibold text-sm tracking-wide">{title}</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(6,182,212,0.1)',
                    color: 'var(--accent-cyan)',
                    border: '1px solid rgba(6,182,212,0.2)',
                  }}
                >
                  {desc.short}
                </span>
              </div>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                title="Zoom Out (−)"
              >
                <ZoomOut size={14} />
              </button>
              <div
                className="text-xs font-mono px-2 py-1 rounded-md"
                style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--accent-cyan)', minWidth: 46, textAlign: 'center' }}
              >
                {zoomPct}%
              </div>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                title="Zoom In (+)"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
                title="Reset Zoom (0)"
              >
                <RotateCcw size={13} />
              </button>

              {/* Divider */}
              <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: 'rgba(6,182,212,0.12)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(6,182,212,0.2)',
                  opacity: isDownloading ? 0.6 : 1,
                }}
                title="Download Image"
              >
                <Download size={13} />
                {isDownloading ? 'Saving…' : 'Download'}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors ml-1"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                title="Close [Esc]"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Image Viewport ──────────────────────────────────────────── */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{
              background: 'rgba(3,7,18,0.6)',
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
              minHeight: 300,
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
          >
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              animate={{ scale: zoom, x: pan.x, y: pan.y }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.5 }}
            >
              <img
                ref={imgRef}
                src={src}
                alt={title}
                draggable={false}
                className="rounded-lg select-none"
                style={{
                  maxWidth: '90%',
                  maxHeight: '62vh',
                  objectFit: 'contain',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 48px rgba(0,0,0,0.6)',
                }}
              />
            </motion.div>

            {/* Zoom hint (fades out) */}
            {zoom === 1 && (
              <motion.div
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-3 right-3 text-xs px-2.5 py-1 rounded-lg pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--text-muted)' }}
              >
                Scroll or use +/− to zoom · Drag to pan
              </motion.div>
            )}
          </div>

          {/* ── Description Footer ──────────────────────────────────────── */}
          <div
            className="flex items-start gap-3 px-5 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.03)' }}
          >
            <Info size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 2 }} />
            <p className="text-xs leading-5" style={{ color: 'var(--text-muted)' }}>
              {desc.detail}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureViewerModal;
