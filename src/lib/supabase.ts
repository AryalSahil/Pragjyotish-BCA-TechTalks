import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { EventItem, Speaker, GalleryItem, Announcement, RegistrationSubmission, ActivityLogItem } from '../types';

/**
 * Supabase Architecture Client Integration
 * 
 * Pragjyotish BCA TechTalks utilizes:
 * - Supabase PostgreSQL Database with Row Level Security (RLS)
 * - Supabase Auth for Admin users (tied to public.admin_users)
 * - Supabase Storage for session media & posters
 */

export interface SupabaseConfig {
  url: string | null;
  anonKey: string | null;
  isConfigured: boolean;
}

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
                    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || '';

const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
                        (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

export const supabaseConfig: SupabaseConfig = {
  url: supabaseUrl || null,
  anonKey: supabaseAnonKey || null,
  isConfigured: isSupabaseConfigured
};

// Initialize Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const SUPABASE_STATUS_NOTICE = {
  mode: isSupabaseConfigured ? 'Live Supabase Cloud' : 'Preview Store Active (Ready for Keys)',
  databaseEngine: 'Supabase PostgreSQL (9 RLS tables configured)',
  storageEngine: 'Supabase Storage Bucket "techtalks-media"',
  message: isSupabaseConfigured
    ? 'Connected to live Supabase backend with active Row Level Security.'
    : 'Pragjyotish BCA TechTalks is ready for Supabase credentials. Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, data switches seamlessly to PostgreSQL.'
};

// ==============================================================================
// AUTHENTICATION SERVICES
// ==============================================================================

export interface AdminProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'faculty_advisor' | 'coordinator';
  isActive: boolean;
}

/**
 * Real Supabase Authentication for Authorized Administrators
 */
export async function signInAdminUser(email: string, password: string): Promise<{
  success: boolean;
  user?: User;
  profile?: AdminProfile;
  error?: string;
}> {
  if (!supabase) {
    // If Supabase not yet configured, provide helpful guidance
    return {
      success: false,
      error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, then run the SQL migrations.'
    };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Invalid administrator email or password.'
      };
    }

    // Verify authorized active admin_users record tied to auth.uid()
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('id, user_id, email, full_name, role, is_active')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single();

    if (adminError || !adminRecord) {
      // User has auth record but is NOT in admin_users or is deactivated
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Unauthorized access: This account does not possess an active administrator assignment in public.admin_users.'
      };
    }

    return {
      success: true,
      user: authData.user,
      profile: {
        id: adminRecord.id,
        userId: adminRecord.user_id,
        email: adminRecord.email,
        fullName: adminRecord.full_name,
        role: adminRecord.role,
        isActive: adminRecord.is_active
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred during administrative login.'
    };
  }
}

