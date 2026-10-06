import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../context/RequestsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { Timeline } from '../components/common/Timeline';
import { ActionModal } from '../components/requests/ActionModal';
import { EditMemoModal } from '../components/requests/EditMemoModal';
import { Users, Calendar, UserCheck, ArrowLeft, FileEdit, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests } = useRequests();
  const { currentUser } = useAuth();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isEditMemoModalOpen, setIsEditMemoModalOpen] = useState(false);

  const request = requests.find(r => r.id === id) || requests[0]; // fallback to first item

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1080px', margin: '0 auto' }}>
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            color: '#64748B',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Requests</span>
        </button>
      </div>

      {/* Main Request Header Card */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                Category: {request.category}
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {request.title}
            </h1>
          </div>

          {/* Quick Actions for Rep / Teacher / Admin */}
          {(currentUser.role === 'class_rep' || currentUser.role === 'teacher' || currentUser.role === 'admin') && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {currentUser.role === 'class_rep' && (
                <button
                  onClick={() => setIsEditMemoModalOpen(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid #2563EB',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <FileEdit size={16} />
                  <span>Edit Memo for Teacher</span>
                </button>
              )}

              <button
                onClick={() => setIsActionModalOpen(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <span>Update Status</span>
              </button>
            </div>
          )}
        </div>

        {/* Request Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              STUDENTS AFFECTED
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              <Users size={16} color="#2563EB" />
              <span>{request.studentsAffected} Students</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              TARGET INSTRUCTOR / DEPT
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              <UserCheck size={16} color="#16A34A" />
              <span>{request.instructor}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              SUBMITTED DATE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
              <Calendar size={16} color="#64748B" />
              <span>{request.submittedAt}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Raw Student Issue */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            1. Raw Issue Raised by Students
          </h3>
          <div style={{ backgroundColor: '#F1F5F9', borderLeft: '4px solid #94A3B8', padding: '12px 16px', borderRadius: '0 6px 6px 0', fontSize: '14px', color: '#334155', lineHeight: 1.5 }}>
            "{request.studentDescription}"
          </div>
        </div>

        {/* Section 2: Formatted Rep Memo */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileEdit size={16} />
              <span>2. Class Rep Formatted Memo (Delivered to {request.instructor})</span>
            </h3>

            {request.repMemoStatus === 'approved_by_rep' ? (
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} />
                <span>Approved & Formatted by Class Rep</span>
              </span>
            ) : (
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#D97706', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                Draft — Review Required
              </span>
            )}
          </div>

          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px', fontSize: '14px', color: '#1E3A8A', lineHeight: 1.6 }}>
            {request.repMemo}
          </div>
        </div>

        {/* Resolution Block if resolved */}
        {request.status === 'resolved' && request.resolutionText && (
          <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', marginBottom: '6px' }}>
              <CheckCircle2 size={16} />
              <span>OFFICIAL RESOLUTION ({request.resolutionDate})</span>
            </div>
            <p style={{ fontSize: '14px', color: '#14532D', fontWeight: 600 }}>
              "{request.resolutionText}"
            </p>
          </div>
        )}
      </div>

      {/* Stakeholder Workflow & Activity Feed */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '24px' }}>
        <Timeline
          stakeholderSteps={request.stakeholderSteps}
          activity={request.activity}
        />
      </div>

      {/* Modals */}
      <ActionModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        requestId={request.id}
        currentStatus={request.status}
      />

      <EditMemoModal
        isOpen={isEditMemoModalOpen}
        onClose={() => setIsEditMemoModalOpen(false)}
        requestId={request.id}
        currentMemo={request.repMemo}
        studentDescription={request.studentDescription}
        instructor={request.instructor}
      />
    </div>
  );
};
