import type { HistoryItem } from '../types';
import { getRiskLevel } from './riskHelper';

// ─── Canonical Classification Types ───────────────────────────────────────────
export type CanonicalPrediction = 'REAL_HUMAN' | 'AI_GENERATED';

/**
 * Normalizes any prediction string variation to canonical classification:
 * 'REAL_HUMAN' or 'AI_GENERATED'
 *
 * Mappings:
 * - 'REAL HUMAN VOICE', 'Real Human Voice', 'REAL', 'HUMAN', 'AUTHENTIC', 'REAL_HUMAN' -> REAL_HUMAN
 * - 'AI GENERATED VOICE', 'AI Generated Voice', 'DEEPFAKE VOICE', 'DEEPFAKE', 'FAKE VOICE', 'FAKE', 'AI', 'SYNTHETIC', 'AI_GENERATED' -> AI_GENERATED
 */
export const normalizePrediction = (prediction?: string): CanonicalPrediction => {
  if (!prediction) return 'REAL_HUMAN';
  const p = String(prediction).toUpperCase().trim();

  if (
    p.includes('FAKE') ||
    p.includes('DEEP') ||
    p.includes('AI') ||
    p.includes('SYNTHETIC') ||
    p === 'AI_GENERATED'
  ) {
    return 'AI_GENERATED';
  }

  if (
    p.includes('REAL') ||
    p.includes('HUMAN') ||
    p.includes('AUTHENTIC') ||
    p === 'REAL_HUMAN'
  ) {
    return 'REAL_HUMAN';
  }

  return 'REAL_HUMAN';
};

export const isRealHuman = (prediction?: string): boolean => {
  return normalizePrediction(prediction) === 'REAL_HUMAN';
};

export const isAiGenerated = (prediction?: string): boolean => {
  return normalizePrediction(prediction) === 'AI_GENERATED';
};

/**
 * Standard user-facing label getter
 */
export const getPredictionLabel = (
  prediction?: string
): 'REAL HUMAN VOICE' | 'AI GENERATED VOICE' => {
  return isRealHuman(prediction) ? 'REAL HUMAN VOICE' : 'AI GENERATED VOICE';
};

// ─── Unified Statistics Calculator Interface ─────────────────────────────────
export interface CalculatedStats {
  total: number;
  reals: number;
  fakes: number;
  avgConf: number;
  maxConf: number;
  minConf: number;
  highRisks: number;
  medRisks: number;
  lowRisks: number;
  avgTime: string;
  fastestTime: string;
  slowestTime: string;
  pieData: { name: string; value: number; color: string }[];
  riskPieData: { name: string; value: number; color: string }[];
  dailyData: { name: string; real: number; fake: number }[];
  confDist: { range: string; count: number }[];
  timelineData: { time: string; confidence: number }[];
  recentAnalyses: HistoryItem[];
}

/**
 * Authoritative single-source statistics calculation function.
 * Ensures Dashboard, History, and Model Statistics produce identical results.
 */
