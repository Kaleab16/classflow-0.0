import React from 'react';
import { MOCK_TEACHER_MEETINGS } from '../data/mockData';
import { Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';

export const TeacherMeetingsPage: React.FC = () => {
  const upcomingMeetings = MOCK_TEACHER_MEETINGS.filter(m => m.status === 'upcoming');
  const completedMeetings = MOCK_TEACHER_MEETINGS.filter(m => m.status === 'completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Teacher Meetings
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>
          Structured teacher touchpoints and class rep consultation appointments
        </p>
      </div>

      {/* Upcoming Section */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} />
          <span>Upcoming Appointments</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {upcomingMeetings.map(meeting => (
            <div
              key={meeting.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #2563EB',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                    {meeting.teacher}
                  </h4>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    Course: {meeting.course}
                  </span>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1E40AF', backgroundColor: '#EFF6FF', padding: '4px 10px', borderRadius: '20px' }}>
                  {meeting.scheduledTime}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#334155', marginBottom: '14px' }}>
                <strong>Purpose:</strong> {meeting.purpose}
              </p>

              <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#2563EB" />
                  <span>{meeting.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="#2563EB" />
                  <span>{meeting.studentsRepresented} students represented</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Section */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} />
          <span>Completed Meetings</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {completedMeetings.map(meeting => (
            <div
              key={meeting.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px',
                opacity: 0.9
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  {meeting.teacher} — {meeting.course}
                </h4>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                  {meeting.scheduledTime}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                {meeting.purpose} • {meeting.studentsRepresented} students involved
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
