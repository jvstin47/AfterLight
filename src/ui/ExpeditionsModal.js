/**
 * AFTERLIGHT — Global Lunar Heritage & Planetary Human Artifacts Registry Modal
 * Interactive catalog of humanity's lunar rovers, manned Apollo bases,
 * vanguard robotic soft-landers, flags of the moon, scientific experiments, and lunar geology.
 * Refactored to pure presentation consuming services and the reactive Store.
 */

import anime from 'animejs';
import { audioService } from '../services/AudioService.js';
import { lunarAtlasService, ATLAS_MODES } from '../services/LunarAtlasService.js';
import { eventBus } from '../core/EventBus.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import {
  GLOBAL_MISSIONS,
  FLAGS_OF_THE_MOON,
  LUNAR_SCIENCE_EXPERIMENTS,
  LUNAR_GEOLOGY_MODULES,
  OUTER_SPACE_TREATY_DISCLAIMER
} from '../data/globalLunarData.js';
import { ArtifactHoloViewer } from './ArtifactHoloViewer.js';

export class ExpeditionsModal {
  constructor(container) {
    this.container = container;
    this.isOpen = false;
    this.activeMode = ATLAS_MODES.MISSIONS; // 'missions' | 'flags' | 'science' | 'geology'
    this.activeFilter = store.getState().atlas.activeFilter.toLowerCase() || 'all';
    this.activeAgency = 'ALL';
    this.activeEra = 'all';
    this.selectedSite = null;
    this.activeTier = 1; // 1 | 2 | 3 | 4 for deep inspection drawer
    this.holoViewer = null;

    this.render();
    this.bindEvents();
  }

  getFilteredSites() {
    return GLOBAL_MISSIONS.filter((site) => {
      // Category filter
      let matchesCategory = true;
      if (this.activeFilter === 'rovers') {
        matchesCategory = site.group === 'rovers' || site.category === 'Planetary Rover';
      } else if (this.activeFilter === 'manned' || this.activeFilter === 'apollo') {
        matchesCategory = site.group === 'manned' || site.category.includes('Apollo') || site.category.includes('Manned');
      } else if (this.activeFilter === 'vanguard') {
        matchesCategory = site.group === 'vanguard' || site.category.includes('Robotic Lander') || site.category.includes('Vanguard');
      } else if (this.activeFilter === 'impacts') {
        matchesCategory = site.group === 'impacts' || site.category.includes('Impact');
      }
      if (!matchesCategory) return false;

      // Agency filter
      if (this.activeAgency !== 'ALL') {
        let matchesAgency = false;
        const agUpper = this.activeAgency.toUpperCase();
        if (agUpper === 'NASA') matchesAgency = site.agency?.toUpperCase().includes('NASA');
        else if (agUpper === 'USSR') matchesAgency = site.agency?.toUpperCase().includes('USSR') || site.agency?.toUpperCase().includes('OKB') || site.agency?.toUpperCase().includes('LAVOCHKIN');
        else if (agUpper === 'CNSA') matchesAgency = site.agency?.toUpperCase().includes('CNSA') || site.country?.toLowerCase().includes('china');
        else if (agUpper === 'ISRO') matchesAgency = site.agency?.toUpperCase().includes('ISRO') || site.country?.toLowerCase().includes('india');
        else if (agUpper === 'JAXA') matchesAgency = site.agency?.toUpperCase().includes('JAXA') || site.country?.toLowerCase().includes('japan');
        else if (agUpper === 'COMMERCIAL') matchesAgency = site.category?.toLowerCase().includes('commercial') || site.agency?.toLowerCase().includes('intuitive');
        if (!matchesAgency) return false;
      }

      // Era filter
      if (this.activeEra !== 'all' && site.era !== this.activeEra) {
        return false;
      }

      return true;
    });
  }

