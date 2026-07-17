// Charts/index.tsx — Recharts wrappers with dark cyber theme
import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as ReBarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

// ─── Shared Tooltip ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: 'rgba(10,15,30,0.95)',
        border: '1px solid rgba(6,182,212,0.3)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        fontSize: '12px',
        color: '#f1f5f9',
      }}
    >
      {label && <p style={{ color: '#94a3b8', marginBottom: '4px' }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#06b6d4', fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Pie Chart ─────────────────────────────────────────────────────────
interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export const RealFakePieChart: React.FC<PieChartProps> = ({ data, height = 260 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <RePieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={90}
        paddingAngle={4}
        dataKey="value"
        strokeWidth={0}
      >
        {data.map((entry, i) => (
          <Cell key={i} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        formatter={(value) => (
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>
        )}
      />
    </RePieChart>
  </ResponsiveContainer>
);

// ─── Line Chart ─────────────────────────────────────────────────────────
interface LineChartProps {
  data: { name: string; real?: number; fake?: number; total?: number }[];
  height?: number;
}

export const DailyLineChart: React.FC<LineChartProps> = ({ data, height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
      <defs>
        <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="gradFake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={2} fill="url(#gradReal)" name="Real" />
      <Area type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} fill="url(#gradFake)" name="Fake" />
    </AreaChart>
  </ResponsiveContainer>
);

// ─── Bar Chart ─────────────────────────────────────────────────────────
interface BarChartProps {
  data: { range: string; count: number }[];
  height?: number;
}

export const ConfidenceBarChart: React.FC<BarChartProps> = ({ data, height = 240 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <ReBarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
      <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Count" />
    </ReBarChart>
  </ResponsiveContainer>
);

// ─── Timeline Chart ─────────────────────────────────────────────────────
interface TimelineChartProps {
  data: { time: string; confidence: number }[];
  height?: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data, height = 200 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <ReLineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
      <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="confidence"
        stroke="#8b5cf6"
        strokeWidth={2}
        dot={{ fill: '#8b5cf6', r: 3 }}
        activeDot={{ r: 5 }}
        name="Confidence %"
      />
    </ReLineChart>
  </ResponsiveContainer>
);
