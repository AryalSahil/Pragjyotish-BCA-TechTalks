import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Events', path: '/events' },
    { label: 'Speakers', path: '/speakers' },
    { label: 'Past Events', path: '/past-events' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single element Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-blue-700 rounded-sm"
          >
            <img
              src="/college_logo.png"
              alt="Pragjyotish College Crest"
              className="w-9 h-9 object-contain rounded-full shadow-xs bg-white p-0.5 border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <span className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-blue-900 transition-colors">
              Pragjyotish BCA <span className="text-blue-700 font-semibold">TechTalks</span>
            </span>
          </Link>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  isActive(link.path)
                    ? 'text-blue-900 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-800'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Link */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/admin/login"
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 rounded-md transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-blue-700"
              title="Admin Portal (Preview Mode)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin</span>
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
            >
              <span>Explore Sessions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md focus-visible:outline-2 focus-visible:outline-blue-700"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
            >
              Contact & Enquiries
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md"
            >
              Admin Dashboard (Dev Preview)
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full text-center py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800"
            >
              Browse Upcoming TechTalks
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
