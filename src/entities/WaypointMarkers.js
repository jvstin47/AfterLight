/**
 * AFTERLIGHT — Optical Reseau Waypoint Markers
 * Inspired by Apollo 70mm Hasselblad surface reseau plates.
 * Precise crosshair fiducial marks (+) with quiet tabular coordinates and distance tags.
 */

import * as THREE from 'three';
import { eventBus } from '../core/EventBus.js';
import { ARTIFACTS } from '../data/artifactsData.js';

export class WaypointMarkers {
  /**
   * @param {HTMLElement} container - The DOM container for marker elements
   */
  constructor(container) {
    this.container = container;
    this.markers = [];
    this.visible = false;
    this.container.style.display = 'none';
    this.container.style.opacity = '0';
    this.tempVec = new THREE.Vector3();

    this.init();
  }

  init() {
    this.container.innerHTML = '';

    Object.values(ARTIFACTS).forEach((artifact) => {
      const el = document.createElement('button');
      el.className = 'waypoint-marker';
      el.dataset.artifactId = artifact.id;
      el.setAttribute('aria-label', `Explore ${artifact.name}`);
      el.tabIndex = 0;

      el.innerHTML = `
        <div class="marker-fiducial" aria-hidden="true">
          <span class="fiducial-crosshair">+</span>
          <span class="fiducial-pip"></span>
        </div>
        <div class="marker-label">
          <div class="marker-meta-row">
            <span class="marker-tag">${artifact.designation}</span>
            <span class="marker-sep">&bull;</span>
            <span class="marker-distance" data-distance>-- m</span>
          </div>
          <div class="marker-name">${artifact.name}</div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        eventBus.emit('artifact:selected', { id: artifact.id, artifact });
      });

      this.container.appendChild(el);

      const pos = artifact.position || { x: 0, y: 0, z: 0 };
      this.markers.push({
        id: artifact.id,
        worldPosition: new THREE.Vector3(
          pos.x,
          pos.y + 1.6, // Slightly above center of object
          pos.z
        ),
        element: el,
        distanceEl: el.querySelector('[data-distance]'),
      });
    });
  }

  /**
   * Called on every animation frame from LunarScene
   */
  update(camera, screenWidth, screenHeight) {
    if (!this.visible) return;

    this.markers.forEach((marker) => {
      this.tempVec.copy(marker.worldPosition);

      // Distance calculation
      const dist = Math.round(camera.position.distanceTo(this.tempVec));
      if (marker.distanceEl) {
        marker.distanceEl.textContent = `${dist}m`;
      }

      // 3D to 2D projection
      this.tempVec.project(camera);

      // Behind the camera check
      const isBehind = this.tempVec.z > 1.0;
      // Viewport frustum bound check
      const isOffScreen =
        this.tempVec.x < -1.1 ||
        this.tempVec.x > 1.1 ||
        this.tempVec.y < -1.1 ||
        this.tempVec.y > 1.1;

      if (isBehind || isOffScreen) {
        marker.element.style.opacity = '0';
        marker.element.style.pointerEvents = 'none';
        return;
      }

      // Screen space conversion
      const screenX = (this.tempVec.x * 0.5 + 0.5) * screenWidth;
      const screenY = (-(this.tempVec.y * 0.5) + 0.5) * screenHeight;

      marker.element.style.opacity = '1';
      marker.element.style.pointerEvents = 'auto';
      marker.element.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
    });
  }

  setVisible(visible, fade = false) {
    this.visible = visible;
    if (visible) {
      this.container.style.display = 'block';
      if (fade) {
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 0.8s ease-out';
        requestAnimationFrame(() => {
          this.container.style.opacity = '1';
        });
      } else {
        this.container.style.opacity = '1';
      }
    } else {
      this.container.style.display = 'none';
      this.container.style.opacity = '0';
    }
  }

  setActive(activeId) {
    this.markers.forEach((m) => {
      if (m.id === activeId) {
        m.element.classList.add('is-active');
      } else {
        m.element.classList.remove('is-active');
      }
    });
  }
}
