import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Share2,
  ArrowLeft,
  CalendarX,
  ExternalLink,
  Code
} from 'lucide-react';
import { useTechTalks } from '../context/TechTalksContext';
import { formatDate } from '../lib/utils';
import { ImageFallback } from '../components/common/ImageFallback';
import { StatusBadge } from '../components/common/StatusBadge';
import { SpeakerCard } from '../components/speakers/SpeakerCard';

export const EventDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getEventBySlug, speakers } = useTechTalks();

  const event = slug ? getEventBySlug(slug) : undefined;

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-500">
          <CalendarX className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Session Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6">
          The requested event could not be located or may have been unlisted.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Events Schedule</span>
        </Link>
      </div>
    );
  }

  const eventSpeakers = speakers.filter(s => event.speakerIds.includes(s.id));
  const isRegistrationOpen = event.registrationStatus === 'open' && event.status === 'upcoming';
  const seatsRemaining = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* Top Breadcrumb Nav */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/events" className="hover:text-slate-900 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Events</span>
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-800 font-medium truncate max-w-sm sm:max-w-md">
              {event.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Event Header Banner */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Visual Poster */}
            <div className="lg:col-span-5 relative bg-slate-900 min-h-[280px]">
              <ImageFallback
                src={event.posterImage}
                alt={event.title}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-sm">
                {event.category}
              </div>
            </div>

            {/* Header Content */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={event.registrationStatus} type="registration" />
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <StatusBadge status={event.status} type="event" />
                  </div>
                  <span className="text-slate-500 text-[11px] tabular-nums">
                    Capacity: {event.registeredCount}/{event.capacity} seats
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
                  {event.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {event.tagline || event.description}
                </p>

                {/* Primary Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-md border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-blue-800 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900">{formatDate(event.date)}</span>
                      <span className="text-[11px] text-slate-500">{event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-blue-800 shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900">{event.duration}</span>
                      <span className="text-[11px] text-slate-500">
                        {event.isOnline ? 'Online Broadcast' : 'On-Campus Lab/Hall'}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start gap-2.5 pt-2 border-t border-slate-200">
                    <MapPin className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                    <span className="text-slate-800">
                      <strong>Location:</strong> {event.venue}
                      {event.isOnline && event.meetingLink && (
                        <span className="block text-blue-700 text-[11px] mt-0.5 font-medium">
                          Virtual link provided to registered candidates
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action / State Row */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  {event.registrationDeadline && (
                    <p className="text-xs text-slate-500">
                      Registration Deadline: <strong className="text-slate-800">{formatDate(event.registrationDeadline)}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {isRegistrationOpen ? (
                    <Link
                      to={`/register/${event.id}`}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors shadow-xs"
                    >
                      Register Now ({seatsRemaining} seats available)
                    </Link>
                  ) : event.status === 'completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md">
                      <CheckCircle2 className="w-4 h-4 text-slate-500" />
                      Session Concluded
                    </span>
                  ) : event.status === 'postponed' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Postponed (New Date TBA)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 rounded-md">
                      Registration Closed / Full
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Overview */}
            <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Detailed Overview
              </h2>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                <p>{event.detailedOverview || event.description}</p>
                {event.reportSummary && (
                  <div className="p-4 bg-blue-50/60 rounded-md border border-blue-100 text-xs text-blue-900">
                    <span className="font-semibold block mb-1">Session Report Summary:</span>
                    <p>{event.reportSummary}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Learning Outcomes */}
            <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                What You Will Learn
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                {event.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Schedule Timeline */}
            {event.schedule && event.schedule.length > 0 && (
              <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Session Schedule
                </h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                  {event.schedule.map((slot, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-900 border-2 border-white shadow-xs" />
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                        <h3 className="text-sm font-bold text-slate-900">{slot.title}</h3>
                        <span className="text-xs font-semibold text-blue-800 tabular-nums">
                          {slot.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{slot.description}</p>
                      {slot.speakerName && (
                        <p className="text-[11px] text-slate-500 mt-1 font-medium">
                          Speaker: {slot.speakerName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Session Resources / Materials */}
            {event.materialsUrl && (
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-700">
                    <Code className="w-5 h-5 text-blue-800" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Session Code & Materials Repository</h3>
                    <p className="text-xs text-slate-500">Access slide decks, cheat sheets, and practical lab code.</p>
                  </div>
                </div>
                <a
                  href={event.materialsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 border border-slate-200 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <span>View Code</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </section>
            )}

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Prerequisites */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Prerequisites & Preparation
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {event.prerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Speaker Profiles for this Session */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Session Resource Person(s)
              </h3>
              {eventSpeakers.map(spk => (
                <SpeakerCard key={spk.id} speaker={spk} />
              ))}
            </div>

            {/* Student Registration Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 text-xs text-blue-900 space-y-2">
              <span className="font-bold block">Notice for BCA Students</span>
              <p className="text-blue-800 leading-relaxed">
                Attendance certificates are provided to registered participants who complete practical lab exercises. Please bring your college student ID card.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
