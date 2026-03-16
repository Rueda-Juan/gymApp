export interface BackupRepository {
  exportData(): Promise<string>;
  importData(jsonData: string): Promise<void>;
  exportCSV(): Promise<string>;
}
