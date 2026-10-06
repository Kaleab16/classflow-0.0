import React from 'react';
import { Building } from 'lucide-react';

export const AdminClassesView: React.FC = () => {
  const sections = [
    { id: 'sec-1', name: 'Software Engineering — Section A', rep: 'Kaleab Tesfaye', students: 48, instructor: 'Dr. Samuel Tadesse' },
    { id: 'sec-2', name: 'Software Engineering — Section B', rep: 'Tigist Alemu', students: 52, instructor: 'Dr. Samuel Tadesse' },
    { id: 'sec-3', name: 'Computer Science — Section C', rep: 'Dawit Yohannes', students: 45, instructor: 'Dr. Samuel Tadesse' },
    { id: 'sec-4', name: 'Data Science — Section D', rep: 'Meron Bekele', students: 40, instructor: 'Dr. Samuel Tadesse' },
    { id: 'sec-5', name: 'Information Systems — Section E', rep: 'Yonas Gebre', students: 50, instructor: 'Dr. Samuel Tadesse' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ACADEMIC SECTIONS & COURSES
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Class Sections Directory
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Overview of registered university class sections, student capacity, and assigned class representatives
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {sections.map(sec => (
          <div key={sec.id} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Building size={18} color="#7C3AED" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {sec.name}
              </h3>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
              <div>Class Rep: <strong>{sec.rep}</strong></div>
              <div>Course Instructor: <strong>{sec.instructor}</strong></div>
              <div>Student Capacity: <strong>{sec.students} Registered Students</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminRepsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          CLASS REPRESENTATIVES MANAGEMENT
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Active Class Representatives
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Roster of appointed student representatives, contribution histories, and section assignments
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
          Representative Roster & Contribution Activity
        </h3>
        <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E40AF', margin: '0 0 4px 0' }}>
            Kaleab Tesfaye — Lead Representative (Section A)
          </h4>
          <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
            Active • 24 Memos Drafted • 94% Resolution Rate • 48 Students Managed
          </p>
        </div>
      </div>
    </div>
  );
};

export const AdminTeachersView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          FACULTY & INSTRUCTORS
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Faculty & Course Chairs
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Directory of academic instructors, multi-section assignments, and memo resolution stats
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#166534', margin: '0 0 4px 0' }}>
            Dr. Samuel Tadesse — Course Chair & Senior Instructor
          </h4>
          <p style={{ fontSize: '13px', color: '#15803D', margin: 0 }}>
            Assigned to 5 Course Sections • 18 Memo Resolutions Issued This Term
          </p>
        </div>
      </div>
    </div>
  );
};

export const AdminReportsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          DEPARTMENT ANALYTICS & REPORTS
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Academic Resolution Reports
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Metrics on student requests, class representative response times, and instructor resolution rates
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>TOTAL REQUESTS</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#7C3AED' }}>142</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>RESOLVED ISSUES</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#16A34A' }}>128</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>AVG RESOLUTION TIME</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563EB' }}>1.4 Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SYSTEM CONFIGURATION
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          Admin Settings & Preferences
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Configure university term parameters, escalation rules, and Supabase database integration settings
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          ClassFlow Workspace Configuration
        </div>
        <p style={{ fontSize: '13px', color: '#64748B' }}>
          Role-based workspace isolation active for Student, Class Representative, Teacher, and Department Administrator.
        </p>
      </div>
    </div>
  );
};
