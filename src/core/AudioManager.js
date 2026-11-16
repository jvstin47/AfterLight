/**
 * AFTERLIGHT — Positional 3D Spatial Audio & Web Audio Synthesizer
 * Grounded in Apollo 12 operational acoustics: Quindar tele-command tones,
 * spacesuit PLSS oxygen ventilation drone, and 3D HRTF hardware beacons.
 */

import * as THREE from 'three';
import { events } from './EventBus.js';

const _forward = new THREE.Vector3();
const _up = new THREE.Vector3();

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Respect user privacy by default
    this.ambientGain = null;
    this.beaconsGain = null;
    this.isInitialized = false;
    this.spatialBeacons = [];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.setupAmbientDrone();
      this.setupSpatialBeacons();
      this.isInitialized = true;
      console.log('[AudioManager] Positional Web Audio initialized.');
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

  /**
   * Sets up positional 3D sound emitters at authentic hardware coordinates
   */
  setupSpatialBeacons() {
    if (!this.ctx) return;

    this.beaconsGain = this.ctx.createGain();
    this.beaconsGain.gain.value = this.isMuted ? 0 : 0.15;
    this.beaconsGain.connect(this.ctx.destination);

    const beaconConfigs = [
      // 1. LM-6 Intrepid: 55Hz low-frequency electrical transformer hum
      { name: 'lm-intrepid', x: 0, y: 1.5, z: 0, freq: 55, type: 'sawtooth', filterFreq: 140, gainVal: 0.06 },
      // 2. Surveyor 3: 1800Hz faint robotic telemetry sync carrier
      { name: 'surveyor-3', x: 72, y: -10, z: 150, freq: 1800, type: 'sine', filterFreq: 2200, gainVal: 0.035 },
      // 3. ALSEP SNAP-27: 110Hz thermal RTG resonance hum
      { name: 'alsep', x: -106, y: 0.5, z: -75, freq: 110, type: 'triangle', filterFreq: 280, gainVal: 0.045 }
    ];

    for (const cfg of beaconConfigs) {
      try {
        const panner = this.ctx.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 8;
        panner.maxDistance = 220;
        panner.rolloffFactor = 1.4;

        if (panner.positionX) {
          panner.positionX.setValueAtTime(cfg.x, this.ctx.currentTime);
          panner.positionY.setValueAtTime(cfg.y, this.ctx.currentTime);
          panner.positionZ.setValueAtTime(cfg.z, this.ctx.currentTime);
        } else {
          panner.setPosition(cfg.x, cfg.y, cfg.z);
        }

        const osc = this.ctx.createOscillator();
        osc.type = cfg.type;
        osc.frequency.setValueAtTime(cfg.freq, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(cfg.filterFreq, this.ctx.currentTime);

        const localGain = this.ctx.createGain();
        localGain.gain.setValueAtTime(cfg.gainVal, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(localGain);
        localGain.connect(panner);
        panner.connect(this.beaconsGain);

        osc.start(0);

        this.spatialBeacons.push({
          name: cfg.name,
          panner,
          osc,
          localGain
        });
      } catch (e) {
        console.warn('[AudioManager] Failed to create 3D panner beacon for', cfg.name, e);
      }
    }
  }

  /**
   * Updates Web Audio listener orientation and position from Three.js camera
   * @param {THREE.Camera} camera 
   */
  updateListener(camera) {
    if (!this.ctx || !camera) return;
    const listener = this.ctx.listener;
    const pos = camera.position;

    // Update Listener Position
    if (listener.positionX) {
      listener.positionX.setTargetAtTime(pos.x, this.ctx.currentTime, 0.05);
      listener.positionY.setTargetAtTime(pos.y, this.ctx.currentTime, 0.05);
      listener.positionZ.setTargetAtTime(pos.z, this.ctx.currentTime, 0.05);
    } else {
      listener.setPosition(pos.x, pos.y, pos.z);
    }

    // Update Listener Forward and Up Vectors
    _forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    _up.set(0, 1, 0).applyQuaternion(camera.quaternion);

    if (listener.forwardX) {
      listener.forwardX.setTargetAtTime(_forward.x, this.ctx.currentTime, 0.05);
      listener.forwardY.setTargetAtTime(_forward.y, this.ctx.currentTime, 0.05);
      listener.forwardZ.setTargetAtTime(_forward.z, this.ctx.currentTime, 0.05);
      listener.upX.setTargetAtTime(_up.x, this.ctx.currentTime, 0.05);
      listener.upY.setTargetAtTime(_up.y, this.ctx.currentTime, 0.05);
      listener.upZ.setTargetAtTime(_up.z, this.ctx.currentTime, 0.05);
    } else {
      listener.setOrientation(_forward.x, _forward.y, _forward.z, _up.x, _up.y, _up.z);
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;

    if (this.ctx) {
      const targetAmbient = this.isMuted ? 0 : 0.08;
      const targetBeacons = this.isMuted ? 0 : 0.15;
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(targetAmbient, this.ctx.currentTime, 0.1);
      }
      if (this.beaconsGain) {
        this.beaconsGain.gain.setTargetAtTime(targetBeacons, this.ctx.currentTime, 0.1);
      }
    }

    if (!this.isMuted) {
      this.playQuindar(true);
    }
    events.emit('audio:muted', this.isMuted);
    return !this.isMuted;
  }

  playQuindarIntro() {
    this.playQuindar(true);
  }

  playQuindarOutro() {
    this.playQuindar(false);
  }

  playQuindar(isIntro = true) {
    if (this.isMuted || !this.ctx) return;
    this.ensureContext();

    const freq = isIntro ? 2525 : 2475;
    const duration = 0.25;

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

