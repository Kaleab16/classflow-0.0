import React from 'react';
import type { Priority } from '../../types/request';

interface Props {
  priority: Priority;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'high':
        return { bg: '#FEE2E2', color: '#991B1B', label: 'HIGH PRIORITY' };
      case 'medium':
        return { bg: '#FFEDD5', color: '#C2410C', label: 'MEDIUM' };
      case 'low':
        return { bg: '#F1F5F9', color: '#475569', label: 'LOW' };
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
        letterSpacing: '0.04em',
        padding: '3px 8px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {style.label}
    </span>
  );
};
