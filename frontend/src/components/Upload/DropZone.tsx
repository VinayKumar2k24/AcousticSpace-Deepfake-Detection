import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileAudio, X, CheckCircle2, AlertCircle, Sparkles, HardDrive, Clock, FileType } from 'lucide-react';

const ACCEPTED_FORMATS = ['audio/wav', 'audio/flac', 'audio/mpeg', 'audio/aac', 'audio/x-wav', 'audio/mp3', 'audio/ogg', 'audio/m4a'];
const ACCEPTED_EXT     = ['.wav', '.flac', '.mp3', '.aac', '.ogg', '.m4a'];

interface FileInfo {
  file: File;
  name: string;
  size: string;
  format: string;
  url: string;
  duration?: string;
}

interface DropZoneProps {
  onFileSelected: (info: FileInfo) => void;
  onClear: () => void;
  selectedFile: FileInfo | null;
  uploadProgress: number;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getAudioDuration = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      const t = audio.duration;
      if (isNaN(t) || !isFinite(t)) { resolve('Unknown'); return; }
      const m = Math.floor(t / 60);
      const s = Math.floor(t % 60);
      resolve(`${m}:${s.toString().padStart(2, '0')}`);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => resolve('Unknown');
  });

const DropZone: React.FC<DropZoneProps> = ({
  onFileSelected,
  onClear,
  selectedFile,
  uploadProgress,
  onAnalyze,
  isAnalyzing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXT.includes(ext) && !ACCEPTED_FORMATS.includes(file.type)) {
      setError(`Unsupported format (${ext}). Supported: ${ACCEPTED_EXT.join(', ')}`);
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 100 MB');
      return;
    }
    const url = URL.createObjectURL(file);
    const duration = await getAudioDuration(file);
    onFileSelected({
      file,
      name: file.name,
      size: formatBytes(file.size),
      format: (ext.replace('.', '') || 'AUDIO').toUpperCase(),
      url,
      duration,
    });
  }, [onFileSelected]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('audio-file-input')?.click()}
            className={`upload-zone ${isDragging ? 'drag-over' : ''}`}
            style={{
              position: 'relative',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 24px',
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Background fine grid */}
            <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

            {/* Ambient center pulse */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Animated icon container */}
              <motion.div
                animate={isDragging ? { scale: 1.12, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.12))',
                  border: '1px solid rgba(6,182,212,0.30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 0 20px rgba(6,182,212,0.18)',
                }}
              >
                <Upload size={28} style={{ color: 'var(--cyan-500)' }} strokeWidth={2} />
              </motion.div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.01em' }}>
                {isDragging ? 'Drop Audio File for Forensics' : 'Drag & Drop Audio Recording'}
              </h3>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                or <span style={{ color: 'var(--cyan-500)', textDecoration: 'underline', cursor: 'pointer' }}>browse local filesystem</span>
              </p>

              {/* Supported format badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
                {['WAV', 'FLAC', 'MP3', 'AAC', 'OGG', 'M4A'].map((fmt) => (
                  <span key={fmt} className="telem-tag" style={{ fontSize: '9px', padding: '2px 7px' }}>
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>
                MAX FILE SIZE: 100 MB · DUAL-CHANNEL SUPPORTED
              </div>
            </div>

            <input
              id="audio-file-input"
              type="file"
              accept=".wav,.flac,.mp3,.aac,.ogg,.m4a,audio/*"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'rgba(9,20,40,0.85)',
              border: '1px solid rgba(6,182,212,0.20)',
              borderRadius: '14px',
              padding: '20px',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              {/* File Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.15))',
                  border: '1px solid rgba(6,182,212,0.30)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileAudio size={24} style={{ color: 'var(--cyan-500)' }} strokeWidth={2} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyBetween: 'space-between', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedFile.name}
                      </h4>
                      <span className="telem-tag" style={{ flexShrink: 0 }}>
                        {selectedFile.format}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      READY FOR MODEL INFERENCE
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="btn-icon"
                    title="Remove file"
                    style={{ border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Metadata cards grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
                  {[
                    { icon: HardDrive, label: 'FILE SIZE', value: selectedFile.size },
                    { icon: Clock,     label: 'DURATION',  value: selectedFile.duration || '—' },
                    { icon: FileType,  label: 'CONTAINER', value: selectedFile.format },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(6,182,212,0.10)',
                        borderRadius: '8px',
                        padding: '8px 10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginBottom: '3px' }}>
                        <Icon size={10} style={{ color: 'var(--cyan-500)' }} />
                        {label}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress bar during upload */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>
                  <span>TRANSMITTING TO API ENDPOINT...</span>
                  <span style={{ color: 'var(--cyan-500)' }}>{uploadProgress}%</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {uploadProgress === 100 && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 500 }}>
                <CheckCircle2 size={14} />
                <span>Payload buffered successfully</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
              fontSize: '12px',
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: '10px', marginTop: '4px' }}
        >
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClear} disabled={isAnalyzing}>
            Reset Selection
          </button>

          <button
            className="btn-primary"
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '14px',
            }}
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                Running AASIST Inference...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Run Forensic Analysis
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DropZone;
export type { FileInfo };
