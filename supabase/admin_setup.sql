-- ============================================================================
-- CLASSFLOW ADMIN SETUP SNIPPETS
-- ============================================================================
-- Run these ONE AT A TIME in the Supabase SQL Editor, after supabase/schema.sql.
-- Replace the values in <angle brackets> first.
-- The SQL Editor runs as the database owner, so the role-protection triggers
-- allow these changes.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. OPEN SIGNUPS: set the class code (give it to your class in person)
--    Not case-sensitive. Pick something students can type easily.
--    Run again any time to change it; the old code stops working immediately.
-- ----------------------------------------------------------------------------
insert into public.app_settings (key, value)
values ('class_code', '<your-class-code>')
on conflict (key) do update set value = excluded.value;

-- Close signups again (e.g. after everyone has joined):
-- delete from public.app_settings where key = 'class_code';


-- ----------------------------------------------------------------------------
-- 2. MAKE YOURSELF SUPER ADMIN
--    Sign up in the app first (as a student, using the class code), then run:
-- ----------------------------------------------------------------------------
update public.profiles
   set role = 'admin', verification_status = 'verified'
 where lower(email) = lower('<your-email>');

-- Check it worked (should show one row with role = admin):
-- select name, email, role, verification_status from public.profiles where lower(email) = lower('<your-email>');


-- ----------------------------------------------------------------------------
-- 3. APPROVE STUDENTS
--    Normally you do this in the app: Admin > Users > Approve.
--    Bulk approve everyone who is waiting (only after you have checked them!):
-- ----------------------------------------------------------------------------
-- update public.profiles
--    set verification_status = 'verified'
--  where role = 'student' and verification_status = 'pending';


-- ----------------------------------------------------------------------------
-- 4. MAKE A CLASS REP
--    Normally you do this in the app: Admin > Users > change the role.
--    By student ID:
-- ----------------------------------------------------------------------------
-- update public.profiles
--    set role = 'class_rep', verification_status = 'verified'
--  where student_id = upper('<student-id>');


-- ----------------------------------------------------------------------------
-- 5. INVITE A TEACHER
--    Creates a single-use code (valid 14 days) tied to ONE email address.
--    Send the teacher the code. They sign up at the app using the
--    "I have a teacher invite" option with that exact email.
-- ----------------------------------------------------------------------------
-- insert into public.invites (email) values ('<teacher-email>') returning code, expires_at;

-- See open invites:
-- select email, code, expires_at, used_at from public.invites order by created_at desc;


-- ----------------------------------------------------------------------------
-- 6. REMOVE SOMEONE'S ACCESS
--    Reject (they can still sign in but see "not approved" and can do nothing):
-- ----------------------------------------------------------------------------
-- update public.profiles set verification_status = 'rejected' where student_id = upper('<student-id>');

--    Fully block the login (and free the student ID by deleting the account):
-- delete from auth.users where lower(email) = lower('<their-email>');


-- ----------------------------------------------------------------------------
-- 7. LOOK AT THE WAITLIST (landing page early-access signups)
-- ----------------------------------------------------------------------------
-- select name, email, role, university, created_at from public.waitlist order by created_at desc;
