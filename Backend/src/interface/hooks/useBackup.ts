import { useCallback, useMemo } from 'react';
import { useContainer } from './useContainer';

export function useBackup() {
  const { createBackup: createBackupUseCase, restoreBackup: restoreBackupUseCase, exportCSV: exportCSVUseCase } = useContainer();

  const createBackup = useCallback(
    () => createBackupUseCase.execute(),
    [createBackupUseCase],
  );

  const restoreBackup = useCallback(
    (jsonData: string) => restoreBackupUseCase.execute(jsonData),
    [restoreBackupUseCase],
  );

  const exportCSV = useCallback(
    () => exportCSVUseCase.execute(),
    [exportCSVUseCase],
  );

  return useMemo(() => ({
    createBackup,
    restoreBackup,
    exportCSV,
  }), [createBackup, restoreBackup, exportCSV]);
}
