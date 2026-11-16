# AFTERLIGHT — Creative Research & Art Direction

**Document:** `docs/CREATIVE_RESEARCH_AND_ART_DIRECTION.md`  
**Phase:** Phase 01 — Creative Research & Art Direction  
**Status:** **AUTHORIZATION DELIVERABLE — SUBMITTED FOR REVIEW & APPROVAL**  
**Auditor / Art Director:** Antigravity (DeepMind)  
**Target Benchmark:** Active Theory Studio Standard / Level 3 Experimental Digital Installation  
**Subject:** Apollo 12 Landing Site (*Statio Cognitum*, Oceanus Procellarum, `3.01239° S, 23.42157° W`)  

---

## Executive Summary

Phase 00 established that AFTERLIGHT possesses a rich, verified scientific foundation: an authentic 97,588-triangle Apollo Lunar Module (GLB with Draco decompression), an accurate Surveyor 3 lander model on its surveyed 11.8° crater slope, Bendix ALSEP scientific instruments, a continuous 16km spherical planetary horizon, and archival Apollo 12 photography and voice transcripts.

However, the existing interface—while functional—operates as a conventional web page with standard flat 2D cards placed on top of a 3D canvas. 

**Phase 01 re-imagines AFTERLIGHT not as a website with a 3D background, but as an experimental digital installation.** Inspired by the pioneering technical artistry of studios like **Active Theory**, **Dogstudio**, and **Resn**, this document explores how real-time WebGL, custom GLSL post-processing, spatial typography, and synthetic physics-based acoustics can elevate AFTERLIGHT into a world-class, award-winning interactive museum.

> [!IMPORTANT]
> **Preservation Guarantee:** In accordance with the Phase 01 Authorization, no production source code has been altered, no dependencies have been installed, and every single research asset, 3D model, and historical transcript cataloged in Phase 00 remains preserved without modification.

---

## 1. Studio Research & Industry Benchmarks

### 1.1 Active Theory: Deconstruction of Technical & Creative Patterns
Active Theory's decade of pioneering real-time interactive 3D web experiences (built upon their proprietary **Hydra** engine) demonstrates that immersive installations succeed through a synthesis of five design principles:

1. **The Canvas as Primary Reality (The "Zero-UI" Principle):**
   * Traditional sites separate "page content" (DOM HTML) from "visual background" (canvas). Active Theory dissolves this barrier: interface controls, metadata labels, and typography exist within the spatial coordinate system or directly respond to camera velocity, lens focal length, and lighting vectors.
2. **Optics-First Post-Processing Pipeline:**
   * Raw WebGL geometry often looks sterile and "computational." Active Theory elevates real-time scenes by processing the final render target through multi-pass post-processing shaders: subtle chromatic aberration at screen edges, lens barrel distortion, camera sensor noise/grain, anamorphic lens flares, and physically calibrated bloom.
3. **Fluid Inertia & Kinetic Responsiveness:**
   * Every interaction—pointer movements, wheel scrolls, drag orbits—utilizes second-order differential damping or spring physics (`Euler` / `Verlet` integration). Elements feel like they have physical mass and surface friction rather than immediate linear CSS transitions.
4. **Cinematic Micro-Camera Rail Choreography:**
   * Rather than giving the user a wild, unconstrained orbit ball where camera angles can break or clip awkwardly, camera paths follow constrained Catmull-Rom splines designed like dolly tracks in film direction. The user controls progress along the track while retaining subtle look-around freedom.
5. **Sound-Driven Spatial Immersion:**
   * Sound is never background elevator music; it is an active mechanical participant. Web Audio API synthesisers, procedural noise generators, and positional audio nodes react in real time to camera distance, speed, and focus.

```
+--------------------------------------------------------------------------------------------------+
|                             ACTIVE THEORY INSTALLATION PARADIGM                                 |
+--------------------------------------------------------------------------------------------------+
|  [RAW 3D SCENE GRAPH]  -->  [CUSTOM GLSL SHADERS]  -->  [POST-PROCESSING COMPOSER]              |
|  - Authentic NASA GLB       - Micro-porous Regolith      - Filmic Grain & Halation               |
|  - 1:1 Scale Hardware       - Opposition Surge           - Chromatic Aberration                  |
|  - Curvature Horizon        - Specular Kapton Reflection - Anamorphic Bloom                      |
|                                                                                                  |
|  [SPATIAL AUDIO SYNTHESIS] <-------------------------------------------> [INTERACTION DYNAMICS]  |
|  - Suit ECS Oxygen Rumble                                                 - Fluid Inertial Drag  |
|  - Quindar Tone Triggers                                                  - Magnetic Reseau Snap |
|  - Doppler Carrier Hiss                                                   - Spline Camera Tracks |
+--------------------------------------------------------------------------------------------------+
```

