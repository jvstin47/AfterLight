# AFTERLIGHT — PHASE 04.1: IMPLEMENTATION AUDIT & SOURCE CODE VERIFICATION

**Project:** AFTERLIGHT — The Living Archival Monument  
**Landing Site:** Statio Cognitum (Apollo 12)  
**Lunar Coordinates:** $3.01239^\circ\text{ S}, 23.42157^\circ\text{ W}$  
**Audit Date:** November 17, 2026  
**Auditor:** Scientific Research & Technical Review Specialist

---

## 1. Executive Summary & Audit Mandate

This document provides a line-by-line, component-by-component audit of the actual codebase implementations delivered in Phase 04. The mandate of Phase 04.1 is to establish absolute empirical truth: distinguishing what has actually been executed in code and loaded in memory from what was merely planned, proposed, or incorrectly attributed in preliminary documentation.

---

## 2. Source Code Changes & Implementation Inventory

The following table summarizes all source files modified or introduced during Phase 04, their architectural function, and their empirical execution status:

| Source File | Primary Function | Changes Implemented | Asset Dependency Status | Code Execution Status |
| :--- | :--- | :--- | :--- | :--- |
| `src/scene/LunarLighting.js` | Celestial environment & directional lighting | Replaced 2D canvas backdrop with 3D Earth mesh ($1.90^\circ$ apparent diameter, custom GLSL Rayleigh limb shader), directional Sun disk ($0.533^\circ$, crisp shadow map), and 1,800-star field with solar glare suppression cone ($16^\circ$). | **100% Procedural in-memory code**; no external rasters or JSON tables loaded. | **VERIFIED & ACTIVE** |
| `src/scene/LunarTerrain.js` | Landing site topography & crater geometry | Evaluates analytical heightfield matching Surveyor Crater ($r=100\text{m}$, depth $15.5\text{m}$, wall slope $11.8^\circ$), Head, Bench, Middle Crescent, and Halo craters, plus $16\text{km}$ planetary curvature. | **Analytical math parameterized from USGS profile data**; does NOT load raw binary GeoTIFF DEM. | **VERIFIED & ACTIVE** |
| `src/scene/RegolithMaterial.js` | Mare regolith surface BRDF | Integrated directional Hapke opposition surge (*Heiligenschein*) backscatter (+28% surge within $4.5^\circ$ phase angle) and dual-frequency surface roughness in custom GLSL shader. | **Procedural shader math**; no external texture files required. | **VERIFIED & ACTIVE** |
| `src/entities/LunarModule.js` | LM-6 *Intrepid* descent stage | Added procedural crinkled Kapton MLI normal map, three $1.68\text{m}$ ground contact wands on Port, Starboard, and Aft footpads (ladder footpad omitted), and stainless steel commemorative plaque. | Builds on canonical NASA GLB model (`apollo_lunar_module.glb`). | **VERIFIED & ACTIVE** |
| `src/entities/Surveyor3.js` | *Surveyor 3* lander modifications | Modeled severed TV camera collar at $(-0.35, 1.35, 0.22)$ with 6061-T6 aluminum shear facets, soil sampler excavation trench, and UV photolysis discoloration. | Builds on canonical OBJ model (`surveyor_3_lander.obj`). | **VERIFIED & ACTIVE** |
| `src/entities/ALSEP.js` | Science package deployment | Configured five-instrument array: Central Station, SNAP-27 RTG with ribbon cabling, Passive Seismic Experiment with 10-sided Mylar skirt, Solar Wind Spectrometer, and Lunar Surface Magnetometer. | Uses authentic OBJ models and procedural supplementary geometries. | **VERIFIED & ACTIVE** |
| `src/ui/MissionStatsCard.js` | Telemetry & mission status HUD | Auto-hides on `dossier:opened` and `traverse:opened`; unhides on `dossier:closed`. | Pure UI logic; zero external assets. | **VERIFIED & ACTIVE** |
| `src/ui/NavRail.js` | Vertical navigation bar | Auto-hides on `dossier:opened` and `traverse:opened`; unhides on `dossier:closed`. | Pure UI logic; zero external assets. | **VERIFIED & ACTIVE** |
| `src/ui/dossier.css` | Artifact dossier styling & layout | Applied Inter and JetBrains Mono typography; adjusted z-index stacking to prevent modal clipping. | Standard CSS stylesheets. | **VERIFIED & ACTIVE** |

