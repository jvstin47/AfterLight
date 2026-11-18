/**
 * AFTERLIGHT — Planetary Heritage, Flags & Lunar Science API
 * Serves global lunar missions, flags of the moon, scientific experiments, and geology knowledge modules.
 */

import {
  GLOBAL_MISSIONS,
  FLAGS_OF_THE_MOON,
  LUNAR_SCIENCE_EXPERIMENTS,
  LUNAR_GEOLOGY_MODULES,
  OUTER_SPACE_TREATY_DISCLAIMER
} from '../../data/globalLunarData.js';

export const lunarHeritageApi = {
  /**
   * Fetches all registered lunar human heritage sites with multifaceted filtering.
   * @param {object} [filterOptions]
   * @param {string} [filterOptions.category] Filter by category ('rovers', 'manned', 'vanguard', 'impacts', 'all')
   * @param {string} [filterOptions.agency] Filter by space agency ('ALL', 'NASA', 'USSR', 'CNSA', 'ISRO', 'JAXA', 'COMMERCIAL')
   * @param {string} [filterOptions.era] Filter by era ID
   * @param {string} [filterOptions.searchQuery] Search query
   * @returns {Promise<Array<any>>}
   */
  async getHeritageSites(filterOptions = {}) {
    const { category = 'all', agency = 'all', era = 'all', searchQuery = '' } = filterOptions;
    let sites = [...GLOBAL_MISSIONS];

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      sites = sites.filter((s) => {
        if (catLower === 'rovers') return s.group === 'rovers' || s.category === 'Planetary Rover';
        if (catLower === 'manned' || catLower === 'apollo') return s.group === 'manned' || s.category.includes('Apollo') || s.category.includes('Manned');
        if (catLower === 'vanguard') return s.group === 'vanguard' || s.category.includes('Robotic Lander') || s.category.includes('Vanguard');
        if (catLower === 'impacts') return s.group === 'impacts' || s.category.includes('Impact');
        return true;
      });
    }

    if (agency && agency.toUpperCase() !== 'ALL') {
      const agUpper = agency.toUpperCase();
      sites = sites.filter((s) => {
        if (agUpper === 'NASA') return s.agency?.toUpperCase().includes('NASA');
        if (agUpper === 'USSR') return s.agency?.toUpperCase().includes('USSR') || s.agency?.toUpperCase().includes('OKB') || s.agency?.toUpperCase().includes('LAVOCHKIN');
        if (agUpper === 'CNSA') return s.agency?.toUpperCase().includes('CNSA') || s.country?.toLowerCase().includes('china');
        if (agUpper === 'ISRO') return s.agency?.toUpperCase().includes('ISRO') || s.country?.toLowerCase().includes('india');
        if (agUpper === 'JAXA') return s.agency?.toUpperCase().includes('JAXA') || s.country?.toLowerCase().includes('japan');
        if (agUpper === 'COMMERCIAL') return s.category?.toLowerCase().includes('commercial') || s.agency?.toLowerCase().includes('intuitive');
        return s.agency?.toUpperCase().includes(agUpper);
      });
    }

    if (era && era !== 'all') {
      sites = sites.filter((s) => s.era === era);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      sites = sites.filter((s) => {
        return (
          s.name?.toLowerCase().includes(q) ||
          s.designation?.toLowerCase().includes(q) ||
          s.agency?.toLowerCase().includes(q) ||
          s.country?.toLowerCase().includes(q) ||
          s.region?.toLowerCase().includes(q) ||
          s.astronauts?.toLowerCase().includes(q) ||
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
    const site = GLOBAL_MISSIONS.find((s) => s.id === id);
    if (!site) {
      throw new Error(`Heritage site "${id}" not found.`);
    }
    return site;
  },

  /**
   * Fetches all documented national flags and markers on the lunar surface.
   * @returns {Promise<{ flags: Array<any>, treatyDisclaimer: object }>}
   */
  async getFlags() {
    return {
      flags: [...FLAGS_OF_THE_MOON],
      treatyDisclaimer: OUTER_SPACE_TREATY_DISCLAIMER
    };
  },

  /**
   * Fetches a single flag record by ID.
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getFlagById(id) {
    const flag = FLAGS_OF_THE_MOON.find((f) => f.id === id);
    if (!flag) {
      throw new Error(`Lunar flag record "${id}" not found.`);
    }
    return flag;
  },

  /**
   * Fetches all lunar science experiment packages.
   * @returns {Promise<Array<any>>}
   */
  async getScienceExperiments() {
    return [...LUNAR_SCIENCE_EXPERIMENTS];
  },

  /**
   * Fetches all lunar geology & physics knowledge modules.
   * @returns {Promise<Array<any>>}
   */
  async getGeologyModules() {
    return [...LUNAR_GEOLOGY_MODULES];
  }
};
