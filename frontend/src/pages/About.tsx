import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Waves, Cpu, Radio, Mic, BookOpen, Code2, ExternalLink } from 'lucide-react';
import GlassCard from '../components/Common/GlassCard';

const TECH_STACK = [
  { name: 'React + TypeScript', desc: 'Frontend framework', color: '#06b6d4' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', color: '#3b82f6' },
  { name: 'FastAPI', desc: 'Python backend API', color: '#10b981' },
  { name: 'WaveSurfer.js', desc: 'Audio waveform visualization', color: '#8b5cf6' },
  { name: 'Framer Motion', desc: 'Smooth animations', color: '#f59e0b' },
  { name: 'Recharts', desc: 'Data visualization charts', color: '#ef4444' },
];

const FAQ = [
  {
    q: 'What is Room Impulse Response (RIR)?',
    a: 'RIR describes how a sound reflects within an environment. Deepfake audio often lacks the natural acoustic fingerprint of a real room, which AcousticSpace detects.',
  },
  {
    q: 'What audio formats are supported?',
    a: 'AcousticSpace supports WAV, FLAC, MP3, and AAC formats. For best accuracy, we recommend 16kHz WAV files.',
  },
  {
    q: 'How accurate is the detection?',
    a: 'The RIR-based model achieves ~94.8% accuracy on the test dataset. Confidence scores above 80% are considered high-confidence predictions.',
  },
  {
    q: 'Why is the backend offline?',
    a: 'Ensure your FastAPI backend is running at the configured URL (default: http://localhost:8000). You can change the backend URL in Settings.',
  },
  {
    q: 'How do I download analysis reports?',
    a: 'After analysis, click "Download Report" on the Results page. You can also download individual or bulk reports from the History page.',
  },
];

const About: React.FC = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl mx-auto">
    <div>
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <HelpCircle size={20} style={{ color: 'var(--accent-cyan)' }} />
        Help & About
      </h2>
      <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
        Documentation and project information
      </p>
    </div>

    {/* Project Hero */}
    <GlassCard className="p-6 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 glow-cyan"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(59,130,246,0.3))', border: '1px solid rgba(6,182,212,0.4)' }}
        >
          <Waves size={30} style={{ color: 'var(--accent-cyan)' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold gradient-text">AcousticSpace</h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
            Deepfake Audio Detection using Room Impulse Response (RIR)
          </p>
          <p
            className="text-xs mt-1 italic"
            style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}
          >
            "Detecting AI Generated Voices through Environmental Acoustics"
          </p>
          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
            AcousticSpace is an enterprise-grade forensic audio analysis platform developed at{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>Infotact</strong> for cybersecurity
            teams. It leverages Room Impulse Response analysis to identify deepfake audio generated
            by state-of-the-art AI voice synthesis models.
          </p>
        </div>
      </div>
    </GlassCard>

    {/* How it works */}
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} style={{ color: 'var(--accent-cyan)' }} />
        <h3 className="text-sm font-semibold text-white">How It Works</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Mic, step: '01', title: 'Upload Audio', desc: 'Drop a WAV/FLAC/MP3/AAC file into the upload zone for analysis.' },
          { icon: Radio, step: '02', title: 'RIR Analysis', desc: 'The FastAPI backend extracts Room Impulse Response and MFCC features from the audio.' },
          { icon: Cpu, step: '03', title: 'AI Prediction', desc: 'The trained model classifies the audio as Real Human Voice or Deepfake with a confidence score.' },
        ].map(({ icon: Icon, step, title, desc }) => (
          <div
            key={step}
            className="p-4 rounded-xl relative"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.1)' }}
          >
            <div
              className="text-xs font-bold mb-3"
              style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}
            >
              STEP {step}
            </div>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ background: 'rgba(6,182,212,0.1)' }}
            >
              <Icon size={16} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </div>
        ))}
      </div>
    </GlassCard>

    {/* Tech Stack */}
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={16} style={{ color: 'var(--accent-cyan)' }} />
        <h3 className="text-sm font-semibold text-white">Technology Stack</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TECH_STACK.map(({ name, desc, color }) => (
          <div
            key={name}
            className="p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20` }}
          >
            <div className="text-sm font-semibold text-white mb-0.5">{name}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </GlassCard>

    {/* API Reference */}
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <ExternalLink size={16} style={{ color: 'var(--accent-cyan)' }} />
        <h3 className="text-sm font-semibold text-white">API Reference</h3>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(6,182,212,0.15)', fontFamily: 'JetBrains Mono' }}
      >
        <div className="text-xs space-y-2">
          <div>
            <span style={{ color: '#10b981' }}>POST</span>{' '}
            <span style={{ color: 'var(--accent-cyan)' }}>/predict</span>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Content-Type: multipart/form-data</div>
          <div style={{ color: 'var(--text-muted)' }}>Body: file (audio file)</div>
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(6,182,212,0.1)' }}>
            <div style={{ color: '#8b5cf6' }}>Response:</div>
            <pre className="text-xs mt-1" style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>{`{
  "filename": "audio.wav",
  "prediction": "REAL HUMAN VOICE",
  "confidence": 98.72,
  "processing_time": "0.18 sec"
}`}</pre>
          </div>
        </div>
      </div>
    </GlassCard>

    {/* FAQ */}
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={16} style={{ color: 'var(--accent-cyan)' }} />
        <h3 className="text-sm font-semibold text-white">Frequently Asked Questions</h3>
      </div>
      <div className="space-y-3">
        {FAQ.map(({ q, a }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.08)' }}
          >
            <p className="text-sm font-semibold text-white mb-1.5">{q}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{a}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>

    {/* Footer */}
    <div className="text-center py-4">
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        AcousticSpace v1.0 · Built by Infotact · 2025
      </p>
    </div>
  </motion.div>
);

export default About;
