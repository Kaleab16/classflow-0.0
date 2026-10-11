import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Shown to anyone who is signed in but not verified yet.
export const PendingApprovalPage: React.FC = () => {
  const { currentUser, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const rejected = currentUser.verificationStatus === 'rejected';

  const handleCheckAgain = async () => {
    setChecking(true);
    try {
      await refreshProfile();
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px 28px',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: rejected ? '#FEE2E2' : '#FEF3C7',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {rejected ? <AlertCircle size={28} color="#B91C1C" /> : <Clock size={28} color="#D97706" />}
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          {rejected ? 'Account not approved' : 'Waiting for approval'}
        </h1>

        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
          {rejected
            ? 'Your account was not approved. If you think this is a mistake, please talk to your class admin.'
            : 'Thanks for signing up. Your class admin needs to check your student ID before you can use ClassFlow. This is usually done in class, so check back soon.'}
        </p>

        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '13px',
            color: '#334155',
            textAlign: 'left',
            marginBottom: '20px'
          }}
        >
          <div>
            <strong>Name:</strong> {currentUser.name}
          </div>
          {currentUser.studentId && (
            <div>
              <strong>Student ID:</strong> {currentUser.studentId}
            </div>
          )}
          {currentUser.classSection && (
            <div>
              <strong>Section:</strong> {currentUser.classSection}
            </div>
          )}
          <div>
            <strong>Email:</strong> {currentUser.email}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {!rejected && (
            <button
              onClick={handleCheckAgain}
              disabled={checking}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: checking ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} />
              <span>{checking ? 'Checking...' : 'Check again'}</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
