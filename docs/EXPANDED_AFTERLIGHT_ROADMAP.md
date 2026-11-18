# AFTERLIGHT — Expanded Global Roadmap & Prioritization Matrix

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-EAM-013  
**Strategic Horizon:** Phases 02.5 through 06  
**Focus:** Asset Reuse Analysis, 4-Tier Site Prioritization, and 3D Environment Expansion Roadmap  

---

## 1. Existing Asset-to-Record Mapping

AFTERLIGHT possesses a verified asset library created during Phases 01 through 04. This asset mapping demonstrates how existing geometry, shaders, and photographic archives are leveraged across multiple destinations:

| Existing Asset File | Current Use | Reusable Across New Archive Experiences | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| `assets/3d_models/lunar_module/apollo_lunar_module.glb` | Apollo 12 LM-6 *Intrepid* | **Apollo 11, Apollo 14** (Direct geometry reuse; alternate decal/plaque); **Apollo 15, 16, 17** (Baseline J-series descent chassis). | Grumman LM descent stages shared an identical core structural frame, TRW engine, and landing gear. |
| `assets/3d_models/surveyor_3/surveyor_3_lander.obj` | Apollo 12 Surveyor 3 | **Surveyor 1, 5, 6, 7** (Baseline spacecraft frame; adjust presence/absence of scoop arm and alpha-scatterer). | Hughes Aircraft built Surveyors 1 through 7 on the identical triangular aluminum tubular space frame. |
| `assets/3d_models/alsep_instruments/snap27_rtg.obj` | Apollo 12 SNAP-27 | **Apollo 14, 15, 16, 17** (Identical General Electric RTG cask and cooling fin envelope). | The SNAP-27 generator design was identical across all ALSEP deployments. |
| `assets/3d_models/alsep_instruments/alsep_central_station.obj` | Apollo 12 ALSEP CS | **Apollo 14, 15, 16, 17** (Bendix Central Station enclosure and helical S-band antenna). | Standardized Bendix telemetry box used across all ALSEP flights. |
| `assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj` | Apollo 12 PSE | **Apollo 11 (EASEP PSEP), Apollo 14, 15, 16** (Specular Mylar 10-sided skirt). | Same Teledyne / Bendix thermal skirt geometry. |
| `src/scene/RegolithMaterial.js` | Procedural Regolith Shader | **Universal Lunar Surface Basemap** (Dynamically tweak albedo, roughness, and crater density for highlands vs maria). | Shader accurately computes Hapke-like opposition surges and phase curves across all lunar latitudes. |
| `src/scene/LunarLighting.js` | Physical Sun/Earth/Starfield | **Universal Ephemeris Lighting Engine** (Computes correct subsolar point and Earth altitude for any given latitude/longitude). | Lighting mathematics supports arbitrary selenographic coordinates $(\phi, \lambda)$. |

---

