# AFTERLIGHT

> *The machines that stayed behind.*

An immersive digital archive exploring humanity's abandoned robotic explorers, scientific instruments, and forgotten missions across the Moon and Mars.

---

## Vision

Over seven decades of space exploration, humanity has dispatched sophisticated machines across the solar system to touch alien soil. Many of these landers, probes, and scientific packages fulfilled their objectives, exhausted their power, or fell silent, remaining exactly where their journeys ended. 

They are the quiet monuments of human curiosity: slowly scouring under solar wind, bombarded by micrometeoroids, yet preserved in the airless stillness of extraterrestrial deserts.

**AFTERLIGHT** is an interactive digital archive dedicated to these permanent artifacts. By fusing authentic NASA archival photography, primary technical documentation, planetary cartography, and scientifically grounded 3D visualizations, AFTERLIGHT transforms historical engineering data into an evocative, exploratory digital experience.

---

## Project Status

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 01** | Asset Research & Library Preparation | **Complete** |
| **Phase 01.5** | Repository Establishment & Project Documentation | **Complete** |
| **Phase 02** | Design & Experience Architecture | **Planned** |
| **Phase 03** | Core 3D Engine & Prototype Implementation | **Planned** |
| **Phase 04** | Interactive Archival Narrative & Audio Integration | **Planned** |
| **Phase 05** | Performance Optimization, Polish & Deployment | **Planned** |

> [!IMPORTANT]
> **Implementation Status:** No application code, web server, or interactive 3D scene has been implemented at this stage. This repository represents the verified research archive, physical specifications, and repository architecture ready for Phase 02.

---

## Initial Prototype: The Apollo 12 Landing Site

The initial prototype focuses on the **Apollo 12 landing site** at *Statio Cognitum* in the Ocean of Storms (**Oceanus Procellarum**):

- **Coordinates:** `3.01239° S, 23.42157° W`
- **Landing Date:** November 19, 1969 (06:54:35 UTC)
- **Surface Stay:** 31 hours, 31 minutes, 12 seconds

### Why Apollo 12?
On November 19, 1969, Commander Charles "Pete" Conrad Jr. and Lunar Module Pilot Alan L. Bean achieved humanity's first precision piloted landing, setting Lunar Module *Intrepid* down just **163 meters (535 feet)** from the robotic **Surveyor 3** spacecraft (which had soft-landed 31 months earlier on April 20, 1967). 

This site offers a unique convergence of human and robotic exploration:
- **Intrepid Lunar Module Descent Stage (LM-6):** The permanent base structure, landing gear, DPS engine bell, and commemorative stainless steel plaque.
- **Surveyor 3 Spacecraft:** An unmanned probe resting on the 11°–14° slope of Surveyor Crater, from which astronauts retrieved its TV camera, sampling scoop, and structural tubing for forensic analysis back on Earth.
- **Apollo Lunar Surface Experiments Package (ALSEP Array A):** A nuclear-powered geophysical laboratory powered by a SNAP-27 Plutonium-238 RTG that continuously transmitted scientific data for nearly eight years until September 1977.
- **Astronaut Traverse Routes & Footprints:** Two distinct EVAs totaling 7.7 hours of surface exploration, connecting Middle Crescent, Head, Bench, Sharp, Halo, and Surveyor Craters.
- **Discarded Equipment & Human Traces:** Jettisoned Portable Life Support System (PLSS) backpacks, lunar overshoes, tools, and the United States surface flag.

---

## Asset Library Structure

The completed Phase 01 archive comprises **57 cataloged assets** (~78 MB) organized into six primary domains:

- **3D Spacecraft Models & Specs (`assets/3d_models/`):** Official NASA Lunar Module geometry (`apollo_lunar_module.glb`), procedurally dimensioned models of Surveyor 3 (`surveyor_3_lander.obj`), the ALSEP Central Station (`alsep_central_station.obj`), the SNAP-27 RTG (`snap27_rtg.obj`), and the Passive Seismic Experiment (`alsep_passive_seismic_experiment.obj`), with rigorous engineering JSON specifications.
- **Planetary Cartography & Terrains (`assets/terrain_and_cartography/`):** Lunar Reconnaissance Orbiter Camera (LROC) Narrow Angle Camera orthophoto reconstructions, topographic profiles of Surveyor Crater, and machine-readable OGC GeoJSON waypoint vectors for all hardware and traverse paths.
- **Authentic Archival Photography (`assets/photography/`):** Original high-resolution 70mm Hasselblad surface scans with official NASA metadata JSON records documenting the Surveyor 3 inspection, ALSEP deployment, and *Intrepid*.
- **Engineering Schematics (`assets/schematics_and_diagrams/`):** Clean vector diagrams (SVG) breaking down LM descent stage subsystems, Surveyor 3 configuration, and ALSEP surface geometry.
- **Primary Historical Documentation (`docs/`):** Unabridged official reports from the NASA Technical Reports Server (NTRS), including the Apollo 12 Mission Report (MSC-01855), the Surveyor 3 Television Camera Analysis Report (NASA TR/SP-284), and verbatim surface transcripts.
- **Visual & Acoustic Physics (`assets/visual_references_and_mood/`):** Scientific guidelines on lunar photometry (the *Heiligenschein* retroreflective opposition surge), zero-atmosphere shadow physics, calibrated PBR material values, acoustic vacuum sound design, and generative geometric art references.

