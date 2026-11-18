/**
 * AFTERLIGHT — Navigation & Perspective Service
 * Manages observation vantage points, camera presets, and transitions.
 */

import { CAMERA_PRESETS } from '../config/constants.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { eventBus } from '../core/EventBus.js';

class NavigationService {
  /**
   * Sets the camera observation vantage preset.
   * @param {string} preset One of CAMERA_PRESETS
   * @param {number} [duration] Transition duration in ms
   */
  setPreset(preset, duration = null) {
    if (!CAMERA_PRESETS[preset]) {
      console.warn(`[NavigationService] Unknown preset: ${preset}`);
      return;
    }

    store.dispatch(ActionTypes.SET_CAMERA_PRESET, preset);
    eventBus.emit('camera:preset', preset, duration);
  }

  /**
   * Returns current active camera preset.
   * @returns {string}
   */
  getActivePreset() {
    return store.getState().camera.activePreset;
  }
}

export const navigationService = new NavigationService();
