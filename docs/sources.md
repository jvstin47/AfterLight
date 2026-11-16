# AFTERLIGHT — SOURCES & SCIENTIFIC BIBLIOGRAPHY

**Project:** AFTERLIGHT — The Living Archival Monument  
**Landing Site:** Statio Cognitum (Apollo 12)  
**Lunar Coordinates:** $3.01239^\circ\text{ S}, 23.42157^\circ\text{ W}$  
**Revision:** Phase 04.1 Audit Verification  
**Date:** November 17, 2026

---

## 1. Primary NASA & Contractor Technical Reports

1. **NASA Manned Spacecraft Center (1970)**  
   *Apollo 12 Preliminary Science Report*, NASA SP-235.  
   Contains the baseline photogrammetric plane-table contours of Surveyor Crater, regolith physical properties, and traverse geology.  
   Archive URL: `https://ntrs.nasa.gov/citations/19700025700`

2. **NASA Manned Spacecraft Center (1970)**  
   *Apollo 12 Mission Report*, MSC-01855.  
   Detailed landing telemetry, descent trajectory, touchdown coordinates, and LM-6 systems performance.  
   Archive URL: `https://ntrs.nasa.gov/citations/19700025702`

3. **Grumman Aerospace Corporation (1969)**  
   *Lunar Module Flight Manual (LMA790-3)* and *LM Landing Gear Subsystem Data LDW 280-M-series*.  
   Provides exact structural dimensions, landing pad deployment geometry, and lunar surface contact wand placement ($1.68\text{m}$ wands on Port, Starboard, and Aft struts; ladder strut omitted).

4. **Jet Propulsion Laboratory / Hughes Aircraft Company (1969)**  
   *Surveyor III Mission Report*, JPL Technical Report 32-1177 / HAC SSD 68045R.  
   Comprehensive mechanical drawings, telecommunications antenna dimensions, surface sampler scoop mechanics, and lunar landing telemetry.

5. **NASA Manned Spacecraft Center (1972)**  
   *Analysis of Surveyor 3 Samples and Photographs Returned by Apollo 12*, NASA SP-288.  
   Scientific analysis of returned Surveyor 3 parts (TV camera collar, unpainted tube sections, polished aluminum visor), documenting cutting shear marks and solar photolysis paint degradation.

6. **Bendix Aerospace Systems Division (1968)**  
   *Apollo Lunar Surface Experiments Package (ALSEP) Array A Flight Handbook*, Bendix ATM-233.  
   Layout configurations, S-Band antenna pointing angles, SNAP-27 cabling routes, and deployment distances for ALSEP Array A.

---

## 2. Cartographic, Topographic & Orbital Imaging Datasets

1. **NASA / ASU Lunar Reconnaissance Orbiter Camera (LROC)**  
   *Apollo 12 Landing Site Digital Terrain Model (`NAC_DTM_APOLLO12`)*.  
   Derived photogrammetrically from LROC NAC stereo pair `M120005333LE/RE` and `M120012135LE/RE` using SOCET SET and USGS ISIS.  
   Post spacing: $1.5\text{ m/pixel}$ (elevation), $0.5\text{ m/pixel}$ (orthophoto).  
   Archive URL: `https://lroc.asu.edu/featured_sites/view_site/NAC_DTM_APOLLO12`  
   PDS Geosciences Node URL: `https://pds-geosciences.wustl.edu/lro/lro-l-lroc-5-rdr-v1/lrolrc_2001/data/dtm/`

2. **NASA Goddard Scientific Visualization Studio (SVS)**  
   *Tour of the Apollo 12 Landing Site (SVS 4767)*, visualizer Ernie Wright (November 15, 2019).  
   High-resolution nadir imagery based on LROC NAC frame `M175428601LE/RE`.  
   Archive URL: `https://svs.gsfc.nasa.gov/4767/`

3. **USGS Astrogeology Science Center (1978)**  
   *Traverse Map of the Apollo 12 Landing Site*, USGS Map I-1037.  
   Provides the precise cartographic coordinates, EVA-1 and EVA-2 waypoints, and crater morphology for Statio Cognitum.

---

## 3. Ephemeris & Astronomical Calibration Sources

1. **JPL Planetary and Lunar Ephemeris DE430**  
   Folkner, W. M., et al. (2014). *The Planetary and Lunar Ephemerides DE430 and DE431*, IPN Progress Report 42-196.  
   Used to compute topocentric solar vector (Azimuth $96.5^\circ$, Elevation $13.5^\circ$) and Earth topocentric vector (Azimuth $96.5^\circ$, Elevation $64.5^\circ$) at Apollo 12 touchdown (November 19, 1969, 06:54:35 UTC).

2. **Hapke Photometric Scattering Model**  
   Hapke, B. (1984). *Bidirectional Reflectance Spectroscopy: 3. Correction for Macroscopic Roughness*, Icarus, 59(1), 41–59.  
   Governs regolith opposition surge (*Heiligenschein*) backscatter mathematical formulations implemented in `RegolithMaterial.js`.
