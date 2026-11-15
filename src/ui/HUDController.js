/**
 * AFTERLIGHT — Exploration Interface Controller (HUD)
 * Field-instrument aesthetics, architectural hairlines, and precise interaction states.
 */

import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

export class HUDController {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.currentPreset = 'OVERVIEW';
    this.audioEnabled = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <!-- Top Bar: Archive Identity & Instrument Actions -->
      <header class="hud-topbar">
        <div class="hud-brand">
          <span class="hud-brand-title">AFTERLIGHT</span>
          <span class="hud-brand-sep" aria-hidden="true">&bull;</span>
          <span class="hud-brand-station">STATIO COGNITUM</span>
          <span class="hud-brand-sep mobile-hide" aria-hidden="true">&bull;</span>
          <span class="hud-brand-coords mobile-hide">3.01239° S, 23.42157° W</span>
        </div>

        <div class="hud-top-actions">
          <button id="btn-audio-toggle" class="hud-action-btn audio-btn" aria-label="Toggle Mission Audio">
            <span class="action-icon" aria-hidden="true">&#9834;</span>
            <span class="audio-status">AUDIO: MUTED</span>
          </button>
          <button id="btn-traverse" class="hud-action-btn traverse-btn" aria-label="View EVA Traverse Map">
            <span class="action-icon" aria-hidden="true">&boxbox;</span>
            <span>TRAVERSE MAP</span>
            <span class="key-shortcut mobile-hide">[T]</span>
          </button>
        </div>
      </header>

      <!-- Reseau Optical Crosshairs for Environment Framing -->
      <div class="hud-frame-crosshairs" aria-hidden="true">
        <span class="hud-crosshair top-left">+</span>
        <span class="hud-crosshair top-right">+</span>
        <span class="hud-crosshair bottom-left">+</span>
        <span class="hud-crosshair bottom-right">+</span>
      </div>

      <!-- Telemetry Column (Field Instrument Metadata) -->
      <aside class="hud-telemetry" aria-label="Landing Site Telemetry">
        <div class="telemetry-row">
          <span class="telemetry-label">SITE COORDINATES</span>
          <span class="telemetry-val">3.01239° S, 23.42157° W</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">REGION / REGOLITH</span>
          <span class="telemetry-val">OCEANUS PROCELLARUM &bull; BASALT</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">SOLAR INCIDENCE</span>
          <span class="telemetry-val">12.4° ESE (DAWN SUN)</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">LUNAR VACUUM</span>
          <span class="telemetry-val">10⁻¹² TORR &bull; +22°C REGOLITH</span>
        </div>
      </aside>

      <!-- Bottom Vantage Selector (Architectural Roman Hairline Bar) -->
      <nav class="hud-vantage-bar" aria-label="Camera Perspectives">
        <div class="vantage-label">
          <span class="label-text">OBSERVATION PERSPECTIVE</span>
          <span class="label-keys mobile-hide">[KEYS 1 &bull; 2 &bull; 3 &bull; 4]</span>
        </div>
        <div class="vantage-strip" role="radiogroup">
          <button class="vantage-pill is-active" data-preset="OVERVIEW" aria-checked="true">
            <span class="vantage-num">01</span>
            <span class="vantage-name">SITE OVERVIEW</span>
            <span class="vantage-active-line"></span>
          </button>
          <button class="vantage-pill" data-preset="EYE_LEVEL" aria-checked="false">
            <span class="vantage-num">02</span>
            <span class="vantage-name">ASTRONAUT EYE LEVEL</span>
            <span class="vantage-active-line"></span>
          </button>
          <button class="vantage-pill" data-preset="SURVEYOR_RIM" aria-checked="false">
            <span class="vantage-num">03</span>
            <span class="vantage-name">SURVEYOR CRATER RIM</span>
            <span class="vantage-active-line"></span>
          </button>
          <button class="vantage-pill" data-preset="ALSEP_SITE" aria-checked="false">
            <span class="vantage-num">04</span>
            <span class="vantage-name">ALSEP SCIENCE DEPLOY</span>
            <span class="vantage-active-line"></span>
          </button>
        </div>
      </nav>

      <!-- Interaction Guidance Hint -->
      <footer class="hud-footer-hint mobile-hide" aria-hidden="true">
        <span>DRAG TO ORBIT</span> &bull; <span>SCROLL TO ZOOM</span> &bull; <span>CLICK ARTIFACT FIDUCIALS TO INSPECT</span>
      </footer>
    `;
  }

  bindEvents() {
    // Vantage buttons
    const pills = this.container.querySelectorAll('.vantage-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const preset = pill.dataset.preset;
        this.setActivePreset(preset);
        eventBus.emit('camera:preset', preset);
      });
    });

    // Audio toggle
    const audioBtn = this.container.querySelector('#btn-audio-toggle');
    const audioStatus = this.container.querySelector('.audio-status');
    audioBtn?.addEventListener('click', () => {
      audioManager.init();
      const enabled = audioManager.toggleMute();
      this.audioEnabled = enabled;
      if (enabled) {
        audioStatus.textContent = 'AUDIO: LIVE';
        audioBtn.classList.add('is-active');
        audioManager.playQuindarIntro();
      } else {
        audioStatus.textContent = 'AUDIO: MUTED';
        audioBtn.classList.remove('is-active');
      }
    });

    // Traverse Map toggle
    const traverseBtn = this.container.querySelector('#btn-traverse');
    traverseBtn?.addEventListener('click', () => {
      eventBus.emit('ui:traverse:toggle');
    });

    // Synchronize preset button states on external camera change
    eventBus.on('camera:preset', (preset) => {
      this.setActivePreset(preset);
    });

    // When an artifact is selected, deselect vantage pills
    eventBus.on('artifact:selected', () => {
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-checked', 'false');
      });
    });
  }

  setActivePreset(presetKey) {
    this.currentPreset = presetKey;
    const pills = this.container.querySelectorAll('.vantage-pill');
    pills.forEach((pill) => {
      if (pill.dataset.preset === presetKey) {
        pill.classList.add('is-active');
        pill.setAttribute('aria-checked', 'true');
      } else {
        pill.classList.remove('is-active');
        pill.setAttribute('aria-checked', 'false');
      }
    });
  }

  show() {
    this.container.style.display = 'flex';
    this.container.style.opacity = '1';
    this.container.style.pointerEvents = 'auto';
  }

  hide() {
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';
  }
}
