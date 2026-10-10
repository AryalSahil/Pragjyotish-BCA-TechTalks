import React, { useState, useMemo } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { formatDate } from '../../lib/utils';
import { Search, Download, Eye, X, CheckCircle } from 'lucide-react';
import { Pagination } from '../../components/common/Pagination';
import { RegistrationSubmission } from '../../types';

export const AdminRegistrationsPage: React.FC = () => {
  const { registrations, events } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [selectedReg, setSelectedReg] = useState<RegistrationSubmission | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      const matchesEvent = selectedEventId === 'all' || r.eventId === selectedEventId;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.rollNumber.toLowerCase().includes(q) ||
        r.institution.toLowerCase().includes(q);
      return matchesEvent && matchesSearch;
    });
  }, [registrations, selectedEventId, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Full Name,Email,Phone,Institution,Course,Semester,Roll Number,Laptop,Experience,Registered At"]
      .concat(filtered.map(r => `"${r.fullName}","${r.email}","${r.phone}","${r.institution}","${r.course}","${r.semester}","${r.rollNumber}","${r.laptopAvailable}","${r.experienceLevel}","${r.createdAt}"`))
      .join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pragjyotish_techtalks_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout
      title="Student Registrations Registry"
      subtitle="Verify student enrollments, lab workstation requirements, and course cohorts"
      actions={
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Roster</span>
        </button>
      }
    >
      <div className="space-y-6">
        
        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student, roll number, email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Filter Session:</span>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-hidden max-w-xs truncate"
            >
              <option value="all">All Sessions ({registrations.length})</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Institution & Course</th>
                  <th className="py-3 px-4">Roll Number</th>
                  <th className="py-3 px-4">Target Session</th>
                  <th className="py-3 px-4">Laptop</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginated.map(reg => {
                  const evt = events.find(e => e.id === reg.eventId);
                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {reg.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="block text-slate-800">{reg.email}</span>
                        <span className="text-[11px] text-slate-500">{reg.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 font-medium block truncate max-w-[180px]">{reg.institution}</span>
                        <span className="text-[11px] text-slate-500">{reg.course} · {reg.semester}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {reg.rollNumber || '—'}
                      </td>
                      <td className="py-3 px-4 max-w-[200px] truncate" title={evt?.title}>
                        <span className="font-medium text-slate-800 block truncate">{evt?.title || reg.eventId}</span>
                        <span className="text-[11px] text-slate-500">{evt?.date ? formatDate(evt.date) : ''}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-xs ${
                          reg.laptopAvailable === 'yes' ? 'bg-blue-50 text-blue-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {reg.laptopAvailable === 'yes' ? 'Laptop' : 'Lab PC'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReg(reg)}
                          className="p-1 text-slate-500 hover:text-blue-900 transition-colors"
                          title="View registration dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>

      {/* Student Details Dossier Modal */}
      {selectedReg && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Student Enrollment Dossier</h3>
                <span className="text-[11px] text-slate-500">ID: {selectedReg.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-md">
                <div>
                  <span className="text-slate-500 block text-[11px]">Student Name</span>
                  <strong className="text-slate-900">{selectedReg.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Roll / ID Number</span>
                  <strong className="text-slate-900">{selectedReg.rollNumber || 'Not specified'}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span>{selectedReg.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Mobile Number</span>
                  <span>{selectedReg.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Institution & Program</span>
                <p className="font-medium text-slate-800">{selectedReg.institution}</p>
                <p className="text-[11px] text-slate-500">{selectedReg.course} — {selectedReg.semester}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">Lab Hardware</span>
                  <span className="font-semibold capitalize">{selectedReg.laptopAvailable === 'yes' ? 'Bringing Laptop' : 'Lab Desktop Requested'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Experience Level</span>
                  <span className="font-semibold capitalize">{selectedReg.experienceLevel}</span>
                </div>
              </div>

              {selectedReg.expectations && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-500 block text-[11px]">Questions / Learning Goals</span>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-md mt-1">
                    &quot;{selectedReg.expectations}&quot;
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};