### Key Catalogs & Registries
- [Complete Machine-Readable Inventory (CSV)](catalog/ASSET_INVENTORY.csv) — 57 assets with verified SHA-256 checksums and file sizes.
- [Detailed Asset Catalog (Markdown)](catalog/ASSET_CATALOG.md) — Comprehensive technical descriptions and relative asset links.
- [Apollo 12 Hardware Registry](catalog/APOLLO_12_HARDWARE_REGISTRY.md) — Definitive inventory of every human artifact currently resting at the site.

---

## Planned Technology Stack

*The technology architecture below is planned for Phase 03 and has not yet been initialized:*

- **HTML5 & CSS3:** Semantic layout, accessible screen-reader transcripts, and responsive archival typography.
- **Vanilla JavaScript (ES Modules):** Clean, modular, framework-free application architecture ensuring longevity and zero dependency bloat.
- **Three.js (WebGL):** 3D terrain rendering, PBR material shading, custom retroreflective regolith shaders, dynamic solar lighting, and orbit/traverse camera controllers.
- **Anime.js:** Fluid micro-interactions, timeline-synced camera flyovers along astronaut paths, and HUD readout transitions.
- **Vite:** High-performance local development server and optimized build pipeline.
- **GitHub & Git LFS:** Version control, historical provenance tracking, and large binary asset management.
- **Vercel:** Continuous integration and global edge deployment.

---

## Scientific & Historical Integrity

AFTERLIGHT is committed to rigorous historical and scientific truth:
- **Primary Sources:** Grounded in primary mission documentation from NASA, JPL, the Apollo Lunar Surface Journal, and the Lunar Reconnaissance Orbiter team.
- **Artifacts vs. Reconstructions:** Clear differentiation between authentic archival scans and 3D geometric models.
- **Geodetic Accuracy:** Coordinates registered to the Mean Earth/Polar Axis (ME) reference system (IAU/IAG 2000).
- **Physical Fidelity:** Adherence to real lunar physical parameters (absence of atmospheric haze, 1361 W/m² solar constant, opposition surge retroreflection).
- **Nuanced Historical Context:** Factually addressing historical episodes, such as the 1970 *Streptococcus mitis* Surveyor 3 camera controversy and its modern resolution as laboratory clean-room contamination.

For full guidelines, see [docs/SCIENTIFIC_INTEGRITY.md](docs/SCIENTIFIC_INTEGRITY.md).

---

## Repository Structure

```
Afterlight/
├── .gitattributes                               # Git LFS tracking & line-ending normalization
├── .gitignore                                   # Comprehensive ignore rules for OS, IDE, and build tools
├── LICENSE                                      # Dual licensing: MIT for original code/docs
├── THIRD_PARTY_NOTICES.md                       # Formal NASA and third-party attribution records
├── CONTRIBUTING.md                              # Contribution standards, branch & commit conventions
├── CHANGELOG.md                                 # Milestone history & changes
├── README.md                                    # Master project documentation
├── catalog/
│   ├── ASSET_INVENTORY.csv                      # Manifest of 57 assets with SHA-256 hashes
│   ├── ASSET_CATALOG.md                         # Contextual asset catalog with relative links
│   └── APOLLO_12_HARDWARE_REGISTRY.md           # Authoritative inventory of surface artifacts
├── docs/
│   ├── PROJECT_ROADMAP.md                       # Detailed multi-phase development plan
│   ├── SCIENTIFIC_INTEGRITY.md                  # Protocol for factual claims & geodesy
│   ├── LICENSING_AND_ATTRIBUTION.md             # In-depth rights management framework
│   ├── mission_reports/                         # NTRS flight reports (PDF) & executive summaries
│   ├── surveyor_documentation/                  # Forensic studies of returned Surveyor hardware
│   ├── alsep_documentation/                     # Technical systems manuals for ALSEP Array A
│   └── transcripts_and_flight_plans/            # Verbatim surface communications logs
└── assets/
    ├── 3d_models/                               # GLTF & Wavefront OBJ models with technical specs
    ├── terrain_and_cartography/                 # LROC orthophotos, DEM profiles, GeoJSON traverses
    ├── photography/                             # Authentic 70mm Hasselblad surface imagery
    ├── schematics_and_diagrams/                 # Vector blueprints (SVG) of LM, Surveyor, and ALSEP
    └── visual_references_and_mood/              # PBR calibrations, optical physics & audio design
```

---

## Credits & Archival Sources

- **National Aeronautics and Space Administration (NASA):** Primary photography, mission documentation, audio transcripts, and 3D resources.
- **NASA Manned Spacecraft Center / Johnson Space Center (JSC):** Apollo 12 Mission Report and photographic archives.
- **NASA Jet Propulsion Laboratory (JPL) & Hughes Aircraft Company:** Surveyor 3 spacecraft engineering blueprints and forensic evaluation.
- **Bendix Aerospace Systems Division & General Electric Space Division:** ALSEP Central Station and SNAP-27 RTG technical systems documentation.
- **Lunar Reconnaissance Orbiter Camera (LROC) Team / Arizona State University:** High-resolution Narrow Angle Camera orbital imagery and elevation data.
- **NASA Scientific Visualization Studio (SVS):** Apollo 12 landing site 3D reconstruction imagery (SVS 4767).
- **Apollo Lunar Surface Journal (ALSJ):** Curated transcripts and photographic indexing by Eric M. Jones and Ken Glover.

---

## Licensing

- **Original Project-Authored Code & Materials:** Licensed under the [MIT License](LICENSE).
- **Third-Party Archival Media & Government Works:** Public domain US Government works subject to NASA Media Usage Guidelines. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [docs/LICENSING_AND_ATTRIBUTION.md](docs/LICENSING_AND_ATTRIBUTION.md).
