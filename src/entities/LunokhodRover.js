/**
 * AFTERLIGHT — Soviet Lunokhod Rover 3D Entity (Lunokhod 1 & 2)
 * High-fidelity 3D reconstruction of the Soviet Union's robotic lunar rover.
 * Features:
 * - Double-convex magnesium alloy bathtub hull
 * - 8 independently driven wire-mesh wheels with titanium hub motors
 * - Hinged convex solar lid with photovoltaic cell grid
 * - Polonium-210 isotopic thermal radiator block
 * - High-gain helical directional antenna & conical omni-antenna
 * - Dual front panoramic cycloramic optical cameras
 * - 9th trailing odometer wheel for wheel-slip telemetry
 * - USSR State Emblem plaque
 */

import * as THREE from 'three';

export function createLunokhodRover(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = THREE.MathUtils.degToRad(25),
    isLunokhod2 = false
  } = options;

  const roverGroup = new THREE.Group();
  roverGroup.name = isLunokhod2 ? 'lunokhod-2-rover' : 'lunokhod-1-rover';
  roverGroup.userData = {
    artifactId: isLunokhod2 ? 'luna-21-lunokhod-2' : 'luna-17-lunokhod-1',
    name: isLunokhod2 ? 'Lunokhod 2 (Аппарат 8ЕЛ № 204)' : 'Lunokhod 1 (Аппарат 8ЕЛ № 203)',
    nation: 'Soviet Union (USSR)',
    mass: isLunokhod2 ? '840 kg' : '756 kg'
  };

  // Invisible raycasting hit collider
  const hitGeo = new THREE.BoxGeometry(2.4, 1.8, 1.8);
  hitGeo.translate(0, 0.9, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-lunokhod';
  hitMesh.userData = { ...roverGroup.userData, isHitProxy: true };
  roverGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  roverGroup.position.set(posX, posY, posZ);
  roverGroup.rotation.y = rotationY;

  // Materials
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x8a929e, // Magnesium-aluminum alloy satin finish
    roughness: 0.42,
    metalness: 0.78
  });

  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x22262c,
    roughness: 0.6,
    metalness: 0.85
  });

  const wireMeshMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    wireframe: true,
    roughness: 0.35,
    metalness: 0.9
  });

  const goldKaptonMat = new THREE.MeshStandardMaterial({
    color: 0xd4a044,
    roughness: 0.28,
    metalness: 0.92
  });

  // 1. Double-Convex Bathtub Hull (Main Pressurized Compartment)
  // Length: 2.15m, Width: 1.4m, Height: 0.85m
  const hullGeo = new THREE.CylinderGeometry(0.72, 0.58, 2.1, 16);
  hullGeo.rotateZ(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.position.set(0, 0.85, 0);
  hull.scale.set(1.0, 0.72, 0.88);
  hull.castShadow = true;
  hull.receiveShadow = true;
  roverGroup.add(hull);

  // Front nose cone cap
  const noseGeo = new THREE.SphereGeometry(0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
  noseGeo.rotateX(-Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, hullMat);
  nose.position.set(1.05, 0.85, 0);
  nose.scale.set(0.65, 0.72, 0.88);
  nose.castShadow = true;
  roverGroup.add(nose);

  // 2. Hinged Solar Cell Array Lid (Opened in operational position)
  const lidCanvas = document.createElement('canvas');
  lidCanvas.width = 256;
  lidCanvas.height = 256;
  const lctx = lidCanvas.getContext('2d');
  lctx.fillStyle = '#0a1220';
  lctx.fillRect(0, 0, 256, 256);
  lctx.strokeStyle = '#1d3557';
  lctx.lineWidth = 2;
  for (let x = 0; x < 256; x += 32) {
    lctx.strokeRect(x, 0, 32, 256);
  }
  for (let y = 0; y < 256; y += 32) {
    lctx.strokeRect(0, y, 256, 32);
  }
  const lidTex = new THREE.CanvasTexture(lidCanvas);

  const solarLidMat = new THREE.MeshStandardMaterial({
    map: lidTex,
    color: 0x223355,
    roughness: 0.25,
    metalness: 0.85,
    side: THREE.DoubleSide
  });

  const lidGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.85, 16, 1, true, 0, Math.PI);
  lidGeo.rotateZ(Math.PI / 2);
  const lid = new THREE.Mesh(lidGeo, solarLidMat);
  lid.position.set(0, 1.25, -0.15);
  lid.rotation.x = THREE.MathUtils.degToRad(-48); // Tilted open to catch Sun
  lid.castShadow = true;
  roverGroup.add(lid);

  // 3. 8 Independent Wire-Mesh Wheels (4 on Port, 4 on Starboard)
  // Diameter: 51 cm (radius 0.255m), Width: 20 cm
  const wheelPositionsX = [0.75, 0.25, -0.25, -0.75];
  const wheelOffsetsZ = [0.82, -0.82];

  wheelPositionsX.forEach((wx, i) => {
    wheelOffsetsZ.forEach((wz) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(wx, 0.28, wz);

      // Outer wire-mesh rim
      const rimGeo = new THREE.CylinderGeometry(0.255, 0.255, 0.20, 14, 2, true);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, wireMeshMat);
      rim.castShadow = true;
      wheelAssembly.add(rim);

      // Wheel hub and titanium motor drive casing
      const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 10);
      hubGeo.rotateX(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, darkMetalMat);
      wheelAssembly.add(hub);

      // Suspension arm connecting to chassis
      const armGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.38, 6);
      armGeo.rotateZ(wz > 0 ? -Math.PI / 6 : Math.PI / 6);
      const arm = new THREE.Mesh(armGeo, darkMetalMat);
      arm.position.set(0, 0.22, wz > 0 ? -0.14 : 0.14);
      wheelAssembly.add(arm);

      roverGroup.add(wheelAssembly);
    });
  });

  // 4. Trailing 9th Odometer Wheel (Measuring distance and ground slip)
  const odoGroup = new THREE.Group();
  odoGroup.position.set(-1.18, 0.22, 0);
  const odoGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 12);
  odoGeo.rotateZ(Math.PI / 2);
  const odoWheel = new THREE.Mesh(odoGeo, darkMetalMat);
  odoGroup.add(odoWheel);
  const odoArmGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.42, 6);
  odoArmGeo.rotateZ(Math.PI / 3);
  const odoArm = new THREE.Mesh(odoArmGeo, darkMetalMat);
  odoArm.position.set(0.18, 0.14, 0);
  odoGroup.add(odoArm);
  roverGroup.add(odoGroup);

  // 5. Antennas
  // Conical omnidirectional antenna (Forward starboard)
  const coneGeo = new THREE.ConeGeometry(0.18, 0.45, 10);
  const coneAntenna = new THREE.Mesh(coneGeo, hullMat);
  coneAntenna.position.set(0.72, 1.45, 0.42);
  roverGroup.add(coneAntenna);

  // High-gain helical directional antenna (Steerable coil on top)
  const helixStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 8);
  const helixStem = new THREE.Mesh(helixStemGeo, darkMetalMat);
  helixStem.position.set(-0.25, 1.55, 0.32);
  roverGroup.add(helixStem);

  const helixDishGeo = new THREE.CylinderGeometry(0.24, 0.20, 0.08, 12);
  const helixDish = new THREE.Mesh(helixDishGeo, hullMat);
  helixDish.position.set(-0.25, 1.88, 0.32);
  helixDish.rotation.z = Math.PI / 6;
  roverGroup.add(helixDish);

  // 6. Dual Panoramic Optical Cameras (Front eyes)
  const eyeLGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.12, 10);
  eyeLGeo.rotateZ(Math.PI / 2);
  const eyeL = new THREE.Mesh(eyeLGeo, darkMetalMat);
  eyeL.position.set(1.02, 1.05, 0.18);
  roverGroup.add(eyeL);

  const eyeR = eyeL.clone();
  eyeR.position.set(1.02, 1.05, -0.18);
  roverGroup.add(eyeR);

  // 7. Polonium-210 Isotopic Heater Radiator Block (Rear heat exchanger)
  const radGeo = new THREE.BoxGeometry(0.35, 0.25, 0.55);
  const rad = new THREE.Mesh(radGeo, darkMetalMat);
  rad.position.set(-1.05, 0.82, 0);
  roverGroup.add(rad);

  // 8. Soviet Pennant Emblem Plaque
  const plaqueGeo = new THREE.BoxGeometry(0.02, 0.14, 0.22);
  const plaqueMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b, // Archival Soviet Red
    roughness: 0.3,
    metalness: 0.6
  });
  const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
  plaque.position.set(1.06, 0.85, 0);
  roverGroup.add(plaque);

  // 9. Wheel Tread Tracks in Regolith (Behind the rover)
  const trackGeo = new THREE.PlaneGeometry(1.64, 4.5);
  trackGeo.rotateX(-Math.PI / 2);
  const trackCanvas = document.createElement('canvas');
  trackCanvas.width = 128;
  trackCanvas.height = 256;
  const tctx = trackCanvas.getContext('2d');
  tctx.fillStyle = 'rgba(0,0,0,0)';
  tctx.fillRect(0, 0, 128, 256);
  tctx.fillStyle = 'rgba(8, 10, 14, 0.65)'; // Disturbed dark subsurface basalt
  // Port wheel track
  tctx.fillRect(14, 0, 24, 256);
  // Starboard wheel track
  tctx.fillRect(90, 0, 24, 256);
  // Ruts pattern
  tctx.fillStyle = 'rgba(4, 5, 8, 0.85)';
  for (let y = 0; y < 256; y += 12) {
    tctx.fillRect(14, y, 24, 4);
    tctx.fillRect(90, y, 24, 4);
  }
  const trackTex = new THREE.CanvasTexture(trackCanvas);
  const trackMat = new THREE.MeshBasicMaterial({
    map: trackTex,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });
  const trackMesh = new THREE.Mesh(trackGeo, trackMat);
  trackMesh.position.set(-2.4, 0.015, 0);
  roverGroup.add(trackMesh);

  return roverGroup;
}
