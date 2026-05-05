type SQLiteValue = string | number | boolean | null;

export interface SQLiteDatabase {
  withTransactionAsync(callback: () => Promise<void>): Promise<void>;
  getAllAsync(sql: string, ...params: SQLiteValue[]): Promise<Record<string, SQLiteValue>[]>;
  getFirstAsync(sql: string, ...params: SQLiteValue[]): Promise<Record<string, SQLiteValue> | null>;
  runAsync(sql: string, ...params: SQLiteValue[]): Promise<{ changes: number; lastInsertRowId: number }>;
  execAsync(sql: string): Promise<void>;
}

export function openDatabaseSync(_name: string): SQLiteDatabase {
  return {
    async withTransactionAsync(cb) { await cb(); },
    async getAllAsync() { return []; },
    async getFirstAsync() { return null; },
    async runAsync() { return { changes: 0, lastInsertRowId: 0 }; },
    async execAsync() {},
  };
}
