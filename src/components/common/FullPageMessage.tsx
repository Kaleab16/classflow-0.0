import React from 'react';

interface Props {
  children: React.ReactNode;
}

// Simple centered screen used for "loading" and similar full-page states.
export const FullPageMessage: React.FC<Props> = ({ children }) => (
  <div
    style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontSize: '14px',
      textAlign: 'center'
    }}
  >
    {children}
  </div>
);
