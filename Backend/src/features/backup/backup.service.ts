import type { BackupRepository } from './backup.repository';
import { validateBackupInput } from './backup.schemas';
import { ValidationError } from '../../core/errors/errors';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class BackupService {
  constructor(private readonly backupRepo: BackupRepository) {}

  // ── Export ────────────────────────────────────────────────────────────────

  async createBackup(): Promise<string> {
    return this.backupRepo.exportData();
  }

  async exportCSV(): Promise<string> {
    return this.backupRepo.exportCSV();
  }

  // ── Import ────────────────────────────────────────────────────────────────

  async restoreBackup(jsonData: string): Promise<void> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonData);
    } catch {
      throw new ValidationError('El archivo de backup no es un JSON válido', {
        json: ['El contenido no pudo ser parseado'],
      });
    }
    validateBackupInput(parsed);
    await this.backupRepo.importData(jsonData);
  }

  // ── Reset ─────────────────────────────────────────────────────────────────

  async wipeDatabase(): Promise<void> {
    const payload = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {},
    };

    await this.backupRepo.importData(JSON.stringify(payload));
  }
}
