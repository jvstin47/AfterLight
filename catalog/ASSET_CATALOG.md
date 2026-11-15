# AFTERLIGHT — Asset Catalog (Phase 01: Apollo 12)

**Project:** AFTERLIGHT  
**Tagline:** The machines that stayed behind.  
**Phase:** Phase 01 — Asset Research & Library Preparation  
**Target Subject:** Apollo 12 Landing Site (*Statio Cognitum*, Oceanus Procellarum)  
**Coordinates:** 3.01239° S, 23.42157° W  

---

## 1. Catalog Overview
This catalog details all acquired, processed, verified, and structured assets in the AFTERLIGHT Phase 01 archive. The assets have been assembled strictly for research, verification, and preparation for future interactive 3D and cinematic rendering phases.

Every asset in this library is tied to documented NASA mission data, planetary science archives, or engineering blueprints.

A complete machine-readable manifest is available in [ASSET_INVENTORY.csv](./ASSET_INVENTORY.csv), and the historical hardware inventory is documented in [APOLLO_12_HARDWARE_REGISTRY.md](./APOLLO_12_HARDWARE_REGISTRY.md).

---

## 2. 3D Models & Physical Geometry (`assets/3d_models/`)

### 2.1 Lunar Module (LM-6 Intrepid)
- **Model File:** [apollo_lunar_module.glb](../assets/3d_models/lunar_module/apollo_lunar_module.glb) (700 KB, GLTF 2.0 Binary)
- **Technical Specification:** [intrepid_descent_stage_specs.json](../assets/3d_models/lunar_module/intrepid_descent_stage_specs.json)
- **Source:** NASA 3D Resources / Grumman Aerospace engineering archives
- **Geometry Breakdown:** 135 nodes, 134 meshes, full descent stage geometry including landing gear struts, primary shock-absorbing cartridges, footpads, TRW DPS engine bell, and Modular Equipment Stowage Assembly (MESA).
- **Physical Scale:** Height 3.23 m, diagonal footprint span 9.45 m.

### 2.2 Surveyor 3 Spacecraft
- **Model Files:** 
  - [surveyor_3_lander.obj](../assets/3d_models/surveyor_3/surveyor_3_lander.obj) (Wavefront OBJ, 39 KB)
  - [surveyor_3_lander.mtl](../assets/3d_models/surveyor_3/surveyor_3_lander.mtl)
- **Technical Specification:** [surveyor_3_specs.json](../assets/3d_models/surveyor_3/surveyor_3_specs.json)
- **Source:** NASA JPL / Hughes Aircraft Company technical reports
- **Geometry Breakdown:** Triangular 7075-T6 aluminum space frame, three inverted tripod landing legs with crushable honeycomb footpads (4.3 m span), 3.0 m central mast, 3,960-cell solar panel, planar high-gain TV downlink antenna, Vidicon TV camera turret, Soil Mechanics Surface Sampler (pantograph scissor-arm with scoop bucket), three liquid vernier engines, and spherical propellant tanks.

### 2.3 ALSEP Scientific Instrumentation (Array A)
- **Central Station:** [alsep_central_station.obj](../assets/3d_models/alsep_instruments/alsep_central_station.obj) + [alsep_central_station.mtl](../assets/3d_models/alsep_instruments/alsep_central_station.mtl)
  - Scale: 0.64 m x 0.61 m x 0.58 m enclosure with thermal louvers, S-band helical antenna, and sun compass gnomon.
- **SNAP-27 RTG:** [snap27_rtg.obj](../assets/3d_models/alsep_instruments/snap27_rtg.obj) + [snap27_rtg.mtl](../assets/3d_models/alsep_instruments/snap27_rtg.mtl)
  - Scale: Beryllium casing cylinder with 8 radial cooling fins (0.46 m height, 0.40 m diameter) and Pu-238 capsule collar.
- **Passive Seismic Experiment:** [alsep_passive_seismic_experiment.obj](../assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.obj) + [alsep_passive_seismic_experiment.mtl](../assets/3d_models/alsep_instruments/alsep_passive_seismic_experiment.mtl)
  - Scale: 10-sided aluminized Mylar/Kapton specular thermal skirt (0.90 m base diameter) with internal sensor enclosure.
- **Array Architecture & Layout Spec:** [alsep_array_a_geometry.json](../assets/3d_models/alsep_instruments/alsep_array_a_geometry.json)

---

## 3. Authentic NASA Surface Photography (`assets/photography/`)
All images downloaded directly from the NASA Images API and Apollo Lunar Surface Journal in original / high-resolution scan formats, accompanied by official NASA metadata JSON files.

