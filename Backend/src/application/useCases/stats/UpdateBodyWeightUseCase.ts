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
    // Get the entry to verify it exists
    const entries = await this.bodyWeightRepo.getByDateRange(
      new Date('2000-01-01'),
      new Date('2099-12-31'),
    );
    const entry = entries.find((e) => e.id === params.id);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${params.id} no encontrada`);
    }

    const dateStr = typeof params.date === 'string' ? new Date(params.date) : params.date;

    const updatedEntry: BodyWeightEntry = {
      id: params.id,
      weight: params.weight,
      date: dateStr.toISOString().split('T')[0],
      notes: params.notes ?? entry.notes,
      createdAt: entry.createdAt,
    };

    await this.bodyWeightRepo.save(updatedEntry);
    return updatedEntry;
  }
}