export async function signOutAdminUser(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function getCurrentAdminProfile(): Promise<AdminProfile | null> {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('id, user_id, email, full_name, role, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!adminRecord) return null;

    return {
      id: adminRecord.id,
      userId: adminRecord.user_id,
      email: adminRecord.email,
      fullName: adminRecord.full_name,
      role: adminRecord.role,
      isActive: adminRecord.is_active
    };
  } catch {
    return null;
  }
}

// ==============================================================================
// PUBLIC DATA FETCHERS (Live Supabase with RLS)
// ==============================================================================

export async function fetchPublishedEventsFromDb(): Promise<EventItem[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        slug,
        summary,
        description,
        detailed_overview,
        category,
        event_type,
        start_time,
        end_time,
        timezone,
        venue,
        is_online,
        meeting_details,
        registration_deadline,
        capacity,
        registered_count,
        poster_path,
        publication_status,
        event_status,
        registration_status,
        prerequisites,
        learning_outcomes,
        topics,
        materials_url,
        report_summary,
        event_speakers(speaker_id)
      `)
      .eq('publication_status', 'published')
      .order('start_time', { ascending: true });

    if (error || !data) {
      console.warn('Failed to fetch events from Supabase:', error);
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      tagline: row.summary,
      description: row.description,
      detailedOverview: row.detailed_overview || row.description,
      category: row.category,
      eventType: row.event_type || 'workshop',
      topics: row.topics || [],
      date: row.start_time ? row.start_time.split('T')[0] : '',
      time: row.start_time ? new Date(row.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
      endDate: row.end_time ? row.end_time.split('T')[0] : (row.start_time ? row.start_time.split('T')[0] : ''),
      endTime: row.end_time ? new Date(row.end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
      timezone: row.timezone || 'Asia/Kolkata',
      duration: '3 Hours',
      venue: row.venue,
      isOnline: row.is_online,
      meetingLink: row.meeting_details,
      posterImage: row.poster_path || '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
      status: row.event_status,
      publicationStatus: row.publication_status,
      registrationStatus: row.registration_status,
      registrationDeadline: row.registration_deadline ? row.registration_deadline.split('T')[0] : '',
      capacity: row.capacity,
      registeredCount: row.registered_count || 0,
      prerequisites: row.prerequisites || [],
      learningOutcomes: row.learning_outcomes || [],
      schedule: [],
      speakerIds: (row.event_speakers || []).map((es: any) => es.speaker_id),
      featured: true,
      published: row.publication_status === 'published',
      materialsUrl: row.materials_url,
      reportSummary: row.report_summary
    }));
  } catch (err) {
    console.error('Error in fetchPublishedEventsFromDb:', err);
    return null;
  }
}

/**
 * Fetch all events for admin including drafts and archived
 */
export async function fetchAllEventsForAdmin(adminEmail = 'fake782447@gmail.com'): Promise<EventItem[] | null> {
  // First query trusted server endpoint
  try {
    const res = await fetch('/api/admin/events', {
      headers: { 'x-admin-email': adminEmail }
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.events)) {
        return result.events;
      }
    }
  } catch (err) {
    console.warn('Server admin events query:', err);
  }

  // If Supabase authenticated admin
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id, title, slug, summary, description, detailed_overview,
          category, event_type, start_time, end_time, timezone, venue,
          is_online, meeting_details, registration_deadline, capacity,
          registered_count, poster_path, publication_status, event_status,
          registration_status, prerequisites, learning_outcomes, topics,
          materials_url, report_summary, event_speakers(speaker_id)
        `)
        .order('start_time', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          tagline: row.summary,
          description: row.description,
          detailedOverview: row.detailed_overview || row.description,
          category: row.category,
          eventType: row.event_type || 'workshop',
          topics: row.topics || [],
          date: row.start_time ? row.start_time.split('T')[0] : '',
          time: row.start_time ? new Date(row.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
          endDate: row.end_time ? row.end_time.split('T')[0] : '',
          endTime: row.end_time ? new Date(row.end_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
          timezone: row.timezone || 'Asia/Kolkata',
          duration: '3 Hours',
          venue: row.venue,
          isOnline: row.is_online,
          meetingLink: row.meeting_details,
          posterImage: row.poster_path || '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
          status: row.event_status,
          publicationStatus: row.publication_status,
          registrationStatus: row.registration_status,
          registrationDeadline: row.registration_deadline ? row.registration_deadline.split('T')[0] : '',
          capacity: row.capacity,
          registeredCount: row.registered_count || 0,
          prerequisites: row.prerequisites || [],
          learningOutcomes: row.learning_outcomes || [],
          schedule: [],
          speakerIds: (row.event_speakers || []).map((es: any) => es.speaker_id),
          featured: true,
          published: row.publication_status === 'published',
          materialsUrl: row.materials_url,
          reportSummary: row.report_summary
        }));
      }
    } catch (err) {
      console.warn('Supabase admin events query failed:', err);
    }
  }

  return null;
}

/**
 * Create event via server endpoint
 */
export async function createEventApi(eventData: Partial<EventItem>, adminEmail = 'fake782447@gmail.com'): Promise<{ success: boolean; event?: EventItem; error?: string }> {
  try {
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail
      },
      body: JSON.stringify(eventData)
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to create event.' };
    }
    return { success: true, event: result.event };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error creating event.' };
  }
}

/**
 * Update event via server endpoint
 */
export async function updateEventApi(id: string, eventData: Partial<EventItem>, adminEmail = 'fake782447@gmail.com'): Promise<{ success: boolean; event?: EventItem; error?: string }> {
  try {
    const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail
      },
      body: JSON.stringify(eventData)
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to update event.' };
    }
    return { success: true, event: result.event };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error updating event.' };
  }
}

/**
 * Status change via server endpoint
 */
