import type { BackupRepository } from '../../../domain/repositories/BackupRepository';

export class WipeDatabaseUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(): Promise<void> {
    const payload = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {},
    };

    await this.backupRepo.importData(JSON.stringify(payload));
  }
}
