import * as THREE from 'three';
import { LunarLighting } from './LunarLighting.js';
import { LunarTerrain } from './LunarTerrain.js';
import { CameraController, CAMERA_PRESETS } from './CameraController.js';
import { LunarModule } from '../entities/LunarModule.js';
import { Surveyor3 } from '../entities/Surveyor3.js';
import { ALSEP } from '../entities/ALSEP.js';
import { FlagAndEquipment } from '../entities/FlagAndEquipment.js';
import { WaypointMarkers } from '../entities/WaypointMarkers.js';
import { ARTIFACTS } from '../data/artifactsData.js';
import { eventBus } from '../core/EventBus.js';

export class LunarScene {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLElement} markerContainer
   */
  constructor(canvas, markerContainer) {
    this.canvas = canvas;
    this.markerContainer = markerContainer;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.isRunning = false;
    this.animationFrameId = null;

    this.initRenderer();
    this.initScene();
    this.initEntities();
    this.initEventListeners();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Physically accurate rendering settings
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Lunar vacuum has no atmospheric scattering; background is deep space
    this.scene.background = new THREE.Color(0x010204);

    // Initialize camera controller
    this.cameraController = new CameraController(this.canvas, this.width / this.height);
    this.camera = this.cameraController.camera;

    // Initialize lighting and astronomical bodies
    this.lighting = new LunarLighting(this.scene);

    // Initialize terrain
    this.terrain = new LunarTerrain(this.scene, {
      sunDirection: this.lighting.sunDirection,
      size: 1000,
      segments: 256,
    });

    // Initialize waypoint 2D markers
    this.waypointMarkers = new WaypointMarkers(this.markerContainer);
  }

  async initEntities() {
    const elevationFn = (x, z) => this.terrain.getElevation(x, z);

    // 1. LM-6 Intrepid (Essential primary mission centerpiece)
    this.lunarModule = new LunarModule(this.scene, elevationFn);
    try {
      await this.lunarModule.init();
    } catch (err) {
      console.error('[LunarScene] LM-6 init failed:', err);
    }

    // 2. US Flag, PLSS backpacks, boots
    this.flagAndEquip = new FlagAndEquipment(this.scene, elevationFn);
    this.flagAndEquip.init();

    // Primary landing site is complete and rendered for approach
    eventBus.emit('scene:ready');

    // 3. Staged asynchronous loading of secondary mission stations
    // Surveyor 3 (163m away inside Surveyor Crater) & ALSEP (130m NW) load in parallel
    this.surveyor3 = new Surveyor3(this.scene, elevationFn);
    this.alsep = new ALSEP(this.scene, elevationFn);

    Promise.allSettled([
      this.surveyor3.init(),
      this.alsep.init()
    ]).then(([s3Result, alsepResult]) => {
      if (s3Result.status === 'rejected') {
        console.error('[LunarScene] Surveyor 3 init failed:', s3Result.reason);
      }
      if (alsepResult.status === 'rejected') {
        console.error('[LunarScene] ALSEP init failed:', alsepResult.reason);
      }
      eventBus.emit('artifacts:all-loaded');
    });
  }

  initEventListeners() {
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);

    // Listen for preset change events
    this.unbindPresetChange = eventBus.on('camera:preset', (presetKey) => {
      this.cameraController.setPreset(presetKey);
    });

    // Listen for artifact focus events
    this.unbindArtifactSelect = eventBus.on('artifact:selected', ({ id, artifact }) => {
      this.focusArtifact(id);
    });
  }

  /**
   * Focus camera smoothly on an artifact
   * @param {string} artifactId 
   */
  focusArtifact(artifactId) {
    const art = ARTIFACTS[artifactId];
    if (!art) return;

    this.waypointMarkers.setActive(artifactId);

    const targetPos = new THREE.Vector3(
      art.cameraFocus.position.x,
      art.cameraFocus.position.y,
      art.cameraFocus.position.z
    );

    const lookAtPos = new THREE.Vector3(
      art.cameraFocus.target.x,
      art.cameraFocus.target.y,
      art.cameraFocus.target.z
    );

    this.cameraController.flyTo(targetPos, lookAtPos, 2200);
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.cameraController.onResize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    const clock = new THREE.Clock();

    const loop = () => {
      if (!this.isRunning) return;
      this.animationFrameId = requestAnimationFrame(loop);

      const delta = clock.getDelta();

      // Update camera controls
      this.cameraController.update();

      // Subtle celestial rotation of Earth
      if (this.lighting) {
        this.lighting.update(delta);
      }

      // Project waypoint screen markers
      if (this.waypointMarkers) {
        this.waypointMarkers.update(this.camera, this.width, this.height);
      }

      // Render frame
      this.renderer.render(this.scene, this.camera);
    };

    loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  dispose() {
    this.stop();
    window.removeEventListener('resize', this.onWindowResize);
    if (this.unbindPresetChange) this.unbindPresetChange();
    if (this.unbindArtifactSelect) this.unbindArtifactSelect();

    this.cameraController.dispose();
    this.lighting.dispose();
    this.terrain.dispose();
    this.lunarModule.dispose();
    this.surveyor3.dispose();
    this.alsep.dispose();
    this.flagAndEquip.dispose();

    this.renderer.dispose();
  }
}
