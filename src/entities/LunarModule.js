/**
 * AFTERLIGHT — Apollo 12 Lunar Module (LM-6 Intrepid) Entity
 * Loads the official NASA 3D model (GLB with DRACO mesh compression).
 * Enhances with wrinkled Kapton MLI normal maps, 1.68m surface contact wands on 3 footpads,
 * and the forward strut commemorative stainless steel plaque.
 * Preserves authentic textures, materials, and 1:1 scale (9.45m diagonal span).
 */

import * as THREE from 'three';
import { assetManager } from '../core/AssetManager.js';

/**
 * Generates a high-frequency procedural normal map representing crinkled
 * Multi-Layer Insulation (MLI) Kapton and Mylar blankets.
 */
function createWrinkledFoilNormalMap() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Generate multi-frequency crumpled facet heights
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let h = 0;
      h += Math.sin(x * 0.18 + Math.cos(y * 0.22)) * 0.45;
      h += Math.cos(x * 0.45 - y * 0.35) * 0.28;
      h += Math.sin((x + y) * 0.85) * 0.18;
      const fold = Math.abs(Math.sin(x * 0.12 + y * 0.08) + Math.cos(x * 0.07 - y * 0.15));
      h -= fold * 0.35;
      height[y * size + x] = h;
    }
  }

  // Compute normals using Sobel gradient
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const xL = (x - 1 + size) % size;
      const xR = (x + 1) % size;
      const yU = (y - 1 + size) % size;
      const yD = (y + 1) % size;

      const dX = (height[y * size + xR] - height[y * size + xL]) * 2.8;
      const dY = (height[yD * size + x] - height[yU * size + x]) * 2.8;

      const len = Math.hypot(dX, dY, 1.0);
      const nx = -dX / len;
      const ny = -dY / len;
      const nz = 1.0 / len;

      const idx = (y * size + x) * 4;
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

let cachedFoilNormal = null;

export function createLunarModule(elevationFn, onLoaded, onError) {
  const lmGroup = new THREE.Group();
  lmGroup.name = 'lunar-module-intrepid';
  lmGroup.userData = { artifactId: 'lm-intrepid' };

  // Generous invisible hit collider for effortless 3D model touch and click selection
  const hitGeo = new THREE.CylinderGeometry(5.8, 6.2, 5.5, 16);
  hitGeo.translate(0, 2.75, 0);
  const hitMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false
  });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-lm-intrepid';
  hitMesh.userData = { artifactId: 'lm-intrepid', isHitProxy: true };
  lmGroup.add(hitMesh);

  const posX = 0;
  const posZ = 0;
  const posY = elevationFn ? elevationFn(posX, posZ) : 0;

  lmGroup.position.set(posX, posY, posZ);

  console.log('[LunarModule] Requesting cached official NASA LM-6 GLB model...');

  if (!cachedFoilNormal) {
    cachedFoilNormal = createWrinkledFoilNormalMap();
  }

  assetManager.loadGLTF('/assets/3d_models/lunar_module/apollo_lunar_module.glb?v=0.2.1')
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

      // 3. Preserve authentic embedded textures & apply crinkled MLI foil normals
      let meshCount = 0;
      model.traverse((child) => {
        if (child.isMesh) {
          meshCount++;
          child.castShadow = true;
          child.receiveShadow = true;
          child.userData.artifactId = 'lm-intrepid';

          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.shadowSide = THREE.DoubleSide;
            if (child.material.isMeshStandardMaterial) {
              child.material.envMapIntensity = 1.0;

              // Apply wrinkled foil normal map to metallic gold and amber insulation blankets
              const mName = (child.material.name || child.name || '').toLowerCase();
              if (mName.includes('foil') || mName.includes('gold') || mName.includes('mylar') || mName.includes('kapton') || mName.includes('blanket')) {
                child.material.normalMap = cachedFoilNormal;
                child.material.normalScale = new THREE.Vector2(0.85, 0.85);
                child.material.roughness = Math.min(child.material.roughness, 0.35);
              }
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

      // 5. Add Documented Apollo 12 Artifact Fidelity Details:
      // A. Three 1.68m (5.5 ft) lunar surface sensing contact probe wands
      // Installed on Port (+X), Starboard (-X), and Aft (-Z) gear footpads.
      // (Forward +Z gear had no probe to avoid tripping egressing astronauts).
      // At touchdown, these wands bent backward upon contacting the regolith.
      const probeMat = new THREE.MeshStandardMaterial({
        color: 0x24272c,
        roughness: 0.8,
        metalness: 0.6
      });

      // Probe positions under the 3 non-forward footpads (relative to lmGroup)
      // Radius ~ 3.34m along axes rotated by -45°
      const probeAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25]; // Port, Aft, Starboard
      probeAngles.forEach((angle, idx) => {
        const padX = Math.cos(angle) * 4.72;
        const padZ = Math.sin(angle) * 4.72;

        const probeCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(padX, 0.12, padZ),
          new THREE.Vector3(padX + Math.cos(angle) * 0.6, 0.02, padZ + Math.sin(angle) * 0.6),
          new THREE.Vector3(padX + Math.cos(angle) * 1.65, 0.01, padZ + Math.sin(angle) * 1.65)
        );
        const probeGeo = new THREE.TubeGeometry(probeCurve, 12, 0.012, 6, false);
        const probeMesh = new THREE.Mesh(probeGeo, probeMat);
        probeMesh.name = `lm6-contact-wand-${idx + 1}`;
        probeMesh.castShadow = true;
        probeMesh.receiveShadow = true;
        lmGroup.add(probeMesh);
      });

      // B. Commemorative Stainless Steel Plaque on Forward Landing Strut
      // Between ladder rungs on the forward leg (-45° azimuth, ~2.8m from center, 0.8m altitude)
      const plaqueGroup = new THREE.Group();
      plaqueGroup.name = 'lm6-commemorative-plaque';
      const fwdAngle = -Math.PI * 0.25;
      const plaqueX = Math.cos(fwdAngle) * 2.85;
      const plaqueZ = Math.sin(fwdAngle) * 2.85;
      plaqueGroup.position.set(plaqueX, 0.85, plaqueZ);
      plaqueGroup.rotation.y = fwdAngle - Math.PI / 2;

      // Curved stainless steel backing sheet (0.28m x 0.22m)
      const plaqueGeo = new THREE.BoxGeometry(0.28, 0.22, 0.012);
      const plaqueMat = new THREE.MeshStandardMaterial({
        color: 0xd8dbe0,
        roughness: 0.28,
        metalness: 0.92
      });
      const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaqueMesh.castShadow = true;
      plaqueGroup.add(plaqueMesh);
      lmGroup.add(plaqueGroup);

      console.log(`[LunarModule] SUCCESS: NASA LM-6 GLB loaded (${meshCount} meshes) with MLI foil normals, 3 bent contact wands & plaque.`);

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
