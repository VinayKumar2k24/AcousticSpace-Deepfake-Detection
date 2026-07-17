import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Trash2,
  Download,
  Eye,
  ChevronUp,
  ChevronDown,
  Filter,
  History as HistoryIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/Common/GlassCard';
import type { HistoryItem, Prediction } from '../types';

type SortKey = keyof HistoryItem;

const History: React.FC = () => {
  const { history, clearHistory, removeFromHistory, setCurrentResult } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterPred, setFilterPred] = useState<Prediction | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    let items = [...history];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((h) => h.filename.toLowerCase().includes(q));
    }
    if (filterPred !== 'ALL') {
      items = items.filter((h) => h.prediction === filterPred);
    }
    items.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [history, search, filterPred, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const handleView = (item: HistoryItem) => {
    setCurrentResult({
      filename: item.filename,
      prediction: item.prediction,
      confidence: item.confidence,
      processing_time: item.processing_time,
      timestamp: item.timestamp,
      model_used: item.model_used,
    });
    navigate('/results');
  };

  const handleDownloadItem = (item: HistoryItem) => {
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${item.filename}_${item.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : (
      <ChevronDown size={12} style={{ opacity: 0.3 }} />
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HistoryIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
            Analysis History
          </h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {history.length} total records
          </p>
        </div>
        {history.length > 0 && (
          <button
            className="btn-secondary flex items-center gap-2 text-xs"
            onClick={() => { if (confirm('Clear all history?')) clearHistory(); }}
            style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-col sm:flex-row gap-3" animate={false}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="cyber-input pl-9"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <select
              className="cyber-input pl-9 pr-4 appearance-none"
              style={{ minWidth: '160px' }}
              value={filterPred}
              onChange={(e) => { setFilterPred(e.target.value as any); setPage(1); }}
            >
              <option value="ALL">All Predictions</option>
              <option value="REAL HUMAN VOICE">Real Human Voice</option>
              <option value="DEEPFAKE VOICE">Deepfake Voice</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden" animate={false}>
        {paginated.length === 0 ? (
          <div className="text-center py-16">
            <HistoryIcon size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-white font-semibold mb-1">
              {history.length === 0 ? 'No analyses yet' : 'No results matching filters'}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {history.length === 0
                ? 'Upload audio files to build your analysis history'
                : 'Try adjusting your search or filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="cyber-table">
              <thead>
                <tr>
                  {(['filename', 'prediction', 'confidence', 'timestamp', 'processing_time'] as SortKey[]).map(
                    (col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1">
                          {col === 'filename' ? 'Audio Name' :
                           col === 'prediction' ? 'Prediction' :
                           col === 'confidence' ? 'Confidence' :
                           col === 'timestamp' ? 'Date' : 'Proc. Time'}
                          <SortIcon col={col} />
                        </div>
                      </th>
                    )
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td className="max-w-xs">
                      <span className="truncate block text-sm text-white">{item.filename}</span>
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
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: item.prediction === 'REAL HUMAN VOICE' ? '#10b981' : '#ef4444',
                          fontFamily: 'JetBrains Mono',
                        }}
                      >
                        {item.confidence.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-xs">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="text-xs" style={{ fontFamily: 'JetBrains Mono' }}>
                      {item.processing_time}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-cyan-400"
                          style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(6,182,212,0.15)' }}
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => handleDownloadItem(item)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-cyan-400"
                          style={{ background: 'rgba(6,182,212,0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(6,182,212,0.15)' }}
                          title="Download Report"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => removeFromHistory(item.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-red-400"
                          style={{ background: 'rgba(239,68,68,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(239,68,68,0.12)' }}
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: 'rgba(6,182,212,0.08)' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Page {page} of {totalPages} ({filtered.length} results)
            </span>
            <div className="flex gap-2">
              <button
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <button
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
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
