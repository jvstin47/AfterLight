import anime from 'animejs';
import { traverseService } from '../services/TraverseService.js';
import { audioService } from '../services/AudioService.js';
import { eventBus } from '../core/EventBus.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';

export class TraverseModal {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.currentEva = 'eva2';
    this.selectedStation = null;
    this.isOpen = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="traverse-backdrop"></div>
      <div class="traverse-modal-panel" role="dialog" aria-modal="true" aria-labelledby="traverse-title">
        <!-- Archival Header -->
        <header class="traverse-header">
          <div class="traverse-meta">
            <div class="traverse-tag">
              <span class="traverse-reseau-pip">+</span>
              <span>USGS ASTROGEOLOGY CARTOGRAPHIC RECORD &bull; STATIO COGNITUM</span>
            </div>
            <h2 id="traverse-title" class="traverse-title">APOLLO 12 EXTRAVEHICULAR TRAVERSES</h2>
          </div>
          <button id="traverse-close" class="traverse-close-btn" aria-label="Close Traverse Map">
            <span class="close-label">CLOSE</span>
            <span class="close-key">[ESC]</span>
          </button>
        </header>

        <!-- EVA Selector Tabs -->
        <nav class="traverse-nav" role="tablist" aria-label="EVA Traverses">
          <button class="traverse-tab" data-eva="eva1" role="tab" aria-selected="false">
            <span class="tab-num">01</span>
            <span class="tab-label">EVA 1 &mdash; ALSEP DEPLOYMENT (NOV 19)</span>
          </button>
          <button class="traverse-tab is-active" data-eva="eva2" role="tab" aria-selected="true">
            <span class="tab-num">02</span>
            <span class="tab-label">EVA 2 &mdash; SURVEYOR CRATER TREK (NOV 20)</span>
          </button>
        </nav>

        <div class="traverse-body">
          <!-- Interactive SVG Cartographic Map -->
          <div class="traverse-map-container">
            <svg id="traverse-svg" viewBox="-260 -150 400 360" class="traverse-svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
                </pattern>
              </defs>

              <rect x="-260" y="-150" width="400" height="360" fill="#040609"/>
              <rect x="-260" y="-150" width="400" height="360" fill="url(#grid)" />

              <!-- Craters Layer -->
              <g class="craters-layer">
                <!-- Surveyor Crater -->
                <circle cx="65" cy="145" r="100" class="map-crater" />
                <text x="65" y="122" class="map-crater-label" text-anchor="middle">SURVEYOR CRATER (200m)</text>

                <!-- Head Crater -->
                <circle cx="-95" cy="25" r="70" class="map-crater" />
                <text x="-95" y="10" class="map-crater-label" text-anchor="middle">HEAD CRATER (140m)</text>

                <!-- Bench Crater -->
                <circle cx="-140" cy="45" r="35" class="map-crater" />
                <text x="-155" y="24" class="map-crater-label" text-anchor="middle">BENCH (70m)</text>

                <!-- Sharp Crater -->
                <circle cx="-210" cy="95" r="10" class="map-crater" />
                <text x="-210" y="80" class="map-crater-label" text-anchor="middle">SHARP</text>

                <!-- Halo Crater -->
                <circle cx="-100" cy="130" r="15" class="map-crater" />
                <text x="-100" y="112" class="map-crater-label" text-anchor="middle">HALO</text>

                <!-- Block Crater -->
                <circle cx="60" cy="85" r="8" class="map-crater" />
                <text x="60" y="75" class="map-crater-label">BLOCK</text>
              </g>

              <!-- Traverse Path Lines -->
              <g id="map-paths-layer"></g>

              <!-- Permanent Hardware Markers -->
              <g class="map-landmarks">
                <!-- LM Intrepid -->
                <rect x="-5" y="-5" width="10" height="10" class="map-landmark-intrepid" />
                <text x="8" y="4" class="map-landmark-label">LM INTREPID (0,0)</text>

                <!-- ALSEP -->
                <circle cx="-106" cy="-75" r="4" class="map-landmark-alsep" />
                <text x="-106" y="-83" class="map-landmark-label">ALSEP ARRAY</text>

                <!-- Surveyor 3 -->
                <polygon points="72,146 76,154 68,154" class="map-landmark-surveyor" />
                <text x="72" y="165" class="map-landmark-label" text-anchor="middle">SURVEYOR 3</text>
              </g>

              <!-- Interactive Waypoint / Station Nodes -->
              <g id="map-stations-layer"></g>
            </svg>
          </div>

