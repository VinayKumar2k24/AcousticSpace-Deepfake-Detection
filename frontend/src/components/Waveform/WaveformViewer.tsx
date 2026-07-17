import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface WaveformViewerProps {
  audioUrl: string;
  fileName?: string;
}

const WaveformViewer: React.FC<WaveformViewerProps> = ({ audioUrl, fileName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoom, setZoom] = useState(50);
  const [muted, setMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [volume, setVolume] = useState(0.8);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;

    wsRef.current?.destroy();
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(6,182,212,0.5)',
      progressColor: 'rgba(6,182,212,1)',
      cursorColor: '#06b6d4',
      cursorWidth: 2,
      height: 80,
      normalize: true,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      backend: 'WebAudio',
    });

    ws.load(audioUrl).catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('WaveSurfer load error:', err);
      }
    });

    ws.on('ready', () => {
      setDuration(ws.getDuration());
      setIsReady(true);
      ws.setVolume(volume);
    });

    ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()));
    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('finish', () => { setIsPlaying(false); setCurrentTime(0); });

    wsRef.current = ws;
    return () => { ws.destroy(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => wsRef.current?.playPause();

  const handleZoom = (dir: 'in' | 'out') => {
    const next = dir === 'in' ? Math.min(zoom + 20, 200) : Math.max(zoom - 20, 10);
    setZoom(next);
    wsRef.current?.zoom(next);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    wsRef.current?.setMuted(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    wsRef.current?.setVolume(v);
    if (v === 0) setMuted(true);
    else setMuted(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Waveform Viewer</h3>
          {fileName && (
            <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
              {fileName}
            </p>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
          style={{
            background: isReady ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)',
            color: isReady ? '#10b981' : 'var(--accent-cyan)',
            border: `1px solid ${isReady ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.2)'}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: isReady ? '#10b981' : 'var(--accent-cyan)' }} />
          {isReady ? 'Ready' : 'Loading...'}
        </div>
      </div>

      {/* Waveform canvas */}
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(6,182,212,0.15)',
          minHeight: '96px',
        }}
      >
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 z-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="wave-bar" />
            ))}
          </div>
        )}
        <div ref={containerRef} className="w-full" style={{ padding: '8px 12px' }} />
      </div>

      {/* Timeline bar */}
      <div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!isReady}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' }}
        >
          {isPlaying ? <Pause size={18} color="white" /> : <Play size={18} color="white" />}
        </button>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom('out')}
            disabled={!isReady}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:text-cyan-400 disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(6,182,212,0.15)' }}
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs w-12 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            {zoom}x
          </span>
          <button
            onClick={() => handleZoom('in')}
            disabled={!isReady}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:text-cyan-400 disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(6,182,212,0.15)' }}
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="transition-colors hover:text-cyan-400"
            style={{ color: 'var(--text-secondary)' }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: 'var(--accent-cyan)' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WaveformViewer;
