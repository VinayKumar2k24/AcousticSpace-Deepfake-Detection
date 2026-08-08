import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Files, AlertTriangle, UserCheck, TrendingUp, Timer, Cpu,
  Server, Tag, ArrowRight, Activity, Zap, Clock, Eye, Shield,
  Radio, HardDrive, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/Cards/StatCard';
import GlassCard from '../components/Common/GlassCard';
import { calculateStatistics, isRealHuman, getPredictionLabel } from '../utils/analysisStats';
import type { HistoryItem } from '../types';

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.05 } },
};

const Dashboard: React.FC = () => {
  const { history, settings, setCurrentResult, setCurrentFile, backendOnline } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => calculateStatistics(history), [history]);

  const handleViewItem = (item: HistoryItem) => {
    setCurrentResult({
      filename:        item.filename,
      prediction:      item.prediction,
      confidence:      item.confidence,
      processing_time: item.processing_time,
      inference_time:  item.inference_time,
      timestamp:       item.timestamp,
      model_used:      item.model_used,
      features:        item.features,
      breathing:       item.breathing,
    });

    if (item.fileSize) {
      setCurrentFile({
        file:       new File([], item.filename),
        name:       item.filename,
        size:       item.fileSize,
        duration:   item.duration,
        sampleRate: item.sampleRate,
        format:     item.filename.split('.').pop() || 'audio',
        url:        '',
      });
    }

    navigate('/results');
  };

  const getPredColor = (p?: string) => (isRealHuman(p) ? '#10b981' : '#ef4444');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px', margin: '0 auto' }}
    >
      {/* ── Command Center Hero Banner ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(9,20,40,0.92) 60%)',
          border: '1px solid rgba(6,182,212,0.20)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                className="status-pill"
                style={{
                  background: backendOnline ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${backendOnline ? 'rgba(16,185,129,0.22)' : 'rgba(239,68,68,0.22)'}`,
                  color: backendOnline ? '#10b981' : '#ef4444',
                }}
              >
                {backendOnline ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                {backendOnline ? 'ENGINE ACTIVE · FASTAPI CONNECTED' : 'BACKEND DISCONNECTED'}
              </div>
              <span className="telem-tag" style={{ fontSize: '9px' }}>
                AASIST v1.0
              </span>
            </div>

            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              AcousticSpace Command Center
            </h1>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              AI Audio Forensic Platform — Real-time RIR, AASIST Graph Attention & Acoustic Spectrum Detection
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', fontSize: '13px' }}
            onClick={() => navigate('/audio-analysis')}
          >
            <Activity size={16} />
            Start New Forensic Analysis
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>

      {/* ── KPI Stat Cards Grid (6 Columns) ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <StatCard
          label="Total Audio Files"
          value={stats.total}
          icon={Files}
          iconColor="#06b6d4"
          iconBg="rgba(6,182,212,0.10)"
          delay={0.04}
          subLabel="Persisted in history"
        />
        <StatCard
          label="Human Voices"
          value={stats.reals}
          icon={UserCheck}
          iconColor="#10b981"
          iconBg="rgba(16,185,129,0.10)"
          glowColor="rgba(16,185,129,0.06)"
          delay={0.08}
          subLabel="Verified authentic"
        />
        <StatCard
          label="Deepfakes Detected"
          value={stats.fakes}
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBg="rgba(239,68,68,0.10)"
          glowColor="rgba(239,68,68,0.06)"
          delay={0.12}
          subLabel="AI voice clones"
        />
        <StatCard
          label="Avg Confidence"
          value={parseFloat(stats.avgConf.toFixed(1))}
          icon={TrendingUp}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.10)"
          suffix="%"
          delay={0.16}
          subLabel="AASIST mean score"
        />
        <StatCard
          label="High Risk Items"
          value={stats.highRisks}
          icon={Zap}
          iconColor="#f59e0b"
          iconBg="rgba(245,158,11,0.10)"
          delay={0.20}
          subLabel="Action required"
        />
        <StatCard
          label="Avg Latency"
          value={stats.avgTime}
          icon={Clock}
          iconColor="#3b82f6"
          iconBg="rgba(59,130,246,0.10)"
          delay={0.24}
          subLabel="Inference time"
        />
      </div>

      {/* ── System Infrastructure Rail ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }} className="grid-cols-2 md:grid-cols-4">
        {[
          { icon: Server,    label: 'API Service', value: backendOnline ? 'Online (8000)' : 'Offline', color: backendOnline ? '#10b981' : '#ef4444' },
          { icon: Cpu,       label: 'GPU Accelerator', value: 'PyTorch CUDA', color: '#8b5cf6' },
          { icon: Tag,       label: 'Model Version',   value: settings.modelVersion || 'AASIST v1.0', color: '#06b6d4' },
          { icon: Timer,     label: 'Threshold Rate',  value: `${(settings.inferenceThreshold * 100).toFixed(0)}%`, color: '#f59e0b' },
        ].map((item, i) => (
          <GlassCard key={item.label} variant="evidence" animate={true} delay={0.28 + i * 0.05} className="p-3.5 flex items-center gap-3">
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${item.color}14`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <item.icon size={15} style={{ color: item.color }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.value}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* ── Recent Analysis Audit Log ──────────────────────────────────── */}
      <GlassCard className="p-5" animate={false}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={15} style={{ color: 'var(--cyan-500)' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Recent Forensic Activity
              </h3>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Latest voice analysis results from local audit store
            </p>
          </div>

          <button
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => navigate('/analysis-history')}
          >
            View Full Audit Log
            <ArrowRight size={12} />
          </button>
        </div>

        {stats.recentAnalyses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Files size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>No Forensic Records Yet</div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Upload an audio file to run multi-layer AI deepfake analysis.
            </p>
            <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 18px' }} onClick={() => navigate('/audio-analysis')}>
              Upload Audio File
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Audio File</th>
                  <th>Verdict</th>
                  <th>Confidence</th>
                  <th>Inference</th>
                  <th>Timestamp</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAnalyses.map((item) => {
                  const isReal = isRealHuman(item.prediction);
                  const color  = getPredColor(item.prediction);

                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                          {item.filename}
                        </div>
                      </td>
                      <td>
                        <span className={isReal ? 'badge-real' : 'badge-fake'} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                          {isReal ? '✓ REAL HUMAN' : '⚠ AI GENERATED'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className="progress-track" style={{ width: '60px', height: '4px' }}>
                            <div className="progress-fill" style={{ width: `${item.confidence}%`, background: color }} />
                          </div>
                          <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color, fontWeight: 700 }}>
                            {item.confidence.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                          {item.inference_time || item.processing_time || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(item.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleViewItem(item)}
                          className="btn-secondary"
                          style={{ fontSize: '10px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={11} />
                          VIEW REPORT
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default Dashboard;
