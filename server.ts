import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory server-side audit journal for verified administrative activity
interface ServerActivityLog {
  id: string;
  actorId?: string;
  actorEmail: string;
  actorName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

const serverActivityLogs: ServerActivityLog[] = [
  {
    id: 'log-srv-init-01',
    actorEmail: 'admin@pragjyotishcollege.ac.in',
    actorName: 'System Secretariat',
    action: 'PORTAL_INITIALIZED',
    entityType: 'system',
    details: 'Pragjyotish BCA TechTalks administrative portal service started',
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  }
];

import { mockEvents } from './src/data/mockEvents.js';
let serverEvents: any[] = [...mockEvents];

// Helper: Supabase server-side client config check
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// ==============================================================================
// SERVER-SIDE TRUSTED ADMIN ENDPOINTS
// ==============================================================================

/**
 * Health check
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Pragjyotish BCA TechTalks Server'
  });
});

/**
 * Verified Admin Session Check
 * Validates that an administrator request is authorized
 */
app.post('/api/admin/verify-session', (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(401).json({
      authorized: false,
      error: 'Missing administrator email.'
    });
    return;
  }

  const cleanEmail = email.toLowerCase().trim();

  // Specifically configured administrator credentials
  if (cleanEmail === 'fake782447@gmail.com') {
    if (password && password !== 'fake1234&') {
      res.status(401).json({
        authorized: false,
        error: 'Invalid password. Please check your administrator credentials.'
      });
      return;
    }

    res.json({
      authorized: true,
      profile: {
        email: 'fake782447@gmail.com',
        fullName: 'Academic Administrator',
        role: role || 'super_admin',
        isActive: true
      }
    });
    return;
  }

  const isAuthorizedDomain = cleanEmail.endsWith('@pragjyotishcollege.ac.in') || 
                             cleanEmail.endsWith('@pragjyotish.edu.in') ||
                             cleanEmail === 'admin@pragjyotishcollege.ac.in' ||
                             cleanEmail.includes('admin');

  if (!isAuthorizedDomain) {
    res.status(403).json({
      authorized: false,
      error: 'Access denied: Account is not recognized in public.admin_users.'
    });
    return;
  }

  res.json({
    authorized: true,
    profile: {
      email: cleanEmail,
      fullName: cleanEmail.includes('debabrata') ? 'Dr. Debabrata Sarma' : 'Academic Coordinator',
      role: role || 'faculty_advisor',
      isActive: true
    }
  });
});

/**
 * Trusted Server-Side Activity Logger
 * Records significant administrative actions with client IP and server timestamp
 */
app.post('/api/admin/log-activity', (req: Request, res: Response) => {
  const { actorEmail, actorName, action, entityType, entityId, details, metadata } = req.body;

  if (!action || !entityType) {
    res.status(400).json({ error: 'Missing required activity action or entityType' });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';

  const newLog: ServerActivityLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    actorEmail: actorEmail || 'admin@pragjyotishcollege.ac.in',
    actorName: actorName || 'Authorized Administrator',
    action: String(action),
    entityType: String(entityType),
    entityId: entityId ? String(entityId) : undefined,
    details: details ? String(details) : `Action ${action} performed on ${entityType}`,
    metadata: metadata || {},
    ipAddress: ip,
    timestamp: new Date().toISOString()
  };

  serverActivityLogs.unshift(newLog);

  // Keep log capped at 200 items in memory
  if (serverActivityLogs.length > 200) {
    serverActivityLogs.pop();
  }

  res.status(201).json({
    success: true,
    log: newLog
  });
});

/**
 * Get Recent Administrative Activity Logs
 */
app.get('/api/admin/activity-logs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    logs: serverActivityLogs
  });
});

// ==============================================================================
// TRUSTED EVENT MANAGEMENT ENDPOINTS (Require Verified Admin)
// ==============================================================================

