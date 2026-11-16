# AFTERLIGHT — PHASE 04: ENVIRONMENTAL FIDELITY & ASSET AUDIT
**Project:** AFTERLIGHT — The Living Archival Monument  
**Focus:** Apollo 12 / Statio Cognitum (3.01239° S, 23.42157° W)  
**Date:** November 17, 2026  
**Status:** Comprehensive Baseline Inspection

---

## 1. Executive Summary & Audit Purpose

Phase 03 successfully established the foundational experiential architecture of AFTERLIGHT: the multi-node 3D spline camera engine, in-scene spatial archival projector, positional 3D Web Audio listener and beacons, and modernized ultra-legible typography. 

The mandate for **Phase 04 (Environmental Fidelity & Asset Expansion)** is to elevate the virtual environment from an impressive 3D scene into a scientifically credible, emotionally resonant digital reconstruction of an actual historical place on the Moon.

This audit establishes the rigorous ground truth of our current implementation across:
1. **Celestial Environment** (Earth, Sun, stars, vacuum optical physics, and directional illumination consistency).
2. **Terrain Fidelity** (Actual Apollo 12 LROC landing-site topography, radial crater cross-sections, and regolith material response).
3. **Artifact Fidelity** (LM-6 Intrepid, Surveyor 3, and ALSEP Array A hardware accuracy, materials, and retrieved component states).
4. **Environmental Storytelling** (Documented astronaut footpaths, surface disturbance, equipment impressions, and rock/gravel distributions).
5. **Asset Registry & Preservation** (Complete accounting of our 57 cataloged assets and newly identified acquisition needs).

---

## 2. Comprehensive Subsystem Audit

### 2.1 Celestial Environment (`src/scene/LunarLighting.js` & `src/scene/LunarScene.js`)

#### A. Current Implementation State
- **Sun Directional Light**: Positioned at `(450, 105, 75)` with intensity `3.4` and shadow map size `2048x2048`. The solar vector has an elevation angle of $\approx 13.1^\circ$ and azimuth $\approx 80.5^\circ$ (east-northeast).
- **Sun Visual Disk**: Rendered as a simple white sphere (`SphereGeometry(18, 16, 16)`) at distance $750\text{m}$.
- **Ambient Fill**: `AmbientLight(0x0e121a, 0.11)` providing minimal vacuum shadow fill.
- **Earth Disc**: Rendered on a 2D canvas texture ($256\times 256\text{px}$) with rough green circles representing landmasses, random white circles for clouds, and a cyan ring halo (`RingGeometry(14.2, 16.5, 32)`).
- **Stars**: **Completely absent**. `this.scene.background` is set to a solid black color (`#010204`).

#### B. Deficiencies & Approximations Identified
1. **Earth Visual Quality & Phase Inaccuracy**:
   - The current Earth texture is a naive 2D canvas drawing with oversized geometric circles that look like a generic cartoon planet.
   - The atmospheric halo is rendered as a thick flat blue ring (`opacity: 0.35`) hovering in space, creating an artificial sci-fi aesthetic. In the lunar vacuum, there is zero atmospheric scattering in the sky; Earth's atmosphere is an extremely thin blue sliver ($\approx 10\text{--}15\text{ km}$ thick on a globe of $12,742\text{ km}$ diameter, or less than $0.12\%$ of Earth's radius).
   - **Phase Geometry**: On November 19, 1969 at 06:54 UTC, the Moon was a waxing gibbous moon as observed from Earth (lunar age $\approx 9.8\text{ days}$). Conversely, viewed from the Moon, Earth appears in a **waning gibbous / half-Earth phase** with the illuminated crescent facing the Sun (East). The current linear shadow does not reflect true spherical terminator physics.
2. **Missing Starfield**:
   - While lunar daytime cameras exposed for bright regolith did not capture stars due to high shutter speeds ($1/250\text{s}$ at $f/8$ or $f/11$), human eyes adapted to shaded hardware shadows could see stars in the lunar vacuum. A scientifically restrained, astronomically accurate starfield with realistic stellar magnitude distribution is needed.
3. **Solar Disk Appearance**:
   - The solar disk is currently a flat white polygonal sphere lacking the intense, blinding brilliance of an extraterrestrial Sun observed through vacuum without atmospheric diffusion.

---

### 2.2 Terrain Topography & Surface Materials (`src/scene/LunarTerrain.js` & `src/scene/RegolithMaterial.js`)

