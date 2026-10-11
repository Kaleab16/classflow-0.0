-- ============================================================================
-- CLASSFLOW PILOT SCHEMA  (tables, signup rules, row-level security)
-- ============================================================================
-- Run this whole file once in the Supabase SQL Editor. It is safe to run again.
--
-- Order of setup:
--   1. Run this file.
--   2. Run the "class code" snippet in supabase/admin_setup.sql (signups stay
--      closed until a class code exists).
--   3. Sign up in the app yourself, then run the "make me admin" snippet.
--
-- How trust works:
--   * Nobody can give themselves a role. Roles are decided in this file (the
--     signup trigger) or by an admin. The browser can only SUGGEST a name,
--     student ID and section; it can never set a role or verification status.
--   * Students sign up with the shared class code + their student ID. They stay
--     'pending' until an admin approves them in the app (after checking their ID).
--   * Teachers sign up with a personal, single-use invite tied to their email.
--   * Class reps sign up as students and are promoted by an admin.
-- ============================================================================


-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- 1a. Profiles (one row per auth user)
create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  name                text not null,
  email               text not null,
  role                text not null default 'student',
  department          text,
  class_section       text,
  student_id          text,
  verification_status text not null default 'pending',
  created_at          timestamptz not null default now()
);

-- Upgrade path if the old prototype schema was already installed
alter table public.profiles add column if not exists student_id text;
alter table public.profiles add column if not exists verification_status text not null default 'pending';
alter table public.profiles alter column department drop default;
alter table public.profiles alter column class_section drop default;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('student', 'class_rep', 'teacher', 'admin'));

alter table public.profiles drop constraint if exists profiles_verification_status_check;
alter table public.profiles add constraint profiles_verification_status_check
  check (verification_status in ('pending', 'verified', 'rejected'));

-- One account per student ID (IDs are stored upper-case, trimmed)
create unique index if not exists profiles_student_id_key
  on public.profiles (student_id) where student_id is not null;

-- 1b. App settings (the class code lives here; clients can never read this table)
create table if not exists public.app_settings (
  key   text primary key,
  value text not null
);

-- 1c. Teacher invites (single use, tied to one email, expire after 14 days)
create table if not exists public.invites (
  code       text primary key default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  email      text not null,
  role       text not null default 'teacher' check (role in ('teacher')),
  expires_at timestamptz not null default now() + interval '14 days',
  used_by    uuid references auth.users(id) on delete set null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

-- 1d. Requests
create sequence if not exists public.request_number_seq start 1001;

create table if not exists public.requests (
  id                  text primary key default ('REQ-' || nextval('public.request_number_seq')),
  title               text not null,
  category            text not null,
  priority            text not null,
  status              text not null default 'new',
  students_affected   integer not null default 1,
  submitted_at        text not null default '',   -- legacy column, real dates come from created_at
  last_updated_at     text not null default '',   -- legacy column, real dates come from updated_at
  student_description text not null,
  rep_memo            text not null default '',
  rep_memo_status     text not null default 'draft',
  instructor          text not null,
  waiting_on          text,
  resolution_text     text,
  resolution_date     text,
  activity            jsonb not null default '[]'::jsonb,
  stakeholder_steps   jsonb not null default '[]'::jsonb,
  created_by          uuid default auth.uid() references auth.users(id) on delete set null,
  created_by_name     text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Upgrade path from the old prototype schema
alter table public.requests alter column id set default ('REQ-' || nextval('public.request_number_seq'));
alter table public.requests add column if not exists created_by uuid default auth.uid() references auth.users(id) on delete set null;
alter table public.requests add column if not exists created_by_name text;
alter table public.requests add column if not exists updated_at timestamptz not null default now();
alter table public.requests alter column submitted_at set default '';
alter table public.requests alter column last_updated_at set default '';

-- The app's categories (the old schema listed different ones, which made most
-- submissions fail). NOT VALID = only enforced for new/changed rows.
alter table public.requests drop constraint if exists requests_category_check;
alter table public.requests add constraint requests_category_check
  check (category in ('assignment', 'academic', 'exam', 'permission', 'general')) not valid;

alter table public.requests drop constraint if exists requests_priority_check;
alter table public.requests add constraint requests_priority_check
  check (priority in ('low', 'medium', 'high', 'urgent')) not valid;

alter table public.requests drop constraint if exists requests_status_check;
alter table public.requests add constraint requests_status_check
  check (status in ('new', 'in_progress', 'waiting_for_response', 'resolved', 'closed')) not valid;

alter table public.requests drop constraint if exists requests_rep_memo_status_check;
alter table public.requests add constraint requests_rep_memo_status_check
  check (rep_memo_status in ('draft', 'approved_by_rep', 'forwarded_to_teacher')) not valid;

alter table public.requests drop constraint if exists requests_size_check;
alter table public.requests add constraint requests_size_check
  check (
    students_affected between 1 and 1000
    and char_length(title) between 1 and 200
    and char_length(student_description) between 1 and 5000
    and char_length(rep_memo) <= 10000
  ) not valid;

-- 1e. Announcements (not wired into the UI yet)
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  author_name text not null,
  author_role text not null,
  created_at  timestamptz not null default now()
);