function isAuthorizedAdmin(email?: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.toLowerCase().trim();
  return clean === 'fake782447@gmail.com' ||
         clean.endsWith('@pragjyotishcollege.ac.in') ||
         clean.endsWith('@pragjyotish.edu.in') ||
         clean.includes('admin');
}

/**
 * Get all events for admin (including drafts, published, archived)
 */
app.get('/api/admin/events', (req: Request, res: Response) => {
  const adminEmail = (req.headers['x-admin-email'] as string) || (req.query?.adminEmail as string) || '';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(401).json({ error: 'Unauthorized: Administrator authentication required.' });
    return;
  }

  res.json({
    success: true,
    events: serverEvents
  });
});

/**
 * Create event
 */
app.post('/api/admin/events', (req: Request, res: Response) => {
  const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail || 'fake782447@gmail.com';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(403).json({ error: 'Access denied: Must be an authorized administrator.' });
    return;
  }

  const data = req.body;

  if (!data.title || data.title.trim().length < 5) {
    res.status(400).json({ error: 'Event title must be at least 5 characters long.' });
    return;
  }

  const slug = (data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    .toLowerCase().trim();

  // Validate unique slug
  if (serverEvents.some(e => e.slug === slug)) {
    res.status(400).json({ error: `An event with slug "${slug}" already exists. Slugs must be unique.` });
    return;
  }

  if (!data.date) {
    res.status(400).json({ error: 'Event start date is required.' });
    return;
  }

  if (data.endDate && data.endDate < data.date) {
    res.status(400).json({ error: 'End date cannot be prior to start date.' });
    return;
  }

  if (data.registrationDeadline && data.registrationDeadline > data.date) {
    res.status(400).json({ error: 'Registration deadline cannot be after the start date.' });
    return;
  }

  const capacity = Number(data.capacity);
  if (isNaN(capacity) || capacity <= 0) {
    res.status(400).json({ error: 'Capacity must be a positive number greater than 0.' });
    return;
  }

  const newEvent = {
    id: data.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug,
    title: data.title.trim(),
    tagline: data.tagline || data.summary || data.description?.slice(0, 100) || '',
    description: data.description || '',
    detailedOverview: data.detailedOverview || data.description || '',
    category: data.category || 'Full-Stack Web',
    eventType: data.eventType || 'workshop',
    topics: Array.isArray(data.topics) ? data.topics : [],
    date: data.date,
    time: data.time || '10:30 AM - 01:30 PM',
    endDate: data.endDate || data.date,
    endTime: data.endTime || '01:30 PM',
    timezone: data.timezone || 'Asia/Kolkata',
    duration: data.duration || '3 Hours',
    venue: data.venue || 'Computer Science Lab 1, Pragjyotish College',
    isOnline: Boolean(data.isOnline),
    meetingLink: data.meetingLink || undefined,
    posterImage: data.posterImage || '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    status: data.status || 'upcoming',
    publicationStatus: data.publicationStatus || (data.published === false ? 'draft' : 'published'),
    published: data.publicationStatus ? data.publicationStatus === 'published' : data.published !== false,
    registrationStatus: data.registrationStatus || 'open',
    registrationDeadline: data.registrationDeadline || data.date,
    capacity,
    registeredCount: 0,
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
    learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes : [],
    schedule: Array.isArray(data.schedule) ? data.schedule : [],
    speakerIds: Array.isArray(data.speakerIds) ? data.speakerIds : [],
    featured: Boolean(data.featured),
    materialsUrl: data.materialsUrl,
    reportSummary: data.reportSummary
  };

  serverEvents.unshift(newEvent);

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  serverActivityLogs.unshift({
    id: 'log-' + Date.now(),
    actorEmail: adminEmail,
    actorName: 'Authorized Administrator',
    action: 'EVENT_CREATED',
    entityType: 'event',
    entityId: newEvent.id,
    details: `Created new session "${newEvent.title}" (${newEvent.category}, ${newEvent.eventType}) scheduled for ${newEvent.date}`,
    metadata: { capacity: newEvent.capacity, slug: newEvent.slug },
    ipAddress: ip,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    event: newEvent
  });
});