### 1.2 Other Benchmark Digital Installations & Spatial Storytelling
- ***Apollo in Real Time* (Ben Feist / NASA):** The gold standard for historical multi-track documentary synchronization (air-to-ground audio, mission control loops, flight plans, and photography tied to Mission Elapsed Time).
- ***Paper Planes* (Active Theory / Google):** Demonstrates high-volume WebGL instancing, lightweight physics, and frictionless cross-device touch interaction.
- ***First Man: Lunar Experience* (Universal / B-Reel):** Minimalist, monochromatic, terrifyingly quiet aesthetic capturing the violent contrast between blinding sunlight and bottomless lunar shadow.
- ***The A-Z of AI* (Google / To Move Mountains):** Unconventional editorial layout combining large-format typographic display with real-time interactive GL shaders.

---

## 2. Existing Project Grounding & Preservation Matrix

Creative experimentation must never drift into fantasy or generic science fiction. AFTERLIGHT’s emotional power stems from the fact that **these machines actually exist on the Moon right now, exactly where Pete Conrad and Alan Bean left them in November 1969.**

Every visual concept proposed below directly consumes our verified repository assets:

```
+---------------------------------------------------------------------------------------------+
|                          AFTERLIGHT VERIFIED ARCHIVAL FOUNDATION                            |
+---------------------------------------------------------------------------------------------+
| 3D HARDWARE:      - LM-6 "Intrepid" (apollo_lunar_module.glb, 97k tris, Draco compressed)   |
|                   - Surveyor 3 Lander (surveyor_3_lander.obj on 11.8° crater slope)         |
|                   - ALSEP Array A (CS, SNAP-27 RTG, PSE gold shroud models)                 |
|                                                                                             |
| TOPOGRAPHY:       - Surveyor Crater NASA/USGS Cross-Section Spline (-21.4m to +1.8m)        |
|                   - Continuous 16,000m Spherical Horizon Curvature Formula                  |
|                                                                                             |
| PHOTOGRAPHY:      - 14 Authentic AS12 Hasselblad 70mm Scans (High-Res 5000px Archives)      |
|                                                                                             |
| CARTOGRAPHY:      - EVA 1 & EVA 2 Geological Stations (14 Waypoints in traverse_waypoints) |
|                                                                                             |
| SCHEMATICS:       - Grumman (LDW-340-10026), Hughes (HAC-SUR-0348), Bendix (BSR-2760) SVGs |
|                                                                                             |
| ACOUSTICS:        - Synthetic 2525Hz/2475Hz Quindar Beeps + 280Hz Suit ECS Oxygen Rumbler   |
+---------------------------------------------------------------------------------------------+
```

---

## 3. Scientific Integrity & Provenance Protocol

To avoid historical revisionism, AFTERLIGHT adheres to a four-tier classification taxonomy. Every visual element, shader treatment, or interactive mechanism introduced in the rework must be tagged:

```
[AUTHENTIC NASA MATERIAL]
├── Direct scans of 70mm Hasselblad flight film (e.g., AS12-48-7134).
├── Primary audio loop recordings from Manned Spacecraft Center Master Tapes.
└── Raw air-to-ground transcripts and crew mission logs.

[VERIFIED PHYSICAL RECONSTRUCTION]
├── 1:1 scale dimensions (LM-6 9.45m span, Surveyor 4.27m leg spread).
├── Exact topographical elevation splines derived from USGS survey data.
└── True lunar curvature calculations (R = 1,737.4 km) and 12.4° solar elevation.

[SCIENTIFICALLY INFORMED APPROXIMATION]
├── Procedural regolith albedo maps representing Oceanus Procellarum basalt.
├── Photometric opposition surge (Hapke retroreflection) approximations.
└── Synthetic white-noise audio models of spacesuit ECS life-support fans.

[CREATIVE INTERPRETATION / INSTALLATION DEVICE]
├── Interactive HUD UI typography and glassmorphic / dark panels.
├── Camera dolly flight paths and focus transitions.
├── Vidicon CRT slow-scan raster visualizer lines.
└── Audio-reactive visualizer frequencies and magnetic cursor physics.
```

