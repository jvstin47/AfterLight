/**
 * AFTERLIGHT — Mission Audio & Air-to-Ground Comm Capsule
 * Uses Anime.js for waveform physics and live MET timecode interpolation.
 * Styled with the Astronaut UI component suite (.cir-note, .cir-btn).
 * Refactored to pure presentation consuming services and the reactive Store.
 */

import anime from 'animejs';
import { audioService } from '../services/AudioService.js';
import { store } from '../state/Store.js';
import { eventBus } from '../core/EventBus.js';

const TRANSCRIPT_LINES = [
  { speaker: 'LMP BEAN', text: '“We can see the Surveyor! It’s right on the edge of the crater... exactly where Pete said it would be.”', met: 'MET 131:59:12' },
  { speaker: 'CDR CONRAD', text: '“Hey, look at the footprints we’re making down this slope. The dust clings to everything!”', met: 'MET 132:04:45' },
  { speaker: 'CAPCOM GIBSON', text: '“Intrepid, Houston. We copy contact with Surveyor III. You are Go to commence camera recovery.”', met: 'MET 132:11:02' },
  { speaker: 'CDR CONRAD', text: '“Man, that Surveyor looks like it just landed yesterday! The glass on the mirror is clean.”', met: 'MET 132:18:30' }
];

export class MissionAudioCapsule {
  constructor() {
    this.container = null;
    this.waveformAnim = null;
    this.timerAnim = null;
    this.currentLineIdx = 0;
    this.isOpen = false;
    this.secondsElapsed = 131 * 3600 + 59 * 60 + 12;

    this.render();
    this.bindEvents();
    this.setupStoreSubscriptions();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'cir-note is-hidden';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Apollo 12 Air-to-Ground Radio Loop');

    this.container.innerHTML = `
      <span class="cir-note__ico" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      </span>
      <div class="cir-note__body">
        <p class="cir-note__t">
          <span id="comm-speaker">LMP BEAN</span> &bull; <span id="comm-met" style="font-variant-numeric: tabular-nums;">MET 131:59:12</span>
        </p>
        <p id="comm-transcript" class="cir-note__d">
          “We can see the Surveyor! It’s right on the edge of the crater... exactly where Pete said it would be.”
        </p>
        <!-- Anime.js Animated Audio Waveform Bars -->
        <div class="comm-waveform" aria-hidden="true">
          <span style="height: 6px;"></span>
          <span style="height: 12px;"></span>
          <span style="height: 16px;"></span>
          <span style="height: 8px;"></span>
          <span style="height: 14px;"></span>
          <span style="height: 5px;"></span>
          <span style="height: 11px;"></span>
          <span style="height: 7px;"></span>
        </div>
      </div>
      <div class="cir-note__act">
        <button id="comm-mute-btn" class="cir-note__btn" type="button" aria-label="Mute or unmute comm audio">
          ${store.getState().audio.isMuted ? 'UNMUTE' : 'MUTE'}
        </button>
        <button id="comm-close-btn" class="cir-note__close" type="button" aria-label="Dismiss transmission card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  bindEvents() {
    const muteBtn = this.container.querySelector('#comm-mute-btn');
    const closeBtn = this.container.querySelector('#comm-close-btn');

    muteBtn?.addEventListener('click', () => {
      audioService.toggleMute();
    });

    closeBtn?.addEventListener('click', () => {
      this.hide();
    });

    // Automatically reveal capsule when entering Surveyor 3 vantage point
    eventBus.on('camera:preset', (preset) => {
      if (preset === 'SURVEYOR_RIM') {
        setTimeout(() => this.show(), 800);
      }
    });

    // Cycle through real historical radio transcripts periodically
    setInterval(() => {
      if (this.isOpen) {
        this.currentLineIdx = (this.currentLineIdx + 1) % TRANSCRIPT_LINES.length;
        this.updateTranscript(TRANSCRIPT_LINES[this.currentLineIdx]);
      }
    }, 14000);
  }

  setupStoreSubscriptions() {
    const muteBtn = this.container.querySelector('#comm-mute-btn');

    store.subscribe(
      (s) => s.audio.isMuted,
      (isMuted) => {
        if (muteBtn) {
          muteBtn.textContent = isMuted ? 'UNMUTE' : 'MUTE';
        }
        if (!isMuted && this.isOpen) {
          this.startWaveform();
        } else {
          this.stopWaveform();
        }
      }
    );
  }

  updateTranscript(item) {
    const speakerEl = this.container.querySelector('#comm-speaker');
    const metEl = this.container.querySelector('#comm-met');
    const textEl = this.container.querySelector('#comm-transcript');

    anime({
      targets: [speakerEl, metEl, textEl],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        if (speakerEl) speakerEl.textContent = item.speaker;
        if (metEl) metEl.textContent = item.met;
        if (textEl) textEl.textContent = item.text;

        anime({
          targets: [speakerEl, metEl, textEl],
          opacity: [0, 1],
          duration: 350,
          easing: 'easeOutQuad'
        });
      }
    });
  }

  startWaveform() {
    const bars = this.container.querySelectorAll('.comm-waveform span');
    if (this.waveformAnim) this.waveformAnim.pause();

    this.waveformAnim = anime({
      targets: bars,
      height: () => anime.random(4, 20),
      duration: 160,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: anime.stagger(30)
    });
  }

  stopWaveform() {
    if (this.waveformAnim) {
      this.waveformAnim.pause();
    }
    const bars = this.container.querySelectorAll('.comm-waveform span');
    anime({
      targets: bars,
      height: 4,
      duration: 200,
      easing: 'easeOutQuad'
    });
  }

  show() {
    this.isOpen = true;
    this.container.classList.remove('is-hidden');
    anime({
      targets: this.container,
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutCubic'
    });

    if (!audioService.isMuted()) {
      this.startWaveform();
    }
  }

  hide() {
    this.isOpen = false;
    this.stopWaveform();
    anime({
      targets: this.container,
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInCubic',
      complete: () => {
        this.container.classList.add('is-hidden');
      }
    });
  }
}
