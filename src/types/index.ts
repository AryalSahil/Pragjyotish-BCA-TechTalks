export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'postponed' | 'cancelled';

export type RegistrationStatus = 'open' | 'closed' | 'waitlist' | 'invite-only';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export type EventType = 
  | 'seminar' 
  | 'workshop' 
  | 'guest_lecture' 
  | 'technical_talk' 
  | 'coding_event' 
  | 'career_session';

export type EventCategory = 
  | 'Full-Stack Web' 
  | 'Cloud & DevOps' 
  | 'Cybersecurity' 
  | 'AI & Data Science' 
  | 'Open Source' 
  | 'Career & Industry';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  speakerName?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  detailedOverview: string;
  category: EventCategory;
  eventType?: EventType;
  topics: string[]; // Specific technical topics for filtering (e.g. ['Docker', 'DevOps', 'Containers'])
  date: string; // ISO date string e.g. "2026-10-24"
  time: string; // e.g. "10:30 AM - 01:30 PM"
  endDate?: string; // Optional end date e.g. "2026-10-24"
  endTime?: string; // e.g. "01:30 PM"
  timezone?: string; // e.g. "Asia/Kolkata"
  duration: string; // e.g. "3 Hours"
  venue: string; // e.g. "Auditorium Hall, Pragjyotish College" or "Lab 2"
  isOnline: boolean;
  meetingLink?: string;
  posterImage: string;
  status: EventStatus;
  publicationStatus?: PublicationStatus;
  registrationStatus: RegistrationStatus;
  registrationDeadline: string;
  capacity: number;
  registeredCount: number;
  prerequisites: string[];
  learningOutcomes: string[];
  schedule: ScheduleItem[];
  speakerIds: string[];
  featured?: boolean;
  published: boolean;
  materialsUrl?: string;
  reportSummary?: string;
}

export interface Speaker {
  id: string;
  slug: string;
  name: string;
  role: string;
  organization: string;
  bio: string;
  academicBackground?: string;
  avatar: string;
  expertise: string[];
  approvedLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
    x?: string;
  };
  featured?: boolean;
}

export interface RegistrationSubmission {
  id?: string;
  eventId: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  semester: string;
  rollNumber: string;
  laptopAvailable: 'yes' | 'no';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  expectations?: string;
  consentAccepted: boolean;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  eventId?: string;
  eventTitle?: string;
  date: string;
  image: string;
  caption: string;
  category: 'seminar' | 'workshop' | 'campus' | 'interactive';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
  published: boolean;
}

export interface ActivityLogItem {
  id: string;
  actorId?: string;
  actorEmail: string;
  actorName?: string;
  action: string;
  entityType: 'event' | 'speaker' | 'registration' | 'announcement' | 'media' | 'system' | 'auth';
  entityId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface FeedbackItem {
  id: string;
  eventId: string;
  eventTitle?: string;
  studentName?: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: string;
}
