/**
 * AFTERLIGHT — Monument Application Entry Point
 * Orchestrates 3D WebGL runtime, reactive UI controllers, services, and the error boundary.
 */

import { LunarScene } from './scene/LunarScene.js';
import { stateMachine, STATES } from './core/StateMachine.js';
import { eventBus } from './core/EventBus.js';
import { errorBoundary } from './core/ErrorBoundary.js';
import { audioService } from './services/AudioService.js';
import { navigationService } from './services/NavigationService.js';
import { telemetryService } from './services/TelemetryService.js';
import { store } from './state/Store.js';
import { ActionTypes } from './state/actions.js';
import { logger } from './utils/logger.js';
import { KEYBOARD_SHORTCUTS } from './config/constants.js';

// UI Controllers
import { ApproachOverlay } from './ui/ApproachOverlay.js';
import { HUDController } from './ui/HUDController.js';
import { VidiconOverlay } from './ui/VidiconOverlay.js';
import { MissionAudioCapsule } from './ui/MissionAudioCapsule.js';
import { NavRail } from './ui/NavRail.js';
import { QuickSearch } from './ui/QuickSearch.js';
import { MissionStatsCard } from './ui/MissionStatsCard.js';

/**
 * Validates hardware WebGL availability.
 * @returns {boolean}
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Dynamically loads and mounts the non-WebGL 2D archival fallback experience.
 * @param {HTMLElement} fallbackContainer
 */
async function renderFallback(fallbackContainer) {
  if (fallbackContainer) {
    fallbackContainer.style.display = 'block';
    const { FallbackView } = await import('./ui/FallbackView.js');
    new FallbackView(fallbackContainer);
  }
}

/**
 * Core initialization sequence.
 */
async function init() {
  // Initialize Global Runtime Error Boundary
  errorBoundary.init();

  const canvas = document.getElementById('webgl-canvas');
  const markersLayer = document.getElementById('markers-layer');
  const approachContainer = document.getElementById('approach-container');
  const hudContainer = document.getElementById('hud-container');
  const dossierContainer = document.getElementById('dossier-container');
  const traverseContainer = document.getElementById('traverse-container');
  const expeditionsContainer = document.getElementById('expeditions-container');
  const fallbackContainer = document.getElementById('fallback-container');

  // Verify WebGL capability
  if (!isWebGLAvailable()) {
    logger.warn('WebGL is not supported on this device. Initializing archival fallback mode.');
    store.dispatch(ActionTypes.SET_WEBGL_SUPPORT, false);
    if (canvas) canvas.style.display = 'none';
    await renderFallback(fallbackContainer);
    return;
  }

  // Initialize 3D Scene
  let scene;
  try {
    scene = new LunarScene(canvas, markersLayer);
    scene.start();
    store.dispatch(ActionTypes.SET_LOADING, false);
  } catch (err) {
    errorBoundary.handleError(err, 'SceneInitFailure');
    await renderFallback(fallbackContainer);
    return;
  }

  // Start Background Telemetry Ingestion
  telemetryService.fetchTelemetry();

  // Initialize Primary UI Controllers
  new ApproachOverlay(approachContainer);
  const hudController = new HUDController(hudContainer);

  const vidiconContainer = document.getElementById('vidicon-container');
  if (vidiconContainer) {
    new VidiconOverlay(vidiconContainer);
  }

  // Initialize Astronaut UI Component Suite
  new MissionAudioCapsule();
  new NavRail();
  new QuickSearch();
  new MissionStatsCard();

  // Lazy-loaded Modal Singletons
  let dossierDrawerInstance = null;
  async function getDossierDrawer() {
    if (!dossierDrawerInstance) {
      const { DossierDrawer } = await import('./ui/DossierDrawer.js');
      dossierDrawerInstance = new DossierDrawer(dossierContainer);
    }
    return dossierDrawerInstance;
  }

  let traverseModalInstance = null;
  async function getTraverseModal() {
    if (!traverseModalInstance) {
      const { TraverseModal } = await import('./ui/TraverseModal.js');
      traverseModalInstance = new TraverseModal(traverseContainer);
    }
    return traverseModalInstance;
  }

  let expeditionsModalInstance = null;
  async function getExpeditionsModal() {
    if (!expeditionsModalInstance) {
      const { ExpeditionsModal } = await import('./ui/ExpeditionsModal.js');
      expeditionsModalInstance = new ExpeditionsModal(expeditionsContainer);
    }
    return expeditionsModalInstance;
  }

  // Wire Lifecycle Events & State Machine
  eventBus.on('approach:complete', ({ immediate }) => {
    stateMachine.transitionTo(STATES.ENVIRONMENT);

    // Reveal HUD
    if (hudContainer) {
      hudContainer.style.display = 'flex';
      hudController.show();
    }

    // Reveal surface waypoint markers once descending to the landing site
    if (scene?.waypointMarkers) {
      setTimeout(() => {
        scene.waypointMarkers.setVisible(true, true);
      }, immediate ? 300 : 1600);
    }

    // Camera descend to site overview
    const duration = immediate ? 800 : 3200;
    scene.cameraController.setPreset('OVERVIEW', duration);
  });

  eventBus.on('artifact:selected', async ({ artifact }) => {
    if (stateMachine.current === STATES.ENVIRONMENT || stateMachine.current === STATES.APPROACH) {
      stateMachine.transitionTo(STATES.INSPECTION, artifact);
    }
    const drawer = await getDossierDrawer();
    drawer.open(artifact);
  });

  eventBus.on('ui:traverse:toggle', async () => {
    const modal = await getTraverseModal();
    modal.toggle();
  });

  eventBus.on('ui:expeditions:toggle', async () => {
    const modal = await getExpeditionsModal();
    modal.toggle();
  });

  eventBus.on('dossier:closed', () => {
    if (stateMachine.current === STATES.INSPECTION) {
      stateMachine.transitionTo(STATES.ENVIRONMENT);
      scene?.waypointMarkers?.setActive(null);
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing inside form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case KEYBOARD_SHORTCUTS.CAMERA_1:
        navigationService.setPreset('OVERVIEW');
        break;
      case KEYBOARD_SHORTCUTS.CAMERA_2:
        navigationService.setPreset('EYE_LEVEL');
        break;
      case KEYBOARD_SHORTCUTS.CAMERA_3:
        navigationService.setPreset('SURVEYOR_RIM');
        break;
      case KEYBOARD_SHORTCUTS.CAMERA_4:
        navigationService.setPreset('ALSEP_SITE');
        break;
      case KEYBOARD_SHORTCUTS.CAMERA_5:
        navigationService.setPreset('CELESTIAL_EARTH');
        break;
      case 't':
      case 'T':
        eventBus.emit('ui:traverse:toggle');
        break;
      case 'e':
      case 'E':
        eventBus.emit('ui:expeditions:toggle');
        break;
      case 'v':
      case 'V':
        eventBus.emit('ui:vidicon:toggle');
        break;
      case 'm':
      case 'M':
        audioService.toggleMute();
        break;
      default:
        break;
    }
  });

  logger.info('AFTERLIGHT — Architectural refactoring active. Monument operational.');
}

window.addEventListener('DOMContentLoaded', init);
