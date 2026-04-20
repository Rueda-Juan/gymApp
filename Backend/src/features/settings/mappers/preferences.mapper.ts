import { UserPreferences } from '../user-preferences.entity';
import { UserPreferencesDTO } from '@shared';

export function toUserPreferencesDTO(entity: UserPreferences): UserPreferencesDTO {
  return {
    weightUnit: entity.weightUnit === 'lbs' ? 'lb' : entity.weightUnit,
    restTimerSeconds: entity.defaultRestSeconds,
  };
}
