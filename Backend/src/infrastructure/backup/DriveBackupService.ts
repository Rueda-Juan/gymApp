import type { BackupRepository } from '../../domain/repositories/BackupRepository';

/**
 * Google Drive Backup Service (placeholder).
 *
 * This service will handle cloud backup operations via Google Drive API.
 * Currently implemented as a stub — all methods throw NotImplementedError.
 *
 * Future implementation requires:
 * - Google Sign-In (expo-auth-session)
 * - Google Drive API v3 credentials
 * - OAuth 2.0 scopes: 'https://www.googleapis.com/auth/drive.appdata'
 *
 * Retention policy (when implemented):
 * - 1 backup actual + 1 backup anterior
 * - Formato: JSON serializado de todas las tablas
 * - Backup automático configurable (diario/semanal)
 */
export class DriveBackupService implements BackupRepository {
  /**
   * Creates a backup of the database and uploads it to Google Drive.
   * @returns JSON string of the serialized database
   */
  async exportData(): Promise<string> {
    throw new Error(
      'DriveBackupService.exportData() not implemented. ' +
      'Google Drive integration requires OAuth setup. ' +
      'Use SQLiteBackupRepository for local backups.',
    );
  }

  /**
   * Downloads a backup from Google Drive and restores it.
   * @param jsonData - JSON string to restore from
   */
  async importData(jsonData: string): Promise<void> {
    void jsonData;
    throw new Error(
      'DriveBackupService.importData() not implemented. ' +
      'Google Drive integration requires OAuth setup. ' +
      'Use SQLiteBackupRepository for local restores.',
    );
  }

  /**
   * Exports training data as CSV and uploads to Google Drive.
   * @returns CSV string of training data
   */
  async exportCSV(): Promise<string> {
    throw new Error(
      'DriveBackupService.exportCSV() not implemented. ' +
      'Google Drive integration requires OAuth setup. ' +
      'Use SQLiteBackupRepository for local CSV exports.',
    );
  }
}