  render() {
    const counts = {
      all: GLOBAL_MISSIONS.length,
      rovers: GLOBAL_MISSIONS.filter((s) => s.group === 'rovers').length,
      manned: GLOBAL_MISSIONS.filter((s) => s.group === 'manned').length,
      vanguard: GLOBAL_MISSIONS.filter((s) => s.group === 'vanguard').length,
      impacts: GLOBAL_MISSIONS.filter((s) => s.group === 'impacts').length,
      flags: FLAGS_OF_THE_MOON.length,
      science: LUNAR_SCIENCE_EXPERIMENTS.length,
      geology: LUNAR_GEOLOGY_MODULES.length
    };

    this.container.innerHTML = `
      <div class="expeditions-backdrop"></div>
      <div class="expeditions-panel" role="dialog" aria-modal="true" aria-labelledby="expeditions-modal-title">
        
        <!-- Header -->
        <header class="expeditions-header">
          <div class="expeditions-meta">
            <div class="expeditions-tag">
              <span>+</span>
              <span>GLOBAL LUNAR HERITAGE &bull; COMPREHENSIVE KNOWLEDGE ARCHIVE</span>
            </div>
            <h2 id="expeditions-modal-title" class="expeditions-title">GLOBAL LUNAR HERITAGE ATLAS</h2>
          </div>
          <button id="expeditions-close" class="expeditions-close-btn" aria-label="Close Expeditions Registry">
            <span>CLOSE</span>
            <span>[ESC]</span>
          </button>
        </header>

        <!-- Top-Level View Mode Switcher -->
        <div class="expeditions-mode-switcher" role="tablist" aria-label="Atlas Knowledge Dimensions">
          <button class="mode-switch-btn ${this.activeMode === ATLAS_MODES.MISSIONS ? 'is-active' : ''}" data-mode="${ATLAS_MODES.MISSIONS}">
            <span class="mode-icon">🛰</span>
            <span class="mode-label">MISSIONS & ROVERS</span>
            <span class="mode-badge">${counts.all}</span>
          </button>
          <button class="mode-switch-btn ${this.activeMode === ATLAS_MODES.FLAGS ? 'is-active' : ''}" data-mode="${ATLAS_MODES.FLAGS}">
            <span class="mode-icon">⚐</span>
            <span class="mode-label">FLAGS OF THE MOON</span>
            <span class="mode-badge">${counts.flags}</span>
          </button>
          <button class="mode-switch-btn ${this.activeMode === ATLAS_MODES.SCIENCE ? 'is-active' : ''}" data-mode="${ATLAS_MODES.SCIENCE}">
            <span class="mode-icon">⚛</span>
            <span class="mode-label">SCIENCE EXPERIMENTS</span>
            <span class="mode-badge">${counts.science}</span>
          </button>
          <button class="mode-switch-btn ${this.activeMode === ATLAS_MODES.GEOLOGY ? 'is-active' : ''}" data-mode="${ATLAS_MODES.GEOLOGY}">
            <span class="mode-icon">🪐</span>
            <span class="mode-label">LUNAR GEOLOGY</span>
            <span class="mode-badge">${counts.geology}</span>
          </button>
        </div>

        <!-- Faceted Navigation Bars (Active when in MISSIONS mode) -->
        <div id="missions-facets-bar" class="missions-facets-container" style="display: ${this.activeMode === ATLAS_MODES.MISSIONS ? 'flex' : 'none'};">
          <!-- Category Filter Tabs -->
          <nav class="expeditions-nav-bar" role="tablist" aria-label="Filter Lunar Sites">
            <button class="exp-filter-tab ${this.activeFilter === 'all' ? 'is-active' : ''}" data-filter="all">
              <span>ALL SITES</span>
              <span class="exp-tab-count">${counts.all}</span>
            </button>
            <button class="exp-filter-tab ${this.activeFilter === 'rovers' ? 'is-active' : ''}" data-filter="rovers">
              <span>ROVERS</span>
              <span class="exp-tab-count">${counts.rovers}</span>
            </button>
            <button class="exp-filter-tab ${this.activeFilter === 'manned' ? 'is-active' : ''}" data-filter="manned">
              <span>APOLLO BASES</span>
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

          <!-- Agency & Era Filter Strip -->
          <div class="exp-subfilters-strip">
            <div class="subfilter-group agency-filter-group">
              <span class="subfilter-label">AGENCY:</span>
              <button class="subfilter-pill ${this.activeAgency === 'ALL' ? 'is-active' : ''}" data-agency="ALL">ALL</button>
              <button class="subfilter-pill ${this.activeAgency === 'NASA' ? 'is-active' : ''}" data-agency="NASA">NASA (USA)</button>
              <button class="subfilter-pill ${this.activeAgency === 'USSR' ? 'is-active' : ''}" data-agency="USSR">USSR</button>
              <button class="subfilter-pill ${this.activeAgency === 'CNSA' ? 'is-active' : ''}" data-agency="CNSA">CNSA (CHINA)</button>
              <button class="subfilter-pill ${this.activeAgency === 'ISRO' ? 'is-active' : ''}" data-agency="ISRO">ISRO (INDIA)</button>
              <button class="subfilter-pill ${this.activeAgency === 'JAXA' ? 'is-active' : ''}" data-agency="JAXA">JAXA (JAPAN)</button>
              <button class="subfilter-pill ${this.activeAgency === 'COMMERCIAL' ? 'is-active' : ''}" data-agency="COMMERCIAL">COMMERCIAL</button>
            </div>
            <div class="subfilter-group era-filter-group">
              <span class="subfilter-label">ERA:</span>
              <select id="era-select-dropdown" class="subfilter-select" aria-label="Filter by Exploration Era">
                <option value="all" ${this.activeEra === 'all' ? 'selected' : ''}>ALL HISTORICAL ERAS (1959–PRESENT)</option>
                <option value="ERA_01_EARLY_IMPACT" ${this.activeEra === 'ERA_01_EARLY_IMPACT' ? 'selected' : ''}>1959–1965: Pioneers & Early Impacts</option>
                <option value="ERA_02_ROBOTIC_RECON" ${this.activeEra === 'ERA_02_ROBOTIC_RECON' ? 'selected' : ''}>1966–1968: Robotic Landers & Surveyors</option>
                <option value="ERA_03_CREWED_APOLLO" ${this.activeEra === 'ERA_03_CREWED_APOLLO' ? 'selected' : ''}>1968–1972: Apollo Crewed Expeditions</option>
                <option value="ERA_04_LUNOKHOD_AUTOMATION" ${this.activeEra === 'ERA_04_LUNOKHOD_AUTOMATION' ? 'selected' : ''}>1973–1990s: Soviet Heavy Automation</option>
                <option value="ERA_05_GLOBAL_ORBITAL" ${this.activeEra === 'ERA_05_GLOBAL_ORBITAL' ? 'selected' : ''}>1990s–2010s: Global Scientific Orbiters</option>
                <option value="ERA_06_NEW_RENAISSANCE" ${this.activeEra === 'ERA_06_NEW_RENAISSANCE' ? 'selected' : ''}>2010s–Present: International & Commercial Renaissance</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Main Body -->
        <div class="expeditions-body">
          <div id="atlas-content-container" class="atlas-content-container">
            ${this.renderActiveContentHtml()}
          </div>
        </div>

        <!-- In-Modal 4-Tier Deep Archival Record Inspector -->
        <div id="site-detail-modal" class="site-detail-modal">
          <div class="detail-modal-header">
            <button id="detail-back-btn" class="detail-back-btn">
              <span>&larr; BACK TO REGISTRY</span>
            </button>
            <div class="detail-tier-tabs" role="tablist" aria-label="Progressive Disclosure Levels">
              <button class="tier-tab-btn ${this.activeTier === 1 ? 'is-active' : ''}" data-tier="1">
                <span>TIER 1</span>
                <span class="tier-name">DISCOVERY</span>
              </button>
              <button class="tier-tab-btn ${this.activeTier === 2 ? 'is-active' : ''}" data-tier="2">
                <span>TIER 2</span>
                <span class="tier-name">EXPLORATION</span>
              </button>
              <button class="tier-tab-btn ${this.activeTier === 3 ? 'is-active' : ''}" data-tier="3">
                <span>TIER 3</span>
                <span class="tier-name">INVESTIGATION</span>
              </button>
              <button class="tier-tab-btn ${this.activeTier === 4 ? 'is-active' : ''}" data-tier="4">
                <span>TIER 4</span>
                <span class="tier-name">ACADEMIC RESEARCH</span>
              </button>
            </div>
            <div class="detail-datum-tag">
              <span>DATUM: STATIO COGNITUM &bull; APOLLO 12</span>
            </div>
          </div>
          <div id="detail-modal-content" class="detail-modal-content"></div>
        </div>
      </div>
    `;
  }

