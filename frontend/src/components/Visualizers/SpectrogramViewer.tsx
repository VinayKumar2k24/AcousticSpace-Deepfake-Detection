import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Download, Activity, Layers, Maximize2 } from 'lucide-react';

interface SpectrogramViewerProps {
  audioUrl?: string;
  height?: number;
}

const SpectrogramViewer: React.FC<SpectrogramViewerProps> = ({ height = 180 }) => {
  const canvasRef                       = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom]                 = useState(1);
  const [activePreset, setActivePreset] = useState<'plasma' | 'viridis' | 'cyan'>('plasma');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width  = canvas.parentElement?.clientWidth || 700;
    canvas.width  = width;
    canvas.height = height;

    const numCols = Math.floor(width * zoom);
    const numBins = height;

    // Generate scientific spectrogram heatmap pattern
    const imgData = ctx.createImageData(width, height);
    const data    = imgData.data;

    for (let x = 0; x < width; x++) {
      const colNorm = (x / width) * zoom;
      for (let y = 0; y < height; y++) {
        const binNorm = 1 - y / height; // Low frequencies at bottom

        // Synthetic acoustic spectrum function (formants + harmonics + noise)
        const formant1 = Math.exp(-Math.pow(binNorm - 0.25 - Math.sin(colNorm * 8) * 0.05, 2) / 0.008);
        const formant2 = Math.exp(-Math.pow(binNorm - 0.55 - Math.cos(colNorm * 12) * 0.08, 2) / 0.012);
        const formant3 = Math.exp(-Math.pow(binNorm - 0.82, 2) / 0.02);
        const noise    = Math.random() * 0.08;

        const val = Math.min(1, Math.max(0, formant1 * 0.9 + formant2 * 0.7 + formant3 * 0.5 + noise));

        // Color mapping
        let r = 0, g = 0, b = 0;
        if (activePreset === 'plasma') {
          // Plasma scientific scale: Dark blue -> Magenta -> Orange -> Yellow
          r = Math.floor(Math.sin(val * Math.PI * 0.8) * 255);
          g = Math.floor(Math.pow(val, 2) * 220);
          b = Math.floor(Math.cos(val * Math.PI * 0.5) * 200);
        } else if (activePreset === 'viridis') {
          // Viridis scale: Purple -> Teal -> Green -> Yellow
          r = Math.floor(val * 240);
          g = Math.floor(Math.sin(val * Math.PI) * 255);
          b = Math.floor((1 - val) * 180);
        } else {
          // Cyan forensic scale
          r = Math.floor(val * 40);
          g = Math.floor(val * 220);
          b = Math.floor(val * 255);
        }

        const idx = (y * width + x) * 4;
        data[idx]     = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 230; // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay frequency grid lines
    ctx.strokeStyle = 'rgba(6,182,212,0.18)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);

    [0.25, 0.5, 0.75].forEach((ratio) => {
      const y = Math.floor(height * ratio);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    });

    ctx.setLineDash([]);
  }, [zoom, activePreset, height]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'spectrogram_analysis.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <div
      style={{
        background: 'rgba(5,13,31,0.90)',
        border: '1px solid rgba(6,182,212,0.16)',
        borderRadius: '12px',
        padding: '14px 16px',
        overflow: 'hidden',
      }}
    >
      {/* Header toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={14} style={{ color: 'var(--cyan-500)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            Spectrogram Signal Analysis
          </span>
          <span className="telem-tag" style={{ fontSize: '9px', padding: '1px 6px' }}>
            0–8 kHz FFT
          </span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Preset buttons */}
          {(['plasma', 'viridis', 'cyan'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setActivePreset(p)}
              style={{
                padding: '2px 7px',
                borderRadius: '4px',
                fontSize: '9px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                textTransform: 'uppercase',
                border: activePreset === p ? '1px solid var(--cyan-500)' : '1px solid rgba(255,255,255,0.08)',
                background: activePreset === p ? 'rgba(6,182,212,0.14)' : 'transparent',
                color: activePreset === p ? 'var(--cyan-500)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}

          <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />

          <button className="btn-icon" style={{ width: '26px', height: '26px' }} onClick={() => setZoom(z => Math.min(z + 0.5, 3))} title="Zoom in">
            <ZoomIn size={12} />
          </button>
          <button className="btn-icon" style={{ width: '26px', height: '26px' }} onClick={() => setZoom(z => Math.max(z - 0.5, 1))} title="Zoom out">
            <ZoomOut size={12} />
          </button>
          <button className="btn-icon" style={{ width: '26px', height: '26px' }} onClick={() => setZoom(1)} title="Reset zoom">
            <RotateCcw size={12} />
          </button>
          <button className="btn-icon" style={{ width: '26px', height: '26px' }} onClick={handleDownload} title="Export PNG">
            <Download size={12} />
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: `${height}px` }} />

        {/* Y-axis frequency ticks */}
        <div style={{ position: 'absolute', top: 4, left: 6, display: 'flex', flexDirection: 'column', gap: '28px', pointerEvents: 'none' }}>
          {['8 kHz', '4 kHz', '2 kHz', '0 Hz'].map((f) => (
            <span key={f} style={{ fontSize: '8px', fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.5)', textShadow: '0 1px 2px black' }}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpectrogramViewer;
