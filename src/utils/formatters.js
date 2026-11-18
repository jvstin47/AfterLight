/**
 * AFTERLIGHT — Archival Formatting Utilities
 * Formats coordinates, dates, numbers, and telemetry strings.
 */

/**
 * Formats lunar coordinates into standard scientific notation (e.g., 3.01239° S, 23.42157° W)
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 * @param {number} decimals Decimal precision
 * @returns {string}
 */
export function formatCoordinates(lat, lon, decimals = 5) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  const absLat = Math.abs(lat).toFixed(decimals);
  const absLon = Math.abs(lon).toFixed(decimals);
  return `${absLat}° ${latDir}, ${absLon}° ${lonDir}`;
}

/**
 * Formats distance in meters or kilometers with SI units.
 * @param {number} km Distance in kilometers
 * @returns {string}
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toLocaleString()} km`;
}

/**
 * Formats bearing in 3-digit degrees (e.g., 045°)
 * @param {number} degrees
 * @returns {string}
 */
export function formatBearing(degrees) {
  const rounded = Math.round(degrees);
  return `${String(rounded).padStart(3, '0')}°`;
}

/**
 * Escapes HTML entities in untrusted strings to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
