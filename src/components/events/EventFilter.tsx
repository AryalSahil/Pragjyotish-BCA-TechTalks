import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { EventCategory } from '../../types';

interface EventFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: (EventCategory | 'All')[];
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
  topics: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  selectedTopic,
  onTopicChange,
  topics,
  totalResults,
  onResetFilters,
}) => {
  const isFiltered = searchQuery !== '' || selectedCategory !== 'All' || selectedTopic !== 'All';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs mb-8 space-y-4">
      
      {/* Top Row: Search Input + Result Count */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <label htmlFor="event-search-input" className="sr-only">
            Search seminars and workshops
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            id="event-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by topic, speaker, title, or venue..."
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-800 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-700"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs">
          <span className="text-slate-600 font-medium tabular-nums" aria-live="polite">
            <strong className="text-slate-900">{totalResults}</strong> {totalResults === 1 ? 'session' : 'sessions'} available
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
              aria-label="Reset all search and category filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Controls */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            Filter by Category:
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filter events by category">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Filter Controls */}
      {topics.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider text-[11px] block mb-2">
            Filter by Specific Technical Topic:
          </span>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter events by technical topic">
            <button
              type="button"
              onClick={() => onTopicChange('All')}
              aria-pressed={selectedTopic === 'All'}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                selectedTopic === 'All'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Topics
            </button>
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => onTopicChange(topic)}
                  aria-pressed={isSelected}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                    isSelected
                      ? 'bg-blue-900 text-white font-semibold'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
