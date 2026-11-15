# AFTERLIGHT — Phase 02 Visual & Interaction Design Specification

**Project:** AFTERLIGHT  
**Tagline:** *The machines that stayed behind.*  
**Milestone:** Phase 02 — The Lunar Environment (Apollo 12)  
**Date:** November 2026  

---

## 1. Creative Philosophy & Aesthetic Benchmark

AFTERLIGHT combines the documentary sobriety of a scientific institution with the bespoke interaction quality of high-end digital studios (e.g., Active Theory, Cyera, Anime.js). 

> **Core Axiom:** The interface should not feel like you are browsing an archive. It should feel like you are entering one.

### Visual Guardrails
- **The Moon is an alien desert, not a fantasy backdrop:** No purple/blue nebulas, no floating particle dust, no neon sci-fi borders, no glassmorphism cards.
- **Physical vacuum lighting:** Stark, sharp shadows; direct 1361 W/m² solar illumination; deep black sky ($L \approx 0\text{ cd/m}^2$); subtle ground retroreflection (*Heiligenschein*).
- **Restrained Editorial Typography:** High-contrast sans-serif editorial display headings paired with precise monospace metadata and telemetry coordinates.
- **Atmosphere of Solitude & Reverence:** Quiet, deliberate pacing. Every transition communicates distance, time, and physical permanence.

---

## 2. Typographic System & Color Palette

### Typography
- **Display Serif / Grotesque:** Clean, modernist editorial headers (`Cinzel` / `Space Grotesk` / system high-end sans-serif fallbacks: `system-ui, -apple-system, sans-serif`).
- **Telemetry & Technical Data:** Monospace (`Geist Mono`, `JetBrains Mono`, `SF Mono`, `Courier New`).
- **Body & Archival Narrative:** Clean humanist/grotesque with generous line-height (`1.65`) for prolonged reading comfort.

### Color Tokens
```css
:root {
  --color-void: #050608;          /* Absolute space black */
  --color-regolith: #121418;      /* Deep basaltic regolith shadow */
  --color-surface-mid: #2a2e36;   /* Cross-sun illuminated lunar soil */
  --color-sunlight: #f4f5f7;      /* Unfiltered direct solar white */
  --color-kapton-gold: #e5a93b;   /* Specular MLI thermal foil accent */
  --color-telemetry: #8e96a4;     /* Muted engineering readouts */
  --color-accent-active: #d4d8e0; /* Active interactive target */
  --color-surveyor-tan: #a89f91;  /* Weathered white paint / UV solar browning */
}
```

---

## 3. Experience State Machine & Interaction Architecture

The experience is structured into three continuous, progressively disclosed stages:

```
[STAGE A: THE APPROACH]
        |
        | User clicks "[ ENTER SITE ]" or skips
        v
[STAGE B: LUNAR ENVIRONMENT] <-------------------------------+
  - 3D Terrain & Craters                                    |
  - Real-time Sun Lighting                                  |
  - Floating 3D Telemetry Markers                           |
  - Free Orbit / Eye-Level / Overview Navigation            |
        |                                                   |
        | User clicks an Artifact Marker                    | Close Dossier [ESC]
        v                                                   |
[STAGE C: ARTIFACT INSPECTION & ARCHIVAL DOSSIER] ----------+
  - Cinematic camera dolly/framing
  - 6-Stage Narrative Drawer (Origin -> Legacy)
  - Authentic 70mm Hasselblad Photography Carousel
  - Subsystem Vector Blueprint
  - Synthesized Quindar & Ambient Audio Cue
```

---

## 4. The 6-Stage Narrative Framework (Artifact Storytelling)

Every primary artifact adheres to a rigorous, consistent narrative structure:

1. **ORIGIN:** Why was it conceived, funded, and engineered on Earth?
2. **JOURNEY:** How was it launched, navigated, and landed on alien regolith?
3. **MISSION:** What specific scientific measurements or exploration tasks was it built to execute?
4. **DISCOVERIES:** What fundamental truths about the Moon and solar system did it uncover?
5. **FINAL DAYS:** How did its active mission conclude? What was its final operational state?
6. **LEGACY:** Where does it rest today? What is its physical condition after decades in the vacuum?

---

## 5. Motion Choreography (Anime.js Principles)

- **Text Masking:** Editorial titles emerge from `overflow: hidden` bounding containers via vertical translation (`translateY: ['100%', '0%']`) with an exponential deceleration curve (`easeOutExpo`).
- **Telemetry Readout Stagger:** Coordinates, elevations, and timestamps enter with staggered character or word delays (15ms per character or 60ms per line).
- **Camera Interpolation:** Three.js camera position and look-at vectors transition smoothly using cubic or exponential easing, maintaining steady orientation to avoid motion sickness.
- **Micro-Interactions:** Hover states on artifact markers subtly expand targeting brackets and illuminate bearing azimuths without distracting flashing or neon glow.

---

## 6. Audio Architecture (Web Audio API)

- **Quindar Tones:** Synthesized authentic dual-frequency radio switch tones (Intro: 2,525 Hz, Outro: 2,475 Hz, duration: 250ms).
- **Life Support System Drone:** A filtered low-frequency pink/brown noise oscillator simulating the oxygen circulation fans inside the Apollo A7L spacesuit.
- **Audio Privacy & User Control:** Audio begins muted by default, respecting user preferences with an explicit, persistent sound toggle in the corner HUD.

---

## 7. Accessibility & Resilience

- **WebGL Fallback:** If WebGL is unavailable or fails to initialize, a high-fidelity archival gallery mode automatically renders with full editorial narrative and photographic assets.
- **Reduced Motion:** Queries `prefers-reduced-motion: reduce` to bypass smooth camera dollies and text translation animations, jumping directly to resting states.
- **Keyboard Navigation:** Full support for `WASD` / Arrow keys for camera movement, `Tab` / `Enter` for artifact selection, and `Escape` to close drawers and return to overview.
