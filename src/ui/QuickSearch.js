/**
 * AFTERLIGHT — Archival Quick-Search Command Palette (.cir-search)
 * Triggered by ⌘ K or search buttons. Animated with Anime.js.
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';
import { ARTIFACTS } from '../data/artifactsData.js';
import { LUNAR_HERITAGE_SITES } from '../data/lunarHeritageData.js';

const QUICK_TARGETS = [
  ...Object.values(ARTIFACTS).map(a => ({
    id: a.id,
    title: a.name,
    category: a.category,
    type: 'artifact',
    keywords: [a.shortDesc, a.description, a.historicalSignificance, ...(a.tags || [])].filter(Boolean).join(' ').toLowerCase()
  })),
  { id: 'OVERVIEW', title: 'Site Overview (Orbit Perspective)', category: 'Vantage 01', type: 'camera', keywords: 'orbit overhead wide camera view' },
  { id: 'EYE_LEVEL', title: 'Astronaut Eye-Level (A7L View)', category: 'Vantage 02', type: 'camera', keywords: 'astronaut ground helmet visor a7l' },
  { id: 'SURVEYOR_RIM', title: 'Surveyor Crater North Rim', category: 'Vantage 03', type: 'camera', keywords: 'surveyor crater slope shadow' },
  { id: 'ALSEP_SITE', title: 'ALSEP Nuclear Deployment Field', category: 'Vantage 04', type: 'camera', keywords: 'alsep nuclear rtg snap-27' },
  { id: 'CELESTIAL_EARTH', title: 'Earth from Statio Cognitum (64.5° Sky View)', category: 'Vantage 05', type: 'camera', keywords: 'earth sky celestial terminator blue marble gibbous' },
  { id: 'TRAVERSE', title: 'EVA-1 & EVA-2 Traverse Route', category: 'Cartography', type: 'modal', keywords: 'traverse path eva map distance route bean conrad' },
  { id: 'EXPEDITIONS', title: 'Human Artifacts & Rovers on the Moon (Global Atlas)', category: 'Planetary Atlas', type: 'modal', keywords: 'rovers sites atlas lunar heritage all missions' },
  ...LUNAR_HERITAGE_SITES.map(s => ({
    id: s.id,
    title: `${s.name} (${s.designation})`,
    category: s.category,
    type: 'expedition',
    keywords: [
      s.name,
      s.designation,
      s.agency,
      s.region,
      s.astronauts,
      ...(s.keyArtifacts || []),
      s.description
    ].filter(Boolean).join(' ').toLowerCase()
  }))
];

export class QuickSearch {
  constructor() {
    this.modalEl = null;
    this.isOpen = false;
    this.render();
    this.bindEvents();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.id = 'quick-search-modal';
    this.modalEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(4, 6, 8, 0.75);
      backdrop-filter: blur(12px);
      z-index: 500;
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding-top: 14vh;
      opacity: 0;
      pointer-events: none;
    `;

    this.modalEl.innerHTML = `
      <div class="search-dialog" style="width: min(520px, 90vw); display: flex; flex-direction: column; gap: 12px; pointer-events: auto;">
        <!-- Pill Search Bar (.cir-search) -->
        <label class="cir-search" style="width: 100%;">
          <svg class="cir-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.34-4.34"></path>
          </svg>
          <input id="cir-search-input" class="cir-search__field" type="search" placeholder="Search lunar artifacts, stations, coordinates..." aria-label="Search" autocomplete="off" />
          <kbd class="cir-search__kbd">ESC</kbd>
        </label>

        <!-- Quick Results Panel -->
        <div id="cir-search-results" style="
          background: rgba(14, 16, 20, 0.95);
          border: 1px solid var(--color-edge);
          border-radius: 18px;
          padding: 8px;
          max-height: 340px;
          overflow-y: auto;
          box-shadow: 0 24px 48px -20px rgba(0,0,0,0.8);
          font-family: var(--font-mono, monospace);
        "></div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.renderResults(QUICK_TARGETS);
  }

  bindEvents() {
    const input = this.modalEl.querySelector('#cir-search-input');

    input?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        this.renderResults(QUICK_TARGETS);
        return;
      }
      const filtered = QUICK_TARGETS.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.keywords && t.keywords.includes(q))
      );
      this.renderResults(filtered);
    });

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        this.close();
      }
    });

    eventBus.on('ui:search:toggle', () => {
      this.toggle();
    });

    window.addEventListener('keydown', (e) => {
      // ⌘ K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  renderResults(items) {
    const resultsContainer = this.modalEl.querySelector('#cir-search-results');
    if (!resultsContainer) return;

    if (items.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--color-mist); font-size: 11px;">
          NO MATCHING ARCHIVAL RECORDS FOUND
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = items.map(item => `
      <div class="search-item" data-id="${item.id}" data-type="${item.type}" style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.15s ease;
      ">
        <span style="font-size: 12px; color: var(--color-ink);">${item.title}</span>
        <span style="font-size: 10px; color: var(--color-signal); text-transform: uppercase;">${item.category}</span>
      </div>
    `).join('');

    // Bind clicks
    const rowEls = resultsContainer.querySelectorAll('.search-item');
    rowEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.background = 'rgba(255, 255, 255, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.background = 'transparent';
      });
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const type = el.dataset.type;
        this.handleSelect(id, type);
      });
    });
  }

  handleSelect(id, type) {
    this.close();
    if (type === 'artifact') {
      const art = ARTIFACTS[id] || Object.values(ARTIFACTS).find(a => a.id === id);
      if (art) eventBus.emit('artifact:selected', { id: art.id, artifact: art });
    } else if (type === 'camera') {
      eventBus.emit('camera:preset', id);
    } else if (type === 'modal' && id === 'TRAVERSE') {
      eventBus.emit('ui:traverse:toggle');
    } else if (type === 'expedition') {
      eventBus.emit('ui:expeditions:open', id);
    } else if (type === 'modal' && id === 'EXPEDITIONS') {
      eventBus.emit('ui:expeditions:toggle');
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.modalEl.style.display = 'flex';
    this.modalEl.style.pointerEvents = 'auto';

    anime.remove(this.modalEl);
    anime({
      targets: this.modalEl,
      opacity: [0, 1],
      duration: 250,
      easing: 'easeOutQuad'
    });

    const dialog = this.modalEl.querySelector('.search-dialog');
    anime({
      targets: dialog,
      translateY: [-20, 0],
      duration: 350,
      easing: 'easeOutCubic'
    });

    const input = this.modalEl.querySelector('#cir-search-input');
    if (input) {
      input.value = '';
      this.renderResults(QUICK_TARGETS);
      setTimeout(() => input.focus(), 50);
    }
  }

  close() {
    this.isOpen = false;
    anime.remove(this.modalEl);
    anime({
      targets: this.modalEl,
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        this.modalEl.style.display = 'none';
        this.modalEl.style.pointerEvents = 'none';
      }
    });
  }
}
