import React from 'react';
import { EventStatus, RegistrationStatus } from '../../types';

interface StatusBadgeProps {
  status: EventStatus | RegistrationStatus;
  type?: 'event' | 'registration';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'event', className = '' }) => {
  // Clean unboxed metadata with subtle typographic indicator
  if (type === 'registration') {
    switch (status) {
      case 'open':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
            Registration Open
          </span>
        );
      case 'closed':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            Registration Closed
          </span>
        );
      case 'waitlist':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            Waitlist Available
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            {status}
          </span>
        );
    }
  }

  // Event status
  switch (status) {
    case 'upcoming':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" aria-hidden="true" />
          Upcoming Session
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" aria-hidden="true" />
          Conducted / Past
        </span>
      );
    case 'postponed':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
          Postponed / Rescheduling
        </span>
      );
    case 'cancelled':
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          Cancelled
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
          {status}
        </span>
      );
  }
};
