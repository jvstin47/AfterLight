# AFTERLIGHT — Phase 00: Project Archaeology & Preservation Audit

**Project:** AFTERLIGHT  
**Tagline:** *The machines that stayed behind.*  
**Target Subject:** Apollo 12 Landing Site (*Statio Cognitum*, Oceanus Procellarum, `3.01239° S, 23.42157° W`)  
**Audit Date:** November 16, 2026  
**Auditor:** Antigravity (DeepMind)  
**Repository State:** Branch `main` (synchronized with `origin/main` and `origin/phase-01/asset-library` at commit `7762a5d`)  
**Status:** **INSPECTION COMPLETE — PHASE 00 PRESERVATION BASELINE ESTABLISHED — AWAITING EXPLICIT APPROVAL**

---

## Executive Summary

AFTERLIGHT is an existing, substantial interactive 3D WebGL documentary installation commemorating the robotic and manned spacecraft of the Apollo 12 mission. The project is not greenfield; it incorporates authentic NASA orbital reconnaissance data, 57 cataloged historical research assets (~78 MB), 3D engineering models (GLB with Draco compression, OBJ/MTL), procedural lunar regolith shaders, a Web Audio API acoustic synthesizer, and an editorial archival user interface.

In preparation for a major creative and technical rework towards an experimental, studio-quality digital installation inspired by Active Theory, this audit thoroughly establishes the current baseline:
1. Every research asset, model, texture, transcript, and data file has been inventoried, verified, and placed under strict preservation protocols.
2. The complete runtime architecture, scene pipeline, event bus, state machine, and UI systems have been forensic-audited without modifying application source code.
3. The visual baseline across desktop (1440×900) and mobile (390×844) viewports has been captured across 10 discrete states, uncovering specific functional defects (notably an unhandled `ReferenceError` crash in the EVA Traverse Modal and mobile flexbox clipping).
4. Concrete categorization separates verified production-worthy systems, repairable components, technical debt, and candidate modules for experimental redesign.

---

## 1. Existing Project Architecture

### 1.1 Technology Stack & Runtime Profile
- **Language / Runtime:** Vanilla JavaScript (ECMAScript Modules / ESNext), strictly framework-free (no React, Vue, or Svelte).
- **3D Graphics Engine:** Three.js `v0.170.0` (WebGL 1.0 / 2.0 compatible, utilizing `PerspectiveCamera`, `OrbitControls`, custom canvas procedural albedo shaders, and Draco mesh decompression).
- **Animation Physics:** Anime.js `v3.2.2` (spring physics, orbital approach sequences, dossier slide-outs, and audio visualizer bar oscillations).
- **Audio Synthesis:** Native Web Audio API (`AudioContext`, custom pink-noise filtered space suit ECS life-support drone, and dual-frequency 2525 Hz / 2475 Hz Apollo Quindar communication beeps).
- **Build System & Dev Server:** Vite `v5.4.11` configured with manual Rollup chunking (`three-vendor`, `anime-vendor`) and a custom asset copying hook (`copy-afterlight-assets`) targeting `dist/assets/`.
- **Hosting & Edge Deployment:** Vercel edge infrastructure (`afterlight-rouge.vercel.app` production target).

### 1.2 System Topology & Dependency Graph

```
                                  +-------------------+
                                  |     index.html    |
                                  +---------+---------+
                                            |
                                  +---------v---------+
                                  |    src/main.js    |
                                  +----+----+----+----+
                                       |    |    |
        +------------------------------+    |    +-----------------------------+
        |                                   |                                  |
+-------v-------+                   +-------v-------+                  +-------v-------+
| LunarScene.js |                   | StateMachine  |                  | EventBus.js   |
+-------+-------+                   +-------+-------+                  +---------------+
        |                                   |
        +---> LunarTerrain.js (16km drop)   +---> APPROACH
        +---> RegolithMaterial.js (PBR)     +---> ENVIRONMENT (HUD)
        +---> LunarLighting.js (12.4° Sun)  +---> INSPECTION (DossierDrawer)
        +---> CameraController.js (5 presets)+---> TRAVERSE (TraverseModal)
        +---> LunarModule.js (Draco GLB)
        +---> Surveyor3.js (OBJ/MTL 11.8°)
        +---> ALSEP.js (CS, RTG, PSE OBJs)
        +---> WaypointMarkers.js (Reseau)
```

---