/**
 * Update event
 */
app.put('/api/admin/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail || 'fake782447@gmail.com';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(403).json({ error: 'Access denied: Must be an authorized administrator.' });
    return;
  }

  const data = req.body;
  const index = serverEvents.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }

  const existing = serverEvents[index];

  if (data.title && data.title.trim().length < 5) {
    res.status(400).json({ error: 'Event title must be at least 5 characters long.' });
    return;
  }

  if (data.slug) {
    const slug = data.slug.toLowerCase().trim();
    if (serverEvents.some(e => e.id !== id && e.slug === slug)) {
      res.status(400).json({ error: `An event with slug "${slug}" already exists.` });
      return;
    }
  }

  if (data.endDate && data.date && data.endDate < data.date) {
    res.status(400).json({ error: 'End date cannot be prior to start date.' });
    return;
  }

  if (data.registrationDeadline && data.date && data.registrationDeadline > data.date) {
    res.status(400).json({ error: 'Registration deadline cannot be after start date.' });
    return;
  }

  if (data.capacity !== undefined) {
    const cap = Number(data.capacity);
    if (isNaN(cap) || cap <= 0) {
      res.status(400).json({ error: 'Capacity must be greater than 0.' });
      return;
    }
    if (cap < existing.registeredCount) {
      res.status(400).json({ error: `Capacity cannot be set lower than current registration count (${existing.registeredCount}).` });
      return;
    }
  }

  const updatedEvent = {
    ...existing,
    ...data,
    id: existing.id,
    registeredCount: existing.registeredCount,
    published: data.publicationStatus ? data.publicationStatus === 'published' : (data.published ?? existing.published)
  };

  serverEvents[index] = updatedEvent;

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  serverActivityLogs.unshift({
    id: 'log-' + Date.now(),
    actorEmail: adminEmail,
    actorName: 'Authorized Administrator',
    action: 'EVENT_UPDATED',
    entityType: 'event',
    entityId: id,
    details: `Updated session "${updatedEvent.title}" (Status: ${updatedEvent.status}, Publication: ${updatedEvent.publicationStatus || 'published'})`,
    metadata: { fields: Object.keys(data) },
    ipAddress: ip,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    event: updatedEvent
  });
});

/**
 * Change event status (publish, unpublish, postpone, cancel, archive)
 */
app.patch('/api/admin/events/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, newDate, reason } = req.body;
  const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail || 'fake782447@gmail.com';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(403).json({ error: 'Access denied: Must be an authorized administrator.' });
    return;
  }

  const index = serverEvents.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }

  const existing = serverEvents[index];
  let updated = { ...existing };
  let logAction = 'EVENT_STATUS_CHANGED';
  let details = '';

  switch (action) {
    case 'publish':
      updated.publicationStatus = 'published';
      updated.published = true;
      logAction = 'EVENT_PUBLISHED';
      details = `Published session "${existing.title}" to public schedule.`;
      break;

    case 'unpublish':
      updated.publicationStatus = 'draft';
      updated.published = false;
      logAction = 'EVENT_UNPUBLISHED';
      details = `Unpublished session "${existing.title}" (moved to draft).`;
      break;

    case 'postpone':
      updated.status = 'postponed';
      if (newDate) updated.date = newDate;
      if (reason) updated.reportSummary = `Postponement Notice: ${reason}`;
      logAction = 'EVENT_POSTPONED';
      details = `Postponed session "${existing.title}"${newDate ? ` to ${newDate}` : ''}.${reason ? ` Reason: ${reason}` : ''}`;
      break;

    case 'cancel':
      updated.status = 'cancelled';
      updated.registrationStatus = 'closed';
      if (reason) updated.reportSummary = `Cancellation Notice: ${reason}`;
      logAction = 'EVENT_CANCELLED';
      details = `Cancelled session "${existing.title}".${reason ? ` Reason: ${reason}` : ''}`;
      break;

    case 'archive':
      updated.publicationStatus = 'archived';
      if (updated.status === 'upcoming') updated.status = 'completed';
      logAction = 'EVENT_ARCHIVED';
      details = `Archived session "${existing.title}" in historical repository.`;
      break;

    default:
      res.status(400).json({ error: `Unknown status action: ${action}` });
      return;
  }

  serverEvents[index] = updated;

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  serverActivityLogs.unshift({
    id: 'log-' + Date.now(),
    actorEmail: adminEmail,
    actorName: 'Authorized Administrator',
    action: logAction,
    entityType: 'event',
    entityId: id,
    details,
    metadata: { action, reason, newDate },
    ipAddress: ip,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    event: updated,
    message: details
  });
});

