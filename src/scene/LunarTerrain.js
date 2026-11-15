/**
 * AFTERLIGHT — Scientifically Grounded Lunar Terrain
 * Topography reconstructed from Apollo 12 LROC DTM parameters and
 * surveyed radial cross-section profile of Surveyor Crater (NASA/USGS).
 */

import * as THREE from 'three';
import { createRegolithMaterial } from './RegolithMaterial.js';

// Crater definitions based on Apollo 12 geological survey & LROC DEM
const CRATERS = [
  // Surveyor Crater: Center (50, 115), Diameter 200m, Depth -21.4m, Rim +1.8m
  { name: 'Surveyor Crater', x: 50, z: 115, radius: 100, depth: 21.4, rimHeight: 1.8, isSurveyor: true },
  // Head Crater: Center (-95, 25), Diameter 140m, Depth -14.0m, Rim +1.2m (SW of ALSEP, WSW of Intrepid)
  { name: 'Head Crater', x: -95, z: 25, radius: 70, depth: 14.0, rimHeight: 1.2 },
  // Bench Crater: Center (-140, 45), Diameter 70m, Depth -7.5m, Rim +0.8m
  { name: 'Bench Crater', x: -140, z: 45, radius: 35, depth: 7.5, rimHeight: 0.8 },
  // Halo Crater: Center (-100, 130), Diameter 30m, Depth -4.2m, Rim +0.4m
  { name: 'Halo Crater', x: -100, z: 130, radius: 15, depth: 4.2, rimHeight: 0.4 },
  // Block Crater: Center (60, 85), Diameter 17m, Depth -3.2m, Rim +0.5m
  { name: 'Block Crater', x: 60, z: 85, radius: 8.5, depth: 3.2, rimHeight: 0.5 },
  // Sharp Crater: Center (-210, 95), Diameter 14m, Depth -2.5m, Rim +0.3m
  { name: 'Sharp Crater', x: -210, z: 95, radius: 10.0, depth: 2.5, rimHeight: 0.3 }
];

// Seeded micro-craters across the landing plain
const MICRO_CRATERS = [];
for (let i = 0; i < 64; i++) {
  const angle = (i * 137.5) * (Math.PI / 180);
  const dist = 30 + ((i * 23) % 350);
  const mx = dist * Math.cos(angle);
  const mz = dist * Math.sin(angle);
  // Avoid placing micro-craters right under Intrepid or Surveyor
  if (Math.hypot(mx, mz) > 14 && Math.hypot(mx - 72, mz - 150) > 12) {
    MICRO_CRATERS.push({
      x: mx,
      z: mz,
      radius: 2.2 + (i % 6) * 1.6,
      depth: 0.6 + (i % 5) * 0.45,
      rimHeight: 0.14
    });
  }
}

/**
 * Surveyor Crater radial cross-section elevation spline
 * Evaluates radial distance r (0 to 135m) according to surveyor_crater_topography_profile.json
 */
function getSurveyorCraterRadialElevation(r) {
  if (r <= 22) {
    // Crater floor flat center (-21.4m)
    const t = r / 22;
    return -21.4 + t * t * 1.8;
  } else if (r <= 41) {
    // Lower wall rising to Surveyor 3 resting point (-11.5m at r=40.5m)
    const t = (r - 22) / (41 - 22);
    // Smooth cosine ease
    const smoothT = (1 - Math.cos(t * Math.PI)) * 0.5;
    return -19.6 + smoothT * (-11.5 - (-19.6));
  } else if (r <= 75) {
    // Mid wall (slope ~11.8°)
    const t = (r - 41) / (75 - 41);
    const smoothT = (1 - Math.cos(t * Math.PI)) * 0.5;
    return -11.5 + smoothT * (-5.8 - (-11.5));
  } else if (r <= 100) {
    // Upper wall to rim crest (+1.8m)
    const t = (r - 75) / (100 - 75);
    const smoothT = (1 - Math.cos(t * Math.PI)) * 0.5;
    return -5.8 + smoothT * (1.8 - (-5.8));
  } else if (r <= 135) {
    // Outer ejecta blanket tapering to background mare
    const t = (r - 100) / 35;
    return 1.8 * Math.pow(1.0 - t, 2.0);
  }
  return 0;
}

/**
 * Calculates elevation y at any (x, z) coordinate on the landing site.
 */
