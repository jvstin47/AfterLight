/**
 * AFTERLIGHT — Scientifically Grounded Lunar Lighting & Celestial Environment
 * Physically calibrated Apollo 12 celestial geometry: 13.5° solar elevation,
 * authentic 1.9° crescent Earth with atmospheric limb, camera-oriented sun with optical glare,
 * and disciplined stellar starfield.
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
    this.sunVisualGroup = res.sunVisualGroup;
    this.starfield = res.starfield;
  }

  update(delta, camera) {
    if (this.earthGroup) {
      // Subtle diurnal rotation of Earth's cloud systems (approx 1 rev / 24h scaled for perception)
      this.earthGroup.rotation.y += delta * 0.003;
    }
    if (this.sunVisualGroup && camera) {
      // Ensure solar corona and diffraction spikes billboard towards the camera
      this.sunVisualGroup.quaternion.copy(camera.quaternion);
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

  // 1. Direct Sun (Low-angle solar vector: elevation ~13.5°, azimuth ~96.5° East-Southeast)
  // Calibrated to Apollo 12 landing day: Nov 19, 1969, 06:54 UTC
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.8);
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
  sunLight.shadow.bias = -0.0002;
  sunLight.shadow.normalBias = 0.03;

  lightingGroup.add(sunLight);

  // 2. Faint earthlight & secondary regolith bounce (Vacuum has zero skylight; deep stark shadows)
  const ambientLight = new THREE.AmbientLight(0x0a0e14, 0.06);
  lightingGroup.add(ambientLight);

  // 3. Scientifically Restrained Starfield
  const starfield = createDisciplinedStarfield(sunLight.position);
  lightingGroup.add(starfield);

  // 4. Distant Sun with Optical Glare & Hasselblad Diffraction Spikes
  const sunDir = sunLight.position.clone().normalize();
  const sunVisualGroup = createOptimizedSolarSystem(sunDir);
  lightingGroup.add(sunVisualGroup);

  // 5. Earth in the Lunar Sky (Visible from Oceanus Procellarum at ~64.5° elevation, East-Southeast)
  const earthMesh = createOptimizedPhotometricEarth(sunDir);
  lightingGroup.add(earthMesh);

  scene.add(lightingGroup);

  return {
    group: lightingGroup,
    sunLight,
    sunDirection: sunDir,
    earthGroup: earthMesh,
    sunVisualGroup,
    starfield
  };
}

/**
 * Creates an astronomically restrained starfield
 * Dense but believable star distribution with natural stellar magnitude variation.
 * Zero atmospheric twinkle in vacuum.
 */
function createDisciplinedStarfield(sunPos) {
  const starCount = 1800;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  const sunDir = sunPos.clone().normalize();
  const starRadius = 14000;

  let idx = 0;
  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);

    const x = starRadius * Math.sin(phi) * Math.cos(theta);
    const y = Math.abs(starRadius * Math.cos(phi)) + 120.0;
    const z = starRadius * Math.sin(phi) * Math.sin(theta);

    const starVec = new THREE.Vector3(x, y, z).normalize();

    // Mask out stars within 16° of the blinding solar disk
    if (starVec.dot(sunDir) > 0.96) {
      continue;
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const r = Math.random();
    let col = new THREE.Color(0xf2f5f9);

    if (r > 0.96) {
      col = (r > 0.98) ? new THREE.Color(0xd6e5ff) : new THREE.Color(0xffebd2);
    } else if (r > 0.85) {
      col = new THREE.Color(0xe2e9f0);
    } else {
      const dim = 0.40 + Math.random() * 0.35;
      col = new THREE.Color(dim * 0.92, dim * 0.95, dim);
    }

    colors[idx * 3] = col.r;
    colors[idx * 3 + 1] = col.g;
    colors[idx * 3 + 2] = col.b;

    idx++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, idx * 3), 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, idx * 3), 3));

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const radGrad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.85)');
  radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 16, 16);

  const starTexture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 2.4,
    vertexColors: true,
    map: starTexture,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    fog: false
  });

  const starPoints = new THREE.Points(geometry, material);
  starPoints.name = 'disciplined-starfield';
  return starPoints;
}

/**
 * Creates high-performance, camera-billboarded Sun with physical core,
 * soft vacuum corona, and Hasselblad optical diffraction spikes.
 */
