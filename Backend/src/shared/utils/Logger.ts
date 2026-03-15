const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

/**
 * Structured logger with namespace support.
 * Debug logs only appear in __DEV__ mode.
 */
export class Logger {
  constructor(private readonly namespace: string) {}

  debug(message: string, ...args: unknown[]): void {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.debug(`[${this.namespace}]`, message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[${this.namespace}]`, message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[${this.namespace}]`, message, ...args);
  }

  error(message: string, error?: unknown): void {
    console.error(`[${this.namespace}]`, message, error);
  }
}

/**
 * Creates a logger for a specific module.
 * Usage: const log = createLogger('WorkoutService');
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}
