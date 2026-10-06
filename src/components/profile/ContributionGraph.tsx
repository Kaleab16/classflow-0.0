import React, { useMemo } from 'react';
import { GENERATE_CONTRIBUTION_DAYS } from '../../data/mockData';
import { Activity, Flame, Award, CheckCircle2 } from 'lucide-react';

export const ContributionGraph: React.FC = () => {
  const days = useMemo(() => GENERATE_CONTRIBUTION_DAYS(), []);

  // Total contributions count
  const totalContributions = useMemo(() => {
    return days.reduce((sum, d) => sum + d.count, 0);
  }, [days]);

  // Group into weeks (52 weeks x 7 days)
  const weeks = useMemo(() => {
    const w: (typeof days)[] = [];
    for (let i = 0; i < days.length; i += 7) {
      w.push(days.slice(i, i + 7));
    }
    return w;
  }, [days]);

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return '#F1F5F9';
      case 1: return '#BFDBFE';
      case 2: return '#60A5FA';
      case 3: return '#2563EB';
      case 4: return '#1E40AF';
      default: return '#F1F5F9';
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#2563EB" />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Operational Activity & Contribution Matrix
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
            {totalContributions} total class rep actions (memos compiled, resolutions, student responses) in the past year
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '6px' }}>
            <Flame size={14} color="#D97706" />
            <span style={{ fontWeight: 700, color: '#1E40AF' }}>14 Day Active Streak</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#DCFCE7', padding: '6px 12px', borderRadius: '6px' }}>
            <Award size={14} color="#16A34A" />
            <span style={{ fontWeight: 700, color: '#14532D' }}>Top 2% Class Rep Response Rate</span>
          </div>
        </div>
      </div>

      {/* Circular Node Contribution Grid (GitHub-style with circles) */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} rep contributions`}
                    style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%', // Round circle instead of rectangle as requested!
                      backgroundColor: getColor(day.intensity),
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease, background-color 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.35)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px', marginTop: '12px', fontSize: '11px', color: '#64748B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={13} color="#16A34A" />
          <span>Daily Class Rep Actions Logged</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%', // Round circle
                backgroundColor: getColor(intensity)
              }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
