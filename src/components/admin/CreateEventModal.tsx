import React, { useState } from 'react';
import { useTechTalks } from '../../context/TechTalksContext';
import { EventCategory } from '../../types';
import { X, Calendar, MapPin, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CATEGORIES: EventCategory[] = [
  'Full-Stack Web',
  'Cloud & DevOps',
  'Cybersecurity',
  'AI & Data Science',
  'Open Source',
  'Career & Industry'
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { createEvent, speakers } = useTechTalks();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Full-Stack Web');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30 AM - 01:30 PM');
  const [venue, setVenue] = useState('Computer Science Lab 1, Pragjyotish College');
  const [capacity, setCapacity] = useState('60');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [speakerId, setSpeakerId] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [topics, setTopics] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title.trim() || title.trim().length < 5) {
      setError('Event title must be at least 5 characters long.');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a substantive session description (at least 20 characters).');
      return;
    }
    if (!date) {
      setError('Please specify the scheduled date for this seminar.');
      return;
    }

    const numCapacity = parseInt(capacity, 10);
    if (isNaN(numCapacity) || numCapacity <= 0) {
      setError('Capacity must be a positive integer.');
      return;
    }

    setIsSubmitting(true);
    try {
      const topicList = topics
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const result = await createEvent({
        title: title.trim(),
        category,
        tagline: tagline.trim() || description.trim().slice(0, 100),
        description: description.trim(),
        detailedOverview: description.trim(),
        date,
        time: time.trim(),
        venue: venue.trim(),
        capacity: numCapacity,
        registrationDeadline: registrationDeadline || date,
        isOnline,
        meetingLink: isOnline ? meetingLink.trim() : undefined,
        topics: topicList.length > 0 ? topicList : [category],
        speakerIds: speakerId ? [speakerId] : [],
        status: 'upcoming',
        registrationStatus: 'open',
        published: true
      });

      if (result.success) {
        setSuccessMessage(`Session "${title}" successfully scheduled and recorded in audit log.`);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1200);
      } else {
        setError(result.error || 'Failed to create event.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Create New Technical Seminar
            </h2>
            <p className="text-xs text-slate-500">
              Pragjyotish BCA TechTalks · Verified Administrator Action
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Modern Microservices Architecture & Containerization"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Mentor / Speaker
              </label>
              <select
                value={speakerId}
                onChange={e => setSpeakerId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              >
                <option value="">-- Select Assigned Speaker (Optional) --</option>
                {speakers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.organization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              One-Line Summary / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Brief academic summary for event card"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Curriculum Overview &amp; Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed syllabus, practical exercises, and software requirements..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Slot
              </label>
              <input
                type="text"
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="10:30 AM - 01:30 PM"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lab Seat Capacity
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="Computer Science Lab 1, Pragjyotish College"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topics (comma-separated)
              </label>
              <input
                type="text"
                value={topics}
                onChange={e => setTopics(e.target.value)}
                placeholder="Docker, Kubernetes, CI/CD"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-800 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-2 shadow-xs disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Session...</span>
                </>
              ) : (
                <span>Publish Technical Session</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
