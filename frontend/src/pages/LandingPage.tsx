import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Waves, Shield, Mic, Brain, BarChart3, FileText, ChevronRight,
  CheckCircle, Zap, Activity, Lock, ArrowRight, Radio, Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ── Live Hero Telemetry Waveform ────────────────────────────────────────── */
const LiveTelemetryWaveform: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="status-dot status-dot-online" />
        <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--cyan-500)', fontWeight: 600, letterSpacing: '0.08em' }}>
          LIVE SIGNAL CAPTURE · 16.0 kHz
        </span>
      </div>
      <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
        AASIST FFT MON
      </span>
    </div>

    {/* Waveform bars */}
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '3px', height: '90px', background: 'rgba(5,13,31,0.85)', borderRadius: '12px', border: '1px solid rgba(6,182,212,0.18)', padding: '16px 12px 12px' }}>
      {Array.from({ length: 48 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [0.15, 1, 0.25, 0.85, 0.15] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
          style={{
            width: '3.5px',
            height: `${16 + Math.sin(i * 0.35) * 35 + 20}px`,
            borderRadius: '2px',
            background: i % 3 === 0
              ? 'linear-gradient(180deg, #06b6d4, #3b82f6)'
              : i % 7 === 0
              ? 'linear-gradient(180deg, #ef4444, #f59e0b)'
              : 'linear-gradient(180deg, #06b6d4, #10b981)',
            transformOrigin: 'bottom',
            opacity: 0.7 + Math.sin(i * 0.3) * 0.3,
          }}
        />
      ))}
    </div>
  </div>
);

/* ── Shared section-heading helper ──────────────────────────────────────── */
const SectionHeading: React.FC<{ overline: string; title: string; sub?: string }> = ({ overline, title, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: '48px' }}>
    <span className="overline-label">{overline}</span>
    <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginTop: '6px', marginBottom: sub ? '12px' : 0 }}>
      {title}
    </h2>
    {sub && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>{sub}</p>}
  </div>
);

