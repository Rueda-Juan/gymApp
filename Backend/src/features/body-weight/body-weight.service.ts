import type { BodyWeightRepository } from './body-weight.repository';
import type { BodyWeight } from './body-weight.entity';
import { NotFoundError, ValidationError } from '../../core/errors/errors';
import { generateId } from '../../core/utils/generate-id';
import { validateBodyWeightInput } from './body-weight.schemas';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UpdateBodyWeightInput {
  id: string;
  weight: number;
  date: Date | string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class BodyWeightService {
  constructor(private readonly bodyWeightRepo: BodyWeightRepository) {}

  // ── Create ────────────────────────────────────────────────────────────────

  async logBodyWeight(params: Omit<BodyWeight, 'id' | 'createdAt'>): Promise<BodyWeight> {
    validateBodyWeightInput(params);

    const entry: BodyWeight = {
      ...params,
      id: generateId(),
      createdAt: new Date(),
    };

    await this.bodyWeightRepo.save(entry);
    return entry;
  }

  // ── Read ──────────────────────────────────────────────────────────────────

  async getBodyWeightHistory(startDate: string, endDate: string): Promise<BodyWeight[]> {
    if (new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('La fecha de inicio no puede ser posterior a la fecha de fin', {
        date: ['Rango de fechas inválido'],
      });
    }
    return this.bodyWeightRepo.getByDateRange(startDate, endDate);
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updateBodyWeight(params: UpdateBodyWeightInput): Promise<BodyWeight> {
    const entry = await this.bodyWeightRepo.getById(params.id);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${params.id} no encontrada`);
    }

    validateBodyWeightInput({
      weight: params.weight,
      date: params.date,
      notes: params.notes ?? entry.notes,
    });

    const normalizedDate =
      typeof params.date === 'string'
        ? params.date
        : (params.date.toISOString().split('T')[0] ?? '');

    const updatedEntry: BodyWeight = {
      id: params.id,
      weight: params.weight,
      date: normalizedDate,
      notes: params.notes ?? entry.notes,
      createdAt: entry.createdAt,
    };

    await this.bodyWeightRepo.save(updatedEntry);
    return updatedEntry;
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async deleteBodyWeight(bodyWeightId: string): Promise<void> {
    const entry = await this.bodyWeightRepo.getById(bodyWeightId);

    if (!entry) {
      throw new NotFoundError(`Body weight entry con ID ${bodyWeightId} no encontrada`);
    }

    await this.bodyWeightRepo.delete(bodyWeightId);
  }
}