import type { CreateBackupUseCase } from '../../application/useCases/backup/CreateBackupUseCase';
import type { RestoreBackupUseCase } from '../../application/useCases/backup/RestoreBackupUseCase';
import type { ExportCSVUseCase } from '../../application/useCases/backup/ExportCSVUseCase';

export class BackupService {
  constructor(
    private readonly _createBackup: CreateBackupUseCase,
    private readonly _restoreBackup: RestoreBackupUseCase,
    private readonly _exportCSV: ExportCSVUseCase,
  ) {}

  async createBackup() {
    return this._createBackup.execute();
  }

  async restoreBackup(jsonData: string) {
    return this._restoreBackup.execute(jsonData);
  }

  async exportCSV() {
    return this._exportCSV.execute();
  }
}
