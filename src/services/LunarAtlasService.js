/**
 * AFTERLIGHT — Lunar Atlas & Planetary Heritage Service
 * Business logic for querying, filtering, calculating spatial telemetry, and deep-searching lunar sites,
 * flags of the moon, scientific experiments, and planetary geology modules.
 */

import { lunarHeritageApi } from '../api/endpoints/lunarHeritage.js';
import { distanceToApollo12, bearingToApollo12 } from '../utils/astronomy.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { logger } from '../utils/logger.js';

export const ATLAS_CATEGORIES = Object.freeze({
  ALL: 'all',
  ROVERS: 'rovers',
  APOLLO: 'manned',
  VANGUARD: 'vanguard',
  IMPACTS: 'impacts'
});

export const ATLAS_MODES = Object.freeze({
  MISSIONS: 'missions',
  FLAGS: 'flags',
  SCIENCE: 'science',
  GEOLOGY: 'geology'
});

class LunarAtlasService {
  constructor() {
    this._sitesCache = null;
    this._flagsCache = null;
    this._scienceCache = null;
    this._geologyCache = null;
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
        calculatedDistanceKm: site.distanceKm ?? distanceToApollo12(site.lat, site.lon),
        calculatedBearingDeg: site.bearingDeg ?? bearingToApollo12(site.lat, site.lon)
      }));
      return this._sitesCache;
    } catch (err) {
      logger.error('Failed to load lunar heritage sites:', err);
      return [];
    }
  }

  /**
   * Returns filtered sites based on category, agency, era, and optional search query.
   * @param {object} [options]
   * @param {string} [options.category='all']
   * @param {string} [options.agency='ALL']
   * @param {string} [options.era='all']
   * @param {string} [options.query='']
   * @returns {Promise<Array<any>>}
   */
  async getFilteredSites({ category = 'all', agency = 'ALL', era = 'all', query = '' } = {}) {
    const allSites = await this.getAllSites();
    const catLower = category.toLowerCase();
    const agUpper = agency.toUpperCase();
    const qLower = query.toLowerCase().trim();

    return allSites.filter((site) => {
      // Category match
      let matchesCategory = true;
      if (catLower === 'rovers') {
        matchesCategory = site.group === 'rovers' || site.category === 'Planetary Rover';
      } else if (catLower === 'manned' || catLower === 'apollo') {
        matchesCategory = site.group === 'manned' || site.category.includes('Apollo') || site.category.includes('Manned');
      } else if (catLower === 'vanguard') {
        matchesCategory = site.group === 'vanguard' || site.category.includes('Robotic Lander') || site.category.includes('Vanguard');
      } else if (catLower === 'impacts') {
        matchesCategory = site.group === 'impacts' || site.category.includes('Impact');
      }

      if (!matchesCategory) return false;

      // Agency match
      if (agUpper !== 'ALL') {
        let matchesAgency = false;
        if (agUpper === 'NASA') matchesAgency = site.agency?.toUpperCase().includes('NASA');
        else if (agUpper === 'USSR') matchesAgency = site.agency?.toUpperCase().includes('USSR') || site.agency?.toUpperCase().includes('OKB') || site.agency?.toUpperCase().includes('LAVOCHKIN');
        else if (agUpper === 'CNSA') matchesAgency = site.agency?.toUpperCase().includes('CNSA') || site.country?.toLowerCase().includes('china');
        else if (agUpper === 'ISRO') matchesAgency = site.agency?.toUpperCase().includes('ISRO') || site.country?.toLowerCase().includes('india');
        else if (agUpper === 'JAXA') matchesAgency = site.agency?.toUpperCase().includes('JAXA') || site.country?.toLowerCase().includes('japan');
        else if (agUpper === 'COMMERCIAL') matchesAgency = site.category?.toLowerCase().includes('commercial') || site.agency?.toLowerCase().includes('intuitive');
        else matchesAgency = site.agency?.toUpperCase().includes(agUpper);

        if (!matchesAgency) return false;
      }

      // Era match
      if (era && era !== 'all' && site.era !== era) {
        return false;
      }

      // Query match
      if (!qLower) return true;

      const searchableText = [
        site.name,
        site.designation,
        site.agency,
        site.country,
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
   * Fetches all documented lunar flags and treaty context.
   * @returns {Promise<{ flags: Array<any>, treatyDisclaimer: object }>}
   */
  async getFlags() {
    if (this._flagsCache) return this._flagsCache;
    try {
      this._flagsCache = await lunarHeritageApi.getFlags();
      return this._flagsCache;
    } catch (err) {
      logger.error('Failed to load lunar flags:', err);
      return { flags: [], treatyDisclaimer: {} };
    }
  }

  /**
   * Fetches all lunar science experiment packages.
   * @returns {Promise<Array<any>>}
   */
  async getScienceExperiments() {
    if (this._scienceCache) return this._scienceCache;
    try {
      this._scienceCache = await lunarHeritageApi.getScienceExperiments();
      return this._scienceCache;
    } catch (err) {
      logger.error('Failed to load science experiments:', err);
      return [];
    }
  }

  /**
   * Fetches all lunar geology knowledge modules.
   * @returns {Promise<Array<any>>}
   */
  async getGeologyModules() {
    if (this._geologyCache) return this._geologyCache;
    try {
      this._geologyCache = await lunarHeritageApi.getGeologyModules();
      return this._geologyCache;
    } catch (err) {
      logger.error('Failed to load geology modules:', err);
      return [];
    }
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
