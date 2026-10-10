/**
 * Pragjyotish BCA TechTalks
 * Student-focused technology seminar and workshop initiative
 * Dept. of Computer Science & BCA, Pragjyotish College, Guwahati
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { TechTalksProvider } from './context/TechTalksContext';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  return (
    <TechTalksProvider>
      <BrowserRouter>
        <AppRouter />
        <Analytics />
      </BrowserRouter>
    </TechTalksProvider>
  );
}

