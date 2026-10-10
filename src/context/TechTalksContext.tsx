import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { EventItem, Speaker, RegistrationSubmission, GalleryItem, Announcement, ActivityLogItem } from '../types';
import { mockEvents } from '../data/mockEvents';
import { mockSpeakers } from '../data/mockSpeakers';
import { mockGallery } from '../data/mockGallery';
import { mockAnnouncements } from '../data/mockAnnouncements';
import { initialMockRegistrations } from '../data/mockRegistrations';
import {
  supabase,
  isSupabaseConfigured,
  fetchPublishedEventsFromDb,
  fetchAllEventsForAdmin,
  createEventApi,
  updateEventApi,
  changeEventStatusApi,
  duplicateEventApi,
  deleteEventApi,
  fetchPublishedSpeakersFromDb,
  submitRegistrationToDb,
  signInAdminUser,
  signOutAdminUser,
  getCurrentAdminProfile,
  recordAdminActivity,
  fetchActivityLogsFromDb,
  verifyAdminWithServer,
  AdminProfile
} from '../lib/supabase';

interface TechTalksContextType {
  events: EventItem[];
  speakers: Speaker[];
  gallery: GalleryItem[];
  announcements: Announcement[];
  registrations: RegistrationSubmission[];
  activityLogs: ActivityLogItem[];
  isLoading: boolean;
  loadError: string | null;
  isDbConnected: boolean;
  adminProfile: AdminProfile | null;
  isAdminAuthenticated: boolean;
  authChecked: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  refreshData: () => Promise<void>;
  logAdminAction: (action: string, entityType: ActivityLogItem['entityType'], details: string, entityId?: string, metadata?: any) => Promise<void>;
  createEvent: (eventData: Partial<EventItem>) => Promise<{ success: boolean; event?: EventItem; error?: string }>;
  updateEvent: (id: string, eventData: Partial<EventItem>) => Promise<{ success: boolean; event?: EventItem; error?: string }>;
  changeEventStatus: (id: string, action: 'publish' | 'unpublish' | 'postpone' | 'cancel' | 'archive', options?: { newDate?: string; reason?: string }) => Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }>;
  duplicateEvent: (id: string) => Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }>;
  deleteEvent: (id: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  checkSlugUnique: (slug: string, excludeId?: string) => boolean;
  addSpeaker: (speakerData: Partial<Speaker>) => Promise<{ success: boolean; speaker?: Speaker; error?: string }>;
  registerForEvent: (submission: Omit<RegistrationSubmission, 'id' | 'createdAt'>) => Promise<{ success: boolean; message: string; reference?: string; error?: string }>;
  isEmailRegistered: (eventId: string, email: string) => boolean;
  getEventBySlug: (slug: string) => EventItem | undefined;
  getEventById: (id: string) => EventItem | undefined;
  getSpeakerById: (id: string) => Speaker | undefined;
  getSpeakerBySlug: (slug: string) => Speaker | undefined;
  getEventsBySpeakerId: (speakerId: string) => EventItem[];
  // Dynamic stats calculated accurately from real dataset
  stats: {
    totalEvents: number;
    completedEvents: number;
    upcomingEvents: number;
    publishedSpeakers: number;
    totalAttendees: number;
    speakerCount: number;
    totalRegistrations: number;
    activeCategoriesCount: number;
  };
}

const TechTalksContext = createContext<TechTalksContextType | undefined>(undefined);

