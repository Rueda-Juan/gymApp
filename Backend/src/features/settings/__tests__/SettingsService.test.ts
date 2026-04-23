import { SettingsService } from '../settings.service';
import type { UserPreferencesRepository } from '../user-preferences.repository';
import type { UserPreferences } from '../user-preferences.entity';
import { ValidationError } from '../../../core/errors/errors';

describe('SettingsService', () => {
  let service: SettingsService;
  let mockRepo: jest.Mocked<UserPreferencesRepository>;

  beforeEach(() => {
    mockRepo = {
      getAll: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
    } as unknown as jest.Mocked<UserPreferencesRepository>;

    service = new SettingsService(mockRepo);
  });

  describe('getPreferences', () => {
    it('retorna todas las preferencias del repositorio', async () => {
      const mockPrefs: UserPreferences = {
        weightUnit: 'kg',
        theme: 'dark',
        defaultRestSeconds: 90,
        hapticsEnabled: true,
      };
      mockRepo.getAll.mockResolvedValue(mockPrefs);

      const result = await service.getPreferences();

      expect(result).toEqual(mockPrefs);
      expect(mockRepo.getAll).toHaveBeenCalled();
    });
  });

  describe('updatePreference', () => {
    it('actualiza una preferencia válida correctamente', async () => {
      await service.updatePreference('theme', 'light');
      expect(mockRepo.set).toHaveBeenCalledWith('theme', 'light');
    });

    it('actualiza defaultRestSeconds correctamente', async () => {
      await service.updatePreference('defaultRestSeconds', 120);
      expect(mockRepo.set).toHaveBeenCalledWith('defaultRestSeconds', 120);
    });

    it('lanza ValidationError para un valor inválido (ej: segundos negativos)', async () => {
      await expect(service.updatePreference('defaultRestSeconds', -10))
        .rejects.toThrow(ValidationError);
      
      expect(mockRepo.set).not.toHaveBeenCalled();
    });

    it('lanza ValidationError para una unidad de peso inexistente', async () => {
      await expect((service.updatePreference as any)('weightUnit', 'grams'))
        .rejects.toThrow(ValidationError);
    });

    it('lanza ValidationError para un tema inexistente', async () => {
      await expect((service.updatePreference as any)('theme', 'blue'))
        .rejects.toThrow(ValidationError);
    });
  });
});
