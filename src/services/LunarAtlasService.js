/**
 * AFTERLIGHT — Lunar Atlas & Planetary Heritage Service
 * Business logic for querying, filtering, calculating spatial telemetry, and deep-searching lunar sites.
 */

import { lunarHeritageApi } from '../api/endpoints/lunarHeritage.js';
import { distanceToApollo12, bearingToApollo12 } from '../utils/astronomy.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { logger } from '../utils/logger.js';

export const ATLAS_CATEGORIES = Object.freeze({
  ALL: 'all',
  ROVERS: 'rovers',
  APOLLO: 'apollo',
  VANGUARD: 'vanguard',
  IMPACTS: 'impacts'
});

class LunarAtlasService {
  constructor() {
    this._sitesCache = null;
  }

  /**
   * Initializes or loads cached heritage sites with enriched distance & bearing.
   * @returns {Promise<Array<any>>}
   */
  async getAllSites() {
    if (this._sitesCache) {
      return this._sitesCache;
    }

    try {
      const rawSites = await lunarHeritageApi.getHeritageSites({ category: 'all' });
      this._sitesCache = rawSites.map((site) => ({
        ...site,
        calculatedDistanceKm: distanceToApollo12(site.latitude, site.longitude),
        calculatedBearingDeg: bearingToApollo12(site.latitude, site.longitude)
      }));
      return this._sitesCache;
    } catch (err) {
      logger.error('Failed to load lunar heritage sites:', err);
      return [];
    }
  }

  /**
   * Returns filtered sites based on category and optional search query.
   * @param {string} [category='all']
   * @param {string} [query='']
   * @returns {Promise<Array<any>>}
   */
  async getFilteredSites(category = 'all', query = '') {
    const allSites = await this.getAllSites();
    const catLower = category.toLowerCase();
    const qLower = query.toLowerCase().trim();

    return allSites.filter((site) => {
      // Category match
      let matchesCategory = true;
      if (catLower === 'rovers') {
        matchesCategory = site.category === 'Planetary Rover';
      } else if (catLower === 'apollo') {
        matchesCategory = site.category.includes('Apollo') || site.category.includes('Manned');
      } else if (catLower === 'vanguard') {
        matchesCategory = site.category.includes('Robotic Lander') || site.category.includes('Vanguard');
      } else if (catLower === 'impacts') {
        matchesCategory = site.category.includes('Impact');
      }

      if (!matchesCategory) return false;

      // Query match
      if (!qLower) return true;

      const searchableText = [
        site.name,
        site.designation,
        site.agency,
        site.region,
        site.astronauts,
        ...(site.keyArtifacts || []),
        site.description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(qLower);
    });
  }

  /**
   * Sets the active atlas filter category in the central store.
   * @param {string} category
   */
  setFilter(category) {
    store.dispatch(ActionTypes.SET_ATLAS_FILTER, category);
  }

  /**
   * Selects an expedition site for deep inspection.
   * @param {string} siteId
   */
  selectSite(siteId) {
    store.dispatch(ActionTypes.SELECT_EXPEDITION_SITE, siteId);
  }

  /**
   * Gets a specific site by ID.
   * @param {string} siteId
   * @returns {Promise<any|null>}
   */
  async getSiteById(siteId) {
    const sites = await this.getAllSites();
    return sites.find((s) => s.id === siteId) || null;
  }
}

export const lunarAtlasService = new LunarAtlasService();
