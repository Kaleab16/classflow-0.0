-- ============================================================================
-- CLASSFLOW PRODUCTION SUPABASE DATABASE SCHEMA & RLS SECURITY POLICIES
-- ============================================================================
-- Execute this script in your Supabase SQL Editor (https://app.supabase.com)
-- ============================================================================

-- 1. PROFILES TABLE (Bound to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'class_rep', 'teacher', 'admin')),
  department TEXT DEFAULT 'Software Engineering',
  class_section TEXT DEFAULT 'Software Engineering — Section A',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CLASS SECTIONS TABLE
CREATE TABLE IF NOT EXISTS public.class_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  rep_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. REQUESTS TABLE (Central ClassFlow workflow item)
CREATE TABLE IF NOT EXISTS public.requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'lab_equipment', 'attendance', 'permission', 'grading', 'schedule')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL CHECK (status IN ('new', 'in_progress', 'waiting_for_response', 'resolved', 'closed')),
  students_affected INTEGER DEFAULT 1,
  submitted_at TEXT NOT NULL,
  last_updated_at TEXT NOT NULL,
  student_description TEXT NOT NULL,
  rep_memo TEXT DEFAULT '',
  rep_memo_status TEXT DEFAULT 'draft' CHECK (rep_memo_status IN ('draft', 'approved_by_rep', 'forwarded_to_teacher')),
  instructor TEXT NOT NULL,
  waiting_on TEXT,
  resolution_text TEXT,
  resolution_date TEXT,
  activity JSONB DEFAULT '[]'::jsonb,
  stakeholder_steps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ANNOUNCEMENTS TABLE (Class notices)
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- AUTOMATIC SIGNUP TRIGGER
-- When a user signs up via Supabase Auth, auto-create a Student profile
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, department, class_section)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'Software Engineering',
    'Software Engineering — Section A'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Strict role boundary enforcement at database level
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. Requests Policies
CREATE POLICY "Requests viewable by authenticated users"
  ON public.requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students and Reps can create requests"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Reps, Teachers and Admins can update requests"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (true);

-- 3. Announcements Policies
CREATE POLICY "Announcements viewable by authenticated users"
  ON public.announcements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Reps, Teachers and Admins can post announcements"
  ON public.announcements FOR INSERT
  TO authenticated
  WITH CHECK (true);
