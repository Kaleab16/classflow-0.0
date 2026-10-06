import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, Megaphone, Clock, Info } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser } = useAuth();

  const notifications = [
    {
      id: 'notif-1',
      title: 'Lab Equipment Request Resolved',
      message: 'Dr. Samuel Tadesse issued an official resolution for Room 204 Oscilloscope setup.',
      timestamp: '10 mins ago',
      type: 'success',
      icon: CheckCircle2,
      color: '#16A34A',
      bgColor: '#DCFCE7'
    },
    {
      id: 'notif-2',
      title: 'New Class Notice Posted',
      message: 'Class Rep Kaleab Tesfaye posted an update regarding Assignment #2 extension query.',
      timestamp: '1 hour ago',
      type: 'announcement',
      icon: Megaphone,
      color: '#2563EB',
      bgColor: '#EFF6FF'
    },
    {
      id: 'notif-3',
      title: 'Memo Forwarded to Course Chair',
      message: 'Formal memo regarding Mid-term exam schedule query delivered to Dr. Samuel.',
      timestamp: '3 hours ago',
      type: 'pending',
      icon: Clock,
      color: '#D97706',
      bgColor: '#FEF3C7'
    },
    {
      id: 'notif-4',
      title: 'System Workspace Reorganization',
      message: 'ClassFlow role-specific workspace active for ' + currentUser.roleTitle,
      timestamp: 'Today',
      type: 'info',
      icon: Info,
      color: '#7C3AED',
      bgColor: '#F3E8FF'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ACTIVITY & NOTIFICATIONS
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
          {currentUser.roleTitle} Notifications
        </h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
          Real-time alerts, class notices, and status update notifications for your workspace
        </p>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="#2563EB" />
          <span>Recent Activity Stream</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(notif => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: notif.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} color={notif.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
                      {notif.timestamp}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
