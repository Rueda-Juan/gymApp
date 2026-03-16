import type * as SQLite from 'expo-sqlite';
import type { BackupRepository } from '../../domain/repositories/BackupRepository';

export class SQLiteBackupRepository implements BackupRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async exportData(): Promise<string> {
    // Basic implementation that would query tables and serialize them
    // For simplicity, we just return a stub JSON structure
    const tables = ['exercises', 'routines', 'routine_exercises', 'workouts', 'workout_exercises', 'sets', 'exercise_stats', 'daily_stats', 'personal_records', 'user_preferences', 'body_weight_log'];
    const data: Record<string, any[]> = {};

    for (const table of tables) {
      const rows = await this.db.getAllAsync(`SELECT * FROM ${table}`);
      data[table] = rows;
    }

    const backup = {
      version: 1,
      timestamp: new Date().toISOString(),
      data,
    };

    return JSON.stringify(backup);
  }

  async importData(jsonData: string): Promise<void> {
    const backup = JSON.parse(jsonData);
    if (!backup.data || !backup.version) {
      throw new Error('Formato de backup inválido');
    }

    try {
      await this.db.execAsync('BEGIN TRANSACTION;');
      
      // In a real scenario, we'd clear tables and insert the new data,
      // handling foreign key constraints.
      
      await this.db.execAsync('COMMIT;');
    } catch (e) {
      await this.db.execAsync('ROLLBACK;');
      throw e;
    }
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
