/**
 * AFTERLIGHT — Surface Equipment, US Flag, SWC Experiment & TV Camera
 * Recreates the deployed flag, Solar Wind Composition (SWC) foil,
 * Westinghouse Lunar Surface TV Camera, and jettisoned PLSS backpacks at Statio Cognitum.
 */

import * as THREE from 'three';

export function createFlagAndEquipment(elevationFn) {
  const equipGroup = new THREE.Group();
  equipGroup.name = 'surface-equipment-and-flag';

  // 1. United States Lunar Surface Flag (7 meters south of Intrepid: X=0, Z=7.0)
  const flagX = 0;
  const flagZ = 7.0;
  const flagY = elevationFn(flagX, flagZ);

  const flagSubGroup = new THREE.Group();
  flagSubGroup.name = 'us-flag-assembly';
  flagSubGroup.position.set(flagX, flagY, flagZ);
  flagSubGroup.userData = { artifactId: 'us-flag' };

  // Vertical staff (height 2.0m, diameter 2.5cm)
  const staffGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.0, 8);
  const staffMat = new THREE.MeshStandardMaterial({
    color: 0xd0d5dd,
    roughness: 0.3,
    metalness: 0.9
  });
  const staff = new THREE.Mesh(staffGeo, staffMat);
  staff.position.y = 1.0;
  staff.castShadow = true;
  staff.userData = { artifactId: 'us-flag' };
  flagSubGroup.add(staff);

  // Horizontal top spreader arm (length 1.5m)
  const spreaderGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.45, 6);
  spreaderGeo.rotateZ(Math.PI / 2);
  const spreader = new THREE.Mesh(spreaderGeo, staffMat);
  spreader.position.set(0.72, 1.95, 0);
  spreader.userData = { artifactId: 'us-flag' };
  flagSubGroup.add(spreader);

  // 3x5 ft Flag Fabric (crinkled / undulating with authentic ripple)
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 512;
  flagCanvas.height = 320;
  const fctx = flagCanvas.getContext('2d');

  // Red and white stripes
  const stripeH = 320 / 13;
  for (let i = 0; i < 13; i++) {
    fctx.fillStyle = i % 2 === 0 ? '#b22234' : '#ffffff';
    fctx.fillRect(0, i * stripeH, 512, stripeH);
  }

  // Blue canton
  fctx.fillStyle = '#3c3b6e';
  fctx.fillRect(0, 0, 205, stripeH * 7);

  // White star points
  fctx.fillStyle = '#ffffff';
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      fctx.fillRect(18 + c * 32, 12 + r * 30, 4, 4);
    }
  }

  const flagTexture = new THREE.CanvasTexture(flagCanvas);
  const flagGeo = new THREE.PlaneGeometry(1.4, 0.88, 16, 8);

  // Apply subtle crinkle displacement
  const fPos = flagGeo.attributes.position;
  for (let i = 0; i < fPos.count; i++) {
    const fx = fPos.getX(i);
    const wave = Math.sin(fx * 7.0) * 0.05 + Math.cos(fx * 12.0) * 0.02;
    fPos.setZ(i, wave);
  }
  flagGeo.computeVertexNormals();

  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTexture,
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const flagMesh = new THREE.Mesh(flagGeo, flagMat);
  flagMesh.position.set(0.7, 1.48, 0);
  flagMesh.castShadow = true;
  flagMesh.userData = { artifactId: 'us-flag' };
  flagSubGroup.add(flagMesh);

  // Flag Raycast Hit Proxy
  const flagHitGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.2, 8);
  const flagHitMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: true });
  const flagHit = new THREE.Mesh(flagHitGeo, flagHitMat);
  flagHit.position.y = 1.1;
  flagHit.userData = { artifactId: 'us-flag', isHitProxy: true };
  flagSubGroup.add(flagHit);

  equipGroup.add(flagSubGroup);

  // 2. Solar Wind Composition (SWC) Experiment (5 meters North of Intrepid: X=0, Z=-5.2)
  // High-purity platinum/aluminum foil sheet (0.3m x 1.3m) on a telescopic staff
  const swcX = 0;
  const swcZ = -5.2;
  const swcY = elevationFn(swcX, swcZ);

  const swcGroup = new THREE.Group();
  swcGroup.name = 'swc-experiment-assembly';
  swcGroup.position.set(swcX, swcY, swcZ);
  swcGroup.userData = { artifactId: 'swc-experiment' };

  // Telescopic staff
  const swcStaffGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.6, 6);
  const swcStaff = new THREE.Mesh(swcStaffGeo, staffMat);
  swcStaff.position.y = 0.8;
  swcStaff.castShadow = true;
  swcStaff.userData = { artifactId: 'swc-experiment' };
  swcGroup.add(swcStaff);

  // Cross reel at top
  const reelGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.38, 8);
  reelGeo.rotateZ(Math.PI / 2);
  const reel = new THREE.Mesh(reelGeo, staffMat);
  reel.position.y = 1.55;
  reel.userData = { artifactId: 'swc-experiment' };
  swcGroup.add(reel);

  // Specular unrolled aluminum foil sheet
  const foilGeo = new THREE.PlaneGeometry(0.32, 1.15, 6, 8);
  const foilMat = new THREE.MeshStandardMaterial({
    color: 0xebf0f8,
    roughness: 0.15,
    metalness: 0.95,
    side: THREE.DoubleSide
  });
  const foilMesh = new THREE.Mesh(foilGeo, foilMat);
  foilMesh.position.set(0, 0.95, 0.02);
  foilMesh.castShadow = true;
  foilMesh.userData = { artifactId: 'swc-experiment' };
  swcGroup.add(foilMesh);

  // SWC Hit Proxy
  const swcHitGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 8);
  const swcHit = new THREE.Mesh(swcHitGeo, flagHitMat);
  swcHit.position.y = 0.9;
  swcHit.userData = { artifactId: 'swc-experiment', isHitProxy: true };
  swcGroup.add(swcHit);

  equipGroup.add(swcGroup);

  // 3. Westinghouse Lunar Surface Color TV Camera on Tripod (14m NW: X=-10.5, Z=-9.5)
  const tvX = -10.5;
  const tvZ = -9.5;
  const tvY = elevationFn(tvX, tvZ);

  const tvGroup = new THREE.Group();
  tvGroup.name = 'surface-tv-camera-assembly';
  tvGroup.position.set(tvX, tvY, tvZ);
  tvGroup.userData = { artifactId: 'surface-tv-camera' };

  // Tripod legs
  const legGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.1, 6);
  const legMat = new THREE.MeshStandardMaterial({
    color: 0xc8ced6,
    roughness: 0.4,
    metalness: 0.8
  });
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(legGeo, legMat);
    const angle = (i * 2 * Math.PI) / 3;
    leg.position.set(Math.cos(angle) * 0.28, 0.48, Math.sin(angle) * 0.28);
    leg.rotation.z = 0.28;
    leg.rotation.y = angle;
    leg.castShadow = true;
    leg.userData = { artifactId: 'surface-tv-camera' };
    tvGroup.add(leg);
  }

  // Camera Body (Gold-wrapped cylinder + black lens barrel)
  const camBodyGeo = new THREE.BoxGeometry(0.24, 0.22, 0.38);
  const camBodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37, // Gold Kapton thermal wrap
    roughness: 0.35,
    metalness: 0.85
  });
  const camBody = new THREE.Mesh(camBodyGeo, camBodyMat);
  camBody.position.y = 1.05;
  camBody.castShadow = true;
  camBody.userData = { artifactId: 'surface-tv-camera' };
  tvGroup.add(camBody);

  // Black optical lens
  const lensGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.18, 12);
  lensGeo.rotateX(Math.PI / 2);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x121418,
    roughness: 0.2,
    metalness: 0.9
  });
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.set(0, 1.05, 0.24);
  lens.castShadow = true;
  lens.userData = { artifactId: 'surface-tv-camera' };
  tvGroup.add(lens);

  // TV Camera Hit Proxy
  const tvHitGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 8);
  const tvHit = new THREE.Mesh(tvHitGeo, flagHitMat);
  tvHit.position.y = 0.8;
  tvHit.userData = { artifactId: 'surface-tv-camera', isHitProxy: true };
  tvGroup.add(tvHit);

  equipGroup.add(tvGroup);

  // 4. Discarded Portable Life Support System (PLSS) Backpacks & Overshoes
  // Conrad and Bean kicked them out the forward hatch onto the regolith below the ladder
  const plssGroup = new THREE.Group();
  const plssX = 2.4;
  const plssZ = 2.2;
  const plssY = elevationFn(plssX, plssZ);
  plssGroup.position.set(plssX, plssY, plssZ);
  plssGroup.userData = { artifactId: 'us-flag' };

  const plssMat = new THREE.MeshStandardMaterial({
    color: 0xd8dade,
    roughness: 0.55,
    metalness: 0.2
  });

  // PLSS Unit 1 (Pete Conrad)
  const plssGeo1 = new THREE.BoxGeometry(0.55, 0.24, 0.68);
  const plss1 = new THREE.Mesh(plssGeo1, plssMat);
  plss1.position.set(0, 0.12, 0);
  plss1.rotation.y = 0.45;
  plss1.castShadow = true;
  plss1.userData = { artifactId: 'us-flag' };
  plssGroup.add(plss1);

  // PLSS Unit 2 (Alan Bean)
  const plss2 = new THREE.Mesh(plssGeo1, plssMat);
  plss2.position.set(0.65, 0.12, 0.25);
  plss2.rotation.y = -0.3;
  plss2.rotation.z = 0.1;
  plss2.castShadow = true;
  plss2.userData = { artifactId: 'us-flag' };
  plssGroup.add(plss2);

  // Discarded lunar overshoes (boots)
  const bootGeo = new THREE.BoxGeometry(0.18, 0.12, 0.35);
  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x24272e,
    roughness: 0.9,
    metalness: 0.0
  });
  const boot1 = new THREE.Mesh(bootGeo, bootMat);
  boot1.position.set(-0.4, 0.06, 0.2);
  boot1.userData = { artifactId: 'us-flag' };
  plssGroup.add(boot1);

  const boot2 = new THREE.Mesh(bootGeo, bootMat);
  boot2.position.set(-0.25, 0.06, 0.5);
  boot2.rotation.y = 0.6;
  boot2.userData = { artifactId: 'us-flag' };
  plssGroup.add(boot2);

  equipGroup.add(plssGroup);

  return equipGroup;
}

export class FlagAndEquipment {
  constructor(scene, elevationFn = () => 0) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.group = null;
  }

  init() {
    this.group = createFlagAndEquipment(this.elevationFn);
    if (this.scene && this.group) {
      this.scene.add(this.group);
    }
    return this.group;
  }

  dispose() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
  }
}
