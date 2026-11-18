/**
 * AFTERLIGHT — Standardized Application Logger
 * Provides leveled logging, prefixing, and suppression based on environment.
 */

import { env } from '../config/env.js';

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(namespace = 'AFTERLIGHT') {
    this.namespace = namespace;
  }

  _format(level, message, ...args) {
    const timestamp = new Date().toISOString().substring(11, 23);
    return [`[${timestamp}] [${this.namespace}] [${level}]`, message, ...args];
  }

  debug(message, ...args) {
    if (env.app.debugMode || env.app.isDevelopment) {
      console.debug(...this._format('DEBUG', message, ...args));
    }
  }

  info(message, ...args) {
    console.info(...this._format('INFO', message, ...args));
  }

  warn(message, ...args) {
    console.warn(...this._format('WARN', message, ...args));
  }

  error(message, ...args) {
    console.error(...this._format('ERROR', message, ...args));
  }

  child(subNamespace) {
    return new Logger(`${this.namespace}:${subNamespace}`);
  }
}

export const logger = new Logger('AFTERLIGHT');
