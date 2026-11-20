/**
 * AFTERLIGHT — Global Lunar Site Transit Manager
 * Coordinates multi-site exploration across all 21 international expeditions and 9 rovers.
 * Decouples the 3D surface from a single diorama into a globally navigable lunar monument.
 */

import * as THREE from 'three';
import { eventBus } from '../core/EventBus.js';
import { createLunokhodRover } from '../entities/LunokhodRover.js';
import { createApolloLRV } from '../entities/ApolloLRV.js';
import { createYutuRover } from '../entities/YutuRover.js';
import { createPragyanRover } from '../entities/PragyanRover.js';
import { createSLIMSoraQ } from '../entities/SLIMSoraQ.js';
import { createSovietLunaLander } from '../entities/SovietLunaLander.js';

export const GLOBAL_LUNAR_SITES = {
  'statio-cognitum': {
    id: 'statio-cognitum',
    name: 'Statio Cognitum (Apollo 12 & Surveyor 3)',
    shortName: 'APOLLO 12 · STATIO COGNITUM',
    coords: '3.01239° S, 23.42157° W',
    region: 'OCEANUS PROCELLARUM',
    nation: 'United States',
    year: 1969,
    sunElevation: 12.4, // degrees
    sunAzimuth: 105,
    earthAltitude: 68.5,
    earthAzimuth: 12.0,
    hasEarth: true,
    biome: 'surveyor-crater',
    entityType: 'apollo-12-statio-cognitum'
  },
  'luna-17': {
    id: 'luna-17',
    name: 'Luna 17 (Lunokhod 1)',
    shortName: 'LUNA 17 · LUNOKHOD 1',
    coords: '38.28° N, 35.00° W',
    region: 'MARE IMBRIUM',
    nation: 'Soviet Union',
    year: 1970,
    sunElevation: 16.0,
    sunAzimuth: 95,
    earthAltitude: 48.2,
    earthAzimuth: 24.5,
    hasEarth: true,
    biome: 'mare-basalt-plain',
    entityType: 'lunokhod-1'
  },
  'luna-21': {
    id: 'luna-21',
    name: 'Luna 21 (Lunokhod 2)',
    shortName: 'LUNA 21 · LUNOKHOD 2',
    coords: '25.85° N, 30.45° E',
    region: 'LE MONNIER CRATER (MARE SERENITATIS)',
    nation: 'Soviet Union',
    year: 1973,
    sunElevation: 22.0,
    sunAzimuth: 110,
    earthAltitude: 58.0,
    earthAzimuth: 335.0,
    hasEarth: true,
    biome: 'boulder-plain',
    entityType: 'lunokhod-2'
  },
  'apollo-15': {
    id: 'apollo-15',
    name: 'Apollo 15 (Hadley-Apennine & LRV-1)',
    shortName: 'APOLLO 15 · HADLEY RILLE',
    coords: '26.1322° N, 3.6339° E',
    region: 'PALUS PUTREDINIS (HADLEY RILLE)',
    nation: 'United States',
    year: 1971,
    sunElevation: 14.5,
    sunAzimuth: 88,
    earthAltitude: 62.4,
    earthAzimuth: 5.2,
    hasEarth: true,
    biome: 'hadley-gorge',
    entityType: 'apollo-15-lrv'
  },
  'apollo-16': {
    id: 'apollo-16',
    name: 'Apollo 16 (Descartes Highlands & LRV-2)',
    shortName: 'APOLLO 16 · DESCARTES',
    coords: '8.9730° S, 15.4981° E',
    region: 'DESCARTES HIGHLANDS',
    nation: 'United States',
    year: 1972,
    sunElevation: 18.0,
    sunAzimuth: 92,
    earthAltitude: 76.5,
    earthAzimuth: 350.0,
    hasEarth: true,
    biome: 'highland-cratered',
    entityType: 'apollo-16-lrv'
  },
  'apollo-17': {
    id: 'apollo-17',
    name: 'Apollo 17 (Taurus-Littrow & LRV-3)',
    shortName: 'APOLLO 17 · TAURUS-LITTROW',
    coords: '20.1908° N, 30.7717° E',
    region: 'TAURUS-LITTROW VALLEY',
    nation: 'United States',
    year: 1972,
    sunElevation: 13.2,
    sunAzimuth: 86,
    earthAltitude: 64.0,
    earthAzimuth: 340.0,
    hasEarth: true,
    biome: 'dark-mantle-valley',
    entityType: 'apollo-17-lrv'
  },
  'change-3': {
    id: 'change-3',
    name: "Chang'e 3 (Yutu-1 Rover)",
    shortName: "CHANG'E 3 · YUTU-1",
    coords: '44.1214° N, 19.5115° W',
    region: 'MARE IMBRIUM',
    nation: 'China',
    year: 2013,
    sunElevation: 24.0,
    sunAzimuth: 115,
    earthAltitude: 44.5,
    earthAzimuth: 18.0,
    hasEarth: true,
    biome: 'mare-basalt-plain',
    entityType: 'change-3-yutu'
  },
  'change-4': {
    id: 'change-4',
    name: "Chang'e 4 (Yutu-2 Far Side Rover)",
    shortName: "CHANG'E 4 · YUTU-2 (FAR SIDE)",
    coords: '45.4561° S, 177.5885° E',
    region: 'VON KÁRMÁN CRATER (SOUTH POLE-AITKEN)',
    nation: 'China',
    year: 2019,
    sunElevation: 18.5,
    sunAzimuth: 80,
    earthAltitude: -90, // Hidden behind lunar bulk on Far Side
    earthAzimuth: 0,
    hasEarth: false, // Pure vacuum sky, no Earth visible
    biome: 'far-side-basin',
    entityType: 'change-4-yutu2'
  },
  'chandrayaan-3': {
    id: 'chandrayaan-3',
    name: 'Chandrayaan-3 (Statio Shiv Shakti & Pragyan)',
    shortName: 'CHANDRAYAAN-3 · PRAGYAN',
    coords: '69.373° S, 32.319° E',
    region: 'STATIO SHIV SHAKTI (POLAR HIGHLANDS)',
    nation: 'India',
    year: 2023,
    sunElevation: 6.8, // Low grazing polar Sun
    sunAzimuth: 65,
    earthAltitude: 18.5,
    earthAzimuth: 345.0,
    hasEarth: true,
    biome: 'polar-rim',
    entityType: 'chandrayaan-3-pragyan'
  },
  'slim': {
    id: 'slim',
    name: 'SLIM & SORA-Q (Smart Lander / LEV-2)',
    shortName: 'SLIM · SORA-Q',
    coords: '13.3160° S, 25.2510° E',
    region: 'SHIOLI CRATER EJECTA BLANKET',
    nation: 'Japan',
    year: 2024,
    sunElevation: 15.0,
    sunAzimuth: 90,
    earthAltitude: 72.0,
    earthAzimuth: 355.0,
    hasEarth: true,
    biome: 'steep-crater-slope',
    entityType: 'slim-sora-q'
  },
  'luna-9': {
    id: 'luna-9',
    name: 'Luna 9 (First Soft Landing)',
    shortName: 'LUNA 9 · FIRST TOUCHDOWN',
    coords: '7.08° N, 64.37° W',
    region: 'OCEANUS PROCELLARUM',
    nation: 'Soviet Union',
    year: 1966,
    sunElevation: 10.5,
    sunAzimuth: 92,
    earthAltitude: 35.0,
    earthAzimuth: 45.0,
    hasEarth: true,
    biome: 'mare-basalt-plain',
    entityType: 'luna-9'
  },
  'luna-16': {
    id: 'luna-16',
    name: 'Luna 16 (Robotic Sample Return)',
    shortName: 'LUNA 16 · SAMPLE DRILL',
    coords: '0.68° S, 56.30° E',
    region: 'MARE FECUNDITATIS',
    nation: 'Soviet Union',
    year: 1970,
    sunElevation: 17.5,
    sunAzimuth: 98,
    earthAltitude: 48.0,
    earthAzimuth: 320.0,
    hasEarth: true,
    biome: 'mare-basalt-plain',
    entityType: 'luna-16'
  },
  'luna-2': {
    id: 'luna-2',
    name: 'Luna 2 (First Celestial Impact)',
    shortName: 'LUNA 2 · FIRST IMPACT',
    coords: '29.1° N, 0.0° E',
    region: 'PALUS PUTREDINIS (ARCHIMEDES)',
    nation: 'Soviet Union',
    year: 1959,
    sunElevation: 25.0,
    sunAzimuth: 110,
    earthAltitude: 60.0,
    earthAzimuth: 0.0,
    hasEarth: true,
    biome: 'impact-crater-scar',
    entityType: 'luna-2'
  }
};

