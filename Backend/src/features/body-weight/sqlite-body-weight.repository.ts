import type * as SQLite from 'expo-sqlite';
import type { BodyWeight } from './body-weight.entity';
import type { BodyWeightRepository } from './body-weight.repository';
import { DatabaseError } from '@core/errors/errors';
import { fromSQLiteDateTime, toSQLiteDateTime } from '@core/utils/date';

interface BodyWeightRow {
  id: string;
  weight: number;
  date: string;
  notes: string | null;
  created_at: string;
}

function mapRowToEntry(row: BodyWeightRow): BodyWeight {
  return {
    id: row.id,
    weight: row.weight,
    date: row.date,
    notes: row.notes,
    createdAt: fromSQLiteDateTime(row.created_at),
  };
}

export class SQLiteBodyWeightRepository implements BodyWeightRepository {
  constructor(private readonly db: SQLite.SQLiteDatabase) {}

  async getLatest(): Promise<BodyWeight | null> {
    try {
      const row = await this.db.getFirstAsync<BodyWeightRow>(
        'SELECT * FROM body_weight_log ORDER BY date DESC, created_at DESC LIMIT 1',
      );
      return row ? mapRowToEntry(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener el último registro de peso', error);
    }
  }

  async getById(id: string): Promise<BodyWeight | null> {
    try {
      const row = await this.db.getFirstAsync<BodyWeightRow>(
        'SELECT * FROM body_weight_log WHERE id = ?',
        [id],
      );
      return row ? mapRowToEntry(row) : null;
    } catch (error) {
      throw new DatabaseError('Error al obtener registro de peso por ID', error);
    }
  }

  async getByDateRange(startDate: string, endDate: string): Promise<BodyWeight[]> {
    try {
      const rows = await this.db.getAllAsync<BodyWeightRow>(
        'SELECT * FROM body_weight_log WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate],
      );
      return rows.map(mapRowToEntry);
    } catch (error) {
      throw new DatabaseError('Error al obtener historial de peso', error);
    }
  }

  async save(entry: BodyWeight): Promise<void> {
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO body_weight_log (id, weight, date, notes, created_at)
         VALUES (?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.weight,
          entry.date,
          entry.notes,
          toSQLiteDateTime(entry.createdAt),
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
