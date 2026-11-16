import { LunarScene } from './scene/LunarScene.js';
import { stateMachine, STATES } from './core/StateMachine.js';
import { eventBus } from './core/EventBus.js';
import { audioManager } from './core/AudioManager.js';
import { ApproachOverlay } from './ui/ApproachOverlay.js';
import { HUDController } from './ui/HUDController.js';
import { VidiconOverlay } from './ui/VidiconOverlay.js';
import { MissionAudioCapsule } from './ui/MissionAudioCapsule.js';
import { NavRail } from './ui/NavRail.js';
import { QuickSearch } from './ui/QuickSearch.js';
import { MissionStatsCard } from './ui/MissionStatsCard.js';

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

async function renderFallback(fallbackContainer) {
  if (fallbackContainer) {
    fallbackContainer.style.display = 'block';
    const { FallbackView } = await import('./ui/FallbackView.js');
    new FallbackView(fallbackContainer);
  }
}

async function init() {
  const canvas = document.getElementById('webgl-canvas');
  const markersLayer = document.getElementById('markers-layer');
  const approachContainer = document.getElementById('approach-container');
  const hudContainer = document.getElementById('hud-container');
  const dossierContainer = document.getElementById('dossier-container');
  const traverseContainer = document.getElementById('traverse-container');
  const fallbackContainer = document.getElementById('fallback-container');

  // Verify WebGL capability
  if (!isWebGLAvailable()) {
    console.warn('WebGL is not supported on this device. Initializing archival fallback mode.');
    if (canvas) canvas.style.display = 'none';
    await renderFallback(fallbackContainer);
    return;
  }

  // Initialize 3D Scene
  let scene;
  try {
    scene = new LunarScene(canvas, markersLayer);
    scene.start();
  } catch (err) {
    console.error('Failed to initialize 3D scene:', err);
    await renderFallback(fallbackContainer);
    return;
  }

  // Initialize Primary UI Controllers
  const approachOverlay = new ApproachOverlay(approachContainer);
  const hudController = new HUDController(hudContainer);

  const vidiconContainer = document.getElementById('vidicon-container');
  if (vidiconContainer) {
    new VidiconOverlay(vidiconContainer);
  }

  // Initialize Astronaut UI Component Suite
  const audioCapsule = new MissionAudioCapsule();
  const navRail = new NavRail();
  const quickSearch = new QuickSearch();
  const statsCard = new MissionStatsCard();

  eventBus.on('audio:toggle', () => {
    audioManager.init();
    audioManager.toggleMute();
  });

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

  // Wire Events & State Machine
  eventBus.on('approach:complete', ({ immediate }) => {
    stateMachine.transitionTo(STATES.ENVIRONMENT);

    // Show HUD
    if (hudContainer) {
      hudContainer.style.display = 'flex';
      hudController.show();
    }

    // Reveal surface waypoint markers once descending to the landing site
    if (scene && scene.waypointMarkers) {
      scene.waypointMarkers.setVisible(true, !immediate);
    }

    // Camera descend to site overview
    const duration = immediate ? 800 : 3200;
    scene.cameraController.setPreset('OVERVIEW', duration);
  });

  eventBus.on('artifact:selected', async ({ id, artifact }) => {
    if (stateMachine.current === STATES.ENVIRONMENT || stateMachine.current === STATES.APPROACH) {
      stateMachine.transitionTo(STATES.INSPECTION);
    }
    const drawer = await getDossierDrawer();
    drawer.open(artifact);
  });

  eventBus.on('ui:traverse:toggle', async () => {
    const modal = await getTraverseModal();
    modal.toggle();
  });

  eventBus.on('dossier:closed', () => {
    if (stateMachine.current === STATES.INSPECTION) {
      stateMachine.transitionTo(STATES.ENVIRONMENT);
      scene.waypointMarkers.setActive(null);
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing inside form inputs (if any)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === '1') {
      eventBus.emit('camera:preset', 'OVERVIEW');
    } else if (e.key === '2') {
      eventBus.emit('camera:preset', 'EYE_LEVEL');
    } else if (e.key === '3') {
      eventBus.emit('camera:preset', 'SURVEYOR_RIM');
    } else if (e.key === '4') {
      eventBus.emit('camera:preset', 'ALSEP_SITE');
    } else if (e.key === 't' || e.key === 'T') {
      eventBus.emit('ui:traverse:toggle');
    } else if (e.key === 'v' || e.key === 'V') {
      eventBus.emit('ui:vidicon:toggle');
    } else if (e.key === 'm' || e.key === 'M') {
      audioManager.init();
      const enabled = audioManager.toggleMute();
      const audioBtn = document.querySelector('#btn-audio-toggle');
      const audioStatus = document.querySelector('.audio-status');
      if (audioStatus && audioBtn) {
        audioStatus.textContent = enabled ? 'AUDIO: LIVE' : 'AUDIO: MUTED';
        audioBtn.classList.toggle('is-active', enabled);
      }
    }
  });

  console.log('AFTERLIGHT — Phase 02 Lunar Environment initialized.');
}

window.addEventListener('DOMContentLoaded', init);
