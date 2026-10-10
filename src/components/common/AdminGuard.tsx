import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTechTalks } from '../../context/TechTalksContext';
import { ShieldAlert, Lock, ArrowRight, Home, KeyRound } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAdminAuthenticated, authChecked, isLoading } = useTechTalks();
  const location = useLocation();

  // If initial auth verification is still checking, render accessible loading skeleton
  if (!authChecked && isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-8 text-center animate-pulse">
          <div className="w-12 h-12 rounded-full bg-slate-700 mx-auto mb-4" />
          <div className="h-5 bg-slate-700 rounded-md w-3/4 mx-auto mb-3" />
          <div className="h-3 bg-slate-700 rounded-md w-1/2 mx-auto mb-6" />
          <div className="h-10 bg-slate-700 rounded-md w-full" />
        </div>
      </div>
    );
  }

  // Deny direct URL access if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto mb-4 border border-rose-200">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>403 Forbidden · Access Denied</span>
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">
              Administrator Privileges Required
            </h1>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Direct access to <code>{location.pathname}</code> is restricted. Only verified faculty advisors and department coordinators registered in <code>public.admin_users</code> are authorized to view or manage technical seminar records.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to={`/admin/login?redirect=${encodeURIComponent(location.pathname)}`}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <KeyRound className="w-4 h-4" />
              <span>Sign In with Administrator Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/"
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Return to Public Website</span>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected by Supabase PostgreSQL Row Level Security (RLS) &amp; Server-Side Auth Gates.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
