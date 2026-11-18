/**
 * AFTERLIGHT — Audio Service
 * Decouples audio business logic, Quindar cues, and sound state from UI components.
 */

import { audioManager } from '../core/AudioManager.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { AUDIO_FREQUENCIES } from '../config/constants.js';

class AudioService {
  constructor() {
    this._initialized = false;
  }

  ensureInitialized() {
    if (!this._initialized) {
      audioManager.init();
      this._initialized = true;
    }
  }

  /**
   * Toggles audio mute state, updates the store, and plays Quindar cue if unmuting.
   * @returns {boolean} New live status (true = live, false = muted)
   */
  toggleMute() {
    this.ensureInitialized();
    const isLive = audioManager.toggleMute();
    store.dispatch(ActionTypes.SET_AUDIO_MUTED, !isLive);
    return isLive;
  }

  /**
   * Sets mute status explicitly.
   * @param {boolean} muted
   */
  setMuted(muted) {
    this.ensureInitialized();
    if (audioManager.isMuted !== muted) {
      audioManager.toggleMute();
    }
    store.dispatch(ActionTypes.SET_AUDIO_MUTED, muted);
  }

  /**
   * Plays Quindar intro frequency tone (2525 Hz)
   */
  playQuindarIntro() {
    this.ensureInitialized();
    audioManager.playQuindarIntro();
  }

  /**
   * Plays Quindar outro frequency tone (2475 Hz)
   */
  playQuindarOutro() {
    this.ensureInitialized();
    audioManager.playQuindarOutro();
  }

  /**
   * Plays subtle UI feedback blip.
   * @param {number} [freq=620]
   * @param {number} [duration=0.04]
   */
  playBlip(freq = AUDIO_FREQUENCIES.UI_BLIP, duration = 0.04) {
    try {
      if (typeof audioManager.playBlip === 'function') {
        audioManager.playBlip(freq, duration);
      } else {
        audioManager.playClick();
      }
    } catch {}
  }

  /**
   * Plays metallic mechanical switch click.
   */
  playClick() {
    try {
      audioManager.playClick();
    } catch {}
  }

  isMuted() {
    return store.getState().audio.isMuted;
  }
}

export const audioService = new AudioService();
