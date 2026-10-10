import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { Plus, Search, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ImageFallback } from '../../components/common/ImageFallback';
import { Link } from 'react-router-dom';
import { AddSpeakerModal } from '../../components/admin/AddSpeakerModal';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminSpeakersPage: React.FC = () => {
  const { speakers, refreshData } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const filtered = speakers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Manage Speakers & Mentors"
      subtitle="Maintain approved profiles, professional links, and session assignments"
      actions={
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource Person</span>
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

        {/* Privacy Note */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
          <span>
            <strong>Secure Public Speaker View Active:</strong> Private phone numbers and emails remain restricted to administrator accounts and are filtered from public profile endpoints.
          </span>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 max-w-sm shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor by name or role..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* Speakers Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12">
              <EmptyState
                title="No Speakers Found"
                description={
                  searchQuery
                    ? 'No mentors matched your search query.'
                    : 'No speakers have been registered yet.'
                }
                actionLabel="Add Resource Person"
                onAction={() => setAddModalOpen(true)}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Profile</th>
                    <th className="py-3 px-4">Organization / Designation</th>
                    <th className="py-3 px-4">Focus Topics</th>
                    <th className="py-3 px-4">Approved Links</th>
                    <th className="py-3 px-4 text-right">Public Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map(spk => (
                    <tr key={spk.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0">
                            <ImageFallback
                              src={spk.avatar}
                              alt={spk.name}
                              className="w-full h-full object-cover"
                              containerClassName="w-full h-full"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{spk.name}</span>
                            <span className="text-[11px] text-slate-500">{spk.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium">{spk.organization}</span>
                        {spk.academicBackground && (
                          <span className="block text-[11px] text-slate-400">{spk.academicBackground}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs text-[11px] text-slate-600">
                          {spk.expertise.slice(0, 3).map(e => (
                            <span key={e} className="bg-slate-100 px-1.5 py-0.5 rounded-xs">
                              {e}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {Object.keys(spk.approvedLinks).length} public links verified
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/speakers/${spk.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <span>View Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{speakers.length} Published Resource Persons</span>
            <span>Protected under <code>public.public_speakers</code></span>
          </div>
        </div>

      </div>

      <AddSpeakerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          refreshData();
          setNoticeMessage('Mentor profile added and published.');
        }}
      />
    </AdminLayout>
  );
};
