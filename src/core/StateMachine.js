/**
 * AFTERLIGHT — Application State Machine
 */

import { events } from './EventBus.js';

export const STATES = {
  APPROACH: 'APPROACH',       // Stage A: Cinematic orbital approach & title
  ENVIRONMENT: 'ENVIRONMENT', // Stage B: Free exploration of landing site
  INSPECTION: 'INSPECTION',   // Stage C: Artifact inspection & dossier open
  TRAVERSE: 'TRAVERSE'        // Modal: 2D/3D traverse routes map
};

class StateMachine {
  constructor() {
    this.current = STATES.APPROACH;
    this.selectedArtifact = null;
    this.previousState = null;
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
    if (this.current === newState && (!data || data === this.selectedArtifact)) {
      return;
    }

    const oldState = this.current;
    this.previousState = oldState;
    this.current = newState;

    if (newState === STATES.INSPECTION) {
      this.selectedArtifact = data;
    } else if (newState === STATES.ENVIRONMENT) {
      this.selectedArtifact = null;
    }

    console.log(`[StateMachine] Transition: ${oldState} -> ${newState}`, data ? `(Artifact: ${data})` : '');
    events.emit('state:changed', {
      from: oldState,
      to: newState,
      artifact: this.selectedArtifact
    });
  }

  back() {
    if (this.current === STATES.INSPECTION || this.current === STATES.TRAVERSE) {
      this.transitionTo(STATES.ENVIRONMENT);
    }
  }
}

export const stateMachine = new StateMachine();
