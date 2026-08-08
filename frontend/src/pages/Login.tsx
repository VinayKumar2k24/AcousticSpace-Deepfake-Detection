import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, Sparkles, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Email address is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  const fillDemo = () => {
    setEmail('demo@acousticspace.ai');
    setPassword('AcousticSpace@Demo2026');
    setError('');
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
      {/* Background micro grid */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyCenter: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
              <Waves size={22} color="white" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '18px', lineHeight: 1.2 }}>AcousticSpace</div>
              <div style={{ color: 'var(--cyan-500)', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.10em', fontWeight: 700 }}>AI AUDIO FORENSICS</div>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '14px' }}>
            Sign in to access your forensic analysis workspace
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(9,20,40,0.85)',
            border: '1px solid rgba(6,182,212,0.18)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Demo Button */}
          <button
            type="button"
            onClick={fillDemo}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(6,182,212,0.08)',
              border: '1px dashed rgba(6,182,212,0.25)',
              color: 'var(--cyan-500)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.15s',
            }}
          >
            <Sparkles size={12} />
            Click to fill Demo credentials
          </button>

          {/* Error alert */}
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

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email field */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="cyber-input"
                  placeholder="analyst@acousticspace.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ paddingLeft: '34px' }}
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', marginBottom: '6px' }}>
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
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', marginTop: '4px', fontSize: '13px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Sign In to Workspace
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Don't have an analyst account?{' '}
            <Link to="/signup" style={{ color: 'var(--cyan-500)', textDecoration: 'none', fontWeight: 600 }}>
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
