import React from 'react';
import { useRequests } from '../../context/RequestsContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Ticket, Filter, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TicketsView: React.FC = () => {
  const { requests } = useRequests();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          CLASS REP TICKET DISPATCH
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Actionable Student Issues & Tickets
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Triage incoming requests, format memos, assign priority, and monitor ticket lifecycles
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} color="#8B5CF6" />
            <span>Active Tickets Queue ({requests.length})</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', backgroundColor: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <Filter size={14} />
            <span>Sorted by Priority</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requests.map(req => (
            <div
              key={req.id}
              onClick={() => navigate(`/class-rep/requests/${req.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '12px', color: '#8B5CF6', backgroundColor: '#F3E8FF', padding: '4px 8px', borderRadius: '4px' }}>
                  {req.id}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <StatusBadge status={req.status} />
                    <PriorityBadge priority={req.priority} />
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Instructor: {req.instructor}</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {req.title}
                  </h4>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                  {req.studentsAffected} Students
                </span>
                <ArrowRight size={16} color="#94A3B8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