  renderActiveContentHtml() {
    if (this.activeMode === ATLAS_MODES.FLAGS) {
      return this.renderFlagsHtml();
    }
    if (this.activeMode === ATLAS_MODES.SCIENCE) {
      return this.renderScienceHtml();
    }
    if (this.activeMode === ATLAS_MODES.GEOLOGY) {
      return this.renderGeologyHtml();
    }
    return this.renderMissionsGridHtml();
  }

  renderMissionsGridHtml() {
    const sites = this.getFilteredSites();

    return `
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
        ${sites.length === 0 ? `
          <div class="exp-empty-state">
            <span class="empty-icon">⌕</span>
            <h4>NO EXPEDITION RECORDS MATCH CRITERIA</h4>
            <p>Try resetting agency or era filters to view all 22 registered global lunar missions.</p>
          </div>
        ` : sites.map((site) => {
          const isApollo12 = site.id === 'apollo-12';
          const distanceLabel = isApollo12
            ? 'CURRENT LOCATION (0 KM)'
            : `${Math.round(site.distanceKm).toLocaleString()} KM FROM APOLLO 12`;

          return `
            <article class="exp-card ${isApollo12 ? 'is-active-site' : ''}" data-id="${site.id}">
              <header class="exp-card-header">
                <div class="exp-card-tag-row">
                  <span class="exp-card-code">${site.code}</span>
                  <span class="exp-card-category">${site.category}</span>
                  <span class="exp-card-agency">${site.agency}</span>
                </div>
                <div class="exp-card-status-badge ${site.status.includes('Active') || site.status.includes('Living') ? 'badge-active' : ''}">
                  <span class="badge-dot"></span>
                  <span>${site.status}</span>
                </div>
              </header>

              <div class="exp-card-main">
                <h3 class="exp-card-title">${site.name}</h3>
                <div class="exp-card-designation">${site.designation}</div>
                <div class="exp-card-era-badge">${site.eraLabel || ''}</div>
                <p class="exp-card-desc">${site.description}</p>
              </div>

              <!-- Highlight Relics In Situ Tags -->
              <div class="exp-card-relics">
                <span class="relic-label">KEY HARDWARE IN SITU:</span>
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
                    <span class="t-val">${String(Math.round(site.bearingDeg)).padStart(3, '0')}°</span>
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
        }).join('')}
      </div>
    `;
  }

  renderFlagsHtml() {
    return `
      <div class="flags-view-container">
        <!-- Outer Space Treaty Article II Educational Alert Banner -->
        <div class="ost-treaty-banner">
          <div class="ost-banner-icon">⚖</div>
          <div class="ost-banner-content">
            <div class="ost-banner-header">
              <span class="ost-pill">BINDING INTERNATIONAL LAW</span>
              <h4 class="ost-title">${OUTER_SPACE_TREATY_DISCLAIMER.article}</h4>
            </div>
            <blockquote class="ost-quote">
              ${OUTER_SPACE_TREATY_DISCLAIMER.text}
            </blockquote>
            <p class="ost-context">
              ${OUTER_SPACE_TREATY_DISCLAIMER.educationalContext}
            </p>
          </div>
        </div>

        <div class="flags-grid">
          ${FLAGS_OF_THE_MOON.map((flag) => {
            let conditionClass = 'badge-bleached';
            if (flag.condition === 'STANDING_INTACT') conditionClass = 'badge-intact';
            else if (flag.condition === 'TOPPLED_ON_REGOLITH') conditionClass = 'badge-toppled';
            else if (flag.condition === 'IMPACT_SCATTERED') conditionClass = 'badge-scattered';
            else if (flag.condition === 'WHEEL_TREAD_IMPRINT') conditionClass = 'badge-imprint';

            return `
              <article class="flag-card">
                <header class="flag-card-header">
                  <div class="flag-meta-row">
                    <span class="flag-country">${flag.country.toUpperCase()}</span>
                    <span class="flag-agency">${flag.agency}</span>
                  </div>
                  <div class="flag-condition-badge ${conditionClass}">
                    <span class="badge-dot"></span>
                    <span>${flag.conditionLabel}</span>
                  </div>
                </header>

                <div class="flag-card-body">
                  <h3 class="flag-title">${flag.flagTitle}</h3>
                  <div class="flag-mission-ref">
                    <span>MISSION:</span>
                    <button class="flag-mission-link" data-mission-id="${flag.missionId}">${flag.missionName}</button>
                  </div>
                  
                  <div class="flag-spec-grid">
                    <div class="flag-spec-item">
                      <span class="spec-label">DEPLOYMENT DATE</span>
                      <span class="spec-value">${flag.deploymentDate}</span>
                    </div>
                    <div class="flag-spec-item">
                      <span class="spec-label">DIMENSIONS</span>
                      <span class="spec-value">${flag.dimensions}</span>
                    </div>
                  </div>

                  <div class="flag-material-section">
                    <span class="section-label">MATERIAL COMPOSITION:</span>
                    <p class="section-text">${flag.material}</p>
                  </div>

                  <div class="flag-evidence-section">
                    <span class="section-label">ORBITAL OBSERVATION & EVIDENCE:</span>
                    <p class="section-text evidence-text">${flag.orbitalEvidence}</p>
                  </div>

                  <div class="flag-significance-section">
                    <span class="section-label">HISTORICAL & LEGAL CONTEXT:</span>
                    <p class="section-text">${flag.significance}</p>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderScienceHtml() {
    return `
      <div class="science-view-container">
        <div class="science-intro-bar">
          <p class="science-intro">
            The Apollo Lunar Surface Experiments Packages (ALSEP) and contemporary robotic instruments transformed the Moon into a planetary laboratory. Explore the instruments, working mechanics, and landmark discoveries:
          </p>
        </div>

        <div class="science-grid">
          ${LUNAR_SCIENCE_EXPERIMENTS.map((exp) => `
            <article class="science-card ${exp.isOperatingToday ? 'is-active-instrument' : ''}">
              <header class="science-card-header">
                <div class="science-icon-acronym">
                  <span class="science-glyph">${exp.icon}</span>
                  <div class="science-acronym-block">
                    <span class="science-acronym">${exp.acronym}</span>
                    <span class="science-missions">${exp.missions}</span>
                  </div>
                </div>
                <div class="science-status-badge ${exp.isOperatingToday ? 'badge-operating-now' : ''}">
                  <span class="badge-dot"></span>
                  <span>${exp.status}</span>
                </div>
              </header>

              <div class="science-card-body">
                <h3 class="science-card-title">${exp.name}</h3>
                <div class="science-duration-badge">${exp.operationalYears}</div>

                <div class="science-detail-block">
                  <h5 class="science-block-title">WHAT WAS MEASURED</h5>
                  <p class="science-block-text">${exp.whatWasMeasured}</p>
                </div>

                <div class="science-detail-block">
                  <h5 class="science-block-title">SCIENTIFIC OBJECTIVE</h5>
                  <p class="science-block-text">${exp.whyWasMeasured}</p>
                </div>

                <div class="science-detail-block">
                  <h5 class="science-block-title">INSTRUMENT OPERATION & WORKING PRINCIPLE</h5>
                  <p class="science-block-text">${exp.howItWorked}</p>
                </div>

                <div class="science-discoveries-block">
                  <h5 class="science-block-title">LANDMARK DISCOVERIES</h5>
                  <p class="science-discoveries-text">${exp.discoveries}</p>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderGeologyHtml() {
    return `
      <div class="geology-view-container">
        <div class="geology-intro-bar">
          <p class="geology-intro">
            A planetary chronicle of 4.5 billion years: impact cataclysms, magma ocean differentiation, vacuum regolith genesis, and ultra-cold volatile sequestration at the poles.
          </p>
        </div>

        <div class="geology-grid">
          ${LUNAR_GEOLOGY_MODULES.map((geo) => `
            <article class="geology-card">
              <header class="geology-card-header">
                <div class="geology-icon-badge">${geo.icon}</div>
                <div class="geology-title-block">
                  <h3 class="geology-title">${geo.title}</h3>
                  <div class="geology-subtitle">${geo.subtitle}</div>
                </div>
              </header>
              <div class="geology-card-body">
                <div class="geology-summary-callout">
                  <span class="summary-label">OVERVIEW:</span>
                  <span>${geo.summary}</span>
                </div>
                <p class="geology-body-text">${geo.body}</p>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const closeBtn = this.container.querySelector('#expeditions-close');
    const backdrop = this.container.querySelector('.expeditions-backdrop');

    closeBtn?.addEventListener('click', () => this.close());
    backdrop?.addEventListener('click', () => this.close());

    // Mode Switcher Buttons
    this.container.querySelectorAll('.mode-switch-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        if (mode !== this.activeMode) {
          this.activeMode = mode;
          audioService.playBlip(700, 0.05);

          this.container.querySelectorAll('.mode-switch-btn').forEach((b) => b.classList.remove('is-active'));
          e.currentTarget.classList.add('is-active');

          const facetsBar = this.container.querySelector('#missions-facets-bar');
          if (facetsBar) {
            facetsBar.style.display = this.activeMode === ATLAS_MODES.MISSIONS ? 'flex' : 'none';
          }

          const container = this.container.querySelector('#atlas-content-container');
          if (container) {
            container.innerHTML = this.renderActiveContentHtml();
            this.bindInteractiveElements();
            anime({
              targets: container.children,
              opacity: [0, 1],
              translateY: [15, 0],
              delay: anime.stagger(30),
              duration: 250,
              easing: 'easeOutCubic'
            });
          }
        }
      });
    });

    // Category filter tabs
    this.container.querySelectorAll('.exp-filter-tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        const filter = e.currentTarget.dataset.filter;
        if (filter !== this.activeFilter) {
          this.activeFilter = filter;
          lunarAtlasService.setFilter(filter);
          audioService.playBlip(620, 0.04);

          this.container.querySelectorAll('.exp-filter-tab').forEach((t) => t.classList.remove('is-active'));
          e.currentTarget.classList.add('is-active');

          this.updateMissionsGrid();
        }
      });
    });

    // Agency filter pills
    this.container.querySelectorAll('.subfilter-pill').forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const agency = e.currentTarget.dataset.agency;
        if (agency !== this.activeAgency) {
          this.activeAgency = agency;
          audioService.playBlip(640, 0.04);

          this.container.querySelectorAll('.subfilter-pill').forEach((p) => p.classList.remove('is-active'));
          e.currentTarget.classList.add('is-active');

          this.updateMissionsGrid();
        }
      });
    });

    // Era dropdown selector
    const eraSelect = this.container.querySelector('#era-select-dropdown');
    eraSelect?.addEventListener('change', (e) => {
      this.activeEra = e.target.value;
      audioService.playBlip(600, 0.04);
      this.updateMissionsGrid();
    });

    // Tier Tabs in Detail Drawer
    this.container.querySelectorAll('.tier-tab-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tier = parseInt(e.currentTarget.dataset.tier, 10);
        if (tier !== this.activeTier) {
          this.activeTier = tier;
          audioService.playBlip(750, 0.04);

          this.container.querySelectorAll('.tier-tab-btn').forEach((b) => b.classList.remove('is-active'));
          e.currentTarget.classList.add('is-active');

          if (this.selectedSite) {
            this.renderDetailContent(this.selectedSite);
          }
        }
      });
    });

    this.bindInteractiveElements();

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
    });
  }

  openSite(siteId) {
    if (!siteId) return;
    const site = GLOBAL_MISSIONS.find((s) => s.id === siteId);
    if (site) {
      this.switchToMode(ATLAS_MODES.MISSIONS);
      setTimeout(() => {
        this.openDetailModal(site);
      }, 150);
    }
  }

  switchToMode(mode) {
    if (this.activeMode === mode) return;
    this.activeMode = mode;
    this.container.querySelectorAll('.mode-switch-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.mode === mode);
    });
    const facetsBar = this.container.querySelector('#missions-facets-bar');
    if (facetsBar) {
      facetsBar.style.display = mode === ATLAS_MODES.MISSIONS ? 'flex' : 'none';
    }
    const container = this.container.querySelector('#atlas-content-container');
    if (container) {
      container.innerHTML = this.renderActiveContentHtml();
      this.bindInteractiveElements();
    }
  }

  updateMissionsGrid() {
    const container = this.container.querySelector('#atlas-content-container');
    if (container && this.activeMode === ATLAS_MODES.MISSIONS) {
      container.innerHTML = this.renderMissionsGridHtml();
      this.bindInteractiveElements();
      const grid = container.querySelector('#expeditions-grid');
      if (grid) {
        anime({
          targets: grid.children,
          opacity: [0, 1],
          translateY: [12, 0],
          delay: anime.stagger(35),
          duration: 220,
          easing: 'easeOutCubic'
        });
      }
    }
  }

  bindInteractiveElements() {
    // Mission Explore button clicks & card clicks
    this.container.querySelectorAll('.card-btn-explore').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const siteId = e.currentTarget.dataset.siteId;
        const site = GLOBAL_MISSIONS.find((s) => s.id === siteId);
        if (site) {
          audioService.playBlip(750, 0.05);
          this.openDetailModal(site);
        }
      });
    });

    this.container.querySelectorAll('.exp-card:not(.is-active-site)').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-btn-explore') || e.target.closest('[data-action="explore-active"]')) return;
        const siteId = card.dataset.id;
        const site = GLOBAL_MISSIONS.find((s) => s.id === siteId);
        if (site) {
          audioService.playBlip(750, 0.05);
          this.openDetailModal(site);
        }
      });
    });

    // Active Apollo 12 site button click
    const activeBtn = this.container.querySelector('[data-action="explore-active"]');
    activeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      audioService.playBlip(880, 0.06);
      this.close();
    });

    // Flag mission links click to jump to mission detail
    this.container.querySelectorAll('.flag-mission-link').forEach((link) => {
      link.addEventListener('click', (e) => {
        const missionId = e.currentTarget.dataset.missionId;
        const site = GLOBAL_MISSIONS.find((s) => s.id === missionId);
        if (site) {
          audioService.playBlip(780, 0.05);
          this.openDetailModal(site);
        }
      });
    });
  }

  openDetailModal(site) {
    this.selectedSite = site;
    this.activeTier = 1; // Default to Tier 1
    lunarAtlasService.selectSite(site.id);
    const detailModal = this.container.querySelector('#site-detail-modal');
    if (!detailModal) return;

    // Reset Tier tab active state
    this.container.querySelectorAll('.tier-tab-btn').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.tier === '1');
    });

    this.renderDetailContent(site);

    detailModal.classList.add('is-open');
    anime({
      targets: detailModal,
      opacity: [0, 1],
      duration: 250,
      easing: 'easeOutCubic'
    });
  }

  renderDetailContent(site) {
    const content = this.container.querySelector('#detail-modal-content');
    if (!content) return;

    const isApollo12 = site.id === 'apollo-12';
    const distText = isApollo12
      ? '0 km (Current 3D Benchmark Location)'
      : `${Math.round(site.distanceKm).toLocaleString()} km across lunar surface (Bearing: ${String(Math.round(site.bearingDeg)).padStart(3, '0')}°)`;

    let tierHtml = '';

    if (this.activeTier === 1) {
      // TIER 1: DISCOVERY
      tierHtml = `
        <div class="tier-section">
          <div class="tier-badge-header">
            <span class="tier-indicator">TIER 1 &bull; MISSION DISCOVERY & PROFILE</span>
          </div>
          <div class="discovery-hero-card">
            <!-- Interactive 3D Artifact Holo-Plinth -->
            <div id="holo-viewer-mount" style="margin-bottom: 20px;"></div>

            <div class="discovery-summary">
              <h4 class="tier-subheading">MISSION OVERVIEW</h4>
              <p class="discovery-desc">${site.description}</p>
            </div>
            <div class="discovery-grid">
              <div class="discovery-stat">
                <span class="stat-label">EXPLORATION ERA</span>
                <span class="stat-value">${site.eraLabel || 'Lunar Space Age'}</span>
              </div>
              <div class="discovery-stat">
                <span class="stat-label">OUTCOME</span>
                <span class="stat-value">${site.status}</span>
              </div>
              <div class="discovery-stat">
                <span class="stat-label">LANDING TOUCHDOWN</span>
                <span class="stat-value">${site.landingDate}</span>
              </div>
              <div class="discovery-stat">
                <span class="stat-label">SURFACE STAY DURATION</span>
                <span class="stat-value">${site.surfaceStayHours ? `${site.surfaceStayHours} Hours` : 'N/A'}</span>
              </div>
              <div class="discovery-stat">
                <span class="stat-label">ASTRONAUTS / CREW</span>
                <span class="stat-value">${site.astronauts}</span>
              </div>
              <div class="discovery-stat">
                <span class="stat-label">GEOLOGIC BASIN</span>
                <span class="stat-value">${site.basin || site.region}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTier === 2) {
      // TIER 2: EXPLORATION
      tierHtml = `
        <div class="tier-section">
          <div class="tier-badge-header">
            <span class="tier-indicator">TIER 2 &bull; OPERATIONAL SURFACE EXPLORATION & CARTOGRAPHY</span>
          </div>
          <div class="exploration-card">
            <h4 class="tier-subheading">SURFACE RECONNAISSANCE & HISTORICAL TRAVERSE</h4>
            <p class="exploration-narrative">${site.description}</p>

            <div class="exploration-telemetry-panel">
              <div class="telemetry-block">
                <span class="block-label">SELENOGRAPHIC COORDINATES</span>
                <span class="block-value">${site.coordinates}</span>
                <span class="block-sub">Lat: ${site.lat}°, Lon: ${site.lon}°</span>
              </div>
              <div class="telemetry-block">
                <span class="block-label">SURFACE ELEVATION</span>
                <span class="block-value">${site.elevationMeters ? `${site.elevationMeters} m relative to datum` : 'Planetary average'}</span>
              </div>
              <div class="telemetry-block">
                <span class="block-label">POSITIONAL UNCERTAINTY</span>
                <span class="block-value">&plusmn;${site.uncertaintyMeters || 1} Meter (LROC Orbital Registration)</span>
              </div>
              <div class="telemetry-block">
                <span class="block-label">SPATIAL OFFSET FROM APOLLO 12</span>
                <span class="block-value">${distText}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTier === 3) {
      // TIER 3: INVESTIGATION
      tierHtml = `
        <div class="tier-section">
          <div class="tier-badge-header">
            <span class="tier-indicator">TIER 3 &bull; HARDWARE ARTIFACTS & SCIENTIFIC SPECIFICATIONS</span>
          </div>
          
          <div class="investigation-artifacts-block">
            <h4 class="tier-subheading">PERMANENT HUMAN HARDWARE IN SITU</h4>
            <div class="artifact-cards-grid">
              ${site.keyArtifacts.map((art) => `
                <div class="artifact-badge-card">
                  <span class="artifact-bullet">&bull;</span>
                  <span class="artifact-name">${art}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="investigation-specs-block">
            <h4 class="tier-subheading">ENGINEERING & MISSION TELEMETRY</h4>
            <div class="specs-grid">
              ${site.technicalSpecs.map((s) => `
                <div class="spec-card">
                  <span class="spec-card-label">${s.label}</span>
                  <span class="spec-card-val">${s.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTier === 4) {
      // TIER 4: ACADEMIC RESEARCH
      tierHtml = `
        <div class="tier-section">
          <div class="tier-badge-header">
            <span class="tier-indicator">TIER 4 &bull; ACADEMIC CITATIONS & ARCHIVAL REGISTRATION</span>
          </div>
          <div class="academic-card">
            <h4 class="tier-subheading">PRIMARY SCIENTIFIC DATASET & LITERATURE PROVENANCE</h4>
            <div class="academic-row">
              <span class="academic-label">PRIMARY SOURCE:</span>
              <span class="academic-val">${site.primarySource || 'NASA Planetary Data System (PDS) & NSSDC Master Catalog'}</span>
            </div>
            <div class="academic-row">
              <span class="academic-label">LROC NAC / ORBITAL DATASET:</span>
              <span class="academic-val">ASU Lunar Reconnaissance Orbiter Camera Narrow Angle Camera Products</span>
            </div>
            <div class="academic-row">
              <span class="academic-label">REGISTRY JURISDICTION:</span>
              <span class="academic-val">Registered under the 1974 UN Convention on Registration of Objects Launched into Outer Space</span>
            </div>
            <div class="academic-row">
              <span class="academic-label">AUTHORITATIVE DOCUMENTATION:</span>
              <div class="academic-val">
                ${site.sourceUrl ? `
                  <a href="${site.sourceUrl}" target="_blank" rel="noopener noreferrer" class="academic-link">
                    <span>${site.sourceUrl}</span>
                    <span class="link-arrow">&nearr;</span>
                  </a>
                ` : `
                  <span class="academic-link-disabled">NASA NSSDC Archives</span>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="detail-container-inner">
        <!-- Persistent Top Header Across All Tiers -->
        <header class="detail-header-block">
          <div class="detail-tag-line">
            <span>${site.code}</span>
            <span>&bull;</span>
            <span>${site.category.toUpperCase()}</span>
            <span>&bull;</span>
            <span>${site.country.toUpperCase()} (${site.agency})</span>
          </div>
          <h2 class="detail-mission-title">${site.name}</h2>
          <div class="detail-designation-line">${site.designation}</div>
          <div class="detail-telemetry-line">
            Coordinates: ${site.coordinates} &bull; Region: ${site.region} &bull; Touchdown: ${site.landingDate}
          </div>
        </header>

        <!-- Tier Dynamic Content -->
        <div class="detail-tier-body">
          ${tierHtml}
        </div>
      </div>
    `;

    // Mount interactive 3D Holo-Viewer in Tier 1
    if (this.activeTier === 1) {
      const mountEl = content.querySelector('#holo-viewer-mount');
      if (mountEl) {
        if (!this.holoViewer) {
          this.holoViewer = new ArtifactHoloViewer(mountEl);
        } else {
          this.holoViewer.mountElement = mountEl;
        }
        const entityType = this.mapSiteToEntityType(site.id);
        this.holoViewer.mount(entityType, site.id);
      }
    } else {
      if (this.holoViewer) {
        this.holoViewer.destroy();
        this.holoViewer = null;
      }
    }
  }

  mapSiteToEntityType(siteId) {
    const map = {
      'apollo-12': 'statio-cognitum',
      'luna-17': 'lunokhod-1',
      'luna-21': 'lunokhod-2',
      'apollo-15': 'apollo-15-lrv',
      'apollo-16': 'apollo-16-lrv',
      'apollo-17': 'apollo-17-lrv',
      'change-3': 'change-3-yutu',
      'change-4': 'change-4-yutu2',
      'chandrayaan-3': 'chandrayaan-3-pragyan',
      'slim': 'slim-sora-q',
      'luna-9': 'luna-9',
      'luna-16': 'luna-16',
      'luna-20': 'luna-16',
      'luna-24': 'luna-16',
      'luna-2': 'luna-2',
      'chandrayaan-1': 'luna-2',
      'beresheet': 'luna-2',
      'smart-1': 'luna-2'
    };
    return map[siteId] || 'lunokhod-1';
  }

  closeDetailModal() {
    if (this.holoViewer) {
      this.holoViewer.destroy();
      this.holoViewer = null;
    }
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
