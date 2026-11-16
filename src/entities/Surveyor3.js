/**
 * AFTERLIGHT — Surveyor 3 Robotic Lunar Lander Entity
 * Loads the authentic Phase 01 3D model (OBJ/MTL, 23 meshes).
 * Positioned inside Surveyor Crater on the 11.8° inner wall at elevation -11.5m.
 * Materials informed by hardware retrieved during Apollo 12 rendezvous.
 */

import * as THREE from 'three';
import { assetManager } from '../core/AssetManager.js';

export function createSurveyor3(elevationFn, onLoaded, onError) {
  const surveyorGroup = new THREE.Group();
  surveyorGroup.name = 'surveyor-3-spacecraft';
  surveyorGroup.userData = { artifactId: 'surveyor-3' };

  // Generous invisible hit collider for effortless 3D model touch and click selection
  const hitGeo = new THREE.SphereGeometry(4.2, 16, 12);
  hitGeo.translate(0, 1.8, 0);
  const hitMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-surveyor-3';
  hitMesh.userData = { artifactId: 'surveyor-3', isHitProxy: true };
  surveyorGroup.add(hitMesh);

  // Authentic landing location inside Surveyor Crater (163m from Intrepid at Azimuth 155°)
  const posX = 72;
  const posZ = 150;
  const posY = elevationFn ? elevationFn(posX, posZ) : -11.5;

  surveyorGroup.position.set(posX, posY, posZ);

  // Authentic 11.8° incline matching the southeastern inner wall of Surveyor Crater
  // Tilt downwards towards northwest into crater floor
  surveyorGroup.rotation.z = THREE.MathUtils.degToRad(-11.8);
  surveyorGroup.rotation.y = THREE.MathUtils.degToRad(35);

  assetManager.loadOBJWithMTL(
    '/assets/3d_models/surveyor_3/surveyor_3_lander.obj',
    '/assets/3d_models/surveyor_3/surveyor_3_lander.mtl'
  )
    .then((object) => {
      object.name = 'authentic-surveyor-3-model';

          let meshCount = 0;
          object.traverse((child) => {
            if (child.isMesh) {
              meshCount++;
              child.castShadow = true;
              child.receiveShadow = true;
              child.userData.artifactId = 'surveyor-3';

              if (child.material) {
                child.material.side = THREE.DoubleSide;
                const mName = (child.material.name || '').toLowerCase();

                // Apply materials informed by retrieved Apollo 12 hardware inspection:
                if (mName.includes('whiethermal') || mName.includes('whitethermal') || mName.includes('white')) {
                  // White thermal paint discolored to tan-brown by 31 months of unshielded solar UV photolysis
                  child.material.color = new THREE.Color(0xa89e90);
                  child.material.roughness = 0.65;
                  child.material.metalness = 0.08;
                } else if (mName.includes('solar') || mName.includes('panel')) {
                  // Planar solar cell array
                  child.material.color = new THREE.Color(0x161a26);
                  child.material.roughness = 0.35;
                  child.material.metalness = 0.45;
                } else if (mName.includes('aluminum') || mName.includes('tubing')) {
                  // 7075-T6 tubular aluminum alloy spaceframe
                  child.material.color = new THREE.Color(0xa4abb5);
                  child.material.roughness = 0.34;
                  child.material.metalness = 0.88;
                } else if (mName.includes('gold') || mName.includes('foil')) {
                  // Thermal foil blankets
                  child.material.color = new THREE.Color(0xc89620);
                  child.material.roughness = 0.28;
                  child.material.metalness = 0.88;
                } else {
                  // Machined metals, vernier engine nozzles & severed TV camera bracket
                  child.material.color = new THREE.Color(0x282b30);
                  child.material.roughness = 0.52;
                  child.material.metalness = 0.78;
                }
                child.material.needsUpdate = true;
              }
            }
          });

          // Ensure footpads sit cleanly on the 11.8° crater slope
          const bbox = new THREE.Box3().setFromObject(object);
          object.position.y = -bbox.min.y;

          // Documented Apollo 12 Field Work Detail:
          // Severed TV camera mounting collar with shear cut marks left by Pete Conrad's shears
          // (The camera itself was severed on Nov 20, 1969 and returned to the Lunar Receiving Lab)
          const cutCollarGeo = new THREE.CylinderGeometry(0.045, 0.048, 0.065, 8);
          const cutCollarMat = new THREE.MeshStandardMaterial({
            color: 0x9ba2ad, // Fresh unoxidized 6061-T6 aluminum shear face
            roughness: 0.32,
            metalness: 0.94
          });
          const cutCollar = new THREE.Mesh(cutCollarGeo, cutCollarMat);
          cutCollar.name = 'surveyor-severed-camera-collar';
          cutCollar.position.set(-0.35, 1.35, 0.22);
          cutCollar.rotation.z = Math.PI / 6;
          cutCollar.castShadow = true;
          object.add(cutCollar);

          // Documented Soil Mechanics Surface Sampler scoop trench (scraped during Surveyor mission in April 1967)
          const trenchGeo = new THREE.BoxGeometry(0.12, 0.04, 0.45);
          const trenchMat = new THREE.MeshStandardMaterial({
            color: 0x14161a, // Dark disturbed subsurface lunar basalt
            roughness: 0.94,
            metalness: 0.02
          });
          const trench = new THREE.Mesh(trenchGeo, trenchMat);
          trench.name = 'surveyor-scoop-trench';
          trench.position.set(0.65, 0.02, -0.45);
          trench.rotation.y = THREE.MathUtils.degToRad(25);
          trench.receiveShadow = true;
          object.add(trench);

          surveyorGroup.add(object);

          console.log(`[Surveyor3] SUCCESS: Authentic Surveyor 3 model loaded with ${meshCount} meshes on 11.8° crater slope.`);

          if (typeof onLoaded === 'function') {
            onLoaded(object);
          }
        })
        .catch((err) => {
          console.error('[Surveyor3] CRITICAL ERROR: Failed to load authentic Surveyor 3 model:', err);
          if (typeof onError === 'function') {
            onError(err);
          }
        });

  return surveyorGroup;
}

export class Surveyor3 {
  constructor(scene, elevationFn = () => -11.5) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.group = null;
    this.isLoaded = false;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.group = createSurveyor3(
        this.elevationFn,
        (object) => {
          this.isLoaded = true;
          resolve(object);
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