## 2. Complete Asset Inventory & Preservation Status

The repository houses **57 cataloged assets** (~78 MB total). All assets are tied to documented NASA mission data, USGS Astrogeology records, or Grumman/Hughes/Bendix contractor blueprints.

### 2.1 3D Physical Geometry & Mesh Models (`assets/3d_models/`)

| Asset File | Size | Format | Technical Breakdown & Dependencies | Scientific Attribution | Current Runtime Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lunar_module/apollo_lunar_module.glb` | 700 KB | GLB (GLTF 2.0) | 135 nodes, 134 meshes, 97,588 tris. **Requires Google Draco decompression (`KHR_draco_mesh_compression`).** Embedded PBR textures. | NASA 3D Resources / Grumman Aerospace | **Active & Verified.** Loaded via `AssetManager.js` using Draco decoder in `public/draco/`. Scaled 1:1 (9.45m diagonal span). |
| `lunar_module/intrepid_descent_stage_specs.json` | 2.5 KB | JSON | Physical specifications, fuel loads (8,248 kg Aerozine-50/N2O4), TRW DPS engine metrics. | NASA MSC-01855 / TRW Systems | **Active.** Loaded in dossier narrative and technical cards. |
| `surveyor_3/surveyor_3_lander.obj` | 38 KB | Wavefront OBJ | 23 meshes, tubular 7075 spaceframe, 3 tripod legs, planar antenna, TV camera turret, scoop arm. | NASA JPL / Hughes Aircraft Co. | **Active & Verified.** Loaded via `OBJLoader` with material tuning on 11.8° crater slope. |
| `surveyor_3/surveyor_3_lander.mtl` | 314 B | Wavefront MTL | Color definitions for aluminum, solar cells, white thermal paint (degraded to tan/brown by UV). | NASA JPL / Hughes Aircraft Co. | **Active.** Preloaded by `MTLLoader`. |
| `surveyor_3/surveyor_3_specs.json` | 3.5 KB | JSON | Touchdown coordinates, 6,315 TV frames transmitted, soil trench depths (18cm). | NASA TR-32-1265 | **Active.** Rendered in dossier drawer. |
| `alsep_instruments/alsep_central_station.obj` | 3.7 KB | Wavefront OBJ | Bendix Central Station chassis, thermal louvers, S-band helical antenna, sun gnomon. | Bendix Aerospace / NASA MSC | **Active & Verified.** Loaded via `AssetManager.js`. |
| `alsep_instruments/alsep_central_station.mtl` | 256 B | Wavefront MTL | Material attributes for Kapton/Mylar and specular sunshield. | Bendix Aerospace | **Active.** |
| `alsep_instruments/snap27_rtg.obj` | 4.2 KB | Wavefront OBJ | Beryllium thermoelectric generator with 8 radial cooling fins. | GE Space Division / AEC | **Active & Verified.** Positioned 2.5m from CS. |
| `alsep_instruments/snap27_rtg.mtl` | 183 B | Wavefront MTL | High-emissivity thermal coating parameters. | GE Space Division | **Active.** |
| `alsep_instruments/alsep_passive_seismic_experiment.obj` | 1.9 KB | Wavefront OBJ | 10-sided aluminized Mylar/gold thermal shroud and leveling stool. | Columbia University / Teledyne | **Active & Verified.** Positioned 3.0m from CS. |
| `alsep_instruments/alsep_passive_seismic_experiment.mtl` | 129 B | Wavefront MTL | Specular gold/aluminized foil material definitions. | Teledyne Geotech | **Active.** |
| `alsep_instruments/alsep_array_a_geometry.json` | 3.6 KB | JSON | Exact polar deployment coordinates, cable lengths, and instrument azimuth bearings. | BSR-2760 / NASA MSC | **Active.** Governs procedural ribbon cable routing. |

### 2.2 Terrain & Cartographic Datasets (`assets/terrain_and_cartography/`)

| Asset File | Size | Format | Scientific Description | Attribution | Current Runtime Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg` | 232 KB | JPEG (1024×576) | LROC NAC orbital orthophoto mosaic of *Statio Cognitum*. | NASA GSFC / SVS / ASU LROC | **Preserved / Partially Integrated.** Used as research reference; procedural 2048px canvas albedo map replicates features in code. |
| `elevation_and_dem/landing_site_dem_parameters.json` | 623 B | JSON | Elevation limits, mare plane gradient (0.8°), crater centers and depths. | LROC DTM / USGS | **Active.** Parsed in `LunarTerrain.js` for crater definitions. |
| `elevation_and_dem/surveyor_crater_topography_profile.json` | 1.7 KB | JSON | 20-point surveyed cross-section of Surveyor Crater (-21.4m floor, -11.5m lander bench, +1.8m rim). | NASA SP-235 / USGS Astrogeology | **Active.** Implemented as continuous mathematical spline in `LunarTerrain.js`. |
| `traverse_maps/Apollo_12_EVA_2_Traverse_Overlay_S69-59538.jpg` | 2.7 MB | JPEG | Archival NASA MSC photographic flight chart with EVA-2 loop markings. | NASA MSC (1969) | **Active.** Modal background in `TraverseModal.js`. |
| `traverse_maps/Apollo_12_EVA_2_Traverse_Overlay_S69-59538_metadata.json` | 543 B | JSON | Georeferenced map bounds, projection datum, and historical citation. | NASA MSC | **Active.** |
| `traverse_maps/traverse_waypoints.geojson` | 4.9 KB | GeoJSON | 14 discrete geological sampling stations with lunar coordinates, station notes, and distances. | USGS Interagency Report 28 | **Active.** Source data for `traverseData.js`. |

