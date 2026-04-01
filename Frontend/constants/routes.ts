export const ROUTES = {
  TABS_HOME: '/(tabs)/' as const,
  TABS: '/(tabs)' as const,
  ROUTINES: '/routines' as const,
  ROUTINE_CREATE: '/routine/create' as const,
  EXERCISE_BROWSER: '/(workouts)/exercise-browser' as const,
  EXERCISE_BROWSER_ROUTINE: '/(workouts)/exercise-browser?target=routine' as const,
  REST_TIMER: '/(workouts)/rest-timer' as const,
  SETTINGS_PROFILE: '/settings/profile' as const,
  SETTINGS_NOTIFICATIONS: '/settings/notifications' as const,
  SETTINGS_PRIVACY: '/settings/privacy' as const,
  STATS_WEIGHT: '/stats/weight' as const,
  HISTORY: '/history' as const,
} as const;
