import { format, startOfWeek, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

/** Groups an array of workouts into labelled sections (Esta semana / Semana pasada / Month YYYY). */
export function groupWorkoutsByPeriod<T extends { date: string | Date }>(
  workouts: T[],
): { title: string; data: T[] }[] {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const groups = new Map<string, T[]>();

  workouts.forEach(w => {
    const date = new Date(w.date);
    let key: string;

    if (date >= thisWeekStart) {
      key = 'Esta semana';
    } else if (date >= lastWeekStart) {
      key = 'Semana pasada';
    } else {
      const monthYear = format(date, 'MMMM yyyy', { locale: es });
      key = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    }

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(w);
  });

  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}
