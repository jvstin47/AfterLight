# AFTERLIGHT — Global Lunar Archive Scope & Vision Specification

**Project:** AFTERLIGHT — The Living Archival Monument  
**Phase:** 02.5 — Global Lunar Archive Expansion & Knowledge Architecture  
**Document ID:** DOC-GLA-001  
**Classification:** Core Vision & Strategic Scope Definition  

---

## 1. Executive Mandate & Strategic Vision

AFTERLIGHT is expanding from its foundational Apollo 12 / *Statio Cognitum* digital monument into a permanent, comprehensive, globally navigable digital archive of human lunar exploration.

The Moon is not a collection of isolated photographic backdrops; it is a complete celestial body bearing over six decades of international science, robotics, manned voyages, industrial machinery, and cultural artifacts. Over 200 metric tons of human-manufactured hardware, scientific observatories, descent stages, and discarded components reside in its regolith and vacuum.

AFTERLIGHT unites four foundational pillars into a singular digital monument:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             AFTERLIGHT                                      │
├──────────────────────────────────────┬──────────────────────────────────────┤
│    1. GLOBAL LUNAR HERITAGE ATLAS    │   2. HISTORICAL EXPLORATION ARCHIVE  │
│  Data-driven selenographic atlas     │  Complete chronological timeline of  │
│  spanning near-side, far-side, and   │  human lunar missions (1959–present) │
│  polar regions with explicit         │  incorporating US, Soviet, Chinese,  │
│  spatial coordinates & uncertainty.  │  Indian, Japanese & commercial logs. │
├──────────────────────────────────────┼──────────────────────────────────────┤
│    3. SCIENTIFIC KNOWLEDGE SYSTEM    │   4. INTERACTIVE ARTIFACT MUSEUM     │
│  Educational exposition of lunar     │  Engineering records of flight       │
│  geology, physical vacuum, radiation,│  hardware, descent engines, rovers,  │
│  seismology, and surface experiments.│  cameras, tools & documented flags.  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Preservation of Statio Cognitum (Apollo 12)

The current Apollo 12 / *Statio Cognitum* environment ($3.01239^\circ\text{ S}, 23.42157^\circ\text{ W}$) remains AFTERLIGHT's **flagship destination and datum anchor**.

All existing Apollo 12 assets are strictly preserved:
- LM-6 *Intrepid* descent stage 3D geometry and Grumman engineering specifications.
- Surveyor 3 robotic probe and crater slope geometry.
- ALSEP Array A scientific packages (Central Station, SNAP-27 RTG, Passive Seismic Experiment, Magnetometer, Solar Wind Spectrometer, Suprathermal Ion Detector).
- NASA 70mm Hasselblad surface photography scans and vidicon calibration layers.
- EVA-1 and EVA-2 traverse trajectories and geological sampling stations.
- 3D positional Web Audio beacons, Quindar tele-command tones, and spacesuit ECS acoustic synthesis.

Under the expanded global architecture, *Statio Cognitum* serves as the prime selenodetic reference benchmark from which global great-circle distances, azimuth bearings, and comparative historical narratives originate.

---

## 3. Global Representation & International Inclusivity

Human lunar exploration is inherently international. The archive rejects mono-national framing and provides comprehensive, rigorous coverage across all spacefaring nations and programs:

1. **United States (NASA / Commercial):**
   - *Pioneer* and *Ranger* programs (first close-up imaging and deliberate impact probes).
   - *Surveyor* program (first automated soft landings and soil mechanics tests).
   - *Lunar Orbiter* program (global mapping supporting Apollo landing site selection).
   - *Apollo* program (all six crewed landings, orbital command modules, and seismic booster impacts).
   - *Clementine* & *Lunar Prospector* (polar ice detection and global composition mapping).
   - *Lunar Reconnaissance Orbiter (LRO)* & *LCROSS* (continuous metric-scale terrain reconnaissance and polar impact water-ice confirmation).
   - *Commercial Lunar Payload Services (CLPS)*: *Peregrine Mission 1*, *Intuitive Machines IM-1 Odysseus*, *Firefly Blue Ghost 1*.