---

## 3. Detailed Component Audit

### 3.1 Celestial System (`src/scene/LunarLighting.js`)
- **Claimed in Phase 04 Catalog:** Acquired NASA Blue Marble PNG ($2048\times 1024$), MODIS Cloud Composite PNG, and Yale Bright Star JSON catalog.
- **Empirical Ground Truth:**
  - `createEarthGlobe()` uses an HTML5 `<canvas>` ($1024\times 512$) generated dynamically in memory via 2D canvas drawing routines (ellipses and quadratic bezier curves). No external PNG is loaded from disk or network.
  - Clouds are rendered procedurally onto the same canvas context using alpha-blended white arcs.
  - The starfield in `createStarfield()` generates 1,800 stars using pseudo-random spherical math (`Math.random()`), calculating Cartesian coordinates and assigning point sizes ($1.2\text{px} - 3.2\text{px}$) and alpha ($0.35 - 1.0$). No Hipparcos or Yale JSON file is parsed.
  - The Rayleigh scattering limb is **genuinely implemented** as a custom GLSL fragment shader patch in `MeshStandardMaterial.onBeforeCompile`:
    ```glsl
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float rim = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 3.8);
    float sunDot = max(0.0, dot(sunDir, vNormal));
    gl_FragColor.rgb += vec3(0.43, 0.75, 1.0) * rim * (sunDot * 0.9 + 0.1);
    ```
- **Audit Conclusion:** The celestial subsystem is mathematically and physically disciplined in its coordinate geometry and shader dynamics, but the asset attribution in the catalog was factually incorrect. It is a procedural reconstruction, not an asset-driven raster implementation.

### 3.2 Lunar Terrain System (`src/scene/LunarTerrain.js`)
- **Claimed in Phase 04 Catalog:** Integrated LROC NAC Digital Terrain Model (`NAC_DTM_APOLLO12`) raw DEM mesh and high-resolution orthophoto (`M114104427LE/RE`).
- **Empirical Ground Truth:**
  - `LunarTerrain.js` constructs a `PlaneGeometry(4000, 4000, 256, 256)`.
  - Vertex elevations are generated analytically by the `getElevation(x, z)` method.
  - The topography uses mathematical crater bowl functions parameterized from the USGS Preliminary Science Report profile:
    - Surveyor Crater: center $(163, 0)$, radius $100\text{m}$, depth $-15.5\text{m}$, inner wall slope $11.8^\circ$.
    - Head Crater: center $(-180, 80)$, radius $55\text{m}$, depth $-8.0\text{m}$.
    - Bench Crater: center $(280, -120)$, radius $45\text{m}$, depth $-6.5\text{m}$.
    - Middle Crescent Crater: center $(-220, -320)$, radius $110\text{m}$, depth $-12.0\text{m}$.
    - Halo Crater: center $(140, 110)$, radius $30\text{m}$, depth $-4.0\text{m}$.
  - Large-scale horizon includes a spherical drop term $-r^2 / (2 \times 1,737,400\text{m})$ simulating actual lunar curvature over a $16\text{km}$ radius.
  - The file `assets/terrain_and_cartography/lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg` exists on disk (232 KB GIMP-exported JPEG, $1024\times 576$), but is **not imported or bound** to the terrain mesh in `LunarTerrain.js`.
- **Audit Conclusion:** The terrain is a high-quality analytical mathematical model calibrated against USGS profile data. The claim that it directly loads a raw LROC DEM mesh or bound orthophoto is false.

### 3.3 Regolith Photometry (`src/scene/RegolithMaterial.js`)
- **Claimed in Phase 04 Catalog:** Hapke photometric opposition surge and dual-scale roughness.
- **Empirical Ground Truth:**
  - `RegolithMaterial.js` subclasses `MeshStandardMaterial` and injects custom GLSL code in `onBeforeCompile`.
  - Implements retro-reflective surge when the angle between the Sun vector and the camera view vector approaches zero ($\cos \alpha > 0.985$, or within $4.5^\circ$).
  - Correctly produces the lunar *Heiligenschein* retroreflective halo around the camera's line of sight when viewing down-sun.
