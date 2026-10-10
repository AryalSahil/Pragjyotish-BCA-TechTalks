-- ==============================================================================
-- PRAGJYOTISH BCA TECHTALKS - DATABASE MIGRATION 005
-- Description: Expand event_type constraint to support all academic seminar types
-- ==============================================================================

ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_event_type_check;

ALTER TABLE public.events ADD CONSTRAINT events_event_type_check 
    CHECK (event_type IN (
        'seminar', 
        'workshop', 
        'guest_lecture', 
        'technical_talk', 
        'coding_event', 
        'career_session', 
        'lab_session', 
        'panel', 
        'hackathon'
    ));

-- Add index on event_type if not exists
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
