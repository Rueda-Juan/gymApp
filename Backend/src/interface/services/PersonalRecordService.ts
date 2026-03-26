import type { GetPersonalRecordsUseCase, GetBestPersonalRecordUseCase } from '../../application/useCases/stats/GetPersonalRecords';

export class PersonalRecordService {
  constructor(
    private readonly _getPersonalRecords: GetPersonalRecordsUseCase,
    private readonly _getBestPersonalRecord: GetBestPersonalRecordUseCase,
  ) {}

  async getRecords(exerciseId: string) {
    return this._getPersonalRecords.execute(exerciseId);
  }

  async getBestRecord(exerciseId: string, recordType: string) {
    return this._getBestPersonalRecord.execute(exerciseId, recordType);
  }
}
