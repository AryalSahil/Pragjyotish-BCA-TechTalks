import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { EventItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { ImageFallback } from '../common/ImageFallback';
import { StatusBadge } from '../common/StatusBadge';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const isRegistrationOpen = event.registrationStatus === 'open' && event.status === 'upcoming';
  const seatsRemaining = Math.max(0, event.capacity - event.registeredCount);

  return (
    <article className="group flex flex-col bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors shadow-xs">
      
      {/* Poster Image Slot */}
      <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
        <ImageFallback
          src={event.posterImage}
          alt={event.title}
          fallbackText={event.title}
          containerClassName="w-full h-full"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        {/* Subtle Category & Format text kicker overlay scrim */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-sm">
          {event.category}
          {event.isOnline && ' · Virtual'}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5">
        
        {/* Status indicator row */}
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 mb-3">
          <StatusBadge status={event.registrationStatus} type="registration" />
          <span className="text-slate-500 font-medium tabular-nums">
            {event.registeredCount}/{event.capacity} Enrolled
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug line-clamp-2 mb-2">
          <Link to={`/events/${event.slug}`} className="focus-visible:outline-2 focus-visible:outline-blue-700 rounded-xs">
            {event.title}
          </Link>
        </h3>

        {/* Short Tagline / Deck */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {event.tagline || event.description}
        </p>

        {/* Quiet unboxed metadata strip */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-5 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{formatDate(event.date)}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="tabular-nums text-slate-500">{event.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <Link
            to={`/events/${event.slug}`}
            className="text-xs font-semibold text-slate-700 hover:text-blue-900 transition-colors inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <span>Session Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          {isRegistrationOpen ? (
            <Link
              to={`/register/${event.id}`}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors shadow-xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-blue-900"
            >
              Register ({seatsRemaining} left)
            </Link>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              {event.status === 'completed' ? 'Event Concluded' : 'Registration Closed'}
            </span>
          )}
        </div>

      </div>
    </article>
  );
};
