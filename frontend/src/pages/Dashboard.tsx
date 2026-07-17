import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Files,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Timer,
  Cpu,
  Server,
  Tag,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/Cards/StatCard';
import GlassCard from '../components/Common/GlassCard';
import type { Prediction } from '../types';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const Dashboard: React.FC = () => {
  const { history, settings } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = history.length;
    const fakes = history.filter((h) => h.prediction === 'DEEPFAKE VOICE').length;
    const humans = total - fakes;
    const avgConf =
      total > 0 ? history.reduce((a, h) => a + h.confidence, 0) / total : 0;
    return { total, fakes, humans, avgConf };
  }, [history]);

  const recent = history.slice(0, 6);

  const getPredColor = (p: Prediction) =>
    p === 'REAL HUMAN VOICE' ? '#10b981' : '#ef4444';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(139,92,246,0.06) 100%)',
          border: '1px solid rgba(6,182,212,0.2)',
        }}
      >
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="status-online text-xs font-semibold" style={{ color: '#10b981' }}>
                System Online
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome to{' '}
              <span className="gradient-text">AcousticSpace</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              AI-Powered Deepfake Audio Detection using Room Impulse Response
            </p>
          </div>
          <button
            className="btn-primary flex items-center gap-2 self-start"
            onClick={() => navigate('/upload')}
          >
            <Activity size={16} />
            New Analysis
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Audio Files"
          value={stats.total}
          icon={Files}
          iconColor="#06b6d4"
          iconBg="rgba(6,182,212,0.12)"
          delay={0}
        />
        <StatCard
          label="Deepfakes Detected"
          value={stats.fakes}
          icon={AlertTriangle}
          iconColor="#ef4444"
          iconBg="rgba(239,68,68,0.12)"
          glowColor="rgba(239,68,68,0.1)"
          delay={0.07}
        />
        <StatCard
          label="Human Voices"
          value={stats.humans}
          icon={UserCheck}
          iconColor="#10b981"
          iconBg="rgba(16,185,129,0.12)"
          glowColor="rgba(16,185,129,0.1)"
          delay={0.14}
        />
        <StatCard
          label="Avg. Confidence"
          value={parseFloat(stats.avgConf.toFixed(1))}
          icon={TrendingUp}
          iconColor="#8b5cf6"
          iconBg="rgba(139,92,246,0.12)"
          suffix="%"
          glowColor="rgba(139,92,246,0.08)"
          delay={0.21}
        />
      </div>

      {/* System Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Server, label: 'System Status', value: 'Online', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { icon: Cpu, label: 'GPU Status', value: 'Ready', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { icon: Tag, label: 'Model Version', value: settings.modelVersion || 'RIR-v1.0', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          { icon: Timer, label: 'Threshold', value: `${(settings.inferenceThreshold * 100).toFixed(0)}%`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + i * 0.07 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
              <item.icon size={16} style={{ color: item.color }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              <div
                className="text-sm font-bold"
                style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {item.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-white">Recent Analysis</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Latest audio detection results
            </p>
          </div>
          <button
            className="btn-secondary text-xs px-3 py-1.5"
            onClick={() => navigate('/history')}
          >
            View All
          </button>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}
            >
              <Files size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-sm font-medium text-white mb-1">No analyses yet</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Upload an audio file to get started
            </p>
            <button className="btn-primary text-sm" onClick={() => navigate('/upload')}>
              Upload Audio
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td className="max-w-xs">
                      <span className="truncate block">{item.filename}</span>
                    </td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.prediction === 'REAL HUMAN VOICE' ? 'badge-real' : 'badge-fake'
                        }`}
                      >
                        {item.prediction === 'REAL HUMAN VOICE' ? '✓ Real' : '⚠ Fake'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-track w-16">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${item.confidence}%`,
                              background: `linear-gradient(90deg, ${getPredColor(item.prediction)}, ${getPredColor(item.prediction)}aa)`,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: getPredColor(item.prediction), fontFamily: 'JetBrains Mono' }}
                        >
                          {item.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '12px' }}>
                      {item.processing_time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