> [!NOTE]
> Any artistic stylization (such as LiDAR wireframes or holographic overlays) must be explicitly framed as an **analytical instrumentation layer**, ensuring the visitor never mistakes a digital diagnostic mode for the physical appearance of the Moon.

---

## 4. Three Distinct Art Direction Concepts

To explore the creative possibilities unconstrained by the existing layout, three radically different conceptual directions have been formulated:

---

### Concept A: THE LUNAR EXPEDITION
**Tagline:** *The Solitude of the Ocean of Storms.*  
**Tone & Mood:** Visceral, tactile, photorealistic, documentary sobriety, stark atmospheric vacuum.

```
+---------------------------------------------------------------------------------------------+
| CONCEPT A: THE LUNAR EXPEDITION                                                             |
|                                                                                             |
| Visual Language:                                                                            |
| - High-contrast monochromatic vacuum lighting (direct sun @ 1361 W/m², pitch-black sky).   |
| - Micro-detail focus: crumpled golden Kapton foil, bootprint tread impressions in regolith, |
|   tan UV photolysis discoloration on Surveyor's white paint.                                |
| - Film-stock simulation: Hasselblad 70mm square format, subtle halation, silver-halide grain|
|   and authentic 25-point Reseau optical crosshair fiducials.                                |
|                                                                                             |
| Interaction Philosophy:                                                                     |
| - First-person & low-angle third-person camera rails simulating astronaut eye level (1.75m). |
| - Physical inertia: camera steps with slight rhythmic swaying; audio responds to footfalls. |
| - Inspection: Clicking an artifact smoothly walks the camera directly up to the hardware,   |
|   revealing microscopic mechanical details (bolt cutters, sample scoops, plaque text).      |
+---------------------------------------------------------------------------------------------+
```

#### Key Visual Attributes
- **Palette:** Monochromatic charcoal (`#090b0e`), titanium gray (`#727a86`), crisp solar white (`#f4f6fa`), accented exclusively by genuine Kapton amber-gold (`#d48b16`).
- **Typography:** Architectural serif display (**Cinzel** or **Canela**) paired with crisp 1960s NASA telemetry (**SF Mono** / **Space Mono**).
- **Shader Pipeline:** Custom Hapke opposition surge shader producing the authentic *Heiligenschein* halo around the camera's shadow, paired with a PBR metallic-roughness workflow for the LM foil.
- **Audio Profile:** Dominated by the heavy, intimate low-frequency breathing and 280Hz fan hum of the A7L spacesuit ECS, punctuated by sharp Quindar beeps whenever telemetry updates.

---

### Concept B: THE DIGITAL OBSERVATORY
**Tagline:** *Decommissioned Hardware Seen Through Machine Eyes.*  
**Tone & Mood:** Analytical, technological, radar/LiDAR telemetry, synthetic aperture scanning, computational archaeology.

```
+---------------------------------------------------------------------------------------------+
| CONCEPT B: THE DIGITAL OBSERVATORY                                                          |
|                                                                                             |
| Visual Language:                                                                            |
| - The lunar surface rendered as a precision scientific point cloud and vector contour wire. |
| - The physical models (LM-6, Surveyor, ALSEP) appear in high-density glowing technical      |
|   wireframes, revealing internal subsystems (propellant tanks, RTG core, Vidicon optics).   |
| - Persistent analytical HUD overlays: elevation cross-sections, azimuth angles, distance    |
|   vectors, radiation dosage meters, and lunar coordinate grids.                             |
|                                                                                             |
| Interaction Philosophy:                                                                     |
| - Multi-spectral view modes: Switch between Optical Visible, LiDAR Point Cloud, Radar       |
|   Sub-surface Echoes, and 1969 Surveyor 600-line Vidicon Scanline modes.                   |
| - Scrubbable timeline: An orbital timeline slider scrubbing through sun angles and EVAs.     |
| - Deep technical inspection: Exploded subsystem callouts hovering in 3D vector space.       |
+---------------------------------------------------------------------------------------------+
```