export const calculateStatistics = (history: HistoryItem[]): CalculatedStats => {
  // Validate and filter records
  const validRecords = (history || []).filter(
    (h) => h && typeof h === 'object' && h.filename && typeof h.confidence === 'number'
  );

  const total = validRecords.length;

  if (total === 0) {
    return {
      total: 0,
      reals: 0,
      fakes: 0,
      avgConf: 0,
      maxConf: 0,
      minConf: 0,
      highRisks: 0,
      medRisks: 0,
      lowRisks: 0,
      avgTime: '0 ms',
      fastestTime: '—',
      slowestTime: '—',
      pieData: [
        { name: 'Real Human Voice', value: 0, color: '#10b981' },
        { name: 'AI Generated Voice', value: 0, color: '#ef4444' },
      ],
      riskPieData: [
        { name: 'Low Risk', value: 0, color: '#10b981' },
        { name: 'Medium Risk', value: 0, color: '#f59e0b' },
        { name: 'High Risk', value: 0, color: '#ef4444' },
      ],
      dailyData: [],
      confDist: [
        { range: '0-60%', count: 0 },
        { range: '60-70%', count: 0 },
        { range: '70-80%', count: 0 },
        { range: '80-90%', count: 0 },
        { range: '90-100%', count: 0 },
      ],
      timelineData: [],
      recentAnalyses: [],
    };
  }

  let reals = 0;
  let fakes = 0;
  let highRisks = 0;
  let medRisks = 0;
  let lowRisks = 0;

  const confs: number[] = [];
  const timesInSec: number[] = [];

  validRecords.forEach((item) => {
    // 1. Classification
    const isReal = isRealHuman(item.prediction);
    if (isReal) {
      reals++;
    } else {
      fakes++;
    }

    // 2. Confidence normalization (ensure 0-100 range)
    let conf = item.confidence;
    if (conf <= 1 && conf > 0) conf = conf * 100; // float 0.986 -> 98.6
    confs.push(conf);

    // 3. Risk calculation
    const risk = getRiskLevel(conf, isReal);
    if (risk === 'HIGH') highRisks++;
    else if (risk === 'MEDIUM') medRisks++;
    else lowRisks++;

    // 4. Processing time parsing
    const timeStr = item.inference_time || item.processing_time || '';
    if (timeStr) {
      const num = parseFloat(timeStr.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) {
        if (timeStr.toLowerCase().includes('ms')) {
          timesInSec.push(num / 1000);
        } else {
          timesInSec.push(num);
        }
      }
    }
  });

  // Confidence calculations
  const sumConf = confs.reduce((a, b) => a + b, 0);
  const avgConf = sumConf / total;
  const maxConf = Math.max(...confs);
  const minConf = Math.min(...confs);

  // Time calculations
  let avgTimeStr = '—';
  let fastestStr = '—';
  let slowestStr = '—';

  if (timesInSec.length > 0) {
    const avgSec = timesInSec.reduce((a, b) => a + b, 0) / timesInSec.length;
    const minSec = Math.min(...timesInSec);
    const maxSec = Math.max(...timesInSec);

    const fmt = (sec: number) => (sec < 1 ? `${Math.round(sec * 1000)} ms` : `${sec.toFixed(2)} sec`);
    avgTimeStr = fmt(avgSec);
    fastestStr = fmt(minSec);
    slowestStr = fmt(maxSec);
  } else if (validRecords[0]?.inference_time || validRecords[0]?.processing_time) {
    avgTimeStr = validRecords[0].inference_time || validRecords[0].processing_time || '—';
  }

  // Pie chart data
  const pieData = [
    { name: 'Real Human Voice', value: reals, color: '#10b981' },
    { name: 'AI Generated Voice', value: fakes, color: '#ef4444' },
  ];

  const riskPieData = [
    { name: 'Low Risk', value: lowRisks, color: '#10b981' },
    { name: 'Medium Risk', value: medRisks, color: '#f59e0b' },
    { name: 'High Risk', value: highRisks, color: '#ef4444' },
  ];

  // Daily activity (last 7 days)
  const dayMap: Record<string, { real: number; fake: number }> = {};
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    dayMap[d.toLocaleDateString('en-US', { weekday: 'short' })] = { real: 0, fake: 0 };
  }

  validRecords.forEach((h) => {
    const d = new Date(h.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    if (dayMap[d]) {
      if (isRealHuman(h.prediction)) dayMap[d].real++;
      else dayMap[d].fake++;
    }
  });
  const dailyData = Object.entries(dayMap).map(([name, v]) => ({ name, ...v }));

  // Confidence distribution ranges
  const ranges = ['0-60', '60-70', '70-80', '80-90', '90-100'];
  const confDist = ranges.map((range) => {
    const [lo, hi] = range.split('-').map(Number);
    const count = validRecords.filter((h) => {
      let c = h.confidence;
      if (c <= 1 && c > 0) c = c * 100;
      if (hi === 100) return c >= lo && c <= 100;
      return c >= lo && c < hi;
    }).length;
    return { range: `${range}%`, count };
  });

  // Timeline (last 15 entries)
  const timelineData = [...validRecords]
    .slice(0, 15)
    .reverse()
    .map((h, i) => ({
      time: `#${i + 1}`,
      confidence: h.confidence <= 1 && h.confidence > 0 ? h.confidence * 100 : h.confidence,
    }));

  const recentAnalyses = validRecords.slice(0, 6);

  return {
    total,
    reals,
    fakes,
    avgConf,
    maxConf,
    minConf,
    highRisks,
    medRisks,
    lowRisks,
    avgTime: avgTimeStr,
    fastestTime: fastestStr,
    slowestTime: slowestStr,
    pieData,
    riskPieData,
    dailyData,
    confDist,
    timelineData,
    recentAnalyses,
  };
};
