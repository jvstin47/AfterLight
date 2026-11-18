/**
 * AFTERLIGHT — Global Lunar Heritage & Planetary Human Artifacts Registry Modal
 * Interactive catalog of humanity's lunar rovers, manned Apollo bases,
 * vanguard robotic soft-landers, and permanent extraterrestrial monuments across the Moon.
 * Refactored to pure presentation consuming services and the reactive Store.
 */

import anime from 'animejs';
import { audioService } from '../services/AudioService.js';
import { lunarAtlasService } from '../services/LunarAtlasService.js';
import { eventBus } from '../core/EventBus.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { LUNAR_HERITAGE_SITES } from '../data/lunarHeritageData.js';

export class ExpeditionsModal {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.activeFilter = store.getState().atlas.activeFilter.toLowerCase();
    this.selectedSite = null;

    this.render();
    this.bindEvents();
  }

  getFilteredSites() {
    if (this.activeFilter === 'all') {
      return LUNAR_HERITAGE_SITES;
    }
    return LUNAR_HERITAGE_SITES.filter((s) => s.group === this.activeFilter);
  }

  render() {
    const counts = {
      all: LUNAR_HERITAGE_SITES.length,
      rovers: LUNAR_HERITAGE_SITES.filter((s) => s.group === 'rovers').length,
      manned: LUNAR_HERITAGE_SITES.filter((s) => s.group === 'manned').length,
      vanguard: LUNAR_HERITAGE_SITES.filter((s) => s.group === 'vanguard').length,
      impacts: LUNAR_HERITAGE_SITES.filter((s) => s.group === 'impacts').length
    };

    this.container.innerHTML = `
      <div class="expeditions-backdrop"></div>
      <div class="expeditions-panel" role="dialog" aria-modal="true" aria-labelledby="expeditions-modal-title">
        
        <!-- Header -->
        <header class="expeditions-header">
          <div class="expeditions-meta">
            <div class="expeditions-tag">
              <span>+</span>
              <span>GLOBAL LUNAR HUMAN HERITAGE &bull; PLANETARY ARTIFACT ATLAS</span>
            </div>
            <h2 id="expeditions-modal-title" class="expeditions-title">HUMAN ARTIFACTS & ROVERS ON THE MOON</h2>
          </div>
          <button id="expeditions-close" class="expeditions-close-btn" aria-label="Close Expeditions Registry">
            <span>CLOSE</span>
            <span>[ESC]</span>
          </button>
        </header>

        <!-- Category Filter Tabs -->
        <nav class="expeditions-nav-bar" role="tablist" aria-label="Filter Lunar Sites">
          <button class="exp-filter-tab ${this.activeFilter === 'all' ? 'is-active' : ''}" data-filter="all">
            <span>ALL NOTABLE SITES</span>
            <span class="exp-tab-count">${counts.all}</span>
          </button>
          <button class="exp-filter-tab ${this.activeFilter === 'rovers' ? 'is-active' : ''}" data-filter="rovers">
            <span>LUNAR ROVERS</span>
            <span class="exp-tab-count">${counts.rovers}</span>
          </button>
          <button class="exp-filter-tab ${this.activeFilter === 'manned' ? 'is-active' : ''}" data-filter="manned">
            <span>APOLLO BASES & RELICS</span>
            <span class="exp-tab-count">${counts.manned}</span>
          </button>
          <button class="exp-filter-tab ${this.activeFilter === 'vanguard' ? 'is-active' : ''}" data-filter="vanguard">
            <span>VANGUARD ROBOTICS</span>
            <span class="exp-tab-count">${counts.vanguard}</span>
          </button>
          <button class="exp-filter-tab ${this.activeFilter === 'impacts' ? 'is-active' : ''}" data-filter="impacts">
            <span>HISTORIC IMPACTS</span>
            <span class="exp-tab-count">${counts.impacts}</span>
          </button>
        </nav>

        <!-- Main Body -->
        <div class="expeditions-body">
          <div class="expeditions-intro-bar">
            <p class="expeditions-intro">
              Over 200 metric tons of human engineering monuments, scientific observatories, and robotic exploratory vehicles remain preserved across the Moon. Explore the complete constellation of humanity's lunar heritage:
            </p>
            <div class="expeditions-origin-badge">
              <span>CURRENT DATUM:</span>
              <span>STATIO COGNITUM (3.01° S, 23.42° W)</span>
            </div>
          </div>

          <div id="expeditions-grid" class="expeditions-grid">
            ${this.renderCardsHtml()}
          </div>
        </div>

        <!-- In-Modal Deep Archival Record Inspector -->
        <div id="site-detail-modal" class="site-detail-modal">
          <div class="detail-modal-header">
            <button id="detail-back-btn" class="detail-back-btn">
              <span>&larr; BACK TO REGISTRY</span>
            </button>
            <div class="detail-datum-tag">
              <span>DATUM: STATIO COGNITUM &bull; APOLLO 12</span>
            </div>
          </div>
          <div id="detail-modal-content" class="detail-modal-content"></div>
        </div>
      </div>
    `;
  }

  renderCardsHtml() {
    const sites = this.getFilteredSites();

    return sites.map((site) => {
      const isApollo12 = site.id === 'apollo-12';
      const distanceLabel = isApollo12
        ? 'CURRENT LOCATION (0 KM)'
        : `${site.distanceKm.toLocaleString()} KM FROM APOLLO 12`;

      return `
        <article class="exp-card ${isApollo12 ? 'is-active-site' : ''}" data-id="${site.id}">
          <header class="exp-card-header">
            <div class="exp-card-tag-row">
              <span class="exp-card-code">${site.code}</span>
              <span class="exp-card-category">${site.category}</span>
            </div>
            <div class="exp-card-status-badge ${site.status.includes('Active') ? 'badge-active' : ''}">
              <span class="badge-dot"></span>
              <span>${site.status}</span>
            </div>
          </header>

          <div class="exp-card-main">
            <h3 class="exp-card-title">${site.name}</h3>
            <div class="exp-card-designation">${site.designation}</div>
            <p class="exp-card-desc">${site.description}</p>
          </div>

          <!-- Highlight Relics In Situ Tags -->
          <div class="exp-card-relics">
            <span class="relic-label">KEY RELICS IN SITU:</span>
            <div class="relic-tags">
              ${site.keyArtifacts.slice(0, 3).map((art) => `
                <span class="relic-pill">${art}</span>
              `).join('')}
              ${site.keyArtifacts.length > 3 ? `<span class="relic-pill-more">+${site.keyArtifacts.length - 3} MORE</span>` : ''}
            </div>
          </div>

          <!-- Spatial Telemetry Bar -->
          <div class="exp-card-telemetry">
            <div class="telemetry-item">
              <span class="t-label">COORDINATES</span>
              <span class="t-val">${site.coordinates}</span>
            </div>
            <div class="telemetry-item">
              <span class="t-label">SURFACE DISTANCE</span>
              <span class="t-val ${isApollo12 ? 't-val-active' : ''}">${distanceLabel}</span>
            </div>
            ${site.bearingDeg !== undefined && !isApollo12 ? `
              <div class="telemetry-item">
                <span class="t-label">BEARING</span>
                <span class="t-val">${String(site.bearingDeg).padStart(3, '0')}°</span>
              </div>
            ` : ''}
          </div>

          <footer class="exp-card-footer">
            ${isApollo12 ? `
              <button class="exp-card-btn btn-active-site" data-action="explore-active">
                <span>EXPLORING NOW IN 3D MONUMENT</span>
                <span>&rarr;</span>
              </button>
            ` : `
              <button class="exp-card-btn card-btn-explore" data-site-id="${site.id}">
                <span>EXPEDITION ARCHIVE DOSSIER</span>
                <span>&rarr;</span>
              </button>
            `}
          </footer>
        </article>
      `;
    }).join('');
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#expeditions-close');
    const backdrop = this.container.querySelector('.expeditions-backdrop');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    // Category filter tabs
    this.container.querySelectorAll('.exp-filter-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter !== this.activeFilter) {
          this.activeFilter = filter;
          lunarAtlasService.setFilter(filter);
          audioService.playBlip(620, 0.04);

          // Update active tab class
          this.container.querySelectorAll('.exp-filter-tab').forEach((t) => t.classList.remove('is-active'));
          e.currentTarget.classList.add('is-active');

          // Re-render grid with animation
          const grid = this.container.querySelector('#expeditions-grid');
          if (grid) {
            grid.innerHTML = this.renderCardsHtml();
            this.bindCardActions();
            anime({
              targets: grid.children,
              opacity: [0, 1],
              translateY: [15, 0],
              delay: anime.stagger(40),
              duration: 250,
              easing: 'easeOutCubic'
            });
          }
        }
      });
    });

    this.bindCardActions();

    // Deep Detail Inspector Back Button
    const detailBackBtn = this.container.querySelector('#detail-back-btn');
    detailBackBtn?.addEventListener('click', () => {
      audioService.playClick();
      this.closeDetailModal();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        const detailModal = this.container.querySelector('#site-detail-modal');
        if (detailModal?.classList.contains('is-open')) {
          this.closeDetailModal();
        } else {
          this.close();
        }
      }
      if ((e.key === 'e' || e.key === 'E') && !this.isOpen) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          this.open();
        }
      }
    });

    eventBus.on('ui:expeditions:toggle', () => {
      this.toggle();
    });

    eventBus.on('ui:expeditions:open', (siteId) => {
      this.open();
      if (siteId) {
        const site = LUNAR_HERITAGE_SITES.find((s) => s.id === siteId);
        if (site) {
          setTimeout(() => {
            this.openDetailModal(site);
          }, 250);
        }
      }
    });
  }

  bindCardActions() {
    this.container.querySelectorAll('.card-btn-explore').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const siteId = e.currentTarget.dataset.siteId;
        const site = LUNAR_HERITAGE_SITES.find((s) => s.id === siteId);
        if (site) {
          audioService.playBlip(750, 0.05);
          this.openDetailModal(site);
        }
      });
    });

    const activeBtn = this.container.querySelector('[data-action="explore-active"]');
    activeBtn?.addEventListener('click', () => {
      audioService.playBlip(880, 0.06);
      this.close();
    });
  }

  openDetailModal(site) {
    this.selectedSite = site;
    lunarAtlasService.selectSite(site.id);
    const detailModal = this.container.querySelector('#site-detail-modal');
    const content = this.container.querySelector('#detail-modal-content');
    if (!detailModal || !content) return;

    content.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 20px; max-width: 900px;">
        <header style="display: flex; flex-direction: column; gap: 6px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-archival-amber); letter-spacing: 0.15em;">
            ${site.code} &bull; ${site.category.toUpperCase()} &bull; ${site.status}
          </div>
          <h2 style="font-family: var(--font-display); font-size: 26px; font-weight: 700; color: var(--color-text-primary);">
            ${site.name}
          </h2>
          <div style="font-family: var(--font-sans); font-size: 15px; color: var(--color-archival-amber);">
            ${site.designation}
          </div>
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--color-text-secondary);">
            Coordinates: ${site.coordinates} &bull; Region: ${site.region} &bull; Touchdown: ${site.landingDate}
          </div>
          ${site.distanceKm > 0 ? `
            <div style="font-family: var(--font-mono); font-size: 12px; color: var(--color-text-tertiary);">
              Spatial Separation from Statio Cognitum: ${site.distanceKm.toLocaleString()} km across lunar surface (Bearing: ${String(site.bearingDeg).padStart(3, '0')}°)
            </div>
          ` : ''}
        </header>

        <section style="display: flex; flex-direction: column; gap: 10px;">
          <h4 style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--color-text-tertiary); text-transform: uppercase;">
            Historical Narrative & Scientific Significance
          </h4>
          <p style="font-family: var(--font-sans); font-size: 14.5px; line-height: 1.7; color: var(--color-text-secondary);">
            ${site.description}
          </p>
        </section>

        <section style="display: flex; flex-direction: column; gap: 12px;">
          <h4 style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--color-archival-amber); text-transform: uppercase;">
            Human Artifacts & Hardware In Situ on the Moon
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
            ${site.keyArtifacts.map((art) => `
              <div style="display: flex; align-items: flex-start; gap: 8px; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;">
                <span style="color: var(--color-archival-amber);">&bull;</span>
                <span style="font-family: var(--font-sans); font-size: 13px; color: var(--color-text-primary);">${art}</span>
              </div>
            `).join('')}
          </div>
        </section>

        <section style="display: flex; flex-direction: column; gap: 10px; padding-top: 10px;">
          <h4 style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; color: var(--color-text-tertiary); text-transform: uppercase;">
            Engineering & Telemetry Specifications
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${site.technicalSpecs.map((s) => `
              <div style="display: flex; flex-direction: column; gap: 4px; padding: 10px 12px; background: rgba(255,255,255,0.02); border-left: 2px solid var(--color-archival-amber);">
                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--color-text-tertiary); text-transform: uppercase;">${s.label}</span>
                <span style="font-family: var(--font-sans); font-size: 13px; font-weight: 600; color: var(--color-text-primary);">${s.value}</span>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    detailModal.classList.add('is-open');
    anime({
      targets: detailModal,
      opacity: [0, 1],
      duration: 250,
      easing: 'easeOutCubic'
    });
  }

  closeDetailModal() {
    const detailModal = this.container.querySelector('#site-detail-modal');
    if (!detailModal) return;
    anime({
      targets: detailModal,
      opacity: [1, 0],
      duration: 180,
      easing: 'easeInCubic',
      complete: () => {
        detailModal.classList.remove('is-open');
        this.selectedSite = null;
      }
    });
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.container.style.display = 'flex';
    requestAnimationFrame(() => {
      this.container.classList.add('is-open');
    });

    audioService.playBlip(520, 0.06);
    store.dispatch(ActionTypes.SET_EXPEDITIONS_MODAL, true);
    eventBus.emit('expeditions:opened');

    anime({
      targets: this.container.querySelector('.expeditions-panel'),
      scale: [0.96, 1],
      opacity: [0, 1],
      duration: 350,
      easing: 'easeOutCubic'
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.closeDetailModal();
    audioService.playBlip(440, 0.04);
    this.container.classList.remove('is-open');

    anime({
      targets: this.container.querySelector('.expeditions-panel'),
      scale: [1, 0.96],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInCubic',
      complete: () => {
        this.container.style.display = 'none';
        store.dispatch(ActionTypes.SET_EXPEDITIONS_MODAL, false);
        eventBus.emit('expeditions:closed');
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}
