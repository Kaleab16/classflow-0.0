import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type UserRole = 'class_rep' | 'student' | 'teacher' | 'admin';

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
}

export const PRESET_PERSONAS: Record<UserRole, UserProfile> = {
  student: {
    id: 'user-stu-1',
    name: 'Abebe Bikila',
    role: 'student',
    roleTitle: 'Student (ID: ETS/0123/15)',
    email: 'abebe.b@sw.edu.et',
    department: 'Software Engineering',
    avatarInitials: 'AB',
    classSection: 'Software Engineering — Section A'
  },
  class_rep: {
    id: 'user-rep-1',
    name: 'Kaleab Tesfaye',
    role: 'class_rep',
    roleTitle: 'Class Representative',
    email: 'kaleab.rep@sw.edu.et',
    department: 'Software Engineering',
    avatarInitials: 'KT',
    classSection: 'Software Engineering — Section A'
  },
  teacher: {
    id: 'user-tch-1',
    name: 'Dr. Samuel Tadesse',
    role: 'teacher',
    roleTitle: 'Senior Instructor & Course Chair',
    email: 'samuel.tadesse@univ.edu.et',
    department: 'Computer Science & Software Eng.',
    avatarInitials: 'ST',
    courses: ['Software Architecture', 'System Design']
  },
  admin: {
    id: 'user-adm-1',
    name: 'Department Registrar Office',
    role: 'admin',
    roleTitle: 'Academic Administrator',
    email: 'registrar.sw@univ.edu.et',
    department: 'Department of Software Engineering',
    avatarInitials: 'RA'
  }
};

const getRoleTitle = (role: UserRole): string => {
  switch (role) {
    case 'student': return 'Student';
    case 'class_rep': return 'Class Representative';
    case 'teacher': return 'Instructor & Course Chair';
    case 'admin': return 'Academic Administrator';
    default: return 'Student';
  }
};

interface AuthContextType {
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  logout: () => void;
  isSupabaseAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default user role is 'student'
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_PERSONAS.student);
  const [isSupabaseAuth, setIsSupabaseAuth] = useState<boolean>(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSupabaseProfile = async (sessionUser: any) => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sessionUser.id)
          .single();

        const roleRaw = profile?.role || sessionUser.user_metadata?.role || 'student';
        const role: UserRole = ['student', 'class_rep', 'teacher', 'admin'].includes(roleRaw)
          ? (roleRaw as UserRole)
          : 'student';

        const name = profile?.name || profile?.full_name || sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'Student';

        setCurrentUser({
          id: sessionUser.id,
          name,
          role,
          roleTitle: getRoleTitle(role),
          email: sessionUser.email || '',
          department: profile?.department || 'Software Engineering',
          avatarInitials: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'ST',
          classSection: profile?.class_section || 'Software Engineering — Section A'
        });
        setIsSupabaseAuth(true);
      } catch (err) {
        console.warn('[AuthContext] Profile fetch error, using authenticated role:', err);
      }
    };

    // Listen to initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchSupabaseProfile(session.user);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchSupabaseProfile(session.user);
      } else {
        setIsSupabaseAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setRole = (role: UserRole) => {
    // Used for switching test accounts in demo mode or updating logged-in account
    if (PRESET_PERSONAS[role]) {
      setCurrentUser(PRESET_PERSONAS[role]);
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && isSupabaseAuth) {
      await supabase.auth.signOut();
    }
    setCurrentUser(PRESET_PERSONAS.student);
    setIsSupabaseAuth(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setRole, logout, isSupabaseAuth }}>
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