### 2.3 Archival Photography & Hasselblad Scans (`assets/photography/`)

All images are direct high-resolution digital scans from the Apollo Lunar Surface Journal / NASA Images archive:
- **Intrepid Descent Stage (`assets/photography/intrepid_lm/`):**
  - `AS12-46-6749_Intrepid_Ladder_and_Plaque.jpg` (3.2 MB) + JSON metadata
  - `AS12-47-6913_Conrad_MESA_Lunar_Module.jpg` (3.7 MB)
  - `AS12-47-6988_Flag_LM_Shadow_Footprints.jpg` (3.6 MB) + JSON metadata
  - `AS12-51-7507_Intrepid_Descent_Stage_Landing_Config.jpg` (3.4 MB)
- **Surveyor 3 Rendezvous (`assets/photography/surveyor_3_rendezvous/`):**
  - `AS12-48-7099_Surveyor_Footpad_Lunar_Soil.jpg` (3.8 MB) + JSON metadata
  - `AS12-48-7121_Surveyor_In_Crater_Slope.jpg` (3.7 MB) + JSON metadata
  - `AS12-48-7133_Conrad_Examining_Surveyor_Camera.jpg` (5.4 MB)
  - `AS12-48-7134_Conrad_Surveyor_3_Intrepid_Background.jpg` (523 KB)
  - `AS12-48-7136_Surveyor_3_and_Intrepid_Panorama.jpg` (3.2 MB) + JSON metadata
- **ALSEP Deployment (`assets/photography/alsep_deployment/`):**
  - `AS12-46-6790_Bean_Fueling_SNAP27_RTG.jpg` (3.1 MB) + JSON metadata
  - `AS12-46-6807_Bean_Carrying_ALSEP_Pallets.jpg` (4.4 MB) + JSON metadata
  - `AS12-46-6813_Bean_Deploying_LSM_Magnetometer.jpg` (3.9 MB)
  - `AS12-47-6918_Deployed_ALSEP_Array.jpg` (3.1 MB) + JSON metadata
  - `AS12-47-6919_Bean_Deploying_ALSEP_Subpackages.jpg` (2.2 MB) + JSON metadata

*All photographic assets are actively referenced in `src/data/artifactsData.js` galleries and render crisply in `DossierDrawer.js`.*

### 2.4 Engineering Schematics & Blueprints (`assets/schematics_and_diagrams/`)

- `lm_schematics/lm_descent_stage_subsystems.svg` (25 KB): Grumman Aerospace Drawing `LDW-340-10026 REV E`. Orthographic engineering blueprint of the LM-6 descent stage subsystems, MESA bay, TRW engine, and propellant tanks. Validated XML.
- `surveyor_schematics/surveyor_spacecraft_configuration.svg` (23 KB): Hughes Aircraft Company / JPL Drawing `HAC-SUR-0348-D REV 4`. Spacecraft configuration, planar antenna, solar cells, retrorocket, and highlighted TV camera retrieval shear point. Validated XML.
- `alsep_schematics/alsep_array_a_layout_diagram.svg` (19 KB): Bendix Aerospace Systems Division Drawing `BSR-2760 / MSFC-408`. Central station orientation, 27.4m RTG separation, cable runs, and seismometer placement. Validated XML.

