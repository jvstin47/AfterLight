import * as THREE from 'three';
import { LunarLighting } from './LunarLighting.js';
import { LunarTerrain } from './LunarTerrain.js';
import { CameraController, CAMERA_PRESETS } from './CameraController.js';
import { LunarModule } from '../entities/LunarModule.js';
import { Surveyor3 } from '../entities/Surveyor3.js';
import { ALSEP } from '../entities/ALSEP.js';
import { FlagAndEquipment } from '../entities/FlagAndEquipment.js';
import { WaypointMarkers } from '../entities/WaypointMarkers.js';
import { SpatialProjector } from './SpatialProjector.js';
import { GlobalSiteManager } from './GlobalSiteManager.js';
import { ARTIFACTS } from '../data/artifactsData.js';
import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

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

    // Interactive 3D raycasting and touch target detection
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerDownPos = { x: 0, y: 0, time: 0 };
    this.interactiveRoots = [];

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

    // Initialize lighting and astronomical bodies
    this.lighting = new LunarLighting(this.scene);

    // Initialize terrain
    this.terrain = new LunarTerrain(this.scene, {
      sunDirection: this.lighting.sunDirection,
      size: 1000,
      segments: 256,
    });

    // Initialize camera controller with terrain elevation function for collision clamping
    this.cameraController = new CameraController(
      this.canvas,
      this.width / this.height,
      (x, z) => this.terrain.getElevation(x, z)
    );
    this.camera = this.cameraController.camera;

    // Initialize waypoint 2D markers
    this.waypointMarkers = new WaypointMarkers(this.markerContainer);

    // Initialize in-scene 3D Spatial Projector for archival photographs & typography
    this.spatialProjector = new SpatialProjector(this.scene, (x, z) => this.terrain.getElevation(x, z));
    this.interactiveRoots.push(this.spatialProjector.group);
  }

  async initEntities() {
    const elevationFn = (x, z) => this.terrain.getElevation(x, z);

    // 1. LM-6 Intrepid (Essential primary mission centerpiece)
    this.lunarModule = new LunarModule(this.scene, elevationFn);
    try {
      await this.lunarModule.init();
      if (this.lunarModule.group) {
        this.interactiveRoots.push(this.lunarModule.group);
      }
    } catch (err) {
      console.error('[LunarScene] LM-6 init failed:', err);
    }

    // 2. US Flag, SWC Experiment, TV Camera, PLSS backpacks, boots
    this.flagAndEquip = new FlagAndEquipment(this.scene, elevationFn);
    this.flagAndEquip.init();
    if (this.flagAndEquip.group) {
      this.interactiveRoots.push(this.flagAndEquip.group);
    }

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
      } else if (this.surveyor3.group) {
        this.interactiveRoots.push(this.surveyor3.group);
      }
      if (alsepResult.status === 'rejected') {
        console.error('[LunarScene] ALSEP init failed:', alsepResult.reason);
      } else if (this.alsep.group) {
        this.interactiveRoots.push(this.alsep.group);
      }
      eventBus.emit('artifacts:all-loaded');
    });

    // 4. Global Multi-Site Transit Manager (Soviet, Chinese, Indian, Japanese & Apollo sites)
    this.globalSiteManager = new GlobalSiteManager(this.scene, elevationFn);
  }

  getArtifactIdFromObject(obj) {
    let curr = obj;
    while (curr && curr !== this.scene) {
      if (curr.userData && curr.userData.artifactId) {
        return curr.userData.artifactId;
      }
      curr = curr.parent;
    }
    return null;
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

    // Toggle Apollo 12 base site visibility when transiting to another world site
    eventBus.on('scene:statio-cognitum-visibility', (visible) => {
      if (this.lunarModule?.group) this.lunarModule.group.visible = visible;
      if (this.flagAndEquip?.group) this.flagAndEquip.group.visible = visible;
      if (this.surveyor3?.group) this.surveyor3.group.visible = visible;
      if (this.alsep?.group) this.alsep.group.visible = visible;
      if (this.spatialProjector?.group) this.spatialProjector.group.visible = visible;
      if (this.markerContainer) {
        this.markerContainer.style.display = visible ? 'block' : 'none';
      }
    });

    // Site transited event: smooth camera trajectory to the new rover / lander
    eventBus.on('site:transited', (site) => {
      if (site.id !== 'statio-cognitum') {
        const targetPos = new THREE.Vector3(0, 0.75, 0);
        const camPos = new THREE.Vector3(0, 1.85, 3.8);
        this.cameraController.flyTo(camPos, targetPos, 2000);
      } else {
        this.cameraController.setPreset('overview');
      }

      // Hide Earth if far side (e.g. Chang'e 4)
      if (this.lighting && this.lighting.earthMesh) {
        this.lighting.earthMesh.visible = site.hasEarth !== false;
      }
    });

    // Direct 3D Raycasting & Touch Targets on lander models
    this.onPointerDown = (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    };

    this.onPointerUp = (e) => {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      const elapsed = performance.now() - this.pointerDownPos.time;

      // Distinguish tap / click from camera orbit drag gesture
      if (Math.hypot(dx, dy) < 10 && elapsed < 500) {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveRoots, true);

        for (const hit of intersects) {
          const artifactId = this.getArtifactIdFromObject(hit.object);
          if (artifactId && ARTIFACTS[artifactId]) {
            eventBus.emit('artifact:selected', { id: artifactId, artifact: ARTIFACTS[artifactId] });
            break;
          }
        }
      }
    };

    this.onPointerMove = (e) => {
      if (e.buttons > 0) return; // Orbiting/dragging

      const rect = this.canvas.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveRoots, true);
      const isOverInteractive = intersects.some((hit) => this.getArtifactIdFromObject(hit.object));

      this.canvas.style.cursor = isOverInteractive ? 'pointer' : '';
    };

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
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

      // Subtle celestial rotation of Earth & solar billboard alignment
      if (this.lighting) {
        this.lighting.update(delta, this.camera);
      }

      // Project waypoint screen markers
      if (this.waypointMarkers) {
        this.waypointMarkers.update(this.camera, this.width, this.height);
      }

      // Update in-scene 3D spatial archival plates orientation and distance fading
      if (this.spatialProjector) {
        this.spatialProjector.update(this.camera);
      }

      // Update 3D spatial audio listener position and orientation
      audioManager.updateListener(this.camera);

      // Real-time camera telemetry stream for Vidicon overlay & field instruments
      this.telemetryFrameCount = (this.telemetryFrameCount || 0) + 1;
      if (this.telemetryFrameCount % 12 === 0) {
        const camPos = this.camera.position;
        const target = this.cameraController.controls.target;
        const dx = target.x - camPos.x;
        const dz = target.z - camPos.z;
        const dy = target.y - camPos.y;

        let azRad = Math.atan2(dx, -dz);
        if (azRad < 0) azRad += Math.PI * 2;
        const azDeg = (azRad * 180) / Math.PI;

        const bearings = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const bIdx = Math.round(azDeg / 22.5) % 16;

        const horizDist = Math.hypot(dx, dz);
        const elDeg = (Math.atan2(dy, horizDist) * 180) / Math.PI;
        const range = camPos.distanceTo(target);

        eventBus.emit('camera:telemetry', {
          azimuth: azDeg,
          bearing: bearings[bIdx],
          elevation: elDeg,
          range
        });
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
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    if (this.unbindPresetChange) this.unbindPresetChange();
    if (this.unbindArtifactSelect) this.unbindArtifactSelect();

    this.cameraController.dispose();
    this.lighting.dispose();
    this.terrain.dispose();
    this.lunarModule.dispose();
    this.surveyor3.dispose();
    this.alsep.dispose();
    this.flagAndEquip.dispose();
    if (this.spatialProjector) this.spatialProjector.dispose();

    this.renderer.dispose();
  }
}
