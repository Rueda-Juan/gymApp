import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';

/**
 * Hook that exposes backup and export operations.
 * Wraps BackupService from the DI container.
 */
export function useBackup() {
  const { backupService } = useContainer();

  const createBackup = useCallback(
    () => backupService.createBackup(),
    [backupService],
  );

  const restoreBackup = useCallback(
    (jsonData: string) => backupService.restoreBackup(jsonData),
    [backupService],
  );

  const exportCSV = useCallback(
    () => backupService.exportCSV(),
    [backupService],
  );

  return useMemo(() => ({
    createBackup,
    restoreBackup,
    exportCSV,
  }), [createBackup, restoreBackup, exportCSV]);
}
