/**
 * AFTERLIGHT — Planetary Heritage & Rovers Registry API
 * Serves global lunar missions, rover traverses, and in situ relics.
 */

import { LUNAR_HERITAGE_SITES } from '../../data/lunarHeritageData.js';

export const lunarHeritageApi = {
  /**
   * Fetches all registered lunar human heritage sites.
   * @param {object} [filterOptions]
   * @param {string} [filterOptions.category] Filter by category ('rovers', 'apollo', 'vanguard', 'impacts', 'all')
   * @param {string} [filterOptions.searchQuery] Search query
   * @returns {Promise<Array<any>>}
   */
  async getHeritageSites(filterOptions = {}) {
    const { category = 'all', searchQuery = '' } = filterOptions;
    let sites = [...LUNAR_HERITAGE_SITES];

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      sites = sites.filter((s) => {
        if (catLower === 'rovers') return s.category === 'Planetary Rover';
        if (catLower === 'apollo') return s.category.includes('Apollo') || s.category.includes('Manned');
        if (catLower === 'vanguard') return s.category.includes('Robotic Lander') || s.category.includes('Vanguard');
        if (catLower === 'impacts') return s.category.includes('Impact');
        return true;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      sites = sites.filter((s) => {
        return (
          s.name?.toLowerCase().includes(q) ||
          s.designation?.toLowerCase().includes(q) ||
          s.agency?.toLowerCase().includes(q) ||
          s.region?.toLowerCase().includes(q) ||
          s.keyArtifacts?.some((k) => k.toLowerCase().includes(q)) ||
          s.description?.toLowerCase().includes(q)
        );
      });
    }

    return sites;
  },

  /**
   * Fetches a single heritage site record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getSiteById(id) {
    const site = LUNAR_HERITAGE_SITES.find((s) => s.id === id);
    if (!site) {
      throw new Error(`Heritage site "${id}" not found.`);
    }
    return site;
  }
};
