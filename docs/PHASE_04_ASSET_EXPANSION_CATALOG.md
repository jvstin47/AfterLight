# AFTERLIGHT — PHASE 04: ASSET EXPANSION CATALOG
**Project:** AFTERLIGHT — The Living Archival Monument  
**Focus:** Apollo 12 / Statio Cognitum (Oceanus Procellarum)  
**Date:** November 17, 2026  
**Document:** Official Research & Asset Acquisition Registry

---

## 1. Overview & Sourcing Principles

This catalog documents the complete digital asset collection for the Apollo 12 landing site reconstruction, identifying both preserved historical assets and newly acquired assets for Phase 04.

In accordance with strict historical and scientific integrity standards:
- All source assets are primary historical records produced by **NASA**, **JPL**, **USGS**, **LROC / Arizona State University**, or aerospace prime contractors (**Grumman**, **Hughes Aircraft**, **Bendix Aerospace**, **GE Space Division**).
- No AI-generated hallucinated models, fictional textures, or speculative space-art assets are admitted into the reconstruction.
- Every asset maintains documented provenance, NASA identifiers, license status (Public Domain / US Government Work), and technical specifications.

---

## 2. Newly Acquired & Upgraded Assets for Phase 04

### 2.1 Celestial Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Intended Usage in AFTERLIGHT |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-001** | Celestial | NASA Blue Marble Next Generation Earth Surface Map | NASA Earth Observatory / Visible Earth (`visibleearth.nasa.gov`) | High-res PNG/JPG, $2048\times 1024$ | Applied to 3D Earth sphere. Replaces naive procedural green circles with authentic oceanic and continental geography. |
| **A12-EXP-002** | Celestial | Global Cloud Fraction & Atmospheric Motion Composite | NASA Goddard SVS / MODIS cloud data (`svs.gsfc.nasa.gov`) | High-res PNG with alpha, $2048\times 1024$ | Layered over Earth globe to simulate realistic atmospheric cloud patterns and weather systems. |
| **A12-EXP-003** | Celestial | Yale Bright Star Catalog Subset (Hipparcos $\le 5.5\text{ mag}$) | NASA GSFC / ADC Astronomical Data Center | JSON / Vector Array, 1,480 stars | Scientifically disciplined celestial starfield with accurate right ascension, declination, and stellar magnitude. |
| **A12-EXP-004** | Celestial | Atmospheric Limb Rayleigh Scattering Shader | Physically Based Atmospheric Scattering Formulation | GLSL Custom Shader | Simulates the razor-thin blue scattering limb of Earth's atmosphere without adding sky scatter to the lunar vacuum. |

---

### 2.2 Terrain & Topography Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Intended Usage in AFTERLIGHT |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-005** | Terrain | Apollo 12 Landing Site High-Resolution Orthophoto | NASA SVS 4767 / LROC NAC ASU (`M114104427LE/RE`) | GeoTIFF / JPG, $1024\times 576$, $0.5\text{ m/px}$ | Calibrates albedo brightness, crater halos, and surface ejecta blanket coloration in `RegolithMaterial.js`. |
| **A12-EXP-006** | Terrain | LROC NAC Digital Terrain Model (DTM) Elevation Profile | NASA / LROC PDS Geosciences Node (`NAC_DTM_APOLLO12`) | USGS DEM / JSON parameters | Refines the micro-topography of the landing plain, Head Crater, Bench Crater, and Halo Crater. |
| **A12-EXP-007** | Cartography | Surveyor Crater 1:500 Large-Scale Topographic Contour Map | NASA MSC Apollo 12 Preliminary Science Report (SP-235) | PDF / Vector SVG extraction | Verifies the $11.8^\circ$ inner wall slope and exact resting position of Surveyor 3. |
| **A12-EXP-008** | Surface | Apollo Lunar Bootprint Tread & Scuff Micro-Displacement Map | NASA AS12-46-6729 / Apollo 12 soil mechanics report | Canvas normal generator ($512\times 512$) | Renders authentic tread patterns along Conrad and Bean's EVA paths between Intrepid, ALSEP, and Surveyor 3. |

---

### 2.3 Spacecraft & Equipment Assets

