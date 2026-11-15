# Licensing & Attribution Architecture

**Project:** AFTERLIGHT  
**Scope:** Legal framework, asset provenance, rights management, and attribution guidelines.

---

## 1. Dual Licensing Philosophy

AFTERLIGHT is both a software project and an archival digital museum. Because it incorporates primary historical materials from government agencies alongside original code and engineering reconstructions, a single blanket open-source license is legally inappropriate.

The repository operates under a **Dual Rights Model**:

```
+--------------------------------------------------------------------------+
|                       AFTERLIGHT REPOSITORY                              |
+--------------------------------------------------------------------------+
          |                                              |
          v                                              v
[ORIGINAL PROJECT CODE & DOCS]                [THIRD-PARTY ARCHIVAL ASSETS]
- Custom JavaScript/WebGL (Phase 02+)        - NASA 70mm Hasselblad Scans
- Custom SVG Schematics                      - NASA NTRS Technical Reports
- Original 3D Procedural OBJ Meshes          - LROC Orbital Orthophotos & DEMs
- Project Documentation & Catalogs           - NASA 3D Resources Models
          |                                              |
          v                                              v
      MIT LICENSE                           PUBLIC DOMAIN (US GOV WORK)
 (See root LICENSE file)                    + NASA MEDIA USAGE GUIDELINES
                                            (See THIRD_PARTY_NOTICES.md)
```

---

## 2. Project-Authored Materials (MIT License)

The following components are original works authored by the AFTERLIGHT project team and are licensed under the standard [MIT License](../LICENSE):

1. **Procedural Geometry & Custom 3D Models:**
   - `assets/3d_models/surveyor_3/surveyor_3_lander.obj`
   - `assets/3d_models/alsep_instruments/alsep_central_station.obj`
   - `assets/3d_models/alsep_instruments/snap27_rtg.obj`
   - `assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj`
2. **Vector Engineering Schematics:**
   - `assets/schematics_and_diagrams/lm_schematics/lm_descent_stage_subsystems.svg`
   - `assets/schematics_and_diagrams/surveyor_schematics/surveyor_spacecraft_configuration.svg`
   - `assets/schematics_and_diagrams/alsep_schematics/alsep_array_a_layout_diagram.svg`
3. **Cartographic Vectors & Waypoint GeoJSON:**
   - `assets/terrain_and_cartography/traverse_maps/traverse_waypoints.geojson`
   - `assets/terrain_and_cartography/elevation_and_dem/surveyor_crater_topography_profile.json`
4. **Project Catalogs, Registries & Summaries:**
   - `catalog/ASSET_INVENTORY.csv`
   - `catalog/ASSET_CATALOG.md`
   - `catalog/APOLLO_12_HARDWARE_REGISTRY.md`
   - `docs/SCIENTIFIC_INTEGRITY.md`
   - `docs/PROJECT_ROADMAP.md`

---

## 3. Third-Party Archival Materials (NASA Public Domain)

### 3.1 Statutory Basis
Under **17 U.S.C. § 105**, copyright protection is not available for any work of the United States Government. Works authored by NASA civil servants (such as Apollo Hasselblad photography, transcripts, and official flight evaluation reports) reside in the public domain in the United States and may be utilized freely for educational and non-commercial archival purposes.

### 3.2 Statutory Restrictions & Non-Copyright Rights
Even though copyright does not apply to US Government works, the following legal constraints govern their use:

1. **Right of Publicity & Privacy (Personality Rights):**
   - Photographs depicting living or deceased astronauts (Pete Conrad, Alan Bean, Dick Gordon) are protected by personality and publicity rights. They cannot be used in a commercial product endorsement or trade context without permission from the individuals or their estates.
2. **NASA Insignia & Trademark Protections:**
   - The NASA "Meatball" insignia, the "Worm" logotype, and mission patches are protected by 14 CFR Part 1221. They cannot be placed on commercial merchandise or used to imply official NASA endorsement of AFTERLIGHT.
3. **NASA Media Usage Policy Compliance:**
   - AFTERLIGHT adheres strictly to the [NASA Media Usage Guidelines](https://www.nasa.gov/multimedia/guidelines/index.html). All imagery is credited with official NASA IDs and originating centers.

---

## 4. Usage Terms for Downstream Consumers

> [!WARNING]
> **No Universal Rights Transfer:** Obtaining access to this GitHub repository or cloning its history **does not grant copyright clearance** for third-party commercial exploitation of archival photography or NASA datasets.

Consumers of this repository who adapt AFTERLIGHT for their own projects must:
- Independently verify the rights of any included archival images before commercial use.
- Attribute NASA and respective scientific institutes according to [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).
- Retain the original copyright notices and disclaimers for project-authored code.
