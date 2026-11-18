/**
 * AFTERLIGHT — Exploration Interface Controller (HUD)
 * Field-instrument aesthetics, architectural hairlines, and precise interaction states.
 * Refactored to pure presentation consuming services and the reactive Store.
 */

import { eventBus } from '../core/EventBus.js';
import { audioService } from '../services/AudioService.js';
import { navigationService } from '../services/NavigationService.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { ASTRONOMY } from '../config/constants.js';

export class HUDController {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.currentPreset = store.getState().camera.activePreset;
    this._unsubscribeStore = null;

    this.render();
    this.bindEvents();
    this.setupStoreSubscriptions();
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
          <button id="btn-expeditions" class="hud-action-btn expeditions-btn" aria-label="Explore Lunar Rovers and Landing Sites">
            <span class="action-icon" aria-hidden="true">&Delta;</span>
            <span>ROVERS & SITES</span>
            <span class="key-shortcut mobile-hide">[E]</span>
          </button>
          <button id="btn-vidicon" class="hud-action-btn vidicon-btn" aria-label="Toggle 1969 Surveyor Vidicon Telemetry Scan">
            <span class="action-icon" aria-hidden="true">&odot;</span>
            <span>VIDICON SCAN</span>
            <span class="key-shortcut mobile-hide">[V]</span>
          </button>
          <button id="btn-audio-toggle" class="hud-action-btn audio-btn" aria-label="Toggle Mission Audio">
            <span class="action-icon" aria-hidden="true">&#9834;</span>
            <span class="audio-status">AUDIO: ${store.getState().audio.isMuted ? 'MUTED' : 'LIVE'}</span>
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
          <span class="telemetry-val">${ASTRONOMY.SOLAR_INCIDENCE_DEG}° ESE (DAWN SUN)</span>
        </div>
        <div class="telemetry-row">
          <span class="telemetry-label">LUNAR VACUUM</span>
          <span class="telemetry-val">${ASTRONOMY.VACUUM_TORR} &bull; +${ASTRONOMY.LUNAR_DAY_TEMP_C}°C REGOLITH</span>
        </div>
      </aside>

      <!-- Bottom Vantage Selector (Architectural Roman Hairline Bar) -->
      <nav class="hud-vantage-bar" aria-label="Camera Perspectives">
        <div class="vantage-label">
          <span class="label-text">OBSERVATION PERSPECTIVE</span>
          <span class="label-keys mobile-hide">[KEYS 1 &bull; 2 &bull; 3 &bull; 4 &bull; 5]</span>
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
          <button class="vantage-pill" data-preset="CELESTIAL_EARTH" aria-checked="false">
            <span class="vantage-num">05</span>
            <span class="vantage-name">EARTH FROM STATIO COGNITUM</span>
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
        navigationService.setPreset(preset);
      });
    });

    // Audio toggle
    const audioBtn = this.container.querySelector('#btn-audio-toggle');
    const audioStatus = this.container.querySelector('.audio-status');
    audioBtn?.addEventListener('click', () => {
      const isLive = audioService.toggleMute();
      if (isLive) {
        audioService.playQuindarIntro();
      }
    });

    // Expeditions / Rovers toggle
    const expeditionsBtn = this.container.querySelector('#btn-expeditions');
    expeditionsBtn?.addEventListener('click', () => {
      audioService.playClick();
      eventBus.emit('ui:expeditions:toggle');
    });

    // Traverse Map toggle
    const traverseBtn = this.container.querySelector('#btn-traverse');
    traverseBtn?.addEventListener('click', () => {
      audioService.playClick();
      eventBus.emit('ui:traverse:toggle');
    });

    // Vidicon Mode toggle
    const vidiconBtn = this.container.querySelector('#btn-vidicon');
    vidiconBtn?.addEventListener('click', () => {
      audioService.playClick();
      store.dispatch(ActionTypes.TOGGLE_VIDICON_SCAN);
      eventBus.emit('ui:vidicon:toggle');
    });
  }

  setupStoreSubscriptions() {
    // Reactive Audio Subscription
    const audioBtn = this.container.querySelector('#btn-audio-toggle');
    const audioStatus = this.container.querySelector('.audio-status');

    store.subscribe(
      (s) => s.audio.isMuted,
      (isMuted) => {
        if (audioStatus && audioBtn) {
          audioStatus.textContent = isMuted ? 'AUDIO: MUTED' : 'AUDIO: LIVE';
          audioBtn.classList.toggle('is-active', !isMuted);
        }
      }
    );

    // Reactive Camera Preset Subscription
    store.subscribe(
      (s) => s.camera.activePreset,
      (preset) => {
        this.setActivePreset(preset);
      }
    );

    // Reactive Modals Active Classes
    const expeditionsBtn = this.container.querySelector('#btn-expeditions');
    store.subscribe(
      (s) => s.modals.isExpeditionsOpen,
      (isOpen) => {
        expeditionsBtn?.classList.toggle('is-active', isOpen);
      }
    );

    const vidiconBtn = this.container.querySelector('#btn-vidicon');
    store.subscribe(
      (s) => s.modals.isVidiconActive,
      (isActive) => {
        vidiconBtn?.classList.toggle('is-active', isActive);
      }
    );

    // When an artifact is selected, clear active pill
    store.subscribe(
      (s) => s.inspection.isOpen,
      (isOpen) => {
        if (isOpen) {
          const pills = this.container.querySelectorAll('.vantage-pill');
          pills.forEach((p) => {
            p.classList.remove('is-active');
            p.setAttribute('aria-checked', 'false');
          });
        }
      }
    );
  }

  setActivePreset(presetKey) {
    this.currentPreset = presetKey;
    const pills = this.container.querySelectorAll('.vantage-pill');
    pills.forEach((pill) => {
      const isSelected = pill.dataset.preset === presetKey;
      pill.classList.toggle('is-active', isSelected);
      pill.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
  }

  show() {
    this.container.style.display = 'flex';
    this.container.style.opacity = '1';
    this.container.style.pointerEvents = 'none';
  }

  hide() {
    this.container.style.opacity = '0';
    this.container.style.pointerEvents = 'none';
  }
}