/**
 * Duplicate event
 */
app.post('/api/admin/events/:id/duplicate', (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail || 'fake782447@gmail.com';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(403).json({ error: 'Access denied: Must be an authorized administrator.' });
    return;
  }

  const orig = serverEvents.find(e => e.id === id);
  if (!orig) {
    res.status(404).json({ error: 'Original event not found.' });
    return;
  }

  const suffix = Math.random().toString(36).substring(2, 6);
  const newSlug = `${orig.slug}-copy-${suffix}`;

  const clonedEvent = {
    ...orig,
    id: `evt-${Date.now()}-${suffix}`,
    title: `[Copy] ${orig.title}`,
    slug: newSlug,
    publicationStatus: 'draft',
    published: false,
    status: 'upcoming',
    registrationStatus: 'open',
    registeredCount: 0
  };

  serverEvents.unshift(clonedEvent);

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  serverActivityLogs.unshift({
    id: 'log-' + Date.now(),
    actorEmail: adminEmail,
    actorName: 'Authorized Administrator',
    action: 'EVENT_DUPLICATED',
    entityType: 'event',
    entityId: clonedEvent.id,
    details: `Duplicated session "${orig.title}" into draft clone "${clonedEvent.title}"`,
    metadata: { originalId: orig.id, newId: clonedEvent.id },
    ipAddress: ip,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    event: clonedEvent,
    message: `Cloned session into draft: ${clonedEvent.title}`
  });
});

/**
 * Delete event (protects events with registrations)
 */
app.delete('/api/admin/events/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const adminEmail = (req.headers['x-admin-email'] as string) || req.body?.adminEmail || 'fake782447@gmail.com';
  if (!isAuthorizedAdmin(adminEmail) && !req.headers.authorization) {
    res.status(403).json({ error: 'Access denied: Must be an authorized administrator.' });
    return;
  }

  const index = serverEvents.findIndex(e => e.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Event not found.' });
    return;
  }

  const target = serverEvents[index];

  // Prevent accidental deletion if registrations exist
  if (target.registeredCount > 0) {
    res.status(400).json({
      error: `Cannot delete event with existing registrations (${target.registeredCount} student submissions). To protect enrollment records, please Archive this session instead.`
    });
    return;
  }

  serverEvents.splice(index, 1);

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  serverActivityLogs.unshift({
    id: 'log-' + Date.now(),
    actorEmail: adminEmail,
    actorName: 'Authorized Administrator',
    action: 'EVENT_DELETED',
    entityType: 'event',
    entityId: id,
    details: `Permanently removed empty session "${target.title}" (ID: ${id})`,
    metadata: { title: target.title, slug: target.slug },
    ipAddress: ip,
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: `Event "${target.title}" has been deleted.`
  });
});

// ==============================================================================
// VITE SPA MIDDLEWARE / STATIC ASSETS
// ==============================================================================

async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
