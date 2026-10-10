-- ==============================================================================
-- PRAGJYOTISH BCA TECHTALKS - DATABASE MIGRATION 004
-- Description: Seed initial production-ready records for BCA TechTalks
-- ==============================================================================

-- 1. SEED SPEAKERS
INSERT INTO public.speakers (
    id, slug, name, designation, organization, biography, academic_background, expertise, approved_public_links, public_photo_path, private_email, private_phone, is_featured, is_published
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'dr-debabrata-sarma',
    'Dr. Debabrata Sarma',
    'Associate Professor & Faculty Advisor',
    'Department of Computer Science & BCA, Guwahati',
    'Academic researcher specializing in distributed computing algorithms, network security protocols, and curriculum development for computer applications with over 16 years of academic mentoring.',
    'Ph.D. in Computer Science & Engineering (Gauhati University), M.Tech in Information Technology.',
    ARRAY['Distributed Systems', 'Computer Networks', 'Algorithm Analysis', 'Academic Mentorship'],
    '{"linkedin": "https://linkedin.com", "website": "https://pragjyotishcollege.ac.in"}'::jsonb,
    '/src/assets/images/speaker_portrait_faculty_1791614207262.jpg',
    'debabrata.cs@pragjyotishcollege.ac.in',
    '+91-98640-11223',
    true,
    true
),
(
    '00000000-0000-0000-0000-000000000002',
    'priyanka-baruah',
    'Priyanka Baruah',
    'Principal Cloud Architect',
    'Northeast Tech Systems & CloudWorks',
    'Senior DevOps engineer specializing in Kubernetes clusters, enterprise cloud migrations, and scalable microservices architectures across AWS and Google Cloud environments.',
    'B.Tech in Computer Engineering. Certified Kubernetes Administrator (CKA), AWS Certified Solutions Architect - Professional.',
    ARRAY['AWS Solutions', 'Kubernetes', 'CI/CD Pipelines', 'Docker Containerization'],
    '{"linkedin": "https://linkedin.com", "github": "https://github.com"}'::jsonb,
    '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    'priyanka.baruah@cloudworks.in',
    '+91-97061-44556',
    true,
    true
),
(
    '00000000-0000-0000-0000-000000000003',
    'aniruddha-kashyap',
    'Aniruddha Kashyap',
    'Information Security Lead',
    'CyberAssam Infosec Labs',
    'Certified ethical hacker and defensive security researcher actively working on threat hunting, OWASP security benchmarks, web application penetration testing, and regional cyber awareness.',
    'BCA Alumni followed by M.Sc in Cyber Security & Digital Forensics. CISSP, CEH.',
    ARRAY['Penetration Testing', 'OWASP Top 10', 'SOC Operations', 'Network Forensics'],
    '{"linkedin": "https://linkedin.com", "github": "https://github.com"}'::jsonb,
    '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    'aniruddha@cyberassam.org',
    '+91-94350-77889',
    true,
    true
),
(
    '00000000-0000-0000-0000-000000000004',
    'rituparna-hazarika',
    'Rituparna Hazarika',
    'Lead Full-Stack Engineer',
    'Brahmaputra Digital Solutions',
    'Full-stack software engineer focusing on high-performance web applications, TypeScript ecosystems, modern React patterns, and RESTful/GraphQL API engineering for high-traffic platforms.',
    'BCA Gold Medalist. Active open-source maintainer across TypeScript and React tooling.',
    ARRAY['TypeScript & Next.js', 'PostgreSQL & ORM', 'REST API Architecture', 'State Management'],
    '{"linkedin": "https://linkedin.com", "github": "https://github.com", "website": "https://github.com"}'::jsonb,
    '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    'rituparna@brahmaputra.tech',
    '+91-88765-99001',
    false,
    true
),
(
    '00000000-0000-0000-0000-000000000005',
    'manash-protim-das',
    'Manash Protim Das',
    'Data Science Specialist & Consultant',
    'Northeast AI Research Collective',
    'Focuses on applied machine learning pipelines, python data analytics, natural language processing for low-resource languages, and open data visualization tools for academic computing.',
    'MCA in Computational Statistics and Data Engineering.',
    ARRAY['Python for Data Science', 'Applied Machine Learning', 'Pandas & NumPy', 'SQL Analytics'],
    '{"linkedin": "https://linkedin.com"}'::jsonb,
    '/src/assets/images/college_campus_guwahati_1791614221846.jpg',
    'manash@neai.in',
    '+91-98540-33445',
    false,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED EVENTS
INSERT INTO public.events (
    id, title, slug, summary, description, detailed_overview, category, event_type, start_time, end_time, timezone, venue, is_online, registration_deadline, capacity, registered_count, poster_path, publication_status, event_status, registration_status, prerequisites, learning_outcomes, topics, materials_url
) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Hands-on Containerization & Cloud Deployments with Docker',
    'hands-on-containerization-docker-cloud',
    'Master practical microservice packaging, container networking, and automated cloud workflows.',
    'A comprehensive technical workshop designed specifically for BCA undergraduates to bridge the gap between classroom programming and industry deployment practices. Participants will configure Dockerfiles, multi-stage builds, and deploy web applications.',
    'Containerization is now standard across software engineering teams worldwide. In this intensive practical session organized by Pragjyotish BCA TechTalks, students will work through real-world exercises starting from simple container spins to complex multi-container compositions using Docker Compose.',
    'Cloud & DevOps',
    'workshop',
    '2026-10-24 10:30:00+05:30',
    '2026-10-24 13:30:00+05:30',
    'Asia/Kolkata',
    'Computer Laboratory 1, Dept. of Computer Science & BCA, Pragjyotish College',
    false,
    '2026-10-22 23:59:59+05:30',
    60,
    42,
    '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    'published',
    'upcoming',
    'open',
    ARRAY['Basic familiarity with command-line terminal commands', 'Fundamental understanding of client-server web architecture'],
    ARRAY['Understand kernel namespaces, cgroups, and container isolation', 'Author optimized production Dockerfiles', 'Orchestrate multi-tier apps with Compose'],
    ARRAY['Docker', 'Containers', 'DevOps', 'Microservices', 'Kubernetes'],
    'https://github.com/pragjyotish-bca-techtalks/docker-workshop-2026'
),
(
    '10000000-0000-0000-0000-000000000002',
    'Web Application Security & OWASP Top 10 Vulnerabilities',
    'web-security-fundamentals-owasp-top-10',
    'Learn defensive coding patterns and ethical hacking methodologies in modern web apps.',
    'An interactive seminar breaking down common web attack vectors including SQL Injection, Cross-Site Scripting (XSS), Broken Authentication, and API security vulnerabilities, demonstrating defensive strategies for student developers.',
    'Securing web applications is paramount as student developers build software used by real people. This seminar explores real vulnerability case studies, ethical disclosure standards, and browser security fundamentals.',
    'Cybersecurity',
    'seminar',
    '2026-11-07 11:00:00+05:30',
    '2026-11-07 13:00:00+05:30',
    'Asia/Kolkata',
    'Seminar Hall, Academic Block, Pragjyotish College, Guwahati',
    false,
    '2026-11-05 23:59:59+05:30',
    90,
    58,
    '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    'published',
    'upcoming',
    'open',
    ARRAY['Basic knowledge of HTML, JavaScript, and HTTP request headers', 'Interest in defensive web engineering'],
    ARRAY['Identify core OWASP Top 10 vulnerabilities in code audits', 'Understand browser security policies (CSP, CORS)', 'Implement secure authentication flows'],
    ARRAY['OWASP', 'Penetration Testing', 'XSS', 'SQL Injection', 'Web Security'],
    NULL
),
(
    '10000000-0000-0000-0000-000000000003',
    'Modern Full-Stack Engineering with TypeScript & Next.js',
    'modern-fullstack-typescript-nextjs',
    'Architecting fast, type-safe full-stack web applications with server components and relational databases.',
    'Explore the modern JavaScript and TypeScript ecosystem. Understand the architectural shift toward React Server Components, server actions, client boundaries, and PostgreSQL database modeling.',
    'From project bootstrapping to production deployment on modern edge platforms, this talk provides a pragmatic roadmap for BCA students preparing their capstone projects and internship portfolios.',
    'Full-Stack Web',
    'workshop',
    '2026-11-21 14:00:00+05:30',
    '2026-11-21 16:30:00+05:30',
    'Asia/Kolkata',
    'Digital Conference Room & Virtual Broadcast',
    true,
    '2026-11-19 23:59:59+05:30',
    120,
    89,
    '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    'published',
    'upcoming',
    'open',
    ARRAY['Foundational understanding of JavaScript ES6+ syntax', 'Basic familiarity with React components'],
    ARRAY['Master TypeScript interfaces and strict checking', 'Implement Server Components and streaming SSR', 'Design clean API route layers with PostgreSQL'],
    ARRAY['Next.js', 'React 19', 'TypeScript', 'Server Components', 'PostgreSQL'],
    NULL
)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED EVENT_SPEAKERS
INSERT INTO public.event_speakers (event_id, speaker_id, role, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Keynote Workshop Instructor', 1),
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Faculty Advisor', 2),
('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Security Lead', 1),
('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Lead Full-Stack Architect', 1)
ON CONFLICT (event_id, speaker_id) DO NOTHING;

-- 4. SEED PUBLIC MEDIA
INSERT INTO public.event_media (id, title, caption, media_type, file_path, category, is_public) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    'Keynote Session at Pragjyotish Auditorium',
    'Undergraduate BCA students during the systems architecture keynote session at the college auditorium.',
    'photo',
    '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    'seminar',
    true
),
(
    '20000000-0000-0000-0000-000000000002',
    'Hands-on Computer Lab Coding Session',
    'Students practicing terminal automation and shell scripting in Computer Laboratory 1.',
    'photo',
    '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    'workshop',
    true
),
(
    '20000000-0000-0000-0000-000000000003',
    'Cybersecurity Threat Defense Stage Talk',
    'Demonstration of network traffic analysis and OWASP defensive coding principles.',
    'photo',
    '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    'seminar',
    true
),
(
    '20000000-0000-0000-0000-000000000004',
    'Campus Pathways & Academic Block',
    'Pragjyotish College academic campus in Guwahati where BCA TechTalks events take place.',
    'photo',
    '/src/assets/images/college_campus_guwahati_1791614221846.jpg',
    'campus',
    true
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED ANNOUNCEMENTS
INSERT INTO public.announcements (id, title, content, priority, is_published) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    'Registration Open: Hands-on Docker Workshop (Lab 1)',
    'Seats are strictly capped at 60 for the hands-on lab environment. First come, first served for enrolled students.',
    'high',
    true
),
(
    '30000000-0000-0000-0000-000000000002',
    'Code Materials Released: Linux & Bash Foundations Workshop',
    'Workshop slide decks, cheat sheets, and script exercises have been uploaded to the initiative repository for student reference.',
    'medium',
    true
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 6. ADMINISTRATOR ASSIGNMENT HELPER (fake782447@gmail.com)
-- Once the user is created via Supabase Auth (or Supabase CLI):
-- Email: fake782447@gmail.com
-- Password: fake1234&
-- The record in public.admin_users grants administrative dashboard access:
-- ==============================================================================
-- INSERT INTO public.admin_users (user_id, email, full_name, role, is_active)
-- VALUES (
--     (SELECT id FROM auth.users WHERE email = 'fake782447@gmail.com' LIMIT 1),
--     'fake782447@gmail.com',
--     'System Administrator',
--     'super_admin',
--     true
-- )
-- ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, is_active = true;

