import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  accentColor?: string;
  subtitle?: string;
}

export const MetricCard: React.FC<Props> = ({
  title,
  value,
  icon: Icon,
  accentColor = '#2563EB',
  subtitle
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: '#64748B',
            textTransform: 'uppercase'
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={16} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.1
          }}
        >
          {value}
        </span>
        {subtitle && (
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
