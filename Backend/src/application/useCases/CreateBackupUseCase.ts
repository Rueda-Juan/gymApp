import type { BackupRepository } from '../../domain/repositories/BackupRepository';

export class CreateBackupUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(): Promise<string> {
    return this.backupRepo.exportData();
  }
}
