/**
 * AFTERLIGHT — Cinematic 3D Spline Path & Camera Choreography Engine
 * Evaluates smooth, collision-free Catmull-Rom / Bézier camera paths
 * across Statio Cognitum with terrain elevation clamping.
 */

import * as THREE from 'three';

export class SplinePathEngine {
  /**
   * @param {Function} elevationFn (x, z) => ground elevation in meters
   */
  constructor(elevationFn = () => 0) {
    this.elevationFn = elevationFn;
    this.minGroundClearance = 1.65; // Astronaut eye-level minimum height (1.65m)
  }

  /**
   * Builds an optimized 3D curved trajectory between start and destination
   * @param {THREE.Vector3} startPos 
   * @param {THREE.Vector3} endPos 
   * @param {THREE.Vector3} startTarget 
   * @param {THREE.Vector3} endTarget 
   * @returns {{
   *   positionCurve: THREE.CatmullRomCurve3,
   *   targetCurve: THREE.LineCurve3,
   *   sampleAt: (t: number) => { position: THREE.Vector3, target: THREE.Vector3 }
   * }}
   */
  createTrajectory(startPos, endPos, startTarget, endTarget) {
    const p0 = startPos.clone();
    const p3 = endPos.clone();

    const distance = p0.distanceTo(p3);
    const midPoint = new THREE.Vector3().addVectors(p0, p3).multiplyScalar(0.5);

    // Sample terrain along trajectory to ensure camera clearance over crater rims
    const samples = [0.25, 0.5, 0.75];
    let maxGroundY = -Infinity;

    for (const t of samples) {
      const sx = THREE.MathUtils.lerp(p0.x, p3.x, t);
      const sz = THREE.MathUtils.lerp(p0.z, p3.z, t);
      const gy = this.elevationFn(sx, sz);
      if (gy > maxGroundY) maxGroundY = gy;
    }

    // Dynamic flight arc height based on distance and intermediate topography
    const arcLift = Math.max(
      4.0,
      Math.min(35.0, distance * 0.12),
      maxGroundY + 5.0 - midPoint.y
    );

    // Create intermediate control points for a smooth Catmull-Rom arc
    const cp1 = new THREE.Vector3(
      THREE.MathUtils.lerp(p0.x, p3.x, 0.3),
      Math.max(p0.y, p3.y) + arcLift * 0.7,
      THREE.MathUtils.lerp(p0.z, p3.z, 0.3)
    );

    const cp2 = new THREE.Vector3(
      THREE.MathUtils.lerp(p0.x, p3.x, 0.7),
      Math.max(p0.y, p3.y) + arcLift * 0.85,
      THREE.MathUtils.lerp(p0.z, p3.z, 0.7)
    );

    // Ensure control points clear terrain
    cp1.y = Math.max(cp1.y, this.elevationFn(cp1.x, cp1.z) + this.minGroundClearance + 3.0);
    cp2.y = Math.max(cp2.y, this.elevationFn(cp2.x, cp2.z) + this.minGroundClearance + 3.0);

    const pathPoints = [p0, cp1, cp2, p3];
    const positionCurve = new THREE.CatmullRomCurve3(pathPoints, false, 'centripetal', 0.5);

    return {
      positionCurve,
      sampleAt: (t) => {
        // Quintic smoothstep easing for cinematic momentum
        const easeT = t * t * t * (t * (t * 6 - 15) + 10);
        const pos = positionCurve.getPoint(easeT);

        // Enforce physical terrain collision clamping
        const groundY = this.elevationFn(pos.x, pos.z);
        if (pos.y < groundY + this.minGroundClearance) {
          pos.y = groundY + this.minGroundClearance;
        }

        const target = new THREE.Vector3(
          THREE.MathUtils.lerp(startTarget.x, endTarget.x, easeT),
          THREE.MathUtils.lerp(startTarget.y, endTarget.y, easeT),
          THREE.MathUtils.lerp(startTarget.z, endTarget.z, easeT)
        );

        return { position: pos, target };
      }
    };
  }
}
