/**
 * UserPreferences entity — represents global app configuration for the user.
 * Maps to the `user_preferences` table in SQLite.
 */
export interface UserPreferences {
  weightUnit: 'kg' | 'lbs';
  theme: 'light' | 'dark' | 'system';
  /** Global default rest time in seconds between sets */
  defaultRestSeconds: number;
  /** Whether tactile feedback is enabled for the app */
  hapticsEnabled: boolean;
}
