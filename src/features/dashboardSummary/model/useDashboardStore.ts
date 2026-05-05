import { useState } from 'react';

export function useDashboardStore() {
  // Example state
  const [user, setUser] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [routinesPreview, setRoutinesPreview] = useState([]);
  // Add actions and logic as needed
  return { user, setUser, activeWorkout, setActiveWorkout, streakData, setStreakData, routinesPreview, setRoutinesPreview };
}

