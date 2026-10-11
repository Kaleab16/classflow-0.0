import React from 'react';
import { CalendarClock } from 'lucide-react';

export const TeacherMeetingsPage: React.FC = () => (
  <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <header>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Teacher meetings</h2>
      <p style={{ margin: '6px 0 0', fontSize: 14, lineHeight: 1.6, color: '#64748B' }}>
        Consultation appointments will appear here once meeting storage and scheduling are implemented.
      </p>
    </header>
    <section style={{ padding: 28, border: '1px dashed #CBD5E1', borderRadius: 12, background: '#FFFFFF', textAlign: 'center' }}>
      <CalendarClock size={30} color="#64748B" style={{ margin: '0 auto 12px' }} />
      <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#0F172A' }}>Scheduling is not enabled yet</h3>
      <p style={{ maxWidth: 520, margin: '0 auto', fontSize: 13, lineHeight: 1.7, color: '#64748B' }}>
        There are no persisted meeting records to load. The previous sample appointments have been removed so this page does not present fictional meetings as real commitments.
      </p>
    </section>
  </div>
);
