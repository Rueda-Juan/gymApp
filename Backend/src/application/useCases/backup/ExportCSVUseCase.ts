import type { BackupRepository } from '../../../domain/repositories/BackupRepository';

export class ExportCSVUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(): Promise<string> {
    return this.backupRepo.exportCSV();
  }
}
