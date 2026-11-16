# AFTERLIGHT — PHASE 04: ASSET EXPANSION CATALOG (AUDITED & RECTIFIED)
**Project:** AFTERLIGHT — The Living Archival Monument  
**Focus:** Apollo 12 / Statio Cognitum (Oceanus Procellarum)  
**Revision:** Phase 04.1 Audit Rectification  
**Date:** November 17, 2026  
**Document:** Official Research & Asset Acquisition Registry

---

## 1. Overview & Sourcing Principles

This catalog documents the complete digital asset collection for the Apollo 12 landing site reconstruction, identifying both preserved historical assets and newly acquired assets for Phase 04.

In accordance with strict historical and scientific integrity standards established during Phase 04.1:
- All source assets are primary historical records produced by **NASA**, **JPL**, **USGS**, **LROC / Arizona State University**, or aerospace prime contractors (**Grumman**, **Hughes Aircraft**, **Bendix Aerospace**, **GE Space Division**).
- Procedural reconstructions (shaders, in-memory canvas maps, mathematical heightfields) are transparently categorized as such and distinguished from imported raster or mesh assets.
- Hallucinated or unverified dataset identifiers (such as the erroneous `M114104427LE/RE`) have been expunged and replaced with authentic archive identifiers (`M175428601LE/RE`, `M120005333LE/RE`, `M120012135LE/RE`).

---

## 2. Phase 04 Asset Registry (Audited Status)

### 2.1 Celestial Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Implementation Status | Audit Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-001** | Celestial | Earth Surface Continental Map | Procedural reconstruction inspired by NASA Blue Marble geography | In-memory HTML5 Canvas ($1024\times 512$) | **ACTIVE (Procedural)** | **RECTIFIED:** Generated dynamically via 2D canvas API in `LunarLighting.js`; no external PNG is downloaded. |
| **A12-EXP-002** | Celestial | Global Cloud Pattern & Atmospheric Motion | Procedural reconstruction inspired by MODIS ITCZ distribution | In-memory HTML5 Canvas layer | **ACTIVE (Procedural)** | **RECTIFIED:** Generated dynamically on Earth canvas; no external raster loaded. |
| **A12-EXP-003** | Celestial | Disciplined Vacuum Starfield | Topocentric spherical projection ($14,000\text{m}$ radius sphere, 1,800 stars) | Procedural Math Array (`Math.random()`) | **ACTIVE (Procedural)** | **RECTIFIED:** Generates 1,800 stars with authentic $16^\circ$ solar glare cone and zero atmospheric twinkle. No external JSON table. |
| **A12-EXP-004** | Celestial | Atmospheric Limb Rayleigh Scattering Shader | Physically based atmospheric scattering formulation ($H \approx 8.5\text{km}$) | Custom GLSL shader injection | **ACTIVE (Shader)** | **VERIFIED:** Grazing Fresnel term $(1.0 - \vec{N}\cdot\vec{V})^{3.8}$ with cyan Rayleigh tint active on Earth mesh. |

---

### 2.2 Terrain & Topography Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Implementation Status | Audit Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-005** | Terrain | Apollo 12 Landing Site High-Resolution Orthophoto | NASA Goddard SVS 4767 / LROC NAC (`M175428601LE/RE`) | JPEG, $1024\times 576$, 232 KB | **INACTIVE (Reference Only)** | **RECTIFIED:** Identifier corrected from invalid `M114104427LE/RE`. File exists in `assets/terrain_and_cartography/lroc_imagery/` but is not imported at runtime. |
| **A12-EXP-006** | Terrain | LROC NAC Digital Terrain Model (`NAC_DTM_APOLLO12`) | NASA / LROC PDS Geosciences Node (`NAC_DTM_APOLLO12`) | USGS DEM Baseline / Analytical Equations | **ACTIVE (Analytical)** | **VERIFIED:** Dataset exists in PDS; used to parameterize crater radii, depths, and slopes in `LunarTerrain.js`. |
| **A12-EXP-007** | Cartography | Surveyor Crater 1:500 Topographic Contour Map | NASA MSC Apollo 12 Preliminary Science Report (SP-235) | SP-235 Section 3 extraction / Vector reference | **ACTIVE (Reference)** | **VERIFIED:** Verifies $11.8^\circ$ inner wall slope and Surveyor 3 resting position. |
| **A12-EXP-008** | Surface | Apollo Lunar Bootprint Tread & Scuff Displacement | Procedural stride generator inspired by NASA photo `AS12-46-6729` | Dual-track geometry & albedo modifier | **ACTIVE (Procedural)** | **VERIFIED:** Dual-track stride ($1.35\text{m}$ interval, $\pm 0.22\text{m}$ lateral offset) with $-35\%$ albedo darkening. |

