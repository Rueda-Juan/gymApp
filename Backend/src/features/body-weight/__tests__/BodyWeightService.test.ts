import { BodyWeightService } from '../body-weight.service';
import type { BodyWeightRepository } from '../body-weight.repository';
import type { BodyWeight } from '../body-weight.entity';
import { ValidationError, NotFoundError } from '../../../core/errors/errors';

describe('BodyWeightService', () => {
  let service: BodyWeightService;
  let mockRepo: jest.Mocked<BodyWeightRepository>;

  beforeEach(() => {
    mockRepo = {
      save: jest.fn(),
      getByDateRange: jest.fn(),
      getById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<BodyWeightRepository>;

    service = new BodyWeightService(mockRepo);
  });

  describe('logBodyWeight', () => {
    it('crea un registro válido', async () => {
      const params = { weight: 75.5, date: new Date().toISOString(), notes: 'Test' };
      const result = await service.logBodyWeight(params);

      expect(result.weight).toBe(75.5);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('lanza error si el peso es negativo', async () => {
      const params = { weight: -5, date: new Date().toISOString(), notes: null };
      await expect(service.logBodyWeight(params)).rejects.toThrow(ValidationError);
    });
  });

  describe('getBodyWeightHistory', () => {
    it('llama al repo con el rango correcto', async () => {
      mockRepo.getByDateRange.mockResolvedValue([]);
      await service.getBodyWeightHistory('2026-01-01', '2026-01-31');
      expect(mockRepo.getByDateRange).toHaveBeenCalledWith('2026-01-01', '2026-01-31');
    });

    it('lanza error si startDate > endDate', async () => {
      await expect(service.getBodyWeightHistory('2026-02-01', '2026-01-01'))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('updateBodyWeight', () => {
    const existing: BodyWeight = { id: 'bw-1', weight: 70, date: '2026-01-01', notes: null, createdAt: new Date() };

    it('actualiza el peso correctamente', async () => {
      mockRepo.getById.mockResolvedValue(existing);
      const result = await service.updateBodyWeight({ id: 'bw-1', weight: 72, date: new Date('2026-01-02').toISOString() });

      expect(result.weight).toBe(72);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('lanza NotFoundError si no existe', async () => {
      mockRepo.getById.mockResolvedValue(null);
      await expect(service.updateBodyWeight({ id: 'bw-1', weight: 72, date: '2026-01-02' }))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteBodyWeight', () => {
    it('borra el registro si existe', async () => {
      mockRepo.getById.mockResolvedValue({ id: 'bw-1' } as any);
      await service.deleteBodyWeight('bw-1');
      expect(mockRepo.delete).toHaveBeenCalledWith('bw-1');
    });

    it('lanza NotFoundError si no existe', async () => {
      mockRepo.getById.mockResolvedValue(null);
      await expect(service.deleteBodyWeight('bw-1')).rejects.toThrow(NotFoundError);
    });
  });
});
