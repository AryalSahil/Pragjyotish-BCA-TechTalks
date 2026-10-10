import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Initiative Mission & Affiliation */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/college_logo.png"
                alt="Pragjyotish College Crest"
                className="w-8 h-8 object-contain rounded-full shadow-xs bg-white p-0.5"
              />
              <span className="font-bold text-white tracking-tight text-base">
                Pragjyotish BCA TechTalks
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A student-focused seminar and practical workshop platform associated with the Department of Computer Science & BCA, Pragjyotish College, Guwahati. Fostering software engineering literacy, cloud computing, and industry connections.
            </p>
            <p className="text-[11px] text-slate-500 italic">
              Academic initiative organized by students and faculty mentors. Independent technical discourse without official unilateral institutional endorsement.
            </p>
          </div>

          {/* Col 2: Public Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Explore TechTalks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/events" className="text-slate-400 hover:text-white transition-colors">
                  Upcoming Seminars & Labs
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="text-slate-400 hover:text-white transition-colors">
                  Resource Persons & Speakers
                </Link>
              </li>
              <li>
                <Link to="/past-events" className="text-slate-400 hover:text-white transition-colors">
                  Past Event Reports
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-400 hover:text-white transition-colors">
                  Photo & Session Archive
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  Mission & Objectives
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Resources & Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Learning Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Session Code Repositories</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Speaker Invitation Request
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Student Volunteer Desk
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-slate-400 hover:text-white transition-colors">
                  Admin Coordinator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Department Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Campus Venue
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Dept. of Computer Science & BCA<br />
                  Pragjyotish College, Shantipur<br />
                  Guwahati, Assam 781009
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>bca.techtalks@pragjyotishcollege.ac.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Pragjyotish BCA TechTalks. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Designed for Student Developers</span>
            <span aria-hidden="true">·</span>
            <span>Architecture Ready for Supabase PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
