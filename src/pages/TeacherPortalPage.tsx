import React, { useState } from 'react';
import { useRequests } from '../context/RequestsContext';
import { MOCK_TEACHER_SECTIONS } from '../data/mockData';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionModal } from '../components/requests/ActionModal';
import { TeacherAnalyticsView } from '../components/teacher/TeacherAnalyticsView';
import { FileEdit, CheckCircle2, Calendar, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherPortalPage: React.FC = () => {
  const { requests } = useRequests();
  const navigate = useNavigate();
  const [selectedSectionId, setSelectedSectionId] = useState<string>(MOCK_TEACHER_SECTIONS[0].id);
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  const activeSection = MOCK_TEACHER_SECTIONS.find(s => s.id === selectedSectionId) || MOCK_TEACHER_SECTIONS[0];

  // Filter requests targeting Dr. Samuel Tadesse
  const teacherRequests = requests.filter(r => r.instructor.includes('Samuel') || r.status === 'waiting_for_response');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Teacher Header */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          INSTRUCTOR MULTI-CLASS DASHBOARD
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Dr. Samuel Tadesse
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Senior Lecturer — Overseeing 5 Course Sections & Assigned Class Representatives
        </p>
      </div>

      {/* Multi-Class Section Tabs (1 Teacher -> Many Class Reps & Sections) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <Layers size={16} color="#2563EB" />
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Select Course Section ({MOCK_TEACHER_SECTIONS.length} Sections Managed)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px' }}>
          {MOCK_TEACHER_SECTIONS.map(section => {
            const isSelected = section.id === activeSection.id;
            return (
              <button
                key={section.id}
                onClick={() => setSelectedSectionId(section.id)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: `2px solid ${isSelected ? '#2563EB' : '#E2E8F0'}`,
                  backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : '0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? '#2563EB' : '#64748B' }}>
                  {section.courseCode}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {section.sectionName.split('—')[1] || section.sectionName}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', borderTop: '1px solid #F1F5F9', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Rep: <strong>{section.classRepName.split(' ')[0]}</strong></span>
                  <span style={{ fontSize: '11px', backgroundColor: isSelected ? '#DBEAFE' : '#F1F5F9', color: '#1E40AF', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {section.pendingRequests} Pending
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytical View for Selected Class Section */}
      <TeacherAnalyticsView section={activeSection} />

      {/* Forwarded Memos Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileEdit size={16} color="#2563EB" />
            <span>Memos Forwarded by {activeSection.classRepName} ({teacherRequests.length})</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {teacherRequests.map(req => (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <StatusBadge status={req.status} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '2px 8px', borderRadius: '4px' }}>
                    {req.studentsAffected} Students Affected
                  </span>
                </div>

                <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  {req.title}
                </h4>

                {/* Rep Formatted Memo */}
                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '12px', marginBottom: '14px', fontSize: '13px', color: '#1E3A8A' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', marginBottom: '4px' }}>
                    FORMATTED MEMO FROM {activeSection.classRepName.toUpperCase()} (CLASS REP)
                  </div>
                  "{req.repMemo}"
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <button
                    onClick={() => navigate(`/app/requests/${req.id}`)}
                    style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    View Timeline
                  </button>

                  <button
                    onClick={() => setSelectedReqId(req.id)}
                    style={{
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Issue Decision / Resolution</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Appointments */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} color="#2563EB" />
            <span>Consultation Appointments</span>
          </h3>

          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', marginBottom: '2px' }}>
                TOMORROW — 10:30 AM
              </div>
              <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                Meeting with {activeSection.classRepName} ({activeSection.sectionName.split('—')[1] || 'Sec A'})
              </h5>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                Office 304, Block B • Purpose: Assignment #2 Clarification
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedReqId && (
        <ActionModal
          isOpen={!!selectedReqId}
          onClose={() => setSelectedReqId(null)}
          requestId={selectedReqId}
          currentStatus="waiting_for_response"
        />
      )}
    </div>
  );
};
