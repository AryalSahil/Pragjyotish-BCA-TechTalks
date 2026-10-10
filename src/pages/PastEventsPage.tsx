import React from 'react';
import { Link } from 'react-router-dom';
import { useTechTalks } from '../context/TechTalksContext';
import { formatDate } from '../lib/utils';
import { ImageFallback } from '../components/common/ImageFallback';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { CheckCircle2, ArrowRight, Code, BookOpen } from 'lucide-react';

export const PastEventsPage: React.FC = () => {
  const { events, isLoading } = useTechTalks();

  const pastEvents = events.filter(e => e.status === 'completed' && e.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Header */}
      <div className="mb-10 max-w-3xl">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
          Archived Sessions & Outcomes
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Past Events & Workshop Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Review summaries, learning outcomes, and technical code repositories from completed TechTalks seminars conducted for the BCA department.
        </p>
      </div>

      {/* Loading or List of Past Events / Empty State */}
      {isLoading ? (
        <LoadingState
          type="card-grid"
          count={3}
          message="Loading past events and reports archive..."
        />
      ) : pastEvents.length > 0 ? (
        <div className="space-y-8">
          {pastEvents.map(event => (
            <article
              key={event.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 hover:border-slate-300 transition-colors"
            >
              {/* Poster / Thumbnail */}
              <div className="md:col-span-4 relative bg-slate-900 min-h-[220px]">
                <ImageFallback
                  src={event.posterImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-xs">
                  {event.category}
                </div>
              </div>

              {/* Content Details */}
              <div className="md:col-span-8 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mb-2 gap-2">
                    <span>Conducted on <strong>{formatDate(event.date)}</strong></span>
                    <span className="text-slate-600 tabular-nums">
                      <strong>{event.registeredCount}</strong> Registered Students
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    <Link to={`/events/${event.slug}`} className="hover:text-blue-900 transition-colors">
                      {event.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Report summary if available */}
                  {event.reportSummary && (
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-700 mb-4">
                      <span className="font-semibold block mb-0.5 text-slate-800">Department Summary:</span>
                      <p>{event.reportSummary}</p>
                    </div>
                  )}

                  {/* Key Skills Acquired */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Key Outcomes
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600">
                      {event.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Venue: {event.venue}</span>
                  <div className="flex items-center gap-3">
                    {event.materialsUrl && (
                      <a
                        href={event.materialsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                      >
                        <Code className="w-3.5 h-3.5 text-blue-700" />
                        <span>Code Repository</span>
                      </a>
                    )}
                    <Link
                      to={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-700"
                    >
                      <span>Full Session Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No archived past events"
          description="There are currently no concluded workshops archived for this semester. Check out our upcoming calendar to register for upcoming sessions."
          icon={<BookOpen className="w-6 h-6 text-slate-500" />}
          actionLabel="Explore Upcoming Events"
          onAction={() => window.location.href = '/events'}
        />
      )}

    </div>
  );
};
