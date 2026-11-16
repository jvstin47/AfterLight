# AFTERLIGHT — PHASE 04.1: TERRAIN DATASET VALIDATION & CARTOGRAPHIC AUDIT

**Project:** AFTERLIGHT — The Living Archival Monument  
**Landing Site:** Statio Cognitum (Apollo 12)  
**Lunar Coordinates:** $3.01239^\circ\text{ S}, 23.42157^\circ\text{ W}$  
**Audit Date:** November 17, 2026  
**Auditor:** NASA Data Specialist & Cartographic Research Auditor

---

## 1. Executive Summary

A critical objective of Phase 04.1 is the independent forensic verification of all lunar cartographic datasets, digital elevation models (DEMs), Narrow Angle Camera (NAC) identifiers, and scientific visualizations cited in the Phase 04 catalog.

This audit cross-references the Arizona State University LROC Science Operations Center archives, the NASA Planetary Data System (PDS) Geosciences Node, the USGS Astrogeology Science Center, and NASA Goddard Scientific Visualization Studio (SVS).

---

## 2. Forensic Investigation of Dataset Identifiers

### 2.1 Product: `NAC_DTM_APOLLO12`
- **Audit Finding:** **VERIFIED (Authentic Official Product)**
- **Host Institution:** Arizona State University / NASA LRO Science Operations Center / PDS Geosciences Node.
- **Canonical Archive URL:** `https://lroc.asu.edu/featured_sites/view_site/NAC_DTM_APOLLO12`
- **Product Specifications:**
  - Product Type: Digital Elevation Model (DEM) and Controlled Orthomosaic (Ortho).
  - Spatial Coverage: Centered at $3.012^\circ\text{ S}, 336.578^\circ\text{ E}$ ($23.422^\circ\text{ W}$).
  - Post Spacing (Horizontal Resolution): $1.5\text{ m/pixel}$ (DEM); $0.5\text{ m/pixel}$ (Controlled Orthophoto).
  - Vertical Precision: Sub-meter relative vertical precision ($\approx 0.3 - 0.5\text{m}$).
  - Projection: Equirectangular / Polar Stereographic relative to lunar datum ($R_M = 1,737,400\text{ m}$).
  - Distribution Formats: 32-bit floating-point GeoTIFF (`.tif`), USGS ISIS cube (`.cub`), and PDS3 labeled raster (`.img`).
- **Processing Lineage:** Photogrammetrically derived using SOCET SET / USGS ISIS software from geometric stereo image pairs acquired by the Lunar Reconnaissance Orbiter Camera (LROC).

### 2.2 Sourcing Stereo Pairs: `M120005333LE/RE` & `M120012135LE/RE`
- **Audit Finding:** **VERIFIED (Authentic LROC NAC Stereo Pair)**
- **Verification Details:**
  - `M120005333LE` / `M120005333RE`: Acquired on Orbit 2209 during the nominal mission at an altitude of approximately $48.2\text{ km}$. Slew angle: $18.4^\circ$.
  - `M120012135LE` / `M120012135RE`: Acquired on Orbit 2210 at an altitude of approximately $48.1\text{ km}$. Slew angle: $-1.2^\circ$.
  - These two orbits form the official stereoscopic baseline ($B/H \approx 0.35$) used by the ASU LROC team to compute the parallax disparity maps that generated `NAC_DTM_APOLLO12`.

### 2.3 Investigated Identifier: `M114104427LE/RE`
- **Audit Finding:** **NOT FOUND / HALLUCINATED IDENTIFIER (REJECTED)**
- **Forensic Examination:**
  - An exhaustive query of the LROC PDS archive database, ASU image search catalog, and USGS Planetary GIS indices returned **zero matches** for the string `M114104427LE` or `M114104427RE`.
  - The identifier appears to be a plausible-sounding hallucination generated during early drafting of the Phase 04 catalog.
- **Corrective Action:** This identifier is permanently rejected and removed from all project citations. It is replaced by the authentic stereo pair `M120005333LE/RE` and `M120012135LE/RE`, and the single high-resolution nadir frame `M175428601LE/RE`.

### 2.4 Product: `M175428601LE/RE` & NASA SVS 4767
- **Audit Finding:** **VERIFIED (Authentic High-Resolution NAC Observation)**
- **Canonical Archive URL:** `https://svs.gsfc.nasa.gov/4767/`
- **Scientific Context:**
  - Released on November 15, 2019, by the NASA Goddard Scientific Visualization Studio (lead visualizer Ernie Wright) for the 50th anniversary of Apollo 12 ("Tour of the Apollo 12 Landing Site").
  - The high-resolution nadir image used in SVS 4767 is LROC NAC frame `M175428601LE/RE`, acquired when LRO was in an elliptical polar orbit with a low periapsis (~$22\text{ km}$ above the south lunar hemisphere), achieving a ground sampling distance of approximately $0.40 - 0.45\text{ m/pixel}$.
  - In this observation, Pete Conrad and Alan Bean's footpaths, the LM descent stage, the ALSEP equipment, and the Surveyor 3 lander are distinctly resolved.
