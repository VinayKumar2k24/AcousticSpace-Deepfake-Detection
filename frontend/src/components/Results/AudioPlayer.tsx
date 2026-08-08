import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  AudioWaveform,
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface AudioPlayerProps {
  audioUrl: string;
  filename: string;
  accentColor: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, filename, accentColor }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const SPEEDS = [0.5, 1, 1.5, 2];

  // Sync audio element settings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed]);

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); audio.currentTime = 0; };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      await audio.play();
    }
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Animated waveform bars (decorative, represents activity)
  const BAR_COUNT = 28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(6,182,212,0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}
        >
          <AudioWaveform size={15} style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Audio Player</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{filename}</p>
        </div>
        {/* Playback speed */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="text-xs px-2 py-1 rounded-md font-medium transition-all"
              style={{
                background: speed === s ? `${accentColor}22` : 'rgba(255,255,255,0.04)',
                color: speed === s ? accentColor : 'var(--text-muted)',
                border: `1px solid ${speed === s ? `${accentColor}44` : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {/* Waveform visualizer (decorative) */}
      <div className="flex items-center justify-center gap-[3px] h-10 mb-4 overflow-hidden rounded-xl px-2"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          // Pseudo-random heights for visual variety
          const seed = ((i * 7 + 3) % 11) / 10;
          const baseH = 10 + seed * 24;
          const isActive = isPlaying && (i / BAR_COUNT) < (progressPct / 100 + 0.04);
          return (
            <motion.div
              key={i}
              className="rounded-full flex-shrink-0"
              style={{
                width: 3,
                height: baseH,
                background: isActive ? accentColor : 'rgba(255,255,255,0.12)',
                transition: 'background 0.15s',
              }}
              animate={
                isPlaying && isActive
                  ? { scaleY: [1, 1.4 + seed * 0.6, 1], opacity: [0.7, 1, 0.7] }
                  : { scaleY: 1, opacity: isActive ? 0.7 : 0.3 }
              }
              transition={{ repeat: Infinity, duration: 0.5 + seed * 0.4, delay: i * 0.02 }}
            />
          );
        })}
      </div>

      {/* Seek bar */}
      <div className="mb-3">
        <div className="relative h-2 rounded-full mb-1 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          {/* Filled portion */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-100"
            style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }}
          />
          {/* Native range (transparent, on top for interaction) */}
          <input
            ref={seekRef}
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={!isLoaded}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            style={{ WebkitAppearance: 'none' }}
          />
        </div>
        {/* Time display */}
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handlePlayPause}
          disabled={!isLoaded}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
            boxShadow: isPlaying ? `0 0 20px ${accentColor}55` : 'none',
            opacity: isLoaded ? 1 : 0.5,
          }}
        >
          {isPlaying ? <Pause size={18} color="#fff" /> : <Play size={18} color="#fff" style={{ marginLeft: 2 }} />}
        </motion.button>

        {/* Stop */}
        <button
          onClick={handleStop}
          disabled={!isLoaded}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-secondary)',
            opacity: isLoaded ? 1 : 0.5,
          }}
        >
          <Square size={14} />
        </button>

        {/* Volume area */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button onClick={toggleMute} className="flex-shrink-0 transition-colors"
            style={{ color: isMuted ? 'var(--text-muted)' : 'var(--accent-cyan)' }}
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="relative flex-1 h-1.5 rounded-full overflow-visible"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${(isMuted ? 0 : volume) * 100}%`,
                background: 'var(--accent-cyan)',
                transition: 'width 0.1s',
              }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ height: '100%', WebkitAppearance: 'none' }}
            />
          </div>
          <span className="text-xs flex-shrink-0 font-mono" style={{ color: 'var(--text-muted)', minWidth: 28 }}>
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Loading state */}
        {!isLoaded && (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading…</span>
        )}
      </div>
    </motion.div>
  );
};

export default AudioPlayer;
