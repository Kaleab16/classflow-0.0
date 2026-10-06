import React from 'react';
import type { RequestStatus } from '../../types/request';

interface Props {
  status: RequestStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'new':
        return { bg: '#E0F2FE', color: '#0369A1', label: 'NEW' };
      case 'in_progress':
        return { bg: '#FEF3C7', color: '#B45309', label: 'IN PROGRESS' };
      case 'waiting_for_response':
        return { bg: '#F3E8FF', color: '#6B21A8', label: 'WAITING FOR TEACHER' };
      case 'resolved':
        return { bg: '#DCFCE7', color: '#15803D', label: 'RESOLVED' };
      case 'closed':
        return { bg: '#F1F5F9', color: '#475569', label: 'CLOSED' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: status };
    }
  };

  const style = getStyle();

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: '3px 8px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        textTransform: 'uppercase'
      }}
    >
      {style.label}
    </span>
  );
};
