import React, { useCallback, useEffect, useState } from 'react';
import { Users, Search, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth, type UserRole, type VerificationStatus } from '../../context/AuthContext';
import { formatWhen } from '../../lib/time';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  student_id: string | null;
  class_section: string | null;
  verification_status: VerificationStatus;
  created_at: string;
}

const ROLE_LABEL: Record<UserRole, string> = {
  student: 'Student',
  class_rep: 'Class Rep',
  teacher: 'Teacher',
  admin: 'Admin'
};

// Admins are created in the database on purpose, so nobody is promoted to admin by a stray click.
const ASSIGNABLE_ROLES: UserRole[] = ['student', 'class_rep', 'teacher'];

const STATUS_STYLE: Record<VerificationStatus, { label: string; color: string; bg: string }> = {
  verified: { label: 'Verified', color: '#16A34A', bg: '#DCFCE7' },
  pending: { label: 'Pending', color: '#B45309', bg: '#FEF3C7' },
  rejected: { label: 'Rejected', color: '#B91C1C', bg: '#FEE2E2' }
};

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '20px'
};

const smallButton = (color: string, filled: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 10px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  border: `1px solid ${color}`,
  backgroundColor: filled ? color : '#FFFFFF',
  color: filled ? '#FFFFFF' : color
});

export const AdminUsersView: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('profiles')
      .select('id, name, email, role, student_id, class_section, verification_status, created_at')
      .order('created_at', { ascending: false });

    if (loadError) {
      setError(`Could not load users: ${loadError.message}`);
    } else {
      setUsers((data ?? []) as ManagedUser[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      loadUsers();
    }
  }, [loadUsers]);

  const updateUser = async (
    id: string,
    changes: { verification_status?: VerificationStatus; role?: UserRole }
  ) => {
    setBusyId(id);
    setError(null);

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update(changes)
      .eq('id', id)
      .select('id');

    if (updateError) {
      setError(`Could not update this user: ${updateError.message}`);
    } else if (!data || data.length === 0) {
      // Row-level security blocks silently: no error, no rows.
      setError('The change was blocked. Make sure you are signed in as an approved admin.');
    } else {
      await loadUsers();
    }
    setBusyId(null);
  };

  const changeRole = (user: ManagedUser, role: UserRole) => {
    // Promoting someone to rep or teacher also verifies them: an unverified
    // rep would have no powers anyway.
    if (role === 'student') {
      updateUser(user.id, { role });
    } else {
      updateUser(user.id, { role, verification_status: 'verified' });
    }
  };

  const needle = query.trim().toLowerCase();
  const filtered = users.filter(
    (u) =>
      !needle ||
      u.name.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle) ||
      (u.student_id ?? '').toLowerCase().includes(needle)
  );
  const pending = users.filter((u) => u.verification_status === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ ...card, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ADMINISTRATION
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Users & Approvals
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Check each new student's ID, then approve them. Promote class reps and teachers here.
          </p>
        </div>

        {isSupabaseConfigured && (
          <button
            onClick={loadUsers}
            disabled={loading}
            style={{ ...smallButton('#7C3AED', false), padding: '8px 14px', fontSize: '13px' }}
          >
            <RefreshCw size={14} />
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
        )}
      </div>

      {!isSupabaseConfigured && (
        <div style={card}>
          <p style={{ fontSize: '13px', color: '#475569' }}>
            User management needs the Supabase backend. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use it.
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {isSupabaseConfigured && pending.length > 0 && (
        <div style={{ ...card, borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
            Waiting for approval ({pending.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pending.map((user) => (
              <div
                key={user.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{user.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    ID: <strong>{user.student_id ?? 'none'}</strong> • {user.class_section ?? 'no section'} • {user.email}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Signed up {formatWhen(user.created_at)}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={busyId === user.id}
                    onClick={() => updateUser(user.id, { verification_status: 'verified' })}
                    style={smallButton('#16A34A', true)}
                  >
                    <Check size={14} />
                    <span>Approve</span>
                  </button>
                  <button
                    disabled={busyId === user.id}
                    onClick={() => updateUser(user.id, { verification_status: 'rejected' })}
                    style={smallButton('#B91C1C', false)}
                  >
                    <X size={14} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isSupabaseConfigured && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#7C3AED" />
              <span>All Users ({users.length})</span>
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', width: '260px' }}>
              <Search size={14} color="#94A3B8" />
              <input
                placeholder="Search name, email or student ID..."
                aria-label="Search users"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ border: 'none', background: 'none', fontSize: '12px', outline: 'none', width: '100%' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Name & Email</th>
                  <th style={{ padding: '10px 12px' }}>Student ID</th>
                  <th style={{ padding: '10px 12px' }}>Section</th>
                  <th style={{ padding: '10px 12px' }}>Role</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => {
                  const isSelf = user.id === currentUser.id;
                  const status = STATUS_STYLE[user.verification_status];
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>
                          {user.name}
                          {isSelf ? ' (you)' : ''}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#475569' }}>{user.student_id ?? '—'}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{user.class_section ?? '—'}</td>
                      <td style={{ padding: '12px' }}>
                        {user.role === 'admin' || isSelf ? (
                          <span style={{ fontWeight: 700, color: '#7C3AED' }}>{ROLE_LABEL[user.role]}</span>
                        ) : (
                          <select
                            aria-label={`Role for ${user.name}`}
                            value={user.role}
                            disabled={busyId === user.id}
                            onChange={(e) => changeRole(user, e.target.value as UserRole)}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                          >
                            {ASSIGNABLE_ROLES.map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABEL[r]}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: status.color, backgroundColor: status.bg, padding: '2px 8px', borderRadius: '4px' }}>
                          {status.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {!isSelf && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {user.verification_status !== 'verified' && (
                              <button
                                disabled={busyId === user.id}
                                onClick={() => updateUser(user.id, { verification_status: 'verified' })}
                                style={smallButton('#16A34A', false)}
                              >
                                Approve
                              </button>
                            )}
                            {user.verification_status !== 'rejected' && user.role !== 'admin' && (
                              <button
                                disabled={busyId === user.id}
                                onClick={() => updateUser(user.id, { verification_status: 'rejected' })}
                                style={smallButton('#B91C1C', false)}
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748B' }}>
                      {loading ? 'Loading users...' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