-- 1f. Class sections (reserved for later, no access from the app)
create table if not exists public.class_sections (
  id         uuid primary key default gen_random_uuid(),
  code       text not null,
  name       text not null,
  rep_id     uuid references public.profiles(id) on delete set null,
  teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 1g. Waitlist (landing page "Get early access" form)
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null check (
               char_length(email) between 5 and 200
               and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
             ),
  role       text check (role in ('student', 'class_rep', 'teacher', 'admin')),
  university text check (char_length(university) <= 150),
  created_at timestamptz not null default now()
);
create unique index if not exists waitlist_email_key on public.waitlist (lower(email));


-- ============================================================================
-- 2. HELPER FUNCTIONS (used by the policies below)
-- SECURITY DEFINER so they can read profiles without triggering RLS recursion.
-- ============================================================================

create or replace function public.app_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.app_is_verified()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select verification_status = 'verified' from public.profiles where id = auth.uid()),
    false
  )
$$;

-- Verified class rep, teacher or admin
create or replace function public.app_is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select verification_status = 'verified' and role in ('class_rep', 'teacher', 'admin')
       from public.profiles where id = auth.uid()),
    false
  )
$$;

create or replace function public.app_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select verification_status = 'verified' and role = 'admin'
       from public.profiles where id = auth.uid()),
    false
  )
$$;


-- ============================================================================
-- 3. SIGNUP RULES
-- The browser sends name / student_id / section / class_code / invite_code as
-- metadata. This trigger is the real gate: it decides the role and refuses the
-- signup if the class code or invite is wrong. A "role" sent by the browser is
-- ignored completely.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_meta        jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name        text  := btrim(coalesce(v_meta->>'name', ''));
  v_student_id  text  := upper(btrim(coalesce(v_meta->>'student_id', '')));
  v_section     text  := btrim(coalesce(v_meta->>'section', ''));
  v_class_code  text  := lower(btrim(coalesce(v_meta->>'class_code', '')));
  v_invite_code text  := btrim(coalesce(v_meta->>'invite_code', ''));
  v_expected    text;
  v_invite      public.invites%rowtype;
