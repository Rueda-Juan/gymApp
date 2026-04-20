import { format, parseISO } from 'date-fns';

/**
 * Formats a JS Date into SQLite DATETIME string.
 * SQLite expects: 'YYYY-MM-DD HH:MM:SS'
 */
export function toSQLiteDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Formats a JS Date into SQLite DATE string.
 * SQLite expects: 'YYYY-MM-DD'
 */
export function toSQLiteDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parses a SQLite DATETIME string into a JS Date.
 */
export function fromSQLiteDateTime(dateStr: string): Date {
  return parseISO(dateStr.replace(' ', 'T'));
}

/**
 * Parses a SQLite DATE string into a JS Date (midnight UTC).
 */
export function fromSQLiteDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/**
 * Returns today's date as a SQLite DATE string ('YYYY-MM-DD').
 */
export function todayAsString(): string {
  return toSQLiteDate(new Date());
}
