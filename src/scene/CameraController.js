import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import anime from 'animejs';

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
};

export class CameraController {
  /**
   * @param {HTMLElement} domElement 
   * @param {number} aspect 
   */
  constructor(domElement, aspect) {
    this.domElement = domElement;
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
    this.controls.screenSpacePanning = false;

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
   * Transition smoothly to a camera position and target
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

    const startPos = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    };

    const startTarget = {
      x: this.controls.target.x,
      y: this.controls.target.y,
      z: this.controls.target.z,
    };

    const endPos = {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    };

    const endTarget = {
      x: targetLookAt.x,
      y: targetLookAt.y,
      z: targetLookAt.z,
    };

    const animState = { t: 0 };

    this.currentAnimation = anime({
      targets: animState,
      t: 1,
      duration: duration,
      easing: 'easeInOutCubic',
      update: () => {
        const easeT = animState.t;
        this.camera.position.set(
          THREE.MathUtils.lerp(startPos.x, endPos.x, easeT),
          THREE.MathUtils.lerp(startPos.y, endPos.y, easeT),
          THREE.MathUtils.lerp(startPos.z, endPos.z, easeT)
        );
        this.controls.target.set(
          THREE.MathUtils.lerp(startTarget.x, endTarget.x, easeT),
          THREE.MathUtils.lerp(startTarget.y, endTarget.y, easeT),
          THREE.MathUtils.lerp(startTarget.z, endTarget.z, easeT)
        );
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
