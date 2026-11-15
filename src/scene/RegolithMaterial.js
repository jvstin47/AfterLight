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

  // 4. Ground-Level Compacted Astronaut Boot Trails
  // Darkened regolith tracks from Pete Conrad & Alan Bean disturbing the fluffy top layer
  ctx.strokeStyle = 'rgba(26, 28, 32, 0.82)';
  ctx.lineWidth = Math.max(2.5, 1.3 * pxPerMeter); // ~1.3m wide path
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const paths = [
    // EVA-1: Intrepid -> MESA -> ALSEP deployment
    [
      [0, 0],
      [2, 2],
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
  });

  // 5. Generate Micro-Porous Regolith Bump Map (512x512 tiled high-frequency noise)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');
  const bImg = bCtx.createImageData(512, 512);
  const bData = bImg.data;

  for (let i = 0; i < bData.length; i += 4) {
    const n = Math.floor(128 + (Math.random() - 0.5) * 80 + (Math.random() - 0.5) * 40);
    const val = Math.min(255, Math.max(0, n));
    bData[i] = val;
    bData[i + 1] = val;
    bData[i + 2] = val;
    bData[i + 3] = 255;
  }
  bCtx.putImageData(bImg, 0, 0);

  const albedoTexture = new THREE.CanvasTexture(albedoCanvas);
  albedoTexture.wrapS = THREE.ClampToEdgeWrapping;
  albedoTexture.wrapT = THREE.ClampToEdgeWrapping;
  albedoTexture.colorSpace = THREE.SRGBColorSpace;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.RepeatWrapping;
  bumpTexture.repeat.set(64, 64);

  // PBR Material setup
  const material = new THREE.MeshStandardMaterial({
    map: albedoTexture,
    bumpMap: bumpTexture,
    bumpScale: 0.35,
    roughness: 0.94,
    metalness: 0.02,
    flatShading: false
  });

  // Heiligenschein / Retroreflective Opposition Surge
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Lunar Retroreflective Opposition Surge (Heiligenschein)
      vec3 viewDir = normalize(vViewPosition);
      vec3 sunDirView = normalize((viewMatrix * vec4(450.0, 105.0, 75.0, 0.0)).xyz);
      float alignment = max(0.0, dot(viewDir, sunDirView));
      // Non-linear backscatter surge modulated by surface albedo
      float surge = pow(alignment, 22.0) * 0.42;
      gl_FragColor.rgb += gl_FragColor.rgb * surge * 1.8;
      `
    );
  };

  return material;
}