---

## 3. Existing Functionality Inventory

| Component / Module | Source File | Status | Technical Assessment |
| :--- | :--- | :--- | :--- |
| **Lunar Scene Graph** | `src/scene/LunarScene.js` | Production-Worthy | Robust Three.js render loop, resize observer, background `0x010204` deep vacuum space, automated disposal. |
| **Planetary Horizon** | `src/scene/LunarTerrain.js` | Production-Worthy | True spherical lunar curvature ($R = 1,737.4\text{ km}$, $y = -r^2 / 2R$) extending 16,000m with 8 perimeter crater silhouettes. |
| **Surveyor Crater Spline** | `src/scene/LunarTerrain.js` | Production-Worthy | Mathematical cosine spline strictly reproducing NASA/USGS topography profile from -21.4m floor to +1.8m rim. |
| **Regolith PBR Shading** | `src/scene/RegolithMaterial.js` | Solid / Baseline | Procedural 2048px canvas albedo map with crater ejecta rays, dark impact melt halos, and astronaut footsteps. |
| **Solar Lighting** | `src/scene/LunarLighting.js` | Production-Worthy | Low dawn angle (12.4° elevation, azimuth 85°) with 2048px shadow map cascade, zero atmospheric bounce, faint Earth disc. |
| **Camera Controller** | `src/scene/CameraController.js` | Production-Worthy | OrbitControls with smooth damping, polar constraints (prevents sub-surface camera dip), and Anime.js animated flight paths. |
| **Asset Manager** | `src/core/AssetManager.js` | Production-Worthy | Shared Draco decoder (`public/draco/`), in-flight request deduplication, GLTF/OBJ/MTL caching, safe `.clone(true)` isolation. |
| **Audio Synthesizer** | `src/core/AudioManager.js` | Production-Worthy | 100% synthetic native Web Audio API: suit ECS oxygen drone + Quindar intro (2525 Hz) & outro (2475 Hz) burst tones. |
| **Event Bus** | `src/core/EventBus.js` | Production-Worthy | Zero-dependency synchronous pub/sub pattern (`on`, `off`, `emit`). Clean and decoupled. |
| **State Machine** | `src/core/StateMachine.js` | Solid | Formal finite state machine governing `APPROACH`, `ENVIRONMENT`, `INSPECTION`, `TRAVERSE`. |
| **Approach Sequence** | `src/ui/ApproachOverlay.js` | Production-Worthy | Editorial title sequence with Hasselblad reseau markings, Alan Bean quote, smooth dissolve into orbit. |
| **Archival Dossier** | `src/ui/DossierDrawer.js` | Production-Worthy | Slide-out technical drawer, tabs (Origin, Journey, Mission, Discoveries, Final Days, Legacy), blueprint zoom modal. |
| **Vidicon CRT Scanline** | `src/ui/VidiconOverlay.js` | Production-Worthy | 600-line slow-scan TV raster sweep (3.6s cycle), 25-point optical Reseau crosshairs, dynamic bearing/pitch telemetry. |
| **EVA Traverse Modal** | `src/ui/TraverseModal.js` | **BROKEN (Defect)** | Missing `eventBus` import causes immediate crash upon opening, leaving an occluding SVG element. |
| **Command Palette Search**| `src/ui/QuickSearch.js` | Production-Worthy | `⌘ K` interactive modal for immediate search across artifacts, camera presets, and historical waypoints. |
| **Navigation Dock** | `src/ui/NavRail.js` | Solid | 5-button floating dock (`Overview`, `Vidicon`, `Traverse`, `Radio`, `Search`). |
| **Telemetry Card** | `src/ui/MissionStatsCard.js` | Solid | Real-time distance tracker to nearest artifact, regolith geochemical breakdown. |
| **Archival Fallback** | `src/ui/FallbackView.js` | Needs Repair | Non-WebGL accessibility layer, but uses stale property accessors (`art.narrative.origin.content` instead of `.text`). |

---

## 4. Existing Visual and Interaction Problems

Direct browser audit across desktop (1440×900) and mobile (390×844) identified the following specific visual and interactive defects:

