/**
 * AFTERLIGHT — Redesigned Opening Experience (Cinematic Archival Entry)
 * Editorial typography, Apollo Hasselblad reseau markings, and purposeful transitions.
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

export class ApproachOverlay {
  /**
   * @param {HTMLElement} container 
   */
  constructor(container) {
    this.container = container;
    this.render();
    this.bindEvents();
    this.animateIn();
  }

  render() {
    this.container.innerHTML = `
      <div class="approach-backdrop"></div>
      
      <!-- Architectural Framing & Reseau Corner Ticks -->
      <div class="approach-frame" aria-hidden="true">
        <span class="reseau-tick top-left">+</span>
        <span class="reseau-tick top-right">+</span>
        <span class="reseau-tick bottom-left">+</span>
        <span class="reseau-tick bottom-right">+</span>
      </div>

      <div class="approach-content">
        <!-- Top Archival Meta Bar -->
        <header class="approach-header">
          <div class="approach-catalog-meta">
            <span class="meta-dot"></span>
            <span class="meta-archive-id">ARCHIVAL EXPEDITION RECORD &bull; DECOMMISSIONED HARDWARE</span>
          </div>
          <div class="approach-coordinates" aria-label="Lunar Coordinates">
            <span>3.01239° S</span>
            <span class="coord-divider">&bull;</span>
            <span>23.42157° W</span>
            <span class="coord-divider">&bull;</span>
            <span class="coord-region">OCEANUS PROCELLARUM</span>
          </div>
        </header>

        <!-- Centerpiece Editorial Section -->
        <main class="approach-centerpiece">
          <div class="approach-title-group">
            <div class="approach-series-tag">EXPEDITION 01 &bull; APOLLO 12 RENDEZVOUS</div>
            <h1 class="approach-title">AFTERLIGHT</h1>
            <p class="approach-subtitle">The machines that stayed behind.</p>
          </div>

          <div class="approach-divider" aria-hidden="true">
            <span class="divider-line"></span>
            <span class="divider-amber-mark"></span>
            <span class="divider-line"></span>
          </div>

          <blockquote class="approach-quote">
            <p class="quote-text">
              &ldquo;We can see the Surveyor! It’s right on the edge of the crater... exactly where Pete said it would be.&rdquo;
            </p>
            <cite class="quote-attribution">
              <span class="cite-author">Alan L. Bean</span>
              <span class="cite-role">Lunar Module Pilot &bull; Extravehicular Activity II &bull; November 20, 1969</span>
            </cite>
          </blockquote>
        </main>

        <!-- Primary Entrance Actions -->
        <div class="approach-actions">
          <button id="btn-enter-site" class="btn-enter-archive cir-btn" aria-label="Enter lunar landing site and descend from orbit">
            <span class="btn-corner top-l"></span>
            <span class="btn-corner bottom-r"></span>
            <span class="btn-primary-text">ENTER EXPEDITION</span>
            <svg class="cir-btn__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 17 17 7"></path>
              <path d="M7 7h10v10"></path>
            </svg>
            <span class="btn-key-badge">ENTER ↵</span>
          </button>
          <button id="btn-skip-intro" class="btn-skip-descent" aria-label="Skip orbital approach sequence directly to surface">
            <span>SKIP DESCENT</span>
            <span class="btn-key-hint">[ESC]</span>
          </button>
        </div>

        <!-- Archival Telemetry Footer -->
        <footer class="approach-footer">
          <div class="footer-telemetry">
            <span class="telem-label">APPROACH ALTITUDE</span>
            <span class="telem-val">1,400 M</span>
            <span class="telem-sep">/</span>
            <span class="telem-label">SUN ELEVATION</span>
            <span class="telem-val">12.4° ESE (DAWN)</span>
            <span class="telem-sep">/</span>
            <span class="telem-label">HARDWARE STATUS</span>
            <span class="telem-val telem-amber">PERMANENT ARTIFACTS</span>
          </div>
          <div class="footer-notes">
            <span>RECOMMENDED: AUDIO ENABLED</span>
          </div>
        </footer>
      </div>
    `;
  }

  bindEvents() {
    const enterBtn = this.container.querySelector('#btn-enter-site');
    const skipBtn = this.container.querySelector('#btn-skip-intro');

    enterBtn?.addEventListener('click', () => this.dismiss(false));
    skipBtn?.addEventListener('click', () => this.dismiss(true));

    this.onKeydown = (e) => {
      if (e.key === 'Escape') {
        this.dismiss(true);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.dismiss(false);
      }
    };
    window.addEventListener('keydown', this.onKeydown);
  }

  animateIn() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.container.querySelectorAll('*').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    anime.timeline({ easing: 'easeOutCubic' })
      .add({
        targets: '.approach-frame .reseau-tick',
        opacity: [0, 0.45],
        duration: 900,
        delay: anime.stagger(100),
      })
      .add({
        targets: '.approach-header',
        opacity: [0, 1],
        translateY: [-12, 0],
        duration: 800,
      }, '-=600')
      .add({
        targets: '.approach-series-tag',
        opacity: [0, 1],
        letterSpacing: ['0.35em', '0.22em'],
        duration: 700,
      }, '-=500')
      .add({
        targets: '.approach-title',
        opacity: [0, 1],
        letterSpacing: ['0.3em', '0.14em'],
        duration: 1100,
      }, '-=500')
      .add({
        targets: '.approach-subtitle',
        opacity: [0, 0.95],
        translateY: [10, 0],
        duration: 800,
      }, '-=700')
      .add({
        targets: '.approach-divider .divider-line',
        scaleX: [0, 1],
        duration: 700,
      }, '-=400')
      .add({
        targets: '.approach-divider .divider-amber-mark',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 500,
      }, '-=500')
      .add({
        targets: '.approach-quote',
        opacity: [0, 0.85],
        translateY: [12, 0],
        duration: 900,
      }, '-=400')
      .add({
        targets: '.approach-actions, .approach-footer',
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 750,
      }, '-=500');
  }

  dismiss(immediate = false) {
    window.removeEventListener('keydown', this.onKeydown);

    // Audio cue
    audioManager.init();
    audioManager.playQuindarIntro();

    eventBus.emit('approach:complete', { immediate });

    const duration = immediate ? 350 : 1100;
    anime({
      targets: this.container,
      opacity: [1, 0],
      duration: duration,
      easing: 'easeInOutCubic',
      complete: () => {
        this.container.style.display = 'none';
        this.container.innerHTML = '';
      },
    });
  }
}
