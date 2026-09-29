import React from 'react';
import Header3PM from './Header3PM.jsx';
import BottomNav from './BottomNav.jsx';
import useHomeTheme from '../hooks/useHomeTheme.js';
import '../pages/DashboardTheme.css';
import '../pages/ToolsTheme.css';

export default function ToolExerciseLayout({ children }) {
  const [theme] = useHomeTheme();
  return <div data-theme={theme} className="dashboard tools-page min-h-screen flex flex-col pb-16 text-[var(--dash-e5d3ad)] bg-[var(--dash-0b0c0f)]">
    <Header3PM showMenu />
    <main className="flex-1"><div className="tools-content max-w-md mx-auto px-4 py-6 space-y-5">{children}</div></main>
    <BottomNav />
  </div>;
}
