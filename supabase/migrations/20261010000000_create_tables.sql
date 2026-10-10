-- ==============================================================================
-- PRAGJYOTISH BCA TECHTALKS - DATABASE MIGRATION 001
-- Description: Core relational schema with strict constraints, indexes and triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. ADMIN USERS TABLE
-- Tied strictly to Supabase Auth user ID (auth.users)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'coordinator' CHECK (role IN ('super_admin', 'faculty_advisor', 'coordinator')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

CREATE TRIGGER trg_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(trim(title)) >= 5),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    detailed_overview TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Full-Stack Web', 
        'Cloud & DevOps', 
        'Cybersecurity', 
        'AI & Data Science', 
        'Open Source', 
        'Career & Industry'
    )),
    event_type TEXT NOT NULL DEFAULT 'workshop' CHECK (event_type IN ('seminar', 'workshop', 'lab_session', 'panel', 'hackathon')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL CHECK (end_time > start_time),
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    venue TEXT NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT false,
    meeting_details TEXT, -- Zoom/Google Meet link (only visible to enrolled students or admins)
    registration_deadline TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 60 CHECK (capacity > 0),
    registered_count INTEGER NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    poster_path TEXT,
    publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived')),
    event_status TEXT NOT NULL DEFAULT 'upcoming' CHECK (event_status IN ('upcoming', 'ongoing', 'completed', 'postponed', 'cancelled')),
    registration_status TEXT NOT NULL DEFAULT 'open' CHECK (registration_status IN ('open', 'closed', 'waitlist', 'invite_only')),
    prerequisites TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] DEFAULT '{}',
    topics TEXT[] DEFAULT '{}',
    materials_url TEXT,
    report_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_publication_status ON public.events(publication_status);
CREATE INDEX IF NOT EXISTS idx_events_event_status ON public.events(event_status);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. SPEAKERS TABLE
-- Note: Private email, phone, and invitation notes are strictly restricted to admin access
CREATE TABLE IF NOT EXISTS public.speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    name TEXT NOT NULL CHECK (char_length(trim(name)) >= 2),
    designation TEXT NOT NULL,
    organization TEXT NOT NULL,
    biography TEXT NOT NULL,
    academic_background TEXT,
    expertise TEXT[] NOT NULL DEFAULT '{}',
    approved_public_links JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"linkedin": "...", "github": "...", "website": "..."}
    public_photo_path TEXT,
    -- Sensitive Fields: Kept private & protected via RLS / column views
    private_email TEXT,
    private_phone TEXT,
    invitation_correspondence TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_speakers_slug ON public.speakers(slug);
CREATE INDEX IF NOT EXISTS idx_speakers_is_published ON public.speakers(is_published);
CREATE INDEX IF NOT EXISTS idx_speakers_is_featured ON public.speakers(is_featured);

CREATE TRIGGER trg_speakers_updated_at
    BEFORE UPDATE ON public.speakers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. EVENT_SPEAKERS RELATION TABLE (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.event_speakers (
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    speaker_id UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'keynote_speaker',
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (event_id, speaker_id)
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event ON public.event_speakers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker ON public.event_speakers(speaker_id);

-- 5. REGISTRATIONS TABLE
-- Enforces UNIQUE (event_id, email) constraint to prevent duplicate student registrations
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL CHECK (char_length(trim(student_name)) >= 2),
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT NOT NULL CHECK (char_length(trim(phone)) >= 10),
    institution TEXT NOT NULL,
    course TEXT NOT NULL,
    semester TEXT NOT NULL,
    roll_number TEXT,
    laptop_available TEXT NOT NULL DEFAULT 'yes' CHECK (laptop_available IN ('yes', 'no')),
    experience_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
    expectations TEXT,
    registration_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (registration_status IN ('confirmed', 'waitlisted', 'cancelled', 'attended')),
    registration_reference TEXT NOT NULL UNIQUE, -- e.g. "PBTT-2026-X8Y9Z"
    consent_accepted BOOLEAN NOT NULL DEFAULT false CHECK (consent_accepted = true),
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_event_student_email UNIQUE (event_id, email)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_reference ON public.registrations(registration_reference);

CREATE TRIGGER trg_registrations_updated_at
    BEFORE UPDATE ON public.registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to maintain event registered_count atomically
CREATE OR REPLACE FUNCTION public.handle_registration_count_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.events
        SET registered_count = registered_count + 1
        WHERE id = NEW.event_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.events
        SET registered_count = GREATEST(0, registered_count - 1)
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_maintain_registration_count
    AFTER INSERT OR DELETE ON public.registrations
    FOR EACH ROW EXECUTE FUNCTION public.handle_registration_count_change();

-- 6. EVENT MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.event_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    caption TEXT,
    media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'poster', 'slide', 'document')),
    file_path TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'seminar' CHECK (category IN ('seminar', 'workshop', 'campus', 'interactive')),
    is_public BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_media_is_public ON public.event_media(is_public);
CREATE INDEX IF NOT EXISTS idx_event_media_category ON public.event_media(category);

CREATE TRIGGER trg_event_media_updated_at
    BEFORE UPDATE ON public.event_media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_is_published ON public.announcements(is_published);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON public.announcements(priority);

CREATE TRIGGER trg_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    student_name TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false, -- Requires coordinator approval for public display
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_event_id ON public.feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_is_public ON public.feedback(is_public);

-- 9. ACTIVITY LOGS TABLE (Audit trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL, -- e.g. "EVENT_CREATED", "REGISTRATION_SUBMITTED", "SPEAKER_UPDATED"
    entity_type TEXT NOT NULL, -- "event", "registration", "speaker", "announcement"
    entity_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs(entity_type);
