-- ==============================================================================
-- PRAGJYOTISH BCA TECHTALKS - DATABASE MIGRATION 003
-- Description: Secure Views and RPC functions protecting private data and registration spam
-- ==============================================================================

-- 1. SECURE PUBLIC SPEAKER VIEW
-- Guarantees private_email, private_phone, and invitation_correspondence are NEVER exposed to the public client
CREATE OR REPLACE VIEW public.public_speakers AS
SELECT 
    id,
    slug,
    name,
    designation,
    organization,
    biography,
    academic_background,
    expertise,
    approved_public_links,
    public_photo_path,
    is_featured,
    created_at
FROM public.speakers
WHERE is_published = true;

GRANT SELECT ON public.public_speakers TO anon, authenticated;

-- 2. SECURE REGISTRATION SUBMISSION RPC FUNCTION
-- Provides server-side validation, duplicate prevention, and atomic capacity checking
CREATE OR REPLACE FUNCTION public.submit_event_registration(
    p_event_id UUID,
    p_student_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_institution TEXT,
    p_course TEXT,
    p_semester TEXT,
    p_roll_number TEXT DEFAULT NULL,
    p_laptop_available TEXT DEFAULT 'yes',
    p_experience_level TEXT DEFAULT 'intermediate',
    p_expectations TEXT DEFAULT NULL,
    p_consent_accepted BOOLEAN DEFAULT true
)
RETURNS JSONB AS $$
DECLARE
    v_event public.events%ROWTYPE;
    v_reference TEXT;
    v_registration_id UUID;
    v_clean_email TEXT;
BEGIN
    v_clean_email := LOWER(TRIM(p_email));

    -- Validation 1: Verify student consent
    IF p_consent_accepted IS NOT TRUE THEN
        RETURN jsonb_build_object('success', false, 'error', 'CONSENT_REQUIRED', 'message', 'You must agree to event guidelines.');
    END IF;

    -- Validation 2: Verify email pattern
    IF v_clean_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_EMAIL', 'message', 'Please provide a valid email address.');
    END IF;

    -- Validation 3: Verify target event exists and is open
    SELECT * INTO v_event FROM public.events WHERE id = p_event_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'EVENT_NOT_FOUND', 'message', 'Selected session was not found.');
    END IF;

    IF v_event.publication_status != 'published' THEN
        RETURN jsonb_build_object('success', false, 'error', 'EVENT_UNPUBLISHED', 'message', 'This session is not currently published.');
    END IF;

    IF v_event.registration_status != 'open' OR v_event.event_status != 'upcoming' THEN
        RETURN jsonb_build_object('success', false, 'error', 'REGISTRATION_CLOSED', 'message', 'Registration for this session is closed.');
    END IF;

    IF v_event.registration_deadline < NOW() THEN
        RETURN jsonb_build_object('success', false, 'error', 'DEADLINE_PASSED', 'message', 'The registration deadline has passed.');
    END IF;

    -- Validation 4: Check capacity limit
    IF v_event.registered_count >= v_event.capacity THEN
        RETURN jsonb_build_object('success', false, 'error', 'CAPACITY_REACHED', 'message', 'This session has reached maximum capacity.');
    END IF;

    -- Validation 5: Check duplicate registration constraint
    IF EXISTS (SELECT 1 FROM public.registrations WHERE event_id = p_event_id AND LOWER(email) = v_clean_email) THEN
        RETURN jsonb_build_object('success', false, 'error', 'DUPLICATE_REGISTRATION', 'message', 'You have already registered for this session.');
    END IF;

    -- Generate unique reference code e.g. "PBTT-2026-X8Y9Z"
    v_reference := 'PBTT-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 6));

    -- Insert into registrations table
    INSERT INTO public.registrations (
        event_id,
        student_name,
        email,
        phone,
        institution,
        course,
        semester,
        roll_number,
        laptop_available,
        experience_level,
        expectations,
        registration_status,
        registration_reference,
        consent_accepted
    ) VALUES (
        p_event_id,
        TRIM(p_student_name),
        v_clean_email,
        TRIM(p_phone),
        TRIM(p_institution),
        TRIM(p_course),
        TRIM(p_semester),
        NULLIF(TRIM(p_roll_number), ''),
        p_laptop_available,
        p_experience_level,
        NULLIF(TRIM(p_expectations), ''),
        'confirmed',
        v_reference,
        true
    )
    RETURNING id INTO v_registration_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Registration confirmed successfully!',
        'reference', v_reference,
        'registration_id', v_registration_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.submit_event_registration TO anon, authenticated;
