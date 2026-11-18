/**
 * AFTERLIGHT — Environment Configuration Loader
 * Validates, types, and provides immutable defaults for runtime configuration.
 */

import { ASTRONOMY } from './constants.js';

function parseNumber(val, fallback) {
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
}

function parseBoolean(val, fallback) {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'boolean') return val;
  const str = String(val).toLowerCase().trim();
  return str === 'true' || str === '1' || str === 'yes';
}

const rawEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const env = Object.freeze({
  app: Object.freeze({
    title: rawEnv.VITE_APP_TITLE || 'AFTERLIGHT — The Living Archival Monument',
    station: rawEnv.VITE_APP_STATION || 'STATIO COGNITUM',
    latitude: parseNumber(rawEnv.VITE_APP_LATITUDE, ASTRONOMY.APOLLO_12_COORDINATES.latitude),
    longitude: parseNumber(rawEnv.VITE_APP_LONGITUDE, ASTRONOMY.APOLLO_12_COORDINATES.longitude),
    isProduction: rawEnv.PROD === true,
    isDevelopment: rawEnv.DEV === true,
    debugMode: parseBoolean(rawEnv.VITE_DEBUG_MODE, false)
  }),
  lunar: Object.freeze({
    radiusKm: parseNumber(rawEnv.VITE_LUNAR_RADIUS_KM, ASTRONOMY.MOON_RADIUS_KM)
  }),
  api: Object.freeze({
    baseUrl: rawEnv.VITE_API_BASE_URL || '/api',
    timeoutMs: parseNumber(rawEnv.VITE_API_TIMEOUT_MS, 8000)
  }),
  audio: Object.freeze({
    defaultMuted: parseBoolean(rawEnv.VITE_AUDIO_DEFAULT_MUTED, true)
  }),
  features: Object.freeze({
    enableVidiconScan: parseBoolean(rawEnv.VITE_ENABLE_VIDICON_SCAN, true),
    enableAnalytics: parseBoolean(rawEnv.VITE_ENABLE_ANALYTICS, false)
  })
});
