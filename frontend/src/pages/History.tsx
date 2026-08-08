import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Trash2, Download, Eye, ChevronUp, ChevronDown,
  Filter, History as HistoryIcon, ShieldCheck, ShieldAlert,
  Zap, ArrowRight, RefreshCw, FileText, CheckCircle2, AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/Common/GlassCard';
import type { HistoryItem, Prediction } from '../types';
import { getRiskLevel, RISK_CONFIG, type RiskLevel } from '../utils/riskHelper';
import { generatePdfReport } from '../utils/generatePdfReport';
import { isRealHuman, isAiGenerated } from '../utils/analysisStats';

type SortKey = 'timestamp' | 'confidence' | 'filename' | 'processing_time';

const History: React.FC = () => {
  const { history, clearHistory, removeFromHistory, setCurrentResult, setCurrentFile, settings } = useApp();
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch]             = useState('');
  const [filterPred, setFilterPred]     = useState<Prediction | 'ALL'>('ALL');
  const [filterRisk, setFilterRisk]     = useState<RiskLevel | 'ALL'>('ALL');
  const [filterDate, setFilterDate]     = useState<'ALL' | 'TODAY' | 'LAST_7' | 'LAST_30'>('ALL');

  // Sorting & Pagination
  const [sortKey, setSortKey]           = useState<SortKey>('timestamp');
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc');
  const [page, setPage]                 = useState(1);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let items = [...history];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (h) =>
          h.filename.toLowerCase().includes(q) ||
          h.prediction.toLowerCase().includes(q) ||
          (h.id && h.id.toLowerCase().includes(q))
      );
    }

    if (filterPred !== 'ALL') {
      items = items.filter((h) =>
        filterPred === 'REAL HUMAN VOICE' ? isRealHuman(h.prediction) : isAiGenerated(h.prediction)
      );
    }

    if (filterRisk !== 'ALL') {
      items = items.filter((h) => {
        const isReal = isRealHuman(h.prediction);
        return getRiskLevel(h.confidence, isReal) === filterRisk;
      });
    }

    if (filterDate !== 'ALL') {
      const now        = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      items = items.filter((h) => {
        const itemTime = new Date(h.timestamp).getTime();
        if (filterDate === 'TODAY')   return itemTime >= todayStart;
        if (filterDate === 'LAST_7')  return itemTime >= now.getTime() - 7 * 86400000;
        if (filterDate === 'LAST_30') return itemTime >= now.getTime() - 30 * 86400000;
        return true;
      });
    }

    items.sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      if (sortKey === 'timestamp') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  }, [history, search, filterPred, filterRisk, filterDate, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleView = (item: HistoryItem) => {
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

  const handlePdfDownload = async (item: HistoryItem) => {
    setDownloadingId(item.id);
    try {
      const isReal  = isRealHuman(item.prediction);
      const risk    = getRiskLevel(item.confidence, isReal);
      const fileObj = item.fileSize
        ? { file: new File([], item.filename), name: item.filename, size: item.fileSize, duration: item.duration, format: item.filename.split('.').pop() || 'audio', url: '' }
        : null;

      const getImg = (p?: string) => {
        if (!p) return '';
        if (p.startsWith('http://') || p.startsWith('https://')) return p;
        const base = settings.backendUrl.endsWith('/') ? settings.backendUrl.slice(0, -1) : settings.backendUrl;
        return `${base}${p.startsWith('/') ? p : '/' + p}`;
      };

      const explanation = isReal
        ? 'Natural vocal resonance, spectral continuity, and room impulse response metrics confirm authentic human speech.'
        : 'Spectral anomalies, phase mismatches, and synthetic RIR characteristics indicate AI voice cloning.';

      await generatePdfReport(
        { filename: item.filename, prediction: item.prediction, confidence: item.confidence, processing_time: item.processing_time, timestamp: item.timestamp, features: item.features, breathing: item.breathing },
        fileObj,
        settings,
        isReal,
        explanation,
        risk,
        getImg
      );
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1280px', margin: '0 auto' }}
    >
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HistoryIcon size={16} style={{ color: 'var(--cyan-500)' }} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Forensic Audit Log & History
            </h1>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Searchable log of all deepfake audio detection records, confidence metrics, and PDF exports.
          </p>
        </div>

        {history.length > 0 && (
          <button
            className="btn-danger"
            style={{ fontSize: '12px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => { if (window.confirm('Clear all analysis history records?')) clearHistory(); }}
          >
            <Trash2 size={13} />
            Clear Log
          </button>
        )}
      </div>

      {/* ── Filter Toolbar ──────────────────────────────────────────── */}
      <GlassCard className="p-4" animate={false}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="cyber-input"
              placeholder="Search filename or verdict..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '34px' }}
            />
          </div>

          {/* Verdict Filter */}
          <select className="cyber-select" value={filterPred} onChange={e => setFilterPred(e.target.value as any)}>
            <option value="ALL">All Verdicts</option>
            <option value="REAL HUMAN VOICE">Real Human Voice</option>
            <option value="AI GENERATED VOICE">AI Generated Voice</option>
          </select>

          {/* Risk Filter */}
          <select className="cyber-select" value={filterRisk} onChange={e => setFilterRisk(e.target.value as any)}>
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
          </select>

          {/* Date Filter */}
          <select className="cyber-select" value={filterDate} onChange={e => setFilterDate(e.target.value as any)}>
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="LAST_7">Last 7 Days</option>
            <option value="LAST_30">Last 30 Days</option>
          </select>

          {/* Result Count */}
          <span className="telem-tag" style={{ fontSize: '10px' }}>
            {filtered.length} RECORDS
          </span>
        </div>
      </GlassCard>

      {/* ── Data Table ──────────────────────────────────────────────── */}
      <GlassCard className="p-5" animate={false}>
        {paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <HistoryIcon size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {history.length === 0 ? 'No Forensic History Available' : 'No Records Match Filter Criteria'}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {history.length === 0 ? 'Analyze an audio file to start building your persistent history.' : 'Try adjusting search or filter parameters.'}
            </p>
            {history.length === 0 && (
              <button className="btn-primary" style={{ fontSize: '12px', padding: '8px 18px' }} onClick={() => navigate('/audio-analysis')}>
                Start New Analysis
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="cyber-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('filename')} style={{ cursor: 'pointer' }}>
                    File Name {sortKey === 'filename' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th>Verdict</th>
                  <th onClick={() => handleSort('confidence')} style={{ cursor: 'pointer' }}>
                    Confidence {sortKey === 'confidence' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th>Risk Level</th>
                  <th onClick={() => handleSort('timestamp')} style={{ cursor: 'pointer' }}>
                    Date & Time {sortKey === 'timestamp' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th>Proc. Time</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item) => {
                  const isReal  = isRealHuman(item.prediction);
                  const risk    = getRiskLevel(item.confidence, isReal);
                  const riskCfg = RISK_CONFIG[risk];
                  const color   = isReal ? '#10b981' : '#ef4444';

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
                        <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', padding: '2px 7px', borderRadius: '4px', background: riskCfg.bg, border: `1px solid ${riskCfg.border}`, color: riskCfg.color }}>
                          {riskCfg.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {new Date(item.timestamp).toLocaleString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                          {item.inference_time || item.processing_time || '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            style={{ width: '28px', height: '28px' }}
                            onClick={() => handleView(item)}
                            title="View forensic report"
                          >
                            <Eye size={12} />
                          </button>

                          <button
                            className="btn-icon"
                            style={{ width: '28px', height: '28px' }}
                            onClick={() => handlePdfDownload(item)}
                            disabled={downloadingId === item.id}
                            title="Download PDF report"
                          >
                            <Download size={12} />
                          </button>

                          <button
                            className="btn-icon"
                            style={{ width: '28px', height: '28px', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
                            onClick={() => removeFromHistory(item.id)}
                            title="Delete record"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(6,182,212,0.08)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
              Showing Page {page} of {totalPages} ({filtered.length} total entries)
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <button
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
};

export default History;