/* ── Landing Page Component ─────────────────────────────────────────────────── */
const LandingPage: React.FC = () => {
  const { currentUser } = useApp();
  const navigate        = useNavigate();

  return (
    <div style={{ background: 'var(--surface-0)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
      {/* ── Public Navbar ─────────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(2,8,24,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(6,182,212,0.10)',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(6,182,212,0.35)' }}>
            <Waves size={18} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <div style={{ color: '#e8f0fe', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.01em' }}>AcousticSpace</div>
            <div style={{ color: 'var(--cyan-500)', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.12em', fontWeight: 700 }}>AI AUDIO FORENSICS</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[
            { label: 'Technology',        href: '#technology' },
            { label: 'Features',          href: '#features' },
            { label: 'Forensic Evidence', href: '#forensic-evidence' },
            { label: 'Model Specs',       href: '#model-specs' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{ color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--cyan-500)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <button className="btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }} onClick={() => navigate('/dashboard')}>
              Go to Workspace
              <ArrowRight size={13} style={{ marginLeft: '6px' }} />
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ fontSize: '13px', padding: '7px 16px', textDecoration: 'none' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ fontSize: '13px', padding: '7px 18px', textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '80px 32px 60px', maxWidth: '1280px', margin: '0 auto' }}>
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '48px', alignItems: 'center' }}>
          {/* Left Column */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '100px',
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.22)',
                marginBottom: '20px',
              }}
            >
              <span className="status-dot status-dot-online" />
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.08em' }}>
                AI-POWERED AUDIO FORENSICS PLATFORM
              </span>
            </div>

            <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '18px' }}>
              Detect AI Voice Deepfakes with <span className="gradient-text">Forensic-Grade</span> Analysis
            </h1>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '520px' }}>
              Analyze suspicious voice recordings using graph attention networks (AASIST v1.0), Room Impulse Response (RIR) profiling, spectral feature extraction, and breathing pattern verification.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                style={{ fontSize: '14px', padding: '12px 26px', display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={() => navigate(currentUser ? '/audio-analysis' : '/login')}
              >
                <Activity size={17} />
                Analyze Audio Recording
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Column: Live Telemetry Card */}
          <div
            style={{
              background: 'rgba(9,20,40,0.85)',
              border: '1px solid rgba(6,182,212,0.22)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(6,182,212,0.12)',
            }}
          >
            <LiveTelemetryWaveform />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '18px' }}>
              {[
                { label: 'ACCURACY', val: '99.7%', color: '#10b981' },
                { label: 'LATENCY',  val: '<60ms', color: '#06b6d4' },
                { label: 'FEATURES', val: '6 Layers', color: '#8b5cf6' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
                  <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics Bar ────────────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(6,182,212,0.10)', borderBottom: '1px solid rgba(6,182,212,0.10)', background: 'rgba(5,13,31,0.60)', padding: '28px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', textAlign: 'center' }}>
          {[
            { val: '99.7%',  label: 'Validation Accuracy' },
            { val: '< 60ms', label: 'Inference Time' },
            { val: '6',      label: 'Acoustic Features' },
            { val: '64,600', label: 'Tensor Pad Length' },
            { val: '100 MB', label: 'Max File Size' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--cyan-500)', fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Technology Section ────────────────────────────────────────── */}
      <section id="technology" style={{ scrollMarginTop: '64px', padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeading overline="MULTI-LAYER DETECTION ARCHITECTURE" title="Powered by AASIST & Signal Intelligence" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {[
            {
              icon: Brain,
              title: 'AASIST Neural Model',
              desc: 'Integrated spectro-temporal graph attention networks that process raw audio waveforms directly without manual feature crafting.',
              color: '#06b6d4',
            },
            {
              icon: Radio,
              title: 'Room Impulse Response (RIR)',
              desc: 'Profiles acoustic reverberation anomalies to verify if vocal recordings originated from a real physical room environment.',
              color: '#3b82f6',
            },
            {
              icon: Layers,
              title: 'Breathing Pattern Analysis',
              desc: 'Evaluates vocal tract dynamics, RMS variations, and silence ratios to identify synthetic speech lacking natural breath pauses.',
              color: '#8b5cf6',
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              style={{
                background: 'rgba(9,20,40,0.70)',
                border: `1px solid ${color}25`,
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────── */}
      <section id="features" style={{ scrollMarginTop: '64px', padding: '80px 32px', background: 'rgba(5,13,31,0.55)', borderTop: '1px solid rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            overline="PLATFORM CAPABILITIES"
            title="Everything You Need for Audio Forensics"
            sub="AcousticSpace delivers a complete forensic investigation suite — from raw signal ingestion to court-ready PDF reports."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              {
                icon: Activity,
                title: 'Waveform & Spectrogram',
                desc: 'Visualise time-domain waveforms and frequency spectrograms in real time with interactive zoom and MFCC overlays.',
                color: '#06b6d4',
                badge: 'LIVE',
              },
              {
                icon: Shield,
                title: 'Deepfake Detection',
                desc: 'AASIST v1.0 graph attention model flags synthetic voices with 99.7% accuracy, returning a calibrated confidence score.',
                color: '#10b981',
                badge: 'CORE',
              },
              {
                icon: Mic,
                title: 'Breathing Pattern Audit',
                desc: 'Detects absence of natural micro-pauses, breath intakes, and vocal fatigue markers characteristic of human speech.',
                color: '#8b5cf6',
                badge: 'UNIQUE',
              },
              {
                icon: Radio,
                title: 'RIR Room Profiling',
                desc: 'Extracts room impulse fingerprints from reverberation tails, energy decay, and C50/C80 clarity ratios.',
                color: '#3b82f6',
                badge: 'ADVANCED',
              },
              {
                icon: BarChart3,
                title: 'Analysis History & Audit Log',
                desc: 'Every forensic session is persisted with timestamp, verdict, confidence, and full acoustic feature snapshot.',
                color: '#f59e0b',
                badge: 'AUDIT',
              },
              {
                icon: FileText,
                title: 'Professional PDF Reports',
                desc: 'One-click export of a court-ready forensic report containing all 6 acoustic visualisations, verdicts, and metadata.',
                color: '#ef4444',
                badge: 'EXPORT',
              },
            ].map(({ icon: Icon, title, desc, color, badge }) => (
              <motion.div
                key={title}
                whileHover={{ y: -4, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${color}18` }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'rgba(9,20,40,0.75)',
                  border: `1px solid ${color}20`,
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'default',
                }}
              >
                {/* accent top strip */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '4px', padding: '2px 6px', letterSpacing: '0.08em' }}>
                    {badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Forensic Evidence Section ─────────────────────────────────── */}
      <section id="forensic-evidence" style={{ scrollMarginTop: '64px', padding: '80px 32px', maxWidth: '1280px', margin: '0 auto' }}>
        <SectionHeading
          overline="FORENSIC SIGNAL ANALYSIS"
          title="Multi-Dimensional Evidence Collection"
          sub="Six independent acoustic feature layers are extracted and cross-correlated to build a complete forensic evidence chain."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
          {/* Evidence chain list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { num: '01', label: 'MFCC Spectrogram',    desc: 'Mel-frequency cepstral coefficients reveal synthetic formant generation patterns.',  color: '#06b6d4' },
              { num: '02', label: 'Pitch Trajectory',    desc: 'Fundamental frequency contours expose unnatural monotone TTS pitch interpolation.', color: '#3b82f6' },
              { num: '03', label: 'Spectral Centroid',   desc: 'Tracks brightness over time — AI voices often display sudden centroid jumps.',      color: '#8b5cf6' },
              { num: '04', label: 'RMS Energy Envelope', desc: 'Energy dynamics differentiate real vocal effort from synthesiser amplitude control.',color: '#10b981' },
              { num: '05', label: 'Zero-Crossing Rate',  desc: 'High-frequency noise signatures unique to vocoders appear in ZCR profiles.',        color: '#f59e0b' },
              { num: '06', label: 'Chroma Features',     desc: 'Harmonic content distribution exposes pitch-shifting artefacts in cloned voices.',  color: '#ef4444' },
            ].map(({ num, label, desc, color }) => (
              <div
                key={num}
                style={{
                  display: 'flex',
                  gap: '16px',
                  background: 'rgba(9,20,40,0.65)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ minWidth: '36px', height: '36px', borderRadius: '8px', background: `${color}16`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', fontWeight: 800, color }}>
                  {num}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Simulated verdict card */}
          <div
            style={{
              background: 'rgba(9,20,40,0.85)',
              border: '1px solid rgba(6,182,212,0.20)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.55), 0 0 30px rgba(6,182,212,0.10)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--cyan-500)', fontWeight: 700, letterSpacing: '0.1em' }}>FORENSIC ANALYSIS REPORT</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--text-muted)' }}>AcousticSpace v2.0</span>
            </div>

            {/* Verdict badge */}
            <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#ef4444', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '4px' }}>⚠ AI GENERATED VOICE DETECTED</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>96.3%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>DEEPFAKE CONFIDENCE SCORE</div>
            </div>

            {/* Feature evidence rows */}
            {[
              { label: 'MFCC Pattern',    verdict: 'SYNTHETIC', color: '#ef4444', pct: 94 },
              { label: 'Pitch Curve',     verdict: 'ANOMALY',   color: '#f59e0b', pct: 88 },
              { label: 'Breathing Trace', verdict: 'ABSENT',    color: '#ef4444', pct: 97 },
              { label: 'RIR Fingerprint', verdict: 'NO ROOM',   color: '#f59e0b', pct: 82 },
            ].map(({ label, verdict, color, pct }) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{label}</span>
                  <span style={{ fontSize: '11px', color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{verdict}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}80)`, borderRadius: '2px' }} />
                </div>
              </div>
            ))}

            <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.14)', borderRadius: '8px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                Model: AASIST v1.0 &nbsp;·&nbsp; SR: 16 kHz &nbsp;·&nbsp; Risk: <span style={{ color: '#ef4444' }}>CRITICAL</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Model Specs Section ───────────────────────────────────────── */}
      <section id="model-specs" style={{ scrollMarginTop: '64px', padding: '80px 32px', background: 'rgba(5,13,31,0.55)', borderTop: '1px solid rgba(6,182,212,0.08)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <SectionHeading
            overline="MODEL SPECIFICATIONS"
            title="AASIST v1.0 — Technical Profile"
            sub="Audio Anti-Spoofing using Integrated Spectro-Temporal graph attention Networks trained on the ASVspoof 2019 LA dataset."
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            {/* Spec table */}
            <div style={{ background: 'rgba(9,20,40,0.80)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(6,182,212,0.10)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={15} style={{ color: 'var(--cyan-500)' }} />
                <span style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.08em' }}>CORE ARCHITECTURE</span>
              </div>
              {[
                { key: 'Model',         val: 'AASIST v1.0' },
                { key: 'Task',          val: 'Audio Anti-Spoofing (CM)' },
                { key: 'Architecture',  val: 'Graph Attention Network' },
                { key: 'Input',         val: 'Raw waveform (1-D)' },
                { key: 'Sample Rate',   val: '16,000 Hz' },
                { key: 'Tensor Pad',    val: '64,600 samples' },
                { key: 'EER (LA)',      val: '0.83%' },
                { key: 'min-tDCF (LA)', val: '0.0275' },
                { key: 'Training Data', val: 'ASVspoof 2019 LA' },
                { key: 'Inference',     val: '< 60 ms (CPU)' },
              ].map(({ key, val }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{key}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Benchmark panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Performance bars */}
              <div style={{ background: 'rgba(9,20,40,0.80)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '18px', padding: '22px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.08em', marginBottom: '18px' }}>BENCHMARK METRICS</div>
                {[
                  { label: 'Overall Accuracy',   pct: 99.7, color: '#10b981' },
                  { label: 'Deepfake Precision', pct: 98.2, color: '#06b6d4' },
                  { label: 'Human Voice Recall', pct: 99.1, color: '#3b82f6' },
                  { label: 'ASVspoof 2019 F1',   pct: 99.5, color: '#8b5cf6' },
                ].map(({ label, pct, color }) => (
                  <div key={label} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: '12px', color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${color}, ${color}70)`, borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Supported formats */}
              <div style={{ background: 'rgba(9,20,40,0.80)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '18px', padding: '22px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.08em', marginBottom: '14px' }}>SUPPORTED FORMATS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['WAV', 'MP3', 'FLAC', 'OGG', 'M4A', 'AAC', 'OPUS', 'WebM'].map(fmt => (
                    <span key={fmt} style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.22)', borderRadius: '6px', padding: '4px 10px' }}>
                      {fmt}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  {[
                    { label: 'Max File Size', val: '100 MB', color: '#10b981' },
                    { label: 'Min Duration',  val: '0.5 s',  color: '#06b6d4' },
                    { label: 'Max Duration',  val: '∞',      color: '#8b5cf6' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color, fontFamily: 'JetBrains Mono, monospace' }}>{val}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            background: 'rgba(9,20,40,0.80)',
            border: '1px solid rgba(6,182,212,0.18)',
            borderRadius: '24px',
            padding: '60px 40px',
            boxShadow: '0 0 60px rgba(6,182,212,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent)' }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)', marginBottom: '20px' }}>
            <Lock size={11} style={{ color: 'var(--cyan-500)' }} />
            <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--cyan-500)', letterSpacing: '0.1em' }}>SECURE FORENSIC PLATFORM</span>
          </div>

          <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '14px' }}>
            Ready to Expose <span className="gradient-text">Audio Deepfakes?</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Upload a voice recording and receive a forensic verdict in under 60 milliseconds — no setup required.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              style={{ fontSize: '15px', padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => navigate(currentUser ? '/audio-analysis' : '/signup')}
            >
              <Activity size={17} />
              {currentUser ? 'Open Forensic Studio' : 'Create Free Account'}
              <ArrowRight size={15} />
            </button>
            {!currentUser && (
              <Link to="/login" className="btn-secondary" style={{ fontSize: '15px', padding: '14px 28px', textDecoration: 'none' }}>
                Sign In
              </Link>
            )}
          </div>

          {/* trust badges */}
          <div style={{ marginTop: '32px', display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: CheckCircle, text: 'AASIST v1.0 Verified' },
              { icon: Shield,      text: 'ASVspoof Benchmarked' },
              { icon: Lock,        text: 'Secure Processing' },
              { icon: Zap,         text: '< 60 ms Inference' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={13} style={{ color: 'var(--cyan-500)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(6,182,212,0.10)', background: 'var(--surface-1)', padding: '40px 32px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Waves size={18} style={{ color: 'var(--cyan-500)' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>AcousticSpace</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>— AI Voice Deepfake Detection & Audio Forensics</span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {[
              { label: 'Technology',        href: '#technology' },
              { label: 'Features',          href: '#features' },
              { label: 'Forensic Evidence', href: '#forensic-evidence' },
              { label: 'Model Specs',       href: '#model-specs' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--cyan-500)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {label}
              </a>
            ))}
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'JetBrains Mono, monospace' }}>
            © 2026 AcousticSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
