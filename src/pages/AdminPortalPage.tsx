import React from 'react';
import { useRequests } from '../context/RequestsContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { ShieldAlert } from 'lucide-react';

export const AdminPortalPage: React.FC = () => {
  const { requests } = useRequests();
  const academicEscalations = requests.filter(r => r.category === 'academic' || r.instructor.includes('Registrar'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Admin Header */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ACADEMIC ADMINISTRATION & REGISTRAR
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Department Registrar Office
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Oversight of class representative escalations, prerequisite grade sync, and course registration desks
        </p>
      </div>

      {/* Admin Escalations Queue */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={18} color="#D97706" />
          <span>Registrar Escalations ({academicEscalations.length})</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {academicEscalations.map(req => (
            <div
              key={req.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <StatusBadge status={req.status} />
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  Submitted by Rep: Kaleab Tesfaye
                </span>
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                {req.title} ({req.studentsAffected} Students)
              </h4>

              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                "{req.repMemo}"
              </p>

              {req.resolutionText && (
                <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#14532D', fontWeight: 600 }}>
                  Registrar Resolution: "{req.resolutionText}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
