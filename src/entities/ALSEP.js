/**
 * AFTERLIGHT — Apollo Lunar Surface Experiments Package (ALSEP Array A)
 * Loads authentic Phase 01 3D OBJ models:
 * - ALSEP Central Station (Bendix Aerospace)
 * - SNAP-27 Radioisotope Thermoelectric Generator (GE Space Division / Pu-238)
 * - Passive Seismic Experiment with 10-sided Mylar skirt (Columbia / Lamont-Doherty)
 * Grounded in Apollo 12 operational deployment documentation.
 */

import * as THREE from 'three';
import { assetManager } from '../core/AssetManager.js';

export function createALSEP(elevationFn, onLoaded, onError) {
  const alsepGroup = new THREE.Group();
  alsepGroup.name = 'alsep-array-a';

  // Authentic deployment location: 130m northwest of Intrepid at Azimuth 305°
  const originX = -106;
  const originZ = -75;
  const originY = elevationFn ? elevationFn(originX, originZ) : 0;

  alsepGroup.position.set(originX, originY, originZ);

  // Materials for ribbon cabling and peripheral boom sensors
  const whitePaintMat = new THREE.MeshStandardMaterial({
    color: 0xe8e9ed,
    roughness: 0.55,
    metalness: 0.1
  });
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x2e3036, // Flat dark Kapton/Teflon ribbon cable
    roughness: 0.85,
    metalness: 0.05
  });

  // Load the 3 primary authentic OBJ models in parallel using AssetManager cache
  Promise.all([
    assetManager.loadOBJWithMTL(
      '/assets/3d_models/alsep_instruments/alsep_central_station.obj',
      '/assets/3d_models/alsep_instruments/alsep_central_station.mtl'
    ),
    assetManager.loadOBJWithMTL(
      '/assets/3d_models/alsep_instruments/snap27_rtg.obj',
      '/assets/3d_models/alsep_instruments/snap27_rtg.mtl'
    ),
    assetManager.loadOBJWithMTL(
      '/assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj',
      '/assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.mtl'
    )
  ])
    .then(([centralStation, snap27Rtg, pse]) => {
      // 1. Central Station (positioned at ALSEP local origin)
      centralStation.name = 'authentic-alsep-central-station';
      centralStation.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            // Upgrade to physically defensible PBR values
            const name = (child.material.name || '').toLowerCase();
            if (name.includes('mylar') || name.includes('antenna')) {
              child.material.roughness = 0.22;
              child.material.metalness = 0.85;
            } else if (name.includes('brass') || name.includes('compass')) {
              child.material.color = new THREE.Color(0xc89832);
              child.material.roughness = 0.35;
              child.material.metalness = 0.8;
            } else {
              child.material.roughness = 0.55;
              child.material.metalness = 0.12;
            }
            child.material.needsUpdate = true;
          }
        }
      });
      // S-Band helical antenna pointed toward Earth (~64° elevation in western sky)
      centralStation.rotation.y = THREE.MathUtils.degToRad(-25);
      alsepGroup.add(centralStation);

      // 2. SNAP-27 RTG (3.0 meters away at azimuth ~150° relative to Central Station)
      snap27Rtg.name = 'authentic-snap27-rtg';
      snap27Rtg.position.set(2.5, 0, 1.6);
      snap27Rtg.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            // High-emissivity dark thermal radiative coating over beryllium casing
            child.material.color = new THREE.Color(0x35383e);
            child.material.roughness = 0.65;
            child.material.metalness = 0.55;
            child.material.needsUpdate = true;
          }
        }
      });
      alsepGroup.add(snap27Rtg);

      // Flat power ribbon cable from SNAP-27 to Central Station
      const rtgCableGeo = new THREE.BoxGeometry(0.045, 0.012, 2.9);
      const rtgCable = new THREE.Mesh(rtgCableGeo, cableMat);
      rtgCable.position.set(1.25, 0.008, 0.8);
      rtgCable.rotation.y = Math.atan2(1.6, 2.5) - Math.PI / 2;
      rtgCable.receiveShadow = true;
      alsepGroup.add(rtgCable);

      // 3. Passive Seismic Experiment (2.7 meters east of Central Station)
      pse.name = 'authentic-pse-instrument';
      pse.position.set(0, 0, 2.7);
      pse.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            const name = (child.material.name || '').toLowerCase();
            if (name.includes('mylar') || name.includes('skirt')) {
              // Specular aluminized Mylar 10-sided skirt
              child.material.color = new THREE.Color(0xf0f2f5);
              child.material.roughness = 0.12;
              child.material.metalness = 0.92;
            } else {
              // Gold Kapton thermal core
              child.material.color = new THREE.Color(0xd4a017);
              child.material.roughness = 0.25;
              child.material.metalness = 0.9;
            }
            child.material.needsUpdate = true;
          }
        }
      });
      alsepGroup.add(pse);

      // Data ribbon cable from PSE to Central Station
      const pseCableGeo = new THREE.BoxGeometry(0.04, 0.012, 2.65);
      const pseCable = new THREE.Mesh(pseCableGeo, cableMat);
      pseCable.position.set(0, 0.008, 1.35);
      pseCable.receiveShadow = true;
      alsepGroup.add(pseCable);

      // 4. Lunar Surface Magnetometer (LSM) — 15.0 meters away
      const lsmGroup = new THREE.Group();
      lsmGroup.name = 'lsm-magnetometer';
      lsmGroup.position.set(10.5, 0, -10.5);
      const lsmMastGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8);
      const lsmMast = new THREE.Mesh(lsmMastGeo, whitePaintMat);
      lsmMast.position.y = 0.42;
      lsmMast.castShadow = true;
      lsmGroup.add(lsmMast);

      // 3 orthogonal fluxgate boom arms (1.0m each)
      for (let i = 0; i < 3; i++) {
        const bAngle = (i * Math.PI * 2) / 3;
        const boomGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.95, 6);
        const boom = new THREE.Mesh(boomGeo, whitePaintMat);
        boom.position.set(0.42 * Math.cos(bAngle), 0.72, 0.42 * Math.sin(bAngle));
        boom.rotation.z = Math.PI / 3.2;
        boom.rotation.y = bAngle;
        boom.castShadow = true;
        lsmGroup.add(boom);
      }
      alsepGroup.add(lsmGroup);

      // 5. Solar Wind Spectrometer (SWS) — 4.0 meters away
      const swsGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.32, 7);
      const sws = new THREE.Mesh(swsGeo, whitePaintMat);
      sws.name = 'sws-spectrometer';
      sws.position.set(3.5, 0.16, -1.8);
      sws.castShadow = true;
      sws.receiveShadow = true;
      alsepGroup.add(sws);

      console.log('[ALSEP] SUCCESS: Authentic Central Station, SNAP-27 RTG, and PSE models loaded and positioned.');

      if (typeof onLoaded === 'function') {
        onLoaded(alsepGroup);
      }
    })
    .catch((err) => {
      console.error('[ALSEP] CRITICAL ERROR: Failed to load authentic ALSEP instrument models:', err);
      if (typeof onError === 'function') {
        onError(err);
      }
    });

  return alsepGroup;
}

export class ALSEP {
  constructor(scene, elevationFn = () => 0.5) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.group = null;
    this.isLoaded = false;
  }

  init() {
    return new Promise((resolve, reject) => {
      this.group = createALSEP(
        this.elevationFn,
        (group) => {
          this.isLoaded = true;
          resolve(group);
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
