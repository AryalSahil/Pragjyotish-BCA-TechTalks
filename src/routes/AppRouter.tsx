import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailPage } from '../pages/EventDetailPage';
import { SpeakersPage } from '../pages/SpeakersPage';
import { SpeakerDetailPage } from '../pages/SpeakerDetailPage';
import { PastEventsPage } from '../pages/PastEventsPage';
import { GalleryPage } from '../pages/GalleryPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ContactPage } from '../pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminEventsPage } from '../pages/admin/AdminEventsPage';
import { AdminSpeakersPage } from '../pages/admin/AdminSpeakersPage';
import { AdminRegistrationsPage } from '../pages/admin/AdminRegistrationsPage';
import { AdminMediaPage } from '../pages/admin/AdminMediaPage';
import { AdminAnnouncementsPage } from '../pages/admin/AdminAnnouncementsPage';
import { AdminFeedbackPage } from '../pages/admin/AdminFeedbackPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminActivityLogPage } from '../pages/admin/AdminActivityLogPage';
import { AdminGuard } from '../components/common/AdminGuard';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public layout wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
        <Route path="/events/:slug" element={<PublicLayout><EventDetailPage /></PublicLayout>} />
        <Route path="/speakers" element={<PublicLayout><SpeakersPage /></PublicLayout>} />
        <Route path="/speakers/:slug" element={<PublicLayout><SpeakerDetailPage /></PublicLayout>} />
        <Route path="/past-events" element={<PublicLayout><PastEventsPage /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
        <Route path="/register/:eventId" element={<PublicLayout><RegisterPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
        <Route path="/admin/events" element={<AdminGuard><AdminEventsPage /></AdminGuard>} />
        <Route path="/admin/speakers" element={<AdminGuard><AdminSpeakersPage /></AdminGuard>} />
        <Route path="/admin/registrations" element={<AdminGuard><AdminRegistrationsPage /></AdminGuard>} />
        <Route path="/admin/media" element={<AdminGuard><AdminMediaPage /></AdminGuard>} />
        <Route path="/admin/announcements" element={<AdminGuard><AdminAnnouncementsPage /></AdminGuard>} />
        <Route path="/admin/feedback" element={<AdminGuard><AdminFeedbackPage /></AdminGuard>} />
        <Route path="/admin/reports" element={<AdminGuard><AdminReportsPage /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><AdminSettingsPage /></AdminGuard>} />
        <Route path="/admin/activity-log" element={<AdminGuard><AdminActivityLogPage /></AdminGuard>} />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="max-w-2xl mx-auto px-4 py-24 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900">404 - Page Not Found</h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
                  The page you are looking for does not exist or has been relocated.
                </p>
                <a
                  href="/"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800"
                >
                  Return to Home
                </a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
};
