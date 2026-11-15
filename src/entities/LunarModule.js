/**
 * AFTERLIGHT — Apollo 12 Lunar Module (LM-6 Intrepid) Entity
 * Loads the official NASA 3D model (GLB with DRACO mesh compression).
 * Preserves authentic textures, materials, and 1:1 scale (9.45m diagonal span).
 */

import * as THREE from 'three';
import { assetManager } from '../core/AssetManager.js';

export function createLunarModule(elevationFn, onLoaded, onError) {
  const lmGroup = new THREE.Group();
  lmGroup.name = 'lunar-module-intrepid';

  const posX = 0;
  const posZ = 0;
  const posY = elevationFn ? elevationFn(posX, posZ) : 0;

  lmGroup.position.set(posX, posY, posZ);

  console.log('[LunarModule] Requesting cached official NASA LM-6 GLB model...');

  assetManager.loadGLTF('/assets/3d_models/lunar_module/apollo_lunar_module.glb')
    .then((model) => {
      model.name = 'nasa-lm-6-model';

      // 1. Calculate raw model dimensions
      const initialBox = new THREE.Box3().setFromObject(model);
      const initialSize = new THREE.Vector3();
      initialBox.getSize(initialSize);
      console.log('[LunarModule] Raw GLTF model bounding dimensions:', {
        x: initialSize.x.toFixed(2),
        y: initialSize.y.toFixed(2),
        z: initialSize.z.toFixed(2)
      });

      // 2. Scale to authentic Apollo 12 dimensions:
      // Real LM landing gear diagonal span is 9.45 meters (31.0 ft).
      // Raw model span is ~9.09m diagonal. Scale factor ~1.04 gives exact 9.45m span.
      const targetDiagonal = 9.45;
      const currentDiagonal = Math.hypot(initialSize.x, initialSize.z);
      const scale = currentDiagonal > 0 ? targetDiagonal / currentDiagonal : 1.0;
      model.scale.set(scale, scale, scale);

      // 3. Preserve authentic embedded textures & materials
      let meshCount = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          meshCount++;
          child.castShadow = true;
          child.receiveShadow = true;

          // Ensure double-sided rendering for thin foil sheets and proper depth testing
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.shadowSide = THREE.DoubleSide;
            // Calibrate roughness and metalness slightly for PBR environment lighting
            if (child.material.isMeshStandardMaterial) {
              child.material.envMapIntensity = 1.0;
              child.material.needsUpdate = true;
            }
          }
        }
      });

      // 4. Align bottom of footpads firmly to ground level (y = 0 relative to group)
      const scaledBox = new THREE.Box3().setFromObject(model);
      model.position.y = -scaledBox.min.y;

      // Rotate model so the forward egress ladder faces Quad I (Apollo 12 landing orientation)
      model.rotation.y = THREE.MathUtils.degToRad(-45);

      lmGroup.add(model);

      console.log(`[LunarModule] SUCCESS: NASA LM-6 GLB model loaded with ${meshCount} meshes and authentic textures preserved.`);

      if (typeof onLoaded === 'function') {
        onLoaded(model);
      }
    })
    .catch((err) => {
      console.error('[LunarModule] CRITICAL ERROR: Failed to load official NASA GLB model:', err);
      if (typeof onError === 'function') {
        onError(err);
      }
    });

  return lmGroup;
}

export class LunarModule {
  constructor(scene, elevationFn = () => 0) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.group = null;
    this.isLoaded = false;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.group = createLunarModule(
        this.elevationFn,
        (model) => {
          this.isLoaded = true;
          resolve(model);
        },
        (err) => {
          reject(err);
        }
      );

      if (this.scene && this.group) {
        this.scene.add(this.group);
      }
    });
  }

  dispose() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
  }
}
