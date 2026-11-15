/**
 * AFTERLIGHT — Surface Equipment, US Flag & Discarded Hardware
 * Recreates the deployed flag and jettisoned PLSS backpacks at the Apollo 12 site.
 */

import * as THREE from 'three';

export function createFlagAndEquipment(elevationFn) {
  const equipGroup = new THREE.Group();
  equipGroup.name = 'surface-equipment-and-flag';

  // 1. United States Lunar Surface Flag (7 meters south of Intrepid)
  const flagX = 0;
  const flagZ = 7.0;
  const flagY = elevationFn(flagX, flagZ);

  const flagSubGroup = new THREE.Group();
  flagSubGroup.position.set(flagX, flagY, flagZ);

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
  flagSubGroup.add(staff);

  // Horizontal top spreader arm (length 1.5m)
  const spreaderGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.45, 6);
  spreaderGeo.rotateZ(Math.PI / 2);
  const spreader = new THREE.Mesh(spreaderGeo, staffMat);
  spreader.position.set(0.72, 1.95, 0);
  flagSubGroup.add(spreader);

  // 3x5 ft Flag Fabric (crinkled / undulating)
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
  flagSubGroup.add(flagMesh);

  equipGroup.add(flagSubGroup);

  // 2. Discarded Portable Life Support System (PLSS) Backpacks
  // Conrad and Bean kicked them out the forward hatch onto the regolith below the ladder
  const plssGroup = new THREE.Group();
  const plssX = 2.4;
  const plssZ = 2.2;
  const plssY = elevationFn(plssX, plssZ);
  plssGroup.position.set(plssX, plssY, plssZ);

  const plssMat = new THREE.MeshStandardMaterial({
    color: 0xd8dade,
    roughness: 0.55,
    metalness: 0.2
  });
  const valveMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.3,
    metalness: 0.8
  });

  // PLSS Unit 1 (Pete Conrad)
  const plssGeo1 = new THREE.BoxGeometry(0.55, 0.24, 0.68);
  const plss1 = new THREE.Mesh(plssGeo1, plssMat);
  plss1.position.set(0, 0.12, 0);
  plss1.rotation.y = 0.45;
  plss1.castShadow = true;
  plssGroup.add(plss1);

  // PLSS Unit 2 (Alan Bean)
  const plss2 = new THREE.Mesh(plssGeo1, plssMat);
  plss2.position.set(0.65, 0.12, 0.25);
  plss2.rotation.y = -0.3;
  plss2.rotation.z = 0.1;
  plss2.castShadow = true;
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
  plssGroup.add(boot1);

  const boot2 = new THREE.Mesh(bootGeo, bootMat);
  boot2.position.set(-0.25, 0.06, 0.5);
  boot2.rotation.y = 0.6;
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

