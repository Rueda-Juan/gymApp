import { RestoreBackupUseCase } from '../backup/RestoreBackupUseCase';
import type { BackupRepository } from '../../../domain/repositories/BackupRepository';
import { ValidationError } from '../../../shared/errors';

describe('RestoreBackupUseCase', () => {
  let useCase: RestoreBackupUseCase;
  let mockBackupRepo: jest.Mocked<BackupRepository>;

  beforeEach(() => {
    mockBackupRepo = {
      importData: jest.fn(),
    } as unknown as jest.Mocked<BackupRepository>;

    useCase = new RestoreBackupUseCase(mockBackupRepo);
  });

  const validBackup = {
    version: 1,
    timestamp: '2026-03-24T18:00:00.000Z',
    data: {
      exercises: [{ id: 'ex-1', name: 'Bench Press' }],
      routines: [],
      sets: [],
    },
  };

  it('debería restaurar un backup con formato válido', async () => {
    await useCase.execute(JSON.stringify(validBackup));

    expect(mockBackupRepo.importData).toHaveBeenCalledTimes(1);
  });

  it('debería rechazar JSON malformado (no parseable)', async () => {
    await expect(useCase.execute('not-valid-json{')).rejects.toThrow(SyntaxError);
    expect(mockBackupRepo.importData).not.toHaveBeenCalled();
  });

  it('debería rechazar un backup sin campo "version"', async () => {
    const noVersion = { timestamp: '2026-03-24T18:00:00.000Z', data: {} };

    await expect(useCase.execute(JSON.stringify(noVersion))).rejects.toThrow(ValidationError);
    expect(mockBackupRepo.importData).not.toHaveBeenCalled();
  });

  it('debería rechazar un backup sin campo "data"', async () => {
    const noData = { version: 1, timestamp: '2026-03-24T18:00:00.000Z' };

    await expect(useCase.execute(JSON.stringify(noData))).rejects.toThrow(ValidationError);
    expect(mockBackupRepo.importData).not.toHaveBeenCalled();
  });

  it('debería rechazar un backup sin campo "timestamp"', async () => {
    const noTimestamp = { version: 1, data: {} };

    await expect(useCase.execute(JSON.stringify(noTimestamp))).rejects.toThrow(ValidationError);
    expect(mockBackupRepo.importData).not.toHaveBeenCalled();
  });

  it('debería rechazar si "version" no es un número', async () => {
    const badVersion = { ...validBackup, version: 'abc' };

    await expect(useCase.execute(JSON.stringify(badVersion))).rejects.toThrow(ValidationError);
    expect(mockBackupRepo.importData).not.toHaveBeenCalled();
  });

  it('debería pasar el JSON original al repositorio (no el objeto parseado)', async () => {
    const jsonStr = JSON.stringify(validBackup);
    await useCase.execute(jsonStr);

    expect(mockBackupRepo.importData).toHaveBeenCalledWith(jsonStr);
  });
});