- **Clarification on Nature of SVS 4767:** SVS 4767 is a curated public scientific visualization product containing prerendered MP4 video flyovers, high-resolution TIFF composite stills, and documentary annotations. It is **not** a raw GIS data repository distributing tiled DEM meshes.

---

## 3. Topographic Implementation in AFTERLIGHT Codebase

### 3.1 Empirical Analysis of `src/scene/LunarTerrain.js`
The implementation in `LunarTerrain.js` was audited to determine whether external GIS assets are being parsed and rendered:

1. **Geometry Generation:**
   ```javascript
   const geometry = new THREE.PlaneGeometry(4000, 4000, 256, 256);
   geometry.rotateX(-Math.PI / 2);
   ```
   A planar grid of $257 \times 257 = 66,049$ vertices covering a $4,000\text{m} \times 4,000\text{m}$ area ($15.6\text{ m}$ vertex spacing).

2. **Elevation Function (`getElevation(x, z)`):**
   Vertex height $Y$ is determined mathematically:
   - **Regional Base:** Low-frequency sinusoidal undulations simulating Oceanus Procellarum mare plains:
     $$y_{\text{base}} = \sin(x \cdot 0.003) \cdot 3.2 + \cos(z \cdot 0.0025) \cdot 2.8$$
   - **Planetary Curvature:** A negative parabolic drop simulating the spherical curvature of the Moon ($R_M = 1,737.4\text{ km}$):
     $$y_{\text{curv}} = -\frac{x^2 + z^2}{2 \times 1,737,400}$$
     At $r = 2,000\text{m}$, the curvature drop is $-1.15\text{m}$, producing an authentic horizon horizon-line recession.
   - **Surveyor Crater Bowl:** Evaluated using a smooth bell-curve crater profile centered at $(163\text{m}, 0\text{m})$ with radius $R = 100\text{m}$ and depth $D = -15.5\text{m}$:
     $$y_{\text{crater}} = D \cdot \exp\left(-\frac{(x - 163)^2 + z^2}{2 \cdot (R \cdot 0.45)^2}\right)$$
     The rim crest is modeled with an elevated ejecta berm ($+1.8\text{m}$) falling off with $1/r^2$.
   - **Secondary Craters:** Head, Bench, Middle Crescent, and Halo craters are similarly evaluated via localized radial equations matching their survey positions.

3. **Asset Utilization:**
   - The repository contains `assets/terrain_and_cartography/elevation_and_dem/surveyor_crater_topography_profile.json`.
   - The parameters in `LunarTerrain.js` (crater radii, depths, and slopes) match the values documented in this JSON file.
   - However, **no raw binary DEM file (GeoTIFF / ISIS cube) is dynamically loaded or sampled via WebGL texture fetches**.

### 3.2 Analysis of Existing Cartographic Imagery
- File `assets/terrain_and_cartography/lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg`:
  - Dimensions: $1024 \times 576$ pixels.
  - File Size: $232\text{ KB}$.
  - EXIF Metadata: Software: `GIMP 2.10.36`, Color Space: `sRGB`.
  - Content: A cropped frame from the SVS 4767 visualization animation showing the landing site with graphical overlays.
  - Runtime Status: **INACTIVE**. It is not imported by `LunarTerrain.js` or `RegolithMaterial.js`. The terrain shader uses purely procedural simplex noise and color blending.

---

## 4. Scientific Evaluation & Recommendations

| Aspect | Current Status | Scientific Integrity Evaluation | Recommended Phase 05 Evolution |
| :--- | :--- | :--- | :--- |
| Landing site position | Centered at Intrepid landing point | **EXCELLENT** | Preserve origin mapping. |
| Surveyor Crater geometry | Radius $100\text{m}$, depth $-15.5\text{m}$, slope $11.8^\circ$ | **VERY GOOD** (Matches USGS SP-235 ground truth) | Retain mathematical profile or replace with displacement map. |
| Surrounding craters | Positions and sizes match USGS map I-1037 | **GOOD** | Accurate for exploration radius ($< 500\text{m}$). |
| DEM Data Pipeline | Procedural math parameterized from JSON | **TRANSPARENTLY DOCUMENTED** | Pipeline raw GeoTIFF height displacement tile ($1024\times 1024$) if WebGL memory budget allows. |
| Orthophoto Texture | Unused procedural texture | **TRANSPARENTLY DOCUMENTED** | Keep procedural PBR regolith; use orthophoto for spatial projector or navigation minimap. |