- **Audit Conclusion:** Fully implemented, verified, and functioning exactly as claimed.

### 3.4 Spacecraft & Instrument Entities
- **LM-6 Intrepid (`src/entities/LunarModule.js`):**
  - Canonical NASA GLB loaded via `AssetManager`.
  - Wrinkled foil normal map generated procedurally via 2D canvas Perlin-like noise and applied to gold and silver MLI materials.
  - Contact sensing probes: 3 thin cylinder meshes ($r=0.015\text{m}, l=1.68\text{m}$) added below Port, Starboard, and Aft footpads, curved as if resting upon regolith. Forward leg has no wand.
  - Commemorative plaque: Stainless steel plate ($0.28\text{m} \times 0.22\text{m}$) added to forward ladder strut.
- **Surveyor 3 (`src/entities/Surveyor3.js`):**
  - Canonical 23-component OBJ loaded via `AssetManager`.
  - Severed camera collar modeled at $(-0.35, 1.35, 0.22)$ with exposed aluminum facet.
  - Discoloration: white polyurethane paint material modified to weathered tan-brown (`0xa89e90`).
  - Sampler trench: dark recessed polygon strip modeled in regolith at footpad 2.
- **ALSEP (`src/entities/ALSEP.js`):**
  - Central station, RTG, and PSE loaded from canonical OBJ models.
  - Solar Wind Spectrometer and Lunar Surface Magnetometer generated from procedural Three.js primitives based on Bendix blueprints.
- **Audit Conclusion:** All spacecraft modifications are verified in code, active in the 3D scene, and historically grounded in Apollo 12 engineering literature.

### 3.5 Foundational System Preservation
- **`src/scene/SplinePathEngine.js`:** 100% preserved. All 5 cinematic camera vantage paths (`overview`, `lmApproach`, `traverseToSurveyor`, `surveyorInspection`, `alsepArray`) are fully intact and functional.
- **`src/scene/SpatialProjector.js`:** 100% preserved. In-scene floating archival projector plates for historical photography and telemetry plates render correctly.
- **`src/core/AudioManager.js`:** 100% preserved. Positional 3D audio soundfield with distance attenuation and lowpass filtering remains active.

---

## 4. Summary of Verification Status

| Feature / Claim | Status | Action Required |
| :--- | :--- | :--- |
| Earth 3D sphere & coordinates ($64.5^\circ$ elev, $96.5^\circ$ azim, $1.90^\circ$ dia) | **VERIFIED** | None |
| Earth Blue Marble 2048x1024 PNG texture | **INCORRECT METADATA** | Correct catalog to reflect procedural canvas texture |
| MODIS cloud composite PNG | **INCORRECT METADATA** | Correct catalog to reflect procedural canvas texture |
| Yale Bright Star / Hipparcos JSON catalog | **INCORRECT METADATA** | Correct catalog to reflect procedural random distribution |
| Custom GLSL Rayleigh atmospheric limb shader | **VERIFIED** | None |
| Solar disk ($0.533^\circ$) & shadow throw ratio ($4.16:1$) | **VERIFIED** | None |
| LROC DEM `NAC_DTM_APOLLO12` dataset ID | **VERIFIED (Exists in PDS)** | Clarify that parameters are used analytically, not raw GeoTIFF |
| LROC NAC Stereo pair `M114104427LE/RE` | **NOT FOUND / INVALID** | Replace with authentic stereo pair `M120005333LE/RE` & `M120012135LE/RE` |
| NASA SVS 4767 visualization reference | **VERIFIED** | Update documentation to clarify visualization vs raw GIS |
| LM-6 Contact wands, wrinkled MLI, plaque | **VERIFIED** | None |
| Surveyor 3 severed collar, discoloration, trench | **VERIFIED** | None |
| ALSEP Array A layout & instruments | **VERIFIED** | None |
| Hapke opposition surge shader | **VERIFIED** | None |
| UI stacking fixes & typography updates | **VERIFIED** | None |