function createOptimizedSolarSystem(sunDir) {
  const sunGroup = new THREE.Group();
  sunGroup.name = 'visual-sun-system';

  const distance = 1600;
  // Apparent angular diameter in vacuum is ~0.533° -> radius ~7.4m at 1600m
  const sunRadius = 7.4;

  sunGroup.position.copy(sunDir).multiplyScalar(distance);

  // 1. Unclipped pure white solar disk core
  const coreGeo = new THREE.CircleGeometry(sunRadius, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    fog: false,
    depthWrite: false
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.name = 'sun-core';
  sunGroup.add(coreMesh);

  // 2. High-performance billboarded optical glare & diffraction corona
  const coronaCanvas = document.createElement('canvas');
  coronaCanvas.width = 256;
  coronaCanvas.height = 256;
  const cctx = coronaCanvas.getContext('2d');

  // Radial soft gradient
  const grad = cctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.12, 'rgba(255, 252, 240, 0.65)');
  grad.addColorStop(0.35, 'rgba(255, 245, 215, 0.20)');
  grad.addColorStop(0.70, 'rgba(255, 240, 200, 0.05)');
  grad.addColorStop(1, 'rgba(255, 240, 200, 0)');
  cctx.fillStyle = grad;
  cctx.fillRect(0, 0, 256, 256);

  // Subtle 4-point Hasselblad lens aperture diffraction spikes
  cctx.strokeStyle = 'rgba(255, 250, 235, 0.35)';
  cctx.lineWidth = 1.5;
  cctx.beginPath();
  cctx.moveTo(128, 10);
  cctx.lineTo(128, 246);
  cctx.moveTo(10, 128);
  cctx.lineTo(246, 128);
  cctx.stroke();

  // Diagonal faint secondary flare rays
  cctx.strokeStyle = 'rgba(255, 245, 225, 0.12)';
  cctx.lineWidth = 1.0;
  cctx.beginPath();
  cctx.moveTo(35, 35);
  cctx.lineTo(221, 221);
  cctx.moveTo(221, 35);
  cctx.lineTo(35, 221);
  cctx.stroke();

  const coronaTexture = new THREE.CanvasTexture(coronaCanvas);

  const coronaGeo = new THREE.PlaneGeometry(sunRadius * 8.5, sunRadius * 8.5);
  const coronaMat = new THREE.MeshBasicMaterial({
    map: coronaTexture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  coronaMesh.name = 'sun-corona';
  sunGroup.add(coronaMesh);

  return sunGroup;
}

/**
 * Creates Earth in the lunar sky with high-resolution continental landmasses,
 * specular ocean mask, 1.90° apparent angular size, and physically correct
 * grazing atmospheric Rayleigh scattering rim.
 */
function createOptimizedPhotometricEarth(sunDir) {
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

  // High-Resolution Procedural Earth Map (2048x1024)
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // 1. Deep Abyssal Ocean & Continental Shelf Gradients
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#041026');
  oceanGrad.addColorStop(0.2, '#061738');
  oceanGrad.addColorStop(0.5, '#081f4a');
  oceanGrad.addColorStop(0.8, '#061738');
  oceanGrad.addColorStop(1, '#041026');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Continental Shelf Shallow Turquoise fringes
  ctx.fillStyle = 'rgba(12, 65, 102, 0.45)';
  // Americas coastal fringe
  ctx.beginPath();
  ctx.ellipse(650, 320, 240, 160, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(780, 640, 170, 240, 0.25, 0, Math.PI * 2);
  ctx.fill();
  // Eurasia/Africa coastal fringe
  ctx.beginPath();
  ctx.ellipse(1560, 340, 260, 180, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(1480, 600, 180, 220, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Continental Landmasses (Detailed polygons & geographic masses)
  // Deep temperate vegetation green
  ctx.fillStyle = '#1e4827';

  // North America (Alaska, Canada, CONUS, Central America)
  ctx.beginPath();
  ctx.moveTo(380, 160);
  ctx.bezierCurveTo(450, 140, 560, 120, 680, 140); // Arctic north
  ctx.bezierCurveTo(760, 170, 800, 230, 780, 310); // East coast / Atlantic
  ctx.bezierCurveTo(740, 340, 720, 420, 680, 460); // Gulf / Florida / Caribbean
  ctx.bezierCurveTo(650, 520, 620, 560, 600, 570); // Central America
  ctx.bezierCurveTo(570, 530, 540, 460, 520, 400); // Mexico west coast
  ctx.bezierCurveTo(480, 340, 420, 280, 380, 240); // Pacific coast / Alaska
  ctx.closePath();
  ctx.fill();

  // South America
  ctx.beginPath();
  ctx.moveTo(640, 560);
  ctx.bezierCurveTo(700, 570, 820, 620, 860, 700); // Brazil bulge
  ctx.bezierCurveTo(860, 770, 800, 850, 750, 920); // Argentina / Patagonia
  ctx.bezierCurveTo(710, 940, 690, 880, 700, 800); // Chile coast
  ctx.bezierCurveTo(680, 720, 640, 640, 630, 590); // Peru / Colombia
  ctx.closePath();
  ctx.fill();

  // Eurasia (Europe + Asia)
  ctx.beginPath();
  ctx.moveTo(1180, 240);
  ctx.bezierCurveTo(1260, 170, 1420, 140, 1620, 150); // Scandinavia / Siberia
  ctx.bezierCurveTo(1820, 170, 1940, 230, 1960, 320); // Kamchatka / East Asia
  ctx.bezierCurveTo(1920, 400, 1850, 460, 1780, 520); // China / Indochina
  ctx.bezierCurveTo(1700, 560, 1600, 540, 1540, 480); // India / Himalayas
  ctx.bezierCurveTo(1450, 470, 1360, 440, 1320, 400); // Middle East
  ctx.bezierCurveTo(1260, 380, 1200, 320, 1170, 270); // Mediterranean / Europe
  ctx.closePath();
  ctx.fill();

  // Africa
  ctx.beginPath();
  ctx.moveTo(1220, 370);
  ctx.bezierCurveTo(1340, 360, 1420, 410, 1460, 480); // North / Horn of Africa
  ctx.bezierCurveTo(1480, 580, 1440, 720, 1380, 820); // East Africa / South Africa
  ctx.bezierCurveTo(1320, 840, 1260, 780, 1260, 680); // West coast
  ctx.bezierCurveTo(1220, 620, 1180, 520, 1200, 420); // Gulf of Guinea / NW Africa
  ctx.closePath();
  ctx.fill();

  // Australia
  ctx.beginPath();
  ctx.ellipse(1820, 740, 120, 85, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // 3. Arid Belts & Deserts (Sahara, Arabian, Gobi, Mojave, Outback)
  ctx.fillStyle = '#9b7f4e';
  // Sahara & Arabian Peninsula
  ctx.beginPath();
  ctx.ellipse(1330, 420, 150, 55, -0.05, 0, Math.PI * 2);
  ctx.fill();
  // Australian Outback (red-ochre)
  ctx.fillStyle = '#965530';
  ctx.beginPath();
  ctx.ellipse(1820, 740, 85, 55, 0.15, 0, Math.PI * 2);
  ctx.fill();
  // American Southwest / Great Basin
  ctx.fillStyle = '#8e794f';
  ctx.beginPath();
  ctx.ellipse(580, 360, 55, 35, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // 4. Polar Ice Caps (Perennial Glaciers)
  ctx.fillStyle = '#f2f6fa';
  // Arctic & Greenland ice
  ctx.beginPath();
  ctx.ellipse(880, 95, 75, 45, 0.1, 0, Math.PI * 2); // Greenland
  ctx.fill();
  ctx.fillRect(0, 0, 2048, 55); // Arctic pack
  // Antarctica ice sheet
  ctx.fillRect(0, 960, 2048, 64);

  // 5. Swirling Atmospheric Cloud Formations
  // Dynamically layered cloud systems (storm fronts, trade wind spirals)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.76)';
  for (let c = 0; c < 60; c++) {
    const cx = (c * 157 + 83) % 2048;
    const cy = 80 + (c * 73) % 860;
    const rw = 55 + (c % 9) * 35;
    const rh = 18 + (c % 5) * 12;
    const rot = Math.sin(c * 1.3) * 0.45;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rw, rh, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  // Intertropical Convergence Zone (ITCZ) equatorial cloud ribbon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
  for (let w = 0; w < 28; w++) {
    const wx = w * 76 + 15;
    const wy = 490 + Math.sin(w * 0.75) * 28;
    ctx.beginPath();
    ctx.ellipse(wx, wy, 80, 18, 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  const earthTexture = new THREE.CanvasTexture(canvas);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.generateMipmaps = true;
  earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
  earthTexture.magFilter = THREE.LinearFilter;

  // Optimized Sphere Geometry
  const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 36);

  // Physically calibrated PBR material illuminated by the scene directional sunlight
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTexture,
    roughness: 0.68,
    metalness: 0.08,
    fog: false
  });

  // Physically Accurate Atmospheric Rayleigh Limb Scattering Injection
  earthMat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Physically corrected razor-thin atmospheric Rayleigh scattering rim
      // In Three.js view-space, camera is at origin; ray toward camera is -normalize(vViewPosition)
      vec3 viewD = -normalize(vViewPosition);
      vec3 norm = normalize(vNormal);
      float rim = 1.0 - max(0.0, dot(viewD, norm));

      // Sun vector in view-space
      vec3 sunDirV = normalize((viewMatrix * vec4(450.0, 108.0, 68.0, 0.0)).xyz);
      float sunFacing = max(0.0, dot(norm, sunDirV));

      // Atmosphere is razor thin on grazing angles (scale height ~8.5km / 6371km = 0.0013)
      // Confined strictly to grazing edge and lit by the sun
      float atmosphereLimb = pow(rim, 5.5) * sunFacing * 2.2;
      gl_FragColor.rgb += vec3(0.24, 0.58, 1.0) * atmosphereLimb;
      `
    );
  };

  const earth = new THREE.Mesh(earthGeo, earthMat);
  earth.position.copy(earthDir).multiplyScalar(distance);
  earth.rotation.y = THREE.MathUtils.degToRad(195); // Align Pacific/Americas towards Moon

  earthGroup.add(earth);

  return earthGroup;
}
