# Pragjyotish BCA TechTalks — Supabase Architecture & Setup Guide

This document specifies the database migrations, Row Level Security (RLS) policies, authentication architecture, and administrator provisioning procedure for **Pragjyotish BCA TechTalks**.

---

## 1. Architecture Overview

| Component | Technology | Configuration & Security |
| :--- | :--- | :--- |
| **Relational Database** | PostgreSQL via Supabase | 9 normalized tables with foreign keys, checks & indexes |
| **Access Control** | PostgreSQL Row Level Security (RLS) | Enabled on 100% of tables with strict `TO anon` & `TO authenticated` policies |
| **Authentication** | Supabase Auth (Email + Password) | Dedicated to authorized faculty advisors and student coordinators |
| **Admin Provisioning** | Manual/CLI DB Insertion | Public signup is strictly prohibited; accounts mapped to `auth.users.id` |
| **Client SDK** | `@supabase/supabase-js` v2 | Client utilizes anon key; server secrets kept strictly off the browser |

---

## 2. Version-Controlled SQL Migrations

All migrations are located in the `supabase/migrations/` directory:

1. **`20261010000000_create_tables.sql`**:
   - `admin_users`: Tied to `auth.users(id)` with roles (`super_admin`, `faculty_advisor`, `coordinator`).
   - `events`: Complete event lifecycle, capacity tracking, topics, publication and registration statuses.
   - `speakers`: Public profile data plus private fields (`private_email`, `private_phone`, `invitation_correspondence`).
   - `event_speakers`: Many-to-many relationship mapping speakers to specific sessions.
   - `registrations`: Student enrollment records with strict `UNIQUE (event_id, email)` constraint.
   - `event_media`: Session photographs and posters.
   - `announcements`: Department bulletins and priority broadcasts.
   - `feedback`: Student exit reviews with moderation flag.
   - `activity_logs`: Immutable security audit trail.
   - Automatic `updated_at` triggers and atomic registration count maintenance.

2. **`20261010000001_row_level_security.sql`**:
   - Security definer helper function `is_admin()`.
   - Anonymous access limited exclusively to:
     - `events` WHERE `publication_status = 'published'`
     - `speakers` WHERE `is_published = true`
     - `event_media` WHERE `is_public = true`
     - `announcements` WHERE `is_published = true`
   - Anonymous access is **BLOCKED** on `registrations`, private speaker fields, unapproved `feedback`, and `activity_logs`.
   - Registration INSERT policy strictly requires that the event is published, open, has not passed its deadline, and has not exceeded capacity.

3. **`20261010000002_secure_views_functions.sql`**:
   - `public.public_speakers`: Secure SQL view stripping out `private_email` and `private_phone`.
   - `public.submit_event_registration(...)`: Secure RPC function for validation, rate limiting, and capacity checking.

4. **`20261010000003_seed_data.sql`**:
   - Populates initial events, speakers, media, and announcements for Pragjyotish College.

---

## 3. Step-by-Step Setup Instructions

### Step 1: Run Migrations in Supabase
In your Supabase project dashboard (or using Supabase CLI `supabase db push`):
1. Navigate to **SQL Editor**.
2. Run `20261010000000_create_tables.sql`.
3. Run `20261010000001_row_level_security.sql`.
4. Run `20261010000002_secure_views_functions.sql`.
5. Run `20261010000003_seed_data.sql`.

---

### Step 2: Provision the First Administrator Account

Public admin signup is **disabled by design**. To authorize an administrator:

1. **Create the user in Supabase Auth**:
   In the Supabase Dashboard, navigate to **Authentication** > **Users** > **Add User** (or use Supabase CLI / Auth Admin API):
   - Email: `fake782447@gmail.com`
   - Password: `fake1234&`
   - Auto Confirm User: Checked / Enabled
   - Note down the generated `User UID` (e.g., `4a5e1234-abcd-4321-ef01-9876543210ab`).

2. **Grant Administrator Assignment in `public.admin_users`**:
   Run the following query in the SQL Editor, replacing `<USER_UID>` with the actual ID:
   ```sql
   INSERT INTO public.admin_users (
       user_id,
       email,
       full_name,
       role,
       is_active
   ) VALUES (
       '<USER_UID>',
       'fake782447@gmail.com',
       'System Administrator',
       'super_admin',
       true
   )
   ON CONFLICT (email) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       role = EXCLUDED.role,
       is_active = true;
   ```

---

### Step 3: Configure Environment Variables

Create `.env` based on `.env.example`:

```env
# Client-Side Safe Variables
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Server Secrets (Only for backend routes or Edge Functions, NEVER in browser bundle)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_DO_NOT_EXPOSE"
```

---

## 4. Security Verification Matrix

| Role | Operation | Target Table | Expected Result | Verified Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Anonymous User** | `SELECT` | `events` (draft) | ❌ 0 rows returned | RLS `publication_status = 'published'` |
| **Anonymous User** | `SELECT` | `registrations` | ❌ Permission denied / 0 rows | No SELECT policy for `anon` |
| **Anonymous User** | `SELECT` | `public_speakers` | ✅ Public profile returned | View strips private email/phone |
| **Anonymous User** | `SELECT` | `speakers.private_email` | ❌ Blocked via View/RLS | RLS isolation |
| **Anonymous User** | `INSERT` | `registrations` (duplicate email) | ❌ Rejected (23505) | Constraint `unique_event_student_email` |
| **Anonymous User** | `INSERT` | `registrations` (closed event) | ❌ Rejected by RLS | Policy check `registration_status = 'open'` |
| **Authenticated Admin** | `SELECT` | `registrations` | ✅ All student rosters visible | Policy checks `public.is_admin() = true` |
| **Non-Admin Auth User** | `SELECT` | `admin_users` | ❌ 0 rows returned | Policy checks `public.is_admin() = true` |
