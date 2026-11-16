/**
 * AFTERLIGHT — Mission Telemetry & Geochemical Stat Card (.cir-stat)
 * Uses Anime.js for live number counters and bar animations.
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';

export class MissionStatsCard {
  constructor() {
    this.cardEl = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.cardEl = document.createElement('article');
    this.cardEl.className = 'cir-stat';
    this.cardEl.style.cssText = `
      position: fixed;
      top: 84px;
      right: 28px;
      z-index: 22;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s ease, transform 0.4s ease;
    `;

    this.cardEl.innerHTML = `
      <header class="cir-stat__head">
        <span class="cir-stat__label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect width="20" height="12" x="2" y="6" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01"></path>
            <path d="M18 12h.01"></path>
          </svg>
          SURVEYOR III PROXIMITY
        </span>
        <span class="cir-stat__range">STATION 05</span>
      </header>

      <div class="cir-stat__value">
        <span id="stat-dist-val">163</span><span class="cir-stat__unit">M</span>
      </div>

      <div class="cir-stat__delta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        PINPOINT TOUCHDOWN &bull; 0.18 KM DELTA
      </div>

      <!-- Multi-segment Regolith Geochemical Bar -->
      <div class="cir-stat__bar" aria-hidden="true">
        <span style="flex:46; background: #c99738;" title="Basalt 46%"></span>
        <span style="flex:28; background: #ff7a3d;" title="Impact Melt 28%"></span>
        <span style="flex:14; background: #2bc48a;" title="Breccia 14%"></span>
        <span style="flex:12; background: #4a5568;" title="Volcanic Glass 12%"></span>
      </div>

      <footer class="cir-stat__legend">
        <span><i style="background:#c99738;"></i>BASALT</span>
        <span><i style="background:#ff7a3d;"></i>MELT</span>
        <span><i style="background:#2bc48a;"></i>BRECCIA</span>
      </footer>
    `;

    document.body.appendChild(this.cardEl);
  }

  bindEvents() {
    eventBus.on('approach:complete', () => {
      this.cardEl.style.opacity = '1';
      this.cardEl.style.pointerEvents = 'auto';
    });

    eventBus.on('camera:telemetry', (data) => {
      if (data && data.range !== undefined) {
        const valEl = this.cardEl.querySelector('#stat-dist-val');
        if (valEl) {
          valEl.textContent = Math.round(data.range);
        }
      }
    });

    // Hide stat card when dossier or traverse modal is open
    const hideCard = () => {
      this.cardEl.style.opacity = '0';
      this.cardEl.style.pointerEvents = 'none';
      this.cardEl.style.visibility = 'hidden';
    };

    const showCard = () => {
      this.cardEl.style.visibility = 'visible';
      this.cardEl.style.opacity = '1';
      this.cardEl.style.pointerEvents = 'auto';
    };

    eventBus.on('dossier:opened', hideCard);
    eventBus.on('dossier:closed', showCard);
    eventBus.on('traverse:opened', hideCard);
    eventBus.on('traverse:closed', showCard);
  }
}
