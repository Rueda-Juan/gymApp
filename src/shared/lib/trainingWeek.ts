/** Returns a 7-element boolean array (Mon→Sun) indicating which days of the current week had a workout. */
export function getWeeklyTrainingDays(history: { date: string | Date }[]): boolean[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const dayStart = new Date(monday);
    dayStart.setDate(monday.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    return history.some(w => {
      const wDate = new Date(w.date);
      return wDate >= dayStart && wDate < dayEnd;
    });
  });
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Counts consecutive weeks (including the current one) that contain at least one workout. */
export function calculateWeeklyStreak(history: { date: string | Date }[]): number {
  if (!history.length) return 0;

  const getMondayTimestamp = (date: Date): number => {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    d.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const trainedWeeks = new Set(history.map(w => getMondayTimestamp(new Date(w.date))));
  const thisWeekMonday = getMondayTimestamp(new Date());

  let streak = 0;
  for (let weekIndex = 0; trainedWeeks.has(thisWeekMonday - weekIndex * ONE_WEEK_MS); weekIndex++) {
    streak++;
  }
  return streak;
}
