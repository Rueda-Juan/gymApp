import { BackupService } from '../backup.service';
import type { BackupRepository } from '../backup.repository';
import { ValidationError } from '@core/errors/errors';

const VALID_BACKUP = {
  version: 1,
  timestamp: '2026-03-24T18:00:00.000Z',
  data: {
    exercises: [{ id: 'ex-1', name: 'Bench Press' }],
    routines: [],
    sets: [],
  },
};

describe('BackupService - RestoreBackup', () => {
  let service: BackupService;
  let mockBackupRepo: jest.Mocked<BackupRepository>;

  beforeEach(() => {
    mockBackupRepo = {
      importData: jest.fn(),
    } as unknown as jest.Mocked<BackupRepository>;

    service = new BackupService(mockBackupRepo);
  });

  // ─── Happy Path ──────────────────────────────────────────────

  describe('happy path', () => {
    it('restaura un backup con formato válido', async () => {
      await service.restoreBackup(JSON.stringify(VALID_BACKUP));

      expect(mockBackupRepo.importData).toHaveBeenCalledTimes(1);
    });

    it('pasa el JSON string original al repositorio (no el objeto parseado)', async () => {
      // Previene: pasar el objeto parseado pierde precision numérica o formato
      const jsonStr = JSON.stringify(VALID_BACKUP);
      await service.restoreBackup(jsonStr);

      expect(mockBackupRepo.importData).toHaveBeenCalledWith(jsonStr);
    });

    it('acepta data con múltiples tablas pobladas', async () => {
      const richBackup = {
        ...VALID_BACKUP,
        data: {
          exercises: [{ id: 'ex-1', name: 'Bench' }],
          routines: [{ id: 'r-1', name: 'Push Day' }],
          sets: [{ id: 's-1', weight: 100 }],
          workouts: [{ id: 'w-1', date: '2026-01-01' }],
        },
      };

      await service.restoreBackup(JSON.stringify(richBackup));

      expect(mockBackupRepo.importData).toHaveBeenCalledTimes(1);
    });
  });

  // ─── JSON Malformado ─────────────────────────────────────────

  describe('JSON malformado', () => {
    it('rechaza string no parseable como JSON', async () => {
      await expect(service.restoreBackup('not-valid-json{')).rejects.toThrow();
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });

    it('rechaza string vacío', async () => {
      // Previene: JSON.parse('') lanza SyntaxError no capturado
      await expect(service.restoreBackup('')).rejects.toThrow();
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });

    it('rechaza JSON truncado', async () => {
      await expect(service.restoreBackup('{"version": 1, ')).rejects.toThrow();
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });
  });

  // ─── Campos Requeridos ───────────────────────────────────────

  describe('campos requeridos', () => {
    it('rechaza backup sin campo "version"', async () => {
      const noVersion = { timestamp: '2026-03-24T18:00:00.000Z', data: {} };

      await expect(service.restoreBackup(JSON.stringify(noVersion))).rejects.toThrow(ValidationError);
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });

    it('rechaza backup sin campo "data"', async () => {
      const noData = { version: 1, timestamp: '2026-03-24T18:00:00.000Z' };

      await expect(service.restoreBackup(JSON.stringify(noData))).rejects.toThrow(ValidationError);
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });

    it('rechaza backup sin campo "timestamp"', async () => {
      const noTimestamp = { version: 1, data: {} };

      await expect(service.restoreBackup(JSON.stringify(noTimestamp))).rejects.toThrow(ValidationError);
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });
  });

  // ─── Wrong Data Types ────────────────────────────────────────

  describe('tipos de datos incorrectos', () => {
    it('rechaza version como string', async () => {
      const badVersion = { ...VALID_BACKUP, version: 'abc' };

      await expect(service.restoreBackup(JSON.stringify(badVersion))).rejects.toThrow(ValidationError);
      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });

    it('rechaza version como boolean', async () => {
      const boolVersion = { ...VALID_BACKUP, version: true };

      await expect(service.restoreBackup(JSON.stringify(boolVersion))).rejects.toThrow(ValidationError);
    });

    it('rechaza version como null', async () => {
      const nullVersion = { ...VALID_BACKUP, version: null };

      await expect(service.restoreBackup(JSON.stringify(nullVersion))).rejects.toThrow(ValidationError);
    });

    it('rechaza timestamp inválido (no ISO 8601)', async () => {
      // Previene: timestamp "ayer" pasa y corrompe comparaciones de fecha
      const badTimestamp = { ...VALID_BACKUP, timestamp: 'ayer por la tarde' };

      await expect(service.restoreBackup(JSON.stringify(badTimestamp))).rejects.toThrow(ValidationError);
    });

    it('rechaza data como array en vez de record', async () => {
      const arrayData = { ...VALID_BACKUP, data: [1, 2, 3] };

      await expect(service.restoreBackup(JSON.stringify(arrayData))).rejects.toThrow(ValidationError);
    });

    it('rechaza data como string', async () => {
      const stringData = { ...VALID_BACKUP, data: 'not-an-object' };

      await expect(service.restoreBackup(JSON.stringify(stringData))).rejects.toThrow(ValidationError);
    });
  });

  // ─── Invalid Inputs ──────────────────────────────────────────

  describe('invalid inputs extremos', () => {
    it('rechaza JSON con solo un primitivo (número)', async () => {
      await expect(service.restoreBackup('42')).rejects.toThrow(ValidationError);
    });

    it('rechaza JSON con solo null', async () => {
      await expect(service.restoreBackup('null')).rejects.toThrow(ValidationError);
    });

    it('rechaza JSON con solo un array', async () => {
      await expect(service.restoreBackup('[]')).rejects.toThrow(ValidationError);
    });

    it('rechaza JSON con solo un string', async () => {
      await expect(service.restoreBackup('"hello"')).rejects.toThrow(ValidationError);
    });

    it('rechaza objeto vacío {}', async () => {
      await expect(service.restoreBackup('{}')).rejects.toThrow(ValidationError);
    });
  });

  // ─── Async Failures ──────────────────────────────────────────

  describe('async failures', () => {
    it('propaga error si importData falla (disco lleno, permisos)', async () => {
      mockBackupRepo.importData.mockRejectedValue(new Error('SQLITE_FULL'));

      await expect(service.restoreBackup(JSON.stringify(VALID_BACKUP))).rejects.toThrow('SQLITE_FULL');
    });

    it('no llama a importData si la validación falla', async () => {
      // Previene: importar datos corruptos que pasaron parsing pero no validación
      await expect(service.restoreBackup(JSON.stringify({ version: 'bad' }))).rejects.toThrow();

      expect(mockBackupRepo.importData).not.toHaveBeenCalled();
    });
  });

  // ─── Regression ──────────────────────────────────────────────

  describe('regresión', () => {
    it('data con tablas vacías es válido', async () => {
      // Regresión: backup inicial sin datos debería poder restaurarse
      const emptyData = { ...VALID_BACKUP, data: { exercises: [], routines: [] } };

      await service.restoreBackup(JSON.stringify(emptyData));

      expect(mockBackupRepo.importData).toHaveBeenCalledTimes(1);
    });

    it('acepta version como float (1.5 es un número válido para Zod)', async () => {
      const floatVersion = { ...VALID_BACKUP, version: 1.5 };

      await service.restoreBackup(JSON.stringify(floatVersion));

      expect(mockBackupRepo.importData).toHaveBeenCalledTimes(1);
    });
  });
});
