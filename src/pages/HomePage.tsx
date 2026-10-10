import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Award, BookOpen, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTechTalks } from '../context/TechTalksContext';
import { EventCard } from '../components/events/EventCard';
import { SpeakerCard } from '../components/speakers/SpeakerCard';
import { ImageFallback } from '../components/common/ImageFallback';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate } from '../lib/utils';

export const HomePage: React.FC = () => {
  const { events, speakers, gallery, stats, isLoading } = useTechTalks();

  const featuredEvent = events.find(e => e.featured && e.status === 'upcoming') || events.find(e => e.status === 'upcoming');
  const upcomingEvents = events.filter(e => e.status === 'upcoming' && e.id !== featuredEvent?.id).slice(0, 3);
  const featuredSpeakers = speakers.filter(s => s.featured).slice(0, 3);
  const pastHighlights = events.filter(e => e.status === 'completed').slice(0, 2);
  const galleryPreviews = gallery.slice(0, 3);

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState type="hero" message="Loading Pragjyotish BCA TechTalks..." />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <LoadingState type="card-grid" count={3} message="Loading featured sessions..." />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: Hero Text & Value Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Institutional Kicker (unboxed text) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-4 tracking-wide">
                <span>Dept. of Computer Science & BCA</span>
                <span aria-hidden="true">·</span>
                <span>Govt. Pragjyotish College, Guwahati</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6 text-balance">
                Bridging Academic Computing with Industry Engineering.
              </h1>

              {/* Subheading / Deck */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
                Pragjyotish BCA TechTalks is a student-driven technology seminar and workshop initiative dedicated to practical learning, software architecture literacy, cloud deployments, and direct interactions with tech industry practitioners across Northeast India and beyond.
              </p>

              {/* Primary Call to Action buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-md transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-blue-400"
                >
                  <span>Browse Upcoming Sessions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors focus-visible:outline-2 focus-visible:outline-slate-400"
                >
                  <span>Our Mission & Structure</span>
                </Link>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
                <div>
                  <span className="font-bold text-white block text-sm">Technology Awareness</span>
                  <span className="text-slate-400 text-[11px]">Modern toolchains & architecture trends</span>
                </div>
                <div>
                  <span className="font-bold text-white block text-sm">Practical Workshops</span>
                  <span className="text-slate-400 text-[11px]">Lab-based terminal & coding exercises</span>
                </div>
                <div>
                  <span className="font-bold text-white block text-sm">Industry Mentorship</span>
                  <span className="text-slate-400 text-[11px]">Direct guidance from experienced architects</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-800/60 shadow-xl group">
                <div className="aspect-16/10 w-full overflow-hidden">
                  <ImageFallback
                    src="/src/assets/images/hero_seminar_hall_1791614162583.jpg"
                    alt="Pragjyotish BCA TechTalks Seminar Auditorium Hall"
                    fallbackText="Auditorium Session - Pragjyotish BCA TechTalks"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-slate-900/95 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-medium text-slate-300">Auditorium Keynote</span>
                    <span>Guwahati Campus</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Students engaging with cloud systems engineering and open-source practices during live TechTalks sessions.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 4-COLUMN ACCURATE KPI STRIP BELOW HERO */}
          {/* Note: Derived dynamically from active dataset records */}
          <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Total Program Events</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                {stats.totalEvents}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across academic semesters</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Student Attendee Slots</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                {stats.totalAttendees}+
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified lab & hall seats</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Resource Persons</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                {stats.speakerCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Faculty & industry mentors</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Technical Domains</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tabular-nums">
                {stats.activeCategoriesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Cloud, security, web, data</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED UPCOMING SESSION SPOTLIGHT */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Spotlight Event
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Featured Upcoming Workshop
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View full schedule</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-6 relative bg-slate-100 min-h-[260px] lg:min-h-full">
              <ImageFallback
                src={featuredEvent.posterImage}
                alt={featuredEvent.title}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-sm shadow-xs">
                {featuredEvent.category}
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span>{formatDate(featuredEvent.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredEvent.time}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-emerald-700">Registration Open</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                  <Link to={`/events/${featuredEvent.slug}`} className="hover:text-blue-900 transition-colors">
                    {featuredEvent.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {featuredEvent.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-md border border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <span><strong>Venue:</strong> {featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-700 shrink-0" />
                    <span><strong>Enrolled:</strong> {featuredEvent.registeredCount} of {featuredEvent.capacity} student seats</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  to={`/register/${featuredEvent.id}`}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors shadow-xs"
                >
                  Reserve Your Seat
                </Link>
                <Link
                  to={`/events/${featuredEvent.slug}`}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md border border-slate-200 transition-colors"
                >
                  View Learning Outcomes
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS PREVIEW GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
              Academic Calendar
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Upcoming TechTalks Sessions
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({stats.upcomingEvents})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* FEATURED SPEAKERS & MENTORS */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Resource Persons
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                Featured Speakers & Advisors
              </h2>
            </div>
            <Link
              to="/speakers"
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Meet all resource persons</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSpeakers.map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </div>
      </section>

      {/* PAST EVENT HIGHLIGHTS & OUTCOMES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
              Demonstrated Outcomes
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Past Session Highlights
            </h2>
          </div>
          <Link
            to="/past-events"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Read past event reports</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastHighlights.map((event) => (
            <article key={event.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Conducted: {formatDate(event.date)}</span>
                  <span className="font-semibold text-slate-700">{event.category}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  <Link to={`/events/${event.slug}`} className="hover:text-blue-900 transition-colors">
                    {event.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {event.reportSummary || event.description}
                </p>

                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Skills Imparted
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {event.learningOutcomes.slice(0, 2).map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {event.registeredCount} Students Participated
                </span>
                <Link
                  to={`/events/${event.slug}`}
                  className="text-xs font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <span>Event Archive</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
              Campus Moments
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Session Photo Gallery
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Full Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {galleryPreviews.map((item) => (
            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <div className="aspect-4/3 w-full overflow-hidden">
                <ImageFallback
                  src={item.image}
                  alt={item.title}
                  fallbackText={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>
              <div className="p-3 bg-white text-xs">
                <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATION CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-lg p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-800 shadow-md">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to Expand Your Technical Toolkit?
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-2 leading-relaxed">
              BCA TechTalks sessions are free for enrolled college students. Secure your seat in hands-on workshops before batch capacity closes.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap gap-3">
            <Link
              to="/events"
              className="px-5 py-2.5 text-xs font-semibold text-blue-900 bg-white hover:bg-blue-50 rounded-md transition-colors shadow-xs"
            >
              Browse Open Seminars
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-800/80 hover:bg-blue-700 border border-blue-600 rounded-md transition-colors"
            >
              Contact Coordinators
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