### 3.1 Surveyor 3 Rendezvous
- [AS12-48-7134_Conrad_Surveyor_3_Intrepid_Background.jpg](../assets/photography/surveyor_3_rendezvous/AS12-48-7134_Conrad_Surveyor_3_Intrepid_Background.jpg) (Iconic shot: Pete Conrad inspecting Surveyor 3 with LM *Intrepid* visible in distance across crater rim).
- [AS12-48-7133_Conrad_Examining_Surveyor_Camera.jpg](../assets/photography/surveyor_3_rendezvous/AS12-48-7133_Conrad_Examining_Surveyor_Camera.jpg) (Close-up: Conrad reaching for the TV camera prior to severing the mounting tubes; 5.6 MB).
- [AS12-48-7099_Surveyor_Footpad_Lunar_Soil.jpg](../assets/photography/surveyor_3_rendezvous/AS12-48-7099_Surveyor_Footpad_Lunar_Soil.jpg) (Engineering close-up: Surveyor footpad embedded in lunar regolith, displaying soil pileup and pad crush; 3.8 MB).
- [AS12-48-7121_Surveyor_In_Crater_Slope.jpg](../assets/photography/surveyor_3_rendezvous/AS12-48-7121_Surveyor_In_Crater_Slope.jpg) (Wide profile showing Surveyor 3 resting on the 11-14° inner crater slope; 3.7 MB).
- [AS12-48-7136_Surveyor_3_and_Intrepid_Panorama.jpg](../assets/photography/surveyor_3_rendezvous/AS12-48-7136_Surveyor_3_and_Intrepid_Panorama.jpg) (Panoramic frame connecting Surveyor 3, crater rim, and landing plain; 3.2 MB).

### 3.2 ALSEP Deployment
- [AS12-46-6790_Bean_Fueling_SNAP27_RTG.jpg](../assets/photography/alsep_deployment/AS12-46-6790_Bean_Fueling_SNAP27_RTG.jpg) (Alan Bean extracting red-hot Plutonium-238 capsule from graphite cask with Hanford tool; 3.1 MB).
- [AS12-46-6807_Bean_Carrying_ALSEP_Pallets.jpg](../assets/photography/alsep_deployment/AS12-46-6807_Bean_Carrying_ALSEP_Pallets.jpg) (Alan Bean carrying ALSEP Subpackages 1 and 2 barbell-style across lunar plains; 4.4 MB).
- [AS12-47-6918_Deployed_ALSEP_Array.jpg](../assets/photography/alsep_deployment/AS12-47-6918_Deployed_ALSEP_Array.jpg) (Overview of fully deployed ALSEP array with Central Station, RTG, and instrument cables; 3.1 MB).
- [AS12-47-6919_Bean_Deploying_ALSEP_Subpackages.jpg](../assets/photography/alsep_deployment/AS12-47-6919_Bean_Deploying_ALSEP_Subpackages.jpg) (Alan Bean adjusting instrument leveling on the regolith; 2.2 MB).
- [AS12-46-6813_Bean_Deploying_LSM_Magnetometer.jpg](../assets/photography/alsep_deployment/AS12-46-6813_Bean_Deploying_LSM_Magnetometer.jpg) (Bean extending Lunar Surface Magnetometer fluxgate boom arms; 4.1 MB).

### 3.3 Intrepid Lunar Module Descent Stage
- [AS12-46-6749_Intrepid_Ladder_and_Plaque.jpg](../assets/photography/intrepid_lm/AS12-46-6749_Intrepid_Ladder_and_Plaque.jpg) (Close-up of forward landing strut, egress ladder, and stainless steel commemorative plaque; 3.2 MB).
- [AS12-47-6913_Conrad_MESA_Lunar_Module.jpg](../assets/photography/intrepid_lm/AS12-47-6913_Conrad_MESA_Lunar_Module.jpg) (Pete Conrad working at the Modular Equipment Stowage Assembly in Quad II; 3.9 MB).
- [AS12-47-6988_Flag_LM_Shadow_Footprints.jpg](../assets/photography/intrepid_lm/AS12-47-6988_Flag_LM_Shadow_Footprints.jpg) (Stark scene: United States flag, long razor-sharp LM shadow, and compacted dark footstep trails; 3.6 MB).
- [AS12-51-7507_Intrepid_Descent_Stage_Landing_Config.jpg](../assets/photography/intrepid_lm/AS12-51-7507_Intrepid_Descent_Stage_Landing_Config.jpg) (LM in landing configuration photographed during lunar orbital separation; 3.6 MB).

---

## 4. Planetary Cartography & Terrain Data (`assets/terrain_and_cartography/`)

### 4.1 LROC High-Resolution Orbital Imagery
- [NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg](../assets/terrain_and_cartography/lroc_imagery/NASA_SVS_4767_Apollo_12_Landing_Site_Orthophoto.jpg) (NASA Scientific Visualization Studio 3D reconstruction from LRO Narrow Angle Camera stereo frames, showing LM descent stage, Surveyor 3, ALSEP, and dark footstep tracks).
- [landing_site_dem_parameters.json](../assets/terrain_and_cartography/elevation_and_dem/landing_site_dem_parameters.json) (Geodetic parameters: 1.5 m/pixel LRO NAC DTM product, IAU/IAG 2000 coordinate frame, bounding box, and frame IDs).

