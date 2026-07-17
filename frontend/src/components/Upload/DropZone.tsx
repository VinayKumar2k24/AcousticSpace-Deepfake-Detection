import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, Music, Info } from 'lucide-react';

const ACCEPTED_FORMATS = ['audio/wav', 'audio/flac', 'audio/mpeg', 'audio/aac', 'audio/x-wav', 'audio/mp3'];
const ACCEPTED_EXT = ['.wav', '.flac', '.mp3', '.aac'];

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
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXT.includes(ext) && !ACCEPTED_FORMATS.includes(file.type)) {
      setError(`Unsupported format. Please use: ${ACCEPTED_EXT.join(', ')}`);
      return;
    }
    const url = URL.createObjectURL(file);
    const duration = await getAudioDuration(file);
    onFileSelected({
      file,
      name: file.name,
      size: formatBytes(file.size),
      format: ext.replace('.', '').toUpperCase(),
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
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent-cyan)' : 'rgba(6,182,212,0.25)'}`,
              background: isDragging
                ? 'rgba(6,182,212,0.06)'
                : 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease',
              minHeight: '280px',
            }}
            onClick={() => document.getElementById('audio-file-input')?.click()}
          >
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full py-16 px-8 text-center">
              <motion.div
                animate={isDragging ? { scale: 1.15, y: -8 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}
              >
                <Upload size={36} style={{ color: 'var(--accent-cyan)' }} />
              </motion.div>

              <h3 className="text-xl font-bold text-white mb-2">
                {isDragging ? 'Drop your audio file here' : 'Drag & Drop Audio File'}
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                or click to browse your files
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                {['WAV', 'FLAC', 'MP3', 'AAC'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(6,182,212,0.1)',
                      border: '1px solid rgba(6,182,212,0.2)',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    .{fmt.toLowerCase()}
                  </span>
                ))}
              </div>

              <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                Maximum file size: 50 MB
              </p>
            </div>

            <input
              id="audio-file-input"
              type="file"
              accept=".wav,.flac,.mp3,.aac,audio/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(6,182,212,0.3)' }}
              >
                <Music size={24} style={{ color: 'var(--accent-cyan)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white truncate">{selectedFile.name}</h4>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}
                    >
                      {selectedFile.format}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onClear(); }}
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    style={{ color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { label: 'File Size', value: selectedFile.size },
                    { label: 'Duration', value: selectedFile.duration || '—' },
                    { label: 'Format', value: selectedFile.format },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg p-2.5 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}
                    >
                      <div className="text-xs font-bold text-white" style={{ fontFamily: 'JetBrains Mono' }}>{value}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
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
              <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: '#10b981' }}>
                <CheckCircle size={14} />
                <span>Upload complete</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
          >
            <Info size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <button className="btn-secondary flex-1" onClick={onClear} disabled={isAnalyzing}>
            Clear
          </button>
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={onAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <File size={16} />
                Analyze Audio
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
