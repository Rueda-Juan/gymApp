import type * as SQLite from 'expo-sqlite';
import type { BodyWeightEntry } from '../../domain/entities/BodyWeightEntry';
import type { BodyWeightRepository } from '../../domain/repositories/BodyWeightRepository';
import { DatabaseError } from '../../shared/errors';
import { fromSQLiteDate, fromSQLiteDateTime, toSQLiteDate } from '../../shared/utils/dateUtils';

interface BodyWeightRow {
  id: string;
  weight: number;
  date: string;
  notes: string | null;
  created_at: string;
}

function mapRowToEntry(row: BodyWeightRow): BodyWeightEntry {
  return {
    id: row.id,
    weight: row.weight,
    date: fromSQLiteDate(row.date),
    notes: row.notes,
    createdAt: fromSQLiteDateTime(row.created_at),
  };
}

export class SQLiteBodyWeightRepository implements BodyWeightRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getLatest(): Promise<BodyWeightEntry | null> {
    try {
      const row = await this.db.getFirstAsync<BodyWeightRow>(
        'SELECT * FROM body_weight_log ORDER BY date DESC, created_at DESC LIMIT 1',
      );
      return row ? mapRowToEntry(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener el último registro de peso', error);
    }
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<BodyWeightEntry[]> {
    try {
      const rows = await this.db.getAllAsync<BodyWeightRow>(
        'SELECT * FROM body_weight_log WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [toSQLiteDate(startDate), toSQLiteDate(endDate)],
      );
      return rows.map(mapRowToEntry);
    } catch (error) {
      throw new DatabaseError('Error al obtener historial de peso', error);
    }
  }

  async save(entry: BodyWeightEntry): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO body_weight_log (id, weight, date, notes, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.weight,
          toSQLiteDate(entry.date),
          entry.notes,
          entry.createdAt.toISOString().replace('T', ' ').replace('Z', ''), // Assuming local time or matching fromSQLiteDateTime format
        ],
      );
    } catch (error) {
      throw new DatabaseError('Error al guardar registro de peso', error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.runAsync('DELETE FROM body_weight_log WHERE id = ?', [id]);
    } catch (error) {
      throw new DatabaseError('Error al eliminar registro de peso', error);
    }
  }
}