#### Key Visual Attributes
- **Palette:** Deep nocturnal blueprint (`#04070c`), CRT phosphor amber (`#f59e0b`), radar cyan (`#38bdf8`), and electric vector green (`#10b981`).
- **Typography:** Pure technical monospace (**Geist Mono** / **JetBrains Mono** / **Space Mono**), organized into tabular matrices, telemetry headers, and hexadecimal coordinate readouts.
- **Shader Pipeline:** Vertex-displacement elevation contours, dynamic scan-plane raymarching, depth-based wireframe shaders, and animated cathode-ray scanline sweeps.
- **Audio Profile:** High-frequency radio carrier frequencies, telemetry sync chirps, Geiger counter clicks near the SNAP-27 RTG, and pitch-shifted ALSEP seismometer acoustic reverberations.

---

### Concept C: THE SPATIAL ARCHIVE
**Tagline:** *The Living Museum of Extraterrestrial Monuments.*  
**Tone & Mood:** Architectural, brutalist, high-fashion Swiss editorial, sculptural, contemplative reverence.

```
+---------------------------------------------------------------------------------------------+
| CONCEPT C: THE SPATIAL ARCHIVE                                                              |
|                                                                                             |
| Visual Language:                                                                            |
| - Monumental, editorial layout inspired by modernist art institutions and Swiss design.     |
| - Massive, beautifully typeset typographic headlines floating seamlessly in the deep 3D     |
|   vacuum space around the spacecraft ("INTREPID", "SURVEYOR", "STATIO COGNITUM").           |
| - High-contrast photographic plates from the AS12 Hasselblad collection suspended in 3D     |
|   space at the exact spatial coordinates where Pete Conrad and Alan Bean stood.             |
|                                                                                             |
| Interaction Philosophy:                                                                     |
| - Spatial curation: The visitor scrolls smoothly down a curated editorial spine. The        |
|   camera transitions effortlessly between high-angle landscape compositions, photographic   |
|   installations, and intimate hardware close-ups.                                           |
| - Magnetic cursor & typography: Hovering over floating text or photographs smoothly shifts  |
|   depth-of-field, blurring background topography and bringing archival documents into razor |
|   focus.                                                                                    |
+---------------------------------------------------------------------------------------------+
```

#### Key Visual Attributes
- **Palette:** Absolute obsidian (`#020305`), parchment white (`#f2ede4`), warm archival bronze (`#c49746`), and muted slate (`#4a5260`).
- **Typography:** Ultra-refined high-contrast editorial serif (**Ogg**, **Editorial New**, or **Cinzel Decorative**) paired with minimalist neo-grotesque sans-serif (**Inter** / **Neue Haas Grotesk**).
- **Shader Pipeline:** Depth-of-field camera blur (bokeh), film halation, vignette gradients, and smooth spatial alpha cross-fades.
- **Audio Profile:** Sparse, elegant, resonant acoustic soundscape: deep sub-bass drones representing geological stability, accompanied by pristine historical voice recordings from Conrad and Bean.

---

## 5. Comparative Evaluation Matrix

| Metric / Dimension | Concept A: Lunar Expedition | Concept B: Digital Observatory | Concept C: Spatial Archive |
| :--- | :--- | :--- | :--- |
| **Aesthetic Impact** | Visceral, authentic, gritty | High-tech, futuristic, analytical | Sophisticated, artistic, monumental |
| **Documentary Rigor** | Maximum physical fidelity | Maximum telemetry data exposure | Maximum editorial & narrative clarity |
| **Interactive Novelty** | Tactile astronaut agency | Deep multi-mode diagnostic tools | Fluid spatial typographic pacing |
| **Shader & GPU Cost** | Medium (PBR textures, shadow cascades) | High (wireframe & point-cloud shaders) | Medium-Low (depth-of-field & layout) |
| **Mobile Accessibility** | Challenging (fine touch orbit controls) | Complex (dense telemetry screens) | Excellent (scroll-driven spatial cards) |
| **Emotional Tone** | Solitary, awe-inspiring, silent | Objective, precise, diagnostic | Reverent, poetic, commemorative |

---

## 6. The Recommended Direction: The Hybrid "Living Archival Monument"

Rather than choosing one concept to the exclusion of the others, **the ultimate installation should synthesize the strongest elements of all three into a cohesive, layered experience:**

