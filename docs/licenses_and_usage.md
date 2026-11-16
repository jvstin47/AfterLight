# AFTERLIGHT — LICENSES & ASSET USAGE POLICY

**Project:** AFTERLIGHT — The Living Archival Monument  
**Landing Site:** Statio Cognitum (Apollo 12)  
**Revision:** Phase 04.1 Audit Verification  
**Date:** November 17, 2026

---

## 1. Overview & Dual Rights Architecture

The AFTERLIGHT project operates under a dual-rights architecture separating project-authored software and procedural algorithms from US Government public domain archival assets:

1. **Software & Procedural Assets (MIT License):**
   - All custom WebGL code, Three.js shaders, GLSL injection routines, dynamic canvas generation scripts, CSS layouts, and UI components are licensed under the [MIT License](file:///Users/justin/Public/projects/Afterlight/LICENSE).
2. **NASA Historical & Cartographic Assets (Public Domain / US Government Work):**
   - Under 17 U.S.C. § 105, works created by NASA civil servants (including 70mm Hasselblad photography, Apollo technical reports, LROC NAC imagery, and planetary orbital telemetry) reside in the Public Domain in the United States.

---

## 2. Asset Usage Classifications

| Asset Group | Items Included | Legal Status | Attribution Requirement |
| :--- | :--- | :--- | :--- |
| **Archival 70mm Photography** | `AS12-46-6749`, `AS12-46-6739`, `AS12-46-6813`, `AS12-47-6913`, `AS12-47-6988`, `AS12-48-7099`, `AS12-48-7121`, `AS12-48-7133`, `AS12-51-7507` | Public Domain (US Gov) | Credit: NASA / Johnson Space Center |
| **Orbital Cartography & DEMs** | `NAC_DTM_APOLLO12`, `M175428601`, `M120005333`, `M120012135`, NASA SVS 4767 | Public Domain (NASA / ASU) | Credit: NASA / GSFC / Arizona State University |
| **Technical Documentation** | NASA SP-235, MSC-01855, Grumman LMA790-3, Hughes HAC SSD 68045R, Bendix ATM-233 | Public Domain / Declassified US Gov | Credit: NASA / Contractor Technical Archives |
| **3D Models (Base Meshes)** | `apollo_lunar_module.glb`, `surveyor_3_lander.obj`, `alsep_central_station.obj`, `snap27_rtg.obj`, `alsep_passive_seismic_experiment.obj` | NASA 3D Resources / Public Domain | Credit: NASA 3D Asset Library |
| **Procedural Shaders & Code** | `RegolithMaterial.js` (Hapke opposition surge), `LunarLighting.js` (Rayleigh limb & canvas Earth), `LunarTerrain.js` (analytical heightfield) | MIT License | Copyright (c) 2026 AFTERLIGHT Authors |

---

## 3. Statutory Restrictions & Moral Rights

1. **Personality & Publicity Rights:**
   - Hasselblad imagery depicting astronauts Pete Conrad, Alan Bean, and Dick Gordon is protected by personality rights. It cannot be used in a commercial product endorsement or advertising context without consent from the individuals or their estates.
2. **NASA Insignia & Logos:**
   - The NASA insignia, logotype, and mission emblems remain protected under 14 CFR Part 1221 and cannot be used to imply official endorsement of any downstream derivative work.
3. **No Warranty / Scientific Disclaimer:**
   - While mathematical and ephemeris calculations in AFTERLIGHT are audited against NASA records, all software and procedural models are provided "as-is" without warranty of any kind.
