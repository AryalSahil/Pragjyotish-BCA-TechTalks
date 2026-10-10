import React, { useState, useMemo } from 'react';
import { useTechTalks } from '../context/TechTalksContext';
import { EventCard } from '../components/events/EventCard';
import { EventFilter } from '../components/events/EventFilter';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';
import { EventCategory } from '../types';
import { CalendarSearch } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, isLoading } = useTechTalks();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter only published upcoming events
  const upcomingEvents = useMemo(() => {
    return events.filter(e => e.published && e.status === 'upcoming');
  }, [events]);

  const categories: (EventCategory | 'All')[] = [
    'All',
    'Cloud & DevOps',
    'Cybersecurity',
    'Full-Stack Web',
    'AI & Data Science',
    'Open Source'
  ];

  // Derive unique topics across all upcoming events
  const allTopics = useMemo(() => {
    const topicSet = new Set<string>();
    upcomingEvents.forEach(e => {
      if (e.topics) {
        e.topics.forEach(t => topicSet.add(t));
      }
    });
    return Array.from(topicSet).sort();
  }, [upcomingEvents]);

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter(e => {
      const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchesTopic = selectedTopic === 'All' || (e.topics && e.topics.includes(selectedTopic));
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        e.title.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query) ||
        e.tagline.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query) ||
        (e.topics && e.topics.some(t => t.toLowerCase().includes(query)));
      return matchesCategory && matchesTopic && matchesSearch;
    });
  }, [upcomingEvents, selectedCategory, selectedTopic, searchQuery]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTopic('All');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
          Academic Calendar
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Technical Seminars & Hands-on Workshops
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
          Browse upcoming sessions organized for BCA students. Filter by category, technical topic, or keyword. Seats are reserved based on laboratory workstation capacity.
        </p>
      </div>

      {/* Filter and Search Bar with Category and Topic Filtering */}
      <EventFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        selectedTopic={selectedTopic}
        onTopicChange={handleTopicChange}
        topics={allTopics}
        totalResults={filteredEvents.length}
        onResetFilters={handleResetFilters}
      />

      {/* Loading State */}
      {isLoading ? (
        <LoadingState
          type="card-grid"
          count={6}
          message="Loading upcoming seminar schedule..."
        />
      ) : paginatedEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="No upcoming sessions match your criteria"
          description={
            searchQuery || selectedCategory !== 'All' || selectedTopic !== 'All'
              ? `No sessions found matching ${selectedCategory !== 'All' ? `category "${selectedCategory}" ` : ''}${selectedTopic !== 'All' ? `topic "${selectedTopic}" ` : ''}${searchQuery ? `query "${searchQuery}"` : ''}. Try resetting your filters to see all available sessions.`
              : 'There are currently no upcoming sessions scheduled on the academic calendar. Please check back soon or browse our archived past events.'
          }
          icon={<CalendarSearch className="w-6 h-6 text-slate-500" />}
          actionLabel={searchQuery || selectedCategory !== 'All' || selectedTopic !== 'All' ? 'Reset All Filters' : undefined}
          onAction={handleResetFilters}
        />
      )}

    </div>
  );
};
