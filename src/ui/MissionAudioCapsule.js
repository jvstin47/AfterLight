/**
 * AFTERLIGHT — Mission Audio & Air-to-Ground Comm Capsule
 * Uses Anime.js for waveform physics and live MET timecode interpolation.
 * Styled with the Astronaut UI component suite (.cir-note, .cir-btn).
 */

import anime from 'animejs';
import { eventBus } from '../core/EventBus.js';
import { audioManager } from '../core/AudioManager.js';

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
          MUTE
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
      audioManager.init();
      const isLive = audioManager.toggleMute();
      muteBtn.textContent = isLive ? 'MUTE' : 'UNMUTE';
      if (isLive) {
        this.startWaveform();
      } else {
        this.stopWaveform();
      }
    });

    closeBtn?.addEventListener('click', () => {
      this.hide();
    });

    // Listen to global audio mute event
    eventBus.on('audio:muted', (isMuted) => {
      if (muteBtn) muteBtn.textContent = isMuted ? 'UNMUTE' : 'MUTE';
      if (!isMuted) {
        this.show();
        this.startWaveform();
      } else {
        this.stopWaveform();
      }
    });

    // Rotate transcript lines every 12 seconds
    setInterval(() => {
      if (this.isOpen) {
        this.cycleTranscript();
      }
    }, 11000);
  }

  show() {
    this.isOpen = true;
    this.container.classList.remove('is-hidden');

    // Smooth spring slide-up using Anime.js
    anime.remove(this.container);
    anime({
      targets: this.container,
      translateY: ['120%', '0%'],
      opacity: [0, 1],
      duration: 650,
      easing: 'easeOutElastic(1, 0.75)'
    });

    this.startTimer();
    this.startWaveform();
  }

  hide() {
    this.isOpen = false;
    anime.remove(this.container);
    anime({
      targets: this.container,
      translateY: ['0%', '120%'],
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInCubic',
      complete: () => {
        this.container.classList.add('is-hidden');
      }
    });
    this.stopWaveform();
    this.stopTimer();
  }

  startWaveform() {
    if (this.waveformAnim) return;
    const bars = this.container.querySelectorAll('.comm-waveform span');
    this.waveformAnim = anime({
      targets: bars,
      height: () => anime.random(3, 16),
      delay: anime.stagger(50),
      duration: 220,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  stopWaveform() {
    if (this.waveformAnim) {
      this.waveformAnim.pause();
      this.waveformAnim = null;
    }
    const bars = this.container.querySelectorAll('.comm-waveform span');
    anime({
      targets: bars,
      height: 2,
      duration: 200,
      easing: 'easeOutQuad'
    });
  }

  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.secondsElapsed += 1;
      const h = Math.floor(this.secondsElapsed / 3600);
      const m = Math.floor((this.secondsElapsed % 3600) / 60);
      const s = this.secondsElapsed % 60;
      const pad = (n) => String(n).padStart(2, '0');
      const metEl = this.container.querySelector('#comm-met');
      if (metEl) {
        metEl.textContent = `MET ${h}:${pad(m)}:${pad(s)}`;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  cycleTranscript() {
    this.currentLineIdx = (this.currentLineIdx + 1) % TRANSCRIPT_LINES.length;
    const line = TRANSCRIPT_LINES[this.currentLineIdx];

    const speakerEl = this.container.querySelector('#comm-speaker');
    const textEl = this.container.querySelector('#comm-transcript');

    // Smooth Anime.js text fade transition
    anime({
      targets: [speakerEl, textEl],
      opacity: [1, 0],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => {
        if (speakerEl) speakerEl.textContent = line.speaker;
        if (textEl) textEl.textContent = line.text;
        anime({
          targets: [speakerEl, textEl],
          opacity: [0, 1],
          duration: 350,
          easing: 'easeOutQuad'
        });
      }
    });
  }
}
