import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { formatDate } from '../../lib/utils';
import {
  Calendar,
  Users,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Database,
  ExternalLink,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  CalendarCheck,
  Layers,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { CreateEventModal } from '../../components/admin/CreateEventModal';
import { AddSpeakerModal } from '../../components/admin/AddSpeakerModal';

export const AdminDashboardPage: React.FC = () => {
  const {
    events,
    speakers,
    registrations,
    activityLogs,
    stats,
    isLoading,
    loadError,
    refreshData,
    isDbConnected
  } = useTechTalks();

  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [addSpeakerOpen, setAddSpeakerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Derive real lists from actual datasets
  const upcomingEvents = events
    .filter(e => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const recentActivities = [...activityLogs].slice(0, 6);

  return (
    <AdminLayout
      title="Initiative Executive Dashboard"
      subtitle="Real-time operational monitoring, seminar capacity, and student enrollment governance"
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-60"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            type="button"
            onClick={() => setAddSpeakerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-slate-600" />
            <span>Add Speaker</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateEventOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      }
    >
      <div className="space-y-8">

        {/* ERROR STATE BANNER */}
        {loadError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{loadError}</span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-2.5 py-1 text-xs font-semibold bg-amber-200/80 hover:bg-amber-300 rounded-md text-amber-950 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}
        {isLoading && !isRefreshing ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 h-28 flex flex-col justify-between">
                  <div className="h-3 bg-slate-200 rounded-sm w-1/2" />
                  <div className="h-7 bg-slate-200 rounded-sm w-1/3" />
                  <div className="h-2 bg-slate-200 rounded-sm w-3/4" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl h-80" />
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl h-80" />
            </div>
          </div>
        ) : (
          <>
            {/* 1. ACCURATE DATABASE-DERIVED METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* Total Events */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Events</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {stats.totalEvents}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span className="font-semibold text-blue-900">{stats.upcomingEvents}</span> upcoming · <span className="font-semibold text-slate-700">{stats.completedEvents}</span> past
                </p>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Upcoming Sessions</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tabular-nums">
                    {stats.upcomingEvents}
                  </span>
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Accepting student enrollments</p>
              </div>

              {/* Completed Events */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Completed Sessions</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {stats.completedEvents}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Archived with session media</p>
              </div>

              {/* Published Speakers */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Published Speakers</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {stats.publishedSpeakers}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Mentors</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Industry &amp; academic resource persons</p>
              </div>

              {/* Total Registrations */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Registrations</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {stats.totalRegistrations}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                    Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Cumulative student enrollments</p>
              </div>

            </div>

            {/* 2. RECENT REGISTRATIONS & UPCOMING SCHEDULE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Registration Activity */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Recent Registration Activity</h3>
                      <p className="text-xs text-slate-500">Latest student enrollment submissions</p>
                    </div>
                    <Link
                      to="/admin/registrations"
                      className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 group"
                    >
                      <span>Manage Registrations ({registrations.length})</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  {recentRegistrations.length === 0 ? (
                    <div className="p-8">
                      <EmptyState
                        title="No Registrations Recorded"
                        description="Student registrations will automatically appear here once students submit enrollment on the public portal."
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                          <tr>
                            <th className="py-3 px-4">Student Name</th>
                            <th className="py-3 px-4">Course / Semester</th>
                            <th className="py-3 px-4">Target Session</th>
                            <th className="py-3 px-4 text-right">Reference</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {recentRegistrations.map((reg) => {
                            const evt = events.find(e => e.id === reg.eventId);
                            return (
                              <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-3 px-4">
                                  <span className="font-bold text-slate-900 block">{reg.fullName}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">{reg.email}</span>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="font-medium text-slate-800">{reg.course}</span>
                                  <span className="block text-[11px] text-slate-500">{reg.semester}</span>
                                </td>
                                <td className="py-3 px-4 max-w-[200px]" title={evt?.title}>
                                  <span className="truncate block font-medium text-slate-900">
                                    {evt?.title || reg.eventId}
                                  </span>
                                  <span className="text-[11px] text-slate-400">
                                    {reg.createdAt ? formatDate(reg.createdAt) : 'Recent'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="font-mono text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                    {reg.id || 'CONFIRMED'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Protected against duplicates via <code>UNIQUE(event_id, email)</code></span>
                  <Link to="/admin/registrations" className="font-semibold text-blue-900 hover:underline">
                    View Complete Roster
                  </Link>
                </div>
              </div>

              {/* Upcoming Event Schedule */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Upcoming Event Schedule</h3>
                      <p className="text-xs text-slate-500">Chronological timeline &amp; lab seat utilization</p>
                    </div>
                    <Link
                      to="/admin/events"
                      className="text-xs font-bold text-blue-900 hover:text-blue-700"
                    >
                      Manage
                    </Link>
                  </div>

                  {upcomingEvents.length === 0 ? (
                    <div className="py-6">
                      <EmptyState
                        title="No Upcoming Events"
                        description="Schedule a technical seminar or workshop to begin accepting registrations."
                        actionLabel="Schedule Session"
                        onAction={() => setCreateEventOpen(true)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((evt) => {
                        const percent = Math.min(100, Math.round(((evt.registeredCount || 0) / evt.capacity) * 100));
                        return (
                          <div key={evt.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-2 transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link
                                  to={`/events/${evt.slug}`}
                                  target="_blank"
                                  className="font-bold text-slate-900 hover:text-blue-900 text-xs block truncate"
                                  title={evt.title}
                                >
                                  {evt.title}
                                </Link>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span>{formatDate(evt.date)}</span>
                                  <span>·</span>
                                  <span className="truncate">{evt.venue}</span>
                                </span>
                              </div>
                              <StatusBadge status={evt.registrationStatus} type="registration" />
                            </div>

                            {/* Seat Capacity Progress */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500">Seat Utilization</span>
                                <span className="font-semibold text-slate-700 tabular-nums">
                                  {evt.registeredCount}/{evt.capacity} seats ({percent}%)
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    percent >= 90 ? 'bg-amber-600' : 'bg-blue-800'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setCreateEventOpen(true)}
                    className="text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Schedule New Seminar</span>
                  </button>

                  <Link
                    to="/events"
                    target="_blank"
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                  >
                    <span>Public Events View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* 3. RECENT ADMINISTRATIVE ACTIVITY LOG (Trusted server-recorded audit trail) */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Administrative Activity</h3>
                    <p className="text-xs text-slate-500">Immutable server-verified governance &amp; audit trail</p>
                  </div>
                </div>

                <Link
                  to="/admin/activity-log"
                  className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1 group"
                >
                  <span>Full Audit Log ({activityLogs.length})</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {recentActivities.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    title="No Audit Activities Logged"
                    description="Administrative actions such as session creations, mentor additions, and logins will be recorded here by trusted server code."
                  />
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-4 sm:px-5 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                        {act.entityType.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-0.5">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {act.action}
                          </span>
                          <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                            {formatDate(act.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{act.details}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>Actor: <strong className="text-slate-600">{act.actorName || act.actorEmail}</strong></span>
                          {act.ipAddress && <span>IP: <code>{act.ipAddress}</code></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Row Level Security (RLS) restricts activity log reads to authenticated admins only.</span>
                <Link to="/admin/activity-log" className="font-semibold text-blue-900 hover:underline">
                  View Full History
                </Link>
              </div>
            </div>
          </>
        )}

      </div>

      {/* QUICK ACTION MODALS */}
      <CreateEventModal
        isOpen={createEventOpen}
        onClose={() => setCreateEventOpen(false)}
        onSuccess={refreshData}
      />

      <AddSpeakerModal
        isOpen={addSpeakerOpen}
        onClose={() => setAddSpeakerOpen(false)}
        onSuccess={refreshData}
      />
    </AdminLayout>
  );
};
