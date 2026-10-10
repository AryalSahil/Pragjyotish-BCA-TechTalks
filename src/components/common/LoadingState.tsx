import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  type?: 'card-grid' | 'spinner' | 'table' | 'hero';
  count?: number;
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card-grid',
  count = 3,
  message = 'Loading data...',
  className = '',
}) => {
  if (type === 'spinner') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`py-16 flex flex-col items-center justify-center text-center ${className}`}
      >
        <Loader2 className="w-8 h-8 text-blue-800 animate-spin mb-3" />
        <p className="text-xs font-medium text-slate-600">{message}</p>
        <span className="sr-only">Please wait, content is loading</span>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6"
      >
        <div className="h-4 bg-slate-200 rounded w-48 mb-4" />
        <div className="h-10 bg-slate-300 rounded max-w-xl mb-6" />
        <div className="h-20 bg-slate-200 rounded max-w-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-48 bg-slate-200 rounded-lg" />
          <div className="lg:col-span-5 h-48 bg-slate-200 rounded-lg" />
        </div>
        <span className="sr-only">Loading hero section</span>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div role="status" aria-live="polite" className="p-4 space-y-3 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-full" />
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-100 rounded w-full" />
        ))}
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  // Card Grid Skeleton (for Events, Speakers, Past Events, Gallery)
  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-lg overflow-hidden p-5 shadow-xs animate-pulse space-y-4"
        >
          <div className="aspect-16/9 bg-slate-200 rounded w-full" />
          <div className="flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-20" />
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-5 bg-slate-300 rounded w-5/6" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-4/5" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-3 bg-slate-200 rounded w-24" />
            <div className="h-6 bg-slate-200 rounded w-20" />
          </div>
        </div>
      ))}
      <span className="sr-only">{message}</span>
    </div>
  );
};
