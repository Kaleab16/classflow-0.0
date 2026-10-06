import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Megaphone } from 'lucide-react';

export const CommunicationView: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          CLASS COMMUNICATION & ANNOUNCEMENTS
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          {currentUser.role === 'teacher' ? 'Instructor Communication Center' : 'Class Rep Communications Hub'}
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Broadcast notices to students, coordinate with course chairs, and issue structured memos
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Active Communications Stream */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#2563EB" />
            <span>Class Bulletins & Formal Memos</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                  CLASS NOTICE • POSTED BY KALEAB TESFAYE
                </span>
                <span style={{ fontSize: '11px', color: '#60A5FA' }}>Yesterday</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                Assignment #2 Extension Query Status
              </h4>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                Submitted formal query memo to Dr. Samuel regarding group project size limits. Instructor decision expected during office hours tomorrow.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase' }}>
                  TEACHER MEMO ANSWER • DR. SAMUEL TADESSE
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Sep 24</span>
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                Room 204 Oscilloscope Setup Resolution
              </h4>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                "Department technician has re-calibrated bench 3 and bench 4 oscilloscopes. Lab sessions will proceed as scheduled."
              </p>
            </div>
          </div>
        </div>

        {/* Quick Broadcast Panel */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone size={18} color="#2563EB" />
            <span>Post Class Broadcast</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Notice Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Schedule Update for Software Architecture"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Notice Details
              </label>
              <textarea
                rows={4}
                placeholder="Type your official announcement to the class section..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginTop: '4px'
              }}
            >
              <Send size={16} />
              <span>Broadcast to Section A</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