## 2. 4-Tier Site Prioritization Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       4-TIER DESTINATION MATRIX                             │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ TIER 1: FLAGSHIP SITES  │ TIER 2: HISTORIC SITES  │ TIER 3: SURFACE RECORDS │
│ Full 3D Interactive    │ Detailed DTM Cartography│ Selenographic pins,     │
│ Destinations            │ & Deep Dossiers         │ specs, and archival logs│
│ • Statio Cognitum (A12) │ • Hadley-Apennine (A15) │ • Surveyor 1, 5, 6, 7   │
│ • Tranquility Base (A11)│ • Descartes Highl. (A16)│ • Luna 9, 13, 16, 20, 24│
│ • Taurus-Littrow (A17)  │ • Fra Mauro (A14)       │ • Luna 2, Ranger impacts│
│ • Shiv Shakti (Ch-3)    │ • Lunokhod 1 (Luna 17)  │ • Beresheet, Hakuto-R   │
│ • Von Kármán (Chang'e 4)│ • Mons Rümker (Chang'e 5│ • IM-1 Odysseus         │
│                         │ • Shioli Crater (SLIM)  │                         │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
  TIER 4: FUTURE RESEARCH & EXPANSION
  Artemis III candidate zones, Shackleton Rim PSR, Lunar Gateway, CLPS manifests
```

---

## 3. Recommended Tier 1 Flagship Environments & Justification

Five lunar destinations warrant full, immersive 3D digital reconstructions:

### 1. Statio Cognitum — Apollo 12 & Surveyor 3 ($3.01^\circ\text{ S}, 23.42^\circ\text{ W}$)
- **Current Status:** **Operational Flagship Destination.**
- **Why It Matters:** The only place where human beings visited, inspected, and sampled a pre-existing robotic probe launched years earlier. Establishes the core temporal theme of AFTERLIGHT: human artifacts preserved across planetary time.

### 2. Statio Tranquillitatis — Apollo 11 ($0.67^\circ\text{ N}, 23.47^\circ\text{ E}$)
- **Recommended Flagship 02.**
- **Why It Matters:** Humanity's first physical landfall on another world. LM *Eagle*, the first footprints, EASEP seismometer, still-pinged LRRR retroreflector, the toppled nylon flag, and the stainless steel peace plaque.

### 3. Taurus-Littrow Valley — Apollo 17 & LRV-3 ($20.19^\circ\text{ N}, 30.77^\circ\text{ E}$)
- **Recommended Flagship 03.**
- **Why It Matters:** The most geologically dramatic Apollo site: a narrow valley between the $2,000\text{ m}$ North and South Massifs. The final human footprints of the 20th century, the famous duct-tape LRV fender repair, Shorty Crater's orange pyroclastic soil beads, and the final ALSEP nuclear array.

### 4. Shiv Shakti Point — Chandrayaan-3 & Pragyan ($69.37^\circ\text{ S}, 32.32^\circ\text{ E}$)
- **Recommended Flagship 04.**
- **Why It Matters:** The historic breakthrough landing in the southern high-latitude polar region. Highlights the modern Asian space renaissance, non-Western exploration leadership, Pragyan's elemental sulfur detection, and low-angle polar lighting casting dramatic elongated shadows across high-latitude terrain.

### 5. Von Kármán Crater — Chang'e 4 & Yutu-2 ($45.46^\circ\text{ S}, 177.59^\circ\text{ E}$)
- **Recommended Flagship 05.**
- **Why It Matters:** The world's first-ever landing on the **lunar far side**, inside the gargantuan South Pole-Aitken impact basin. Earth is completely invisible below the horizon, communications are routed via the Queqiao relay satellite at L2, and the lunar sky is completely black without Earthshine. Highlights deep-space radio quiet, ancient mantle geology, and the longest-operating rover in lunar history.

---

## 4. Phased Implementation Roadmap

```mermaid
gantt
    title AFTERLIGHT Strategic Evolution Roadmap
    dateFormat  YYYY-MM
    section Current
    Phase 02 / 04 : Statio Cognitum Environment :done, 2026-10, 2026-11
    Phase 02.5 : Global Archive Expansion Research :active, 2026-11, 2026-12
    section Phase 03
    Phase 03.1 : Global 3D Atlas Navigation Prototype :2026-12, 2027-01
    Phase 03.2 : Flags of the Moon Layer & Education :2027-01, 2027-02
    section Phase 04
    Phase 04.1 : Tranquility Base Flagship Environment :2027-02, 2027-03
    Phase 04.2 : Taurus-Littrow & LRV-3 Reconstruction :2027-03, 2027-04
    section Phase 05
    Phase 05.1 : Shiv Shakti Point & Pragyan Rover :2027-04, 2027-05
    Phase 05.2 : Chang'e 4 Far Side Flagship Site :2027-05, 2027-06
```

### Next Phase Recommendation
Upon review of Phase 02.5 deliverables, proceed to **Phase 03.1 (Global 3D Atlas Navigation Prototype)**, which will integrate the structured JSON datasets created in this phase into the global macroscopic globe, enabling users to orbit the entire Moon and select sites before descending into *Statio Cognitum*.
