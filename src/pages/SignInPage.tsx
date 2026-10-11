import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
  Hash,
  KeyRound,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getRoleBasePath } from '../components/common/ProtectedRoute';
import { SECTIONS } from '../config';

type Mode = 'signin' | 'signup';
type AccountType = 'student' | 'teacher';

const bareInputStyle: React.CSSProperties = {
  border: 'none',
  background: 'none',
  fontSize: '13px',
  outline: 'none',
  width: '100%'
};

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, icon, hint, children }) => (
  <div>
    <label
      style={{
        fontSize: '11px',
        fontWeight: 700,
        color: '#64748B',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '4px'
      }}
    >
      {label}
    </label>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #CBD5E1',
        borderRadius: '6px',
        padding: '10px 12px',
        gap: '8px'
      }}
    >
      {icon}
      {children}
    </div>
    {hint && <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{hint}</div>}
  </div>
);

export const SignInPage: React.FC = () => {
  const { isAuthenticated, currentUser, loading: authLoading, profileError, refreshProfile } = useAuth();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<Mode>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin');
  const [accountType, setAccountType] = useState<AccountType>('student');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [section, setSection] = useState(SECTIONS[0] ?? '');
  const [classCode, setClassCode] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Already signed in: go straight to your workspace (or the "waiting for
  // approval" screen, which the workspace route shows when needed).
  if (!authLoading && isAuthenticated) {
    return <Navigate to={getRoleBasePath(currentUser.role)} replace />;
  }

  const isTeacherSignup = mode === 'signup' && accountType === 'teacher';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!isSupabaseConfigured) {
      setError('Demo mode is active. Configure the Supabase environment variables to enable real sign-in and account creation.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters.');
        }

        // Friendly pre-check (the database enforces the same rules on signup).
        const { data: reason, error: checkError } = await supabase.rpc('precheck_signup', {
          p_class_code: classCode,
          p_student_id: studentId,
          p_invite_code: isTeacherSignup ? inviteCode : '',
          p_email: email.trim()
        });
        if (checkError) {
          throw new Error('Could not check your details. Please try again.');
        }
        if (reason) {
          throw new Error(String(reason));
        }

        // Note: no role is sent. The database decides the role.
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: isTeacherSignup
              ? { name: name.trim(), invite_code: inviteCode.trim() }
              : {
                  name: name.trim(),
                  student_id: studentId.trim(),
                  section,
                  class_code: classCode.trim()
                }
          }
        });
        if (signUpError) throw signUpError;

        if (!data.session) {
          // Email confirmation is switched on in Supabase.
          setPassword('');
          setMode('signin');
          setInfo('Account created. Check your email to confirm your address, then sign in here.');
          return;
        }

        // Signed in right away: load the profile; this page then redirects.
        await refreshProfile();
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (signInError) throw signInError;

        await refreshProfile();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shownError = error ?? profileError;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 700,
    borderRadius: '6px',
    border: `1px solid ${active ? '#2563EB' : '#CBD5E1'}`,
    backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
    color: active ? '#1D4ED8' : '#64748B',
    cursor: 'pointer'
  });

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
            {mode === 'signin' ? 'Sign in to your workspace' : 'Create your ClassFlow account'}
          </p>
        </div>

        {/* Auth Body */}
        <div style={{ padding: '28px' }}>
          {shownError && (
            <div
              role="alert"
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#991B1B',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{shownError}</span>
            </div>
          )}

          {info && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#1E40AF',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Info size={16} style={{ flexShrink: 0 }} />
              <span>{info}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button type="button" onClick={() => setAccountType('student')} style={tabStyle(accountType === 'student')}>
                I'm a student
              </button>
              <button type="button" onClick={() => setAccountType('teacher')} style={tabStyle(accountType === 'teacher')}>
                I have a teacher invite
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <Field label="Full Name" icon={<User size={16} color="#64748B" />}>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  aria-label="Full name"
                  placeholder="As it appears on your ID"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={bareInputStyle}
                />
              </Field>
            )}

            {mode === 'signup' && accountType === 'student' && (
              <>
                <Field
                  label="Student ID"
                  icon={<Hash size={16} color="#64748B" />}
                  hint="Only you and the class admin can see this."
                >
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={32}
                    autoComplete="off"
                    aria-label="Student ID"
                    placeholder="e.g. ETS/0123/15"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    style={bareInputStyle}
                  />
                </Field>

                <Field label="Section" icon={<User size={16} color="#64748B" />}>
                  <select
                    required
                    aria-label="Section"
                    value={section}
                    onChange={e => setSection(e.target.value)}
                    style={bareInputStyle}
                  >
                    {SECTIONS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Class Code"
                  icon={<KeyRound size={16} color="#64748B" />}
                  hint="Ask your class rep or admin for the code."
                >
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    aria-label="Class code"
                    placeholder="Class code"
                    value={classCode}
                    onChange={e => setClassCode(e.target.value)}
                    style={bareInputStyle}
                  />
                </Field>
              </>
            )}

            {isTeacherSignup && (
              <Field
                label="Teacher Invite Code"
                icon={<KeyRound size={16} color="#64748B" />}
                hint="Use the same email address the invite was sent to."
              >
                <input
                  type="text"
                  required
                  autoComplete="off"
                  aria-label="Teacher invite code"
                  placeholder="Invite code"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  style={bareInputStyle}
                />
              </Field>
            )}

            <Field label="Email" icon={<Mail size={16} color="#64748B" />}>
              <input
                type="email"
                required
                autoComplete="email"
                aria-label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={bareInputStyle}
              />
            </Field>

            <Field
              label="Password"
              icon={<Lock size={16} color="#64748B" />}
              hint={mode === 'signup' ? 'At least 8 characters.' : undefined}
            >
              <input
                type="password"
                required
                minLength={mode === 'signup' ? 8 : undefined}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                aria-label="Password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={bareInputStyle}
              />
            </Field>

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
                opacity: loading ? 0.8 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              {mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />}
              <span>
                {loading
                  ? 'Please wait...'
                  : mode === 'signin'
                    ? 'Sign In'
                    : isTeacherSignup
                      ? 'Create Teacher Account'
                      : 'Create Student Account'}
              </span>
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setInfo(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#2563EB',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already registered? Sign in here'}
            </button>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '10px 12px',
              fontSize: '11px',
              color: '#64748B',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              marginTop: '16px'
            }}
          >
            <ShieldCheck size={16} color="#0284C7" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              Student accounts are checked against your student ID before you can submit requests. Class reps are
              appointed by the admin, and teachers join by personal invite.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
