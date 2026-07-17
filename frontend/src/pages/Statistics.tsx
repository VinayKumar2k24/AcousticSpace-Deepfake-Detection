import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Target, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/Common/GlassCard';
import {
  RealFakePieChart,
  DailyLineChart,
  ConfidenceBarChart,
  TimelineChart,
} from '../components/Charts';

const Statistics: React.FC = () => {
  const { history } = useApp();

  const stats = useMemo(() => {
    const total = history.length;
    const fakes = history.filter((h) => h.prediction === 'DEEPFAKE VOICE').length;
    const reals = total - fakes;
    const avgConf = total > 0 ? history.reduce((a, h) => a + h.confidence, 0) / total : 0;

    // Pie data
    const pieData = [
      { name: 'Real Human Voice', value: reals, color: '#10b981' },
      { name: 'Deepfake Voice', value: fakes, color: '#ef4444' },
    ];

    // Daily line chart: group by day (last 7)
    const dayMap: Record<string, { real: number; fake: number }> = {};
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      dayMap[d.toLocaleDateString('en', { weekday: 'short' })] = { real: 0, fake: 0 };
    }
    history.forEach((h) => {
      const d = new Date(h.timestamp).toLocaleDateString('en', { weekday: 'short' });
      if (dayMap[d]) {
        if (h.prediction === 'REAL HUMAN VOICE') dayMap[d].real++;
        else dayMap[d].fake++;
      }
    });
    const dailyData = Object.entries(dayMap).map(([name, v]) => ({ name, ...v }));

    // Confidence bar chart
    const ranges = ['0-60', '60-70', '70-80', '80-90', '90-100'];
    const confDist = ranges.map((range) => {
      const [lo, hi] = range.split('-').map(Number);
      return {
        range,
        count: history.filter((h) => h.confidence >= lo && h.confidence < hi).length,
      };
    });
    // Fix last range to be inclusive
    confDist[confDist.length - 1].count += history.filter((h) => h.confidence === 100).length;

    // Timeline (last 15 entries)
    const timelineData = [...history]
      .slice(0, 15)
      .reverse()
      .map((h, i) => ({
        time: `#${i + 1}`,
        confidence: h.confidence,
      }));

    return { total, fakes, reals, avgConf, pieData, dailyData, confDist, timelineData };
  }, [history]);

  const accuracy = stats.total > 0 ? 94.8 : 0; // static model accuracy

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={20} style={{ color: 'var(--accent-cyan)' }} />
          Model Statistics
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Performance metrics and analysis distribution
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: 'Total Analyses', value: stats.total, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          { icon: Target, label: 'Model Accuracy', value: `${accuracy}%`, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { icon: TrendingUp, label: 'Avg. Confidence', value: `${stats.avgConf.toFixed(1)}%`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { icon: Zap, label: 'Deepfakes Found', value: stats.fakes, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color, fontFamily: 'JetBrains Mono' }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Real vs Fake Distribution</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Overall prediction breakdown
          </p>
          {stats.total === 0 ? (
            <div className="h-64 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              No data yet
            </div>
          ) : (
            <RealFakePieChart data={stats.pieData} />
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Daily Predictions</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Last 7 days activity
          </p>
          <DailyLineChart data={stats.dailyData} />
        </GlassCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Confidence Distribution</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Score range breakdown
          </p>
          <ConfidenceBarChart data={stats.confDist} />
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Detection Timeline</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Confidence over last 15 analyses
          </p>
          {stats.timelineData.length === 0 ? (
            <div className="h-48 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
              No data yet
            </div>
          ) : (
            <TimelineChart data={stats.timelineData} />
          )}
        </GlassCard>
      </div>

      {/* Model Accuracy Card */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Model Accuracy</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              RIR-based deepfake detection model performance
            </p>
          </div>
          <span
            className="text-2xl font-bold"
            style={{ color: '#10b981', fontFamily: 'JetBrains Mono' }}
          >
            {accuracy}%
          </span>
        </div>
        <div className="progress-track h-3">
          <motion.div
            className="progress-fill h-3"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 1.5, delay: 0.3 }}
            style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>Baseline</span>
          <span>Production Threshold</span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default Statistics;
