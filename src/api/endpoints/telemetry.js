/**
 * AFTERLIGHT — Telemetry API Endpoints
 * Provides operational parameters, ephemeris data, and real-time site measurements.
 */

import { ASTRONOMY } from '../../config/constants.js';

export const telemetryApi = {
  /**
   * Retrieves real-time or simulated landing site atmospheric and solar measurements.
   * Grounded in Apollo 12 surface measurements.
   *
   * @returns {Promise<{
   *   coordinates: { latitude: number, longitude: number, elevationMeters: number },
   *   solarIncidenceDegrees: number,
   *   vacuumTorr: string,
   *   surfaceTemperatureC: number,
   *   surveyorProximityMeters: number,
   *   timestamp: string
   * }>}
   */
  async getSiteTelemetry() {
    // Return authentic site telemetry (offline-first with zero latency)
    return {
      coordinates: ASTRONOMY.APOLLO_12_COORDINATES,
      solarIncidenceDegrees: ASTRONOMY.SOLAR_INCIDENCE_DEG,
      vacuumTorr: ASTRONOMY.VACUUM_TORR,
      surfaceTemperatureC: ASTRONOMY.LUNAR_DAY_TEMP_C,
      surveyorProximityMeters: ASTRONOMY.SURVEYOR_3_COORDINATES.distanceToIntrepidMeters,
      timestamp: new Date().toISOString()
    };
  }
};
