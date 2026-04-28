import type * as SQLite from 'expo-sqlite';
import type { BackupRepository } from './backup.repository';
import { DatabaseError } from '@core/errors/errors';

const TABLES_IN_FK_ORDER = [
  'user_preferences',
  'body_weight_log',
  'exercises',
  'routines',
  'routine_exercises',
  'workouts',
  'workout_exercises',
  'sets',
  'exercise_stats',
  'daily_stats',
  'personal_records',
] as const;

const TABLES_DELETE_ORDER = [...TABLES_IN_FK_ORDER].reverse();

interface BackupPayload {
  version: number;
  timestamp: string;
  data: Record<string, Record<string, unknown>[]>;
}

export class SQLiteBackupRepository implements BackupRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async exportData(): Promise<string> {
    const data: Record<string, Record<string, unknown>[]> = {};

    for (const table of TABLES_IN_FK_ORDER) {
      data[table] = await this.db.getAllAsync<Record<string, unknown>>(`SELECT * FROM ${table}`);
    }

    const backup: BackupPayload = {
      version: 1,
      timestamp: new Date().toISOString(),
      data,
    };

    return JSON.stringify(backup);
  }

  async importData(jsonData: string): Promise<void> {
    let backup: BackupPayload;
    try {
      backup = JSON.parse(jsonData) as BackupPayload;
    } catch {
      throw new DatabaseError('El JSON de backup no es válido');
    }

    if (!backup.data || !backup.version) {
      throw new DatabaseError('Formato de backup inválido');
    }

    await this.db.withTransactionAsync(async () => {
      for (const table of TABLES_DELETE_ORDER) {
        await this.db.execAsync(`DELETE FROM ${table};`);
      }

      for (const table of TABLES_IN_FK_ORDER) {
        const rows = backup.data[table];
        if (!rows?.length) continue;
        const firstRow = rows[0]!;
        const columns = Object.keys(firstRow);
        const placeholders = columns.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

        for (const row of rows) {
          const values = columns.map(col => row[col] ?? null);
          await this.db.runAsync(insertSQL, values as (string | number | null)[]);
        }
      }
    });
  }

  async exportCSV(): Promise<string> {
    // Extract history of sets for CSV.
    const rows = await this.db.getAllAsync<{ date: string; exercise: string; weight: number; reps: number }>(`
      SELECT w.date, e.name as exercise, s.weight, s.reps
      FROM sets s
      JOIN workouts w ON s.workout_id = w.id
      JOIN exercises e ON s.exercise_id = e.id
      WHERE s.completed = 1 AND s.skipped = 0
      ORDER BY w.date DESC
    `);

    let csv = 'Fecha,Ejercicio,Peso,Reps\n';
    for (const row of rows) {
      csv += `${row.date},"${row.exercise}",${row.weight},${row.reps}\n`;
    }

    return csv;
  }
}
