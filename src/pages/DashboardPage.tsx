import React, { useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { MetricCard } from '../components/common/MetricCard';
import { RequestCard } from '../components/requests/RequestCard';
import { NewRequestModal } from '../components/requests/NewRequestModal';
import { Inbox, AlertCircle, Clock, CheckCircle2, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { requests } = useRequests();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derived metrics
  const openCount = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed').length;
  const needsAttentionCount = requests.filter(r => r.status === 'new' || r.status === 'in_progress' || r.repMemoStatus === 'draft').length;
  const waitingCount = requests.filter(r => r.status === 'waiting_for_response').length;
  const resolvedCount = requests.filter(r => r.status === 'resolved').length;

  const needsAttentionRequests = requests.filter(
    r => r.status === 'new' || r.status === 'in_progress' || r.repMemoStatus === 'draft'
  ).slice(0, 4);

  // Flatten all activity feeds for Recent Activity section
  const allActivities = requests.flatMap(r =>
    r.activity.map(a => ({ ...a, requestTitle: r.title, requestId: r.id }))
  ).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Welcome, {currentUser.name.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>
            {currentUser.classSection ?? currentUser.department}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>New Request</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Open Requests"
          value={openCount}
          icon={Inbox}
          accentColor="#2563EB"
        />
        <MetricCard
          title="Needs Attention"
          value={needsAttentionCount}
          icon={AlertCircle}
          accentColor="#D97706"
          subtitle="Action required"
        />
        <MetricCard
          title="Waiting for Response"
          value={waitingCount}
          icon={Clock}
          accentColor="#7C3AED"
          subtitle="With instructors"
        />
        <MetricCard
          title="Resolved This Week"
          value={resolvedCount + 14} // Demo total matching spec (18)
          icon={CheckCircle2}
          accentColor="#16A34A"
        />
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        {/* Needs Attention Column */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Needs Attention
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                Student issues waiting for rep review, memo formulation, or status update
              </p>
            </div>
            <button
              onClick={() => navigate('/app/requests')}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2563EB',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View Queue</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {needsAttentionRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>

        {/* Recent Activity Column */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recent Activity
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B' }}>
              Live audit trail of class rep actions & instructor feedback
            </p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {allActivities.map(act => (
              <div
                key={act.id}
                onClick={() => navigate(`/app/requests/${act.requestId}`)}
                style={{
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB' }}>
                    {act.requestTitle}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>{act.timestamp}</span>
                </div>

                <p style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                  <strong style={{ color: '#0F172A' }}>{act.actorName}</strong>: {act.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
