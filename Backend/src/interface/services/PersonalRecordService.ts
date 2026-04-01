import type { GetPersonalRecordsUseCase, GetBestPersonalRecordUseCase, GetPRCountSinceUseCase } from '../../application/useCases/stats/GetPersonalRecords';
import type { RecordType } from '../../domain/entities/PersonalRecord';

export class PersonalRecordService {
  constructor(
    private readonly _getPersonalRecords: GetPersonalRecordsUseCase,
    private readonly _getBestPersonalRecord: GetBestPersonalRecordUseCase,
    private readonly _getPRCountSince: GetPRCountSinceUseCase,
  ) {}

  async getRecords(exerciseId: string) {
    return this._getPersonalRecords.execute(exerciseId);
  }

  async getBestRecord(exerciseId: string, recordType: RecordType) {
    return this._getBestPersonalRecord.execute(exerciseId, recordType);
  }

  async countSince(since: string): Promise<number> {
    return this._getPRCountSince.execute(since);
  }
}