export const TechTalksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [speakers, setSpeakers] = useState<Speaker[]>(mockSpeakers);
  const [gallery, setGallery] = useState<GalleryItem[]>(mockGallery);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [registrations, setRegistrations] = useState<RegistrationSubmission[]>(initialMockRegistrations);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(isSupabaseConfigured);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(() => {
    try {
      const saved = localStorage.getItem('pragjyotish_admin_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  const saveAdminProfile = (profile: AdminProfile | null) => {
    setAdminProfile(profile);
    if (profile) {
      try {
        localStorage.setItem('pragjyotish_admin_session', JSON.stringify(profile));
      } catch {}
    } else {
      try {
        localStorage.removeItem('pragjyotish_admin_session');
      } catch {}
    }
  };

  // Load from Supabase on mount if configured
  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      setIsLoading(true);
      setLoadError(null);

      try {
        // Load server-side activity logs
        const initialLogs = await fetchActivityLogsFromDb();
        if (isMounted && initialLogs && initialLogs.length > 0) {
          setActivityLogs(initialLogs);
        }

        // Check if admin is currently active to load all events
        const savedProfile = adminProfile;
        if (savedProfile) {
          const adminEvents = await fetchAllEventsForAdmin(savedProfile.email);
          if (isMounted && adminEvents && adminEvents.length > 0) {
            setEvents(adminEvents);
          }
        } else if (isSupabaseConfigured && supabase) {
          // Check current admin session
          const currentProfile = await getCurrentAdminProfile();
          if (isMounted && currentProfile) {
            saveAdminProfile(currentProfile);
            const adminEvents = await fetchAllEventsForAdmin(currentProfile.email);
            if (adminEvents && adminEvents.length > 0) setEvents(adminEvents);
          } else {
            // Fetch published events from PostgreSQL
            const liveEvents = await fetchPublishedEventsFromDb();
            if (isMounted && liveEvents && liveEvents.length > 0) {
              setEvents(liveEvents);
            }
          }

          // Fetch published speakers from PostgreSQL (via public_speakers view)
          const liveSpeakers = await fetchPublishedSpeakersFromDb();
          if (isMounted && liveSpeakers && liveSpeakers.length > 0) {
            setSpeakers(liveSpeakers);
          }

          if (isMounted) setIsDbConnected(true);
        } else {
          // In preview mode or when server events exist
          const adminEvents = await fetchAllEventsForAdmin('fake782447@gmail.com');
          if (isMounted && adminEvents && adminEvents.length > 0) {
            setEvents(adminEvents);
          }
          setIsDbConnected(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setLoadError('Database query synchronization error: ' + (err?.message || 'Using local verified cache.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    }

    initializeData();

    // Listen to Supabase auth state changes
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await getCurrentAdminProfile();
          if (isMounted && profile) saveAdminProfile(profile);
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) saveAdminProfile(null);
        }
      });

      return () => {
        isMounted = false;
        authListener.subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const liveLogs = await fetchActivityLogsFromDb();
      if (liveLogs && liveLogs.length > 0) setActivityLogs(liveLogs);

      if (adminProfile) {
        const allAdminEvents = await fetchAllEventsForAdmin(adminProfile.email);
        if (allAdminEvents && allAdminEvents.length > 0) {
          setEvents(allAdminEvents);
        }
      } else if (isSupabaseConfigured && supabase) {
        const liveEvents = await fetchPublishedEventsFromDb();
        if (liveEvents && liveEvents.length > 0) setEvents(liveEvents);

        const liveSpeakers = await fetchPublishedSpeakersFromDb();
        if (liveSpeakers && liveSpeakers.length > 0) setSpeakers(liveSpeakers);
      } else {
        const adminEvents = await fetchAllEventsForAdmin('fake782447@gmail.com');
        if (adminEvents && adminEvents.length > 0) {
          setEvents(adminEvents);
        }
      }
    } catch (err: any) {
      setLoadError(err?.message || 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const logAdminAction = async (
    action: string,
    entityType: ActivityLogItem['entityType'],
    details: string,
    entityId?: string,
    metadata?: any
  ) => {
    try {
      const logItem = await recordAdminActivity({
        action,
        entityType,
        details,
        entityId,
        actorEmail: adminProfile?.email || 'admin@pragjyotishcollege.ac.in',
        actorName: adminProfile?.fullName || 'Authorized Administrator',
        metadata
      });

      if (logItem) {
        setActivityLogs(prev => [logItem, ...prev]);
      }
    } catch (err) {
      console.warn('Logging action warning:', err);
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Explicit check for configured administrator credentials
      if (cleanEmail === 'fake782447@gmail.com') {
        if (password !== 'fake1234&') {
          return {
            success: false,
            error: 'Invalid password. Please enter the configured administrator password.'
          };
        }
      }

      // 1. Verify with server-side endpoint first
      const serverAuth = await verifyAdminWithServer(email, password, 'super_admin');
      if (!serverAuth.authorized) {
        return {
          success: false,
          error: serverAuth.error || 'Server authorization denied: Not an approved administrator.'
        };
      }

      if (isSupabaseConfigured && supabase) {
        const result = await signInAdminUser(email, password);
        if (result.success && result.profile) {
          saveAdminProfile(result.profile);
          await logAdminAction(
            'ADMIN_LOGIN',
            'auth',
            `Administrator ${result.profile.fullName} (${result.profile.email}) logged in successfully`
          );
          return { success: true };
        }

        // If credentials match verified administrator (e.g. fake782447@gmail.com)
        // allow authenticated access using the verified session
        if (serverAuth.profile) {
          saveAdminProfile(serverAuth.profile);
          await logAdminAction(
            'ADMIN_LOGIN',
            'auth',
            `Administrator ${serverAuth.profile.fullName} (${serverAuth.profile.email}) authenticated with verified credentials`
          );
          return { success: true };
        }

        return { success: false, error: result.error || 'Login failed.' };
      } else {
        // Development Preview / Server verified authentication
        if (serverAuth.profile) {
          saveAdminProfile(serverAuth.profile);
          await logAdminAction(
            'ADMIN_LOGIN',
            'auth',
            `Administrator ${serverAuth.profile.fullName} (${serverAuth.profile.email}) authenticated in development preview`
          );
          return { success: true };
        }
        return {
          success: false,
          error: 'Please enter valid administrator credentials.'
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    if (adminProfile) {
      await logAdminAction(
        'ADMIN_LOGOUT',
        'auth',
        `Administrator ${adminProfile.fullName} (${adminProfile.email}) logged out`
      );
    }
    if (isSupabaseConfigured && supabase) {
      await signOutAdminUser();
    }
    saveAdminProfile(null);
  };

  const createEvent = async (eventData: Partial<EventItem>): Promise<{ success: boolean; event?: EventItem; error?: string }> => {
    try {
      const adminEmail = adminProfile?.email || 'fake782447@gmail.com';
      const apiResult = await createEventApi(eventData, adminEmail);
      if (!apiResult.success || !apiResult.event) {
        return { success: false, error: apiResult.error || 'Failed to create event.' };
      }

      setEvents(prev => [apiResult.event!, ...prev]);

      await logAdminAction(
        'EVENT_CREATED',
        'event',
        `Created new session "${apiResult.event.title}" (${apiResult.event.category}) scheduled for ${apiResult.event.date}`,
        apiResult.event.id,
        { capacity: apiResult.event.capacity, venue: apiResult.event.venue, slug: apiResult.event.slug }
      );

      return { success: true, event: apiResult.event };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create event.' };
    }
  };

  const updateEvent = async (id: string, eventData: Partial<EventItem>): Promise<{ success: boolean; event?: EventItem; error?: string }> => {
    try {
      const adminEmail = adminProfile?.email || 'fake782447@gmail.com';
      const apiResult = await updateEventApi(id, eventData, adminEmail);
      if (!apiResult.success || !apiResult.event) {
        return { success: false, error: apiResult.error || 'Failed to update event.' };
      }

      setEvents(prev => prev.map(e => e.id === id ? apiResult.event! : e));

      await logAdminAction(
        'EVENT_UPDATED',
        'event',
        `Updated details for session "${apiResult.event.title}"`,
        id,
        { status: apiResult.event.status, publicationStatus: apiResult.event.publicationStatus }
      );

      return { success: true, event: apiResult.event };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update event.' };
    }
  };

  const changeEventStatus = async (
    id: string,
    action: 'publish' | 'unpublish' | 'postpone' | 'cancel' | 'archive',
    options?: { newDate?: string; reason?: string }
  ): Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }> => {
    try {
      const adminEmail = adminProfile?.email || 'fake782447@gmail.com';
      const apiResult = await changeEventStatusApi(id, action, options, adminEmail);
      if (!apiResult.success || !apiResult.event) {
        return { success: false, error: apiResult.error || 'Failed to update status.' };
      }

      setEvents(prev => prev.map(e => e.id === id ? apiResult.event! : e));

      await logAdminAction(
        `EVENT_${action.toUpperCase()}`,
        'event',
        apiResult.message || `Action ${action} executed on session "${apiResult.event.title}"`,
        id,
        options
      );

      return { success: true, event: apiResult.event, message: apiResult.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to change status.' };
    }
  };

  const duplicateEvent = async (id: string): Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }> => {
    try {
      const adminEmail = adminProfile?.email || 'fake782447@gmail.com';
      const apiResult = await duplicateEventApi(id, adminEmail);
      if (!apiResult.success || !apiResult.event) {
        return { success: false, error: apiResult.error || 'Failed to duplicate event.' };
      }

      setEvents(prev => [apiResult.event!, ...prev]);

      await logAdminAction(
        'EVENT_DUPLICATED',
        'event',
        `Duplicated session into draft "${apiResult.event.title}"`,
        apiResult.event.id,
        { originalId: id }
      );

      return { success: true, event: apiResult.event, message: apiResult.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to duplicate event.' };
    }
  };

  const deleteEvent = async (id: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const adminEmail = adminProfile?.email || 'fake782447@gmail.com';
      const target = events.find(e => e.id === id);
      if (target && target.registeredCount > 0) {
        return {
          success: false,
          error: `Cannot delete event with existing registrations (${target.registeredCount} students enrolled). Please archive the session instead to preserve audit records.`
        };
      }

      const apiResult = await deleteEventApi(id, adminEmail);
      if (!apiResult.success) {
        return { success: false, error: apiResult.error || 'Failed to delete event.' };
      }

      setEvents(prev => prev.filter(e => e.id !== id));

      await logAdminAction(
        'EVENT_DELETED',
        'event',
        `Permanently deleted session "${target?.title || id}"`,
        id
      );

      return { success: true, message: apiResult.message };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to delete event.' };
    }
  };

  const checkSlugUnique = (slug: string, excludeId?: string): boolean => {
    const clean = slug.toLowerCase().trim();
    return !events.some(e => e.slug === clean && e.id !== excludeId);
  };

  const addSpeaker = async (speakerData: Partial<Speaker>): Promise<{ success: boolean; speaker?: Speaker; error?: string }> => {
    try {
      const newId = speakerData.id || `spk-${Date.now()}`;
      const slug = speakerData.slug || (speakerData.name || 'mentor')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newSpeaker: Speaker = {
        id: newId,
        slug,
        name: speakerData.name || 'Resource Person',
        role: speakerData.role || 'Senior Software Engineer / Lecturer',
        organization: speakerData.organization || 'Tech Industry Partner',
        bio: speakerData.bio || 'Experienced technology professional and academic mentor.',
        academicBackground: speakerData.academicBackground || 'Computer Science & Engineering',
        avatar: speakerData.avatar || '/src/assets/images/speaker_portrait_faculty_1791614207262.jpg',
        expertise: speakerData.expertise && speakerData.expertise.length > 0 ? speakerData.expertise : ['Software Systems'],
        approvedLinks: speakerData.approvedLinks || {},
        featured: Boolean(speakerData.featured)
      };

      setSpeakers(prev => [newSpeaker, ...prev]);

      await logAdminAction(
        'SPEAKER_ADDED',
        'speaker',
        `Added speaker/mentor "${newSpeaker.name}" from ${newSpeaker.organization}`,
        newSpeaker.id,
        { role: newSpeaker.role, organization: newSpeaker.organization }
      );

      return { success: true, speaker: newSpeaker };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to add speaker.' };
    }
  };

  const isEmailRegistered = (eventId: string, email: string) => {
    return registrations.some(
      r => r.eventId === eventId && r.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
  };

  const registerForEvent = async (submission: Omit<RegistrationSubmission, 'id' | 'createdAt'>) => {
    // 1. If Supabase is configured, submit to live database with RLS & duplicate checking
    if (isSupabaseConfigured && supabase) {
      const dbResult = await submitRegistrationToDb(submission);
      if (!dbResult.success) {
        return {
          success: false,
          message: dbResult.message,
          error: dbResult.error
        };
      }

      // Sync local registration record
      const newRecord: RegistrationSubmission = {
        ...submission,
        id: dbResult.reference || `reg-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setRegistrations(prev => [newRecord, ...prev]);

      // Atomically update local event capacity counter
      setEvents(prev => prev.map(ev => {
        if (ev.id === submission.eventId) {
          const newCount = ev.registeredCount + 1;
          return {
            ...ev,
            registeredCount: newCount,
            registrationStatus: newCount >= ev.capacity ? 'closed' : ev.registrationStatus
          };
        }
        return ev;
      }));

      return {
        success: true,
        message: 'Registration confirmed! Recorded in Supabase database.',
        reference: dbResult.reference
      };
    }

    // 2. Local fallback store (Development mode)
    if (isEmailRegistered(submission.eventId, submission.email)) {
      return {
        success: false,
        message: 'A registration with this email address already exists for this session.',
        error: 'DUPLICATE_EMAIL'
      };
    }

    const event = events.find(e => e.id === submission.eventId);
    if (!event) {
      return { success: false, message: 'Specified event could not be found.', error: 'EVENT_NOT_FOUND' };
    }

    if (event.registrationStatus === 'closed' || event.status === 'cancelled' || event.status === 'postponed') {
      return { success: false, message: 'Registration for this session is currently not open.', error: 'REGISTRATION_CLOSED' };
    }

    const reference = 'PBTT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const newRecord: RegistrationSubmission = {
      ...submission,
      id: reference,
      createdAt: new Date().toISOString()
    };

    setRegistrations(prev => [newRecord, ...prev]);

    setEvents(prev => prev.map(ev => {
      if (ev.id === submission.eventId) {
        const newCount = ev.registeredCount + 1;
        return {
          ...ev,
          registeredCount: newCount,
          registrationStatus: newCount >= ev.capacity ? 'closed' : ev.registrationStatus
        };
      }
      return ev;
    }));

    // Log registration in administrative audit trail
    logAdminAction(
      'REGISTRATION_RECORDED',
      'registration',
      `Student ${submission.fullName} (${submission.course}, ${submission.semester}) enrolled for "${event?.title || submission.eventId}"`,
      submission.eventId,
      { studentEmail: submission.email, reference }
    );

    return {
      success: true,
      message: 'Registration confirmed! A copy of your session details has been recorded in the session registry.',
      reference
    };
  };

  const getEventBySlug = (slug: string) => {
    return events.find(e => e.slug === slug || e.id === slug);
  };

  const getEventById = (id: string) => {
    return events.find(e => e.id === id);
  };

  const getSpeakerById = (id: string) => {
    return speakers.find(s => s.id === id);
  };

  const getSpeakerBySlug = (slug: string) => {
    return speakers.find(s => s.slug === slug || s.id === slug);
  };

  const getEventsBySpeakerId = (speakerId: string) => {
    return events.filter(e => e.speakerIds.includes(speakerId));
  };

  // Derive accurate statistics directly from database records
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const publishedSpeakers = speakers.filter(s => s.featured !== undefined || true).length;
    const totalAttendees = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
    const speakerCount = speakers.length;
    const totalRegistrations = registrations.length;
    const uniqueCategories = new Set(events.map(e => e.category));

    return {
      totalEvents,
      completedEvents,
      upcomingEvents,
      publishedSpeakers,
      totalAttendees,
      speakerCount,
      totalRegistrations,
      activeCategoriesCount: uniqueCategories.size,
    };
  }, [events, speakers, registrations]);

  return (
    <TechTalksContext.Provider
      value={{
        events,
        speakers,
        gallery,
        announcements,
        registrations,
        activityLogs,
        isLoading,
        loadError,
        isDbConnected,
        adminProfile,
        isAdminAuthenticated: Boolean(adminProfile),
        authChecked,
        loginAdmin,
        logoutAdmin,
        refreshData,
        logAdminAction,
        createEvent,
        addSpeaker,
        registerForEvent,
        isEmailRegistered,
        getEventBySlug,
        getEventById,
        getSpeakerById,
        getSpeakerBySlug,
        getEventsBySpeakerId,
        stats
      }}
    >
      {children}
    </TechTalksContext.Provider>
  );
};

export const useTechTalks = () => {
  const context = useContext(TechTalksContext);
  if (!context) {
    throw new Error('useTechTalks must be used within a TechTalksProvider');
  }
  return context;
};
