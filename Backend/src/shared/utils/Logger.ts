import { documentDirectory, getInfoAsync, writeAsStringAsync, readAsStringAsync, deleteAsync, EncodingType } from 'expo-file-system/legacy';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const LOG_FILE_PATH = `${documentDirectory}app_logs.txt`;
const MAX_LOG_SIZE_BYTES = 1024 * 1024; // 1 MB

// Buffer para no escribir en disco por cada log individual inmediatamente
let logBuffer: string[] = [];
let isWriting = false;

async function flushLogs() {
  if (logBuffer.length === 0 || isWriting) return;
  isWriting = true;
  
  const contentToWrite = logBuffer.join('\n') + '\n';
  logBuffer = []; // Clear buffer

  try {
    const fileInfo = await getInfoAsync(LOG_FILE_PATH);
    
    // Si el archivo supera 1MB, lo borramos (o se podría rotar)
    if (fileInfo.exists && fileInfo.size > MAX_LOG_SIZE_BYTES) {
      await deleteAsync(LOG_FILE_PATH, { idempotent: true });
    }

    let existingContent = '';
    if (fileInfo.exists && fileInfo.size <= MAX_LOG_SIZE_BYTES) {
      existingContent = await readAsStringAsync(LOG_FILE_PATH, { encoding: EncodingType.UTF8 });
    }
    
    await writeAsStringAsync(LOG_FILE_PATH, existingContent + contentToWrite, {
      encoding: EncodingType.UTF8,
    });
  } catch (error) {
    console.error('Failed to write logs to disk', error);
  } finally {
    isWriting = false;
    // Si entraron más logs mientras escribíamos, volvemos a intentar
    if (logBuffer.length > 0) {
      setTimeout(flushLogs, 1000);
    }
  }
}

function queueLog(level: LogLevel, namespace: string, message: string, args: unknown[]) {
  const timestamp = new Date().toISOString();
  const argsString = args.length > 0 ? JSON.stringify(args) : '';
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message} ${argsString}`;
  logBuffer.push(logEntry);
  
  // Throttle writes
  setTimeout(flushLogs, 2000);
}

/**
 * Structured logger with namespace support.
 * Debug logs only appear in __DEV__ mode.
 * Logs are persisted to device storage.
 */
export class Logger {
  constructor(private readonly namespace: string) {}

  debug(message: string, ...args: unknown[]): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.debug(`[${this.namespace}]`, message, ...args);
      queueLog('debug', this.namespace, message, args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[${this.namespace}]`, message, ...args);
    queueLog('info', this.namespace, message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[${this.namespace}]`, message, ...args);
    queueLog('warn', this.namespace, message, args);
  }

  error(message: string, error?: unknown): void {
    console.error(`[${this.namespace}]`, message, error);
    queueLog('error', this.namespace, message, error ? [error] : []);
  }
}

/**
 * Creates a logger for a specific module.
 * Usage: const log = createLogger('WorkoutService');
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}

/**
 * Exporta la ruta del archivo de log para poder leerlo desde el frontend
 */
export async function getLogFilePath(): Promise<string> {
  // Aseguramos que existe
  const info = await getInfoAsync(LOG_FILE_PATH);
  if (!info.exists) {
    await writeAsStringAsync(LOG_FILE_PATH, '--- INIT LOG ---\n');
  }
  return LOG_FILE_PATH;
}