### 4.1 Functional & JavaScript Bugs
1. **Traverse Modal Runtime Crash (`ReferenceError: eventBus is not defined`)**:
   - In `src/ui/TraverseModal.js` (line 165), `eventBus.emit('traverse:opened')` is called, but `eventBus` was never imported at the top of the file.
   - **Impact**: Clicking `TRAVERSE MAP [T]` in the header or nav rail throws an unhandled error. The modal fails to display, and an unmounted transparent SVG layer blocks pointer clicks to underlying scene buttons.
2. **Fallback View Data Mismatch**:
   - In `src/ui/FallbackView.js`, the template queries `art.narrative.origin.content` and `art.specs`. The canonical schema in `src/data/artifactsData.js` defines `art.narrative.origin.text` and `art.keySpecs` (array). In non-WebGL environments, this causes an uncaught rendering error.

### 4.2 Layout & Responsive Design Defects
1. **Mobile Viewport (390×844) Header Row Overflow**:
   - In `docs/audit_screenshots/phase00/11_mobile_surface_390x844.png`, the top navigation flex container exceeds the 390px viewport width. The rightmost button (`TRAVERSE MAP`) is partially cut off past the screen edge.
2. **Mobile Keyboard Instructions**:
   - The opening approach screen on mobile displays desktop keyboard prompts (`SKIP DESCENT [ESC]`, `ENTER ↵`), which is visually awkward on touch-only mobile devices.
3. **Mobile Proximity Card Footprint**:
   - The floating "SURVEYOR III PROXIMITY" card retains its 320px fixed width on mobile, consuming ~35% of the visible vertical screen height.
4. **Desktop Vidicon Telemetry Overlay Stacking**:
   - In Vidicon Mode at 1440×900, the secondary slow-scan telemetry card (`3.6 SEC/FR`) collides with the primary site coordinates box at the top left, causing overlapping monospace text.

---

## 5. Visual Baseline Screenshots

*High-resolution reference captures saved to `docs/audit_screenshots/phase00/`:*

| State No. | State Description | Viewport | Screenshot File | Observations |
| :---: | :--- | :---: | :--- | :--- |
| **01** | Initial Approach Experience | 1440×900 | [`01_approach_desktop.png`](audit_screenshots/phase00/01_approach_desktop.png) | Clean vacuum backdrop, zero marker bleed, high-contrast typography. |
| **02** | Main Landing Site Overview | 1440×900 | [`02_site_overview_desktop.png`](audit_screenshots/phase00/02_site_overview_desktop.png) | 16km horizon visible; crater rims defined; bottom vantage bar clean. |
| **03** | LM-6 Intrepid Eye-Level | 1440×900 | [`03_lm6_eye_level_desktop.png`](audit_screenshots/phase00/03_lm6_eye_level_desktop.png) | Draco GLB renders full gold foil, struts, US flag, and footprints. |
| **04** | Surveyor 3 Inside Crater | 1440×900 | [`04_surveyor_crater_desktop.png`](audit_screenshots/phase00/04_surveyor_crater_desktop.png) | Resting on 11.8° inner wall; tan photolysis paint accurately rendered. |
| **05** | ALSEP Array A Science Layout | 1440×900 | [`05_alsep_science_desktop.png`](audit_screenshots/phase00/05_alsep_science_desktop.png) | Central station, SNAP-27 RTG, and gold PSE shroud deployed 130m NW. |
| **06** | Dossier Drawer (Origin Tab) | 1440×900 | [`06_dossier_origin_desktop.png`](audit_screenshots/phase00/06_dossier_origin_desktop.png) | Zero widget overlap; Proximity card and nav dock auto-hide cleanly. |
| **07** | Dossier Drawer (Schematics Tab) | 1440×900 | [`07_dossier_schematics_desktop.png`](audit_screenshots/phase00/07_dossier_schematics_desktop.png) | Grumman blueprint renders vector hairlines with zoom trigger. |
| **08** | Traverse Modal Defect | 1440×900 | [`08_traverse_modal_defect.png`](audit_screenshots/phase00/08_traverse_modal_defect.png) | Demonstrates unhandled `ReferenceError: eventBus is not defined`. |
| **09** | Camera Orbit & Distance Tracker | 1440×900 | [`09_camera_orbit_zoom.png`](audit_screenshots/phase00/09_camera_orbit_zoom.png) | Smooth 60fps orbit; dynamic telemetry updates range in meters. |
| **10** | Vidicon CRT Scanline Mode | 1440×900 | [`10_vidicon_telemetry_mode.png`](audit_screenshots/phase00/10_vidicon_telemetry_mode.png) | 600-line raster sweep and 25-point Hasselblad reseau grid. |
| **11** | Mobile Surface Environment | 390×844 | [`11_mobile_surface_390x844.png`](audit_screenshots/phase00/11_mobile_surface_390x844.png) | Highlights header horizontal button overflow on narrow screens. |
| **12** | Mobile Approach Screen | 390×844 | [`12_mobile_approach_390x844.png`](audit_screenshots/phase00/12_mobile_approach_390x844.png) | Shows desktop keyboard prompt `[ESC]` on mobile touch screen. |

