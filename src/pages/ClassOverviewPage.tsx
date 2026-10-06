import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { Users, Inbox, Clock, CheckCircle2, Megaphone } from 'lucide-react';

export const ClassOverviewPage: React.FC = () => {
  const studentsList = [
    { id: 'STU-001', name: 'Abebe Bikila', idNum: 'ETS/0123/15', role: 'Student' },
    { id: 'STU-002', name: 'Bethlehem Tadesse', idNum: 'ETS/0124/15', role: 'Student' },
    { id: 'STU-003', name: 'Dawit Getachew', idNum: 'ETS/0125/15', role: 'Student' },
    { id: 'STU-004', name: 'Eyerusalem Kebede', idNum: 'ETS/0126/15', role: 'Student' },
    { id: 'STU-005', name: 'Kaleab Tesfaye', idNum: 'ETS/0127/15', role: 'Class Representative' },
    { id: 'STU-006', name: 'Yonas Mekonnen', idNum: 'ETS/0128/15', role: 'Student' },
    { id: 'STU-007', name: 'Zelalem Haile', idNum: 'ETS/0129/15', role: 'Student' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
          Class Overview
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>
          Software Engineering — Section A Workspace Details
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <MetricCard title="Total Students" value={48} icon={Users} accentColor="#2563EB" />
        <MetricCard title="Open Requests" value={12} icon={Inbox} accentColor="#D97706" />
        <MetricCard title="Pending Teacher" value={5} icon={Clock} accentColor="#7C3AED" />
        <MetricCard title="Resolved This Week" value={18} icon={CheckCircle2} accentColor="#16A34A" />
      </div>

      {/* Announcements */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Megaphone size={18} color="#2563EB" />
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Class Announcements (Posted by Rep)
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Software Architecture Assignment #2 Update
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Sep 24, 2026</span>
            </div>
            <p style={{ fontSize: '12px', color: '#475569' }}>
              Dr. Samuel Tadesse is currently reviewing our clarification memo regarding group limits. Stay tuned for final notice.
            </p>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Course Registration Desk Hours
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>Sep 23, 2026</span>
            </div>
            <p style={{ fontSize: '12px', color: '#475569' }}>
              Department Registrar desk is open Thursday 9:00 AM - 12:00 PM for manual prerequisite clearance.
            </p>
          </div>
        </div>
      </div>

      {/* Roster Preview */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '14px' }}>
          Section A Student Roster (48 Total)
        </h3>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Student Name</th>
                <th style={{ padding: '10px 14px' }}>ID Number</th>
                <th style={{ padding: '10px 14px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((stu, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                  <td style={{ padding: '10px 14px', fontWeight: stu.role.includes('Representative') ? 700 : 500, color: '#0F172A' }}>
                    {stu.name}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>{stu.idNum}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: stu.role.includes('Representative') ? '#EFF6FF' : '#F1F5F9',
                        color: stu.role.includes('Representative') ? '#2563EB' : '#475569',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {stu.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
