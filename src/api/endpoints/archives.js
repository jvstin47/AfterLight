/**
 * AFTERLIGHT — Archival Catalog API Endpoints
 * Queries mission logs, transcripts, and audio artifact metadata.
 */

import { ARTIFACTS } from '../../data/artifactsData.js';
import { TRAVERSE_DATA } from '../../data/traverseData.js';

export const archivesApi = {
  /**
   * Fetches the complete list of on-site artifacts at Statio Cognitum.
   * @returns {Promise<Array<any>>}
   */
  async getArtifacts() {
    return Object.values(ARTIFACTS);
  },

  /**
   * Fetches artifact record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getArtifactById(id) {
    const artifact = ARTIFACTS[id] || Object.values(ARTIFACTS).find((a) => a.id === id);
    if (!artifact) {
      throw new Error(`Artifact "${id}" not found in archival catalog.`);
    }
    return artifact;
  },

  /**
   * Fetches EVA traverse routes and geological station records.
   * @returns {Promise<typeof TRAVERSE_DATA>}
   */
  async getTraverseRoutes() {
    return TRAVERSE_DATA;
  }
};