---

### 2.3 Spacecraft & Equipment Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Implementation Status | Audit Finding |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-009** | Spacecraft | Wrinkled Kapton Thermal Insulation Normal Texture | Reconstructed from Hasselblad macro imagery calibration | Procedural normal map ($256\times 256$) | **ACTIVE (Shader/Canvas)** | **VERIFIED:** Applied to LM-6 gold/amber foil materials in `LunarModule.js`. |
| **A12-EXP-010** | Spacecraft | Lunar Surface Sensing Probe Geometry & Material | Grumman LM Flight Manual (LMA790-3) | Procedural 3D cylinder meshes ($1.68\text{m}$) | **ACTIVE (Geometry)** | **VERIFIED:** Three contact probes added to Port, Starboard, Aft legs; forward ladder leg omitted. |
| **A12-EXP-011** | Spacecraft | Surveyor 3 Severed TV Camera Strut Cut Details | NASA TR R-323 / Hughes Aircraft analysis | 3D mesh modification & shear facet | **ACTIVE (Geometry)** | **VERIFIED:** Sheared aluminum facet modeled at $(-0.35, 1.35, 0.22)$ on Surveyor 3. |
| **A12-EXP-012** | ALSEP | Lunar Surface Magnetometer (LSM) Geometry | Bendix Aerospace ALSEP Handbook | Procedural 3D primitive assembly ($3\text{ booms}$) | **ACTIVE (Geometry)** | **VERIFIED:** Deployed $15\text{m}$ SE of Central Station. |
| **A12-EXP-013** | ALSEP | Solar Wind Spectrometer (SWS) Geometry | Bendix Aerospace / JPL | Procedural 3D primitive assembly ($7\text{ cups}$) | **ACTIVE (Geometry)** | **VERIFIED:** Deployed $4\text{m}$ NW of Central Station. |

---

### 2.4 Primary Archival Photography (Apollo 12 Hasselblad 70mm Collection)

All 9 primary Hasselblad 70mm archival photographs remain preserved and verified:

| Asset ID | NASA Image ID | Frame Description & Historical Context | Film Magazine & Lens | Resolution & Size | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-PH-001** | `AS12-46-6749` | Surveyor 3 resting inside crater with LM Intrepid on distant horizon | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.8 MB | Preserved & Active |
| **A12-PH-002** | `AS12-46-6739` | Pete Conrad operating the MESA on LM Intrepid Quad II | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.6 MB | Preserved & Active |
| **A12-PH-003** | `AS12-46-6813` | Alan Bean carrying the ALSEP subpackages with deployment rod | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.7 MB | Preserved & Active |
| **A12-PH-004** | `AS12-47-6913` | Conrad at the MESA with thermal blankets and rock collection bags | Mag 47/V, 60mm Biogon | $4000\times 4000\text{px}$, 1.5 MB | Preserved & Active |
| **A12-PH-005** | `AS12-47-6988` | Deployed US flag casting sharp shadow across compacted footprints | Mag 47/V, 60mm Biogon | $4000\times 4000\text{px}$, 1.9 MB | Preserved & Active |
| **A12-PH-006** | `AS12-48-7099` | Close-up of Surveyor 3 footpad 2 and mechanical scoop impressions | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 2.1 MB | Preserved & Active |
| **A12-PH-007** | `AS12-48-7121` | Surveyor 3 tilted at $11.8^\circ$ on crater wall showing photolysis | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 1.9 MB | Preserved & Active |
| **A12-PH-008** | `AS12-48-7133` | Pete Conrad standing beside Surveyor 3 with bolt cutters | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 2.2 MB | Preserved & Active |
| **A12-PH-009** | `AS12-51-7507` | Intrepid photographed in landing configuration during descent | Mag 51/R, 80mm Planar | $4000\times 4000\text{px}$, 1.4 MB | Preserved & Active |

---

## 3. Preserved Canonical Asset Verification (57 Core Assets)

All 57 primary research assets identified in Phase 00 and Phase 01 remain 100% preserved in their exact canonical repository paths:
- `assets/3d_models/lunar_module/apollo_lunar_module.glb` (Official NASA GLB with Draco compression)
- `assets/3d_models/surveyor_3/surveyor_3_lander.obj` & `.mtl` (23-mesh authentic OBJ)
- `assets/3d_models/alsep_instruments/alsep_central_station.obj` & `.mtl`
- `assets/3d_models/alsep_instruments/snap27_rtg.obj` & `.mtl`
- `assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj` & `.mtl`
- `assets/terrain_and_cartography/elevation_and_dem/surveyor_crater_topography_profile.json`
- `assets/terrain_and_cartography/traverse_maps/traverse_waypoints.geojson`
- `assets/terrain_and_cartography/lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg`
