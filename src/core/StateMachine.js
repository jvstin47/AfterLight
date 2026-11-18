/**
 * AFTERLIGHT — Application State Machine
 * Coordinates formal stage transitions and syncs with the central Store.
 */

import { APP_STAGES } from '../config/constants.js';
import { store } from '../state/Store.js';
import { ActionTypes } from '../state/actions.js';
import { events } from './EventBus.js';
import { logger } from '../utils/logger.js';

export const STATES = APP_STAGES;

class StateMachine {
  constructor() {
    this.previousState = null;
  }

  get current() {
    return store.getState().app.stage;
  }

  get selectedArtifact() {
    return store.getState().inspection.selectedArtifact;
  }

  getState() {
    return this.current;
  }

  getSelectedArtifact() {
    return this.selectedArtifact;
  }

  transition(newState, data = null) {
    return this.transitionTo(newState, data);
  }

  transitionTo(newState, data = null) {
    const currentState = this.current;
    if (currentState === newState && (!data || data === this.selectedArtifact)) {
      return;
    }

    this.previousState = currentState;

    if (newState === STATES.INSPECTION) {
      store.dispatch(ActionTypes.SELECT_ARTIFACT, data);
    } else if (newState === STATES.ENVIRONMENT) {
      if (currentState === STATES.INSPECTION) {
        store.dispatch(ActionTypes.CLOSE_INSPECTION);
      } else {
        store.dispatch(ActionTypes.SET_STAGE, STATES.ENVIRONMENT);
      }
    } else {
      store.dispatch(ActionTypes.SET_STAGE, newState);
    }

    logger.debug(`[StateMachine] ${currentState} -> ${newState}`, data ? `(Artifact: ${data?.id || data})` : '');

    events.emit('state:changed', {
      from: currentState,
      to: newState,
      artifact: this.selectedArtifact
    });
  }

  back() {
    if (this.current === STATES.INSPECTION || this.current === STATES.TRAVERSE || this.current === STATES.EXPEDITIONS) {
      this.transitionTo(STATES.ENVIRONMENT);
    }
  }
}

export const stateMachine = new StateMachine();
