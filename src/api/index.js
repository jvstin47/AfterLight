/**
 * AFTERLIGHT — Scalable Archival & Telemetry API Layer
 * Provides typed domain endpoints, resilient request handling, offline-first fallback,
 * and unified facade access.
 */

import { apiClient, ApiError } from './client.js';
import { archivesApi } from './endpoints/archives.js';
import { telemetryApi } from './endpoints/telemetry.js';
import { lunarHeritageApi } from './endpoints/lunarHeritage.js';

export { apiClient, ApiError };
export { archivesApi } from './endpoints/archives.js';
export { telemetryApi } from './endpoints/telemetry.js';
export { lunarHeritageApi } from './endpoints/lunarHeritage.js';

/**
 * Unified API Facade
 */
export const api = Object.freeze({
  client: apiClient,
  archives: archivesApi,
  telemetry: telemetryApi,
  heritage: lunarHeritageApi,

  /**
   * Performs an API connectivity and health check.
   * @returns {Promise<{ ok: boolean, mode: string, timestamp: string }>}
   */
  async checkHealth() {
    try {
      const telemetry = await telemetryApi.getSiteTelemetry();
      return {
        ok: !!telemetry,
        mode: 'offline-first',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        ok: false,
        mode: 'degraded',
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  }
});
