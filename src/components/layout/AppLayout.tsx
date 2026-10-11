import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useRequests } from '../../context/RequestsContext';

export const AppLayout: React.FC = () => {
  const { actionError, clearActionError } = useRequests();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Topbar />

        {/* Shown whenever loading or saving failed, so a lost change is never silent */}
        {actionError && (
          <div
            role="alert"
            style={{
              backgroundColor: '#FEE2E2',
              borderBottom: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 24px',
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>{actionError}</span>
            <button
              onClick={clearActionError}
              style={{
                background: 'none',
                border: '1px solid #FCA5A5',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#991B1B',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#F8FAFC' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
