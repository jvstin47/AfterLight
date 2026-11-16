# AFTERLIGHT — MISSING ASSETS, RECTIFIED ENTRIES & CANDIDATE ACQUISITIONS

**Project:** AFTERLIGHT — The Living Archival Monument  
**Landing Site:** Statio Cognitum (Apollo 12)  
**Revision:** Phase 04.1 Audit Verification  
**Date:** November 17, 2026

---

## 1. Executive Summary

This register tracks assets, datasets, and identifiers that were flagged during the Phase 04.1 audit as missing, erroneous, or currently substituted with procedural reconstructions.

It defines clear remediation pathways for future development phases.

---

## 2. Investigated & Rectified Identifiers

| Identifier / Product | Initial Claim | Audit Investigation Finding | Rectification / Status |
| :--- | :--- | :--- | :--- |
| **`M114104427LE/RE`** | Claimed as LROC NAC stereo pair for Apollo 12 | **HALLUCINATED / NON-EXISTENT**. Zero records in ASU LROC PDS database. | **EXPUNGED**. Permanently replaced by authentic stereo pair `M120005333LE/RE` & `M120012135LE/RE` and nadir frame `M175428601LE/RE`. |
| **`NASA_SVS_4767...jpg`** | Claimed as active terrain orthophoto | Exists on disk (232 KB GIMP-exported JPEG) but is **unlinked** in code. | **RETAINED AS REFERENCE**. Procedural regolith PBR currently provides higher fidelity lighting response than static sRGB JPEG. |

---

## 3. Procedural Implementations Subject to Future Raster/Data Acquisition

The following items are currently functioning effectively as procedural code implementations in WebGL, but could be upgraded to authentic NASA/astronomical raster data in Phase 05 if memory and network budgets permit:

### 3.1 External Earth Texture Map (Targeting A12-EXP-001)
- **Current State:** Dynamic in-memory HTML5 `<canvas>` ($1024\times 512$) drawing simplified continental vectors.
- **Candidate Upgrade:** Official NASA Visible Earth *Blue Marble: Next Generation* $2048\times 1024$ equirectangular PNG.
- **Acquisition Source:** NASA Earth Observatory (`visibleearth.nasa.gov/images/73909/december-blue-marble-next-generation`).
- **Prerequisites:** Evaluation of WebGL texture memory footprint and asset loader pipeline.

### 3.2 External Cloud Composite (Targeting A12-EXP-002)
- **Current State:** Procedural bezier arc paths on canvas context.
- **Candidate Upgrade:** NASA SVS / MODIS global cloud composite with alpha transparency ($2048\times 1024$).
- **Acquisition Source:** NASA Goddard SVS (`svs.gsfc.nasa.gov`).

### 3.3 Astronomical Star Catalog (Targeting A12-EXP-003)
- **Current State:** 1,800 pseudo-random points with physical solar glare cone suppression.
- **Candidate Upgrade:** Parsed subset of the ESA Hipparcos / Yale Bright Star Catalog containing stars down to visual magnitude $m_v \le 5.5$ (approx. 1,480 verified stellar positions, spectral types, and coordinates).
- **Format:** Compact JSON or typed binary array (`Float32Array`).

### 3.4 Raw Binary DEM Displacement Tile (Targeting A12-EXP-006)
- **Current State:** Analytical mathematical heightfield evaluated in `LunarTerrain.js` parameterized from USGS profile data.
- **Candidate Upgrade:** 32-bit floating-point or 16-bit PNG displacement heightmap cropped directly from `NAC_DTM_APOLLO12` ($1024\times 1024$ tile covering the central $2\text{km} \times 2\text{km}$ landing area).
- **Format:** 16-bit grayscale PNG or WebGL floating-point texture (`gl.R32F`).
