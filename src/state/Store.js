/**
 * AFTERLIGHT — Centralized Reactive State Store
 * Provides immutable state access, pure reducer transitions, and fine-grained subscriptions.
 */

import { APP_STAGES, CAMERA_PRESETS } from '../config/constants.js';
import { env } from '../config/env.js';
import { ActionTypes } from './actions.js';
import { eventBus } from '../core/EventBus.js';
import { logger } from '../utils/logger.js';

const initialState = Object.freeze({
  app: Object.freeze({
    stage: APP_STAGES.APPROACH,
    isLoading: true,
    isWebGLEnabled: true
  }),
  camera: Object.freeze({
    activePreset: CAMERA_PRESETS.OVERVIEW,
    isTransitioning: false,
    surveyorProximity: 163
  }),
  audio: Object.freeze({
    isMuted: env.audio.defaultMuted,
    volume: 0.8
  }),
  inspection: Object.freeze({
    selectedArtifactId: null,
    selectedArtifact: null,
    isOpen: false
  }),
  modals: Object.freeze({
    isTraverseOpen: false,
    isExpeditionsOpen: false,
    isQuickSearchOpen: false,
    isVidiconActive: false,
    activeExpeditionId: null
  }),
  atlas: Object.freeze({
    activeFilter: 'ALL',
    searchQuery: '',
    selectedSiteId: null
  })
});

class Store {
  constructor() {
    this._state = initialState;
    this._subscribers = new Set();
  }

  /**
   * Returns current immutable state tree.
   * @returns {typeof initialState}
   */
  getState() {
    return this._state;
  }

  /**
   * Dispatches an action, executes state transitions, and notifies subscribers.
   * @param {string} type Action type
   * @param {any} [payload] Action payload
   */
  dispatch(type, payload) {
    const prevState = this._state;
    this._state = this._reduce(prevState, type, payload);

    if (prevState !== this._state) {
      logger.debug(`[Action] ${type}`, payload);
      this._notify(prevState, this._state);
    }
  }

  /**
   * Pure reducer function.
   * @private
   */
  _reduce(state, type, payload) {
    switch (type) {
      case ActionTypes.SET_STAGE:
        return {
          ...state,
          app: { ...state.app, stage: payload }
        };

      case ActionTypes.SET_LOADING:
        return {
          ...state,
          app: { ...state.app, isLoading: !!payload }
        };

      case ActionTypes.SET_WEBGL_SUPPORT:
        return {
          ...state,
          app: { ...state.app, isWebGLEnabled: !!payload }
        };

      case ActionTypes.SET_CAMERA_PRESET:
        return {
          ...state,
          camera: { ...state.camera, activePreset: payload }
        };

      case ActionTypes.SET_CAMERA_TRANSITIONING:
        return {
          ...state,
          camera: { ...state.camera, isTransitioning: !!payload }
        };

      case ActionTypes.UPDATE_SURVEYOR_PROXIMITY:
        return {
          ...state,
          camera: { ...state.camera, surveyorProximity: payload }
        };

      case ActionTypes.TOGGLE_AUDIO_MUTE: {
        const nextMuted = !state.audio.isMuted;
        return {
          ...state,
          audio: { ...state.audio, isMuted: nextMuted }
        };
      }

      case ActionTypes.SET_AUDIO_MUTED:
        return {
          ...state,
          audio: { ...state.audio, isMuted: !!payload }
        };

      case ActionTypes.SET_AUDIO_VOLUME:
        return {
          ...state,
          audio: { ...state.audio, volume: payload }
        };

      case ActionTypes.SELECT_ARTIFACT:
        return {
          ...state,
          inspection: {
            selectedArtifactId: payload?.id || null,
            selectedArtifact: payload || null,
            isOpen: true
          },
          app: {
            ...state.app,
            stage: APP_STAGES.INSPECTION
          }
        };

      case ActionTypes.CLOSE_INSPECTION:
        return {
          ...state,
          inspection: {
            selectedArtifactId: null,
            selectedArtifact: null,
            isOpen: false
          },
          app: {
            ...state.app,
            stage: APP_STAGES.ENVIRONMENT
          }
        };

      case ActionTypes.TOGGLE_TRAVERSE_MODAL:
        return {
          ...state,
          modals: { ...state.modals, isTraverseOpen: !state.modals.isTraverseOpen }
        };

      case ActionTypes.SET_TRAVERSE_MODAL:
        return {
          ...state,
          modals: { ...state.modals, isTraverseOpen: !!payload }
        };

      case ActionTypes.TOGGLE_EXPEDITIONS_MODAL:
        return {
          ...state,
          modals: { ...state.modals, isExpeditionsOpen: !state.modals.isExpeditionsOpen }
        };

      case ActionTypes.SET_EXPEDITIONS_MODAL:
        return {
          ...state,
          modals: {
            ...state.modals,
            isExpeditionsOpen: !!payload,
            activeExpeditionId: payload?.siteId || state.modals.activeExpeditionId
          }
        };

      case ActionTypes.TOGGLE_QUICK_SEARCH:
        return {
          ...state,
          modals: { ...state.modals, isQuickSearchOpen: !state.modals.isQuickSearchOpen }
        };

      case ActionTypes.SET_QUICK_SEARCH:
        return {
          ...state,
          modals: { ...state.modals, isQuickSearchOpen: !!payload }
        };

      case ActionTypes.TOGGLE_VIDICON_SCAN:
        return {
          ...state,
          modals: { ...state.modals, isVidiconActive: !state.modals.isVidiconActive }
        };

      case ActionTypes.SET_VIDICON_SCAN:
        return {
          ...state,
          modals: { ...state.modals, isVidiconActive: !!payload }
        };

      case ActionTypes.SET_ATLAS_FILTER:
        return {
          ...state,
          atlas: { ...state.atlas, activeFilter: payload }
        };

      case ActionTypes.SELECT_EXPEDITION_SITE:
        return {
          ...state,
          atlas: { ...state.atlas, selectedSiteId: payload }
        };

      case ActionTypes.SET_ATLAS_SEARCH:
        return {
          ...state,
          atlas: { ...state.atlas, searchQuery: payload }
        };

      default:
        return state;
    }
  }

  /**
   * Subscribes a listener to state changes.
   * If a selector function is provided, listener is only invoked when selected slice changes.
   *
   * @param {Function} [selector] Selector returning a specific state slice (e.g. s => s.audio.isMuted)
   * @param {Function} listener Callback (selectedSlice, prevSlice, fullState)
   * @returns {() => void} Unsubscribe callback
   */
  subscribe(selector, listener) {
    if (typeof selector === 'function' && typeof listener === 'function') {
      let prevSlice = selector(this._state);
      const subscription = (prevState, nextState) => {
        const nextSlice = selector(nextState);
        if (prevSlice !== nextSlice) {
          const oldSlice = prevSlice;
          prevSlice = nextSlice;
          try {
            listener(nextSlice, oldSlice, nextState);
          } catch (err) {
            logger.error('Error in store subscriber:', err);
          }
        }
      };
      this._subscribers.add(subscription);
      return () => this._subscribers.delete(subscription);
    }

    const simpleListener = typeof selector === 'function' ? selector : listener;
    this._subscribers.add(simpleListener);
    return () => this._subscribers.delete(simpleListener);
  }

  _notify(prevState, nextState) {
    this._subscribers.forEach((subscriber) => {
      try {
        subscriber(prevState, nextState);
      } catch (err) {
        logger.error('Error notifying subscriber:', err);
      }
    });
  }
}

export const store = new Store();
