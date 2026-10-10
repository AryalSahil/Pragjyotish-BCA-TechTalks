import { EventItem } from '../types';

export const mockEvents: EventItem[] = [
  {
    id: 'evt-docker-cloud-2026',
    slug: 'hands-on-containerization-docker-cloud',
    title: 'Hands-on Containerization & Cloud Deployments with Docker',
    tagline: 'Master practical microservice packaging, container networking, and automated cloud workflows.',
    description: 'A comprehensive technical workshop designed specifically for BCA undergraduates to bridge the gap between classroom programming and industry deployment practices. Participants will configure Dockerfiles, multi-stage builds, and deploy web applications.',
    detailedOverview: 'Containerization is now standard across software engineering teams worldwide. In this intensive practical session organized by Pragjyotish BCA TechTalks, students will work through real-world exercises starting from simple container spins to complex multi-container compositions using Docker Compose. The workshop covers image layering, security best practices, volume persistence, and deployment onto cloud environments.',
    category: 'Cloud & DevOps',
    topics: ['Docker', 'Containers', 'DevOps', 'Microservices', 'Kubernetes'],
    date: '2026-10-24',
    time: '10:30 AM - 01:30 PM IST',
    duration: '3.0 Hours',
    venue: 'Computer Laboratory 1, Dept. of Computer Science & BCA, Pragjyotish College',
    isOnline: false,
    posterImage: '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    status: 'upcoming',
    registrationStatus: 'open',
    registrationDeadline: '2026-10-22',
    capacity: 60,
    registeredCount: 42,
    prerequisites: [
      'Basic familiarity with command-line terminal commands',
      'Fundamental understanding of client-server web architecture',
      'Personal laptop with Docker Desktop or Docker Engine pre-installed (optional assistance provided)'
    ],
    learningOutcomes: [
      'Understand kernel namespaces, cgroups, and container isolation concepts',
      'Author optimized production Dockerfiles using multi-stage builds',
      'Orchestrate local multi-tier applications using Docker Compose',
      'Deploy containerized web microservices to managed cloud targets'
    ],
    schedule: [
      {
        time: '10:30 AM - 11:15 AM',
        title: 'Introduction to Containerization & Virtualization Realities',
        description: 'Why modern engineering moved away from bare virtual machines toward container engines.',
        speakerName: 'Priyanka Baruah'
      },
      {
        time: '11:15 AM - 12:15 PM',
        title: 'Hands-on Lab: Writing Dockerfiles & Image Optimization',
        description: 'Interactive live-coding exercises in Computer Lab 1 with live mentorship.',
        speakerName: 'Priyanka Baruah'
      },
      {
        time: '12:15 PM - 12:30 PM',
        title: 'Q&A, Peer Code Review & Break',
        description: 'Discussion on troubleshooting common build failures and caching issues.'
      },
      {
        time: '12:30 PM - 01:30 PM',
        title: 'Multi-Container Compose & Cloud Deployment Pipeline',
        description: 'Connecting a web server, API, and PostgreSQL database instance seamlessly.',
        speakerName: 'Priyanka Baruah'
      }
    ],
    speakerIds: ['spk-02', 'spk-01'],
    featured: true,
    published: true,
    materialsUrl: 'https://github.com/pragjyotish-bca-techtalks/docker-workshop-2026'
  },
  {
    id: 'evt-web-security-owasp',
    slug: 'web-security-fundamentals-owasp-top-10',
    title: 'Web Application Security & OWASP Top 10 Vulnerabilities',
    tagline: 'Learn defensive coding patterns and ethical hacking methodologies in modern web apps.',
    description: 'An interactive seminar breaking down common web attack vectors including SQL Injection, Cross-Site Scripting (XSS), Broken Authentication, and API security vulnerabilities, demonstrating defensive strategies for student developers.',
    detailedOverview: 'Securing web applications is paramount as student developers build software used by real people. This seminar explores real vulnerability case studies, ethical disclosure standards, and browser security fundamentals. Attendees will witness live threat simulations in a controlled local sandbox.',
    category: 'Cybersecurity',
    topics: ['OWASP', 'Penetration Testing', 'XSS', 'SQL Injection', 'Web Security'],
    date: '2026-11-07',
    time: '11:00 AM - 01:00 PM IST',
    duration: '2.0 Hours',
    venue: 'Seminar Hall, Academic Block, Pragjyotish College, Guwahati',
    isOnline: false,
    posterImage: '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    status: 'upcoming',
    registrationStatus: 'open',
    registrationDeadline: '2026-11-05',
    capacity: 90,
    registeredCount: 58,
    prerequisites: [
      'Basic knowledge of HTML, JavaScript, and HTTP request headers',
      'Interest in defensive web engineering and security hygiene'
    ],
    learningOutcomes: [
      'Identify core OWASP Top 10 vulnerabilities in source code audits',
      'Understand modern browser security policies (CSP, CORS, SameSite Cookies)',
      'Implement secure authentication flows and sanitized database parameterization',
      'Recognize responsible disclosure ethics and legal computing frameworks'
    ],
    schedule: [
      {
        time: '11:00 AM - 11:45 AM',
        title: 'Threat Landscape & Anatomy of Modern Web Attacks',
        description: 'Breakdown of real attacks on student and academic platforms.',
        speakerName: 'Aniruddha Kashyap'
      },
      {
        time: '11:45 AM - 12:35 PM',
        title: 'Demonstration: Injection, Broken Auth & SSRF in Sandboxes',
        description: 'Step-by-step walkthrough of exploit mechanics and immediate remediation.',
        speakerName: 'Aniruddha Kashyap'
      },
      {
        time: '12:35 PM - 01:00 PM',
        title: 'Security Careers & Interactive Q&A',
        description: 'Guiding BCA students toward certifications (OSCP, CEH, CompTIA Security+).'
      }
    ],
    speakerIds: ['spk-03'],
    featured: false,
    published: true
  },
  {
    id: 'evt-fullstack-nextjs',
    slug: 'modern-fullstack-typescript-nextjs',
    title: 'Modern Full-Stack Engineering with TypeScript & Next.js',
    tagline: 'Architecting fast, type-safe full-stack web applications with server components and relational databases.',
    description: 'Explore the modern JavaScript and TypeScript ecosystem. Understand the architectural shift toward React Server Components, server actions, client boundaries, and PostgreSQL database modeling.',
    detailedOverview: 'From project bootstrapping to production deployment on modern edge platforms, this talk provides a pragmatic roadmap for BCA students preparing their capstone projects and internship portfolios.',
    category: 'Full-Stack Web',
    topics: ['Next.js', 'React 19', 'TypeScript', 'Server Components', 'PostgreSQL'],
    date: '2026-11-21',
    time: '02:00 PM - 04:30 PM IST',
    duration: '2.5 Hours',
    venue: 'Digital Conference Room & Virtual Broadcast',
    isOnline: true,
    meetingLink: 'https://meet.google.com/pbc-tech-live',
    posterImage: '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    status: 'upcoming',
    registrationStatus: 'open',
    registrationDeadline: '2026-11-19',
    capacity: 120,
    registeredCount: 89,
    prerequisites: [
      'Foundational understanding of JavaScript ES6+ syntax',
      'Basic familiarity with React components'
    ],
    learningOutcomes: [
      'Master TypeScript interfaces, generics, and strict type checking',
      'Implement React 19 Server Components and streaming SSR',
      'Design clean API route layers and schema-backed databases',
      'Build verifiable project portfolios for tech recruitment'
    ],
    schedule: [
      {
        time: '02:00 PM - 02:45 PM',
        title: 'The Evolution of the Web: From PHP/CGI to Modern Server Components',
        description: 'Architectural context and performance trade-offs.',
        speakerName: 'Rituparna Hazarika'
      },
      {
        time: '02:45 PM - 03:45 PM',
        title: 'Building a Type-Safe Application End-to-End',
        description: 'Live coding walkthrough: Schema validation, DB queries, UI updates.',
        speakerName: 'Rituparna Hazarika'
      },
      {
        time: '03:45 PM - 04:30 PM',
        title: 'Portfolio Architecture & Industry Readiness Roundtable',
        description: 'Open discussion with faculty and industry mentors.'
      }
    ],
    speakerIds: ['spk-04', 'spk-01'],
    featured: true,
    published: true
  },
  {
    id: 'evt-data-python-analytics',
    slug: 'python-data-science-practical-analytics',
    title: 'Applied Data Science with Python: From Raw Datasets to Insights',
    tagline: 'Data manipulation, statistical analysis, and visual storytelling using Python libraries.',
    description: 'A hands-on introduction to data science workflows for BCA students: loading messy datasets, cleaning missing records, performing exploratory statistical analysis, and generating insightful visual charts.',
    detailedOverview: 'Data science is one of the highest growing specializations for computer applications graduates. This workshop guides learners through Jupyter notebooks, Pandas vector operations, Seaborn visualizations, and basic regression modeling.',
    category: 'AI & Data Science',
    topics: ['Python', 'Pandas', 'Data Science', 'Data Analysis', 'Jupyter'],
    date: '2026-12-05',
    time: '10:00 AM - 01:00 PM IST',
    duration: '3.0 Hours',
    venue: 'Computer Laboratory 2, Dept. of Computer Science & BCA',
    isOnline: false,
    posterImage: '/src/assets/images/college_campus_guwahati_1791614221846.jpg',
    status: 'upcoming',
    registrationStatus: 'waitlist',
    registrationDeadline: '2026-12-01',
    capacity: 45,
    registeredCount: 45,
    prerequisites: [
      'Basic knowledge of Python syntax (loops, lists, dictionaries)',
      'Interest in data manipulation and analytical thinking'
    ],
    learningOutcomes: [
      'Clean and transform tabular data with Pandas and NumPy',
      'Perform exploratory data analysis on regional public datasets',
      'Create publication-quality charts with Matplotlib and Seaborn',
      'Interpret statistical distributions and feature correlations'
    ],
    schedule: [
      {
        time: '10:00 AM - 11:00 AM',
        title: 'Python Ecosystem for Data Science & Numerical Computing',
        description: 'Fundamentals of vectorization vs standard Python loops.',
        speakerName: 'Manash Protim Das'
      },
      {
        time: '11:00 AM - 12:15 PM',
        title: 'Lab Session: Cleaning & Analyzing Real Assam Climate & Demographics Data',
        description: 'Hands-on dataset scrubbing and trend visualization.',
        speakerName: 'Manash Protim Das'
      },
      {
        time: '12:15 PM - 01:00 PM',
        title: 'Project Ideas for Academic Semesters & Career Pathways',
        description: 'How to structure data projects on GitHub.'
      }
    ],
    speakerIds: ['spk-05'],
    featured: false,
    published: true
  },
  // Past Events
  {
    id: 'evt-linux-bash-foundations',
    slug: 'linux-systems-administration-bash-scripting',
    title: 'Linux Systems Administration & Bash Scripting for BCA Freshers',
    tagline: 'Mastering the UNIX command line, file permissions, process inspection, and automation scripts.',
    description: 'An interactive workshop covering terminal fundamentals, piped commands, system monitoring, file hierarchy standards, and writing modular Bash automation scripts for computing students.',
    detailedOverview: 'Conducted successfully in September 2026, this foundational workshop introduced first and second year BCA students to GNU/Linux operating systems. Students practiced shell piping, grep, awk, sed, SSH remote access, and process control.',
    category: 'Cloud & DevOps',
    topics: ['Linux', 'Bash Scripting', 'CLI', 'Terminal', 'UNIX'],
    date: '2026-09-19',
    time: '10:30 AM - 01:30 PM IST',
    duration: '3.0 Hours',
    venue: 'Computer Laboratory 1, Dept. of Computer Science & BCA',
    isOnline: false,
    posterImage: '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    status: 'completed',
    registrationStatus: 'closed',
    registrationDeadline: '2026-09-17',
    capacity: 55,
    registeredCount: 52,
    prerequisites: ['Enrolled student in BCA or allied computing degree'],
    learningOutcomes: [
      'Navigated POSIX file hierarchies with ease and configured user/group ACLs',
      'Wrote robust automation shell scripts with error trapping and arguments',
      'Monitored system resources using htop, ps, journalctl, and netstat'
    ],
    schedule: [
      {
        time: '10:30 AM - 11:45 AM',
        title: 'UNIX Philosophy & Terminal Power Tools',
        description: 'Everything is a file: stdin, stdout, stderr, and pipes.'
      },
      {
        time: '11:45 AM - 01:30 PM',
        title: 'Hands-on Bash Scripting & Task Automation',
        description: 'Writing scripts to automate backup procedures and log auditing.'
      }
    ],
    speakerIds: ['spk-01'],
    featured: false,
    published: true,
    materialsUrl: 'https://github.com/pragjyotish-bca-techtalks/linux-bash-foundations',
    reportSummary: 'Attended by 52 undergraduate students across BCA 1st and 3rd semesters. Feedback collected indicated 94% positive rating with students requesting follow-up sessions on Linux networking.'
  },
  {
    id: 'evt-git-github-collaboration',
    slug: 'git-and-github-collaboration-masterclass',
    title: 'Git & GitHub Collaboration Masterclass for Student Developers',
    tagline: 'Branching strategies, pull request etiquette, merge conflicts, and team workflows.',
    description: 'A hands-on workshop guiding students from their initial commit to collaborative team repositories, code review best practices, and building an open-source contributor presence.',
    detailedOverview: 'Held in August 2026 at the Pragjyotish College auditorium and computer center. Students resolved simulated merge conflicts in real time, collaborated across team forks, and configured GitHub personal portfolios.',
    category: 'Open Source',
    topics: ['Git', 'GitHub', 'Version Control', 'Open Source', 'Collaboration'],
    date: '2026-08-22',
    time: '11:00 AM - 02:00 PM IST',
    duration: '3.0 Hours',
    venue: 'Auditorium & Lab 2, Pragjyotish College',
    isOnline: false,
    posterImage: '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    status: 'completed',
    registrationStatus: 'closed',
    registrationDeadline: '2026-08-20',
    capacity: 70,
    registeredCount: 68,
    prerequisites: ['Basic text editing proficiency and laptop with Git'],
    learningOutcomes: [
      'Mastered Git three-tree architecture (Working directory, Index, Commit history)',
      'Resolved merge conflicts systematically using CLI and diff tools',
      'Opened structured Pull Requests with descriptive change summaries'
    ],
    schedule: [
      {
        time: '11:00 AM - 12:00 PM',
        title: 'Mental Models: How Git Actually Tracks Content Hash Trees',
        description: 'Demystifying snapshots, refs, and branches.'
      },
      {
        time: '12:00 PM - 02:00 PM',
        title: 'Simulation: Team Project Sprint & Merge Conflict Resolution',
        description: 'Pair programming sprint with real team repositories.'
      }
    ],
    speakerIds: ['spk-04'],
    featured: false,
    published: true,
    materialsUrl: 'https://github.com/pragjyotish-bca-techtalks/git-masterclass',
    reportSummary: '68 students successfully initialized GitHub repositories and contributed pull requests. Over 30 student GitHub portfolios were created during the workshop.'
  },
  {
    id: 'evt-rag-llm-workshop',
    slug: 'retrieval-augmented-generation-rag-systems',
    title: 'Building Retrieval-Augmented Generation (RAG) Systems with Vector DBs',
    tagline: 'Connecting large language models to domain data using vector embeddings and similarity search.',
    description: 'Advanced masterclass on embeddings, chunking strategies, vector databases, and retrieval pipelines for academic documentation.',
    detailedOverview: 'Rescheduled to accommodate university examination timetables. New revised dates will be announced shortly.',
    category: 'AI & Data Science',
    topics: ['Vector Databases', 'RAG', 'AI', 'Embeddings', 'Python'],
    date: '2026-12-19',
    time: '02:00 PM - 04:30 PM IST',
    duration: '2.5 Hours',
    venue: 'Seminar Hall, Pragjyotish College',
    isOnline: true,
    posterImage: '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    status: 'postponed',
    registrationStatus: 'closed',
    registrationDeadline: '2026-12-15',
    capacity: 80,
    registeredCount: 34,
    prerequisites: ['Basic Python programming knowledge'],
    learningOutcomes: ['Understanding text embeddings and cosine similarity search'],
    schedule: [],
    speakerIds: ['spk-05'],
    featured: false,
    published: true
  }
];
