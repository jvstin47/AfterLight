# AFTERLIGHT — Educational Information Architecture & Progressive Disclosure

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-EIA-010  
**Methodology:** 4-Tier Progressive Learning Framework for Cultural & Scientific Heritage  
**Design Paradigm:** Field-Instrument Aesthetics, Editorial Restraint, and Deep Research Transparency  

---

## 1. The Pedagogical Challenge & Design Philosophy

Digital historical archives frequently suffer from two opposing failure modes:
1. **The Superficial 3D Model Showcase:** Visually flashy 3D environments that lack factual substance, reducing historical engineering to decorative video game props.
2. **The Inaccessible Academic Wall of Text:** Dense, unstyled bibliographic dumps that overwhelm general visitors and deter curiosity.

AFTERLIGHT resolves this via **Progressive Disclosure**: every mission, artifact, and geological landmark is structured into **four concentric levels of cognitive engagement**. A casual visitor can grasp the emotional and historical significance in 10 seconds, while an aerospace historian or physics student can inspect flight telemetry and NASA technical reports without leaving the environment.

---

## 2. The 4-Tier Knowledge Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   THE 4-TIER PROGRESSIVE DISCLOSURE STACK                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 1: DISCOVERY (Casual Explorer — 10 to 30 Seconds)                     │
│ • Primary hook, iconic quote, headline milestone, location tag, status.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 2: EXPLORATION (Curious Investigator — 1 to 3 Minutes)                │
│ • Illustrated historical narrative, 70mm Hasselblad photos, timeline log,   │
│   crew profiles, key artifacts left behind, interactive 3D model orbit.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 3: INVESTIGATION (Technical Student / Enthusiast — 5 to 15 Minutes)   │
│ • Engineering blueprints, dimensions & dry masses, ALSEP telemetry graphs,  │
│   physical experiment mechanics, chemical assays (APXS/LIBS), transcripts.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ LEVEL 4: RESEARCH (Academic / Specialist / Educator — Deep Archival Dive)   │
│ • Primary source citations (NSSDC IDs, LROC product URLs, PDS datasets),    │
│   USGS geological maps, flight plans, peer-reviewed papers, downloadable    │
│   machine-readable JSON records.                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. UI Component Mapping to Disclosure Levels

| Level | Primary UI Surface | Cognitive Load | User Action | Content Format |
| :--- | :--- | :--- | :--- | :--- |
| **L1: Discovery** | In-scene 3D Spatial Marker Pill / Atlas Card Summary | Minimal ($<50$ words) | Hover / Glance | Mission code, badge, landing date, one-sentence significance. |
| **L2: Exploration** | Standard Dossier Drawer / Expeditions Modal Card | Moderate ($<250$ words) | Single Click / Key `E` | Curated archival photograph, multi-chapter narrative tabs, audio snippet. |
| **L3: Investigation** | Deep Inspection Drawer (`#site-detail-modal`) | In-Depth ($500–1,000$ words) | Click "EXPEDITION ARCHIVE DOSSIER →" | Hardware specification tables, instrument schematics, sample numbers. |
| **L4: Research** | Archival Footnotes & Research Drawer Tab | Academic / Exhaustive | Click "PRIMARY SOURCE CITATIONS" | Full bibliographic citations, NASA report numbers, direct DOI/URL links. |

---

## 4. Concrete Implementation Example: Apollo 14 (Fra Mauro)

### Level 1 — Discovery
- **Header:** `APOLLO 14 • FRA MAURO FORMATION`
- **Hook:** *The redemption flight of Alan Shepard: humanity's first handcart traverse and the climb up the ejecta blanket of Cone Crater.*
- **Key Metrics:** February 5, 1971 | 33 hr 31 min surface stay | 42.28 kg samples.

### Level 2 — Exploration
- **Visuals:** High-resolution scan of photo AS14-68-9405 showing Alan Shepard pulling the Modular Equipment Transporter (MET) rickshaw across Fra Mauro.
- **Narrative Chapters:**
  - *Origin:* Returning to flight after the near-disaster of Apollo 13; targeting the rugged Fra Mauro uplands.
  - *Traverse:* Pulling the two-wheeled MET through ankle-deep soft dust; navigating without landmarks to find the rim of Cone Crater.
  - *The Golf Shot:* Adapting the contingency sample scoop handle to strike two Wilson 6-iron golf balls into the lunar vacuum.

### Level 3 — Investigation
- **Engineering Specs:**
  - LM-8 *Antares* Descent Stage: Dry mass 2,144 kg, TRW DPS engine, 4 footpads.
  - MET Cart: Mass empty 11.3 kg, payload capacity 63.5 kg, two nitrogen-inflated pneumatic rubber tires ($4.00 \times 8\text{ in}$, pressure 10 kPa).
- **Scientific Instruments (ALSEP Array C):**
  - Active Seismic Experiment (ASE): 21 thumper charges detonated along a 100m geophone line; mortar grenade box deployed.
  - Suprathermal Ion Detector Experiment (SIDE / CCIG): Monitored positive ion flows and ambient pressure ($10^{-12}\text{ torr}$).
- **Key Geological Samples:** Sample 14321 ("Big Bertha", 9.0 kg polymict breccia containing a terrestrial zircon fragment formed 4.01 billion years ago on ancient Earth).

### Level 4 — Research
- **Primary Source Attributions:**
  - NASA Manned Spacecraft Center: *Apollo 14 Mission Report* (MSC-04112, April 1971).
  - NASA SP-272: *Apollo 14 Preliminary Science Report* (NASA Special Publication, 1971).
  - USGS Professional Paper 880: *Geology of the Apollo 14 Landing Area* (Swann et al., 1977).
  - LROC NAC Product: `M114165453LE` (Target coordinates: $3.6453^\circ\text{ S}, 17.4714^\circ\text{ W}$, ASU, 2011).
  - Sample 14321 Terrestrial Zircon Study: Bellucci et al., *Earth and Planetary Science Letters*, Vol 510, pp 173–185 (2019).
