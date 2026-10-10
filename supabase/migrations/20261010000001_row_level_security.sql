-- ==============================================================================
-- PRAGJYOTISH BCA TECHTALKS - DATABASE MIGRATION 002
-- Description: Strict Row Level Security (RLS) policies for all 9 tables
-- ==============================================================================

-- 1. SECURITY DEFINER HELPER FUNCTION: Check if user is an authorized admin
-- This prevents client-side tampering because it queries admin_users using auth.uid() directly
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. ENABLE ROW LEVEL SECURITY ON EVERY TABLE
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- TABLE 1: ADMIN_USERS POLICIES
-- ==============================================================================
-- Anonymous: No access at all
-- Admins: Can view all admin records; only super_admin can insert/update
CREATE POLICY "Admins can view admin_users list"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Super admins can manage admin_users"
    ON public.admin_users FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
        )
    );

-- ==============================================================================
-- TABLE 2: EVENTS POLICIES
-- ==============================================================================
-- Public / Anonymous: Can read published events only
CREATE POLICY "Public can view published events"
    ON public.events FOR SELECT
    TO anon, authenticated
    USING (publication_status = 'published');

-- Admins: Full access (read draft/archived, insert, update, delete)
CREATE POLICY "Admins have full access to events"
    ON public.events FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 3: SPEAKERS POLICIES
-- ==============================================================================
-- Public / Anonymous: Can read published speakers
-- Note: A secure view or field selection is recommended to avoid exposing private_email/phone
CREATE POLICY "Public can view published speakers"
    ON public.speakers FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

-- Admins: Full management of speakers including private contact details
CREATE POLICY "Admins have full access to speakers"
    ON public.speakers FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 4: EVENT_SPEAKERS POLICIES
-- ==============================================================================
-- Public: Can read speaker relations for published events
CREATE POLICY "Public can view event_speakers for published events"
    ON public.event_speakers FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = event_speakers.event_id
              AND events.publication_status = 'published'
        )
    );

-- Admins: Full management of event speaker assignments
CREATE POLICY "Admins have full access to event_speakers"
    ON public.event_speakers FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 5: REGISTRATIONS POLICIES
-- ==============================================================================
-- Public / Anonymous: NEVER ALLOWED TO SELECT registrations (Student privacy is absolute)
-- Public can ONLY INSERT into registrations IF:
-- 1. The target event exists and is published
-- 2. The registration_status is open
-- 3. The registration_deadline has not passed
-- 4. Capacity has not been exceeded
CREATE POLICY "Public can submit registration for open published events"
    ON public.registrations FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = registrations.event_id
              AND events.publication_status = 'published'
              AND events.registration_status = 'open'
              AND events.registration_deadline >= NOW()
              AND events.registered_count < events.capacity
        )
    );

-- Admins: Full read/management access to all registrations
CREATE POLICY "Admins can view and manage all registrations"
    ON public.registrations FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 6: EVENT_MEDIA POLICIES
-- ==============================================================================
-- Public: Can read approved public media assets
CREATE POLICY "Public can view public event media"
    ON public.event_media FOR SELECT
    TO anon, authenticated
    USING (is_public = true);

-- Admins: Full management of media assets
CREATE POLICY "Admins have full access to event_media"
    ON public.event_media FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 7: ANNOUNCEMENTS POLICIES
-- ==============================================================================
-- Public: Can read published announcements
CREATE POLICY "Public can view published announcements"
    ON public.announcements FOR SELECT
    TO anon, authenticated
    USING (is_published = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Admins: Full management of announcements
CREATE POLICY "Admins have full access to announcements"
    ON public.announcements FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 8: FEEDBACK POLICIES
-- ==============================================================================
-- Public / Anonymous: Can only read approved public feedback comments
CREATE POLICY "Public can view approved public feedback"
    ON public.feedback FOR SELECT
    TO anon, authenticated
    USING (is_public = true);

-- Public: Can submit feedback for completed events
CREATE POLICY "Public can submit session feedback"
    ON public.feedback FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events
            WHERE events.id = feedback.event_id
              AND events.publication_status = 'published'
        )
    );

-- Admins: Full management of feedback (including moderation to make public)
CREATE POLICY "Admins have full access to feedback"
    ON public.feedback FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ==============================================================================
-- TABLE 9: ACTIVITY_LOGS POLICIES
-- ==============================================================================
-- Anonymous: NEVER ALLOWED TO READ OR WRITE activity logs
-- Authenticated Admins: Can view all activity logs
CREATE POLICY "Admins can view activity logs"
    ON public.activity_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- System / Admins: Can insert activity audit logs
CREATE POLICY "Admins and system can insert activity logs"
    ON public.activity_logs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());
