/**
 * AFTERLIGHT — Audio Engine (Web Audio API Synthesizer)
 * Synthesizes authentic Apollo Quindar tones and suit ECS ambient drone.
 */

import { events } from './EventBus.js';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Respect user privacy by default
    this.ambientGain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.setupAmbientDrone();
      this.isInitialized = true;
      console.log('[AudioManager] Web Audio initialized.');
    } catch (err) {
      console.warn('[AudioManager] Web Audio not supported or failed to initialize:', err);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setupAmbientDrone() {
    if (!this.ctx) return;
    // Low-frequency pink-noise / filtered drone representing spacesuit ECS ventilation
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to deep hollow frequencies (rumble of suit oxygen fans)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    filter.Q.value = 2.5;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = this.isMuted ? 0 : 0.08;

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    whiteNoise.start(0);
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.ambientGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.08;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
    if (!this.isMuted) {
      this.playQuindar(true);
    }
    events.emit('audio:muted', this.isMuted);
    return !this.isMuted;
  }

  /**
   * Play Apollo Quindar Intro Tone (2525 Hz)
   */
  playQuindarIntro() {
    this.playQuindar(true);
  }

  /**
   * Play Apollo Quindar Outro Tone (2475 Hz)
   */
  playQuindarOutro() {
    this.playQuindar(false);
  }

  /**
   * Play Apollo Quindar Tone
   * @param {boolean} isIntro - true for 2525 Hz (intro PTT), false for 2475 Hz (outro)
   */
  playQuindar(isIntro = true) {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const freq = isIntro ? 2525 : 2475;
    const duration = 0.25; // 250ms

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.02);
    gain.gain.setValueAtTime(0.04, this.ctx.currentTime + duration - 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playClick() {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }
}

export const audioManager = new AudioManager();