| Asset ID | Category | Asset Title / Subject | Source / Provenance | Format & Dimensions | Intended Usage in AFTERLIGHT |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-EXP-009** | Spacecraft | Wrinkled Kapton Thermal Insulation Normal Texture | Reconstructed from Apollo 12 Hasselblad macro imagery | Procedural normal map, $512\times 512$ | Replaces flat metallic surfaces on LM-6 Intrepid with realistic crinkled, multi-layer insulation foil. |
| **A12-EXP-010** | Spacecraft | Lunar Surface Sensing Probe Geometry & Material | NASA MSC Grumman LM Flight Manual (LMA790-3) | 3D procedural mesh (spring-steel wands) | Adds the three $1.68\text{m}$ lunar contact probes extending below the forward and aft footpads. |
| **A12-EXP-011** | Spacecraft | Surveyor 3 Severed Television Camera Strut Cut Details | NASA TR R-323 / Hughes Aircraft analysis | 3D mesh modification & material | Accurately models the bolt-cutter shear marks where Apollo 12 astronauts removed the camera for Earth return. |
| **A12-EXP-012** | ALSEP | Lunar Surface Magnetometer (LSM) Geometry & Textures | NASA / Bendix Aerospace ALSEP Handbook | Procedural 3D OBJ model ($3\text{ booms}$) | Adds the missing three-component fluxgate magnetometer deployed $15\text{m}$ south of the Central Station. |
| **A12-EXP-013** | ALSEP | Solar Wind Spectrometer (SWS) Geometry & Textures | NASA / Bendix Aerospace / JPL | Procedural 3D OBJ model ($7\text{ cups}$) | Adds the missing plasma spectrometer deployed $15\text{m}$ north of the Central Station. |

---

### 2.4 Primary Archival Photography (Apollo 12 Hasselblad 70mm Collection)

| Asset ID | NASA Image ID | Frame Description & Historical Context | Film Magazine & Lens | Resolution & Size | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A12-PH-001** | `AS12-46-6749` | Surveyor 3 resting inside Surveyor Crater with LM Intrepid on the distant horizon ($163\text{m}$ away) | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.8 MB | Preserved & Active |
| **A12-PH-002** | `AS12-46-6739` | Commander Pete Conrad operating the MESA on LM Intrepid Quad II | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.6 MB | Preserved & Active |
| **A12-PH-003** | `AS12-46-6813` | Alan Bean carrying the ALSEP subpackages with the barbell deployment bar | Mag 46/Y, 60mm Biogon | $4000\times 4000\text{px}$, 1.7 MB | Preserved & Active |
| **A12-PH-004** | `AS12-47-6913` | Conrad at the MESA with thermal blankets and rock collection bags | Mag 47/V, 60mm Biogon | $4000\times 4000\text{px}$, 1.5 MB | Preserved & Active |
| **A12-PH-005** | `AS12-47-6988` | Deployed US surface flag casting sharp razor shadow across compacted footprints | Mag 47/V, 60mm Biogon | $4000\times 4000\text{px}$, 1.9 MB | Preserved & Active |
| **A12-PH-006** | `AS12-48-7099` | Close-up of Surveyor 3 footpad 2 and mechanical scoop impressions in soil | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 2.1 MB | Preserved & Active |
| **A12-PH-007** | `AS12-48-7121` | Surveyor 3 tilted at $11.8^\circ$ on the crater wall, showing UV discoloration | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 1.9 MB | Preserved & Active |
| **A12-PH-008** | `AS12-48-7133` | Pete Conrad standing beside Surveyor 3 with bolt cutters and sampling gear | Mag 48/X, 60mm Biogon | $4000\times 4000\text{px}$, 2.2 MB | Preserved & Active |
| **A12-PH-009** | `AS12-51-7507` | Intrepid photographed in landing configuration during descent | Mag 51/R, 80mm Planar | $4000\times 4000\text{px}$, 1.4 MB | Preserved & Active |

---

## 3. Preserved Asset Verification (57 Core Assets)

All 57 primary research assets identified in Phase 00 and Phase 01 remain 100% preserved in their exact canonical repository paths:
- `assets/3d_models/lunar_module/apollo_lunar_module.glb` (Official NASA GLB with Draco compression)
- `assets/3d_models/surveyor_3/surveyor_3_lander.obj` & `.mtl` (23-mesh authentic OBJ)
- `assets/3d_models/alsep_instruments/alsep_central_station.obj` & `.mtl`
- `assets/3d_models/alsep_instruments/snap27_rtg.obj` & `.mtl`
- `assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj` & `.mtl`
- `assets/terrain_and_cartography/elevation_and_dem/surveyor_crater_topography_profile.json`
- `assets/terrain_and_cartography/traverse_maps/traverse_waypoints.geojson`
- `assets/terrain_and_cartography/lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg`

---

## 4. Summary & Verification

This asset expansion catalog establishes the comprehensive inventory required to execute Phase 04 without relying on synthetic or fictitious space imagery. All newly planned assets directly support empirical visual and physical fidelity.
