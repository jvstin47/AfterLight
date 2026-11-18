/**
 * AFTERLIGHT — JAXA SLIM & SORA-Q (LEV-2) 3D Entity
 * Features:
 * - SLIM (Smart Lander for Investigating Moon): The historic 3-meter pinpoint landing
 * - Documented in situ posture: Tipped forward nose-down on the 15° Shioli crater slope
 * - SORA-Q (LEV-2): 8 cm transformable spherical mini-rover deployed on regolith
 * - Ceramic white thermal insulation & high-strength aluminum landing shock absorbers
 */

import * as THREE from 'three';

export function createSLIMSoraQ(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = THREE.MathUtils.degToRad(-15)
  } = options;

  const slimGroup = new THREE.Group();
  slimGroup.name = 'jaxa-slim-sora-q';
  slimGroup.userData = {
    artifactId: 'slim-sora-q',
    name: 'SLIM & SORA-Q (Smart Lander for Investigating Moon / LEV-2)',
    nation: 'Japan (JAXA)',
    mass: '200 kg (SLIM dry) / 250 g (SORA-Q)',
    location: 'Shioli Crater Slope (13.3160° S, 25.2510° E)'
  };

  // Raycasting hit target
  const hitGeo = new THREE.BoxGeometry(2.5, 2.0, 2.0);
  hitGeo.translate(0, 1.0, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = 'hit-target-slim';
  hitMesh.userData = { ...slimGroup.userData, isHitProxy: true };
  slimGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  slimGroup.position.set(posX, posY, posZ);
  slimGroup.rotation.y = rotationY;

  // Materials
  const ceramicWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xedf0f5, // Ceramic high-albedo white insulation
    roughness: 0.35,
    metalness: 0.15
  });

  const goldKaptonMat = new THREE.MeshStandardMaterial({
    color: 0xd4a044,
    roughness: 0.25,
    metalness: 0.92
  });

  const blackSolarMat = new THREE.MeshStandardMaterial({
    color: 0x142033,
    roughness: 0.2,
    metalness: 0.85
  });

  const silverMetalMat = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    roughness: 0.4,
    metalness: 0.9
  });

  // 1. SLIM Lander Body (Resting in authentic inverted nose-down angle)
  const landerBody = new THREE.Group();
  landerBody.position.set(0, 0.72, 0);

  // Main polygonal prism hull (2.4m tall, 1.7m wide)
  const bodyGeo = new THREE.BoxGeometry(1.6, 2.2, 1.4);
  const body = new THREE.Mesh(bodyGeo, ceramicWhiteMat);
  body.castShadow = true;
  body.receiveShadow = true;
  landerBody.add(body);

  // Solar cells on top face
  const solarGeo = new THREE.BoxGeometry(1.5, 0.02, 1.3);
  const solar = new THREE.Mesh(solarGeo, blackSolarMat);
  solar.position.y = 1.11;
  landerBody.add(solar);

  // Ceramic shock absorber crushable landing legs
  const leg1Geo = new THREE.CylinderGeometry(0.08, 0.12, 0.85, 8);
  const leg1 = new THREE.Mesh(leg1Geo, silverMetalMat);
  leg1.position.set(-0.85, 0.95, 0.55);
  leg1.rotation.z = Math.PI / 4;
  landerBody.add(leg1);

  const leg2 = leg1.clone();
  leg2.position.set(0.85, 0.95, -0.55);
  leg2.rotation.z = -Math.PI / 4;
  landerBody.add(leg2);

  // 2-step landing thruster bells (500N ceramic apogee engines)
  const engineGeo = new THREE.ConeGeometry(0.22, 0.45, 12, 1, true);
  const engine = new THREE.Mesh(engineGeo, silverMetalMat);
  engine.position.set(0, -1.25, 0);
  landerBody.add(engine);

  // Authentic 90° / 110° inverted nose-down resting orientation
  landerBody.rotation.x = THREE.MathUtils.degToRad(110);
  landerBody.rotation.z = THREE.MathUtils.degToRad(-15);
  slimGroup.add(landerBody);

  // 2. SORA-Q (LEV-2) Mini-Rover (8 cm transformable sphere on regolith)
  const soraQGroup = new THREE.Group();
  soraQGroup.position.set(3.2, 0.08, 1.4); // 3 meters in front of SLIM where it took the famous photo
  soraQGroup.name = 'sora-q-mini-rover';

  // Left & Right rolling hemisphere wheels
  const hemiLGeo = new THREE.SphereGeometry(0.065, 12, 10, 0, Math.PI);
  hemiLGeo.rotateY(Math.PI / 2);
  const hemiL = new THREE.Mesh(hemiLGeo, silverMetalMat);
  hemiL.position.set(0, 0, 0.06);
  soraQGroup.add(hemiL);

  const hemiR = hemiL.clone();
  hemiR.rotation.y = Math.PI;
  hemiR.position.set(0, 0, -0.06);
  soraQGroup.add(hemiR);

  // Stabilizer tail
  const tailGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6);
  tailGeo.rotateX(Math.PI / 3);
  const tail = new THREE.Mesh(tailGeo, silverMetalMat);
  tail.position.set(-0.08, 0.04, 0);
  soraQGroup.add(tail);

  // Camera lens eye pointed at SLIM
  const soraLensGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.04, 8);
  soraLensGeo.rotateZ(Math.PI / 2);
  const soraLens = new THREE.Mesh(soraLensGeo, goldKaptonMat);
  soraLens.position.set(0.06, 0.03, 0);
  soraQGroup.add(soraLens);

  slimGroup.add(soraQGroup);

  return slimGroup;
}
