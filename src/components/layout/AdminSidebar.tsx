import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  Image,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  History,
  ArrowLeft,
  Database,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useTechTalks } from '../../context/TechTalksContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavigate }) => {
  const location = useLocation();
  const { adminProfile, logoutAdmin } = useTechTalks();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Events', path: '/admin/events', icon: Calendar },
    { label: 'Manage Speakers', path: '/admin/speakers', icon: Users },
    { label: 'Form Registration', path: '/admin/registrations', icon: ClipboardList },
    { label: 'Media Manager', path: '/admin/media', icon: Image },
    { label: 'Announcements', path: '/admin/announcements', icon: Bell },
    { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Activity Log', path: '/admin/activity-log', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img
            src="/college_logo.png"
            alt="Pragjyotish College Crest"
            className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shadow-xs shrink-0"
          />
          <div>
            <span className="text-sm font-bold text-white block leading-tight">TechTalks Admin</span>
            <span className="text-[10px] text-slate-400">Pragjyotish College BCA</span>
          </div>
        </Link>
      </div>

      {/* Database State Banner */}
      <div className="mx-3 my-3 p-2.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Database</span>
          </div>
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
            isSupabaseConfigured ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-700 text-slate-300'
          }`}>
            {isSupabaseConfigured ? 'Live RLS' : '9 Tables Mapped'}
          </span>
        </div>
        <p className="text-slate-400 leading-tight">
          {isSupabaseConfigured
            ? 'Operating with active PostgreSQL Row Level Security.'
            : 'Ready for live credentials. RLS schemas versioned in /supabase/migrations.'}
        </p>
      </div>

      {/* Authenticated Admin Badge */}
      {adminProfile && (
        <div className="mx-3 mb-2 p-2.5 bg-slate-800/50 rounded-md border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[11px] font-bold">
              {adminProfile.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-white truncate block text-[11px]">{adminProfile.fullName}</span>
              <span className="text-[10px] text-slate-400 block truncate">{adminProfile.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                active
                  ? 'bg-blue-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Exit to Public Portal & Sign Out */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        {adminProfile && (
          <button
            type="button"
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Site</span>
        </Link>
      </div>
    </aside>
  );
};
