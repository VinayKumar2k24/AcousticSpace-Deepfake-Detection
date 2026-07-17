import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Info, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeAudio } from '../services/api';
import DropZone, { type FileInfo } from '../components/Upload/DropZone';
import WaveformViewer from '../components/Waveform/WaveformViewer';
import AIScanner from '../components/Loading/AIScanner';
import GlassCard from '../components/Common/GlassCard';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const {
    addToHistory,
    setCurrentResult,
    setCurrentFile,
    isAnalyzing,
    setIsAnalyzing,
    uploadProgress,
    setUploadProgress,
  } = useApp();

  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback((info: FileInfo) => {
    setSelectedFile(info);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    if (selectedFile) URL.revokeObjectURL(selectedFile.url);
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
  }, [selectedFile, setUploadProgress]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    setError(null);
    setIsAnalyzing(true);
    setUploadProgress(0);

    const startTime = performance.now();
    try {
      const result = await analyzeAudio(selectedFile.file, setUploadProgress);
      const endTime = performance.now();

      // Compute processing time if not returned by backend
      if (!result.processing_time) {
        result.processing_time = `${((endTime - startTime) / 1000).toFixed(2)} sec`;
      }

      // Default filename if not returned by backend
      if (!result.filename) {
        result.filename = selectedFile.name;
      }

      result.timestamp = new Date().toISOString();
      setCurrentResult(result);
      setCurrentFile(selectedFile);
      addToHistory(result, selectedFile);
      navigate('/results');
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to connect to backend. Ensure FastAPI is running.';
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, setIsAnalyzing, setUploadProgress, setCurrentResult, setCurrentFile, addToHistory, navigate]);

  return (
    <>
      <AnimatePresence>{isAnalyzing && <AIScanner />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 max-w-3xl mx-auto"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mic size={20} style={{ color: 'var(--accent-cyan)' }} />
            Audio Analysis
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Upload an audio file to analyze it for deepfake detection using RIR
          </p>
        </div>

        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl text-sm"
          style={{
            background: 'rgba(6,182,212,0.06)',
            border: '1px solid rgba(6,182,212,0.2)',
            color: 'var(--text-secondary)',
          }}
        >
          <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-cyan)' }} />
          <p>
            Supported formats: <strong style={{ color: 'var(--accent-cyan)' }}>WAV, FLAC, MP3, AAC</strong>
            {' '}— Audio is sent to the FastAPI backend at{' '}
            <code
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ background: 'rgba(6,182,212,0.15)', fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}
            >
              POST /predict
            </code>
            {' '}for real-time AI analysis.
          </p>
        </motion.div>

        {/* Drop Zone */}
        <GlassCard className="p-6" animate={false}>
          <DropZone
            onFileSelected={handleFileSelected}
            onClear={handleClear}
            selectedFile={selectedFile}
            uploadProgress={uploadProgress}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </GlassCard>

        {/* Waveform */}
        <AnimatePresence>
          {selectedFile && (
            <WaveformViewer audioUrl={selectedFile.url} fileName={selectedFile.name} />
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
              }}
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Upload;
