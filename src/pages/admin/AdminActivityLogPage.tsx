import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { formatDate } from '../../lib/utils';
import {
  History,
  UserCheck,
  CalendarPlus,
  Shield,
  Search,
  Filter,
  RefreshCw,
  KeyRound,
  FileText,
  Clock,
  Layers
} from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminActivityLogPage: React.FC = () => {
  const { activityLogs, refreshData, isLoading } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || log.entityType === filterType;
    return matchesSearch && matchesType;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'event': return CalendarPlus;
      case 'speaker': return UserCheck;
      case 'registration': return FileText;
      case 'auth': return KeyRound;
      default: return Shield;
    }
  };

  return (
    <AdminLayout
      title="Activity & Governance Audit Log"
      subtitle="Chronological, immutable audit trail of administrative operations, schedule changes, and registrations"
      actions={
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      }
    >
      <div className="space-y-6">

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, actors, or details..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 whitespace-nowrap">Entity:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden"
            >
              <option value="all">All Entities ({activityLogs.length})</option>
              <option value="event">Events</option>
              <option value="speaker">Speakers</option>
              <option value="registration">Registrations</option>
              <option value="auth">Authentication</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Audit Trail List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recorded Governance Activities</h3>
              <p className="text-xs text-slate-500">PostgreSQL <code>public.activity_logs</code> audit record</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {filteredLogs.length} events
            </span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No Audit Activities Found"
                description={
                  searchQuery || filterType !== 'all'
                    ? 'No activity logs matched your filter criteria.'
                    : 'Administrative operations performed via the portal will appear here in chronological order.'
                }
              />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const Icon = getEntityIcon(log.entityType);
                return (
                  <div key={log.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{log.action}</span>
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                            {log.entityType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {formatDate(log.timestamp)} · {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{log.details}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>Actor: <strong className="text-slate-700">{log.actorName || log.actorEmail}</strong></span>
                        {log.actorEmail && <span className="font-mono text-slate-500">({log.actorEmail})</span>}
                        {log.ipAddress && <span>IP: <code className="font-mono text-slate-500">{log.ipAddress}</code></span>}
                        {log.entityId && <span>ID: <code className="font-mono text-slate-500">{log.entityId}</code></span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Server-side trusted audit log protected by PostgreSQL Row Level Security.</span>
            <span>Pragjyotish College BCA Department</span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
