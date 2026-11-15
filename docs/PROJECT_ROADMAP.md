# AFTERLIGHT Development Roadmap

**Tagline:** *The machines that stayed behind.*  
**Target Subject for Initial Prototype:** Apollo 12 Landing Site (*Statio Cognitum*, Oceanus Procellarum)

---

## Overview

AFTERLIGHT is planned as a multi-stage creative technology project. Each phase builds upon the verified factual and visual foundation established in the preceding milestone.

```
+-----------------------------------------------------------------------------------+
| [PHASE 01] Asset Research & Library Preparation               (COMPLETE)          |
| - 57 Cataloged assets, primary reports, 3D models, cartography, photography       |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| [PHASE 01.5] Repository Establishment & Documentation          (CURRENT)           |
| - Git repository, licensing, LFS, scientific integrity, attribution               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| [PHASE 02] Design & Experience Architecture                   (PLANNED)           |
| - Information architecture, UI wireframes, scene choreography, audio cues        |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| [PHASE 03] Core 3D Engine & Prototype Implementation          (PLANNED)           |
| - Three.js scene setup, terrain mesh, PBR lighting, camera flight paths           |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| [PHASE 04] Interactive Archival Narrative & Audio Integration (PLANNED)           |
| - Synced transcripts, Quindar radio audio, artifact inspection modal HUDs         |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
| [PHASE 05] Optimization, QA & Vercel Deployment               (PLANNED)           |
| - Asset bundling (Draco/KTX2), mobile touch navigation, CI/CD, release             |
+-----------------------------------------------------------------------------------+
```

---

## Detailed Phase Breakdown

### Phase 01: Asset Research & Library Preparation (Status: COMPLETE)
- Collect authentic NASA photography, LROC cartography, and NTRS technical reports.
- Extract physical dimensions and write technical specifications for LM *Intrepid*, Surveyor 3, and ALSEP Array A.
- Generate dimensioned 3D geometry and vector schematics.
- Catalog all assets with SHA-256 integrity checksums in `catalog/ASSET_INVENTORY.csv`.
- Create the exhaustive [APOLLO_12_HARDWARE_REGISTRY.md](../catalog/APOLLO_12_HARDWARE_REGISTRY.md).

### Phase 01.5: Repository Establishment & Documentation (Status: CURRENT)
- Configure private GitHub repository at `jvstin47/AfterLight`.
- Establish Git LFS tracking for heavy binary assets (`*.pdf`, `*.glb`).
- Implement dual-licensing framework (MIT for code/docs; third-party attribution for NASA archival assets).
- Publish contribution standards, changelog, and scientific integrity protocols.
- Normalize all documentation to relative links.

### Phase 02: Design & Experience Architecture (Status: PLANNED)
- **Visual Direction:** Synthesize the hybrid aesthetic (scientific realism + minimalist geometric HUD).
- **User Journey Mapping:** Define the user experience flow:
  1. *Descent & Touchdown:* Orbital view transitioning to the Ocean of Storms.
  2. *Intrepid Hub:* Exploring the descent stage, commemorative plaque, and MESA.
  3. *The ALSEP Array:* Walking the 130m path to the nuclear generator and seismometer.
  4. *The Surveyor Traverse:* Following Conrad & Bean's footsteps down into Surveyor Crater.
- **Storyboarding & Wireframing:** Drafting responsive layouts for desktop and mobile viewport interfaces.

### Phase 03: Core 3D Engine & Prototype Implementation (Status: PLANNED)
- Initialize Vite development environment with vanilla JavaScript / ES Modules.
- Set up Three.js WebGL scene with realistic lunar lighting:
  - Directional sun light matching the ~10° elevation angle during Apollo 12 EVAs.
  - Absence of ambient skylight; calibrated ground bounce illumination.
  - Implementation of retroreflective regolith shader (Hapke / Heiligenschein approximation).
- Render digital elevation terrain model of Surveyor Crater and the landing site.
- Load optimized 3D models with calibrated PBR materials.

### Phase 04: Interactive Storytelling & Telemetry Integration (Status: PLANNED)
- Integration of historical audio snippets (Conrad, Bean, Gibson) synchronized to spatial waypoints.
- Quindar tone audio triggers and telemetry carrier noise.
- Interactive inspection HUDs displaying technical specs, historical photos, and cutaway schematics.
- Toggleable "Geometric / Wireframe" scanline visualization mode inspired by slow-scan Vidicon camera sweeps.

### Phase 05: Optimization, Polish & Deployment (Status: PLANNED)
- Draco compression for 3D meshes; KTX2 / Basis Universal compression for textures.
- Performance profiling targeting 60 FPS on mid-tier mobile and desktop GPUs.
- Automated CI/CD pipeline connected to GitHub and hosted on Vercel.
- Accessibility audit (screen-reader descriptive transcripts, keyboard navigation for 3D cameras).

---

## Future Expansion (Post-Apollo 12)

While Apollo 12 serves as the initial prototype, the AFTERLIGHT platform architecture is designed to expand across the solar system:
- **Mars:** Viking 1 (Chryse Planitia, 1976), Pathfinder & Sojourner (Ares Vallis, 1997), Opportunity (Meridiani Planum / Endurance Crater).
- **The Moon:** Apollo 11 (Tranquility Base), Lunokhod 1 (Mare Imbrium), Chang'e 4 (Von Kármán Crater).
- **Outer Solar System:** Huygens (Titan), Venera 13 (Venus).