#### A. Current Implementation State
- **Elevation Grid**: A $850\text{m} \times 850\text{m}$ plane geometry with $240 \times 240$ subdivisions ($57,600$ vertices).
- **Surveyor Crater Topography**: Driven by the authentic USGS/NASA radial spline datum (`surveyor_crater_topography_profile.json`): diameter $200\text{m}$, depth $-21.4\text{m}$, rim $+1.8\text{m}$, with Surveyor 3 positioned at $r = 42\text{m}$, depth $-11.5\text{m}$, slope $11.8^\circ$.
- **Major Craters**: Analytical bowl geometry for Head Crater ($r=70\text{m}$), Bench Crater ($r=35\text{m}$), Halo Crater ($r=15\text{m}$), Block Crater ($r=8.5\text{m}$), and Sharp Crater ($r=10\text{m}$).
- **Planetary Horizon**: True spherical curvature ring ($16\text{ km}$ outer radius) evaluated with physical drop $y = -r^2 / (2 R_{\text{moon}})$, where $R_{\text{moon}} = 1,737,400\text{m}$.
- **Regolith PBR Material**: $2048\times 2048$ canvas albedo texture with crater halos, impact melt rings, and astronaut trails; $512\times 512$ coherent bump map with 60 micro-crater indentations; Hapke retroreflective opposition surge fragment shader.
- **Rock & Gravel Distribution**: 75 natural fractured boulders + 180 fine gravel/cobble stones instanced via `THREE.InstancedMesh`.

#### B. Deficiencies & Approximations Identified
1. **Procedural vs. Empirical Topography**:
   - Although the Surveyor Crater radial cross-section is derived from NASA measurements, the intermediate mare plains between Head, Bench, and Halo craters currently rely on sinusoidal harmonic approximations rather than direct LROC NAC DTM elevation values.
2. **Regolith Micro-Texture**:
   - While the bump map is coherent, the albedo texture could benefit from multi-scale photometric blending with the actual Apollo 12 LROC NAC orthophoto (`NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg`).
3. **Footprint Depth & Disturbance Fidelity**:
   - Astronaut trails are currently painted as smooth dark lines on the 2D albedo canvas. They lack physical tread impression geometry, micro-shadowing along the boot tread edges, and the distinct dual-track stride pattern of Conrad and Bean's 1/6th-g "loping" gait.

---

### 2.3 Artifact Hardware Fidelity

#### A. Apollo 12 Lunar Module (LM-6 Intrepid) Descent Stage (`src/entities/LunarModule.js`)
- **Current State**: Official NASA GLTF model with Draco mesh compression, scaled to $9.45\text{m}$ diagonal landing gear footprint span. Correct $45^\circ$ rotation placing forward ladder and MESA in Quad I / II. Double-sided Kapton foil materials with calibrated PBR roughness/metalness.
- **Deficiencies**:
  - The model's thermal foil blankets are uniform across large faces; authentic Apollo 12 photography shows extensive micro-wrinkling, dimpling, and hand-crimped seams on the aluminized Kapton blankets.
  - The descent engine TRW nozzle interior lacks the dark ceramic niobium ablative liner coloration.
  - Plaque text and landing gear contact sensing probes ($1.68\text{m}$ spring-steel wands) are simplified or absent on the aft footpads.

#### B. Surveyor 3 Spacecraft (`src/entities/Surveyor3.js`)
- **Current State**: 23-mesh OBJ/MTL model resting on the $11.8^\circ$ inner slope of Surveyor Crater. Thermal paint discolored to tan-brown by 31 months of unshielded solar UV radiation.
- **Deficiencies**:
  - The severed camera strut cut by Conrad and Bean with bolt cutters needs more explicit mechanical edge detail.
  - The planar solar array and high-gain antenna mast need micro-fastener detail and authentic cabling.

#### C. ALSEP Array A (`src/entities/ALSEP.js`)
- **Current State**: Central Station, SNAP-27 RTG, Passive Seismic Experiment (PSE) with 10-sided aluminized Mylar skirt, and flat ribbon power/data cables.
- **Deficiencies**:
  - Missing the secondary ALSEP instruments: the **Lunar Surface Magnetometer (LSM)**, the **Solar Wind Spectrometer (SWS)**, the **Suprathermal Ion Detector Experiment (SIDE)**, and the **Cold Cathode Ion Gauge (CCIG)**.
  - Ribbon cables are currently rigid boxes rather than draping naturally across the irregular micro-topography.

