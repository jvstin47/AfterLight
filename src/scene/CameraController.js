import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import anime from 'animejs';
import { SplinePathEngine } from './SplinePathEngine.js';

export const CAMERA_PRESETS = {
  APPROACH: {
    position: new THREE.Vector3(0, 1200, 1400),
    target: new THREE.Vector3(0, 0, 0),
    fov: 40,
  },
  OVERVIEW: {
    position: new THREE.Vector3(30, 130, 230),
    target: new THREE.Vector3(25, -4, 45),
    fov: 45,
  },
  EYE_LEVEL: {
    position: new THREE.Vector3(-14, 1.75, 18),
    target: new THREE.Vector3(0, 2.8, 0),
    fov: 50,
  },
  SURVEYOR_RIM: {
    position: new THREE.Vector3(52, 4.0, 92),
    target: new THREE.Vector3(72, -10.0, 150),
    fov: 45,
  },
  ALSEP_SITE: {
    position: new THREE.Vector3(-102.5, 1.7, -71.5),
    target: new THREE.Vector3(-106, 0.4, -75),
    fov: 45,
  },
  CELESTIAL_EARTH: {
    // Standing near the LM looking high up into the East-Southeast sky at crescent Earth (64.5° elevation)
    position: new THREE.Vector3(-6.0, 1.75, 6.0),
    target: new THREE.Vector3(120.0, 260.0, -14.0),
    fov: 46,
  },
};

export class CameraController {
  /**
   * @param {HTMLElement} domElement 
   * @param {number} aspect 
   * @param {Function} elevationFn (x, z) => ground elevation in meters
   */
  constructor(domElement, aspect, elevationFn = () => 0) {
    this.domElement = domElement;
    this.elevationFn = elevationFn;
    this.splineEngine = new SplinePathEngine(elevationFn);

    // Expanded far clipping plane to 25,000m for true spherical planetary horizon
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.3, 25000);
    this.controls = new OrbitControls(this.camera, this.domElement);

    this.isTransitioning = false;
    this.currentAnimation = null;

    this.initControls();
  }

  initControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;

    // Constrain so camera doesn't dip under the lunar surface
    this.controls.maxPolarAngle = Math.PI / 2 - 0.03;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 650.0;

    // Default starting point (Approach position)
    const preset = CAMERA_PRESETS.APPROACH;
    this.camera.position.copy(preset.position);
    this.controls.target.copy(preset.target);
    this.controls.update();
  }

  /**
   * Transition smoothly along a cinematic 3D spline trajectory
   * @param {THREE.Vector3|{x:number, y:number, z:number}} targetPosition 
   * @param {THREE.Vector3|{x:number, y:number, z:number}} targetLookAt 
   * @param {number} duration ms
   * @param {Function} onComplete 
   */
  flyTo(targetPosition, targetLookAt, duration = 2400, onComplete = null) {
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }

    this.isTransitioning = true;
    this.controls.enabled = false;

    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const endPos = new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z);
    const endTarget = new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z);

    const trajectory = this.splineEngine.createTrajectory(
      startPos,
      endPos,
      startTarget,
      endTarget
    );

    const animState = { t: 0 };

    this.currentAnimation = anime({
      targets: animState,
      t: 1,
      duration: duration,
      easing: 'linear', // Easing is handled internally by splineEngine quintic smoothstep
      update: () => {
        const sample = trajectory.sampleAt(animState.t);
        this.camera.position.copy(sample.position);
        this.controls.target.copy(sample.target);
        this.controls.update();
      },
      complete: () => {
        this.isTransitioning = false;
        this.controls.enabled = true;
        this.controls.update();
        if (typeof onComplete === 'function') {
          onComplete();
        }
      },
    });
  }

  /**
   * Jump or transition to named preset
   * @param {keyof CAMERA_PRESETS} presetKey 
   * @param {number} duration 
   * @param {Function} onComplete 
   */
  setPreset(presetKey, duration = 2000, onComplete = null) {
    const preset = CAMERA_PRESETS[presetKey];
    if (!preset) return;
    this.flyTo(preset.position, preset.target, duration, onComplete);
  }

  update() {
    if (!this.isTransitioning) {
      // Dynamic terrain ground collision clamping during manual orbiting
      const groundY = this.elevationFn(this.camera.position.x, this.camera.position.z);
      if (this.camera.position.y < groundY + 1.6) {
        this.camera.position.y = groundY + 1.6;
      }
      this.controls.update();
    }
  }

  onResize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }
    this.controls.dispose();
  }
}
