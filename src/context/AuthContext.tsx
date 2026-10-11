import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEPARTMENT_NAME } from '../config';

export type UserRole = 'class_rep' | 'student' | 'teacher' | 'admin';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  department: string;
  avatarInitials: string;
  classSection?: string;
  courses?: string[];
  studentId?: string;
  verificationStatus: VerificationStatus;
}

// Demo personas. They are ONLY used when the app runs without Supabase
// (no VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). With a backend configured,
// the role always comes from the database, never from the browser.
export const PRESET_PERSONAS: Record<UserRole, UserProfile> = {
  student: {
    id: 'user-stu-1',
    name: 'Abebe Bikila',
    role: 'student',
    roleTitle: 'Student (ID: ETS/0123/15)',
    email: 'abebe.b@sw.edu.et',
    department: 'Software Engineering',
    avatarInitials: 'AB',
    classSection: 'Software Engineering — Section A',
    studentId: 'ETS/0123/15',
    verificationStatus: 'verified'
  },
  class_rep: {
    id: 'user-rep-1',
    name: 'Kaleab Tesfaye',
    role: 'class_rep',
    roleTitle: 'Class Representative',
    email: 'kaleab.rep@sw.edu.et',
    department: 'Software Engineering',
    avatarInitials: 'KT',
    classSection: 'Software Engineering — Section A',
    verificationStatus: 'verified'
  },
  teacher: {
    id: 'user-tch-1',
    name: 'Dr. Samuel Tadesse',
    role: 'teacher',
    roleTitle: 'Senior Instructor & Course Chair',
    email: 'samuel.tadesse@univ.edu.et',
    department: 'Computer Science & Software Eng.',
    avatarInitials: 'ST',
    courses: ['Software Architecture', 'System Design'],
    verificationStatus: 'verified'
  },
  admin: {
    id: 'user-adm-1',
    name: 'Department Registrar Office',
    role: 'admin',
    roleTitle: 'Academic Administrator',
    email: 'registrar.sw@univ.edu.et',
    department: 'Department of Software Engineering',
    avatarInitials: 'RA',
    verificationStatus: 'verified'
  }
};

// Placeholder used while nobody is signed in (live mode only). It is never
// shown to anyone: routes require isAuthenticated before rendering.
const GUEST_USER: UserProfile = {
  id: 'guest',
  name: 'Guest',
  role: 'student',
  roleTitle: 'Student',
  email: '',
  department: DEPARTMENT_NAME,
  avatarInitials: 'G',
  verificationStatus: 'pending'
};

const getRoleTitle = (role: UserRole): string => {
  switch (role) {
    case 'student': return 'Student';
    case 'class_rep': return 'Class Representative';
    case 'teacher': return 'Instructor';
    case 'admin': return 'Administrator';
    default: return 'Student';
  }
};

const isUserRole = (value: unknown): value is UserRole =>
  value === 'student' || value === 'class_rep' || value === 'teacher' || value === 'admin';

const isVerificationStatus = (value: unknown): value is VerificationStatus =>
  value === 'pending' || value === 'verified' || value === 'rejected';

interface AuthContextType {
  currentUser: UserProfile;
  /** True once a real session + profile is loaded (always true in demo mode). */
  isAuthenticated: boolean;
  /** True while the first session check is still running. */
  loading: boolean;
  /** Set when a session exists but the profile could not be loaded. */
  profileError: string | null;
  /** Demo mode only. Does nothing when a backend is configured. */
  setRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  /** Re-reads the profile from the database (e.g. after being approved). */
  refreshProfile: () => Promise<void>;
  isSupabaseAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    isSupabaseConfigured ? GUEST_USER : PRESET_PERSONAS.student
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!isSupabaseConfigured);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = async (sessionUser: User) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle();

    if (error || !profile) {
      setProfileError(error?.message ?? 'Your profile could not be found. Please contact your class admin.');
      setIsAuthenticated(false);
      setCurrentUser(GUEST_USER);
      return;
    }

    // Role and verification come from the database only. user_metadata is
    // editable by the user, so it is never trusted here.
    const role: UserRole = isUserRole(profile.role) ? profile.role : 'student';
    const verificationStatus: VerificationStatus = isVerificationStatus(profile.verification_status)
      ? profile.verification_status
      : 'pending';
    const name: string = profile.name || sessionUser.email?.split('@')[0] || 'Student';

    setCurrentUser({
      id: sessionUser.id,
      name,
      role,
      roleTitle: getRoleTitle(role),
      email: profile.email || sessionUser.email || '',
      department: profile.department || DEPARTMENT_NAME,
      avatarInitials:
        name
          .split(' ')
          .filter(Boolean)
          .map((part: string) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'ST',
      classSection: profile.class_section || undefined,
      studentId: profile.student_id || undefined,
      verificationStatus
    });
    setProfileError(null);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // INITIAL_SESSION fires right after subscribing, so this one listener covers
    // page load, sign-in, sign-out and token refresh. The profile is loaded in a
    // timeout because Supabase warns against awaiting its own calls inside this
    // callback (it can deadlock).
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setCurrentUser(GUEST_USER);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const sessionUser = session.user;
      setTimeout(() => {
        loadProfile(sessionUser)
          .catch((err: unknown) => {
            console.error('[AuthContext] Profile load failed:', err);
            setProfileError('Could not load your profile. Check your connection and try again.');
            setIsAuthenticated(false);
          })
          .finally(() => setLoading(false));
      }, 0);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!isSupabaseConfigured) return;
    const {
      data: { session }
    } = await supabase.auth.getSession();
    if (session?.user) {
      await loadProfile(session.user);
    }
  };

  const setRole = (role: UserRole) => {
    // Demo mode only. With a backend, roles are decided by the database.
    if (isSupabaseConfigured) return;
    if (PRESET_PERSONAS[role]) {
      setCurrentUser(PRESET_PERSONAS[role]);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      setCurrentUser(GUEST_USER);
      setIsAuthenticated(false);
    } else {
      setCurrentUser(PRESET_PERSONAS.student);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        profileError,
        setRole,
        logout,
        refreshProfile,
        isSupabaseAuth: isSupabaseConfigured && isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
