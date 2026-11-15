# Third-Party Notices & Asset Attributions

**Project:** AFTERLIGHT  
**Last Updated:** November 2026  

This document provides formal credit, provenance records, and copyright/usage notices for third-party media, datasets, and models included in the AFTERLIGHT repository.

---

## 1. NASA Media & Archival Assets

### 1.1 Overview & General NASA Media Policy
Unless otherwise noted, imagery, video, audio, and documents produced by the National Aeronautics and Space Administration (NASA) are works of the United States Government and are generally in the **Public Domain** (17 U.S.C. § 105).

However, public domain status is subject to specific statutory restrictions:
- **No Endorsement:** NASA material cannot be used to state or imply the endorsement by NASA or by any NASA employee of a commercial product, service, or activity.
- **Astronaut Likeness Rights:** NASA images featuring recognizable astronauts (e.g., Charles "Pete" Conrad, Alan L. Bean, Richard F. Gordon) may be subject to rights of publicity, personality, and privacy under state and federal law. Commercial exploitation requires independent permission.
- **NASA Insignia & Logos:** The NASA "meatball" insignia, "worm" logotype, and official mission seals are protected under 14 CFR Part 1221 and cannot be used without explicit written authorization from NASA Headquarters.

---

## 2. Archival Surface Photography

**Source Institution:** NASA Johnson Space Center (formerly Manned Spacecraft Center) / Apollo Lunar Surface Journal (ALSJ)  
**Photographic System:** Hasselblad 500EL 70mm data cameras with Zeiss 60mm Biogon lenses.

| Asset ID | Image ID | Title / Subject | Source Archive | License / Status |
| :--- | :--- | :--- | :--- | :--- |
| `A12-004` | AS12-48-7134 | Pete Conrad visiting Surveyor 3 with Intrepid in background | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-002` | AS12-48-7133 | Pete Conrad inspecting Surveyor 3 TV Camera | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-003` | AS12-48-7099 | Close-up of Surveyor 3 footpad in lunar soil | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-005` | AS12-48-7121 | Surveyor 3 resting on 11° slope of Surveyor Crater | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-006` | AS12-48-7136 | Surveyor 3 and LM Intrepid wide panorama | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-008` | AS12-46-6790 | Alan Bean fueling SNAP-27 RTG with Hanford tool | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-009` | AS12-46-6807 | Alan Bean carrying ALSEP Subpackages 1 & 2 | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-011` | AS12-47-6918 | Deployed ALSEP Central Station & experiments | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-012` | AS12-47-6919 | Alan Bean adjusting ALSEP instrumentation | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-010` | AS12-46-6813 | Alan Bean deploying Lunar Surface Magnetometer | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-015` | AS12-46-6749 | Intrepid egress ladder and commemorative plaque | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-016` | AS12-47-6913 | Pete Conrad working at LM MESA bay | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-017` | AS12-47-6988 | US flag, LM shadow, and compacted footprints | NASA Images API / ALSJ | Public Domain (US Gov) |
| `A12-019` | AS12-51-7507 | LM Intrepid in landing configuration in orbit | NASA Images API / ALSJ | Public Domain (US Gov) |

**Credit Line:** Courtesy NASA / Johnson Space Center.

---

## 3. Planetary Cartography & Orbital Imagery

### 3.1 Lunar Reconnaissance Orbiter Camera (LROC) & SVS
- **Asset:** `NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg`
- **Source:** NASA Scientific Visualization Studio (SVS Entry 4767) / Goddard Space Flight Center (GSFC).
- **Primary Data Provider:** Arizona State University (ASU) / LROC Science Operations Center (Mark Robinson, Principal Investigator).
- **Frames Utilized:** LROC Narrow Angle Camera (NAC) stereo pair frames `M175428601LE` and `M175428601RE`.
- **Status:** Public Domain (NASA / NASA PDS).
- **Credit Line:** NASA / Goddard Space Flight Center / Scientific Visualization Studio / Arizona State University.

### 3.2 Mission Mapping Overlays
- **Asset:** `Apollo_12_EVA_2_Traverse_Overlay_S69-59538.jpg`
- **Source:** NASA Manned Spacecraft Center Mission Operations Directorate (1969).
- **Status:** Public Domain (US Gov).

---

## 4. Historical Technical Reports & Mission Documentation

All technical documents are sourced from the NASA Technical Reports Server (NTRS):

1. **Apollo 12 Mission Report (MSC-01855)**
   - **Document ID:** NTRS 19760072997
   - **Author:** NASA Manned Spacecraft Center (Houston, Texas)
   - **Publication Date:** March 1970
   - **Status:** Public Domain (US Gov).

2. **Test and Evaluation of the Surveyor 3 Television Camera Returned from the Moon by Apollo 12**
   - **Document ID:** NTRS 19710024418 / NASA SP-284
   - **Author:** Hughes Aircraft Company / NASA JPL / MSC Surveyor 3 Lunar Evaluation Team
   - **Publication Date:** 1971
   - **Status:** Public Domain (US Gov).

---

## 5. 3D Models & Spacecraft Geometry

### 5.1 Apollo Lunar Module (LM)
- **Asset:** `apollo_lunar_module.glb`
- **Source:** NASA 3D Resources (`nasa/NASA-3D-Resources` on GitHub / NASA Science).
- **Original Modeling:** NASA Ames Research Center / Grumman Aerospace historical CAD data.
- **Status:** Public Domain (NASA Work).

### 5.2 Surveyor 3 & ALSEP Custom Reconstructions
- **Assets:** `surveyor_3_lander.obj`, `alsep_central_station.obj`, `snap27_rtg.obj`, `alsep_passive_seismic_experiment.obj`.
- **Authorship:** Authored specifically for AFTERLIGHT based on dimensioned engineering drawings published in NASA TR-32-1177 and NASA SP-235.
- **License:** Governed under the project's MIT License for original geometries.

---

## 6. External Conceptual References

### GEOMETRIC (geometric-art.com)
- **Asset Documented:** `assets/visual_references_and_mood/generative_and_geometric_art_references.md`
- **Creator:** SHINICHI (@shinichi_sisberry)
- **Role:** Consulted strictly as an external visual reference for browser-based scanline, contour, and node-network generative techniques.
- **Note:** No proprietary source code, copyrighted assets, or backend assets from geometric-art.com are embedded in this repository.
