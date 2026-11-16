/**
 * AFTERLIGHT — Redesigned Artifact Dossier (Archival Record)
 * Editorial typography, Hasselblad photography framing, and structured technical data.
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

export class DossierDrawer {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.currentArtifact = null;
    this.activeTab = 'origin';
    this.isOpen = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="dossier-backdrop"></div>
      <aside class="dossier-panel" role="dialog" aria-modal="true" aria-labelledby="dossier-title">
        <!-- Archival Header Bar -->
        <header class="dossier-header-bar">
          <div class="dossier-classification">
            <span class="dossier-reseau-pip">+</span>
            <span class="classification-text">OFFICIAL NASA ARCHIVAL RECORD &bull; APOLLO 12</span>
          </div>
          <button id="dossier-close" class="dossier-close-btn" aria-label="Close Artifact Dossier">
            <span class="close-label">CLOSE</span>
            <span class="close-key">[ESC]</span>
          </button>
        </header>

        <div class="dossier-scroll-area">
          <!-- Identity Section -->
          <div class="dossier-identity">
            <div class="dossier-badge-row">
              <span id="dossier-designation" class="dossier-designation">--</span>
              <span class="dossier-badge-sep">&bull;</span>
              <span id="dossier-status" class="dossier-status-pill">--</span>
            </div>
            <h2 id="dossier-title" class="dossier-title">--</h2>
            <div class="dossier-meta-bar">
              <div id="dossier-coords" class="dossier-coordinates">--</div>
              <div class="dossier-provenance-tag">AUTHENTIC SURFACE ARTIFACT</div>
            </div>
          </div>

          <!-- Narrative 6-Stage Horizontal Tabs -->
          <nav class="dossier-tabs-nav" role="tablist" aria-label="Narrative Chapters">
            <button class="dossier-tab is-active" data-tab="origin" role="tab" aria-selected="true">
              <span class="tab-num">01</span><span class="tab-label">ORIGIN</span>
            </button>
            <button class="dossier-tab" data-tab="journey" role="tab" aria-selected="false">
              <span class="tab-num">02</span><span class="tab-label">JOURNEY</span>
            </button>
            <button class="dossier-tab" data-tab="mission" role="tab" aria-selected="false">
              <span class="tab-num">03</span><span class="tab-label">MISSION</span>
            </button>
            <button class="dossier-tab" data-tab="discoveries" role="tab" aria-selected="false">
              <span class="tab-num">04</span><span class="tab-label">DISCOVERIES</span>
            </button>
            <button class="dossier-tab" data-tab="finalDays" role="tab" aria-selected="false">
              <span class="tab-num">05</span><span class="tab-label">FINAL DAYS</span>
            </button>
            <button class="dossier-tab" data-tab="legacy" role="tab" aria-selected="false">
              <span class="tab-num">06</span><span class="tab-label">LEGACY</span>
            </button>
          </nav>

          <!-- Tab Narrative Content Panel -->
          <div class="dossier-narrative-content" role="tabpanel">
            <h3 id="dossier-tab-heading" class="narrative-heading">--</h3>
            <div id="dossier-tab-text" class="narrative-body">--</div>
          </div>

          <!-- Technical Specifications -->
          <section class="dossier-section">
            <div class="section-header">
              <span class="section-title">TECHNICAL SPECIFICATIONS</span>
              <span class="section-sub">DOCUMENTED FLIGHT HARDWARE</span>
            </div>
            <dl id="dossier-specs-list" class="specs-grid"></dl>
          </section>

          <!-- Archival Schematics -->
          <section class="dossier-section" id="dossier-schematic-section">
            <div class="section-header">
              <span class="section-title">ENGINEERING SCHEMATICS</span>
              <span class="section-sub">NASA MSC TECHNICAL ARCHIVE</span>
            </div>
            <div class="schematic-viewer" id="schematic-container">
              <!-- Rendered dynamically -->
            </div>
          </section>

          <!-- Archival Photography Carousel -->
          <section class="dossier-section">
            <div class="section-header">
              <span class="section-title">ARCHIVAL PHOTOGRAPHY</span>
              <span class="section-sub">70MM HASSELBLAD SURFACE IMAGERY</span>
            </div>
            <div id="dossier-gallery" class="photo-gallery"></div>
          </section>
        </div>
      </aside>

      <!-- Fullscreen Image Zoom Modal -->
      <div id="image-zoom-modal" class="zoom-modal" style="display: none;">
        <div class="zoom-modal-backdrop"></div>
        <div class="zoom-modal-content">
          <button id="zoom-close" class="zoom-close-btn" aria-label="Close enlarged photograph">&times;</button>
          <img id="zoom-image" src="" alt="Enlarged Archival Photo" />
          <div id="zoom-caption" class="zoom-caption"></div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Close button & backdrop
    const closeBtn = this.container.querySelector('#dossier-close');
    const backdrop = this.container.querySelector('.dossier-backdrop');
    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    // Tabs
    const tabs = this.container.querySelectorAll('.dossier-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabKey = tab.dataset.tab;
        this.selectTab(tabKey);
      });
    });

    // Zoom modal close
    const zoomClose = this.container.querySelector('#zoom-close');
    const zoomBackdrop = this.container.querySelector('.zoom-modal-backdrop');
    const zoomModal = this.container.querySelector('#image-zoom-modal');

    const hideZoom = () => {
      zoomModal.style.display = 'none';
    };
    zoomClose?.addEventListener('click', hideZoom);
    zoomBackdrop?.addEventListener('click', hideZoom);

    // Keyboard ESC to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (zoomModal.style.display !== 'none') {
          hideZoom();
        } else if (this.isOpen) {
          this.close();
        }
      }
    });
  }

  open(artifact) {
    this.currentArtifact = artifact;
    this.isOpen = true;
    this.activeTab = 'origin';

    audioManager.playQuindarIntro();

    this.populateData(artifact);
    this.selectTab('origin');

    this.container.style.display = 'block';
    eventBus.emit('dossier:opened', { artifact });
    const panel = this.container.querySelector('.dossier-panel');
    const backdrop = this.container.querySelector('.dossier-backdrop');

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      backdrop.style.opacity = '1';
      panel.style.transform = 'none';
      return;
    }

    anime({
      targets: backdrop,
      opacity: [0, 1],
      duration: 350,
      easing: 'easeOutCubic',
    });

    anime({
      targets: panel,
      translateX: ['100%', '0%'],
      duration: 480,
      easing: 'easeOutCubic',
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;

    audioManager.playQuindarOutro();

    const panel = this.container.querySelector('.dossier-panel');
    const backdrop = this.container.querySelector('.dossier-backdrop');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.container.style.display = 'none';
      eventBus.emit('dossier:closed');
      return;
    }

    anime({
      targets: backdrop,
      opacity: [1, 0],
      duration: 280,
      easing: 'easeInCubic',
    });

    anime({
      targets: panel,
      translateX: ['0%', '100%'],
      duration: 320,
      easing: 'easeInCubic',
      complete: () => {
        this.container.style.display = 'none';
        eventBus.emit('dossier:closed');
      },
    });
  }

  populateData(artifact) {
    const desEl = this.container.querySelector('#dossier-designation');
    const statusEl = this.container.querySelector('#dossier-status');
    const titleEl = this.container.querySelector('#dossier-title');
    const coordsEl = this.container.querySelector('#dossier-coords');
    const specsList = this.container.querySelector('#dossier-specs-list');
    const schematicContainer = this.container.querySelector('#schematic-container');
    const galleryEl = this.container.querySelector('#dossier-gallery');

    if (desEl) desEl.textContent = artifact.designation;
    if (statusEl) statusEl.textContent = artifact.status;
    if (titleEl) titleEl.textContent = artifact.name;
    if (coordsEl) coordsEl.textContent = `COORDINATES: ${artifact.coordinates || artifact.location || ''}`;

    // Specs: support both keySpecs array and specs object
    if (specsList) {
      if (Array.isArray(artifact.keySpecs)) {
        specsList.innerHTML = artifact.keySpecs
          .map(
            (spec) => `
            <div class="spec-row">
              <dt class="spec-key">${(spec.label || '').toUpperCase()}</dt>
              <dd class="spec-val">${spec.value || ''}</dd>
            </div>
          `
          )
          .join('');
      } else if (artifact.specs) {
        specsList.innerHTML = Object.entries(artifact.specs)
          .map(
            ([key, val]) => `
            <div class="spec-row">
              <dt class="spec-key">${key.toUpperCase()}</dt>
              <dd class="spec-val">${val}</dd>
            </div>
          `
          )
          .join('');
      }
    }

    // Schematic: support schematic or schematicUrl
    if (schematicContainer) {
      const schematicSrc = artifact.schematic || artifact.schematicUrl;
      const schematicCap = artifact.schematicTitle || artifact.schematicCaption || 'Engineering blueprint';
      if (schematicSrc) {
        schematicContainer.innerHTML = `
          <div class="schematic-frame" role="button" tabindex="0" title="Click to view full architectural blueprint">
            <img src="${schematicSrc}" alt="${schematicCap}" class="schematic-img" loading="lazy" />
            <figcaption class="schematic-caption">${schematicCap} &bull; <span class="schematic-expand-hint">[EXPAND BLUEPRINT]</span></figcaption>
          </div>
        `;
        const frameEl = schematicContainer.querySelector('.schematic-frame');
        const triggerZoom = () => this.openZoom(schematicSrc, schematicCap);
        frameEl?.addEventListener('click', triggerZoom);
        frameEl?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerZoom();
          }
        });
        const schemSection = this.container.querySelector('#dossier-schematic-section');
        if (schemSection) schemSection.style.display = 'block';
      } else {
        const schemSection = this.container.querySelector('#dossier-schematic-section');
        if (schemSection) schemSection.style.display = 'none';
      }
    }

    // Photo Gallery: support both artifact.photos and artifact.gallery
    if (galleryEl) {
      const photos = artifact.photos || artifact.gallery || [];
      if (photos.length > 0) {
        galleryEl.innerHTML = photos
          .map(
            (photo) => `
            <figure class="gallery-item" data-full="${photo.url || photo.src}">
              <div class="gallery-img-wrap">
                <img src="${photo.url || photo.src}" alt="${photo.caption || photo.title || ''}" loading="lazy" />
              </div>
              <figcaption>
                <span class="photo-id">${photo.id || photo.nasaId || 'NASA ARCHIVE'}</span>
                <span class="photo-caption">${photo.caption || photo.title || ''}</span>
              </figcaption>
            </figure>
          `
          )
          .join('');

        // Attach zoom clicks
        galleryEl.querySelectorAll('.gallery-item').forEach((item) => {
          item.addEventListener('click', () => {
            const fullUrl = item.dataset.full;
            const caption = item.querySelector('.photo-caption')?.textContent || '';
            const photoId = item.querySelector('.photo-id')?.textContent || '';
            this.openZoom(fullUrl, `${photoId} — ${caption}`);
          });
        });
      } else {
        galleryEl.innerHTML = '<p class="gallery-empty">Archival photography indexed under primary mission documentation.</p>';
      }
    }
  }

  selectTab(tabKey) {
    this.activeTab = tabKey;
    const tabs = this.container.querySelectorAll('.dossier-tab');
    tabs.forEach((tab) => {
      const isActive = tab.dataset.tab === tabKey;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const headingEl = this.container.querySelector('#dossier-tab-heading');
    const textEl = this.container.querySelector('#dossier-tab-text');

    if (!this.currentArtifact || !this.currentArtifact.narrative) {
      if (headingEl) headingEl.textContent = 'Archival Narrative';
      if (textEl) textEl.textContent = 'Mission narrative documentation being retrieved from historical catalog.';
      return;
    }

    const narrative = this.currentArtifact.narrative[tabKey];
    if (narrative) {
      const heading = narrative.heading || narrative.title || `${tabKey.toUpperCase()}`;
      const body = narrative.body || narrative.text || '';
      if (headingEl) headingEl.textContent = heading;
      if (textEl) textEl.innerHTML = `<p>${body}</p>`;
    } else {
      if (headingEl) headingEl.textContent = `${tabKey.toUpperCase()}`;
      if (textEl) textEl.innerHTML = '<p>Documentation archived under primary expedition log.</p>';
    }
  }

  openZoom(imgUrl, caption) {
    const zoomModal = this.container.querySelector('#image-zoom-modal');
    const zoomImg = this.container.querySelector('#zoom-image');
    const zoomCap = this.container.querySelector('#zoom-caption');

    if (zoomImg) zoomImg.src = imgUrl;
    if (zoomCap) zoomCap.textContent = caption;
    if (zoomModal) zoomModal.style.display = 'flex';
  }
}
