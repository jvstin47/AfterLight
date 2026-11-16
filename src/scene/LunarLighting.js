/**
 * AFTERLIGHT — Scientifically Grounded Lunar Lighting & Celestial Environment
 * Physically calibrated Apollo 12 celestial geometry: 13.5° solar elevation,
 * authentic 1.9° crescent Earth with atmospheric limb, and stellar starfield.
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
    this.starfield = res.starfield;
  }

  update(delta) {
    if (this.earthGroup) {
      // Subtle diurnal rotation of Earth's cloud systems
      this.earthGroup.rotation.y += delta * 0.005;
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

  // 1. Direct Sun (Low-angle solar vector: elevation ~13.5°, azimuth ~81.4° East)
  // Calibrated to Apollo 12 landing day: Nov 19, 1969, 06:54 UTC
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.6);
  sunLight.position.set(450, 108, 68);
  sunLight.castShadow = true;

  // Calibrate shadow frustum to cover the full exploration perimeter
  sunLight.shadow.camera.near = 50;
  sunLight.shadow.camera.far = 950;
  sunLight.shadow.camera.left = -280;
  sunLight.shadow.camera.right = 280;
  sunLight.shadow.camera.top = 280;
  sunLight.shadow.camera.bottom = -280;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0003;

  lightingGroup.add(sunLight);

  // 2. Faint earthlight & secondary regolith bounce (Vacuum has zero skylight; deep stark shadows)
  const ambientLight = new THREE.AmbientLight(0x0e121a, 0.08);
  lightingGroup.add(ambientLight);

  // 3. Scientifically Restrained Starfield
  const starfield = createDisciplinedStarfield(sunLight.position);
  lightingGroup.add(starfield);

  // 4. Distant Sun Disc in the black sky
  const sunDir = sunLight.position.clone().normalize();
  const sunVisualGroup = createSolarDisk(sunDir);
  lightingGroup.add(sunVisualGroup);

  // 5. Earth in the Lunar Sky (Visible from Oceanus Procellarum at ~64.5° elevation, East-Southeast)
  const earthMesh = createPhotometricEarth(sunDir);
  lightingGroup.add(earthMesh);

  scene.add(lightingGroup);

  return {
    group: lightingGroup,
    sunLight,
    sunDirection: sunDir,
    earthGroup: earthMesh,
    starfield
  };
}

/**
 * Creates an astronomically restrained starfield
 * Dense but believable star distribution with natural stellar magnitude variation.
 * No oversized decorative stars, no sci-fi nebulae, no twinkling in vacuum.
 */
function createDisciplinedStarfield(sunPos) {
  const starCount = 1800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  const sunDir = sunPos.clone().normalize();
  const starRadius = 14000; // Far celestial sphere

  let idx = 0;
  for (let i = 0; i < starCount; i++) {
    // Spherical distribution predominantly above the horizon (y > 0)
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);

    const x = starRadius * Math.sin(phi) * Math.cos(theta);
    const y = Math.abs(starRadius * Math.cos(phi)) + 150.0; // Above horizon
    const z = starRadius * Math.sin(phi) * Math.sin(theta);

    const starVec = new THREE.Vector3(x, y, z).normalize();

    // Mask out stars within 16° of the blinding solar disk
    if (starVec.dot(sunDir) > 0.96) {
      continue;
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    // Stellar magnitude & spectral class variation
    const r = Math.random();
    let col = new THREE.Color(0xf0f4f8); // Common A/F class white
    let size = 1.0;

    if (r > 0.96) {
      // Prominent bright navigational stars (Sirius, Rigel, Vega)
      col = (r > 0.98) ? new THREE.Color(0xcfe2ff) : new THREE.Color(0xfff3e0);
      size = 1.6;
    } else if (r > 0.85) {
      col = new THREE.Color(0xdde5ed);
      size = 1.25;
    } else {
      // Faint background stars (majority)
      const dim = 0.45 + Math.random() * 0.35;
      col = new THREE.Color(dim * 0.9, dim * 0.95, dim);
      size = 0.9;
    }

    colors[idx * 3] = col.r;
    colors[idx * 3 + 1] = col.g;
    colors[idx * 3 + 2] = col.b;
    sizes[idx] = size;

    idx++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, idx * 3), 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, idx * 3), 3));

  // Custom round point texture for crisp stellar circles
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const radGrad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
  radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 16, 16);

  const starTexture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    map: starTexture,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    fog: false
  });

  const starPoints = new THREE.Points(geometry, material);
  starPoints.name = 'disciplined-starfield';
  return starPoints;
}

/**
 * Creates intense, physically grounded visual solar disk
 */
