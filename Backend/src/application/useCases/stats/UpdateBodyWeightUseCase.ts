import type { BodyWeightRepository } from '../../../domain/repositories/BodyWeightRepository';
import type { BodyWeightEntry } from '../../../domain/entities/BodyWeightEntry';
import { NotFoundError } from '../../../shared/errors';

export interface UpdateBodyWeightInput {
  id: string;
  weight: number;
  date: Date | string;
  notes?: string;
}

export class UpdateBodyWeightUseCase {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  async execute(params: UpdateBodyWeightInput): Promise<BodyWeightEntry> {
    const entry = await this.bodyWeightRepo.getById(params.id);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${params.id} no encontrada`);
    }

    const normalizedDate = typeof params.date === 'string'
      ? params.date
      : (params.date.toISOString().split('T')[0] ?? '');

    const updatedEntry: BodyWeightEntry = {
      id: params.id,
      weight: params.weight,
      date: normalizedDate,
      notes: params.notes ?? entry.notes,
      createdAt: entry.createdAt,
    };

    await this.bodyWeightRepo.save(updatedEntry);
    return updatedEntry;
  }
}
