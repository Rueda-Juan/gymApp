import { toSQLiteDateTime, toSQLiteDate, fromSQLiteDateTime, fromSQLiteDate, todayAsString } from '../date';
import { generateId } from '../generate-id';
import { safeJsonParse } from '../safe-json';

describe('Core Utilities', () => {
  describe('date utils', () => {
    const fixedDate = new Date('2026-03-24T18:30:00.000Z');

    it('toSQLiteDateTime formats correctly', () => {
      // note: format depends on local time if timezone is not handled, but here we expect YYYY-MM-DD HH:mm:ss
      const result = toSQLiteDateTime(fixedDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('toSQLiteDate formats correctly', () => {
      const result = toSQLiteDate(fixedDate);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('fromSQLiteDateTime parses correctly', () => {
      const sqliteStr = '2026-03-24 18:30:00';
      const result = fromSQLiteDateTime(sqliteStr);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getDate()).toBe(24);
    });

    it('fromSQLiteDate parses correctly', () => {
      const sqliteStr = '2026-03-24';
      const result = fromSQLiteDate(sqliteStr);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(24);
    });

    it('todayAsString returns valid format', () => {
      const result = todayAsString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('generate-id', () => {
    it('generates a valid UUID v4 (mocked)', () => {
      const id = generateId();
      expect(id).toMatch(/^mock-uuid-/);
    });

    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('safe-json', () => {
    it('parses valid JSON', () => {
      const result = safeJsonParse('{"a": 1}', { a: 0 });
      expect(result.a).toBe(1);
    });

    it('returns fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid', { a: 0 });
      expect(result.a).toBe(0);
    });

    it('returns fallback for null/empty input', () => {
      expect(safeJsonParse(null, { a: 0 })).toEqual({ a: 0 });
      expect(safeJsonParse('', { a: 0 })).toEqual({ a: 0 });
    });
  });
});
