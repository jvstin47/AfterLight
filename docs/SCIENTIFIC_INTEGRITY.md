# Scientific & Historical Integrity Protocol

**Project:** AFTERLIGHT  
**Tagline:** *The machines that stayed behind.*  

---

## 1. Guiding Philosophy
AFTERLIGHT is not a generic sci-fi visualization or speculative space entertainment project. It is an authentic digital archive commemorating human engineering and robotic artifacts on other worlds.

Every object, coordinate, measurement, and historical claim presented in this project must adhere to strict protocols of scientific veracity and primary archival documentation.

---

## 2. Source Hierarchy & Verification Standards

To maintain academic and historical integrity, contributors must source information according to the following hierarchy:

1. **Tier 1 (Primary Government & Flight Mission Records):**
   - Official NASA Mission Reports (e.g., MSC-01855).
   - NASA Technical Reports Server (NTRS) technical memoranda and contractor post-flight evaluation studies (e.g., NASA SP-284).
   - Apollo Lunar Surface Journal (ALSJ) audio logs, photographic indexes, and air-to-ground voice transcripts.
   - Planetary Data System (PDS) datasets from the Lunar Reconnaissance Orbiter (LROC) and Lunar Orbiter programs.
2. **Tier 2 (Peer-Reviewed Academic Literature):**
   - Articles published in journals such as *Science*, *Nature*, *Icarus*, or the *Journal of Geophysical Research (Planets)*.
   - Publications by Principal Investigators of ALSEP instruments (e.g., Dr. Gary Latham on seismology, Dr. Palmer Dyal on magnetism).
3. **Tier 3 (Institutional Reference Works):**
   - Smithsonian National Air and Space Museum collection records.
   - Lunar and Planetary Institute (LPI) regional cartography and geological atlases.

*Secondary journalism, popular science blogs, and encyclopedias are not considered authoritative sources for engineering specs or coordinates.*

---

## 3. Clear Distinction: Historical Artifacts vs. Reconstructions

One of AFTERLIGHT's core tenets is full transparency regarding the origin of digital assets:

- **Original Historical Scans:** Direct high-resolution digital scans of archival film (e.g., 70mm Hasselblad film magazines) or orbital imaging (LROC NAC) are cataloged with their exact NASA frame identifiers (e.g., `AS12-48-7134`, `M175428601LE`). Their exposure data, orientation, and date are preserved without retroactive artistic manipulation.
- **Representative 3D Reconstructions:** When 3D geometry is modeled (e.g., `surveyor_3_lander.obj` or `snap27_rtg.obj`), it is explicitly identified as a *scientifically grounded reconstruction* built to match documented blueprints. Any deviation made for real-time performance or polygon budgets must be documented in the asset specification.
- **Artistic & Atmospheric Visualizations:** Stylized visual modes (such as scanline shaders, geometric isolines, or ambient soundscapes) must be presented as interpretive user-interface layers, never confused with authentic historical telemetry or photographic records.

---

## 4. Lunar Coordinates & Geodesy Standards

- **Horizontal Datum:** All lunar surface coordinates are registered in the **Mean Earth/Polar Axis (ME) reference system (IAU/IAG 2000)** as established by the Lunar Reconnaissance Orbiter science team.
- **Reference Ellipsoid:** Lunar reference sphere radius of $R_M = 1737.4\text{ km}$.
- **Landing Site Baseline:**
  - *Intrepid Lunar Module Descent Stage:* `3.01239° S, 23.42157° W`
  - *Surveyor 3 Spacecraft:* `3.01520° S, 23.41890° W`
  - *Separation Distance:* Precisely 163 meters (535 feet) at an azimuth of 155°.

---

## 5. Handling Historical Controversies: The Surveyor 3 Microbe Finding

A critical test of scientific integrity is how anomalous or disputed historical data is treated:

- **The Historical Claim (1970):** In 1970, NASA researchers reported that 50 to 100 viable cells of *Streptococcus mitis* bacteria had been cultured from a piece of polyurethane foam insulation retrieved from inside the Surveyor 3 television camera after 31 months on the Moon. This was widely reported as evidence of terrestrial life surviving extraterrestrial exposure.
- **The Modern Scientific Consensus (1998–Present):** Subsequent rigorous re-investigation by Leonard Ellis, Donald Morrison, and NASA astrobiologists revealed that the finding was almost certainly a **false positive resulting from clean-room contamination during laboratory handling in Houston**. Archival video and teardown logs documented technicians working without proper masks and sterile flow hood configurations.
- **AFTERLIGHT Policy:** The project documents both the 1970 historical episode and the modern forensic consensus, presenting the true history of planetary protection science rather than sensationalizing outdated claims.

---

## 6. Physical Environment & Lighting Fidelity

When designing 3D scenes in future phases, the rendering engine must honor real lunar physical parameters:
- **No Atmospheric Rayleigh Scattering:** The sky is deep black ($L \approx 0\text{ cd/m}^2$). No atmospheric haze, tinting, or horizon glow.
- **Direct Solar Illuminance:** Approx. $1361\text{ W/m}^2$ solar constant.
- **Sun Elevation Angle:** During Apollo 12 EVA-1, the sun rose from ~5° to 11°; during EVA-2, from ~12° to 17°. Shadows are extremely elongated across crater walls.
- **The Opposition Surge (Heiligenschein):** The lunar regolith displays non-Lambertian retroreflection, producing an intense bright halo around the anti-solar point.
