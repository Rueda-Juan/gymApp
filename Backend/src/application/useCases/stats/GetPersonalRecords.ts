import type { PersonalRecord } from '../../../domain/entities/PersonalRecord';
import type { StatsRepository } from '../../../domain/repositories/StatsRepository';

/**
 * GetPersonalRecordsUseCase — Retrieves all personal records for a given exercise.
 */
export class GetPersonalRecordsUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(exerciseId: string): Promise<PersonalRecord[]> {
    return this.statsRepo.getPersonalRecords(exerciseId);
  }
}

/**
 * GetBestPersonalRecordUseCase — Retrieves the best record for a specific type and exercise.
 */
export class GetBestPersonalRecordUseCase {
  constructor(private readonly statsRepo: StatsRepository) {}

  async execute(exerciseId: string, recordType: string): Promise<PersonalRecord | null> {
    return this.statsRepo.getLatestRecord(exerciseId, recordType);
  }
}
