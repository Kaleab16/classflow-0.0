import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { getRoleBasePath } from '../components/common/ProtectedRoute';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Public signup creates a STUDENT account by default
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              role: 'student' // Enforce default Student role for public signup
            }
          }
        });

        if (signUpError) throw signUpError;

        // Insert into profiles table with student role
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: name || email.split('@')[0],
            email: email,
            role: 'student',
            department: 'Software Engineering',
            class_section: 'Section A'
          });
        }

        navigate('/student/dashboard');
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;

        // Determine role from authenticated user profile
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const role: UserRole = profile?.role || data.user.user_metadata?.role || 'student';
          navigate(getRoleBasePath(role));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            padding: '32px 28px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#FFFFFF',
              color: '#2563EB',
              borderRadius: '8px',
              margin: '0 auto 12px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px'
            }}
          >
            CF
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
            CLASSFLOW
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.9, fontWeight: 500 }}>
            Sign in to access your role-assigned workspace
          </p>
        </div>

        {/* Auth Body */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: '#991B1B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '10px 12px', gap: '8px' }}>
                  <User size={16} color="#64748B" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Bikila"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', width: '100%' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                University Email
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '10px 12px', gap: '8px' }}>
                <Mail size={16} color="#64748B" />
                <input
                  type="email"
                  required
                  placeholder="e.g. abebe.b@sw.edu.et"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '10px 12px', gap: '8px' }}>
                <Lock size={16} color="#64748B" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', width: '100%' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Workspace' : 'Create Student Account'}</span>
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}
            >
              {mode === 'signin' ? "Don't have an account? Sign up as Student" : 'Already registered? Sign in here'}
            </button>
          </div>


          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 12px', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '16px' }}>
            <ShieldCheck size={16} color="#0284C7" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              Public signup creates a Student account. Class Rep, Teacher, and Admin roles are assigned by the system administrator.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