### 4.2 Traverse Cartography & Waypoints
- [Apollo_12_EVA_2_Traverse_Overlay_S69-59538.jpg](../assets/terrain_and_cartography/traverse_maps/Apollo_12_EVA_2_Traverse_Overlay_S69-59538.jpg) (Original NASA Mission Operations mapping overlay showing EVA-2 stations across crater chains; 2.7 MB).
- [traverse_waypoints.geojson](../assets/terrain_and_cartography/traverse_maps/traverse_waypoints.geojson) (Standard OGC GeoJSON containing Point features for all landed craft, ALSEP sensors, flag, and LineString features for EVA-1 and EVA-2 routes).
- [surveyor_crater_topography_profile.json](../assets/terrain_and_cartography/elevation_and_dem/surveyor_crater_topography_profile.json) (Radial cross-section elevation model: 200 m rim diameter, -21.4 m max floor depth, 11.8° local slope at Surveyor 3 site).

---

## 5. Engineering Schematics & Architecture Diagrams (`assets/schematics_and_diagrams/`)
- [lm_descent_stage_subsystems.svg](../assets/schematics_and_diagrams/lm_schematics/lm_descent_stage_subsystems.svg) (Vector schematic: Octagonal frame, TRW DPS engine bell, 4 propellant tanks, 4 landing struts, sensing probes, ladder, MESA bay, and ALSEP SNAP-27 graphite cask).
- [surveyor_spacecraft_configuration.svg](../assets/schematics_and_diagrams/surveyor_schematics/surveyor_spacecraft_configuration.svg) (Vector blueprint: Triangular frame, mast, solar panel, planar antenna, footpads, and highlighted retrieved parts: TV camera and surface scoop).
- [alsep_array_a_layout_diagram.svg](../assets/schematics_and_diagrams/alsep_schematics/alsep_array_a_layout_diagram.svg) (Vector diagram: Central Station hub, SNAP-27 RTG at 3m, PSE at 2.7m, SWS at 4m, LSM at 15m, SIDE/CCGE at 15.5m, cable runs, and solar alignment compass).

---

## 6. Historical Mission Documentation & Science Reports (`docs/`)
- [Apollo_12_Mission_Report_MSC-01855.pdf](../docs/mission_reports/Apollo_12_Mission_Report_MSC-01855.pdf) (NASA Manned Spacecraft Center, 7.3 MB complete official mission flight report).
- [Apollo_12_Mission_Report_Summary.md](../docs/mission_reports/Apollo_12_Mission_Report_Summary.md) (Executive flight summary, launch lightning strike, EVA timelines, and ascent stage crash).
- [Surveyor_3_Television_Camera_Analysis_Report_NASA_TR.pdf](../docs/surveyor_documentation/Surveyor_3_Television_Camera_Analysis_Report_NASA_TR.pdf) (NASA Technical Report, 11.9 MB complete forensic study of returned camera).
- [Surveyor_3_Returned_Parts_Scientific_Analysis.md](../docs/surveyor_documentation/Surveyor_3_Returned_Parts_Scientific_Analysis.md) (Forensic synthesis: optical paint browning, LM dust scouring, micrometeoroid counts, and sterile clean-room contamination findings).
- [ALSEP_Array_A_Apollo_12_Systems_Handbook.md](../docs/alsep_documentation/ALSEP_Array_A_Apollo_12_Systems_Handbook.md) (Technical handbook covering Central Station telemetry, SNAP-27 RTG physics, and the 5 scientific experiments).
- [EVA_2_Surveyor_Visit_Transcripts.md](../docs/transcripts_and_flight_plans/EVA_2_Surveyor_Visit_Transcripts.md) (Verbatim communications transcripts from Pete Conrad, Alan Bean, and CAPCOM Ed Gibson during the Surveyor rendezvous and PLSS jettison).

---

## 7. Visual Reference & Atmospheric Physics (`assets/visual_references_and_mood/`)
- [optical_properties_and_lighting.md](../assets/visual_references_and_mood/optical_properties_and_lighting.md) (Optical physics: Opposition surge / Heiligenschein retroreflection, lack of atmospheric penumbra, secondary bounce illumination, scale distortion).
- [lunar_material_pbr_specifications.json](../assets/visual_references_and_mood/lunar_material_pbr_specifications.json) (Physically Based Rendering calibration table: albedo, roughness, metallic, and normal values for undisturbed regolith, boot tracks, Kapton MLI foil, weathered white paint, and spacesuit Beta cloth).
- [audio_transcripts_and_soundscape_notes.md](../assets/visual_references_and_mood/audio_transcripts_and_soundscape_notes.md) (Audio design reference: vacuum silence, spacesuit ECS fan drone, bone-conduction impact vibrations, Quindar tones, VHF telemetry grain, and pitched-up seismic reverberations).
- [generative_and_geometric_art_references.md](../assets/visual_references_and_mood/generative_and_geometric_art_references.md) (Generative visual reference based on GEOMETRIC / geometric-art.com: Vidicon scanline simulation, radar contour mapping, telemetry node networks, and holographic wireframes).
