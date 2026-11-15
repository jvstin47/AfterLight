# CHANGELOG — AFTERLIGHT

All notable changes and milestones for the **AFTERLIGHT** project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Phase 01.5] — Repository Establishment & Project Documentation — 2026-11-15

### Added
- GitHub repository connection to `jvstin47/AfterLight` configured with private visibility.
- Comprehensive `.gitignore` covering macOS, IDEs, Node.js, Vite build outputs, logs, and secrets.
- Git LFS tracking configuration in `.gitattributes` for large binary reports (`*.pdf`), 3D models (`*.glb`, `*.gltf`), and raster datasets (`*.tif`, `*.tiff`).
- Explicit dual-licensing framework in `LICENSE` (MIT for original code/docs; excluding third-party archival assets).
- Detailed third-party provenance and attribution records in `THIRD_PARTY_NOTICES.md` and `docs/LICENSING_AND_ATTRIBUTION.md`.
- Scientific methodology and factual accuracy standard in `docs/SCIENTIFIC_INTEGRITY.md`.
- Comprehensive multi-phase project roadmap in `docs/PROJECT_ROADMAP.md`.
- Contribution workflow and commit conventions in `CONTRIBUTING.md`.
- Machine-readable asset verification and complete relative path normalization across all documentation.

---

## [Phase 01] — Asset Research & Library Preparation — 2026-11-15

### Added
- Completed initial research collection for the **Apollo 12 landing site** (*Statio Cognitum*, Oceanus Procellarum).
- Acquired and verified official NASA 3D model of the Apollo Lunar Module (`apollo_lunar_module.glb`).
- Procedurally generated dimensionally accurate 3D models and specifications for:
  - Surveyor 3 spacecraft (`surveyor_3_lander.obj` + `.mtl` + `surveyor_3_specs.json`).
  - ALSEP Central Station (`alsep_central_station.obj` + `.mtl`).
  - SNAP-27 Radioisotope Thermoelectric Generator (`snap27_rtg.obj` + `.mtl`).
  - Passive Seismic Experiment with 10-sided Mylar thermal shroud (`alsep_passive_seismic_experiment.obj` + `.mtl`).
- Acquired 15 high-resolution authentic 70mm Hasselblad surface photographs with official NASA metadata JSON companions covering:
  - Pete Conrad & Alan Bean visiting Surveyor 3 (`AS12-48-7134`, `AS12-48-7133`, `AS12-48-7099`, `AS12-48-7121`, `AS12-48-7136`).
  - ALSEP deployment and SNAP-27 RTG fueling (`AS12-46-6790`, `AS12-46-6807`, `AS12-47-6918`, `AS12-47-6919`, `AS12-46-6813`).
  - Intrepid descent stage, egress ladder, and US flag (`AS12-46-6749`, `AS12-47-6913`, `AS12-47-6988`, `AS12-51-7507`).
- Acquired LROC Narrow Angle Camera landing site orthophoto (NASA SVS Entry 4767) and EVA-2 mission mapping overlay (`S69-59538`).
- Generated OGC GeoJSON traverse map with exact coordinates for landed craft, ALSEP sensors, and EVA 1 & 2 routes (`traverse_waypoints.geojson`).
- Created radial topographic profile model for Surveyor Crater (`surveyor_crater_topography_profile.json`).
- Downloaded primary historical documentation from NASA NTRS:
  - Apollo 12 Mission Report MSC-01855 (7.3 MB PDF + summary).
  - Test and Evaluation of Surveyor 3 Camera Returned from the Moon (11.9 MB PDF + summary).
- Created vector engineering schematics (SVG) for LM descent stage subsystems, Surveyor 3 configuration, and ALSEP Array A deployment.
- Compiled optical physics guidelines, PBR material calibration values, audio design soundscape notes, and generative geometric art references.
- Published exhaustive [APOLLO_12_HARDWARE_REGISTRY.md](catalog/APOLLO_12_HARDWARE_REGISTRY.md), [ASSET_CATALOG.md](catalog/ASSET_CATALOG.md), and [ASSET_INVENTORY.csv](catalog/ASSET_INVENTORY.csv) (57 cataloged assets with SHA-256 hashes).
