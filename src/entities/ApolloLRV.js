/**
 * AFTERLIGHT — Apollo Lunar Roving Vehicle (LRV) 3D Entity
 * Used on Apollo 15 (Hadley-Apennine), Apollo 16 (Descartes), and Apollo 17 (Taurus-Littrow).
 * Features:
 * - 2219 tubular aluminum space-frame chassis
 * - 4 wire-mesh wheels with titanium chevron treads and electric hub motors
 * - Folded tubular crew seats with nylon webbing
 * - Center console with T-handle joystick controller
 * - Mast-mounted 0.9m high-gain parabolic mesh antenna & RCA color TV camera
 * - Rear geology tool pallet with rake, tongs, and sample bags
 * - Documented Apollo 17 replacement tape/clamp fender repair
 */

import * as THREE from 'three';

export function createApolloLRV(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = THREE.MathUtils.degToRad(-35),
    mission = 'Apollo 15'
  } = options;

  const lrvGroup = new THREE.Group();
  lrvGroup.name = `apollo-lrv-${mission.toLowerCase().replace(' ', '-')}`;
  lrvGroup.userData = {
    artifactId: `lrv-${mission.toLowerCase().replace(' ', '-')}`,
    name: `Lunar Roving Vehicle (${mission})`,
    nation: 'United States (NASA)',
    mass: '210 kg (Earth) / 35 kg (Lunar weight)'
  };

  // Raycasting hit target
  const hitGeo = new THREE.BoxGeometry(3.2, 2.2, 2.2);
  hitGeo.translate(0, 1.1, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-lrv';
  hitMesh.userData = { ...lrvGroup.userData, isHitProxy: true };
  lrvGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  lrvGroup.position.set(posX, posY, posZ);
  lrvGroup.rotation.y = rotationY;

  // Materials
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0xc4c9d4, // Anodized 2219 aerospace aluminum
    roughness: 0.35,
    metalness: 0.88
  });

  const wireWheelMat = new THREE.MeshStandardMaterial({
    color: 0x8a929d, // Zinc-coated steel wire mesh
    wireframe: true,
    roughness: 0.45,
    metalness: 0.85
  });

  const darkTubingMat = new THREE.MeshStandardMaterial({
    color: 0x1e2229,
    roughness: 0.7,
    metalness: 0.6
  });

  const orangeTapeMat = new THREE.MeshStandardMaterial({
    color: 0xc86420, // Grey/orange duct tape for Apollo 17 fender fix
    roughness: 0.65,
    metalness: 0.1
  });

  const seatMeshMat = new THREE.MeshStandardMaterial({
    color: 0x2b3038,
    wireframe: true,
    roughness: 0.8
  });

  // 1. Tubular Space-Frame Chassis
  // Length: 3.1m, Width: 1.8m
  const chassisBedGeo = new THREE.BoxGeometry(2.6, 0.08, 1.4);
  const chassisBed = new THREE.Mesh(chassisBedGeo, aluminumMat);
  chassisBed.position.set(0, 0.45, 0);
  chassisBed.castShadow = true;
  chassisBed.receiveShadow = true;
  lrvGroup.add(chassisBed);

  // Chassis side rails
  [-0.68, 0.68].forEach(z => {
    const railGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.7, 6);
    railGeo.rotateZ(Math.PI / 2);
    const rail = new THREE.Mesh(railGeo, aluminumMat);
    rail.position.set(0, 0.52, z);
    lrvGroup.add(rail);
  });

  // 2. 4 Boeing Wire-Mesh Wheels with Chevron Treads
  // Diameter: 81.8 cm (radius 0.409m), Width: 23 cm
  const wheelX = [1.15, -1.15];
  const wheelZ = [0.95, -0.95];

  wheelX.forEach(wx => {
    wheelZ.forEach(wz => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.41, wz);

      // Wire mesh barrel
      const tireGeo = new THREE.CylinderGeometry(0.409, 0.409, 0.23, 16, 2, true);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, wireWheelMat);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Spun aluminum central wheel hub & DC series drive motor
      const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 10);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, aluminumMat);
      wheelGroup.add(hub);

      // Fiberglass Fenders over wheels
      const fenderGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.26, 12, 1, true, -Math.PI / 4, Math.PI / 2);
      fenderGeo.rotateX(Math.PI / 2);
      const fenderMat = (mission === 'Apollo 17' && wx === -1.15 && wz > 0) ? orangeTapeMat : darkTubingMat;
      const fender = new THREE.Mesh(fenderGeo, fenderMat);
      fender.position.y = 0.05;
      wheelGroup.add(fender);

      // Suspension A-frame strut
      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
      strutGeo.rotateZ(wx > 0 ? -Math.PI / 6 : Math.PI / 6);
      const strut = new THREE.Mesh(strutGeo, aluminumMat);
      strut.position.set(0, 0.12, wz > 0 ? -0.15 : 0.15);
      wheelGroup.add(strut);

      lrvGroup.add(wheelGroup);
    });
  });

  // 3. Crew Seats (CDR on Left, LMP on Right)
  [-0.32, 0.32].forEach(sz => {
    const seatGroup = new THREE.Group();
    seatGroup.position.set(-0.15, 0.52, sz);

    // Seat bottom
    const bottomGeo = new THREE.BoxGeometry(0.48, 0.04, 0.46);
    const bottom = new THREE.Mesh(bottomGeo, seatMeshMat);
    seatGroup.add(bottom);

    // Seat back tilted
    const backGeo = new THREE.BoxGeometry(0.04, 0.55, 0.46);
    const back = new THREE.Mesh(backGeo, seatMeshMat);
    back.position.set(-0.24, 0.28, 0);
    back.rotation.z = THREE.MathUtils.degToRad(-15);
    seatGroup.add(back);

    lrvGroup.add(seatGroup);
  });

  // 4. Center Console & T-Handle Controller
  const consoleGeo = new THREE.BoxGeometry(0.18, 0.38, 0.12);
  const consoleMesh = new THREE.Mesh(consoleGeo, darkTubingMat);
  consoleMesh.position.set(0.12, 0.72, 0);
  lrvGroup.add(consoleMesh);

  // T-Handle
  const tPostGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6);
  const tPost = new THREE.Mesh(tPostGeo, aluminumMat);
  tPost.position.set(0.12, 0.98, 0);
  lrvGroup.add(tPost);
  const tBarGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 6);
  tBarGeo.rotateZ(Math.PI / 2);
  const tBar = new THREE.Mesh(tBarGeo, aluminumMat);
  tBar.position.set(0.12, 1.09, 0);
  lrvGroup.add(tBar);

  // 5. Mast with High-Gain Parabolic Mesh Antenna & RCA Color TV Camera
  const mastPostGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.25, 8);
  const mast = new THREE.Mesh(mastPostGeo, aluminumMat);
  mast.position.set(0.95, 1.05, 0.55);
  lrvGroup.add(mast);

  // High-gain parabolic wire mesh dish (Diameter: 0.9m)
  const dishGeo = new THREE.SphereGeometry(0.45, 16, 12, 0, Math.PI * 2, 0, Math.PI / 3);
  dishGeo.rotateX(Math.PI / 2);
  const dish = new THREE.Mesh(dishGeo, wireWheelMat);
  dish.position.set(0.95, 1.68, 0.55);
  dish.rotation.x = THREE.MathUtils.degToRad(-35); // Pointed at Earth
  dish.rotation.y = THREE.MathUtils.degToRad(20);
  lrvGroup.add(dish);

  // RCA Color TV Camera (ground-controlled pan/tilt)
  const camGeo = new THREE.BoxGeometry(0.18, 0.14, 0.32);
  const cam = new THREE.Mesh(camGeo, darkTubingMat);
  cam.position.set(0.95, 1.35, 0.55);
  lrvGroup.add(cam);

  // 16mm Data Acquisition Camera (DAC) on LMP side
  const dacGeo = new THREE.BoxGeometry(0.12, 0.14, 0.18);
  const dac = new THREE.Mesh(dacGeo, aluminumMat);
  dac.position.set(0.35, 0.85, -0.62);
  lrvGroup.add(dac);

  // 6. Rear Geology Tool Pallet
  const palletGeo = new THREE.BoxGeometry(0.65, 0.06, 1.1);
  const pallet = new THREE.Mesh(palletGeo, darkTubingMat);
  pallet.position.set(-1.15, 0.52, 0);
  lrvGroup.add(pallet);

  // Sampling tongs and extension handle
  const tongsGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.85, 6);
  tongsGeo.rotateX(Math.PI / 2);
  const tongs = new THREE.Mesh(tongsGeo, aluminumMat);
  tongs.position.set(-1.18, 0.62, 0.25);
  lrvGroup.add(tongs);

  // 7. Chevron Tread Tracks on Ground
  const lrvTrackGeo = new THREE.PlaneGeometry(1.9, 5.2);
  lrvTrackGeo.rotateX(-Math.PI / 2);
  const trackCanvas = document.createElement('canvas');
  trackCanvas.width = 128;
  trackCanvas.height = 256;
  const tctx = trackCanvas.getContext('2d');
  tctx.fillStyle = 'rgba(0,0,0,0)';
  tctx.fillRect(0, 0, 128, 256);
  // Dual chevron treads
  tctx.fillStyle = 'rgba(10, 12, 16, 0.7)';
  tctx.fillRect(10, 0, 26, 256);
  tctx.fillRect(92, 0, 26, 256);
  // Chevron ridges
  tctx.strokeStyle = 'rgba(4, 6, 8, 0.9)';
  tctx.lineWidth = 3;
  for (let y = 0; y < 256; y += 14) {
    tctx.beginPath();
    tctx.moveTo(12, y);
    tctx.lineTo(23, y + 6);
    tctx.lineTo(34, y);
    tctx.stroke();

    tctx.beginPath();
    tctx.moveTo(94, y);
    tctx.lineTo(105, y + 6);
    tctx.lineTo(116, y);
    tctx.stroke();
  }
  const trackTex = new THREE.CanvasTexture(trackCanvas);
  const trackMat = new THREE.MeshBasicMaterial({ map: trackTex, transparent: true, opacity: 0.85, depthWrite: false });
  const trackMesh = new THREE.Mesh(lrvTrackGeo, trackMat);
  trackMesh.position.set(-2.8, 0.015, 0);
  lrvGroup.add(trackMesh);

  return lrvGroup;
}
