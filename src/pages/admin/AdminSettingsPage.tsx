import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Database, ShieldCheck, Server, Key, FileCode, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { supabaseConfig, isSupabaseConfigured } from '../../lib/supabase';

export const AdminSettingsPage: React.FC = () => {
  return (
    <AdminLayout
      title="Portal Architecture & Supabase Settings"
      subtitle="Backend service bindings, Supabase integration specifications, and department profiles"
    >
      <div className="space-y-6 max-w-4xl">
        
        {/* Supabase Integration Configuration */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-blue-800" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Supabase Connection State</h3>
              <p className="text-xs text-slate-500">PostgreSQL database, Row Level Security &amp; Auth integration</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Client SDK State:</span>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {isSupabaseConfigured ? 'Live Supabase Cloud Connected' : 'Preview Store Active (Ready for Keys)'}
              </span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Project URL (VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL)
              </label>
              <input
                type="text"
                readOnly
                value={supabaseConfig.url || 'https://your-project-id.supabase.co (Set in .env)'}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-[11px] text-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Anon / Publishable Key (VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)
              </label>
              <input
                type="text"
                readOnly
                value={supabaseConfig.anonKey ? '••••••••••••••••••••••••••••••••••••••••' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Set in .env)'}
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-[11px] text-slate-700"
              />
            </div>
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-rose-950">Security Rule: Server Secrets Protection</strong>
              <span>
                <code>SUPABASE_SERVICE_ROLE_KEY</code> bypasses all PostgreSQL Row Level Security policies. It must <strong>never</strong> be placed into client-side environment variables or exposed in browser bundles.
              </span>
            </div>
          </div>
        </div>

        {/* Database Migration Files Overview */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCode className="w-5 h-5 text-blue-800" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Version-Controlled SQL Migrations</h3>
              <p className="text-xs text-slate-500">Schema files located in <code>supabase/migrations/</code></p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-mono">20261010000000_create_tables.sql</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Creates 9 tables: <code>admin_users</code>, <code>events</code>, <code>speakers</code>, <code>event_speakers</code>, <code>registrations</code>, <code>event_media</code>, <code>announcements</code>, <code>feedback</code>, <code>activity_logs</code>. Includes indexes, uniqueness constraints, triggers, and foreign keys.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-mono">20261010000001_row_level_security.sql</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Enforces strict RLS. Anonymous users can only read published events, published speakers, approved media, and announcements. Blocked from private speaker details, registrations, feedback, and logs.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-mono">20261010000002_secure_views_functions.sql</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Defines <code>public.public_speakers</code> view (strips private contact details) and <code>submit_event_registration</code> RPC function (protects against spam, checks capacity, prevents duplicates).
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-mono">20261010000003_seed_data.sql</strong>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Seeds initial events, faculty advisors, industry mentors, and media for Pragjyotish College.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Administrator Provisioning Snippet */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-blue-800" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admin Account Provisioning Procedure</h3>
              <p className="text-xs text-slate-500">Public admin signup is disabled; accounts are provisioned via SQL</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p>
              To authorize a new administrator or coordinator, create the user via Supabase Auth (e.g. email: <code className="text-blue-700 font-semibold">fake782447@gmail.com</code> with password: <code className="text-blue-700 font-semibold">fake1234&amp;</code>), then run the SQL statement:
            </p>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
{`-- Replace <AUTH_USER_UUID> with the user id from auth.users:
INSERT INTO public.admin_users (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    '<AUTH_USER_UUID>',
    'fake782447@gmail.com',
    'System Administrator',
    'super_admin',
    true
)
ON CONFLICT (email) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = true;`}
            </pre>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
