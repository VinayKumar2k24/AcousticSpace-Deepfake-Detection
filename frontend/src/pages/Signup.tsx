import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Mail, Lock, User, Eye, EyeOff, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { level: score, label: 'Fair', color: '#f59e0b' };
  return { level: score, label: 'Strong', color: '#10b981' };
}

const Signup: React.FC = () => {
  const { signup } = useApp();
  const navigate   = useNavigate();

  const [name, setName]                 = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Full name is required.'); return; }
    if (!email.trim()) { setError('Email address is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const result = signup(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Sign up failed.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--surface-0)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyCenter: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
              <Waves size={22} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>AcousticSpace</div>
              <div style={{ color: 'var(--cyan-500)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.10em', fontWeight: 700 }}>AI AUDIO FORENSICS</div>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
            Create an analyst account to run deepfake audio inspections
          </p>
        </div>

        <div
          style={{
            background: 'rgba(9,20,40,0.85)',
            border: '1px solid rgba(6,182,212,0.18)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="Dr. Alex Rivera"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="cyber-input"
                  placeholder="alex.rivera@acousticspace.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="cyber-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingLeft: '34px', paddingRight: '34px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Strength Meter */}
              {password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: '3px' }}>
                    <span>STRENGTH</span>
                    <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                  </div>
                  <div className="progress-track" style={{ height: '3px' }}>
                    <div style={{ height: '100%', width: `${(strength.level / 5) * 100}%`, background: strength.color, transition: 'all 0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="cyber-input"
                  placeholder="••••••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ paddingLeft: '34px', paddingRight: '34px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {confirm && confirm === password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                  <CheckCircle size={12} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', marginTop: '6px', fontSize: '13px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
              ) : (
                <>
                  <UserPlus size={15} />
                  Create Analyst Account
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--cyan-500)', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