export class GlobalSiteManager {
  /**
   * @param {THREE.Scene} scene
   * @param {Function} elevationFn
   */
  constructor(scene, elevationFn) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.activeSiteId = 'statio-cognitum';
    this.activeSiteGroup = null;

    this.bindEvents();
  }

  bindEvents() {
    eventBus.on('site:transit-requested', (siteId) => {
      this.transitToSite(siteId);
    });
  }

  getActiveSite() {
    return GLOBAL_LUNAR_SITES[this.activeSiteId] || GLOBAL_LUNAR_SITES['statio-cognitum'];
  }

  /**
   * Transits the 3D surface to a specified international landing site
   * @param {string} siteId
   */
  transitToSite(siteId) {
    const site = GLOBAL_LUNAR_SITES[siteId];
    if (!site) {
      console.warn(`[GlobalSiteManager] Unknown site id: ${siteId}`);
      return;
    }

    if (this.activeSiteId === siteId && this.activeSiteGroup) {
      console.log(`[GlobalSiteManager] Already at site: ${siteId}`);
      return;
    }

    console.log(`[GlobalSiteManager] Transiting to ${site.name} (${site.coords})...`);
    this.activeSiteId = siteId;

    // Remove existing site-specific entities if present
    if (this.activeSiteGroup) {
      this.scene.remove(this.activeSiteGroup);
      this.disposeHierarchy(this.activeSiteGroup);
      this.activeSiteGroup = null;
    }

    // If site is Statio Cognitum, the base scene entities (LM, Surveyor 3, ALSEP) remain visible
    const isStatioCognitum = siteId === 'statio-cognitum';
    eventBus.emit('scene:statio-cognitum-visibility', isStatioCognitum);

    if (!isStatioCognitum) {
      this.activeSiteGroup = new THREE.Group();
      this.activeSiteGroup.name = `site-entities-${siteId}`;

      // Spawn target nation's hardware entity
      const spawnedEntity = this.spawnHardwareForSite(site);
      if (spawnedEntity) {
        this.activeSiteGroup.add(spawnedEntity);
      }

      this.scene.add(this.activeSiteGroup);
    }

    // Broadcast site change to HUD, lighting, and camera
    eventBus.emit('site:transited', site);
  }

  spawnHardwareForSite(site) {
    try {
      switch (site.entityType) {
      case 'lunokhod-1':
        return createLunokhodRover(this.elevationFn, { posX: 0, posZ: 0, isLunokhod2: false });
      case 'lunokhod-2':
        return createLunokhodRover(this.elevationFn, { posX: 0, posZ: 0, isLunokhod2: true });
      case 'apollo-15-lrv':
        return createApolloLRV(this.elevationFn, { posX: 0, posZ: 0, mission: 'Apollo 15' });
      case 'apollo-16-lrv':
        return createApolloLRV(this.elevationFn, { posX: 0, posZ: 0, mission: 'Apollo 16' });
      case 'apollo-17-lrv':
        return createApolloLRV(this.elevationFn, { posX: 0, posZ: 0, mission: 'Apollo 17' });
      case 'change-3-yutu':
        return createYutuRover(this.elevationFn, { posX: 0, posZ: 0, isYutu2: false });
      case 'change-4-yutu2':
        return createYutuRover(this.elevationFn, { posX: 0, posZ: 0, isYutu2: true });
      case 'chandrayaan-3-pragyan':
        return createPragyanRover(this.elevationFn, { posX: 0, posZ: 0 });
      case 'slim-sora-q':
        return createSLIMSoraQ(this.elevationFn, { posX: 0, posZ: 0 });
      case 'luna-9':
        return createSovietLunaLander(this.elevationFn, { posX: 0, posZ: 0, type: 'luna-9' });
      case 'luna-16':
        return createSovietLunaLander(this.elevationFn, { posX: 0, posZ: 0, type: 'luna-16' });
      case 'luna-2':
        return createSovietLunaLander(this.elevationFn, { posX: 0, posZ: 0, type: 'luna-2' });
      default:
        return null;
      }
    } catch (err) {
      console.error('[GlobalSiteManager] Failed to spawn hardware for site:', site?.id, err);
      return null;
    }
  }

  disposeHierarchy(obj) {
    obj.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }
}
