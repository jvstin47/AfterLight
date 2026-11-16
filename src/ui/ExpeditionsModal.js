/**
 * AFTERLIGHT — Lunar Expeditions & Planetary Rovers Registry Modal
 * Interactive catalog of humanity's lunar rovers, roving expeditions,
 * and candidate expansion landing sites across the Moon.
 */

import anime from 'animejs';
import { audioManager } from '../core/AudioManager.js';
import { eventBus } from '../core/EventBus.js';

export const EXPEDITION_SITES = [
  {
    id: 'apollo-12',
    code: 'SITE 12',
    status: 'ACTIVE MONUMENT',
    isActive: true,
    mission: 'Apollo 12 / Statio Cognitum',
    vehicle: 'LM-6 "Intrepid" & Surveyor 3 Rendezvous',
    coordinates: '3.01239° S, 23.42157° W',
    region: 'Oceanus Procellarum (Ocean of Storms)',
    description: 'Humanity\'s first precision extraterrestrial landing and the only historical expedition to inspect, sample, and retrieve components from a previously landed robotic spacecraft.',
    specs: [
      { key: 'Exploration Type', val: 'Manned Foot Traverse' },
      { key: 'Total Traverse', val: '2.44 km (2 EVAs)' },
      { key: 'Key Artifacts', val: 'LM-6, Surveyor 3, ALSEP' },
      { key: 'Landing Date', val: 'Nov 19, 1969' }
    ]
  },
  {
    id: 'apollo-15',
    code: 'SITE 15',
    status: 'ROVER MONUMENT',
    isActive: false,
    mission: 'Apollo 15 / Hadley-Apennine',
    vehicle: 'Boeing / GM Lunar Roving Vehicle (LRV-1)',
    coordinates: '26.1322° N, 3.6339° E',
    region: 'Hadley-Apennine Gorge',
    description: 'The historic debut of the motorized Lunar Roving Vehicle. David Scott and James Irwin drove across 27.9 kilometers of terrain to the sheer 300-meter canyon rim of Hadley Rille and recovered the 4.1-billion-year-old anorthosite Genesis Rock.',
    specs: [
      { key: 'Vehicle Mass', val: '210 kg (empty) / 700 kg' },
      { key: 'Drive System', val: '4x 0.25 hp DC series motors' },
      { key: 'Total Traverse', val: '27.9 km' },
      { key: 'Tires', val: 'Zinc-coated steel mesh + titanium' }
    ]
  },
  {
    id: 'apollo-17',
    code: 'SITE 17',
    status: 'ROVER MONUMENT',
    isActive: false,
    mission: 'Apollo 17 / Taurus-Littrow',
    vehicle: 'LRV-3 "The Challenger Rover"',
    coordinates: '20.1908° N, 30.7717° E',
    region: 'Taurus-Littrow Valley',
    description: 'Humanity\'s longest human driving expedition on another world. Gene Cernan and geologist Harrison Schmitt drove 35.7 km, discovered orange pyroclastic volcanic glass at Shorty Crater, and famously repaired a torn rear fender using duct tape and lunar charts.',
    specs: [
      { key: 'Max Speed', val: '18.0 km/h (lunar record)' },
      { key: 'Total Traverse', val: '35.7 km (3 EVAs)' },
      { key: 'Max Range from LM', val: '7.6 km' },
      { key: 'Samples Returned', val: '110.5 kg' }
    ]
  },
  {
    id: 'luna-17',
    code: 'LUNA 17',
    status: 'ROBOTIC ROVER',
    isActive: false,
    mission: 'Luna 17 / Lunokhod 1',
    vehicle: 'Soviet 8-Wheeled Robotic Rover',
    coordinates: '38.28° N, 35.00° W',
    region: 'Mare Imbrium (Sea of Rains)',
    description: 'The first successful robotic wheeled exploration rover on another celestial body. Operating for 322 Earth days (November 1970 – October 1971), Lunokhod 1 drove 10.5 kilometers, transmitted over 20,000 television frames, and conducted 500 soil penetrometry tests.',
    specs: [
      { key: 'Rover Mass', val: '756 kg' },
      { key: 'Chassis', val: '8 independently driven mesh wheels' },
      { key: 'Power System', val: 'Solar lid + Po-210 thermal decay' },
      { key: 'Total Traverse', val: '10.54 km' }
    ]
  },
  {
    id: 'chandrayaan-3',
    code: 'CH-3',
    status: 'POLAR ROVER',
    isActive: false,
    mission: 'Chandrayaan-3 / Pragyan',
    vehicle: 'ISRO Southern Polar Exploration Rover',
    coordinates: '69.373° S, 32.319° E',
    region: 'Shiv Shakti Point (High Southern Latitude)',
    description: 'India\'s historic August 2023 landing near the lunar south pole. The 6-wheeled Pragyan rover deployed via ramp to navigate rugged southern terrain, utilizing Laser-Induced Breakdown Spectroscopy (LIBS) to confirm elemental sulfur and metallic signatures in polar regolith.',
    specs: [
      { key: 'Rover Mass', val: '26 kg' },
      { key: 'Suspension', val: '6-wheel rocker-bogie' },
      { key: 'Payloads', val: 'LIBS & APXS spectrometers' },
      { key: 'Touchdown', val: 'August 23, 2023' }
    ]
  }
];

