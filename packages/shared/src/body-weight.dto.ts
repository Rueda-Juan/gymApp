import type { ID, ISODate } from './exercise.dto';

export interface BodyWeightDTO {
  id: ID;
  weight: number;
  date: ISODate;
}
