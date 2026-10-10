import React, { useState } from 'react';
import { useTechTalks } from '../context/TechTalksContext';
import { ImageFallback } from '../components/common/ImageFallback';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { X, Calendar, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const { gallery, isLoading } = useTechTalks();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'seminar' | 'workshop' | 'campus'>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = gallery.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Header */}
      <div className="mb-8 max-w-3xl">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
          Visual Media Archive
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Session Photo Gallery & Campus Moments
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Glimpses of computer laboratory coding workshops, auditorium keynote seminars, and faculty-student discussions at Pragjyotish College.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-8">
        {(['all', 'seminar', 'workshop', 'campus'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
              selectedFilter === tab
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Photographs' : tab}
          </button>
        ))}
      </div>

      {/* Loading or Gallery Grid / Empty State */}
      {isLoading ? (
        <LoadingState
          type="card-grid"
          count={6}
          message="Loading photo gallery and media archive..."
        />
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs hover:border-slate-300 transition-all focus-within:ring-2 focus-within:ring-blue-700"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveItem(item);
                }
              }}
            >
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <ImageFallback
                  src={item.image}
                  alt={item.title}
                  fallbackText={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ZoomIn className="w-7 h-7" />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="capitalize font-medium">{item.category}</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No photographs available in this category"
          description={`There are currently no media entries categorized under "${selectedFilter}". Try selecting "All Photographs" to browse all session memories.`}
          icon={<ImageIcon className="w-6 h-6 text-slate-500" />}
          actionLabel="Show All Photographs"
          onAction={() => setSelectedFilter('all')}
        />
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-16/10 w-full bg-slate-950">
              <ImageFallback
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
              />
            </div>

            <div className="p-5 sm:p-6 bg-white border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="capitalize font-semibold text-blue-900">{activeItem.category} Archive</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(activeItem.date)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{activeItem.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{activeItem.caption}</p>
              {activeItem.eventTitle && (
                <p className="text-xs text-slate-500 mt-2">
                  Session: <strong className="text-slate-700">{activeItem.eventTitle}</strong>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
