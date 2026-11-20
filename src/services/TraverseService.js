/**
 * AFTERLIGHT — Traverse & Extravehicular Activity (EVA) Service
 * Encapsulates traverse route logic, SVG cartography paths, station telemetry,
 * and distance metrics away from UI modal presentation.
 */

import { TRAVERSE_DATA } from '../data/traverseData.js';
import { logger } from '../utils/logger.js';

class TraverseService {
  /**
   * Retrieves the full traverse dataset.
   * @returns {typeof TRAVERSE_DATA}
   */
  getTraverseData() {
    return TRAVERSE_DATA;
  }

  /**
   * Retrieves a specific EVA record by ID ('eva1' or 'eva2').
   * @param {string} evaId
   * @returns {any|null}
   */
  getEvaById(evaId) {
    return TRAVERSE_DATA[evaId] || null;
  }

  /**
   * Computes the mathematical SVG SVG path string for an EVA traverse.
   * @param {string} evaId
   * @returns {string} SVG path 'd' attribute string
   */
  getSvgPath(evaId) {
    if (evaId === 'eva1') {
      // EVA 1 Path: Intrepid -> MESA -> ALSEP -> Flag -> Return
      return 'M 0 0 L 2.5 1.5 L -106 -75 L 0 7 L 0 0';
    }

    if (evaId === 'eva2') {
      // EVA 2 Path: Loop around Head -> Bench -> Sharp -> Halo -> Surveyor Crater -> Intrepid
      return 'M 0 0 L -55 -35 L -95 -30 L -140 45 L -210 95 L -100 130 L 20 100 L 72 150 L 60 85 L 0 0';
    }

    logger.warn(`Unknown EVA ID requested for SVG path: ${evaId}`);
    return '';
  }

  /**
   * Finds a station or waypoint in an EVA by its ID.
   * @param {string} evaId
   * @param {string} stationId
   * @returns {any|null}
   */
  findStation(evaId, stationId) {
    const eva = this.getEvaById(evaId);
    if (!eva) return null;

    if (eva.stations) {
      const match = eva.stations.find((st) => st.id === stationId);
      if (match) return match;
    }

    if (eva.waypoints) {
      const match = eva.waypoints.find((wp) => wp.id === stationId || wp.name === stationId);
      if (match) return match;
    }

    return null;
  }
}

export const traverseService = new TraverseService();
