/**
 * KROM_LOGGER: Production-safe telemetry.
 * Only outputs to terminal during development cycles.
 */
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) console.log(`[KROM_INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev) console.warn(`[KROM_WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    // We might want to log errors even in production for telemetry, 
    // but the task asks for cleanup.
    if (isDev) console.error(`[KROM_ERR] ${message}`, ...args);
  },
  sec: (message: string, ...args: any[]) => {
    if (isDev) console.log(`[SEC_TELEMETRY] ${message}`, ...args);
  }
};
