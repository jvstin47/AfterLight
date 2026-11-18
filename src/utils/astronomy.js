/**
 * AFTERLIGHT — Astronomical & Spherical Navigation Utilities
 * Precision spherical trigonometry for lunar surface distances and topocentric bearings.
 */

import { ASTRONOMY } from '../config/constants.js';
import { env } from '../config/env.js';

const TO_RAD = Math.PI / 180;
const TO_DEG = 180 / Math.PI;

/**
 * Calculates great-circle lunar surface distance between two coordinates in kilometers.
 * Uses the Haversine formula for numerical stability across small and large distances.
 *
 * @param {number} lat1 Latitude of point 1 in decimal degrees
 * @param {number} lon1 Longitude of point 1 in decimal degrees
 * @param {number} lat2 Latitude of point 2 in decimal degrees
 * @param {number} lon2 Longitude of point 2 in decimal degrees
 * @param {number} [radiusKm] Lunar radius in kilometers (defaults to env.lunar.radiusKm)
 * @returns {number} Distance in kilometers rounded to the nearest integer
 */
export function calculateLunarDistance(
  lat1,
  lon1,
  lat2,
  lon2,
  radiusKm = env.lunar.radiusKm || ASTRONOMY.MOON_RADIUS_KM
) {
  const phi1 = lat1 * TO_RAD;
  const phi2 = lat2 * TO_RAD;
  const deltaPhi = (lat2 - lat1) * TO_RAD;
  const deltaLambda = (lon2 - lon1) * TO_RAD;

  const sinHalfPhi = Math.sin(deltaPhi / 2);
  const sinHalfLam = Math.sin(deltaLambda / 2);

  const a =
    sinHalfPhi * sinHalfPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinHalfLam * sinHalfLam;

  const clampedA = Math.max(0, Math.min(1, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));

  return Math.round(radiusKm * c);
}

/**
 * Calculates initial topocentric azimuth bearing from point 1 to point 2 in degrees (0° - 360°).
 *
 * @param {number} lat1 Source latitude in decimal degrees
 * @param {number} lon1 Source longitude in decimal degrees
 * @param {number} lat2 Target latitude in decimal degrees
 * @param {number} lon2 Target longitude in decimal degrees
 * @returns {number} Compass bearing in integer degrees (0 = North, 90 = East, etc.)
 */
export function calculateLunarBearing(lat1, lon1, lat2, lon2) {
  const phi1 = lat1 * TO_RAD;
  const phi2 = lat2 * TO_RAD;
  const deltaLambda = (lon2 - lon1) * TO_RAD;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const initialBearing = Math.atan2(y, x) * TO_DEG;
  return Math.round((initialBearing + 360) % 360);
}

/**
 * Calculates distance in kilometers from Statio Cognitum (Apollo 12) benchmark.
 *
 * @param {number} lat Target latitude in decimal degrees
 * @param {number} lon Target longitude in decimal degrees
 * @returns {number} Distance in kilometers
 */
export function distanceToApollo12(lat, lon) {
  return calculateLunarDistance(
    ASTRONOMY.APOLLO_12_COORDINATES.latitude,
    ASTRONOMY.APOLLO_12_COORDINATES.longitude,
    lat,
    lon
  );
}

/**
 * Calculates initial bearing in degrees from Statio Cognitum (Apollo 12) benchmark.
 *
 * @param {number} lat Target latitude in decimal degrees
 * @param {number} lon Target longitude in decimal degrees
 * @returns {number} Bearing in degrees
 */
export function bearingToApollo12(lat, lon) {
  return calculateLunarBearing(
    ASTRONOMY.APOLLO_12_COORDINATES.latitude,
    ASTRONOMY.APOLLO_12_COORDINATES.longitude,
    lat,
    lon
  );
}
