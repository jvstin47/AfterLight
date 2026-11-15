/**
 * AFTERLIGHT — Scientifically Grounded Lunar Lighting & Celestial Environment
 * 12.4° solar elevation matching Apollo 12 EVAs, stark vacuum shadows, and Earth in the sky.
 */

import * as THREE from 'three';

export class LunarLighting {
  constructor(scene) {
    this.scene = scene;
    const res = createLunarLighting(scene);
    this.group = res.group;
    this.sunLight = res.sunLight;
    this.sunDirection = res.sunDirection;
    this.earthGroup = res.earthGroup;
  }

  update(delta) {
    if (this.earthGroup) {
      this.earthGroup.rotation.y += delta * 0.01;
    }
  }

  dispose() {
    if (this.group && this.scene) {
      this.scene.remove(this.group);
    }
  }
}

export function createLunarLighting(scene) {
  const lightingGroup = new THREE.Group();
  lightingGroup.name = 'lunar-lighting';

  // 1. Direct Sun (Low-angle solar vector: elevation ~12.4°, azimuth ~85°)
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.4);
  sunLight.position.set(450, 105, 75); // Low eastern angle
  sunLight.castShadow = true;

  // Calibrate shadow frustum to cover the full exploration perimeter
  sunLight.shadow.camera.near = 50;
  sunLight.shadow.camera.far = 900;
  sunLight.shadow.camera.left = -280;
  sunLight.shadow.camera.right = 280;
  sunLight.shadow.camera.top = 280;
  sunLight.shadow.camera.bottom = -280;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0003;

  lightingGroup.add(sunLight);

  // 2. Faint earthlight & secondary regolith bounce (Vacuum has zero skylight; deep stark shadows)
  const ambientLight = new THREE.AmbientLight(0x0e121a, 0.11);
  lightingGroup.add(ambientLight);

  // 3. Distant Sun Disc in the black sky
  const sunDir = new THREE.Vector3(450, 105, 75).normalize();
  const sunMeshGeo = new THREE.SphereGeometry(18, 16, 16);
  const sunMeshMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    fog: false
  });
  const sunMesh = new THREE.Mesh(sunMeshGeo, sunMeshMat);
  sunMesh.position.copy(sunDir).multiplyScalar(750);
  lightingGroup.add(sunMesh);

  // 4. Earth in the Lunar Sky (Visible from Oceanus Procellarum at ~64° elevation, western sky)
  const earthMesh = createEarthDisc();
  lightingGroup.add(earthMesh);

  scene.add(lightingGroup);

  return {
    group: lightingGroup,
    sunLight,
    sunDirection: sunDir,
    earthGroup: earthMesh
  };
}

/**
 * Creates Earth visible in the lunar sky as a blue marble with atmospheric rim
 */
function createEarthDisc() {
  const earthGroup = new THREE.Group();
  earthGroup.name = 'earth-in-sky';

  // Earth position: Elevation 64° in the western sky (opposite the sun)
  const earthDir = new THREE.Vector3(-0.4, 0.88, -0.25).normalize();
  const distance = 700;

  // Procedural Earth canvas texture
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep ocean blue
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, '#1a5fb4');
  grad.addColorStop(0.7, '#0d3880');
  grad.addColorStop(1, '#051840');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Continents and white swirling clouds
  ctx.fillStyle = '#4e9a06'; // Africa / Eurasia landmasses
  ctx.beginPath();
  ctx.arc(110, 95, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#73d216';
  ctx.beginPath();
  ctx.arc(150, 140, 28, 0, Math.PI * 2);
  ctx.fill();

  // Swirling white clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    const cx = 50 + Math.random() * 160;
    const cy = 40 + Math.random() * 180;
    const cr = 10 + Math.random() * 25;
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft limb shadow (half-earth phase)
  ctx.fillStyle = 'rgba(5, 8, 15, 0.82)';
  ctx.beginPath();
  ctx.rect(0, 0, 110, 256);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);

  const earthGeo = new THREE.SphereGeometry(14, 32, 32);
  const earthMat = new THREE.MeshBasicMaterial({
    map: texture,
    fog: false
  });

  const earth = new THREE.Mesh(earthGeo, earthMat);
  earth.position.copy(earthDir).multiplyScalar(distance);
  earth.lookAt(0, 0, 0);

  // Atmospheric cyan glow halo around limb
  const haloGeo = new THREE.RingGeometry(14.2, 16.5, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x4fc3f7,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
    fog: false
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.position.copy(earth.position);
  halo.lookAt(0, 0, 0);

  earthGroup.add(earth);
  earthGroup.add(halo);

  return earthGroup;
}
