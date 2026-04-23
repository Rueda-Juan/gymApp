import { documentDirectory, getInfoAsync, writeAsStringAsync, readAsStringAsync, moveAsync, EncodingType } from 'expo-file-system/legacy';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_FILE_PATH = `${documentDirectory}app_logs.txt`;
const LOG_FILE_OLD_PATH = `${LOG_FILE_PATH}.old`;
const MAX_LOG_SIZE_BYTES = 1024 * 1024; // 1 MB

let logBuffer: string[] = [];
let isWriting = false;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushLogs, 2000);
}

async function flushLogs() {
  if (logBuffer.length === 0 || isWriting) return;
  isWriting = true;

  const pendingEntries = [...logBuffer];
  const contentToWrite = pendingEntries.join('\n') + '\n';

  try {
    const fileInfo = await getInfoAsync(LOG_FILE_PATH);

    if (fileInfo.exists && fileInfo.size > MAX_LOG_SIZE_BYTES) {
      await moveAsync({ from: LOG_FILE_PATH, to: LOG_FILE_OLD_PATH });
    }

    let existingContent = '';
    const currentInfo = await getInfoAsync(LOG_FILE_PATH);
    if (currentInfo.exists) {
      existingContent = await readAsStringAsync(LOG_FILE_PATH, { encoding: EncodingType.UTF8 });
    }

    await writeAsStringAsync(LOG_FILE_PATH, existingContent + contentToWrite, {
      encoding: EncodingType.UTF8,
    });

    logBuffer = logBuffer.slice(pendingEntries.length);
  } catch (error) {
    console.error('Failed to write logs to disk', error);
  } finally {
    isWriting = false;
    if (logBuffer.length > 0) {
      scheduleFlush();
    }
  }
}

function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch (_err) {
    return '[Unserializable data]';
  }
}

function queueLog(level: LogLevel, namespace: string, message: string, args: unknown[]) {
  if (process.env.NODE_ENV === 'test') return;
  const timestamp = new Date().toISOString();
  const argsString = args.length > 0 ? safeStringify(args) : '';
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${namespace}] ${message} ${argsString}`;
  logBuffer.push(logEntry);
  scheduleFlush();
}

/**
 * Structured logger with namespace support.
 * Debug logs only appear in __DEV__ mode.
 * Logs are persisted to device storage.
 */
export class Logger {
  constructor(private readonly namespace: string) {}

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'test') return;
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.debug(`[${this.namespace}]`, message, ...args);
      queueLog('debug', this.namespace, message, args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[${this.namespace}]`, message, ...args);
    }
    queueLog('info', this.namespace, message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[${this.namespace}]`, message, ...args);
    }
    queueLog('warn', this.namespace, message, args);
  }

  error(message: string, error?: unknown): void {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[${this.namespace}]`, message, error);
    }
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
