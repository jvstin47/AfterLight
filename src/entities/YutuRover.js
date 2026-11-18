/**
 * AFTERLIGHT — CNSA Yutu Rover 3D Entity (Yutu-1 & Yutu-2)
 * Features:
 * - Golden thermal MLI wrapped main avionics compartment
 * - 6-wheel rocker-bogie suspension with open-vane aluminum wheels
 * - Dual gull-wing solar panel arrays
 * - Mast-mounted panoramic stereo camera & navigation sensors
 * - Undercarriage Lunar Penetrating Radar (LPR) dipole antennas
 * - Robotic science arm with APXS spectrometer
 * - Yutu-2 far-side designation (longest-operating rover on lunar surface)
 */

import * as THREE from 'three';

export function createYutuRover(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = THREE.MathUtils.degToRad(15),
    isYutu2 = true
  } = options;

  const yutuGroup = new THREE.Group();
  yutuGroup.name = isYutu2 ? 'yutu-2-rover' : 'yutu-1-rover';
  yutuGroup.userData = {
    artifactId: isYutu2 ? 'change-4-yutu-2' : 'change-3-yutu-1',
    name: isYutu2 ? 'Yutu-2 (玉兔二号 · Jade Rabbit 2)' : 'Yutu-1 (玉兔号 · Jade Rabbit 1)',
    nation: 'China (CNSA)',
    mass: '140 kg',
    location: isYutu2 ? 'Von Kármán Crater (Far Side)' : 'Mare Imbrium'
  };

  // Raycasting hit collider
  const hitGeo = new THREE.BoxGeometry(2.0, 1.8, 1.8);
  hitGeo.translate(0, 0.9, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-yutu';
  hitMesh.userData = { ...yutuGroup.userData, isHitProxy: true };
  yutuGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  yutuGroup.position.set(posX, posY, posZ);
  yutuGroup.rotation.y = rotationY;

  // Materials
  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xdfac4e, // High-specularity Kapton MLI thermal gold
    roughness: 0.22,
    metalness: 0.92
  });

  const aluminumVaneMat = new THREE.MeshStandardMaterial({
    color: 0xa0a8b4,
    wireframe: true,
    roughness: 0.38,
    metalness: 0.88
  });

  const darkStrutMat = new THREE.MeshStandardMaterial({
    color: 0x1a1e24,
    roughness: 0.6,
    metalness: 0.8
  });

  // Solar cells canvas
  const solarCanvas = document.createElement('canvas');
  solarCanvas.width = 256;
  solarCanvas.height = 256;
  const sctx = solarCanvas.getContext('2d');
  sctx.fillStyle = '#081222';
  sctx.fillRect(0, 0, 256, 256);
  sctx.strokeStyle = '#1e3a5f';
  sctx.lineWidth = 2;
  for (let x = 0; x < 256; x += 32) sctx.strokeRect(x, 0, 32, 256);
  for (let y = 0; y < 256; y += 32) sctx.strokeRect(0, y, 256, 32);
  const solarTex = new THREE.CanvasTexture(solarCanvas);

  const solarMat = new THREE.MeshStandardMaterial({
    map: solarTex,
    color: 0x224477,
    roughness: 0.2,
    metalness: 0.88,
    side: THREE.DoubleSide
  });

  // 1. Main Avionics Box (Gold-Wrapped Chassis)
  // Length: 1.1m, Width: 0.85m, Height: 0.55m
  const bodyGeo = new THREE.BoxGeometry(1.1, 0.55, 0.85);
  const body = new THREE.Mesh(bodyGeo, goldFoilMat);
  body.position.set(0, 0.68, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  yutuGroup.add(body);

  // 2. Dual Gull-Wing Solar Panels (Port and Starboard)
  [-1, 1].forEach(side => {
    const wingGeo = new THREE.BoxGeometry(0.95, 0.03, 0.8);
    const wing = new THREE.Mesh(wingGeo, solarMat);
    wing.position.set(0, 0.95, side * 0.85);
    wing.rotation.x = side * THREE.MathUtils.degToRad(18); // Gull-wing upward angle
    wing.castShadow = true;
    yutuGroup.add(wing);
  });

  // 3. 6-Wheel Rocker-Bogie Suspension
  // 3 wheels per side: Front, Middle, Rear
  const wheelX = [0.55, 0.0, -0.55];
  const wheelZ = [0.58, -0.58];

  wheelX.forEach((wx, i) => {
    wheelZ.forEach(wz => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(wx, 0.22, wz);

      // Open-vane cleated wheel
      const rimGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 14, 2, true);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, aluminumVaneMat);
      rim.castShadow = true;
      wheelAssembly.add(rim);

      const hubGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 8);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, darkStrutMat);
      wheelAssembly.add(hub);

      // Rocker bogie connecting struts
      const strutGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.32, 6);
      strutGeo.rotateZ(wx > 0 ? -Math.PI / 6 : Math.PI / 6);
      const strut = new THREE.Mesh(strutGeo, darkStrutMat);
      strut.position.set(0, 0.15, wz > 0 ? -0.1 : 0.1);
      wheelAssembly.add(strut);

      yutuGroup.add(wheelAssembly);
    });
  });

  // 4. Mast with Panoramic Stereo Camera
  const mastGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 8);
  const mast = new THREE.Mesh(mastGeo, darkStrutMat);
  mast.position.set(0.42, 1.25, 0);
  yutuGroup.add(mast);

  const headGeo = new THREE.BoxGeometry(0.22, 0.14, 0.35);
  const head = new THREE.Mesh(headGeo, goldFoilMat);
  head.position.set(0.42, 1.68, 0);
  head.castShadow = true;
  yutuGroup.add(head);

  // Dual stereo lenses
  [-0.1, 0.1].forEach(lz => {
    const lensGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.06, 10);
    lensGeo.rotateZ(Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, darkStrutMat);
    lens.position.set(0.53, 1.68, lz);
    yutuGroup.add(lens);
  });

  // 5. Lunar Penetrating Radar (LPR) Antennas (Undercarriage rods)
  [-0.25, 0.25].forEach(rx => {
    const radarGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.8, 6);
    radarGeo.rotateX(Math.PI / 2);
    const radar = new THREE.Mesh(radarGeo, darkStrutMat);
    radar.position.set(rx, 0.38, 0);
    yutuGroup.add(radar);
  });

  // 6. Robotic Science Arm (Front APXS)
  const armGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6);
  armGeo.rotateZ(Math.PI / 4);
  const arm = new THREE.Mesh(armGeo, darkStrutMat);
  arm.position.set(0.68, 0.45, 0.15);
  yutuGroup.add(arm);

  const sensorGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8);
  const sensor = new THREE.Mesh(sensorGeo, aluminumVaneMat);
  sensor.position.set(0.85, 0.32, 0.15);
  yutuGroup.add(sensor);

  // 7. Ground Wheel Tracks
  const yutuTrackGeo = new THREE.PlaneGeometry(1.25, 3.8);
  yutuTrackGeo.rotateX(-Math.PI / 2);
  const trackCanvas = document.createElement('canvas');
  trackCanvas.width = 128;
  trackCanvas.height = 256;
  const tctx = trackCanvas.getContext('2d');
  tctx.fillStyle = 'rgba(0,0,0,0)';
  tctx.fillRect(0, 0, 128, 256);
  tctx.fillStyle = 'rgba(8, 11, 16, 0.7)';
  tctx.fillRect(16, 0, 18, 256);
  tctx.fillRect(94, 0, 18, 256);
  const trackTex = new THREE.CanvasTexture(trackCanvas);
  const trackMat = new THREE.MeshBasicMaterial({ map: trackTex, transparent: true, opacity: 0.8, depthWrite: false });
  const trackMesh = new THREE.Mesh(yutuTrackGeo, trackMat);
  trackMesh.position.set(-1.8, 0.015, 0);
  yutuGroup.add(trackMesh);

  return yutuGroup;
}
