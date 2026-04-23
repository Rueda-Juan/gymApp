import { BackupService } from '../backup.service';
import type { BackupRepository } from '../backup.repository';

describe('BackupService', () => {
  let service: BackupService;
  let mockRepo: jest.Mocked<BackupRepository>;

  beforeEach(() => {
    mockRepo = {
      exportData: jest.fn(),
      exportCSV: jest.fn(),
      importData: jest.fn(),
    } as unknown as jest.Mocked<BackupRepository>;

    service = new BackupService(mockRepo);
  });

  describe('createBackup', () => {
    it('llama al repositorio para exportar datos', async () => {
      mockRepo.exportData.mockResolvedValue('{"data":{}}');
      const result = await service.createBackup();
      expect(result).toBe('{"data":{}}');
      expect(mockRepo.exportData).toHaveBeenCalled();
    });
  });

  describe('exportCSV', () => {
    it('llama al repositorio para exportar CSV', async () => {
      mockRepo.exportCSV.mockResolvedValue('col1,col2');
      const result = await service.exportCSV();
      expect(result).toBe('col1,col2');
      expect(mockRepo.exportCSV).toHaveBeenCalled();
    });
  });

  describe('wipeDatabase', () => {
    it('llama a importData con un payload vacío para limpiar la base de datos', async () => {
      await service.wipeDatabase();
      
      expect(mockRepo.importData).toHaveBeenCalledWith(
        expect.stringContaining('"data":{}')
      );
      expect(mockRepo.importData).toHaveBeenCalledWith(
        expect.stringContaining('"version":1')
      );
    });
  });
});
