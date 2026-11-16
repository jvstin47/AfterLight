/**
 * AFTERLIGHT — Realistic Lunar Regolith PBR Material & Photographic Albedo Mapping
 * Accurately models Apollo 12 basaltic mare soil, crater albedo features,
 * dark compacted astronaut trails, and retroreflective opposition surge (Heiligenschein).
 */

import * as THREE from 'three';

/**
 * Creates high-fidelity regolith material with 2048x2048 procedural photographic albedo
 * and micro-porous bump displacement calibrated to Apollo 12 coordinates.
 */
export function createRegolithMaterial() {
  const mapSize = 2048;
  const terrainWorldSize = 850; // 850 meters wide
  const pxPerMeter = mapSize / terrainWorldSize; // ~2.41 px / meter

  // Helper to convert world (x, z) to canvas pixel (u, v)
  function worldToCanvas(wx, wz) {
    const cx = (wx + terrainWorldSize / 2) * pxPerMeter;
    const cy = (wz + terrainWorldSize / 2) * pxPerMeter;
    return { x: cx, y: cy };
  }

  // 1. Generate Albedo / Color Map
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = mapSize;
  albedoCanvas.height = mapSize;
  const ctx = albedoCanvas.getContext('2d');

  // Base mare basalt tone (Oceanus Procellarum dark olive-charcoal)
  ctx.fillStyle = '#32363b';
  ctx.fillRect(0, 0, mapSize, mapSize);

  // Broad multi-scale tonal mottling (lunar mare maria variations)
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * mapSize;
    const ry = Math.random() * mapSize;
    const rRadius = 40 + Math.random() * 160;
    const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rRadius);
    const delta = (Math.random() - 0.5) * 16;
    const lum = Math.floor(52 + delta);
    grad.addColorStop(0, `rgba(${lum}, ${lum + 2}, ${lum + 5}, 0.35)`);
    grad.addColorStop(1, 'rgba(50, 54, 59, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(rx, ry, rRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Render Authentic Photographic Crater Albedo Features
  const craters = [
    { wx: 50, wz: 115, r: 100, name: 'Surveyor Crater', innerDark: 0.18, rimLight: 0.25 },
    { wx: -95, wz: 25, r: 70, name: 'Head Crater', innerDark: 0.15, rimLight: 0.2 },
    { wx: -140, wz: 45, r: 35, name: 'Bench Crater', innerDark: 0.22, rimLight: 0.15 },
    { wx: -100, wz: 130, r: 15, name: 'Halo Crater', innerDark: 0.3, rimLight: -0.15 }, // Dark impact melt ring
    { wx: 60, wz: 85, r: 8.5, name: 'Block Crater', innerDark: 0.12, rimLight: 0.35 },   // Bright rocky rim
    { wx: -210, wz: 95, r: 10, name: 'Sharp Crater', innerDark: 0.1, rimLight: 0.5, rays: true } // Distinct white ejecta rays
  ];

  craters.forEach((cr) => {
    const cp = worldToCanvas(cr.wx, cr.wz);
    const crPx = cr.r * pxPerMeter;

    // Ejecta blanket halo
    const ejectaGrad = ctx.createRadialGradient(cp.x, cp.y, crPx * 0.8, cp.x, cp.y, crPx * 2.2);
    const rimAlpha = Math.max(0, cr.rimLight);
    ejectaGrad.addColorStop(0, `rgba(88, 94, 102, ${rimAlpha * 0.4})`);
    ejectaGrad.addColorStop(1, 'rgba(50, 54, 59, 0)');
    ctx.fillStyle = ejectaGrad;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, crPx * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Sharp Crater distinct bright white ejecta rays
    if (cr.rays) {
      ctx.strokeStyle = 'rgba(125, 134, 146, 0.45)';
      ctx.lineWidth = 3;
      for (let a = 0; a < 14; a++) {
        const angle = a * (Math.PI / 7) + 0.2;
        const rayLen = crPx * (2.0 + Math.sin(a * 4) * 0.8);
        ctx.beginPath();
        ctx.moveTo(cp.x + Math.cos(angle) * crPx * 0.9, cp.y + Math.sin(angle) * crPx * 0.9);
        ctx.lineTo(cp.x + Math.cos(angle) * rayLen, cp.y + Math.sin(angle) * rayLen);
        ctx.stroke();
      }
    }

    // Halo Crater dark glass-rich impact melt ring
    if (cr.name === 'Halo Crater') {
      const meltGrad = ctx.createRadialGradient(cp.x, cp.y, crPx * 0.9, cp.x, cp.y, crPx * 1.8);
      meltGrad.addColorStop(0, 'rgba(22, 23, 26, 0.7)');
      meltGrad.addColorStop(1, 'rgba(50, 54, 59, 0)');
      ctx.fillStyle = meltGrad;
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, crPx * 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Crater bowl interior shading
    const bowlGrad = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, crPx);
    bowlGrad.addColorStop(0, `rgba(32, 34, 38, ${cr.innerDark + 0.25})`);
    bowlGrad.addColorStop(0.75, `rgba(40, 43, 48, ${cr.innerDark})`);
    bowlGrad.addColorStop(1, 'rgba(68, 73, 80, 0.1)');
    ctx.fillStyle = bowlGrad;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, crPx, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Hundreds of Subtle Micro-Craters across the Plains
  for (let m = 0; m < 350; m++) {
    const mAngle = (m * 137.5) * (Math.PI / 180);
    const mDist = 20 + ((m * 29) % 390);
    const mx = mDist * Math.cos(mAngle);
    const my = mDist * Math.sin(mAngle);
    const mp = worldToCanvas(mx, my);
    const mr = (1.5 + (m % 5) * 1.2) * pxPerMeter;

    const microGrad = ctx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, mr);
    microGrad.addColorStop(0, 'rgba(28, 30, 34, 0.5)');
    microGrad.addColorStop(0.8, 'rgba(38, 41, 46, 0.3)');
    microGrad.addColorStop(1, 'rgba(72, 78, 86, 0.15)');
    ctx.fillStyle = microGrad;
    ctx.beginPath();
    ctx.arc(mp.x, mp.y, mr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Ground-Level Compacted Astronaut Boot Trails & Documented Disturbance Zones
  // Darkened regolith tracks from Pete Conrad & Alan Bean disturbing the high-albedo fluffy top layer

  // 4A. Intrepid Descent Engine Radial Rocket Scouring Plume (Supersonic exhaust scouring)
  const lmCanvasPos = worldToCanvas(0, 0);
  const plumeGrad = ctx.createRadialGradient(
    lmCanvasPos.x, lmCanvasPos.y, 1.5 * pxPerMeter,
    lmCanvasPos.x, lmCanvasPos.y, 28 * pxPerMeter
  );
  plumeGrad.addColorStop(0, 'rgba(18, 20, 24, 0.92)'); // Dark scoured core
  plumeGrad.addColorStop(0.2, 'rgba(35, 38, 44, 0.65)');
  plumeGrad.addColorStop(0.7, 'rgba(72, 78, 86, 0.25)'); // Swept lighter halo
  plumeGrad.addColorStop(1, 'rgba(50, 54, 59, 0)');
  ctx.fillStyle = plumeGrad;
  ctx.beginPath();
  ctx.arc(lmCanvasPos.x, lmCanvasPos.y, 28 * pxPerMeter, 0, Math.PI * 2);
  ctx.fill();

  // Radial exhaust blast streaks
  ctx.strokeStyle = 'rgba(24, 26, 30, 0.45)';
  ctx.lineWidth = 1.5;
  for (let s = 0; s < 36; s++) {
    const sAngle = (s * 10) * (Math.PI / 180) + (Math.sin(s * 3) * 0.08);
    const sLen = (12 + (s % 5) * 4) * pxPerMeter;
    ctx.beginPath();
    ctx.moveTo(
      lmCanvasPos.x + Math.cos(sAngle) * 3 * pxPerMeter,
      lmCanvasPos.y + Math.sin(sAngle) * 3 * pxPerMeter
    );
    ctx.lineTo(
      lmCanvasPos.x + Math.cos(sAngle) * sLen,
      lmCanvasPos.y + Math.sin(sAngle) * sLen
    );
    ctx.stroke();
  }

  // 4B. LM Landing Gear Footpad Soil Compaction Impressions
  // 4 Footpads located along diagonals at r = 4.725m from LM origin
  const footpads = [
    { x: 3.34, z: 3.34, label: 'Forward Ladder Pad 1' },
    { x: 3.34, z: -3.34, label: 'Right Pad 2' },
    { x: -3.34, z: -3.34, label: 'Aft Pad 3' },
    { x: -3.34, z: 3.34, label: 'Left Pad 4' }
  ];
  footpads.forEach(fp => {
    const fpp = worldToCanvas(fp.x, fp.z);
    const fpRad = 0.48 * pxPerMeter; // 0.96m diameter dish
    ctx.fillStyle = 'rgba(14, 16, 20, 0.95)';
    ctx.beginPath();
    ctx.arc(fpp.x, fpp.y, fpRad, 0, Math.PI * 2);
    ctx.fill();
    // Compacted rim ring
    ctx.strokeStyle = 'rgba(68, 74, 82, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 4C. Surveyor 3 Footpad 2 Soil Trench (Documented in AS12-48-7099)
  const s3Pos = worldToCanvas(72, 150);
  ctx.fillStyle = 'rgba(16, 18, 22, 0.9)';
  ctx.beginPath();
  ctx.ellipse(s3Pos.x + 1.2 * pxPerMeter, s3Pos.y + 0.8 * pxPerMeter, 1.2 * pxPerMeter, 0.45 * pxPerMeter, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // 4D. Heavily Trampled Astronaut Activity Work Zones
  const workZones = [
    { x: 2.2, z: 2.2, r: 3.5, alpha: 0.75, name: 'MESA Work Area' },
    { x: 0, z: 7.0, r: 3.0, alpha: 0.8, name: 'US Flag Deployment Site' },
    { x: -106, z: -75, r: 6.0, alpha: 0.65, name: 'ALSEP Deployment Station' },
    { x: 72, z: 149, r: 3.2, alpha: 0.7, name: 'Surveyor Inspection Zone' }
  ];
  workZones.forEach(wz => {
    const wp = worldToCanvas(wz.x, wz.z);
    const wr = wz.r * pxPerMeter;
    const wGrad = ctx.createRadialGradient(wp.x, wp.y, wr * 0.2, wp.x, wp.y, wr);
    wGrad.addColorStop(0, `rgba(22, 24, 28, ${wz.alpha})`);
    wGrad.addColorStop(0.7, `rgba(32, 35, 40, ${wz.alpha * 0.6})`);
    wGrad.addColorStop(1, 'rgba(50, 54, 59, 0)');
    ctx.fillStyle = wGrad;
    ctx.beginPath();
    ctx.arc(wp.x, wp.y, wr, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4E. Astronaut EVA Walking Trails (Dual loping stride tracks)
  ctx.strokeStyle = 'rgba(24, 26, 30, 0.82)';
  ctx.lineWidth = Math.max(2.2, 1.1 * pxPerMeter);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const paths = [
    // EVA-1: Intrepid -> MESA -> ALSEP deployment
    [
      [0, 0],
      [2.2, 2.2],
      [-25, -12],
      [-55, -35],
      [-80, -55],
      [-106, -75]
    ],
    // EVA-1: Intrepid -> US Flag
    [
      [0, 0],
      [0, 7]
    ],
    // EVA-2: Intrepid -> Surveyor Crater Rim -> Surveyor 3
    [
      [0, 0],
      [15, 30],
      [32, 70],
      [50, 105],
      [68, 140],
      [72, 150]
    ],
    // EVA-2: Traverse loop from ALSEP around Head Crater -> Bench -> Sharp -> Halo
    [
      [-106, -75],
      [-95, 0],
      [-110, 25],
      [-140, 45],
      [-210, 95],
      [-100, 130],
      [20, 100],
      [50, 105]
    ]
  ];

  paths.forEach((pts) => {
    ctx.beginPath();
    pts.forEach(([wx, wz], idx) => {
      const p = worldToCanvas(wx, wz);
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Render individual bootprint steps along path for tangible micro-scale fidelity
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i];
      const [x2, z2] = pts[i + 1];
      const segDist = Math.hypot(x2 - x1, z2 - z1);
      const stepInterval = 1.35; // 1.35m astronaut 1/6th-g loping stride
      const steps = Math.floor(segDist / stepInterval);

      for (let s = 1; s <= steps; s++) {
        const t = s / (steps + 1);
        const bx = x1 + (x2 - x1) * t;
        const bz = z1 + (z2 - z1) * t;
        // Alternating left/right foot offset
        const normalAngle = Math.atan2(z2 - z1, x2 - x1) + Math.PI / 2;
        const footOffset = (s % 2 === 0 ? 0.22 : -0.22);
        const fx = bx + Math.cos(normalAngle) * footOffset;
        const fz = bz + Math.sin(normalAngle) * footOffset;

        const fp = worldToCanvas(fx, fz);
        ctx.fillStyle = 'rgba(16, 18, 22, 0.75)';
        ctx.beginPath();
        ctx.ellipse(fp.x, fp.y, 0.22 * pxPerMeter, 0.42 * pxPerMeter, normalAngle - Math.PI / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  // 5. Generate Multi-Scale Coherent Porous Regolith Bump Map (512x512 seamless)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');
  const bImg = bCtx.createImageData(512, 512);
  const bData = bImg.data;

  // Multi-octave continuous regolith height synthesis
  // Creates organic porous soil clumping rather than uncorrelated TV static
  const twoPi = Math.PI * 2;
  for (let y = 0; y < 512; y++) {
    const ny = y / 512;
    for (let x = 0; x < 512; x++) {
      const nx = x / 512;
      const idx = (y * 512 + x) * 4;

      // Coherent harmonic wave interference (seamless periodic boundary)
      const w1 = Math.sin(nx * twoPi * 6) * Math.cos(ny * twoPi * 6);
      const w2 = Math.sin((nx + ny) * twoPi * 12 + 0.5) * 0.5;
      const w3 = Math.cos((nx * 2 - ny) * twoPi * 24 + 1.2) * 0.25;
      const w4 = Math.sin((nx + ny * 2) * twoPi * 48) * 0.12;

      // Micro-grit high frequency component
      const grit = (Math.random() - 0.5) * 0.18;

      let h = 0.5 + (w1 * 0.35 + w2 + w3 + w4) * 0.28 + grit;
      const val = Math.min(255, Math.max(0, Math.floor(h * 255)));

      bData[idx] = val;
      bData[idx + 1] = val;
      bData[idx + 2] = val;
      bData[idx + 3] = 255;
    }
  }
  bCtx.putImageData(bImg, 0, 0);

  // Stamp 60 micro-crater indentations with raised rims into the bump map
  for (let c = 0; c < 60; c++) {
    const cx = (c * 79 + 37) % 512;
    const cy = (c * 113 + 53) % 512;
    const rad = 4 + (c % 7) * 2.5;

    const microGrad = bCtx.createRadialGradient(cx, cy, 0, cx, cy, rad * 1.5);
    microGrad.addColorStop(0, 'rgba(30, 30, 30, 0.6)');
    microGrad.addColorStop(0.7, 'rgba(80, 80, 80, 0.3)');
    microGrad.addColorStop(0.9, 'rgba(230, 230, 230, 0.45)'); // Raised rim
    microGrad.addColorStop(1, 'rgba(128, 128, 128, 0)');

    bCtx.fillStyle = microGrad;
    bCtx.beginPath();
    bCtx.arc(cx, cy, rad * 1.5, 0, twoPi);
    bCtx.fill();
  }

  const albedoTexture = new THREE.CanvasTexture(albedoCanvas);
  albedoTexture.wrapS = THREE.ClampToEdgeWrapping;
  albedoTexture.wrapT = THREE.ClampToEdgeWrapping;
  albedoTexture.colorSpace = THREE.SRGBColorSpace;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(48, 48);

  // PBR Material setup calibrated for lunar mare basalt regolith
  const material = new THREE.MeshStandardMaterial({
    map: albedoTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.24,
    roughness: 0.95,
    metalness: 0.02,
    flatShading: false
  });

  // Heiligenschein / Retroreflective Opposition Surge (Hapke Coherent Backscatter)
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Lunar Retroreflective Opposition Surge (Heiligenschein)
      vec3 viewDir = normalize(vViewPosition);
      vec3 sunDirView = normalize((viewMatrix * vec4(450.0, 105.0, 75.0, 0.0)).xyz);
      float alignment = max(0.0, dot(viewDir, sunDirView));
      // Sharp coherent retroreflective backscatter peak + broad surge
      float peakSurge = pow(alignment, 36.0) * 0.52;
      float broadSurge = pow(alignment, 8.0) * 0.20;
      float totalSurge = peakSurge + broadSurge;
      gl_FragColor.rgb += gl_FragColor.rgb * totalSurge * 1.6;
      `
    );
  };

  return material;
}
