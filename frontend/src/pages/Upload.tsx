import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, Info, Shield, Layers, Radio, Cpu, FileAudio } from 'lucide-react';
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
    backendOnline,
  } = useApp();

  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [error, setError]               = useState<string | null>(null);

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

      if (!result.processing_time) {
        result.processing_time = `${((endTime - startTime) / 1000).toFixed(2)} sec`;
      }
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
        'Failed to connect to backend. Ensure FastAPI service is online at http://localhost:8000.';
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, setIsAnalyzing, setUploadProgress, setCurrentResult, setCurrentFile, addToHistory, navigate]);

  return (
    <>
      <AnimatePresence>{isAnalyzing && <AIScanner />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px', margin: '0 auto' }}
      >
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.18), rgba(59,130,246,0.14))',
                  border: '1px solid rgba(6,182,212,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mic size={17} style={{ color: 'var(--cyan-500)' }} strokeWidth={2} />
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Audio Forensic Analyzer
              </h1>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Upload a voice recording to execute AASIST deep learning, RIR, and acoustic feature analysis.
            </p>
          </div>

          {/* Model Status Chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(9,20,40,0.80)',
              border: '1px solid rgba(6,182,212,0.14)',
            }}
          >
            <div
              className="status-dot"
              style={{
                background: backendOnline ? 'var(--safe-500)' : 'var(--threat-500)',
                boxShadow: `0 0 6px ${backendOnline ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'}`,
              }}
            />
            <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
              AASIST v1.0 Engine
            </span>
            <span className="telem-tag" style={{ fontSize: '9px' }}>
              {backendOnline ? 'READY' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* ── Technical Info Banner ───────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: '12px',
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.14)',
          }}
        >
          <Info size={16} style={{ color: 'var(--cyan-500)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Forensic Pipeline:</span> Uploaded audio is evaluated against 64,600 tensor samples @ 16 kHz using the <span style={{ color: 'var(--cyan-500)', fontFamily: 'JetBrains Mono, monospace' }}>POST /predict</span> FastAPI endpoint. RIR environmental cues and breathing consistency metrics are extracted simultaneously.
          </div>
        </div>

        {/* ── Upload Box ──────────────────────────────────────────────── */}
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

        {/* ── Waveform Preview ────────────────────────────────────────── */}
        <AnimatePresence>
          {selectedFile && (
            <WaveformViewer audioUrl={selectedFile.url} fileName={selectedFile.name} />
          )}
        </AnimatePresence>

        {/* ── Detection Pipeline Feature Preview (When no file selected) ── */}
        {!selectedFile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              {
                icon: Shield,
                title: 'AASIST Deep Learning',
                detail: 'Graph Attention Network assessing spectral graph connectivity for synthetic artifact detection.',
                color: '#06b6d4',
              },
              {
                icon: Radio,
                title: 'RIR Analysis',
                detail: 'Room Impulse Response profiling to verify natural acoustic environment reverberation patterns.',
                color: '#3b82f6',
              },
              {
                icon: Layers,
                title: 'Multi-Feature Spectrogram',
                detail: 'Full extraction of MFCC, Chroma, Spectral Contrast, Zero Crossing Rate, and RMS Energy.',
                color: '#8b5cf6',
              },
            ].map(({ icon: Icon, title, detail, color }, i) => (
              <GlassCard key={i} variant="evidence" animate={true} delay={0.1 + i * 0.08} className="p-4">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      background: `${color}14`,
                      border: `1px solid ${color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {title}
                  </div>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {detail}
                </p>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ── Error Banner ────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444',
                fontSize: '13px',
              }}
            >
              <strong>Analysis Failed:</strong> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Upload;
