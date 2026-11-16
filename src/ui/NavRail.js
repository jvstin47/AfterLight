/**
 * AFTERLIGHT — Modern Navigation Dock Rail (.cir-rail)
 * Provides rapid one-click access to all primary instrument overlays and vantage modes.
 */

import { eventBus } from '../core/EventBus.js';

export class NavRail {
  constructor() {
    this.container = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container = document.createElement('nav');
    this.container.className = 'cir-rail';
    this.container.style.opacity = '0';
    this.container.style.transition = 'opacity 0.6s ease';
    this.container.setAttribute('aria-label', 'Mission Navigation Dock');

    this.container.innerHTML = `
      <!-- 1. Reset / Overview -->
      <button id="rail-btn-overview" class="cir-rail__b cir-rail__b--active" type="button" aria-label="Reset Camera to Site Overview [1]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="22" y1="12" x2="18" y2="12"></line>
          <line x1="6" y1="12" x2="2" y2="12"></line>
          <line x1="12" y1="6" x2="12" y2="2"></line>
          <line x1="12" y1="22" x2="12" y2="18"></line>
        </svg>
      </button>

      <span class="cir-rail__sep" aria-hidden="true"></span>

      <!-- 2. Vidicon Telemetry Mode -->
      <button id="rail-btn-vidicon" class="cir-rail__b" type="button" aria-label="Toggle 1969 Vidicon Telemetry Scan [V]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="20" height="15" x="2" y="4" rx="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      </button>

      <!-- 3. EVA Traverse Map -->
      <button id="rail-btn-traverse" class="cir-rail__b" type="button" aria-label="Open EVA-1 & EVA-2 Traverse Map [T]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="18"></line>
          <line x1="15" y1="6" x2="15" y2="21"></line>
        </svg>
      </button>

      <!-- 4. Air-to-Ground Comm Deck -->
      <button id="rail-btn-audio" class="cir-rail__b" type="button" aria-label="Toggle Air-to-Ground Radio Audio [M]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </button>

      <span class="cir-rail__sep" aria-hidden="true"></span>

      <!-- 5. Quick Command Search -->
      <button id="rail-btn-search" class="cir-rail__b" type="button" aria-label="Search Artifacts & Transcripts [⌘ K]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.34-4.34"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(this.container);
  }

  bindEvents() {
    const btnOverview = this.container.querySelector('#rail-btn-overview');
    const btnVidicon = this.container.querySelector('#rail-btn-vidicon');
    const btnTraverse = this.container.querySelector('#rail-btn-traverse');
    const btnAudio = this.container.querySelector('#rail-btn-audio');
    const btnSearch = this.container.querySelector('#rail-btn-search');

    btnOverview?.addEventListener('click', () => {
      eventBus.emit('camera:preset', 'OVERVIEW');
    });

    btnVidicon?.addEventListener('click', () => {
      eventBus.emit('ui:vidicon:toggle');
    });

    btnTraverse?.addEventListener('click', () => {
      eventBus.emit('ui:traverse:toggle');
    });

    btnAudio?.addEventListener('click', () => {
      eventBus.emit('audio:toggle');
    });

    btnSearch?.addEventListener('click', () => {
      eventBus.emit('ui:search:toggle');
    });

    // Synchronize active states with events
    eventBus.on('vidicon:toggled', (active) => {
      btnVidicon?.classList.toggle('cir-rail__b--active', active);
    });

    eventBus.on('camera:preset', (preset) => {
      btnOverview?.classList.toggle('cir-rail__b--active', preset === 'OVERVIEW');
    });

    eventBus.on('audio:muted', (isMuted) => {
      btnAudio?.classList.toggle('cir-rail__b--active', !isMuted);
    });

    eventBus.on('approach:complete', () => {
      this.container.style.opacity = '1';
    });

    const hideRail = () => {
      this.container.style.opacity = '0';
      this.container.style.pointerEvents = 'none';
      this.container.style.visibility = 'hidden';
    };

    const showRail = () => {
      this.container.style.visibility = 'visible';
      this.container.style.opacity = '1';
      this.container.style.pointerEvents = 'auto';
    };

    eventBus.on('dossier:opened', hideRail);
    eventBus.on('dossier:closed', showRail);
    eventBus.on('traverse:opened', hideRail);
    eventBus.on('traverse:closed', showRail);
  }
}