---

### 2.4 Environmental Storytelling & Evidence-Based Traces

#### A. Documented Historic Human Traces
- **EVA 1 (November 19, 1969)**:
  - Intrepid egress $\rightarrow$ MESA deployment $\rightarrow$ contingency sample $\rightarrow$ US flag deployment ($7\text{m}$ NW of LM) $\rightarrow$ ALSEP deployment ($130\text{m}$ NW).
- **EVA 2 (November 20, 1969)**:
  - Round-trip loop: Intrepid $\rightarrow$ Head Crater $\rightarrow$ Bench Crater $\rightarrow$ Sharp Crater $\rightarrow$ Halo Crater $\rightarrow$ Surveyor Crater Rim $\rightarrow$ descent to Surveyor 3 $\rightarrow$ return to Intrepid. Total distance walked: $1.82\text{ km}$.
- **Current Status**:
  - Path trajectories are accurately defined in `traverseData.js` and `traverse_waypoints.geojson`, but their visual expression on the ground needs physical depth, scuffing, and footpad impression marks.

---

## 3. Preservation, Refactor, and Enhancement Matrix

| System / File | Current Architectural Role | Preservation Status | Planned Phase 04 Enhancement |
| :--- | :--- | :---: | :--- |
| `src/scene/LunarLighting.js` | Directional sun, ambient, Earth, celestial bodies | **Refactor & Enhance** | Build high-fidelity Earth sphere with realistic atmospheric limb shader and authentic waning gibbous phase. Add astronomically grounded starfield. Calibrate hard solar disk. |
| `src/scene/LunarTerrain.js` | 850m elevation mesh, crater splines, horizon | **Preserve & Enhance** | Integrate micro-topography, footpad impressions, and refined crater rim berms. |
| `src/scene/RegolithMaterial.js` | Albedo canvas, bump map, Hapke shader | **Preserve & Enhance** | Blend LROC orthophoto features into albedo; refine boot tread normal detailing and opposition surge. |
| `src/entities/LunarModule.js` | LM-6 Intrepid 3D model & hit target | **Preserve & Enhance** | Add textured Kapton foil wrinkling normal map, probe wands, and detailed MESA stowage blankets. |
| `src/entities/Surveyor3.js` | Surveyor 3 OBJ model on crater slope | **Preserve & Enhance** | Enhance severed strut details and soil trenching impressions beside footpad 2. |
| `src/entities/ALSEP.js` | Central Station, RTG, PSE, ribbon cables | **Preserve & Enhance** | Add LSM magnetometer and SWS spectrometer instruments to complete Array A. |
| `src/scene/SplinePathEngine.js` | 3D Catmull-Rom spline camera engine | **Preserve 100%** | Maintain full compatibility with Phase 03 camera transitions. |
| `src/scene/SpatialProjector.js` | In-scene 3D archival exhibition plates | **Preserve 100%** | Maintain in-scene photographic projection plates. |
| `src/core/AudioManager.js` | 3D HRTF audio beacons and listener | **Preserve 100%** | Maintain spatial audio soundfield. |

---

## 4. Audit Conclusions & Action Plan

1. **No architectural rewrites are required**: The Three.js scene graph, asset manager, spline camera controller, and state machine established in Phases 01–03 provide an exceptionally solid foundation.
2. **Highest visual leverage points**:
   - Rebuilding **Earth** with authentic photographic textures, physical waning gibbous terminator shading, and a razor-thin atmospheric rim.
   - Introducing a scientifically disciplined **starfield** with true astronomical magnitude variation.
   - Refining the **lunar regolith material** with subtle micro-relief and tangible astronaut bootprints.
   - Completing the **ALSEP Array A** instrument suite (Magnetometer and Solar Wind Spectrometer) and enhancing LM-6 thermal foil materials.
3. **Execution Sequence**:
   - Step 1: Author `docs/PHASE_04_ASSET_EXPANSION_CATALOG.md`.
   - Step 2: Implement the celestial environment (Earth, Sun, Starfield).
   - Step 3: Implement terrain fidelity & regolith material upgrades.
   - Step 4: Implement artifact fidelity & ALSEP instrument additions.
   - Step 5: Implement environmental storytelling (bootprints, trenching marks, footpad depressions).
   - Step 6: Validate via browser automation and author `PHASE_04_SCIENTIFIC_VALIDATION.md` and `PHASE_04_IMPLEMENTATION_REPORT.md`.
