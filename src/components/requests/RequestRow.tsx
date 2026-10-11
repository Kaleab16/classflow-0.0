import React from 'react';
import type { ClassRequest } from '../../types/request';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleBasePath } from '../common/ProtectedRoute';
import { formatWhen } from '../../lib/time';

interface Props {
  request: ClassRequest;
}

export const RequestRow: React.FC<Props> = ({ request }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const roleBasePath = getRoleBasePath(currentUser.role);

  return (
    <tr
      onClick={() => navigate(`${roleBasePath}/requests/${request.id}`)}
      style={{
        borderBottom: '1px solid #E2E8F0',
        cursor: 'pointer',
        transition: 'background-color 0.1s ease'
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <td style={{ padding: '14px 16px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {request.title}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
            Target: {request.instructor}
          </div>
        </div>
      </td>

      <td style={{ padding: '14px 16px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'capitalize',
            color: '#475569',
            backgroundColor: '#F1F5F9',
            padding: '3px 8px',
            borderRadius: '4px'
          }}
        >
          {request.category}
        </span>
      </td>

      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>
          <Users size={14} color="#64748B" />
          <span>{request.studentsAffected} students</span>
        </div>
      </td>

      <td style={{ padding: '14px 16px' }}>
        <PriorityBadge priority={request.priority} />
      </td>

      <td style={{ padding: '14px 16px' }}>
        <StatusBadge status={request.status} />
      </td>

      <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748B' }}>
        {formatWhen(request.lastUpdatedAt)}
      </td>

      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
        <ChevronRight size={16} color="#94A3B8" />
      </td>
    </tr>
  );
};
