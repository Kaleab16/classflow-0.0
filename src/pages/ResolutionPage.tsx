import React from 'react';
import { useRequests } from '../context/RequestsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Timeline } from '../components/common/Timeline';
import { ArrowLeft, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResolutionPage: React.FC = () => {
  const navigate = useNavigate();
  const { requests } = useRequests();

  // Find resolved request (or default to REQ-102 Course Registration issue)
  const resolvedReq = requests.find(r => r.status === 'resolved') || requests[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/requests')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontWeight: 600,
          color: '#64748B',
          cursor: 'pointer'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Requests</span>
      </button>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <StatusBadge status="resolved" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
            Closed Loop Achieved
          </span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          Resolution Summary: {resolvedReq.title}
        </h1>

        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
          Demonstration of a fully resolved class issue handled by Class Rep <strong>Kaleab</strong>.
        </p>

        {/* Resolution Outcome Banner */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 800, fontSize: '14px', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={20} />
            <span>CONFIRMED INSTRUCTOR / ADMINISTRATIVE RESOLUTION</span>
          </div>

          <p style={{ fontSize: '15px', color: '#14532D', fontWeight: 700, lineHeight: 1.5 }}>
            "{resolvedReq.resolutionText || 'Registrar confirmed that students can complete the missing course registration step through the department office desk by Friday.'}"
          </p>

          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #BBF7D0', display: 'flex', gap: '16px', fontSize: '12px', color: '#166534' }}>
            <span>Resolved Date: {resolvedReq.resolutionDate || 'September 25, 2026'}</span>
            <span>Target: {resolvedReq.instructor}</span>
            <span>Students Notified: {resolvedReq.studentsAffected} students</span>
          </div>
        </div>

        {/* Full Stakeholder Timeline */}
        <Timeline
          stakeholderSteps={resolvedReq.stakeholderSteps}
          activity={resolvedReq.activity}
        />
      </div>
    </div>
  );
};
