import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Shield } from 'lucide-react';

const routeNames: Record<string, string> = {
  admin: 'Dashboard',
  events: 'Manage Events',
  speakers: 'Manage Speakers',
  registrations: 'Form Registration',
  media: 'Media Manager',
  announcements: 'Announcements',
  feedback: 'Feedback',
  reports: 'Reports',
  settings: 'Settings',
  'activity-log': 'Activity Log'
};

export const AdminBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0 || pathSegments[0] !== 'admin') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500 mb-4">
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-900 transition-colors"
            title="Public Home"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span className="sr-only sm:not-sr-only text-[11px] font-medium">Home</span>
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronRight className="w-3 h-3 text-slate-300 mx-1 shrink-0" />
          <Link
            to="/admin"
            className="flex items-center gap-1 hover:text-blue-900 transition-colors font-medium text-[11px]"
          >
            <Shield className="w-3 h-3 text-blue-700" />
            <span>Admin</span>
          </Link>
        </li>

        {pathSegments.slice(1).map((segment, index) => {
          const isLast = index === pathSegments.length - 2;
          const href = `/admin/${pathSegments.slice(1, index + 2).join('/')}`;
          const label = routeNames[segment] || segment.replace(/-/g, ' ');

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight className="w-3 h-3 text-slate-300 mx-1 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-slate-800 text-[11px] capitalize" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={href}
                  className="hover:text-blue-900 transition-colors text-[11px] capitalize"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
