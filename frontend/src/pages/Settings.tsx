import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/Common/GlassCard';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setLocal({ ...settings });
  };

  const set = <K extends keyof typeof local>(key: K, val: typeof local[K]) =>
    setLocal((prev) => ({ ...prev, [key]: val }));

  const THEMES = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const;

  const SECTION = 'mb-6 last:mb-0';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={20} style={{ color: 'var(--accent-cyan)' }} />
          Settings
        </h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          Configure AcousticSpace system preferences
        </p>
      </div>

      {/* Appearance */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Appearance</h3>
        <div className={SECTION}>
          <label className="text-xs font-semibold uppercase tracking-wide block mb-3" style={{ color: 'var(--text-muted)' }}>
            Theme
          </label>
          <div className="flex gap-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => set('theme', value)}
                className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all duration-200"
                style={{
                  background: local.theme === value ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${local.theme === value ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: local.theme === value ? 'var(--accent-cyan)' : 'var(--text-muted)',
                }}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Backend Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Backend Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-muted)' }}>
              Backend URL
            </label>
            <input
              className="cyber-input"
              placeholder="http://localhost:8000"
              value={local.backendUrl}
              onChange={(e) => set('backendUrl', e.target.value)}
            />
            <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
              FastAPI server endpoint. Used for POST /predict calls.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-muted)' }}>
              Model Version
            </label>
            <input
              className="cyber-input"
              placeholder="v1.0"
              value={local.modelVersion}
              onChange={(e) => set('modelVersion', e.target.value)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Analysis Parameters */}
      <GlassCard className="p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Analysis Parameters</h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Inference Threshold
              </label>
              <span
                className="text-xs font-bold"
                style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}
              >
                {(local.inferenceThreshold * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={local.inferenceThreshold}
              onChange={(e) => set('inferenceThreshold', parseFloat(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>30% (Sensitive)</span>
              <span>90% (Strict)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-2" style={{ color: 'var(--text-muted)' }}>
              Audio Sample Rate (Hz)
            </label>
            <select
              className="cyber-input"
              value={local.audioSampleRate}
              onChange={(e) => set('audioSampleRate', parseInt(e.target.value))}
            >
              {[8000, 16000, 22050, 44100, 48000].map((r) => (
                <option key={r} value={r}>{r.toLocaleString()} Hz</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-secondary flex items-center gap-2" onClick={handleReset}>
          <RotateCcw size={15} />
          Reset
        </button>
        <button
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <CheckCircle2 size={15} />
              Saved!
            </>
          ) : (
            <>
              <Save size={15} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;
