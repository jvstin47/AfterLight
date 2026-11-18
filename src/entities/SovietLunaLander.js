/**
 * AFTERLIGHT — Soviet Luna Spacecraft & Pennant 3D Entity
 * Supports:
 * - Luna 9: First robotic soft landing with 4 flower-petal shields opened
 * - Luna 16/20/24: Robotic soil core drill & spherical ascent return stage
 * - Luna 2: First human impact site with pentagonal USSR emblem debris field
 */

import * as THREE from 'three';

export function createSovietLunaLander(elevationFn = (x, z) => 0, options = {}) {
  const {
    posX = 0,
    posZ = 0,
    rotationY = 0,
    type = 'luna-9' // 'luna-9' | 'luna-16' | 'luna-2'
  } = options;

  const lunaGroup = new THREE.Group();
  lunaGroup.name = `soviet-${type}`;
  lunaGroup.userData = {
    artifactId: type,
    name: type === 'luna-9' ? 'Luna 9 (Луна-9)' : (type === 'luna-16' ? 'Luna 16 (Луна-16)' : 'Luna 2 (Луна-2)'),
    nation: 'Soviet Union (USSR)'
  };

  // Hit target
  const hitGeo = new THREE.SphereGeometry(2.0, 12, 10);
  hitGeo.translate(0, 1.0, 0);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const hitMesh = new THREE.Mesh(hitGeo, hitMat);
  hitMesh.name = `hit-target-${type}`;
  hitMesh.userData = { ...lunaGroup.userData, isHitProxy: true };
  lunaGroup.add(hitMesh);

  // Surface placement
  const posY = elevationFn(posX, posZ);
  lunaGroup.position.set(posX, posY, posZ);
  lunaGroup.rotation.y = rotationY;

  const metallicMat = new THREE.MeshStandardMaterial({
    color: 0x8f98a3,
    roughness: 0.35,
    metalness: 0.9
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x181c22,
    roughness: 0.6,
    metalness: 0.8
  });

  const redEmblemMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.3,
    metalness: 0.7
  });

  if (type === 'luna-9') {
    // Luna 9: Spherical core capsule (58 cm diameter)
    const sphereGeo = new THREE.SphereGeometry(0.38, 16, 14);
    const sphere = new THREE.Mesh(sphereGeo, metallicMat);
    sphere.position.y = 0.35;
    sphere.castShadow = true;
    lunaGroup.add(sphere);

    // 4 Petal Shields opened outward like a flower
    for (let p = 0; p < 4; p++) {
      const angle = (p * Math.PI) / 2;
      const petalGeo = new THREE.BoxGeometry(0.48, 0.02, 0.35);
      petalGeo.rotateZ(THREE.MathUtils.degToRad(-35));
      const petal = new THREE.Mesh(petalGeo, metallicMat);
      petal.position.set(Math.cos(angle) * 0.42, 0.14, Math.sin(angle) * 0.42);
      petal.rotation.y = angle;
      petal.castShadow = true;
      lunaGroup.add(petal);
    }

    // 4 Spring-Loaded Whip Antennas
    for (let a = 0; a < 4; a++) {
      const aAngle = (a * Math.PI) / 2 + Math.PI / 4;
      const antGeo = new THREE.CylinderGeometry(0.005, 0.005, 1.1, 6);
      antGeo.rotateZ(THREE.MathUtils.degToRad(35));
      const ant = new THREE.Mesh(antGeo, metallicMat);
      ant.position.set(Math.cos(aAngle) * 0.35, 0.82, Math.sin(aAngle) * 0.35);
      ant.rotation.y = aAngle;
      lunaGroup.add(ant);
    }

    // Central Cycloramic Mirror Turret (The mechanical eye that took the first surface photo)
    const turretGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.28, 10);
    const turret = new THREE.Mesh(turretGeo, darkMat);
    turret.position.y = 0.82;
    lunaGroup.add(turret);

  } else if (type === 'luna-16' || type === 'luna-20' || type === 'luna-24') {
    // Luna 16: Cylindrical 4-legged descent stage
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.95, 12);
    const base = new THREE.Mesh(baseGeo, metallicMat);
    base.position.y = 0.85;
    base.castShadow = true;
    lunaGroup.add(base);

    // 4 Landing Struts
    for (let l = 0; l < 4; l++) {
      const lAngle = (l * Math.PI) / 2;
      const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.4, 6);
      legGeo.rotateZ(Math.PI / 6);
      const leg = new THREE.Mesh(legGeo, darkMat);
      leg.position.set(Math.cos(lAngle) * 1.35, 0.55, Math.sin(lAngle) * 1.35);
      leg.rotation.y = lAngle;
      lunaGroup.add(leg);
    }

    // Spherical Sample Return Ascent Capsule on Top
    const ascGeo = new THREE.SphereGeometry(0.48, 16, 14);
    const asc = new THREE.Mesh(ascGeo, metallicMat);
    asc.position.y = 1.82;
    asc.castShadow = true;
    lunaGroup.add(asc);

    // Drilling Arm for regolith core sampling
    const drillArmGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.1, 6);
    drillArmGeo.rotateZ(THREE.MathUtils.degToRad(-45));
    const drillArm = new THREE.Mesh(drillArmGeo, darkMat);
    drillArm.position.set(0.85, 0.65, 0.35);
    lunaGroup.add(drillArm);

  } else {
    // Luna 2: Impact Crater with scattered explosive pentagonal pennants
    const scarGeo = new THREE.CylinderGeometry(4.5, 0.1, 0.8, 24, 1, true);
    const scarMat = new THREE.MeshStandardMaterial({
      color: 0x06080b, // Dark disturbed ejecta
      roughness: 0.95
    });
    const scar = new THREE.Mesh(scarGeo, scarMat);
    scar.position.y = 0.02;
    scar.receiveShadow = true;
    lunaGroup.add(scar);

    // Scattered pentagonal steel pennants
    for (let i = 0; i < 18; i++) {
      const dist = 0.8 + Math.random() * 3.5;
      const pAngle = Math.random() * Math.PI * 2;
      const pennantGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.005, 5); // Pentagonal disk
      const pennant = new THREE.Mesh(pennantGeo, metallicMat);
      pennant.position.set(Math.cos(pAngle) * dist, 0.04, Math.sin(pAngle) * dist);
      pennant.rotation.x = (Math.random() - 0.5) * 0.4;
      pennant.rotation.z = (Math.random() - 0.5) * 0.4;
      lunaGroup.add(pennant);
    }
  }

  return lunaGroup;
}
