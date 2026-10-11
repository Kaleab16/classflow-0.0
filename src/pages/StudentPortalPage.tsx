import React, { useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { NewRequestModal } from '../components/requests/NewRequestModal';
import { Plus, Megaphone, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const StudentPortalPage: React.FC = () => {
  const { requests, isLoading } = useRequests();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Real details of the signed-in student (never another person's).
  const classLine = [
    currentUser.classSection,
    currentUser.studentId ? `Student ID: ${currentUser.studentId}` : null
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Student Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            STUDENT PORTAL
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Welcome back, {currentUser.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            {classLine}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>Submit Issue to Class Rep</span>
        </button>
      </div>

      {/* Main Student Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Tracked Class Requests */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
            Class Issues & Request Tracker
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isSupabaseConfigured && !isLoading && requests.length === 0 && (
              <div style={{ backgroundColor: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '8px', padding: '20px', fontSize: '13px', color: '#64748B' }}>
                No requests yet. Use "Submit Issue to Class Rep" to raise your first one.
              </div>
            )}
            {requests.map(req => (
              <div
                key={req.id}
                onClick={() => navigate(`/student/requests/${req.id}`)}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <StatusBadge status={req.status} />
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Target: {req.instructor}</span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {req.title}
                </h4>

                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                  {req.studentDescription}
                </p>

                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color="#2563EB" />
                  <span><strong>Current Workflow Step:</strong> {req.waitingOn || 'In Rep Review'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Stream */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Megaphone size={16} color="#2563EB" />
            <span>Class Notices</span>
          </h3>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isSupabaseConfigured ? (
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                No notices yet. Announcements from your class rep will appear here.
              </p>
            ) : (
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', display: 'block', marginBottom: '2px' }}>
                POSTED BY KALEAB (SEP 24)
              </span>
              <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                Assignment #2 Formal Query Sent
              </h5>
              <p style={{ fontSize: '12px', color: '#334155' }}>
                I have compiled and sent our collective query regarding group limits to Dr. Samuel Tadesse. Expecting answer tomorrow!
              </p>
            </div>
            )}
          </div>
        </div>
      </div>

      <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
