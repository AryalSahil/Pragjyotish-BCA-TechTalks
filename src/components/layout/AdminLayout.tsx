import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminBreadcrumbs } from '../common/AdminBreadcrumbs';
import { Menu, X, ShieldAlert, Lock, ArrowRight, ShieldCheck, Database, LogOut, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTechTalks } from '../../context/TechTalksContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { adminProfile, isAdminAuthenticated, logoutAdmin } = useTechTalks();
  const navigate = useNavigate();

  // If not authenticated, enforce the secure Auth gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-200 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <Lock className="w-7 h-7" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>403 Forbidden · Direct URL Denied</span>
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1 mb-2">
            Administrator Authentication Required
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Administrative endpoints are strictly restricted to verified faculty advisors and department coordinators registered in <code>public.admin_users</code>.
          </p>

          <div className="space-y-3">
            <Link
              to="/admin/login"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign In with Administrator Credentials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 block"
            >
              Return to Public Website
            </Link>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            PostgreSQL Row Level Security Active · Supabase Auth Verified
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white bg-slate-800 hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Status Advisory Bar */}
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          isSupabaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            {isSupabaseConfigured ? (
              <Database className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="truncate">
              {isSupabaseConfigured ? (
                <><strong>Supabase Connected:</strong> Authenticated as <code>{adminProfile?.email}</code> ({adminProfile?.role})</>
              ) : (
                <><strong>Verified Admin Session:</strong> Operating in local verified mode (Ready for live Supabase credentials in <code>.env</code>)</>
              )}
            </span>
          </div>
          <Link to="/admin/settings" className="text-[11px] underline font-medium hover:opacity-80 shrink-0 ml-2">
            Settings &amp; Keys
          </Link>
        </div>

        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick Actions Slot */}
            {actions && <div className="flex items-center gap-2">{actions}</div>}

            {/* Authenticated Admin Badge */}
            {adminProfile && (
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {adminProfile.fullName.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    {adminProfile.fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">
                    {adminProfile.role.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  title="Sign Out Admin"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AdminBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};

