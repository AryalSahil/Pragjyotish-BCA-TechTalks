import { GalleryItem } from '../types';

export const mockGallery: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Keynote Session at Pragjyotish Auditorium',
    eventId: 'evt-fullstack-nextjs',
    eventTitle: 'Modern Full-Stack Engineering TechTalk',
    date: '2026-08-22',
    image: '/src/assets/images/hero_seminar_hall_1791614162583.jpg',
    caption: 'Undergraduate BCA students during the systems architecture keynote session at the college auditorium.',
    category: 'seminar'
  },
  {
    id: 'gal-02',
    title: 'Hands-on Computer Lab Coding Session',
    eventId: 'evt-linux-bash-foundations',
    eventTitle: 'Linux Systems Administration & Bash Scripting Workshop',
    date: '2026-09-19',
    image: '/src/assets/images/event_workshop_cloud_1791614175669.jpg',
    caption: 'Students practicing terminal automation and shell scripting in Computer Laboratory 1.',
    category: 'workshop'
  },
  {
    id: 'gal-03',
    title: 'Cybersecurity Threat Defense Stage Talk',
    eventId: 'evt-web-security-owasp',
    eventTitle: 'Web Application Security Fundamentals',
    date: '2026-09-19',
    image: '/src/assets/images/event_cybersecurity_1791614189620.jpg',
    caption: 'Demonstration of network traffic analysis and OWASP defensive coding principles.',
    category: 'seminar'
  },
  {
    id: 'gal-04',
    title: 'Campus Pathways & Academic Block',
    date: '2026-09-19',
    image: '/src/assets/images/college_campus_guwahati_1791614221846.jpg',
    caption: 'Pragjyotish College academic campus in Guwahati where BCA TechTalks events take place.',
    category: 'campus'
  },
  {
    id: 'gal-05',
    title: 'Faculty Advisory & Interactive Mentorship',
    date: '2026-08-22',
    image: '/src/assets/images/speaker_portrait_faculty_1791614207262.jpg',
    caption: 'Faculty coordinator Dr. Debabrata Sarma interacting with student participants post-session.',
    category: 'interactive'
  }
];
