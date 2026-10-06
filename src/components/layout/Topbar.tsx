import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, GraduationCap, Database } from 'lucide-react';
import { NewRequestModal } from '../requests/NewRequestModal';
import { useNavigate } from 'react-router-dom';
import { isSupabaseConfigured } from '../../lib/supabase';

export const Topbar: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getProfilePath = () => {
    switch (currentUser.role) {
      case 'student': return '/student/profile';
      case 'teacher': return '/teacher/profile';
      case 'admin': return '/admin/profile';
      case 'class_rep': default: return '/class-rep/profile';
    }
  };

  return (
    <>
      <header
        style={{
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '6px 10px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <GraduationCap size={16} color="#2563EB" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF' }}>
              {currentUser.department}
            </span>
            {currentUser.classSection && (
              <span style={{ fontSize: '11px', color: '#3B82F6', backgroundColor: '#FFFFFF', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                Sec A
              </span>
            )}
          </div>

          <div
            title={
              isSupabaseConfigured
                ? 'Connected to live Supabase backend'
                : 'Running in local mode. Connect VITE_SUPABASE_URL for backend auth.'
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: isSupabaseConfigured ? '#ECFDF5' : '#F1F5F9',
              color: isSupabaseConfigured ? '#047857' : '#64748B',
              border: `1px solid ${isSupabaseConfigured ? '#A7F3D0' : '#E2E8F0'}`,
            }}
          >
            <Database size={12} color={isSupabaseConfigured ? '#10B981' : '#94A3B8'} />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Auth'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Static Role & User Identity Display (No dropdown) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {currentUser.roleTitle.split('(')[0].trim()}
            </div>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>•</span>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              {currentUser.name}
            </div>
          </div>

          {/* Profile Button */}
          <button
            onClick={() => navigate(getProfilePath())}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {currentUser.avatarInitials}
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              Profile
            </span>
          </button>

          {/* Action Button for Class Rep or Student */}
          {(currentUser.role === 'class_rep' || currentUser.role === 'student') && (
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} />
              <span>{currentUser.role === 'student' ? 'Submit Issue' : 'New Request'}</span>
            </button>
          )}
        </div>
      </header>

      <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
