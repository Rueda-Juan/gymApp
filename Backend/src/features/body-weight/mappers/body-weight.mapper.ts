import { BodyWeight } from '../body-weight.entity';
import { BodyWeightDTO } from '@shared';

export function toBodyWeightDTO(entity: BodyWeight): BodyWeightDTO {
  return {
    id: entity.id,
    weight: entity.weight,
    date:
      typeof entity.date === 'string'
        ? entity.date
        : (entity.date && typeof entity.date === 'object' && typeof (entity.date as Date).toISOString === 'function'
            ? (entity.date as Date).toISOString()
            : String(entity.date)),
  };
}