export class ExpeditionsModal {
  constructor(container) {
    this.container = container;
    this.isOpen = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="expeditions-backdrop"></div>
      <div class="expeditions-panel" role="dialog" aria-modal="true" aria-labelledby="expeditions-modal-title">
        <header class="expeditions-header">
          <div class="expeditions-meta">
            <div class="expeditions-tag">
              <span>+</span>
              <span>LUNAR EXPLORATION FLEET &bull; SITES & ROVERS REGISTRY</span>
            </div>
            <h2 id="expeditions-modal-title" class="expeditions-title">HUMAN & ROBOTIC LUNAR ROVERS</h2>
          </div>
          <button id="expeditions-close" class="expeditions-close-btn" aria-label="Close Expeditions Registry">
            <span>CLOSE</span>
            <span>[ESC]</span>
          </button>
        </header>

        <div class="expeditions-body">
          <p class="expeditions-intro">
            While Apollo 12 was a walking mission that proved precision landing by meeting Surveyor 3 on foot, subsequent missions introduced motorized vehicles and robotic rovers that expanded humanity's traverse radius across mountains, craters, and polar rilles. Explore the fleet of machines that traversed the Moon:
          </p>

          <div class="expeditions-grid">
            ${EXPEDITION_SITES.map(site => `
              <article class="expedition-card ${site.isActive ? 'is-active-site' : ''}">
                <div class="card-top">
                  <span class="card-badge-status ${site.isActive ? 'card-badge-active' : 'card-badge-registered'}">
                    ${site.isActive ? '● CURRENT VIEWPORT' : '○ REGISTERED SITE'}
                  </span>
                  <span class="card-code">${site.code}</span>
                </div>

                <div class="card-title-group">
                  <h3 class="card-mission">${site.mission}</h3>
                  <div class="card-vehicle">${site.vehicle}</div>
                  <div class="card-coords">${site.coordinates} &bull; ${site.region}</div>
                </div>

                <p class="card-desc">${site.description}</p>

                <div class="card-specs-table">
                  ${site.specs.map(s => `
                    <div class="spec-cell">
                      <span class="spec-key">${s.key}</span>
                      <span class="spec-val">${s.val}</span>
                    </div>
                  `).join('')}
                </div>

                <div class="card-action-bar">
                  ${site.isActive ? `
                    <button class="card-btn card-btn-active" data-action="explore-active">
                      EXPLORING STATIO COGNITUM
                    </button>
                  ` : `
                    <button class="card-btn card-btn-explore" data-site-id="${site.id}">
                      EXPEDITION ARCHIVE RECORD
                    </button>
                  `}
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#expeditions-close');
    const backdrop = this.container.querySelector('.expeditions-backdrop');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    // Card buttons
    this.container.querySelectorAll('.card-btn-explore').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const siteId = e.currentTarget.dataset.siteId;
        const site = EXPEDITION_SITES.find(s => s.id === siteId);
        if (site) {
          audioManager.playBlip(750, 0.05);
          alert(`${site.mission}\n\nVehicle: ${site.vehicle}\nCoordinates: ${site.coordinates}\n\n${site.description}\n\n[Candidate expansion site for future AFTERLIGHT multi-station release]`);
        }
      });
    });

    const activeBtn = this.container.querySelector('[data-action="explore-active"]');
    activeBtn?.addEventListener('click', () => {
      audioManager.playBlip(880, 0.06);
      this.close();
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      if ((e.key === 'e' || e.key === 'E') && !this.isOpen) {
        // Toggle when not typing in an input
        if (document.activeElement?.tagName !== 'INPUT') {
          this.open();
        }
      }
    });

    eventBus.on('ui:expeditions:toggle', () => {
      this.toggle();
    });
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.container.style.display = 'flex';
    requestAnimationFrame(() => {
      this.container.classList.add('is-open');
    });

    audioManager.playBlip(520, 0.06);
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

    audioManager.playBlip(440, 0.04);
    this.container.classList.remove('is-open');

    anime({
      targets: this.container.querySelector('.expeditions-panel'),
      scale: [1, 0.96],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInCubic',
      complete: () => {
        this.container.style.display = 'none';
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
