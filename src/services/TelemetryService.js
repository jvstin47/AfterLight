/**
 * AFTERLIGHT — Surface Telemetry Service
 * Queries telemetry API and publishes live landing site conditions.
 */

import { telemetryApi } from '../api/endpoints/telemetry.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { eventBus } from '../core/EventBus.js';
import { logger } from '../utils/logger.js';

class TelemetryService {
  constructor() {
    this._cachedTelemetry = null;
  }

  /**
   * Fetches current surface telemetry and publishes to store.
   * @returns {Promise<any>}
   */
  async fetchTelemetry() {
    try {
      const data = await telemetryApi.getSiteTelemetry();
      this._cachedTelemetry = data;
      store.dispatch(ActionTypes.UPDATE_SURVEYOR_PROXIMITY, data.surveyorProximityMeters);
      eventBus.emit('telemetry:updated', data);
      return data;
    } catch (err) {
      logger.error('Failed to fetch site telemetry:', err);
      return null;
    }
  }

  getCachedTelemetry() {
    return this._cachedTelemetry;
  }
}

export const telemetryService = new TelemetryService();
