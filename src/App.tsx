import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestsProvider } from './context/RequestsContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, getRoleBasePath } from './components/common/ProtectedRoute';

// Core Pages
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { TeacherPortalPage } from './pages/TeacherPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

// Shared Operational Views
import { RequestsPage } from './pages/RequestsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { ClassOverviewPage } from './pages/ClassOverviewPage';
import { TeacherMeetingsPage } from './pages/TeacherMeetingsPage';
import { ProfilePage } from './pages/ProfilePage';

// Role Views
import { NotificationsView } from './pages/views/NotificationsView';
import { CommunicationView } from './pages/views/CommunicationView';
import { TicketsView } from './pages/views/TicketsView';
import { AdminUsersView } from './pages/views/AdminUsersView';
import {
  AdminClassesView,
  AdminRepsView,
  AdminTeachersView,
  AdminReportsView,
  AdminSettingsView
} from './pages/views/AdminViews';

import './styles/tokens.css';

// Helper component to redirect legacy /app or fallback routes to user's role workspace
function RoleRedirect() {
  const { currentUser } = useAuth();
  const targetPath = getRoleBasePath(currentUser.role);
  return <Navigate to={targetPath} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<SignInPage />} />

      {/* 1. STUDENT WORKSPACE (/student) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentPortalPage />} />
        <Route path="submit" element={<StudentPortalPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="meetings" element={<TeacherMeetingsPage />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 2. CLASS REPRESENTATIVE WORKSPACE (/class-rep) */}
      <Route
        path="/class-rep"
        element={
          <ProtectedRoute allowedRole="class_rep">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/class-rep/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="tickets" element={<TicketsView />} />
        <Route path="communication" element={<CommunicationView />} />
        <Route path="class" element={<ClassOverviewPage />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 3. TEACHER WORKSPACE (/teacher) */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRole="teacher">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherPortalPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="meetings" element={<TeacherMeetingsPage />} />
        <Route path="communication" element={<CommunicationView />} />
        <Route path="notifications" element={<NotificationsView />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 4. ADMIN WORKSPACE (/admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminPortalPage />} />
        <Route path="requests/:id" element={<RequestDetailPage />} />
        <Route path="users" element={<AdminUsersView />} />
        <Route path="classes" element={<AdminClassesView />} />
        <Route path="representatives" element={<AdminRepsView />} />
        <Route path="teachers" element={<AdminTeachersView />} />
        <Route path="reports" element={<AdminReportsView />} />
        <Route path="settings" element={<AdminSettingsView />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Legacy /app Redirect */}
      <Route path="/app/*" element={<RoleRedirect />} />

      {/* Fallback */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <RequestsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </RequestsProvider>
    </AuthProvider>
  );
}

export default App;
