import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { FullPageMessage } from './FullPageMessage';
import { PendingApprovalPage } from '../../pages/PendingApprovalPage';

export const getRoleBasePath = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/student';
    case 'class_rep':
      return '/class-rep';
    case 'teacher':
      return '/teacher';
    case 'admin':
      return '/admin';
    default:
      return '/student';
  }
};

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole, children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Wait for the session check so a refresh does not bounce people around.
  if (loading) {
    return <FullPageMessage>Loading ClassFlow...</FullPageMessage>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Signed in but not approved yet: nothing in the app is available.
  if (currentUser.verificationStatus !== 'verified') {
    return <PendingApprovalPage />;
  }

  if (currentUser.role !== allowedRole) {
    const targetPath = getRoleBasePath(currentUser.role);
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};
