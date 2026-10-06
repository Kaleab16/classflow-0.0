import React from 'react';
import { Users, Plus, Search } from 'lucide-react';

export const AdminUsersView: React.FC = () => {
  const users = [
    { id: 'u1', name: 'Kaleab Tesfaye', role: 'Class Representative', dept: 'Software Engineering', status: 'Active', email: 'kaleab.rep@sw.edu.et' },
    { id: 'u2', name: 'Abebe Bikila', role: 'Student', dept: 'Software Engineering', status: 'Active', email: 'abebe.b@sw.edu.et' },
    { id: 'u3', name: 'Dr. Samuel Tadesse', role: 'Teacher / Instructor', dept: 'Computer Science & Software Eng.', status: 'Active', email: 'samuel.tadesse@univ.edu.et' },
    { id: 'u4', name: 'Department Registrar Office', role: 'Admin', dept: 'Department of Software Engineering', status: 'Active', email: 'registrar.sw@univ.edu.et' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ACADEMIC ADMINISTRATION
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginTop: '2px' }}>
            User Management & Role Directory
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
            Manage user accounts, assign role permissions, and provision access credentials
          </p>
        </div>

        <button
          style={{
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>Provision User</span>
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#7C3AED" />
            <span>Registered Users ({users.length})</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#F8FAFC', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', width: '240px' }}>
            <Search size={14} color="#94A3B8" />
            <input
              placeholder="Search user or email..."
              style={{ border: 'none', background: 'none', fontSize: '12px', outline: 'none', width: '100%' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 12px' }}>Name & Email</th>
              <th style={{ padding: '10px 12px' }}>Assigned Role</th>
              <th style={{ padding: '10px 12px' }}>Department</th>
              <th style={{ padding: '10px 12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{user.email}</div>
                </td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#7C3AED' }}>
                  {user.role}
                </td>
                <td style={{ padding: '12px', color: '#475569' }}>
                  {user.dept}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