begin
  if char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'Please enter your full name.';
  end if;

  -- Teacher path: personal invite tied to this exact email
  if v_invite_code <> '' then
    select * into v_invite
      from public.invites
     where code = v_invite_code
       and used_at is null
       and expires_at > now()
       and lower(email) = lower(new.email)
       for update;

    if not found then
      raise exception 'Invalid or expired invite.';
    end if;

    insert into public.profiles (id, name, email, role, verification_status)
    values (new.id, v_name, new.email, v_invite.role, 'verified');

    update public.invites set used_by = new.id, used_at = now() where code = v_invite.code;
    return new;
  end if;

  -- Student path: shared class code + student ID; always starts as pending
  select lower(value) into v_expected from public.app_settings where key = 'class_code';

  if v_expected is null or v_expected = '' then
    raise exception 'Signups are not open yet.';
  end if;
  if v_class_code <> v_expected then
    raise exception 'Invalid class code.';
  end if;
  if char_length(v_student_id) < 3 or char_length(v_student_id) > 32 then
    raise exception 'Enter a valid student ID.';
  end if;
  if v_section = '' or char_length(v_section) > 40 then
    raise exception 'Choose your section.';
  end if;

  begin
    insert into public.profiles (id, name, email, role, class_section, student_id, verification_status)
    values (new.id, v_name, new.email, 'student', v_section, v_student_id, 'pending');
  exception when unique_violation then
    raise exception 'This student ID is already registered.';
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Friendly pre-check the signup form calls BEFORE creating the account.
-- (Supabase hides trigger error messages behind "Database error saving new
-- user", so this is what lets us show "Invalid class code" etc.)
-- It reveals nothing about student IDs until the class code is correct.
create or replace function public.precheck_signup(
  p_class_code  text,
  p_student_id  text,
  p_invite_code text,
  p_email       text
)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_expected    text;
  v_class_code  text := lower(btrim(coalesce(p_class_code, '')));
  v_student_id  text := upper(btrim(coalesce(p_student_id, '')));
  v_invite_code text := btrim(coalesce(p_invite_code, ''));
begin
  if v_invite_code <> '' then
    if exists (
      select 1 from public.invites
       where code = v_invite_code
         and used_at is null
         and expires_at > now()
         and lower(email) = lower(btrim(coalesce(p_email, '')))
    ) then
      return null;
    end if;
    return 'Invalid or expired invite. Use the same email address the invite was sent to.';
  end if;

  select lower(value) into v_expected from public.app_settings where key = 'class_code';
  if v_expected is null or v_expected = '' then
    return 'Signups are not open yet.';
  end if;
  if v_class_code <> v_expected then
    return 'Invalid class code.';
  end if;
  if char_length(v_student_id) < 3 or char_length(v_student_id) > 32 then
    return 'Enter a valid student ID.';
  end if;
  if exists (select 1 from public.profiles where student_id = v_student_id) then
    return 'This student ID is already registered. Contact your class admin if this is a mistake.';
  end if;

  return null;
end;
$$;

revoke all on function public.precheck_signup(text, text, text, text) from public;
grant execute on function public.precheck_signup(text, text, text, text) to anon, authenticated;


-- ============================================================================
-- 4. COLUMN PROTECTION TRIGGERS
-- ============================================================================

-- Non-admins can edit their own name etc., but never role, verification
-- status, student ID, section or email. (SQL Editor / service role runs with no
-- logged-in user, so manual changes you make there still work.)
create or replace function public.protect_profile_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.app_is_admin() then
    new.id                  := old.id;
    new.email               := old.email;
    new.role                := old.role;
    new.verification_status := old.verification_status;
    new.student_id          := old.student_id;
    new.class_section       := old.class_section;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- New requests: stamp the real author, and stop students from creating
-- requests that are already "resolved" or carry a fake resolution.
create or replace function public.requests_before_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_by      := coalesce(auth.uid(), new.created_by);
  new.created_by_name := (select p.name from public.profiles p where p.id = new.created_by);
  new.created_at      := now();
  new.updated_at      := now();

  if not public.app_is_staff() then
    new.status          := 'new';
    new.rep_memo_status := 'draft';
    new.waiting_on      := null;
    new.resolution_text := null;
    new.resolution_date := null;
  end if;
  return new;
end;
$$;

drop trigger if exists requests_bi on public.requests;
create trigger requests_bi
  before insert on public.requests
  for each row execute function public.requests_before_insert();

-- Updates: author, id and creation time can never change; bump updated_at.
create or replace function public.requests_before_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.id              := old.id;
  new.created_by      := old.created_by;
  new.created_by_name := old.created_by_name;
  new.created_at      := old.created_at;
  new.updated_at      := now();
  return new;
end;
$$;

drop trigger if exists requests_bu on public.requests;
create trigger requests_bu
  before update on public.requests
  for each row execute function public.requests_before_update();


-- ============================================================================
-- 5. ROW-LEVEL SECURITY
-- ============================================================================

alter table public.profiles       enable row level security;
alter table public.app_settings   enable row level security;   -- no policies = clients can't touch it
alter table public.invites        enable row level security;   -- no policies = clients can't touch it
alter table public.requests       enable row level security;
alter table public.announcements  enable row level security;
alter table public.class_sections enable row level security;   -- no policies = clients can't touch it
alter table public.waitlist       enable row level security;

-- Remove the old prototype policies (and our own, so re-running is safe)
drop policy if exists "Public profiles viewable by authenticated users" on public.profiles;
drop policy if exists "Users can update their own profile"              on public.profiles;
drop policy if exists profiles_select_own   on public.profiles;
drop policy if exists profiles_select_admin on public.profiles;
drop policy if exists profiles_update_own   on public.profiles;
drop policy if exists profiles_update_admin on public.profiles;

drop policy if exists "Requests viewable by authenticated users"        on public.requests;
drop policy if exists "Students and Reps can create requests"           on public.requests;
drop policy if exists "Reps, Teachers and Admins can update requests"   on public.requests;
drop policy if exists requests_select       on public.requests;
drop policy if exists requests_insert       on public.requests;
drop policy if exists requests_update_staff on public.requests;

drop policy if exists "Announcements viewable by authenticated users"   on public.announcements;
drop policy if exists "Reps, Teachers and Admins can post announcements" on public.announcements;
drop policy if exists announcements_select       on public.announcements;
drop policy if exists announcements_insert_staff on public.announcements;

drop policy if exists waitlist_insert_anyone on public.waitlist;

-- Profiles: you see only yourself; admins see everyone. Emails and student IDs
-- are therefore private from classmates, reps and teachers.
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid());

create policy profiles_select_admin on public.profiles
  for select to authenticated using (public.app_is_admin());

create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (public.app_is_admin()) with check (public.app_is_admin());

-- Requests:
--   read   = your own, plus anything resolved/closed (class-wide outcomes) once
--            you are verified, plus everything for verified staff
--   create = verified users, as themselves
--   update = verified staff only
create policy requests_select on public.requests
  for select to authenticated
  using (
    created_by = auth.uid()
    or (public.app_is_verified() and status in ('resolved', 'closed'))
    or public.app_is_staff()
  );

create policy requests_insert on public.requests
  for insert to authenticated
  with check (public.app_is_verified() and created_by = auth.uid());

create policy requests_update_staff on public.requests
  for update to authenticated
  using (public.app_is_staff()) with check (public.app_is_staff());

-- Announcements: verified users read, verified staff post
create policy announcements_select on public.announcements
  for select to authenticated using (public.app_is_verified());

create policy announcements_insert_staff on public.announcements
  for insert to authenticated with check (public.app_is_staff());

-- Waitlist: anyone may add themselves; nobody can read it from the app
-- (read it in the Supabase dashboard).
create policy waitlist_insert_anyone on public.waitlist
  for insert to anon, authenticated with check (true);


-- ============================================================================
-- 6. REALTIME (live updates of the requests list)
-- ============================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'requests'
  ) then
    alter publication supabase_realtime add table public.requests;
  end if;
end
$$;
