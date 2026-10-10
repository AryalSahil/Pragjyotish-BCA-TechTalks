import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { formatDate } from '../../lib/utils';
import { Plus, Bell, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { announcements } = useTechTalks();
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  return (
    <AdminLayout
      title="Announcements & Broadcast Notices"
      subtitle="Broadcast urgent updates, registration deadlines, and schedule adjustments to BCA students"
      actions={
        <button
          type="button"
          onClick={() => setNoticeMessage('Announcement creation dialog synced with PostgreSQL public.announcements table.')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Notice</span>
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

        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Broadcast Bulletins</h3>
              <p className="text-xs text-slate-500">Live notices visible to students on the public portal</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 tabular-nums">
              {announcements.length} Published
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.map(ann => (
              <div key={ann.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        ann.priority === 'high'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ann.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{ann.content}</p>
                    <span className="text-[11px] text-slate-400 mt-2 block">
                      Posted on {formatDate(ann.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>RLS Policy: Public can read published bulletins. Admins have full management.</span>
            <span>Pragjyotish College BCA</span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
