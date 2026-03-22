/**
 * logger.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight structured logger for the test framework.
 * Wraps console methods and prefixes every message with a timestamp and level,
 * making failures easier to correlate in CI logs.
 *
 * Usage:
 *   import { logger } from '@utils/logger';
 *   logger.info('Navigating to Products page');
 *   logger.warn('Vendor row count is 0 – will add one');
 *   logger.error('Failed to locate Save button');
 */

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_RANK: Record<Level, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

const activeLevel = (): Level => {
  const val = (process.env.LOG_LEVEL ?? 'INFO').toUpperCase() as Level;
  return LEVEL_RANK[val] !== undefined ? val : 'INFO';
};

function stamp(): string {
  return new Date().toISOString();
}

function emit(level: Level, ...args: unknown[]): void {
  if (LEVEL_RANK[level] < LEVEL_RANK[activeLevel()]) return;
  const prefix = `[${stamp()}] [${level}]`;
  switch (level) {
    case 'ERROR': console.error(prefix, ...args); break;
    case 'WARN':  console.warn(prefix,  ...args); break;
    default:      console.log(prefix,   ...args);
  }
}

export const logger = {
  debug: (...args: unknown[]) => emit('DEBUG', ...args),
  info:  (...args: unknown[]) => emit('INFO',  ...args),
  warn:  (...args: unknown[]) => emit('WARN',  ...args),
  error: (...args: unknown[]) => emit('ERROR', ...args),

  /** Logs a section header – useful for grouping steps in long test output. */
  step: (stepName: string) => emit('INFO', `──── ${stepName} ────`),
};
