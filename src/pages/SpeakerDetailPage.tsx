import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTechTalks } from '../context/TechTalksContext';
import { ImageFallback } from '../components/common/ImageFallback';
import { EventCard } from '../components/events/EventCard';
import {
  ArrowLeft,
  Linkedin,
  Github,
  Globe,
  GraduationCap,
  Calendar,
  Award,
  UserX,
  ExternalLink
} from 'lucide-react';

export const SpeakerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getSpeakerBySlug, getEventsBySpeakerId } = useTechTalks();

  const speaker = slug ? getSpeakerBySlug(slug) : undefined;
  const sessions = speaker ? getEventsBySpeakerId(speaker.id) : [];

  if (!speaker) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <UserX className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Speaker Profile Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
          The requested mentor profile could not be located in our directory.
        </p>
        <Link
          to="/speakers"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Speakers Directory</span>
        </Link>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-slate-500">
              <li>
                <Link to="/" className="hover:text-slate-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/speakers" className="hover:text-slate-900 transition-colors">
                  Speakers
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-900 font-semibold truncate" aria-current="page">
                {speaker.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Card Header */}
        <section aria-labelledby="speaker-profile-heading" className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Speaker Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-slate-200 bg-slate-100 shadow-xs">
              <ImageFallback
                src={speaker.avatar}
                alt={`Portrait of ${speaker.name}`}
                fallbackText={speaker.name}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>

            {/* Core Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 mb-1">
                <span>Resource Person Profile</span>
                {speaker.featured && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700">Advisory Faculty / Lead</span>
                  </>
                )}
              </div>

              <h1 id="speaker-profile-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {speaker.name}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-slate-700 mt-1">
                {speaker.role}
              </p>

              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {speaker.organization}
              </p>

              {/* Approved Public Links Only (No private contact details displayed) */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Public Profiles:</span>
                
                {speaker.approvedLinks.linkedin && (
                  <a
                    href={speaker.approvedLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-700"
                    aria-label={`${speaker.name} on LinkedIn (opens in new tab)`}
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {speaker.approvedLinks.github && (
                  <a
                    href={speaker.approvedLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-700"
                    aria-label={`${speaker.name} on GitHub (opens in new tab)`}
                  >
                    <Github className="w-3.5 h-3.5 text-slate-800" />
                    <span>GitHub</span>
                  </a>
                )}

                {speaker.approvedLinks.website && (
                  <a
                    href={speaker.approvedLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-blue-700"
                    aria-label={`${speaker.name} Academic Website (opens in new tab)`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-800" />
                    <span>Academic Portal</span>
                  </a>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* 2-Column Details: Bio & Expertise vs Academic Background */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Biography & Focus Topics */}
          <div className="lg:col-span-8 space-y-6">
            
            <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3">
                Professional Biography
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {speaker.bio}
              </p>
            </section>

            <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Technical Expertise & Research Areas
              </h2>
              <div className="text-xs text-slate-800 flex flex-wrap gap-x-3 gap-y-2">
                {speaker.expertise.map((exp, idx) => (
                  <span key={exp} className="inline-flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </section>

          </div>

          {/* Academic Background & Departmental Notes */}
          <div className="lg:col-span-4 space-y-6">
            
            {speaker.academicBackground && (
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
                <div className="flex items-center gap-2 text-blue-900 mb-3">
                  <GraduationCap className="w-5 h-5 text-blue-800" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Academic Background & Credentials
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {speaker.academicBackground}
                </p>
              </section>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-xs text-blue-900 space-y-2">
              <span className="font-bold block">Pragjyotish BCA Mentor Role</span>
              <p className="text-blue-800 leading-relaxed">
                Sessions led by our resource persons are volunteer-driven and focused on practical undergraduate education. To request guidance or propose an academic collaborative project, contact the secretariat.
              </p>
            </div>

          </div>

        </div>

        {/* Sessions Led by this Speaker */}
        <section aria-labelledby="sessions-led-heading" className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 id="sessions-led-heading" className="text-xl font-bold text-slate-900">
                Sessions & Workshops by {speaker.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upcoming tech talks and archived seminars coordinated with BCA students
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              {sessions.length} Total Sessions
            </span>
          </div>

          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-xs text-slate-500">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No scheduled sessions at this time</p>
              <p className="mt-1">Future workshops led by this speaker will be listed here.</p>
            </div>
          )}
        </section>

      </div>

    </div>
  );
};
