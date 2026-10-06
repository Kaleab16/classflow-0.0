import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';

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
  const { currentUser } = useAuth();

  if (currentUser.role !== allowedRole) {
    const targetPath = getRoleBasePath(currentUser.role);
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};
