import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Star, MessageSquare } from 'lucide-react';

export const AdminFeedbackPage: React.FC = () => {
  const feedbacks = [
    {
      id: 'fb-01',
      studentName: 'Tridip Goswami',
      session: 'Linux Systems Administration & Bash Scripting',
      rating: 5,
      comment: 'Hands-on practice with terminal commands in Lab 1 was extremely useful. Need another session on shell network diagnostics.',
      date: '2026-09-20'
    },
    {
      id: 'fb-02',
      studentName: 'Anamika Das',
      session: 'Git & GitHub Collaboration Masterclass',
      rating: 5,
      comment: 'Resolving merge conflicts in teams gave me the confidence to push code to GitHub for our 4th-semester group project.',
      date: '2026-08-23'
    },
    {
      id: 'fb-03',
      studentName: 'Rituraj Kalita',
      session: 'Git & GitHub Collaboration Masterclass',
      rating: 4,
      comment: 'Very practical session. The slide deck and cheat sheet on Git trees are great reference materials.',
      date: '2026-08-23'
    }
  ];

  return (
    <AdminLayout
      title="Student Session Feedback"
      subtitle="Anonymous and post-session evaluations collected for pedagogical improvement"
    >
      <div className="space-y-6">
        
        {/* Rating summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Average Session Rating</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">4.8</span>
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Based on post-workshop exit forms</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Response Rate</span>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">87%</div>
            <p className="text-[11px] text-slate-400 mt-1">Of attending BCA students</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Hands-on Relevance</span>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">94%</div>
            <p className="text-[11px] text-slate-400 mt-1">Found lab exercises directly useful</p>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Student Reviews</h3>
            <span className="text-xs text-slate-500">{feedbacks.length} Entries</span>
          </div>

          <div className="divide-y divide-slate-100">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-5 hover:bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-xs text-slate-900">{fb.studentName}</span>
                    <span className="text-[11px] text-slate-500 ml-2">({fb.session})</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">&quot;{fb.comment}&quot;</p>
                <span className="text-[11px] text-slate-400 mt-2 block">Submitted on {fb.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