export async function changeEventStatusApi(
  id: string,
  action: 'publish' | 'unpublish' | 'postpone' | 'cancel' | 'archive',
  options?: { newDate?: string; reason?: string },
  adminEmail = 'fake782447@gmail.com'
): Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }> {
  try {
    const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail
      },
      body: JSON.stringify({ action, ...options })
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to change event status.' };
    }
    return { success: true, event: result.event, message: result.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error changing status.' };
  }
}

/**
 * Duplicate event via server endpoint
 */
export async function duplicateEventApi(id: string, adminEmail = 'fake782447@gmail.com'): Promise<{ success: boolean; event?: EventItem; error?: string; message?: string }> {
  try {
    const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}/duplicate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': adminEmail
      }
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to duplicate event.' };
    }
    return { success: true, event: result.event, message: result.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error duplicating event.' };
  }
}

/**
 * Delete event via server endpoint
 */
export async function deleteEventApi(id: string, adminEmail = 'fake782447@gmail.com'): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const res = await fetch(`/api/admin/events/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'x-admin-email': adminEmail
      }
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, error: result.error || 'Failed to delete event.' };
    }
    return { success: true, message: result.message };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error deleting event.' };
  }
}

export async function fetchPublishedSpeakersFromDb(): Promise<Speaker[] | null> {
  if (!supabase) return null;
  try {
    // Select from public_speakers view (guaranteeing private_email and private_phone are excluded)
    const { data, error } = await supabase
      .from('public_speakers')
      .select('id, slug, name, designation, organization, biography, academic_background, expertise, approved_public_links, public_photo_path, is_featured');

    if (error || !data) {
      // Fallback to table query if view not yet created
      const { data: tableData, error: tableError } = await supabase
        .from('speakers')
        .select('id, slug, name, designation, organization, biography, academic_background, expertise, approved_public_links, public_photo_path, is_featured')
        .eq('is_published', true);

      if (tableError || !tableData) return null;
      return tableData.map((s: any) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        role: s.designation,
        organization: s.organization,
        bio: s.biography,
        academicBackground: s.academic_background,
        avatar: s.public_photo_path || '/src/assets/images/speaker_portrait_faculty_1791614207262.jpg',
        expertise: s.expertise || [],
        approvedLinks: s.approved_public_links || {},
        featured: s.is_featured
      }));
    }

    return data.map((s: any) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      role: s.designation,
      organization: s.organization,
      bio: s.biography,
      academicBackground: s.academic_background,
      avatar: s.public_photo_path || '/src/assets/images/speaker_portrait_faculty_1791614207262.jpg',
      expertise: s.expertise || [],
      approvedLinks: s.approved_public_links || {},
      featured: s.is_featured
    }));
  } catch (err) {
    console.error('Error in fetchPublishedSpeakersFromDb:', err);
    return null;
  }
}

export async function submitRegistrationToDb(submission: Omit<RegistrationSubmission, 'id' | 'createdAt'>): Promise<{
  success: boolean;
  message: string;
  reference?: string;
  error?: string;
}> {
  if (!supabase) {
    return {
      success: false,
      error: 'CLIENT_NOT_INITIALIZED',
      message: 'Supabase client is not yet connected.'
    };
  }

  try {
    // Attempt to invoke the atomic RPC function `submit_event_registration`
    const { data: rpcResult, error: rpcError } = await supabase.rpc('submit_event_registration', {
      p_event_id: submission.eventId,
      p_student_name: submission.fullName,
      p_email: submission.email,
      p_phone: submission.phone,
      p_institution: submission.institution,
      p_course: submission.course,
      p_semester: submission.semester,
      p_roll_number: submission.rollNumber,
      p_laptop_available: submission.laptopAvailable,
      p_experience_level: submission.experienceLevel,
      p_expectations: submission.expectations || '',
      p_consent_accepted: submission.consentAccepted
    });

    if (!rpcError && rpcResult) {
      if (rpcResult.success) {
        return {
          success: true,
          message: rpcResult.message,
          reference: rpcResult.reference
        };
      }
      return {
        success: false,
        error: rpcResult.error,
        message: rpcResult.message
      };
    }

    // Direct table INSERT fallback (guarded by RLS policy)
    const reference = 'PBTT-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { error: insertError } = await supabase
      .from('registrations')
      .insert({
        event_id: submission.eventId,
        student_name: submission.fullName,
        email: submission.email.toLowerCase().trim(),
        phone: submission.phone,
        institution: submission.institution,
        course: submission.course,
        semester: submission.semester,
        roll_number: submission.rollNumber || null,
        laptop_available: submission.laptopAvailable,
        experience_level: submission.experienceLevel,
        expectations: submission.expectations || null,
        registration_status: 'confirmed',
        registration_reference: reference,
        consent_accepted: true
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return {
          success: false,
          error: 'DUPLICATE_REGISTRATION',
          message: 'A registration for this email address has already been submitted for this session.'
        };
      }
      return {
        success: false,
        error: insertError.code,
        message: insertError.message
      };
    }

    return {
      success: true,
      message: 'Registration confirmed successfully!',
      reference
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'SUBMISSION_FAILED',
      message: err?.message || 'Failed to submit registration to database.'
    };
  }
}

// ==============================================================================
// TRUSTED SERVER-SIDE ACTIVITY LOGGING & SESSION VERIFICATION
// ==============================================================================

/**
 * Record a significant administrative action using trusted server-side logging
 */
export async function recordAdminActivity(params: {
  action: string;
  entityType: 'event' | 'speaker' | 'registration' | 'announcement' | 'media' | 'system' | 'auth';
  entityId?: string;
  details: string;
  actorEmail?: string;
  actorName?: string;
  metadata?: Record<string, any>;
}): Promise<ActivityLogItem | null> {
  try {
    // 1. Post to trusted server-side endpoint
    const response = await fetch('/api/admin/log-activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (response.ok) {
      const data = await response.json();
      
      // 2. If Supabase is connected and admin session is active, also persist to public.activity_logs
      if (supabase && isSupabaseConfigured) {
        try {
          await supabase.from('activity_logs').insert({
            action: params.action,
            entity_type: params.entityType,
            entity_id: params.entityId || null,
            actor_email: params.actorEmail || null,
            metadata: params.metadata || {},
          });
        } catch (dbErr) {
          console.warn('Supabase activity log insert notice:', dbErr);
        }
      }

      return data.log;
    }
  } catch (err) {
    console.warn('Server activity log error:', err);
  }

  // Fallback client-generated log item if network is offline
  return {
    id: 'log-' + Date.now(),
    actorEmail: params.actorEmail || 'admin@pragjyotishcollege.ac.in',
    actorName: params.actorName || 'Authorized Administrator',
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    details: params.details,
    metadata: params.metadata,
    timestamp: new Date().toISOString()
  };
}

/**
 * Fetch recent administrative activity logs
 */
export async function fetchActivityLogsFromDb(): Promise<ActivityLogItem[]> {
  // If Supabase is connected, try to fetch from PostgreSQL activity_logs table
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          actorId: item.actor_id,
          actorEmail: item.actor_email || 'admin@pragjyotishcollege.ac.in',
          actorName: item.actor_email?.split('@')[0] || 'Administrator',
          action: item.action,
          entityType: item.entity_type,
          entityId: item.entity_id,
          details: item.metadata?.details || `${item.action} performed on ${item.entity_type}`,
          metadata: item.metadata,
          ipAddress: item.ip_address,
          timestamp: item.created_at
        }));
      }
    } catch (err) {
      console.warn('Failed to query Supabase activity logs:', err);
    }
  }

  // Query server-side trusted endpoint
  try {
    const res = await fetch('/api/admin/activity-logs');
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.logs)) {
        return result.logs;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch from server activity log endpoint:', err);
  }

  return [];
}

/**
 * Verify administrative privileges with trusted server-side endpoint
 */
export async function verifyAdminWithServer(email: string, password?: string, role?: string): Promise<{
  authorized: boolean;
  profile?: AdminProfile;
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();
    if (res.ok && data.authorized) {
      return {
        authorized: true,
        profile: {
          id: 'adm-' + Date.now(),
          userId: 'usr-' + Date.now(),
          email: data.profile.email,
          fullName: data.profile.fullName,
          role: data.profile.role,
          isActive: true
        }
      };
    }

    return {
      authorized: false,
      error: data.error || 'Server denied administrative authorization.'
    };
  } catch (err: any) {
    return {
      authorized: false,
      error: err?.message || 'Server connection error during authorization verification.'
    };
  }
}

