import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useTechTalks } from '../../context/TechTalksContext';
import { FileText, Download, CheckCircle2, Award, Calendar, Users } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { events, stats, registrations } = useTechTalks();
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const exportNAACReport = () => {
    const header = "Event Title,Category,Date,Venue,Capacity,Enrolled Students,Status\n";
    const rows = events.map(e =>
      `"${e.title}","${e.category}","${e.date}","${e.venue}",${e.capacity},${e.registeredCount},"${e.status}"`
    ).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pragjyotish_BCA_NAAC_Criterion3_Report_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadNotice('NAAC Criterion 3 Academic Summary exported as CSV.');
  };

  const exportAttendanceRoster = () => {
    const header = "Student Name,Email,Phone,Course,Semester,Roll Number,Session Target,Reference\n";
    const rows = registrations.map(r => {
      const evt = events.find(e => e.id === r.eventId);
      return `"${r.fullName}","${r.email}","${r.phone}","${r.course}","${r.semester}","${r.rollNumber}","${evt?.title || r.eventId}","${r.id}"`;
    }).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pragjyotish_BCA_Attendance_Roster_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadNotice('Student Attendance & Enrollment Roster exported as CSV.');
  };

  return (
    <AdminLayout
      title="Department & Accreditation Reports"
      subtitle="Generate official NAAC, IQAC, and departmental audit documentation from verified seminar data"
    >
      <div className="space-y-6">

        {downloadNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{downloadNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadNotice(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Academic Accreditation Readiness</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block mb-1">Seminars Documented</span>
              <span className="text-xl font-bold text-slate-900">{stats.totalEvents}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block mb-1">Total Student Participants</span>
              <span className="text-xl font-bold text-slate-900">{stats.totalRegistrations}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500 block mb-1">Industry Resource Persons</span>
              <span className="text-xl font-bold text-slate-900">{stats.speakerCount}</span>
            </div>
          </div>
        </div>

        {/* Report Download Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-blue-50 text-blue-900 rounded-lg border border-blue-100">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">NAAC / IQAC Criterion 3 Report</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Workshops conducted on research methodology, intellectual property &amp; entrepreneurship.
                </p>
                <span className="text-[11px] text-blue-900 font-semibold mt-2 inline-block">
                  {events.length} session records ready
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={exportNAACReport}
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-2"
              title="Download NAAC CSV Report"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between shadow-2xs hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Student Attendance Roster Archive</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Compiled sign-in sheets and lab participation rosters for academic audits.
                </p>
                <span className="text-[11px] text-emerald-800 font-semibold mt-2 inline-block">
                  {registrations.length} student records ready
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={exportAttendanceRoster}
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors shrink-0 ml-2"
              title="Download Attendance Roster CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