2. **Soviet Union (Roscosmos / OKB-1 / Lavochkin):**
   - *Luna 1* (first lunar flyby / artificial planetoid).
   - *Luna 2* (first human-made object to reach another celestial body; spherical pennants).
   - *Luna 3* (first photography of the lunar far side).
   - *Luna 9* (first survivable soft landing on any celestial body).
   - *Luna 10* (first artificial satellite of the Moon).
   - *Luna 16, 20, 24* (first robotic automated sample returns from the lunar surface).
   - *Luna 17 (Lunokhod 1)* & *Luna 21 (Lunokhod 2)* (world's first automated wheeled planetary rovers; record 39 km odometer).
3. **China (CNSA / CLEP):**
   - *Chang'e 1 & 2* (high-definition 3D global orbital mapping).
   - *Chang'e 3 & Yutu* (first soft landing in 37 years; ground-penetrating radar).
   - *Chang'e 4 & Yutu-2* (historic first-ever soft landing on the lunar far side in Von Kármán crater).
   - *Chang'e 5* (first sample return since 1976; first free-standing unfurled fabric national flag).
   - *Chang'e 6* (world-first sample return from the lunar far side; Apollo Basin).
4. **India (ISRO):**
   - *Chandrayaan-1* (confirmed widespread surface hydroxyl/water molecules via Moon Mineralogy Mapper; Moon Impact Probe).
   - *Chandrayaan-2* (high-resolution orbiter mapping; Vikram hard impact).
   - *Chandrayaan-3 (Vikram & Pragyan)* (historic soft landing at Shiv Shakti Point, $69.37^\circ\text{ S}$; laser-induced breakdown spectroscopy sulfur detection).
5. **Japan (JAXA / ISAS):**
   - *Hiten / Hagoromo* (first Japanese lunar orbiter and impact).
   - *SELENE / Kaguya* (definitive global gravimetric and terrain mapping).
   - *SLIM (Smart Lander for Investigating Moon)* with *LEV-1* and *LEV-2 (SORA-Q)* (pinpoint landing within 55 meters; world's smallest transformable rover).
6. **Europe (ESA):**
   - *SMART-1* (first European lunar mission; solar-electric ion drive; deliberate final impact).
7. **Commercial & Emerging Lunar Expeditions:**
   - *SpaceIL / IAI Beresheet* (Israel; first privately funded lunar landing attempt; Mare Serenitatis impact).
   - *ispace HAKUTO-R Mission 1* (Japan; Atlas crater impact).

---

## 4. Rigorous Outcome & Coordinate Taxonomy

To prevent historical confusion, the archive enforces an uncompromising scientific classification system. No failure, impact, or flyby may ever be represented as a soft landing:

| Classification Code | Description | Visual Symbol | Required Evidence |
| :--- | :--- | :---: | :--- |
| `SOFT_LANDING_SUCCESS` | Spacecraft touched down within operational velocity limits and operated on the surface. | Filled Circle (●) | Downlink confirmation, telemetry, surface photography, LROC NAC optical confirmation. |
| `HARD_IMPACT_INTENTIONAL` | Spacecraft intentionally directed to collide with the Moon for science, seismic calibration, or disposal. | Burst Icon (💥) | Tracking loss timestamp, seismic detection, LROC fresh crater identification. |
| `HARD_IMPACT_UNINTENTIONAL` | Descent failure, engine cutoff anomaly, or guidance error resulting in surface collision. | Warning Diamond (⚠️) | Terminal telemetry discontinuity, Doppler shift cessation, post-impact LROC debris field. |
| `ORBITAL_MISSION` | Spacecraft operated in lunar orbit without attempting a surface touchdown. | Orbit Ellipse (⬭) | Keplerian orbital elements, two-line element sets, periapsis/apoapsis history. |
| `FLYBY_MISSION` | Hyperbolic trajectory passing within the lunar sphere of influence. | Hyperbolic Arc (⤹) | Encounter timestamp, closest approach distance and relative velocity. |
| `PLANNED_FUTURE` | Confirmed mission manifest with formal launch vehicle assignment. | Dashed Ring (◌) | Agency program documentation, mission announcement records. |

### Coordinate Conventions & Spatial Uncertainty
- **Reference Frame:** Mean Earth / Polar Axis (ME) lunar coordinate system aligned with IAU/IAG working group standards.
- **Datum:** Lunar radius $R_{\text{Moon}} = 1,737.4\text{ km}$.
- **Longitude Convention:** East positive ($0^\circ\text{ to } +180^\circ$), West negative ($0^\circ\text{ to } -180^\circ$).
- **Uncertainty Radius ($r_u$):** Every coordinate entry must state its radial uncertainty in meters or kilometers (e.g., Apollo 12 LM footpad: $\pm 1\text{ m}$; Luna 2 impact: $\pm 30\text{ km}$; Beresheet impact: $\pm 10\text{ m}$).

---

## 5. Architectural Non-Interference Mandate

This phase (Phase 02.5) establishes the foundational research databases, JSON schemas, source attribution records, and experience roadmaps.

**Strict Boundaries:**
- The production codebase (`src/`) remains unmodified.
- No existing assets, 3D models, or textures are moved or overwritten.
- All newly authored research is written to structured documentation and modular JSON catalogs.
- The Git working tree remains clean.
