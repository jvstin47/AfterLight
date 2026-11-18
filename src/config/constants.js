/**
 * AFTERLIGHT — System Constants & Astronomical Benchmarks
 * Grounded in Apollo 12 mission parameters and IAU planetary standards.
 */

export const ASTRONOMY = Object.freeze({
  /** IAU standard volumetric mean radius of the Moon in km */
  MOON_RADIUS_KM: 1737.4,
  /** Statio Cognitum (Apollo 12 landing site) coordinates */
  APOLLO_12_COORDINATES: Object.freeze({
    latitude: -3.01239,
    longitude: -23.42157,
    elevationMeters: -1400.0,
    name: 'Statio Cognitum',
    region: 'Oceanus Procellarum'
  }),
  /** Surveyor 3 landing coordinates */
  SURVEYOR_3_COORDINATES: Object.freeze({
    latitude: -3.01639,
    longitude: -23.41889,
    distanceToIntrepidMeters: 163
  }),
  /** Lunar surface environment physical limits */
  VACUUM_TORR: '10⁻¹² TORR',
  LUNAR_DAY_TEMP_C: 22,
  LUNAR_NIGHT_TEMP_C: -180,
  SOLAR_INCIDENCE_DEG: 12.4
});

export const APP_STAGES = Object.freeze({
  APPROACH: 'APPROACH',       // Stage A: Cinematic orbital approach & title
  ENVIRONMENT: 'ENVIRONMENT', // Stage B: Free exploration of landing site
  INSPECTION: 'INSPECTION',   // Stage C: Artifact inspection & dossier open
  TRAVERSE: 'TRAVERSE',       // Modal: 2D/3D traverse routes map
  EXPEDITIONS: 'EXPEDITIONS'  // Modal: Global lunar heritage & rovers atlas
});

export const CAMERA_PRESETS = Object.freeze({
  OVERVIEW: 'OVERVIEW',
  EYE_LEVEL: 'EYE_LEVEL',
  SURVEYOR_RIM: 'SURVEYOR_RIM',
  ALSEP_SITE: 'ALSEP_SITE',
  CELESTIAL_EARTH: 'CELESTIAL_EARTH'
});

export const AUDIO_FREQUENCIES = Object.freeze({
  QUINDAR_INTRO: 2525,
  QUINDAR_OUTRO: 2475,
  UI_BLIP: 620,
  UI_CLICK_HIGH: 800,
  UI_CLICK_LOW: 400,
  BEACON_INTREPID: 55,
  BEACON_SURVEYOR: 1800,
  BEACON_ALSEP: 110
});

export const KEYBOARD_SHORTCUTS = Object.freeze({
  CAMERA_1: '1',
  CAMERA_2: '2',
  CAMERA_3: '3',
  CAMERA_4: '4',
  CAMERA_5: '5',
  TOGGLE_TRAVERSE: 't',
  TOGGLE_EXPEDITIONS: 'e',
  TOGGLE_VIDICON: 'v',
  TOGGLE_AUDIO: 'm',
  QUICK_SEARCH: 'k',
  ESCAPE: 'Escape'
});
