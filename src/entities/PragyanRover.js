/**
 * AFTERLIGHT — ISRO Chandrayaan-3 Pragyan Rover 3D Entity
 * Features:
 * - 26 kg compact 6-wheel rocker-bogie exploration rover
 * - Inclined 50W solar array wing on starboard side
 * - NavCam stereo navigation cameras
 * - APXS and LIBS elemental spectrometers
 * - Documented wheel tread relief: Ashoka Lion Capital and ISRO insignia embossed in lunar regolith
 * - Vikram Lander background plinth & egress ramp
 */

import * as THREE from 'three';

export function createPragyanRover(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = THREE.MathUtils.degToRad(-20)
  } = options;

  const roverGroup = new THREE.Group();
  roverGroup.name = 'chandrayaan-3-pragyan-rover';
  roverGroup.userData = {
    artifactId: 'chandrayaan-3-pragyan',
    name: 'Pragyan (प्रज्ञान · Wisdom)',
    nation: 'India (ISRO)',
    mass: '26 kg',
    location: 'Statio Shiv Shakti (69.373° S, 32.319° E)'
  };

  // Raycasting hit target
  const hitGeo = new THREE.BoxGeometry(1.6, 1.2, 1.4);
  hitGeo.translate(0, 0.6, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-pragyan';
  hitMesh.userData = { ...roverGroup.userData, isHitProxy: true };
  roverGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  roverGroup.position.set(posX, posY, posZ);
  roverGroup.rotation.y = rotationY;

  // Materials
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0xbaa872, // Warm gold thermal foil
    roughness: 0.28,
    metalness: 0.85
  });

  const blackSolarMat = new THREE.MeshStandardMaterial({
    color: 0x111c2e,
    roughness: 0.2,
    metalness: 0.9,
    side: THREE.DoubleSide
  });

  const aluminumWheelMat = new THREE.MeshStandardMaterial({
    color: 0x8a929e,
    roughness: 0.35,
    metalness: 0.9
  });

  const darkStrutMat = new THREE.MeshStandardMaterial({
    color: 0x20242a,
    roughness: 0.6,
    metalness: 0.7
  });

  // 1. Main Avionics Chassis Box
  // Length: 0.91m, Width: 0.55m, Height: 0.32m
  const bodyGeo = new THREE.BoxGeometry(0.85, 0.32, 0.55);
  const body = new THREE.Mesh(bodyGeo, chassisMat);
  body.position.set(0, 0.44, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  roverGroup.add(body);

  // 2. Inclined Starboard 50W Solar Panel Array
  const panelGeo = new THREE.BoxGeometry(0.78, 0.02, 0.68);
  const panel = new THREE.Mesh(panelGeo, blackSolarMat);
  panel.position.set(0, 0.72, 0.32);
  panel.rotation.x = THREE.MathUtils.degToRad(-35); // Inclined for low-angle high-latitude polar Sun (6°-12°)
  panel.castShadow = true;
  roverGroup.add(panel);

  // 3. 6-Wheel Rocker-Bogie Suspension
  const wheelX = [0.38, 0.0, -0.38];
  const wheelZ = [0.38, -0.38];

  wheelX.forEach((wx, i) => {
    wheelZ.forEach(wz => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(wx, 0.16, wz);

      // Wheel rim (diameter: 20cm, width: 11cm)
      const rimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.11, 14);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, aluminumWheelMat);
      rim.castShadow = true;
      wheelAssembly.add(rim);

      // Connecting rocker strut
      const strutGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 6);
      strutGeo.rotateZ(wx > 0 ? -Math.PI / 6 : Math.PI / 6);
      const strut = new THREE.Mesh(strutGeo, darkStrutMat);
      strut.position.set(0, 0.11, wz > 0 ? -0.06 : 0.06);
      wheelAssembly.add(strut);

      roverGroup.add(wheelAssembly);
    });
  });

  // 4. Forward NavCam Stereo Camera Pair
  [-0.12, 0.12].forEach(cz => {
    const camGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8);
    camGeo.rotateZ(Math.PI / 2);
    const cam = new THREE.Mesh(camGeo, darkStrutMat);
    cam.position.set(0.44, 0.52, cz);
    roverGroup.add(cam);
  });

  // 5. APXS / LIBS Spectrometer Payload Arm
  const armGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.32, 6);
  armGeo.rotateZ(Math.PI / 3);
  const arm = new THREE.Mesh(armGeo, darkStrutMat);
  arm.position.set(0.48, 0.32, -0.12);
  roverGroup.add(arm);

  const laserHeadGeo = new THREE.BoxGeometry(0.08, 0.06, 0.08);
  const laserHead = new THREE.Mesh(laserHeadGeo, aluminumWheelMat);
  laserHead.position.set(0.62, 0.22, -0.12);
  roverGroup.add(laserHead);

  // 6. Ashoka Lion Capital & ISRO Wheel Tread Soil Imprints (Historical Feature)
  const trackGeo = new THREE.PlaneGeometry(0.85, 3.2);
  trackGeo.rotateX(-Math.PI / 2);
  const trackCanvas = document.createElement('canvas');
  trackCanvas.width = 128;
  trackCanvas.height = 256;
  const tctx = trackCanvas.getContext('2d');
  tctx.fillStyle = 'rgba(0,0,0,0)';
  tctx.fillRect(0, 0, 128, 256);

  // Dual wheel ruts in polar soil
  tctx.fillStyle = 'rgba(6, 8, 12, 0.72)';
  tctx.fillRect(16, 0, 18, 256);
  tctx.fillRect(94, 0, 18, 256);

  // Embossed Lion Capital / ISRO insignia dots
  tctx.fillStyle = 'rgba(2, 4, 7, 0.95)';
  for (let y = 16; y < 256; y += 48) {
    // Port wheel (Ashoka emblem dots)
    tctx.beginPath();
    tctx.arc(25, y, 6, 0, Math.PI * 2);
    tctx.fill();

    // Starboard wheel (ISRO logo geometric wing)
    tctx.fillRect(98, y - 5, 10, 10);
  }

  const trackTex = new THREE.CanvasTexture(trackCanvas);
  const trackMat = new THREE.MeshBasicMaterial({ map: trackTex, transparent: true, opacity: 0.85, depthWrite: false });
  const trackMesh = new THREE.Mesh(trackGeo, trackMat);
  trackMesh.position.set(-1.6, 0.015, 0);
  roverGroup.add(trackMesh);

  // 7. Vikram Lander in Background (Egress ramp visible)
  const vikramGroup = new THREE.Group();
  vikramGroup.position.set(-5.5, 0, 1.2);
  vikramGroup.name = 'vikram-lander-silhouette';

  // Octagonal golden lander body
  const vikramGeo = new THREE.CylinderGeometry(1.4, 1.6, 1.5, 8);
  const vikram = new THREE.Mesh(vikramGeo, chassisMat);
  vikram.position.y = 1.35;
  vikram.castShadow = true;
  vikramGroup.add(vikram);

  // 4 Lander Legs
  for (let a = 0; a < 4; a++) {
    const angle = (a * Math.PI) / 2 + Math.PI / 4;
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6);
    legGeo.rotateZ(Math.PI / 6);
    const leg = new THREE.Mesh(legGeo, aluminumWheelMat);
    leg.position.set(Math.cos(angle) * 1.6, 0.75, Math.sin(angle) * 1.6);
    leg.rotation.y = angle;
    vikramGroup.add(leg);

    // Footpad
    const padGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.05, 8);
    const pad = new THREE.Mesh(padGeo, aluminumWheelMat);
    pad.position.set(Math.cos(angle) * 2.2, 0.04, Math.sin(angle) * 2.2);
    vikramGroup.add(pad);
  }

  // Egress Ramp deployed to ground
  const rampGeo = new THREE.BoxGeometry(2.4, 0.04, 0.45);
  rampGeo.rotateZ(THREE.MathUtils.degToRad(-26));
  const ramp = new THREE.Mesh(rampGeo, aluminumWheelMat);
  ramp.position.set(1.4, 0.52, 0);
  vikramGroup.add(ramp);

  roverGroup.add(vikramGroup);

  return roverGroup;
}