export function getElevation(x, z) {
  let y = 0;

  // 1. Broad rolling mare ridge undulation (Oceanus Procellarum basalt plains)
  y += Math.sin(x * 0.0075 + 0.4) * 1.4;
  y += Math.cos(z * 0.0065 - 0.2) * 1.2;
  y += Math.sin((x + z) * 0.012) * 0.6;

  // 2. Surveyor Crater Topography (Profile from NASA/USGS Profile Datum)
  const scCenter = { x: 50, z: 115 };
  const scDist = Math.hypot(x - scCenter.x, z - scCenter.z);
  if (scDist <= 135) {
    y += getSurveyorCraterRadialElevation(scDist);
  }

  // 3. Other Crater Topography
  for (const cr of CRATERS) {
    if (cr.isSurveyor) continue;
    const d = Math.hypot(x - cr.x, z - cr.z);
    if (d < cr.radius * 1.4) {
      const nd = d / cr.radius;
      if (nd <= 1.0) {
        // Inner bowl
        const depth = cr.depth * (1.0 - Math.pow(nd, 2.2));
        y -= depth;
        // Rim crest
        const rim = cr.rimHeight * Math.pow(nd, 3.5);
        y += rim;
      } else {
        // Outer ejecta falloff
        const falloff = (1.4 - nd) / 0.4;
        y += cr.rimHeight * Math.pow(Math.max(0, falloff), 2.0);
      }
    }
  }

  // 4. Micro craters
  for (const mc of MICRO_CRATERS) {
    const d = Math.hypot(x - mc.x, z - mc.z);
    if (d < mc.radius * 1.25) {
      const nd = d / mc.radius;
      if (nd <= 1.0) {
        y -= mc.depth * (1.0 - Math.pow(nd, 2.0));
        y += mc.rimHeight * Math.pow(nd, 3.0);
      } else {
        const falloff = (1.25 - nd) / 0.25;
        y += mc.rimHeight * Math.max(0, falloff);
      }
    }
  }

  return y;
}

/**
 * Creates natural, angular fractured rock geometry (eliminates platonic egg-shapes)
 */
function createAngularRockGeometry(baseRadius = 1.0) {
  // Start from dodecahedron with 0 subdivisions for sharp cleavage facets
  const geo = new THREE.DodecahedronGeometry(baseRadius, 0);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    let px = pos.getX(i);
    let py = pos.getY(i);
    let pz = pos.getZ(i);

    // Asymmetrical flattening and cleavage angles
    py *= 0.55 + Math.sin(px * 2.5) * 0.15;
    px *= 1.0 + (Math.sin(pz * 3.0) * 0.25);
    pz *= 1.0 + (Math.cos(px * 2.0) * 0.2);

    pos.setXYZ(i, px, py, pz);
  }

  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates natural fractured rock clusters around Block Crater and Head Crater
 */
function createNaturalBoulders() {
  const rockGeo = createAngularRockGeometry(1.0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x42464e,
    roughness: 0.96,
    metalness: 0.03,
    flatShading: true // Hard angular facet lighting
  });

  const boulderCount = 75;
  const instancedBoulders = new THREE.InstancedMesh(rockGeo, rockMat, boulderCount);
  instancedBoulders.castShadow = true;
  instancedBoulders.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let bIdx = 0;

  // Natural cluster locations based on Apollo 12 documented sample sites
  const boulderClusters = [
    { cx: 60, cz: 85, radius: 9, count: 35 },   // Block Crater (famous for angular boulder ejecta)
    { cx: -95, cz: 25, radius: 72, count: 25 }, // Head Crater outer rim
    { cx: 50, cz: 115, radius: 98, count: 15 }   // Surveyor Crater north rim
  ];

  for (const cluster of boulderClusters) {
    for (let i = 0; i < cluster.count; i++) {
      if (bIdx >= boulderCount) break;
      const angle = Math.random() * Math.PI * 2;
      const r = cluster.radius + (Math.random() - 0.5) * 8;
      const bx = cluster.cx + r * Math.cos(angle);
      const bz = cluster.cz + r * Math.sin(angle);
      const by = getElevation(bx, bz);

      const scale = 0.3 + Math.random() * 1.35;
      // Sink slightly into regolith so they don't float
      dummy.position.set(bx, by + scale * 0.25, bz);
      dummy.scale.set(scale, scale * (0.6 + Math.random() * 0.5), scale * (0.8 + Math.random() * 0.4));
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();

      instancedBoulders.setMatrixAt(bIdx++, dummy.matrix);
    }
  }

  instancedBoulders.instanceMatrix.needsUpdate = true;
  return instancedBoulders;
}

export function createLunarTerrain() {
  const terrainGroup = new THREE.Group();
  terrainGroup.name = 'lunar-terrain';

  // 1. High-resolution terrain mesh (850m x 850m, 240x240 grid segments)
  const width = 850;
  const depth = 850;
  const segments = 240;

  const geometry = new THREE.PlaneGeometry(width, depth, segments, segments);
  geometry.rotateX(-Math.PI / 2); // Orient horizontal (XZ plane)

  const posAttr = geometry.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i);
    const vy = getElevation(vx, vz);
    posAttr.setY(i, vy);
  }

  geometry.computeVertexNormals();

  const regolithMaterial = createRegolithMaterial();
  const terrainMesh = new THREE.Mesh(geometry, regolithMaterial);
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = false;
  terrainGroup.add(terrainMesh);

  // 2. Natural angular fractured rock clusters (replaces platonic dodecahedrons)
  const naturalBoulders = createNaturalBoulders();
  terrainGroup.add(naturalBoulders);

  // NOTE: The 4-sided 3D TubeGeometry footpath has been removed.
  // Compacted astronaut boot tracks are now rendered directly as ground-level albedo modulation.

  return {
    group: terrainGroup,
    getElevation
  };
}

export class LunarTerrain {
  constructor(scene, options = {}) {
    this.scene = scene;
    const res = createLunarTerrain();
    this.group = res.group;
    this.getElevation = res.getElevation;
    if (scene) {
      scene.add(this.group);
    }
  }

  dispose() {
    if (this.group && this.scene) {
      this.scene.remove(this.group);
    }
  }
}
