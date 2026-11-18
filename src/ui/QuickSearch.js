/**
 * AFTERLIGHT — Archival Quick-Search Command Palette (.cir-search)
 * Triggered by ⌘ K or search buttons. Animated with Anime.js.
 * Refactored to pure presentation consuming services and the reactive Store.
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';
import { audioService } from '../services/AudioService.js';
import { navigationService } from '../services/NavigationService.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { ARTIFACTS } from '../data/artifactsData.js';
import {
  GLOBAL_MISSIONS,
  FLAGS_OF_THE_MOON,
  LUNAR_SCIENCE_EXPERIMENTS,
  LUNAR_GEOLOGY_MODULES
} from '../data/globalLunarData.js';

const QUICK_TARGETS = [
  ...Object.values(ARTIFACTS).map((a) => ({
    id: a.id,
    title: a.name,
    category: a.category,
    type: 'artifact',
    keywords: [a.shortDesc, a.description, a.historicalSignificance, ...(a.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  })),
  { id: 'OVERVIEW', title: 'Site Overview (Orbit Perspective)', category: 'Vantage 01', type: 'camera', keywords: 'orbit overhead wide camera view' },
  { id: 'EYE_LEVEL', title: 'Astronaut Eye-Level (A7L View)', category: 'Vantage 02', type: 'camera', keywords: 'astronaut ground helmet visor a7l' },
  { id: 'SURVEYOR_RIM', title: 'Surveyor Crater North Rim', category: 'Vantage 03', type: 'camera', keywords: 'surveyor crater slope shadow' },
  { id: 'ALSEP_SITE', title: 'ALSEP Nuclear Deployment Field', category: 'Vantage 04', type: 'camera', keywords: 'alsep nuclear rtg snap-27' },
  { id: 'CELESTIAL_EARTH', title: 'Earth from Statio Cognitum (64.5° Sky View)', category: 'Vantage 05', type: 'camera', keywords: 'earth sky celestial terminator blue marble gibbous' },
  { id: 'TRAVERSE', title: 'EVA-1 & EVA-2 Traverse Route', category: 'Cartography', type: 'modal', keywords: 'traverse path eva map distance route bean conrad' },
  { id: 'EXPEDITIONS', title: 'Global Lunar Heritage Atlas (22 Missions & Rovers)', category: 'Planetary Atlas', type: 'modal', keywords: 'rovers sites atlas lunar heritage all missions chang\'e chandrayaan apollo luna surveyor slim' },
  { id: 'FLAGS', title: 'Flags of the Moon (National Markers & Outer Space Treaty)', category: 'Heritage Layer', type: 'modal', keywords: 'flags outer space treaty law united states china ussr india apollo flag nylon basalt' },
  { id: 'SCIENCE', title: 'Lunar Science Experiments (ALSEP, LRRR & Modern)', category: 'Planetary Science', type: 'modal', keywords: 'science alsep experiments pse seismometer retroreflector lrrr laser hfe heat flow swc lsm libs' },
  { id: 'GEOLOGY', title: 'Lunar Geology & Planetary Evolution (Theia & Maria)', category: 'Astrophysics', type: 'modal', keywords: 'geology theia giant impact magma ocean anorthosite regolith space weathering polar water ice' },
  
  // All 22 Global Missions
  ...GLOBAL_MISSIONS.map((s) => ({
    id: s.id,
    title: `${s.name} (${s.designation})`,
    category: s.category,
    type: 'expedition',
    keywords: [
      s.name,
      s.designation,
      s.agency,
      s.country,
      s.region,
      s.basin,
      s.astronauts,
      s.eraLabel,
      ...(s.keyArtifacts || []),
      s.description
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  })),

  // All 9 Documented Flags
  ...FLAGS_OF_THE_MOON.map((f) => ({
    id: f.id,
    title: `${f.flagTitle} (${f.country})`,
    category: 'Flags of the Moon',
    type: 'flag',
    keywords: [
      f.flagTitle,
      f.country,
      f.agency,
      f.material,
      f.conditionLabel,
      f.orbitalEvidence,
      f.significance,
      'flag national marker outer space treaty'
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  })),

  // All 6 Lunar Science Experiments
  ...LUNAR_SCIENCE_EXPERIMENTS.map((e) => ({
    id: e.id,
    title: `${e.name} [${e.acronym}]`,
    category: 'Lunar Science',
    type: 'science',
    keywords: [
      e.name,
      e.acronym,
      e.missions,
      e.whatWasMeasured,
      e.whyWasMeasured,
      e.howItWorked,
      e.discoveries,
      'experiment instrument alsep'
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
  })),

  // All 4 Geology Modules
  ...LUNAR_GEOLOGY_MODULES.map((g) => ({
    id: g.id,
    title: `${g.title}: ${g.subtitle}`,
    category: 'Lunar Geology',
    type: 'geology',
    keywords: [
      g.title,
      g.subtitle,
      g.summary,
      g.body,
      'geology moon origin theia magma ocean regolith ice'
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
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
      <div class="search-dialog" style="width: min(540px, 92vw); display: flex; flex-direction: column; gap: 12px; pointer-events: auto;">
        <!-- Pill Search Bar (.cir-search) -->
        <label class="cir-search" style="width: 100%;">
          <svg class="cir-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.34-4.34"></path>
          </svg>
          <input id="cir-search-input" class="cir-search__field" type="search" placeholder="Search lunar artifacts, rovers, flags, science..." aria-label="Search" autocomplete="off" />
          <kbd class="cir-search__kbd">ESC</kbd>
        </label>

        <!-- Quick Results Panel -->
        <div id="cir-search-results" style="
          background: rgba(14, 16, 20, 0.95);
          border: 1px solid var(--color-edge);
          border-radius: 18px;
          padding: 8px 8px 16px 8px;
          max-height: 380px;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(232, 178, 85, 0.3) transparent;
          display: flex;
          flex-direction: column;
          gap: 4px;
        "></div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    eventBus.on('quicksearch:open', () => this.open());
    eventBus.on('quicksearch:close', () => this.close());
    eventBus.on('quicksearch:toggle', () => this.toggle());

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    const input = this.modalEl.querySelector('#cir-search-input');
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        this.renderResults(QUICK_TARGETS.slice(0, 15));
        return;
      }
      const filtered = QUICK_TARGETS.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords.includes(q)
      );
      this.renderResults(filtered);
    });
  }

  renderResults(items) {
    const container = this.modalEl.querySelector('#cir-search-results');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--color-text-secondary); font-family: var(--font-sans); font-size: 13px;">
          No archival records match query. Try searching for "apollo", "rover", "flag", "lrrr", "seismic", or "theia".
        </div>
      `;
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
      <div class="search-result-row" data-id="${item.id}" data-type="${item.type}" style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 12px;
        cursor: pointer;
        transition: background 0.15s ease;
      ">
        <div style="display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1;">
          <span style="font-family: var(--font-sans); font-size: 13.5px; color: var(--color-text-primary); font-weight: 500; word-break: break-word;">
            ${item.title}
          </span>
          <span style="font-family: var(--font-mono); font-size: 10px; color: var(--color-text-secondary); text-transform: uppercase;">
            ${item.category}
          </span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--color-archival-amber); opacity: 0.85; white-space: nowrap; flex-shrink: 0;">
          ${item.type.toUpperCase()} &rarr;
        </span>
      </div>
    `
      )
      .join('');

    const rowEls = container.querySelectorAll('.search-result-row');
    rowEls.forEach((el) => {
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
    audioService.playClick();
    this.close();
    if (type === 'artifact') {
      const art = ARTIFACTS[id] || Object.values(ARTIFACTS).find((a) => a.id === id);
      if (art) eventBus.emit('artifact:selected', { id: art.id, artifact: art });
    } else if (type === 'camera') {
      navigationService.setPreset(id);
    } else if (type === 'modal' && id === 'TRAVERSE') {
      eventBus.emit('ui:traverse:toggle');
    } else if (type === 'expedition') {
      eventBus.emit('ui:expeditions:open', id);
    } else if (type === 'modal' && id === 'EXPEDITIONS') {
      eventBus.emit('ui:expeditions:toggle');
    } else if (type === 'flag' || (type === 'modal' && id === 'FLAGS')) {
      eventBus.emit('ui:expeditions:open-flags');
    } else if (type === 'science' || (type === 'modal' && id === 'SCIENCE')) {
      eventBus.emit('ui:expeditions:open-science');
    } else if (type === 'geology' || (type === 'modal' && id === 'GEOLOGY')) {
      eventBus.emit('ui:expeditions:open-geology');
    }
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    audioService.playBlip(580, 0.04);
    store.dispatch(ActionTypes.SET_QUICK_SEARCH, true);
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
      this.renderResults(QUICK_TARGETS.slice(0, 15));
      setTimeout(() => input.focus(), 50);
    }
  }

  close() {
    this.isOpen = false;
    store.dispatch(ActionTypes.SET_QUICK_SEARCH, false);
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
