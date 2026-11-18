/**
 * AFTERLIGHT — Mission Telemetry & Geochemical Stat Card (.cir-stat)
 * Uses Anime.js for live number counters and bar animations.
 * Refactored to pure presentation consuming reactive store updates.
 */

import { eventBus } from '../core/EventBus.js';
import { store } from '../state/Store.js';

export class MissionStatsCard {
  constructor() {
    this.cardEl = null;
    this.render();
    this.bindEvents();
    this.setupStoreSubscriptions();
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
        <span id="stat-dist-val">${store.getState().camera.surveyorProximity}</span><span class="cir-stat__unit">M</span>
      </div>

      <div class="cir-stat__delta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        PINPOINT TOUCHDOWN &bull; 0.18 KM DELTA
      </div>

      <!-- Multi-segment Regolith Geochemical Bar -->
      <div class="cir-stat__bar" aria-hidden="true">
        <span style="flex:46; background: var(--color-archival-amber, #dfac4e);" title="Basalt 46%"></span>
        <span style="flex:28; background: var(--color-citrus, #e06c3a);" title="Impact Melt 28%"></span>
        <span style="flex:14; background: var(--color-meadow, #10b981);" title="Breccia 14%"></span>
        <span style="flex:12; background: #64748b;" title="Volcanic Glass 12%"></span>
      </div>

      <footer class="cir-stat__legend">
        <span><i style="background:var(--color-archival-amber, #dfac4e);"></i>BASALT</span>
        <span><i style="background:var(--color-citrus, #e06c3a);"></i>MELT</span>
        <span><i style="background:var(--color-meadow, #10b981 military);"></i>BRECCIA</span>
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
  }

  setupStoreSubscriptions() {
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

    // React to modal or inspection overlays opening
    store.subscribe(
      (s) => s.inspection.isOpen || s.modals.isTraverseOpen || s.modals.isExpeditionsOpen,
      (isAnyOverlayOpen) => {
        if (isAnyOverlayOpen) {
          hideCard();
        } else if (store.getState().app.stage !== 'APPROACH') {
          showCard();
        }
      }
    );
  }
}