```
                               +---------------------------------------+
                               |     AFTERLIGHT HYBRID ARCHITECTURE    |
                               +-------------------+-------------------+
                                                   |
        +------------------------------------------+------------------------------------------+
        |                                          |                                          |
+-------v-------------------------+ +--------------v------------------------+ +---------------v-------------------------+
| PRIMARY LAYER: THE EXPEDITION   | | SECONDARY LAYER: SPATIAL ARCHIVE      | | TERTIARY LAYER: OBSERVATORY TELEMETRY   |
| (Physical World)                | | (Editorial Curation)                  | | (Analytical Diagnostic Overlay)         |
| - Authentic 1:1 3D NASA Models  | | - Kinetic Spatial Typography          | | - 1969 Surveyor Vidicon 600-line Scan   |
| - Spherical 16km Lunar Curvature| | - Suspended AS12 Photo Plates at Stns | | - Grumman/Hughes Vector Blueprint Zoom  |
| - 12.4° Dawn Sunlight & Shadows | | - Smooth Scroll-Driven Chapter Rails  | | - Real-time Distance Vectors & Bearing  |
| - Suit ECS Web Audio Soundscape | | - Seamless Sliding Dossier Inspection | | - Geological Regolith Geochemistry      |
+---------------------------------+ +---------------------------------------+ +-----------------------------------------+
```

### Why this Synthesis Works:
1. **The physical world remains scientifically uncompromised:** The lunar surface and spacecraft render with total physical veracity (Concept A).
2. **The storytelling is effortless and cinematic:** The user can navigate via fluid, scroll-driven editorial chapters or free spatial exploration (Concept C).
3. **The technical depth is always accessible on demand:** Visitors seeking engineering blueprints, Vidicon scans, or radar telemetry can engage diagnostic layers with a single keypress or dock tap (Concept B).

---

## 7. Visual Identity, Typography & Color Specifications

### 7.1 Typographic Scale & Pairings

```
DISPLAY SERIF:        AFTERLIGHT
                      Scale: 48px - 84px | Tracking: 0.18em | All-Caps
                      Font: Cinzel / Editorial Serif / Trajan Modern
                      Usage: Expedition titles, subject names, monument designations.

EDITORIAL BODY:       The machines that stayed behind.
                      Scale: 14px - 18px | Line-Height: 1.65 | Kerning: Auto
                      Font: Inter / System Neo-Grotesque
                      Usage: Curated historical narrative, astronaut quotes.

TELEMETRY MONO:       LAT: 3.01239° S  LON: 23.42157° W  ALT: 1,400 M
                      Scale: 9px - 11px | Tracking: 0.22em | Tabular Nums
                      Font: Space Mono / JetBrains Mono / SF Mono
                      Usage: Real-time rangefinders, timestamp MET, hardware registers.
```

### 7.2 Color Architecture & Token Definition

```css
:root {
  /* The Void (Cosmic Background) */
  --space-void-black:        #020407; /* Absolute space background */
  --space-void-deep:         #070a0f; /* Secondary depth layer */

  /* The Lunar Surface (Oceanus Procellarum Basalt) */
  --regolith-shadow-black:   #0b0e14; /* Pure shadow zone in vacuum */
  --regolith-mare-mid:       #262b33; /* Sunlit diffuse regolith */
  --regolith-ejecta-high:    #4a5360; /* High-albedo impact ray soil */

  /* Direct Sunlight & Celestial Highlights */
  --solar-irradiance-white:  #f8fafc; /* Direct unfiltered 1361 W/m² sunlight */
  --earthshine-blue:         #1d2d44; /* Subtle earthlight fill on shadow side */

  /* Artifact Materials */
  --kapton-amber-primary:    #d97706; /* Specular multi-layer insulation foil */
  --kapton-amber-bright:     #f59e0b; /* Glint highlight */
  --surveyor-paint-aged:     #a89e90; /* 31-month UV-photolyzed tan paint */
  --aerospace-aluminum:      #cbd5e1; /* Brushed 7075-T6 tubular strut alloy */

  /* UI & Spatial Diagnostics */
  --ui-hairline-subtle:      rgba(255, 255, 255, 0.08);
  --ui-hairline-bright:      rgba(255, 255, 255, 0.22);
  --ui-amber-accent:         #f59e0b;
  --ui-telemetry-cyan:       #38bdf8;
}
```

---

## 8. Motion Choreography & Spatial Interaction Mechanics

### 8.1 Second-Order Fluid Damping (Inertial Navigation)
Mouse movements and touch gestures do not linearly translate the camera. Instead, interactions feed into an acceleration tensor:

