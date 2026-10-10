import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { formatDate } from '../../lib/utils';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Plus, Search, Eye, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CreateEventModal } from '../../components/admin/CreateEventModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminEventsPage: React.FC = () => {
  const { events, refreshData } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout
      title="Manage Events & Workshops"
      subtitle="Configure technical seminars, laboratory capacities, and publishing status in PostgreSQL"
      actions={
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      }
    >
      <div className="space-y-6">

        {noticeMessage && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setNoticeMessage(null)}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event title or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Statuses ({events.length})</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No Events Found"
                description={
                  searchQuery || statusFilter !== 'all'
                    ? 'No seminars matched your search criteria.'
                    : 'No sessions have been scheduled yet.'
                }
                actionLabel="Create Technical Session"
                onAction={() => setCreateModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Event Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredEvents.map(event => (
                    <tr key={event.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          to={`/events/${event.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-blue-900 block"
                        >
                          {event.title}
                        </Link>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs block">{event.venue}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {event.category}
                      </td>
                      <td className="py-3 px-4">
                        <span>{formatDate(event.date)}</span>
                        <span className="block text-[11px] text-slate-500">{event.time}</span>
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        <span className="font-semibold text-slate-900">{event.registeredCount}</span> / {event.capacity}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={event.status} type="event" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/events/${event.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Public Seminar Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            to={`/register/${event.id}`}
                            target="_blank"
                            className="px-2 py-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            title="Registration Form"
                          >
                            Form
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pragjyotish College BCA Department Seminar Series</span>
            <span>{events.length} Total Sessions</span>
          </div>
        </div>

      </div>

      <CreateEventModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          refreshData();
          setNoticeMessage('Session scheduled and registered in public calendar.');
        }}
      />
    </AdminLayout>
  );
};
