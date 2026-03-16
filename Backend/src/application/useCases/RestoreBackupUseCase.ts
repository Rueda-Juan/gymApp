import type { BackupRepository } from '../../domain/repositories/BackupRepository';

export class RestoreBackupUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(jsonData: string): Promise<void> {
    await this.backupRepo.importData(jsonData);
  }
}
