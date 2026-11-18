/**
 * AFTERLIGHT — 1969 Surveyor 3 Vidicon Telemetry & Hasselblad Reseau Mode
 * Reconstructs the 600-line slow-scan television camera raster and
 * 25-point optical Reseau fiducial grid (Apollo 70mm Hasselblad calibration).
 */

import { eventBus } from '../core/EventBus.js';
import { audioService } from '../services/AudioService.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';

export class VidiconOverlay {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    this.container = container;
    this.isActive = false;
    this.canvasEl = document.getElementById('webgl-canvas');

    this.render();
    this.bindEvents();
  }

  render() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'vidicon-overlay';
    this.overlay.setAttribute('aria-hidden', 'true');

    // 1. CRT Frame Vignette & Phosphor Shadow
    const crtFrame = document.createElement('div');
    crtFrame.className = 'vidicon-crt-frame';

    // 2. 600-Line Vidicon Scanline Raster Pattern
    const scanlines = document.createElement('div');
    scanlines.className = 'vidicon-scanlines';

    // 3. Slow-Scan Sweep Line
    const sweepBar = document.createElement('div');
    sweepBar.className = 'vidicon-sweep-bar';

    // 4. 25-Point Reseau Optical Grid (5x5 fiducial crosses at 10%, 30%, 50%, 70%, 90%)
    const reseauGrid = document.createElement('div');
    reseauGrid.className = 'vidicon-reseau-grid';

    const coords = [10, 30, 50, 70, 90];
    for (let r = 0; r < coords.length; r++) {
      for (let c = 0; c < coords.length; c++) {
        const cross = document.createElement('span');
        cross.className = 'reseau-cross';
        if (coords[r] === 50 && coords[c] === 50) {
          cross.classList.add('center-fiducial');
          cross.textContent = '+';
        } else {
          cross.textContent = '+';
        }
        cross.style.top = `${coords[r]}%`;
        cross.style.left = `${coords[c]}%`;
        reseauGrid.appendChild(cross);
      }
    }

    // 5. Archival Telemetry Corners
    const tlCorner = document.createElement('div');
    tlCorner.className = 'vidicon-telemetry-corner top-left';
    tlCorner.innerHTML = `
      <div><span class="telemetry-pulse"></span><span class="tag-highlight">SURVEYOR III VIDICON STREAM</span></div>
      <div>SCAN: 600-LINE SLOW-SCAN &bull; 1.2 SEC/FR</div>
      <div>BANDWIDTH: 220 kHz FM SUBCARRIER</div>
    `;

    const trCorner = document.createElement('div');
    trCorner.className = 'vidicon-telemetry-corner top-right';
    trCorner.innerHTML = `
      <div>OPTICAL REF: <span class="tag-highlight">HASSELBLAD 70mm</span></div>
      <div>RESEAU PLATE: 10.0mm CALIBRATION</div>
      <div>DISTORTION: &lt; 0.002% ARCHIVAL</div>
    `;

    this.blCorner = document.createElement('div');
    this.blCorner.className = 'vidicon-telemetry-corner bottom-left';
    this.blCorner.innerHTML = `
      <div>CAMERA BEARING: <span id="v-telemetry-az" class="tag-highlight">084.6° ESE</span></div>
      <div>SOLAR ELEVATION: <span id="v-telemetry-el" class="tag-highlight">12.4° DAWN</span></div>
      <div>TARGET RANGE: <span id="v-telemetry-rng" class="tag-highlight">163m SURVEYOR III</span></div>
    `;

    const brCorner = document.createElement('div');
    brCorner.className = 'vidicon-telemetry-corner bottom-right';
    brCorner.innerHTML = `
      <div>DOWNLINK: <span class="tag-highlight">GOLDSTONE DSN 64m</span></div>
      <div>CARRIER: S-BAND 2287.5 MHz (LOCKED)</div>
      <div>FRAME SYNC: PCM PCM-SPL-M</div>
    `;

    this.overlay.appendChild(crtFrame);
    this.overlay.appendChild(scanlines);
    this.overlay.appendChild(sweepBar);
    this.overlay.appendChild(reseauGrid);
    this.overlay.appendChild(tlCorner);
    this.overlay.appendChild(trCorner);
    this.overlay.appendChild(this.blCorner);
    this.overlay.appendChild(brCorner);

    this.container.appendChild(this.overlay);
  }

  bindEvents() {
    eventBus.on('ui:vidicon:toggle', () => {
      this.toggle();
    });

    eventBus.on('camera:telemetry', (data) => {
      this.updateTelemetry(data);
    });
  }

  toggle() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.overlay.classList.add('is-active');
      document.body.classList.add('vidicon-active');
      if (this.canvasEl) this.canvasEl.classList.add('vidicon-mode');
      audioService.playQuindarIntro();
    } else {
      this.overlay.classList.remove('is-active');
      document.body.classList.remove('vidicon-active');
      if (this.canvasEl) this.canvasEl.classList.remove('vidicon-mode');
    }

    store.dispatch(ActionTypes.SET_VIDICON_SCAN, this.isActive);

    eventBus.emit('vidicon:toggled', this.isActive);
    return this.isActive;
  }

  updateTelemetry(data) {
    if (!this.isActive || !data) return;
    const azEl = this.blCorner.querySelector('#v-telemetry-az');
    const elEl = this.blCorner.querySelector('#v-telemetry-el');
    const rngEl = this.blCorner.querySelector('#v-telemetry-rng');

    if (azEl && data.azimuth !== undefined) {
      azEl.textContent = `${data.azimuth.toFixed(1)}° ${data.bearing || ''}`;
    }
    if (elEl && data.elevation !== undefined) {
      elEl.textContent = `${data.elevation.toFixed(1)}°`;
    }
    if (rngEl && data.range !== undefined) {
      rngEl.textContent = `${Math.round(data.range)}m TO TARGET`;
    }
  }

  dispose() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}
