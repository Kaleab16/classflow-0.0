import React from 'react';
import { useAuth, PRESET_PERSONAS } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { ContributionGraph } from '../components/profile/ContributionGraph';
import { MetricCard } from '../components/common/MetricCard';
import { Mail, Building, GraduationCap, CheckCircle2, FileText, Award, Activity } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const ProfilePage: React.FC = () => {
  const { currentUser, setRole } = useAuth();

  const rolePermissions = [
    { capability: 'Submit Class Issues / Requests', student: true, rep: true, teacher: false, admin: false },
    { capability: 'Analyze & Edit Memos for Teachers', student: false, rep: true, teacher: false, admin: false },
    { capability: 'Manage Request Status & Timelines', student: false, rep: true, teacher: true, admin: true },
    { capability: 'Issue Official Instructor Resolutions', student: false, rep: false, teacher: true, admin: true },
    { capability: 'Post Class Announcements', student: false, rep: true, teacher: true, admin: true },
    { capability: 'Access Registrar Escalations Queue', student: false, rep: true, teacher: false, admin: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1040px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          User Profile & Operational Dashboard
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>
          Manage your account credentials, view contribution history, role permissions, and active demo session
        </p>
      </div>

      {/* Profile Main Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {currentUser.avatarInitials}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
              {currentUser.name}
            </h3>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                padding: '2px 10px',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}
            >
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <p style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '16px' }}>
            {currentUser.roleTitle}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#64748B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} color="#2563EB" />
              <span>{currentUser.email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} color="#2563EB" />
              <span>{currentUser.department}</span>
            </div>

            {currentUser.classSection && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap size={16} color="#2563EB" />
                <span>{currentUser.classSection}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample statistics and the demo role switcher exist only in demo mode.
          With a real backend they would show made-up numbers / do nothing. */}
      {!isSupabaseConfigured && (
      <>
      {/* Operational Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard title="Total Memos Compiled" value={28} icon={FileText} accentColor="#2563EB" />
        <MetricCard title="Student Issues Resolved" value={42} icon={CheckCircle2} accentColor="#16A34A" />
        <MetricCard title="Class Impact Rating" value="98%" icon={Award} accentColor="#7C3AED" subtitle="Top Performer" />
        <MetricCard title="Active Contributions" value={184} icon={Activity} accentColor="#0284C7" subtitle="Past 365 Days" />
      </div>

      {/* GitHub-style Contribution Graph with Circular Nodes */}
      <ContributionGraph />

      {/* Role Switcher Demo Cards */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
          Switch Demo Active Role
        </h3>
        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
          Test how ClassFlow adapts its interface for Students, Class Representatives, Teachers, and Administrators
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {(Object.keys(PRESET_PERSONAS) as UserRole[]).map(roleKey => {
            const persona = PRESET_PERSONAS[roleKey];
            const isActive = currentUser.role === roleKey;

            return (
              <button
                key={roleKey}
                onClick={() => setRole(roleKey)}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  border: `2px solid ${isActive ? '#2563EB' : '#E2E8F0'}`,
                  backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#1E40AF' : '#0F172A' }}>
                    {persona.name}
                  </span>
                  {isActive && <CheckCircle2 size={16} color="#2563EB" />}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {persona.roleTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      </>
      )}

      {/* Role Permissions Matrix */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
          Role Capabilities Matrix
        </h3>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>System Capability</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Student</th>
                <th style={{ padding: '10px 14px', textAlign: 'center', backgroundColor: '#EFF6FF' }}>Class Rep</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Teacher</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Admin</th>
              </tr>
            </thead>
            <tbody>
              {rolePermissions.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0F172A' }}>{row.capability}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.student ? '✓' : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', backgroundColor: '#EFF6FF', fontWeight: 700, color: '#2563EB' }}>
                    {row.rep ? '✓' : '—'}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.teacher ? '✓' : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>{row.admin ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
