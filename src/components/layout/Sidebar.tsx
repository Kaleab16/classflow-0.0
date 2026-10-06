import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Calendar,
  LogOut,
  User,
  PlusCircle,
  Bell,
  Ticket,
  MessageSquare,
  Building,
  UserCheck,
  GraduationCap,
  BarChart3,
  Settings
} from 'lucide-react';
import { getRoleBasePath } from '../common/ProtectedRoute';

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { label: 'Submit Request', path: '/student/submit', icon: PlusCircle },
          { label: 'My Requests', path: '/student/requests', icon: Inbox },
          { label: 'Teacher Meeting', path: '/student/meetings', icon: Calendar },
          { label: 'Notifications', path: '/student/notifications', icon: Bell },
          { label: 'Profile', path: '/student/profile', icon: User }
        ];
      case 'class_rep':
        return [
          { label: 'Dashboard', path: '/class-rep/dashboard', icon: LayoutDashboard },
          { label: 'Student Requests', path: '/class-rep/requests', icon: Inbox },
          { label: 'Tickets', path: '/class-rep/tickets', icon: Ticket },
          { label: 'Communication', path: '/class-rep/communication', icon: MessageSquare },
          { label: 'Class Management', path: '/class-rep/class', icon: Users },
          { label: 'Notifications', path: '/class-rep/notifications', icon: Bell },
          { label: 'Profile', path: '/class-rep/profile', icon: User }
        ];
      case 'teacher':
        return [
          { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
          { label: 'Requests', path: '/teacher/requests', icon: Inbox },
          { label: 'Teacher Meetings', path: '/teacher/meetings', icon: Calendar },
          { label: 'Communication', path: '/teacher/communication', icon: MessageSquare },
          { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
          { label: 'Profile', path: '/teacher/profile', icon: User }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Users', path: '/admin/users', icon: Users },
          { label: 'Classes', path: '/admin/classes', icon: Building },
          { label: 'Representatives', path: '/admin/representatives', icon: UserCheck },
          { label: 'Teachers', path: '/admin/teachers', icon: GraduationCap },
          { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
          { label: 'Profile', path: '/admin/profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const roleBasePath = getRoleBasePath(currentUser.role);

  return (
    <aside
      style={{
        width: '240px',
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}
    >
      <div>
        {/* Brand Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#2563EB',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
              color: '#FFFFFF'
            }}
          >
            CF
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
              CLASSFLOW
            </h1>
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>
              {currentUser.role.toUpperCase().replace('_', ' ')} WORKSPACE
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  transition: 'all 0.15s ease'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Context Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #1E293B' }}>
        <NavLink
          to={`${roleBasePath}/profile`}
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '6px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {currentUser.avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>
              {currentUser.roleTitle.split('(')[0]}
            </div>
          </div>
        </NavLink>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '12px',
            fontSize: '12px',
            color: '#64748B',
            padding: '6px 8px',
            borderRadius: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <LogOut size={14} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
};