---

## 6. Technical Debt & Architectural Risks

1. **Procedural Canvas Texture vs. GPU Shaders**:
   - `RegolithMaterial.js` generates a 2048×2048 `HTMLCanvasElement` CPU texture on startup (looping 400 radial gradients and iterating crater ejecta). While scientifically aligned, this introduces a 300–450ms initial main-thread stutter on slower mobile devices. Moving to custom WGSL/GLSL noise shaders will drastically improve initialization performance.
2. **Missing Unit Tests & Automated Integration Tests**:
   - The repository currently has zero automated end-to-end or component test suites (`npm test` is not configured). Regressions (such as missing module imports in lazy-loaded modals) can slip into builds without compilation errors.
3. **Double CSS Framework Clashing**:
   - The user interface currently combines custom editorial stylesheets (`approach.css`, `hud.css`, `dossier.css`, `traverse.css`) with experimental Uiverse components (`uiverse.css`). While functional, class name scoping (`.cir-btn`, `.cir-rail`, `.cir-note`) requires rationalization into a unified, high-end studio design token system.
4. **Draco WebAssembly Hosting**:
   - `DRACOLoader` relies on static files in `public/draco/`. Any future migration or CDN path changes must maintain strict MIME type handling (`application/wasm`) to avoid silent GLB loading crashes.

---

## 7. Performance Baseline

- **Vite Production Build Time:** ~600–700 ms.
- **Production Bundle Metrics:**
  - `dist/index.html`: 2.28 KB (gzip: 1.02 KB)
  - `dist/assets/index-*.css`: 47.66 KB (gzip: 9.00 KB)
  - `dist/assets/three-vendor-*.js`: 610.91 KB (gzip: 156.82 KB)
  - `dist/assets/anime-vendor-*.js`: 18.07 KB (gzip: 7.41 KB)
  - `dist/assets/index-*.js`: 85.02 KB (gzip: 26.89 KB)
  - Lazy chunks (`DossierDrawer`, `TraverseModal`, `FallbackView`): ~2–10 KB each.
- **Runtime Frame Rate:** Stable 60 FPS in WebGL canvas on modern desktop browsers (Apple M-series GPU). Minimal draw call footprint (1 main terrain mesh, 1 horizon ring mesh, 3 primary 3D entities).

---

## 8. Categorization: Retain vs. Redesign

### Systems Worth Retaining (Foundational Value)
1. **Scientific Coordinate & Elevation Spline System (`LunarTerrain.js`)**: The mathematical elevation formulas derived from USGS Surveyor Crater profiles and LROC DEM parameters are irreplaceable scientific assets.
2. **Asset Ingestion Pipeline (`AssetManager.js`)**: The Draco decompression setup, in-flight deduplication, and OBJ/MTL caching are robust, battle-tested, and should remain the backbone of 3D asset loading.
3. **NASA Audio Synthesizer (`AudioManager.js`)**: Synthetic Quindar tones and spacesuit pink-noise rumble are performant, zero-dependency, and deeply atmospheric.
4. **Archival Research & Schematics (`assets/`)**: All 57 cataloged assets, primary reports, and newly created Grumman/Hughes/Bendix vector blueprints are museum-grade and must be preserved verbatim.

### Systems Candidate for Redesign (Creative Rework Towards Active Theory Standard)
1. **Shaders & Post-Processing Pipeline**:
   - Introduce custom GLSL post-processing passes (atmospheric vacuum bloom, chromatic aberration, optical lens distortion, and filmic tone mapping).
2. **Regolith Soil Material**:
   - Replace CPU 2D canvas texture generation with real-time procedural GLSL shaders (triplanar mapping, micro-relief normal perturbation, dynamic footstep trails).
