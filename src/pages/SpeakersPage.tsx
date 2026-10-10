import React, { useState } from 'react';
import { useTechTalks } from '../context/TechTalksContext';
import { SpeakerCard } from '../components/speakers/SpeakerCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, UserX } from 'lucide-react';

export const SpeakersPage: React.FC = () => {
  const { speakers, isLoading } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpeakers = speakers.filter(s => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.organization.toLowerCase().includes(query) ||
      s.expertise.some(e => e.toLowerCase().includes(query))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Header */}
      <div className="mb-8 max-w-3xl">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
          Academic Faculty & Industry Mentors
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Resource Persons & Speakers
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Meet the experienced software architects, cybersecurity researchers, and academic educators who lead sessions at Pragjyotish BCA TechTalks. Click any mentor to explore their public profile and led workshops.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mb-8">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by mentor name or area of expertise..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
        />
      </div>

      {/* Loading State or Speakers Grid / Empty State */}
      {isLoading ? (
        <LoadingState
          type="card-grid"
          count={6}
          message="Loading speaker directory..."
        />
      ) : filteredSpeakers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpeakers.map(speaker => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No speakers or resource persons found"
          description={
            searchQuery
              ? `No resource persons match your query "${searchQuery}". Please try searching by another skill, technology keyword, or name.`
              : 'Our speaker directory is currently being updated for the upcoming semester.'
          }
          icon={<UserX className="w-6 h-6 text-slate-500" />}
          actionLabel={searchQuery ? 'Clear Search' : undefined}
          onAction={() => setSearchQuery('')}
        />
      )}

      {/* Callout for guest speakers */}
      <div className="mt-16 bg-slate-50 border border-slate-200 rounded-lg p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-base font-bold text-slate-900">Interested in Sharing Your Technical Expertise?</h3>
        <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
          If you are a working engineer or researcher eager to conduct a guest seminar or practical code workshop for BCA students in Guwahati, we welcome session proposals.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md hover:bg-blue-800 transition-colors shadow-xs"
        >
          Submit Session Proposal
        </a>
      </div>

    </div>
  );
};
