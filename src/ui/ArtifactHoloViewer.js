/**
 * AFTERLIGHT — Interactive 3D Artifact Holo-Viewer
 * Embedded interactive real-time WebGL plinth for the Atlas 4-tier inspector drawer.
 * Allows 360° orbit, zoom, subsystem inspection, and 1-click surface teleportation.
 */

import * as THREE from 'three';
import { createLunokhodRover } from '../entities/LunokhodRover.js';
import { createApolloLRV } from '../entities/ApolloLRV.js';
import { createYutuRover } from '../entities/YutuRover.js';
import { createPragyanRover } from '../entities/PragyanRover.js';
import { createSLIMSoraQ } from '../entities/SLIMSoraQ.js';
import { createSovietLunaLander } from '../entities/SovietLunaLander.js';
import { eventBus } from '../core/EventBus.js';
import { audioService } from '../services/AudioService.js';

export class ArtifactHoloViewer {
  /**
   * @param {HTMLElement} mountElement
   */
  constructor(mountElement) {
    this.mountElement = mountElement;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.modelGroup = null;
    this.animationFrameId = null;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.2, y: 0.6 };
    this.currentRotation = { x: 0.2, y: 0.6 };
    this.zoom = 3.6;
    this.targetZoom = 3.6;
    this.isWireframe = false;
  }

  /**
   * Mounts and renders an interactive 3D model for an artifact
   * @param {string} entityType
   * @param {string} siteId
   */
  mount(entityType, siteId) {
    this.destroy();

    const width = this.mountElement.clientWidth || 400;
    const height = 240;

    // Create container shell with controls
    this.mountElement.innerHTML = `
      <div class="holo-viewer-container" style="position:relative;width:100%;height:${height}px;background:radial-gradient(circle at 50% 50%, rgba(18, 24, 38, 0.7) 0%, rgba(6, 9, 14, 0.95) 100%);border:1px solid rgba(255,255,255,0.12);border-radius:10px;overflow:hidden;">
        <canvas class="holo-canvas" style="width:100%;height:100%;display:block;cursor:grab;"></canvas>
        <div class="holo-badge" style="position:absolute;top:10px;left:12px;font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.12em;color:var(--color-archival-amber);text-transform:uppercase;background:rgba(4,6,10,0.85);padding:3px 8px;border-radius:4px;border:1px solid rgba(223,172,78,0.3);pointer-events:none;">
          3D HOLO-PLINTH &bull; INTERACTIVE
        </div>
        <div class="holo-controls" style="position:absolute;top:10px;right:12px;display:flex;gap:6px;">
          <button class="holo-wire-btn" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#9ca3af;font-family:var(--font-mono);font-size:9px;padding:3px 8px;border-radius:4px;cursor:pointer;">WIRE</button>
          <button class="holo-reset-btn" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#9ca3af;font-family:var(--font-mono);font-size:9px;padding:3px 8px;border-radius:4px;cursor:pointer;">RESET</button>
        </div>
        <div class="holo-footer" style="position:absolute;bottom:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;">
          <span style="font-family:var(--font-mono);font-size:9px;color:rgba(255,255,255,0.45);letter-spacing:0.06em;">DRAG TO ORBIT &bull; SCROLL TO ZOOM</span>
          <button class="holo-warp-btn" style="pointer-events:auto;background:linear-gradient(135deg, rgba(223,172,78,0.25) 0%, rgba(223,172,78,0.08) 100%);border:1px solid var(--color-archival-amber);color:var(--color-archival-amber);font-family:var(--font-mono);font-size:10px;font-weight:600;padding:5px 12px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;">
            <span>WARP TO SURFACE</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </button>
        </div>
      </div>
    `;

    const canvas = this.mountElement.querySelector('.holo-canvas');
    const wireBtn = this.mountElement.querySelector('.holo-wire-btn');
    const resetBtn = this.mountElement.querySelector('.holo-reset-btn');
    const warpBtn = this.mountElement.querySelector('.holo-warp-btn');

    // 1. Three.js Scene Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    this.camera.position.set(0, 1.2, this.zoom);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight.position.set(3, 5, 4);
    this.scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xdfac4e, 0.9);
    rimLight.position.set(-3, -2, -3);
    this.scene.add(rimLight);

    // Subtle reflective plinth disc
    const plinthGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.04, 32);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.5,
      metalness: 0.85,
      wireframe: false
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -0.02;
    this.scene.add(plinth);

    // Grid on plinth
    const grid = new THREE.PolarGridHelper(1.5, 8, 4, 32, 0xdfac4e, 0x334155);
    grid.position.y = 0.005;
    this.scene.add(grid);

    // 2. Instantiate 3D Model
    this.modelGroup = new THREE.Group();
    const entity = this.createEntityModel(entityType);
    if (entity) {
      this.modelGroup.add(entity);
    }
    this.scene.add(this.modelGroup);

    // 3. User Interactions (Drag Orbit & Zoom)
    canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      canvas.style.cursor = 'grabbing';
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.012;
      this.targetRotation.x = Math.max(-0.4, Math.min(0.8, this.targetRotation.x + deltaY * 0.01));

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      if (canvas) canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetZoom = Math.max(1.8, Math.min(6.5, this.targetZoom + e.deltaY * 0.004));
    }, { passive: false });

    // Buttons
    wireBtn?.addEventListener('click', () => {
      this.isWireframe = !this.isWireframe;
      wireBtn.style.color = this.isWireframe ? 'var(--color-archival-amber)' : '#9ca3af';
      this.modelGroup.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.wireframe = this.isWireframe;
        }
      });
    });

    resetBtn?.addEventListener('click', () => {
      this.targetRotation = { x: 0.2, y: 0.6 };
      this.targetZoom = 3.6;
    });

    warpBtn?.addEventListener('click', () => {
      audioService.playQuindarIntro();
      eventBus.emit('site:transit-requested', siteId);
      // Close expeditions modal so visitor arrives on the surface
      eventBus.emit('ui:expeditions:close');
    });

    // 4. Render Loop
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      // Auto gentle idle drift when not dragging
      if (!this.isDragging) {
        this.targetRotation.y += 0.003;
      }

      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
      this.zoom += (this.targetZoom - this.zoom) * 0.08;

      if (this.modelGroup) {
        this.modelGroup.rotation.x = this.currentRotation.x;
        this.modelGroup.rotation.y = this.currentRotation.y;
      }

      this.camera.position.z = this.zoom;
      this.camera.lookAt(0, 0.4, 0);

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  createEntityModel(entityType) {
    const dummyElevation = () => 0;
    switch (entityType) {
      case 'lunokhod-1':
        return createLunokhodRover(dummyElevation, { isLunokhod2: false });
      case 'lunokhod-2':
        return createLunokhodRover(dummyElevation, { isLunokhod2: true });
      case 'apollo-15-lrv':
        return createApolloLRV(dummyElevation, { mission: 'Apollo 15' });
      case 'apollo-16-lrv':
        return createApolloLRV(dummyElevation, { mission: 'Apollo 16' });
      case 'apollo-17-lrv':
        return createApolloLRV(dummyElevation, { mission: 'Apollo 17' });
      case 'change-3-yutu':
        return createYutuRover(dummyElevation, { isYutu2: false });
      case 'change-4-yutu2':
        return createYutuRover(dummyElevation, { isYutu2: true });
      case 'chandrayaan-3-pragyan':
        return createPragyanRover(dummyElevation);
      case 'slim-sora-q':
        return createSLIMSoraQ(dummyElevation);
      case 'luna-9':
        return createSovietLunaLander(dummyElevation, { type: 'luna-9' });
      case 'luna-16':
        return createSovietLunaLander(dummyElevation, { type: 'luna-16' });
      case 'luna-2':
        return createSovietLunaLander(dummyElevation, { type: 'luna-2' });
      default:
        // Generic fallback rover
        return createLunokhodRover(dummyElevation);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.scene) {
      this.scene.clear();
      this.scene = null;
    }
  }
}