$$\mathbf{x}_{t} = \mathbf{x}_{t-1} + \mathbf{v}_{t} \cdot \Delta t$$
$$\mathbf{v}_{t} = \mathbf{v}_{t-1} \cdot e^{-\lambda \Delta t} + \mathbf{a}_{input} \cdot \Delta t$$

Where damping factor $\lambda \approx 4.5\text{ s}^{-1}$ creates the feeling of drifting through zero-gravity vacuum with subtle momentum.

### 8.2 Magnetic Reseau Snap & Spatial Waypoint Selection
The Hasselblad 25-point Reseau grid acts as an active interactive targeter. As the camera swings near an artifact (Intrepid, Surveyor 3, ALSEP):
1. The nearest Reseau crosshair (+) gently stretches and magnetizes toward the hardware centroid.
2. A subtle high-frequency Quindar audio ping triggers in the stereo field.
3. Telemetry distance readouts lock on with tabular tick updates (`23M`, `22M`, `21M`).
4. Clicking engages a cinematic Catmull-Rom dolly curve directly into inspection focus.

---

## 9. Spatial Acoustic Architecture

```
                                  +-----------------------+
                                  | Web Audio API Context |
                                  +-----------+-----------+
                                              |
        +-------------------------------------+-------------------------------------+
        |                                     |                                     |
+-------v-------+                     +-------v-------+                     +-------v-------+
|  ECS SUIT HUM |                     | QUINDAR TONES |                     | RADIO CARRIER |
| - 280Hz Filter|                     | - 2525Hz Intro|                     | - VHF Hiss    |
| - Pink Noise  |                     | - 2475Hz Outro|                     | - PCM Flutter |
| - Breathing   |                     | - Sine Burst  |                     | - Squelch Gate|
+-------+-------+                     +-------+-------+                     +-------+-------+
        |                                     |                                     |
        +-------------------------------------+-------------------------------------+
                                              |
                                     +--------v--------+
                                     | Convolver Reverb|
                                     | (Suit Enclosure)|
                                     +--------+--------+
                                              |
                                     +--------v--------+
                                     | Master Output   |
                                     +-----------------+
```

1. **Suit Life Support Drone:** 280 Hz low-pass filtered pink noise generated mathematically without external audio files. Gain dynamically modulates with camera velocity (simulating increased oxygen flow during rapid movement).
2. **Quindar Communications Beep:** Pure mathematical sine oscillators (2525 Hz for 250ms on inspection open, 2475 Hz on close).
3. **Historical Radio Transcripts:** Linked to actual mission timeline timestamps, featuring authentic audio excerpts of Pete Conrad and Alan Bean laughing, working, and describing the Surveyor lander.

---

## 10. Technical Implementation Strategy & Safe Migration Gates

To protect the existing project while introducing these advanced studio capabilities, the implementation must follow strict staging gates:

### Gate 1: Defect Remediation & Staging Branch (Zero Visual Disruption)
- Fix the missing `eventBus` import in [TraverseModal.js](file:///Users/justin/Public/projects/Afterlight/src/ui/TraverseModal.js).
- Correct the `art.narrative.origin` data accessors in [FallbackView.js](file:///Users/justin/Public/projects/Afterlight/src/ui/FallbackView.js).
- Create a dedicated Git branch (`feature/creative-rework`) to ensure `main` remains untouched until final sign-off.

### Gate 2: Shaders & Post-Processing Pipeline
- Introduce `EffectComposer` alongside the standard render loop, providing togglable filmic tone mapping, lens grain, and bloom without breaking baseline performance.
- Migrate the CPU canvas regolith texture generation to an optimized custom GLSL fragment shader with Hapke retroreflection.

### Gate 3: Spatial Interface & Editorial Motion
- Implement spatial typography and camera rail splines using Anime.js.
- Ensure all mobile touch layouts are cleanly decoupled from desktop keyboard controls.

---

## 11. Approval Request & Next Action

This creative research document establishes the complete art direction, visual identity, motion choreography, and technical strategy for AFTERLIGHT Level 3.

**Current State:**
- All research documented and cross-linked to verified assets.
- Production source code remains completely unchanged.
- Development and preview servers remain active on ports `3000` and `4173`.

**Awaiting User Direction:**
Please review this document and indicate whether you approve the recommended **Hybrid "Living Archival Monument"** direction, or if you prefer to emphasize one of the three discrete concepts (The Lunar Expedition, The Digital Observatory, or The Spatial Archive) before we proceed to Phase 02 prototyping.
