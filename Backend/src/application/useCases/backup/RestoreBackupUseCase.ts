import type { BackupRepository } from '../../../domain/repositories/BackupRepository';
import { validateBackupInput } from '../../../shared/schemas/backupSchemas';

export class RestoreBackupUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(jsonData: string): Promise<void> {
    const parsed = JSON.parse(jsonData);
    validateBackupInput(parsed);
    await this.backupRepo.importData(jsonData);
  }
}