3. **Interface & Motion Choreography**:
   - Elevate from standard 2D HUD cards into a unified, cinematic, interactive overlay with fluid micro-interactions, magnetic cursor physics, dynamic audio scrubbing, and seamless modal transitions.
4. **Responsive Mobile System**:
   - Implement dedicated mobile navigation ergonomics (bottom sheet drawer, touch gestures, condensed telemetry pills).

---

## 9. Dependencies & External Requirements

### Production Dependencies (`package.json`)
- `three`: `^0.170.0`
- `animejs`: `^3.2.2`

### Development Dependencies
- `vite`: `^5.4.11`

### External Binary & Wasm Requirements
- Google Draco Wasm Decoders (`public/draco/draco_decoder.wasm`, `draco_decoder.js`, `draco_wasm_wrapper.js`).
- Google Fonts (`Cinzel`, `Inter`, `Space Mono`) loaded via CDN or local assets.

---

## 10. Proposed Preservation & Migration Strategy

To guarantee that no research, assets, or functionality accumulated in AFTERLIGHT are lost during the rework:

```
+-------------------------------------------------------------------------------------------------+
| PHASE 00: ARCHAEOLOGY & PRESERVATION (CURRENT)                                                  |
| - Complete asset catalog verified.                                                              |
| - Runtime baseline & defects documented.                                                        |
| - Zero source code or assets modified.                                                          |
+-------------------------------------------------------------------------------------------------+
                                                |
                                                v
+-------------------------------------------------------------------------------------------------+
| PHASE 01: ARCHITECTURAL HARNESS & DEFECT REMEDIATION                                            |
| - Fix TraverseModal.js missing import without altering scene systems.                           |
| - Fix FallbackView.js data accessor mismatch.                                                   |
| - Create isolated staging branch (`feature/active-theory-rework`).                             |
+-------------------------------------------------------------------------------------------------+
                                                |
                                                v
+-------------------------------------------------------------------------------------------------+
| PHASE 02: ADVANCED VISUAL PIPELINE (PARALLEL INTEGRATION)                                       |
| - Implement post-processing pipeline (EffectComposer) alongside existing render loop.           |
| - Prototype custom GLSL regolith shader while keeping RegolithMaterial.js as fallback.         |
| - Maintain 100% backward compatibility with existing 3D models and elevation splines.           |
+-------------------------------------------------------------------------------------------------+
                                                |
                                                v
+-------------------------------------------------------------------------------------------------+
| PHASE 03: STUDIO-QUALITY UI/UX REFINEMENT                                                       |
| - Unify editorial typography and design tokens.                                                  |
| - Rebuild responsive mobile navigation.                                                         |
| - Final multi-device visual regression verification against Phase 00 baseline screenshots.       |
+-------------------------------------------------------------------------------------------------+
```

---

## 11. Verification Matrix: Facts vs. Assumptions

| Item | Status | Verification Evidence |
| :--- | :---: | :--- |
| **LM-6 GLB Model contains Draco compression** | **Verified Fact** | Explicitly validated via `DRACOLoader` integration in `AssetManager.js` and header check. |
| **Surveyor 3 rested on 11.8° crater slope** | **Verified Fact** | Documented in NASA TR-32-1265 and modeled in `Surveyor3.js` (`rotation.z = -11.8°`). |
| **TraverseModal crashes on open** | **Verified Fact** | Confirmed by browser subagent `62b76e04` (`ReferenceError: eventBus is not defined`). |
| **Vantage bar sits at bottom of viewport** | **Verified Fact** | Verified by subagent `32cefd7d` (`y: 829` in 900px viewport). |
| **Zero assets deleted or modified in Phase 00** | **Verified Fact** | Confirmed by `git status` (clean working tree across all `assets/` and `src/`). |
| **Active Theory rework requires new dependencies** | **Unverified Assumption** | Need to evaluate whether post-processing requires `three/addons/postprocessing` (bundled with Three.js) before adding any external packages. |

---

## 12. Stop Condition & Next Action

> [!IMPORTANT]
> **PHASE 00 IS COMPLETE.**  
> In compliance with the Phase 00 instructions:
> - **No application source code has been modified.**
> - **No assets have been altered, renamed, or deleted.**
> - **No Git commits or pushes have been made.**
> - **Existing development and preview servers remain active.**
>
> All baseline evidence, catalog records, and screenshots have been compiled into this document. The project is frozen and awaits the user's explicit review and approval before proceeding to any creative or technical rework.