          <!-- Station Detail Card -->
          <div class="traverse-detail-card">
            <div class="detail-header">
              <span id="detail-date" class="detail-badge">--</span>
              <span id="detail-distance" class="detail-metric">--</span>
            </div>
            <h3 id="detail-title" class="detail-title">SELECT A WAYPOINT</h3>
            <p id="detail-desc" class="detail-body">
              Click any station along the astronaut traverse path to view historical surface operations, geological sampling notes, and mission transcripts.
            </p>
            <div id="detail-notes-box" class="detail-notes-box" style="display: none;">
              <span class="notes-tag">FIELD OBSERVATION / ASTRONAUT TRANSCRIPT:</span>
              <p id="detail-notes-text" class="notes-text"></p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#traverse-close');
    const backdrop = this.container.querySelector('.traverse-backdrop');
    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    const tabs = this.container.querySelectorAll('.traverse-tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const evaKey = tab.dataset.eva;
        this.selectEva(evaKey);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
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

  open() {
    this.isOpen = true;
    this.container.style.display = 'flex';
    audioService.playQuindarIntro();
    store.dispatch(ActionTypes.SET_TRAVERSE_MODAL, true);
    eventBus.emit('traverse:opened');
    this.selectEva(this.currentEva);

    const panel = this.container.querySelector('.traverse-modal-panel');
    const backdrop = this.container.querySelector('.traverse-backdrop');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      backdrop.style.opacity = '1';
      panel.style.opacity = '1';
      panel.style.transform = 'none';
      return;
    }

    anime({
      targets: backdrop,
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutCubic',
    });

    anime({
      targets: panel,
      opacity: [0, 1],
      scale: [0.97, 1],
      duration: 380,
      easing: 'easeOutCubic',
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    audioService.playQuindarOutro();
    store.dispatch(ActionTypes.SET_TRAVERSE_MODAL, false);
    eventBus.emit('traverse:closed');

    const panel = this.container.querySelector('.traverse-modal-panel');
    const backdrop = this.container.querySelector('.traverse-backdrop');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.container.style.display = 'none';
      return;
    }

    anime({
      targets: [panel, backdrop],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInCubic',
      complete: () => {
        this.container.style.display = 'none';
      },
    });
  }

  selectEva(evaKey) {
    this.currentEva = evaKey;
    const tabs = this.container.querySelectorAll('.traverse-tab');
    tabs.forEach((tab) => {
      const isActive = tab.dataset.eva === evaKey;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const data = traverseService.getEvaById(evaKey);
    if (!data) return;

    // Update details card summary
    const dateEl = this.container.querySelector('#detail-date');
    const distEl = this.container.querySelector('#detail-distance');
    const titleEl = this.container.querySelector('#detail-title');
    const descEl = this.container.querySelector('#detail-desc');
    const notesBox = this.container.querySelector('#detail-notes-box');

    if (dateEl) dateEl.textContent = data.date;
    if (distEl) distEl.textContent = `${data.distanceMeters}m Total Traverse (${data.duration})`;
    if (titleEl) titleEl.textContent = data.name;
    if (descEl) descEl.textContent = data.description;
    if (notesBox) notesBox.style.display = 'none';

    this.renderMapLayers(data);
  }

  renderMapLayers(data) {
    const pathsLayer = this.container.querySelector('#map-paths-layer');
    const stationsLayer = this.container.querySelector('#map-stations-layer');
    if (!pathsLayer || !stationsLayer) return;

    pathsLayer.innerHTML = '';
    stationsLayer.innerHTML = '';

    const pathD = traverseService.getSvgPath(data.id);
    if (data.id === 'eva1') {
      pathsLayer.innerHTML = `<path d="${pathD}" class="traverse-path-eva1" />`;

      data.waypoints.forEach((wp) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', wp.pos[0]);
        circle.setAttribute('cy', wp.pos[2]);
        circle.setAttribute('r', '4');
        circle.setAttribute('class', 'station-node');
        circle.style.cursor = 'pointer';

        circle.addEventListener('click', () => {
          this.highlightStationNode(circle);
          this.showStationDetail(wp.name, wp.note, `Position: ${wp.pos[0]}m E, ${wp.pos[2]}m S`);
        });

        stationsLayer.appendChild(circle);
      });
    } else {
      pathsLayer.innerHTML = `<path d="${pathD}" class="traverse-path-eva2" />`;

      data.stations.forEach((st) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'station-group');
        g.style.cursor = 'pointer';

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', st.pos[0]);
        circle.setAttribute('cy', st.pos[2]);
        circle.setAttribute('r', '4.5');
        circle.setAttribute('class', 'station-node');

        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        let xOffset = 6;
        let yOffset = 3;
        if (st.id === 'station-7') {
          xOffset = -24;
          yOffset = -4;
        } else if (st.id === 'station-2') {
          xOffset = 8;
          yOffset = -4;
        } else if (st.id === 'station-3') {
          xOffset = 8;
          yOffset = 10;
        } else if (st.id === 'station-5') {
          xOffset = 8;
          yOffset = 8;
        }
        label.setAttribute('x', st.pos[0] + xOffset);
        label.setAttribute('y', st.pos[2] + yOffset);
        label.setAttribute('class', 'station-label');
        label.textContent = `STA ${st.id.replace('station-', '')}`;

        g.appendChild(circle);
        g.appendChild(label);

        g.addEventListener('click', () => {
          this.highlightStationNode(circle);
          this.showStationDetail(st.name, st.notes, `Crater: ~${st.diameterMeters || 10}m diameter`);
        });

        stationsLayer.appendChild(g);
      });
    }
  }

  highlightStationNode(activeCircle) {
    const allCircles = this.container.querySelectorAll('.station-node');
    allCircles.forEach((c) => c.classList.remove('is-active'));
    activeCircle.classList.add('is-active');
  }

  showStationDetail(title, notes, subtitle) {
    const titleEl = this.container.querySelector('#detail-title');
    const descEl = this.container.querySelector('#detail-desc');
    const notesBox = this.container.querySelector('#detail-notes-box');
    const notesText = this.container.querySelector('#detail-notes-text');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = subtitle;
    if (notesBox && notesText) {
      notesText.textContent = notes;
      notesBox.style.display = 'block';
    }
  }
}
