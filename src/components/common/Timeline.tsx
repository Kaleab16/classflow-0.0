import React from 'react';
import type { ActivityEvent, StakeholderStep } from '../../types/request';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface Props {
  stakeholderSteps: StakeholderStep[];
  activity: ActivityEvent[];
}

export const Timeline: React.FC<Props> = ({ stakeholderSteps, activity }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Stakeholder Workflow Progress Tracker */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '18px 20px'
        }}
      >
        <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', textTransform: 'uppercase', marginBottom: '16px' }}>
          Stakeholder Workflow Loop (Students → Rep → Teacher → Resolution)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {stakeholderSteps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '2px' }}>
                  {isCompleted ? (
                    <CheckCircle2 size={18} color="#16A34A" />
                  ) : isCurrent ? (
                    <Clock size={18} color="#2563EB" />
                  ) : (
                    <Circle size={18} color="#CBD5E1" />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: isCurrent || isCompleted ? 700 : 500,
                          color: isCompleted ? '#0F172A' : isCurrent ? '#2563EB' : '#64748B'
                        }}
                      >
                        {step.title}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          backgroundColor: '#E2E8F0',
                          color: '#475569',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {step.actorRole}
                      </span>
                    </div>

                    {step.timestamp && (
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                        {step.timestamp}
                      </span>
                    )}
                  </div>

                  {step.note && (
                    <p style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                      {step.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log */}
      <div>
        <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', color: '#64748B', textTransform: 'uppercase', marginBottom: '14px' }}>
          Activity Log
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          {activity.map((event) => (
            <div
              key={event.id}
              style={{
                display: 'flex',
                gap: '12px',
                paddingLeft: '4px'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: event.actor === 'rep' ? '#2563EB' : event.actor === 'teacher' ? '#16A34A' : '#64748B',
                  marginTop: '6px'
                }}
              />
              <div style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    {event.actorName}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{event.timestamp}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#334155' }}>{event.action}</p>
                {event.details && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748B', backgroundColor: '#F8FAFC', padding: '6px 10px', borderRadius: '4px', fontStyle: 'italic' }}>
                    "{event.details}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
