import type { BackupRepository } from '../../../domain/repositories/BackupRepository';
import { validateBackupInput } from '../../../shared/schemas/backupSchemas';
import { ValidationError } from '../../../shared/errors';

export class RestoreBackupUseCase {
  constructor(private readonly backupRepo: BackupRepository) {}

  async execute(jsonData: string): Promise<void> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonData);
    } catch {
      throw new ValidationError('El archivo de backup no es un JSON válido', { json: ['El contenido no pudo ser parseado'] });
    }
    validateBackupInput(parsed);
    await this.backupRepo.importData(jsonData);
  }
}
