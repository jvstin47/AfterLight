/**
 * AFTERLIGHT — Spatial Projector & In-Scene Archival Plates
 * Projects authentic 70mm Hasselblad photographs and mission telemetry
 * directly onto physical 3D planes floating in Statio Cognitum.
 */

import * as THREE from 'three';
import { assetManager } from '../core/AssetManager.js';
import { eventBus } from '../core/EventBus.js';
import { ARTIFACTS } from '../data/artifactsData.js';

export class SpatialProjector {
  /**
   * @param {THREE.Scene} scene 
   * @param {Function} elevationFn (x, z) => ground elevation in meters
   */
  constructor(scene, elevationFn = () => 0) {
    this.scene = scene;
    this.elevationFn = elevationFn;
    this.group = new THREE.Group();
    this.group.name = 'spatial-archival-projector';
    this.plates = [];

    this.scene.add(this.group);
    this.initPlates();
  }

  async initPlates() {
    const exhibits = [
      {
        artifactId: 'lm-intrepid',
        pos: { x: 5.2, z: 5.4 },
        yOffset: 2.1,
        width: 2.8,
        height: 2.1,
        imageSrc: '/assets/photography/intrepid_lm/AS12-47-6913_Conrad_MESA_Lunar_Module.jpg',
        plateId: 'AS12-47-6913',
        title: 'MESA EXTRACTION // LM-6 INTREPID',
        subtitle: 'Pete Conrad deploying modular equipment stowage assembly'
      },
      {
        artifactId: 'surveyor-3',
        pos: { x: 74.8, z: 147.2 },
        yOffset: 1.8,
        width: 2.7,
        height: 2.0,
        imageSrc: '/assets/photography/surveyor_3_rendezvous/AS12-48-7133_Conrad_Examining_Surveyor_Camera.jpg',
        plateId: 'AS12-48-7133',
        title: 'SURVEYOR III RENDEZVOUS',
        subtitle: 'Pete Conrad inspecting severed vidicon TV camera struts'
      },
      {
        artifactId: 'alsep',
        pos: { x: -101.5, z: -71.5 },
        yOffset: 1.7,
        width: 2.7,
        height: 2.0,
        imageSrc: '/assets/photography/alsep_deployment/AS12-46-6807_Bean_Carrying_ALSEP_Pallets.jpg',
        plateId: 'AS12-46-6807',
        title: 'ALSEP ARRAY DEPLOYMENT',
        subtitle: 'Alan Bean carrying ALSEP pallets to 130m station zone'
      }
    ];

    for (const ex of exhibits) {
      try {
        const plateMesh = await this.createExhibitionPlate(ex);
        this.group.add(plateMesh);
        this.plates.push(plateMesh);
      } catch (err) {
        console.warn('[SpatialProjector] Failed to load plate for', ex.plateId, err);
      }
    }
  }

  /**
   * Generates a museum-grade archival exhibition plate with Reseau ticks and metadata
   */
  async createExhibitionPlate(config) {
    const plateGroup = new THREE.Group();
    plateGroup.name = `archival-plate-${config.artifactId}`;

    const groundY = this.elevationFn(config.pos.x, config.pos.z);
    plateGroup.position.set(config.pos.x, groundY + config.yOffset, config.pos.z);

    // 1. Generate composite texture with authentic photograph, Reseau ticks, and typography
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');

    // Deep museum obsidian background
    ctx.fillStyle = '#020407';
    ctx.fillRect(0, 0, 1024, 768);

    // Frame border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, 992, 736);

    // Reseau fiducial crosses (+) in the 4 corners
    const ticks = [[32, 32], [992, 32], [32, 736], [992, 736], [512, 384]];
    ctx.strokeStyle = '#c99738';
    ctx.lineWidth = 2;
    for (const [tx, ty] of ticks) {
      ctx.beginPath();
      ctx.moveTo(tx - 8, ty);
      ctx.lineTo(tx + 8, ty);
      ctx.moveTo(tx, ty - 8);
      ctx.lineTo(tx, ty + 8);
      ctx.stroke();
    }

    // Load and draw the authentic NASA photograph into the plate
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = config.imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue if offline
      });

      if (img.width > 0) {
        // Draw photo with 1:1 aspect fit inside top area
        ctx.drawImage(img, 36, 36, 952, 576);
      }
    } catch (e) {
      // Graceful fallback to dark preview
    }

    // Archival metadata typography ribbon at bottom of plate
    ctx.fillStyle = '#06090f';
    ctx.fillRect(36, 616, 952, 116);
    ctx.strokeStyle = 'rgba(201, 151, 56, 0.35)';
    ctx.strokeRect(36, 616, 952, 116);

    ctx.font = '500 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#c99738';
    ctx.fillText(`${config.plateId} // NASA ARCHIVAL RECORD`, 56, 650);

    ctx.font = '600 24px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#f0efe9';
    ctx.fillText(config.title, 56, 684);

    ctx.font = '400 17px Inter, -apple-system, sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(config.subtitle.toUpperCase(), 56, 712);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;

    const plateGeo = new THREE.PlaneGeometry(config.width, config.height);
    const plateMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });

    const mesh = new THREE.Mesh(plateGeo, plateMat);
    mesh.name = `plate-screen-${config.artifactId}`;
    mesh.userData = {
      artifactId: config.artifactId,
      isArchivalPlate: true
    };
    plateGroup.add(mesh);

    // 2. Ground Anchor Stem: Fine vertical hairline connecting plate to regolith
    const stemHeight = config.yOffset;
    const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, stemHeight, 8);
    const stemMat = new THREE.MeshBasicMaterial({
      color: 0xc99738,
      transparent: true,
      opacity: 0.45
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    stemMesh.position.set(0, -config.yOffset / 2, 0);
    plateGroup.add(stemMesh);

    // Ground anchor fiducial ring
    const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, stemMat);
    ringMesh.position.set(0, -config.yOffset, 0);
    plateGroup.add(ringMesh);

    // Attach reference metadata for distance-based fading
    plateGroup.userData = {
      artifactId: config.artifactId,
      plateMaterial: plateMat,
      stemMaterial: stemMat,
      worldPos: new THREE.Vector3(config.pos.x, groundY + config.yOffset, config.pos.z)
    };

    return plateGroup;
  }

  /**
   * Updates plate orientation and distance-based alpha fading
   * @param {THREE.Camera} camera 
   */
  update(camera) {
    if (!camera) return;
    const camPos = camera.position;

    for (const plate of this.plates) {
      const uData = plate.userData;
      if (!uData || !uData.plateMaterial) continue;

      // Smooth billboarding around vertical axis so text is clearly legible
      plate.lookAt(camPos.x, plate.position.y, camPos.z);

      // Distance-based proximity fading
      const dist = plate.position.distanceTo(camPos);

      let alpha = 0.0;
      if (dist < 75.0) {
        if (dist > 25.0) {
          // Fade in between 75m and 25m
          alpha = (75.0 - dist) / (75.0 - 25.0);
        } else if (dist >= 3.0) {
          // Full visibility between 25m and 3m
          alpha = 1.0;
        } else {
          // Gentle fade if visitor stands directly inside plate
          alpha = Math.max(0.2, (dist - 1.0) / 2.0);
        }
      }

      uData.plateMaterial.opacity = alpha * 0.95;
      uData.stemMaterial.opacity = alpha * 0.45;
      plate.visible = alpha > 0.02;
    }
  }

  dispose() {
    for (const plate of this.plates) {
      plate.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
    }
    this.scene.remove(this.group);
  }
}