function createSolarDisk(sunDir) {
  const sunGroup = new THREE.Group();
  sunGroup.name = 'visual-sun-disk';

  const distance = 1600;
  // Apparent angular diameter in vacuum is ~0.53° -> radius ~7.4m at 1600m
  const sunRadius = 7.4;

  const coreGeo = new THREE.SphereGeometry(sunRadius, 24, 24);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    fog: false
  });
  const core = new THREE.Mesh(coreGeo, coreMat);

  // Restrained lens aperture diffraction halo (camera lens internal optic scatter)
  const haloGeo = new THREE.RingGeometry(sunRadius * 1.05, sunRadius * 1.85, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xfffaed,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.28,
    fog: false
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.lookAt(0, 0, 0);

  sunGroup.position.copy(sunDir).multiplyScalar(distance);
  sunGroup.lookAt(0, 0, 0);

  sunGroup.add(core);
  sunGroup.add(halo);

  return sunGroup;
}

/**
 * Creates Earth in the lunar sky with authentic geographic detail,
 * 1.9° apparent angular size, physical waning gibbous/crescent phase, and thin atmospheric limb.
 */
function createPhotometricEarth(sunDir) {
  const earthGroup = new THREE.Group();
  earthGroup.name = 'earth-in-sky';

  // Sub-Earth vector from Statio Cognitum (3.0° S, 23.4° W):
  // Earth hangs high in the East-Southeast sky at ~64.5° elevation, azimuth ~96.5°
  const earthElev = THREE.MathUtils.degToRad(64.5);
  const earthAz = THREE.MathUtils.degToRad(96.5);
  const earthDir = new THREE.Vector3(
    Math.cos(earthElev) * Math.sin(earthAz),
    Math.sin(earthElev),
    Math.cos(earthElev) * Math.cos(earthAz)
  ).normalize();

  const distance = 950;
  // Apparent angular size: 1.90° -> radius = 950 * tan(0.95°) ≈ 15.75m
  const earthRadius = 15.75;

  // High-resolution Earth texture map (1024x512)
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep oceanic blue
  ctx.fillStyle = '#0a1d37';
  ctx.fillRect(0, 0, 1024, 512);

  // Continental landmasses (Americas, Pacific basin, Australia / Asia visible at 07:00 UTC)
  ctx.fillStyle = '#1c4928'; // Deep vegetation green
  // North America
  ctx.beginPath();
  ctx.ellipse(320, 140, 95, 65, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // South America
  ctx.beginPath();
  ctx.ellipse(390, 310, 65, 110, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Eurasia / Africa edge
  ctx.beginPath();
  ctx.ellipse(780, 160, 120, 80, 0, 0, Math.PI * 2);
  ctx.fill();

  // Continental arid belts (Sahara, Mojave, Australian outback ambers)
  ctx.fillStyle = '#8c7849';
  ctx.beginPath();
  ctx.ellipse(310, 170, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(820, 200, 75, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polar ice caps
  ctx.fillStyle = '#eef3f8';
  ctx.fillRect(0, 0, 1024, 28);
  ctx.fillRect(0, 484, 1024, 28);

  // Swirling atmospheric cloud formations (dynamic weather bands)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  for (let c = 0; c < 45; c++) {
    const cx = (c * 79 + 41) % 1024;
    const cy = 40 + (c * 37) % 430;
    const rw = 35 + (c % 7) * 22;
    const rh = 12 + (c % 4) * 8;
    const rot = Math.sin(c * 1.5) * 0.4;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  // Intertropical Convergence Zone (ITCZ) equatorial cloud ribbon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  for (let w = 0; w < 16; w++) {
    const wx = w * 65 + 10;
    const wy = 245 + Math.sin(w * 0.8) * 18;
    ctx.beginPath();
    ctx.ellipse(wx, wy, 55, 14, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  const earthTexture = new THREE.CanvasTexture(canvas);
  earthTexture.colorSpace = THREE.SRGBColorSpace;

  const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);

  // MeshStandardMaterial naturally illuminated by the scene's directional sunlight
  // This physically guarantees the crescent terminator faces the Sun exactly!
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.82,
    metalness: 0.04,
    fog: false
  });

  // Custom atmospheric Rayleigh scattering rim on grazing angles
  earthMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Authentic razor-thin atmospheric Rayleigh scattering rim
      vec3 viewD = normalize(vViewPosition);
      vec3 norm = normalize(vNormal);
      float rim = 1.0 - max(0.0, dot(viewD, norm));
      // Only illuminate atmospheric limb on the sunlit crescent side
      vec3 sunDirV = normalize((viewMatrix * vec4(450.0, 108.0, 68.0, 0.0)).xyz);
      float sunFacing = max(0.0, dot(norm, sunDirV));
      float atmosphereLimb = pow(rim, 6.0) * sunFacing * 1.25;
      gl_FragColor.rgb += vec3(0.31, 0.64, 1.0) * atmosphereLimb;
      `
    );
  };

  const earth = new THREE.Mesh(earthGeo, earthMat);
  earth.position.copy(earthDir).multiplyScalar(distance);
  earth.rotation.y = THREE.MathUtils.degToRad(195); // Align Pacific/Americas towards Moon

  earthGroup.add(earth);

  return earthGroup;
}

