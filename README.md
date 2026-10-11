# ClassFlow

A small workflow tool for a class: students raise issues, the class rep turns them
into a formal memo, the teacher answers, and the whole class sees the outcome.

Stack: React + TypeScript + Vite, Supabase (auth, Postgres, realtime).

## How people get in

| Who | How they sign up | Who gives them their role |
|---|---|---|
| Student | Class code + name + student ID + section | Always starts as `student` / `pending`. An admin approves them after checking their ID |
| Class rep | Signs up as a student | An admin promotes them (Admin > Users) |
| Teacher | Personal single-use invite tied to their email | The invite sets the role |
| Admin | Signs up as a student | You run one SQL line (see below) |

Roles are decided by the database, never by the browser. Until approved, a student
sees a "Waiting for approval" screen and can read no class data. Student IDs and
emails are visible only to the owner and admins.

## Launch checklist

1. **Create a Supabase project** (supabase.com).
2. **Run the schema.** SQL Editor > paste `supabase/schema.sql` > Run.
3. **Open signups.** Run the "class code" snippet from `supabase/admin_setup.sql`
   with a code you will hand out in person. Signups stay closed until this exists.
4. **Email settings** (Authentication > Providers > Email). Supabase's built-in
   email sender allows only a few emails per hour, which a class signing up at
   once will hit. Either turn **Confirm email** off for the pilot, or set up your
   own SMTP provider.
5. **Edit `src/config.ts`**: department name, the sections students can pick, and the
   instructor names a request can be addressed to.
6. **Configure the app.** Copy `.env.example` to `.env` and fill in:
   ```
   VITE_SUPABASE_URL=...        # Project Settings > API
   VITE_SUPABASE_ANON_KEY=...   # the "anon" / publishable key (never the service_role key)
   ```
7. **Deploy** (Vercel): import the GitHub repo, add the same two environment
   variables, deploy. `vercel.json` already makes deep links work.
8. **Sign up yourself** in the deployed app with the class code, then run the
   "make yourself super admin" snippet in `supabase/admin_setup.sql`.
9. **Run the test checklist below before telling the class.**

Without the two environment variables the app runs in **demo mode** with sample
data, nothing is saved, and signing in is disabled. Do not publish a demo-mode
build as the real thing.

## Day-to-day admin

- Approve or reject students: Admin > Users.
- Promote a class rep: Admin > Users, change the role.
- Invite a teacher: the "invite a teacher" snippet in `supabase/admin_setup.sql`,
  then send them the code.
- Waitlist signups from the landing page: the waitlist snippet in the same file.
- Change or close the class code: first snippet in the same file.

## Test checklist (use 2-3 friends, before announcing)

- [ ] Sign up with a wrong class code: refused with a clear message.
- [ ] Sign up with a correct code: lands on "Waiting for approval", sees no requests.
- [ ] Sign up again with the same student ID: refused.
- [ ] You approve the account: after "Check again" the student reaches their portal.
- [ ] The student portal shows the student's own name, ID and section (nobody else's).
- [ ] Student submits a request: it appears, with a database-generated `REQ-` number.
- [ ] Two students submit at the same moment: both requests exist, neither replaced.
- [ ] A second student cannot see the first student's unresolved request.
- [ ] Student cannot change their own role (try in the browser console:
      `supabase.from('profiles').update({role:'admin'}).eq('id', myId)` must not change it).
- [ ] You promote a friend to class rep: they see the request, edit the memo, forward it.
- [ ] Break the connection (airplane mode) and submit: a clear error, no fake success.
- [ ] Landing page "Get early access" saves a row in the `waitlist` table.
- [ ] Refresh on a deep link (e.g. `/student/requests/REQ-1001`): the page loads.

## Known limits of this pilot

- One shared class code gates signup; the admin's ID check is the real verification.
- Class reps and teachers can see and update every section's requests (no per-section
  scoping yet).
- The notices, tickets, meetings, communication and several admin screens still show
  sample data. They are hidden from the menus when a backend is configured.
- No automated tests yet.

## Development

```
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```
