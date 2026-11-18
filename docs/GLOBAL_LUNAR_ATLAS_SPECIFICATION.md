# AFTERLIGHT — Global Lunar Atlas Technical Specification

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-GLA-009  
**Specification:** Interactive Cartographic Engine, Spatial Filtering, Projection Geometry, and Navigation UX  
**Compliance:** Mean Earth/Polar Axis (ME) Datum ($R = 1,737.4\text{ km}$), WebGL / Three.js Shading Pipeline  

---

## 1. Engine Architecture & Interaction Model

The Global Lunar Atlas is the macroscopic navigational shell of AFTERLIGHT. It provides a seamless visual progression from orbital contemplation down to localized artifact inspection:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       3-TIER CAMERA NAVIGATION ZOOM                         │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ MACRO: GLOBAL SPHERE    │ MESO: REGIONAL BASIN    │ MICRO: LOCAL SITE       │
│ Altitude: 3,000–10,000 km│ Altitude: 50–500 km     │ Altitude: 1–50 meters   │
│ Full 3D rotating globe  │ Basin boundaries, crater│ LROC stereo DTM, 3D     │
│ with mission pins, mare │ rings, regional geology,│ hardware meshes, EVA    │
│ labels & terminator.    │ rover traverses.        │ footpaths & artifacts.  │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 2. Multi-Dimensional Filtering Subsystem

The atlas implements a high-performance, non-blocking multidimensional faceted filter matrix driven by the reactive State Store:

### 2.1 Filter Dimensions

1. **Spacefaring Nation & Agency (`filterByAgency`):**
   - `ALL` (Global international overview)
   - `NASA` (United States — Apollo, Surveyor, Ranger, LRO, CLPS)
   - `USSR` (Soviet Union — Luna, Lunokhod)
   - `CNSA` (China — Chang'e, Yutu)
   - `ISRO` (India — Chandrayaan, Pragyan)
   - `JAXA` (Japan — Hiten, Kaguya, SLIM, SORA-Q)
   - `COMMERCIAL` (SpaceIL, ispace, Intuitive Machines, Astrobotic)

2. **Historical Timeline & Era (`filterByEra`):**
   - `ALL_TIME` (1959–Present)
   - `ERA_01_FIRST_CONTACTS` (1959–1965: Luna 1–3, Ranger)
   - `ERA_02_FIRST_LANDINGS` (1966–1968: Luna 9, Surveyor 1–7)
   - `ERA_03_CREWED_APOLLO` (1968–1972: Apollo 8–17)
   - `ERA_04_ROBOTIC_DORMANT` (1973–1990s: Lunokhod 2, Luna 24)
   - `ERA_05_MODERN_ORBITAL` (1990s–2010s: Clementine, Prospector, Chandrayaan-1, LRO)
   - `ERA_06_NEW_RENAISSANCE` (2010s–Present: Chang'e 3–6, Chandrayaan-3, SLIM, IM-1)

3. **Mission Outcome & Status (`filterByOutcome`):**
   - `SOFT_LANDING_SUCCESS` (Active or permanent preserved surface installations)
   - `HARD_IMPACT_INTENTIONAL` (Science impactors: Luna 2, Ranger, S-IVBs, LCROSS, MIP)
   - `HARD_IMPACT_UNINTENTIONAL` (Descent failures: Beresheet, Vikram Ch-2, Hakuto-R, Luna 25)
   - `ORBITAL_MISSION` (Satellites: Luna 10, Lunar Orbiter 1–5, Kaguya, LRO)
   - `PLANNED_FUTURE` (Artemis, VIPER, Chang'e 7/8, Chandrayaan-4)

4. **Artifact Category (`filterByCategory`):**
   - `ALL_CATEGORIES`
   - `CREWED_LANDING_BASES` (Apollo 11, 12, 14, 15, 16, 17)
   - `PLANETARY_ROVERS` (LRV 1–3, Lunokhod 1–2, Yutu 1–2, Pragyan, SORA-Q)
   - `ROBOTIC_SURFACE_LANDERS` (Surveyor, Luna landers, Chang'e landers, Vikram, SLIM, IM-1)
   - `SCIENTIFIC_STATIONS` (ALSEP, LRRR retroreflectors, SNAP-27 RTGs)
   - `FLAGS_AND_MARKERS` (Apollo LFAs, Chang'e 5 flag, Soviet pennants)

---

## 3. Spatial Uncertainty & Marker Rendering Specification

To prevent misleading spatial representations, markers do not simply display pinpoint needles on uncertain crash zones. The atlas renders **radial uncertainty buffers**:

```javascript
/**
 * Selenographic Marker Schema with Radial Uncertainty Buffer
 */
interface SelenographicMarker {
  id: string;                      // Stable unique identifier (e.g. 'luna-02')
  name: string;                    // Human-readable title
  designation: string;             // Official registration code
  latitude: number;                // Decimal degrees (-90.0 to +90.0)
  longitude: number;               // Decimal degrees (-180.0 to +180.0)
  uncertaintyRadiusMeters: number; // Uncertainty circle (e.g. 1m vs 30,000m)
  outcome: 'SOFT_LANDING_SUCCESS' | 'HARD_IMPACT_INTENTIONAL' | 'HARD_IMPACT_UNINTENTIONAL';
  iconType: 'pin' | 'rover' | 'impact_crater' | 'flag' | 'satellite';
  colorHex: string;                // Archival theme color
}
```

### Visual Rendering Rules
1. **Confirmed Precision Sites ($r_u \le 5\text{ m}$):** Sharp, solid ring glyph with centered optical fiducial crosshair (`+`).
2. **Intermediate Sites ($5\text{ m} < r_u \le 500\text{ m}$):** Ring glyph with faint concentric outer boundary halo indicating possible touchdown footprint.
3. **Broad Uncertainty / Historical Impact Zones ($r_u > 500\text{ m}$):** Translucent circular shaded boundary disc drawn directly onto the lunar surface texture corresponding to the actual mathematical radius of uncertainty. The marker label floats over the calculated centroid with an explicit "$\pm X\text{ km}$" uncertainty pill.

---

## 4. Selenographic Great-Circle Telemetry Engine

When inspecting any site on the globe, the atlas dynamically computes real-time spherical separation metrics relative to the current active viewport and the *Statio Cognitum* datum:

1. **Angular Central Separation ($\Delta\sigma$):**
   $$\Delta\sigma = \arccos\left(\sin\phi_1\sin\phi_2 + \cos\phi_1\cos\phi_2\cos(\lambda_2 - \lambda_1)\right)$$

2. **Surface Distance ($D$):**
   $$D = 1,737.4\text{ km} \times \Delta\sigma$$

3. **Initial Compass Bearing ($\theta$):**
   $$\theta = \text{atan2}\left(\sin\Delta\lambda \cos\phi_2, \; \cos\phi_1\sin\phi_2 - \sin\phi_1\cos\phi_2\cos\Delta\lambda\right)$$
