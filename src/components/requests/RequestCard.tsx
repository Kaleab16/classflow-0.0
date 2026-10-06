import React from 'react';
import type { ClassRequest } from '../../types/request';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Users, Clock, ArrowRight, FileEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleBasePath } from '../common/ProtectedRoute';

interface Props {
  request: ClassRequest;
}

export const RequestCard: React.FC<Props> = ({ request }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const roleBasePath = getRoleBasePath(currentUser.role);

  return (
    <div
      onClick={() => navigate(`${roleBasePath}/requests/${request.id}`)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px 18px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#2563EB';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
          <Users size={14} />
          <span>{request.studentsAffected} students</span>
        </div>
      </div>

      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
        {request.title}
      </h4>

      <p
        style={{
          fontSize: '13px',
          color: '#475569',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4
        }}
      >
        {request.studentDescription}
      </p>

      {/* Rep Memo Status indicator */}
      {request.repMemoStatus === 'draft' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#D97706',
            backgroundColor: '#FEF3C7',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: '12px'
          }}
        >
          <FileEdit size={12} />
          <span>Needs Rep Memo Review before sending to teacher</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={13} />
          <span>Updated {request.lastUpdatedAt}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563EB', fontWeight: 600 }}>
          <span>Review Issue</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};
