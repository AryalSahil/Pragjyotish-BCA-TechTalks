import { Announcement } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Registration Open: Hands-on Docker Workshop (Lab 1)',
    content: 'Seats are strictly capped at 60 for the hands-on lab environment. First come, first served for enrolled students.',
    date: '2026-10-08',
    priority: 'high',
    published: true,
  },
  {
    id: 'ann-02',
    title: 'Code Materials Released: Linux & Bash Foundations Workshop',
    content: 'Workshop slide decks, cheat sheets, and script exercises have been uploaded to the initiative repository for student reference.',
    date: '2026-09-21',
    priority: 'medium',
    published: true,
  },
  {
    id: 'ann-03',
    title: 'Call for Student Lightning Talks',
    content: 'BCA 3rd and 5th-semester students interested in presenting a 10-minute lightning talk on their semester project can submit proposals to the advisory committee.',
    date: '2026-09-10',
    priority: 'low',
    published: true,
  }
];
