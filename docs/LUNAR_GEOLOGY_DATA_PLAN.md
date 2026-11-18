# AFTERLIGHT — Lunar Cartography & Geology Data Acquisition Plan

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-LGD-008  
**Subject:** Scientific Dataset Inventory, Resolution Tiers, Geospatial Projections, and Performance Budget  
**Authoritative Repositories:** USGS Astrogeology, NASA Planetary Data System (PDS), LROC Science Operations Center (ASU), JAXA DARTS  

---

## 1. Cartographic & Geological Data Architecture

To represent the Moon as an authentic scientific world rather than a flat sphere, AFTERLIGHT utilizes a multi-resolution, tiered cartographic pipeline:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MULTI-TIER CARTOGRAPHIC PYRAMID                          │
├──────────────────────────┬──────────────────────────┬───────────────────────┤
│ TIER 1: GLOBAL BASEMAPS  │ TIER 2: REGIONAL BASINS  │ TIER 3: LOCAL SITES   │
│ 100m – 1 km/px           │ 5m – 50m/px              │ 0.5m – 2m/px          │
│ • LROC WAC Global Mosaic │ • LOLA Regional Hillshade│ • LROC NAC Stereo DTMs│
│ • LOLA Elevation DTM     │ • USGS Geologic Units    │ • Apollo Traverse DTM │
│ • IAU Crater Gazetteer   │ • Basalt stratigraphy    │ • In situ micro-relief│
└──────────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## 2. Authoritative Dataset Inventory & Specifications

| Dataset Name | Primary Instrument | Sponsoring Agency | Spatial Resolution | Global Coverage | Reference Datum & Projection | Primary Scientific Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **LROC WAC Global Morphologic Mosaic** | Wide Angle Camera (WAC) | NASA / ASU | 100 m/pixel | 100% (Near + Far side) | Equirectangular ($R = 1,737.4\text{ km}$) | Photorealistic albedo base texture with illumination matching. |
| **LOLA Gridded Data Record (LDEM_128)** | Lunar Orbiter Laser Altimeter | NASA GSFC | 118 m/pixel (128 px/deg) | 100% Global | Polar Stereographic / Equirectangular | True elevation relief, terrain normal computation, depth contours. |
| **Unified Geologic Map of the Moon** | Multi-Mission Synthesis | USGS Astrogeology | 1:5,000,000 scale | 100% Global | GIS Shapefiles / GeoTIFF | Stratigraphic age units, Copernican/Eratosthenian/Imbrian boundaries. |
| **LROC NAC Apollo 12 DTM (`NAC_DTM_APOLLO12`)** | Narrow Angle Camera (NAC) | NASA / ASU | 1.5 m/pixel (Elevation: 0.5m) | $10\text{ km} \times 25\text{ km}$ local | Equirectangular ($3^\circ\text{ S}, 23.4^\circ\text{ W}$) | High-fidelity micro-topography for Statio Cognitum flagship site. |
| **LOLA PSR Cold Trap Map** | LOLA Altimetry + Diviner | NASA GSFC / UCLA | 20 m/pixel | $80^\circ\text{ S to } 90^\circ\text{ S}$ | Polar Stereographic ($R = 1,737.4\text{ km}$) | Demarcation of Permanently Shadowed Regions and water ice reserves. |
| **IAU Gazetteer of Planetary Nomenclature** | WGPSN Gazetteer | IAU / USGS | Vector Points / Polygons | All named craters & maria | Latitude/Longitude coordinates | Searchable gazetteer of 9,000+ named lunar features. |

---

## 3. Major Impact Basins & Selenographic Landmarks

The digital archive indexes the 8 principal impact basins that define lunar geomorphology:

1. **South Pole-Aitken (SPA) Basin:**
   - *Dimensions:* $2,500\text{ km}$ diameter, $13\text{ km}$ deep (Largest, deepest confirmed impact basin in the Solar System).
   - *Hemisphere:* Far side ($53^\circ\text{ S}, 169^\circ\text{ W}$).
   - *Significance:* Excavated into the lower crust and upper mantle; target of Chang'e 4 (Von Kármán crater) and Chang'e 6 (Apollo basin).
2. **Mare Imbrium Basin:**
   - *Dimensions:* $1,145\text{ km}$ diameter ($3.85\text{ Ga}$ impact event).
   - *Hemisphere:* Near side ($32.8^\circ\text{ N}, 15.6^\circ\text{ W}$).
   - *Significance:* Created the Apennine Mountain chain; flooded by thick, multiple-stage basalt flows. Sites: Apollo 15, Lunokhod 1, Chang'e 3.
3. **Mare Serenitatis Basin:**
   - *Dimensions:* $920\text{ km}$ diameter.
   - *Hemisphere:* Near side ($28.0^\circ\text{ N}, 17.5^\circ\text{ E}$).
   - *Significance:* High-titanium basalts, pronounced positive gravity anomaly ("mascon"). Sites: Apollo 17, Beresheet.
4. **Mare Tranquillitatis Basin:**
   - *Dimensions:* $873\text{ km}$ diameter.
   - *Hemisphere:* Near side ($8.5^\circ\text{ N}, 31.4^\circ\text{ E}$).
   - *Significance:* Extremely ancient, irregular basin filled with deep titanium-rich lavas. Sites: Apollo 11, Surveyor 5.
5. **Mare Crisium Basin:**
   - *Dimensions:* $555\text{ km} \times 490\text{ km}$ oval basin.
   - *Hemisphere:* Near side East ($17.0^\circ\text{ N}, 59.1^\circ\text{ E}$).
   - *Significance:* Isolated circular mare surrounded by ring mountains. Sites: Luna 15, Luna 24.
6. **Mare Orientale Basin:**
   - *Dimensions:* $930\text{ km}$ diameter (3 concentric mountain rings: Cordillera, Rook, Inner Rook).
   - *Hemisphere:* Western limb ($19.4^\circ\text{ S}, 92.8^\circ\text{ W}$).
   - *Significance:* Youngest, most pristine multiring impact basin on the Moon; virtually unflooded by basalt, revealing raw impact ring tectonics.

---

## 4. Performance & Asset Budget Plan

Integrating full-resolution planetary datasets without a rigorous optimization pipeline will cause browser memory crashes and unacceptably long download times. AFTERLIGHT enforces a strict **Progressive Tile Pyramid Budget**:

### 4.1 Asset Delivery Constraints
- **Global Albedo Texture:** Single $4096 \times 2048$ WebP map ($<3.5\text{ MB}$) for global orbital view; dynamic quadtree chunk streaming for closer zoom levels.
- **Global Elevation Normal Map:** $4096 \times 2048$ normal map derived from LOLA LDEM ($<4.0\text{ MB}$), providing photorealistic hillshading under dynamic sun incidence angles without requiring millions of geometry polygons.
- **Vector Feature Polygons:** GeoJSON vector files compressed using TopoJSON (crater outlines, mare shorelines, and Apollo traverse paths; $<250\text{ KB}$ per operational region).
- **Flagship Site DTM Mesh:** Heightfield displacement mapped to Three.js `PlaneGeometry` chunks (maximum 128x128 vertices per chunk, with Level-Of-Detail distance switching).

### 4.2 Coordinate System & Transverse Mercator Projections
- **Global Scene Space:** Spherical coordinates $(\phi, \lambda)$ converted to Three.js Cartesian space $(X, Y, Z)$ on a normalized unit sphere:
  $$X = R \cos\phi \cos\lambda, \quad Y = R \sin\phi, \quad Z = -R \cos\phi \sin\lambda$$
- **Local Landing Site Space:** Transverse Mercator or Local Tangent Plane (LTP) projection centered on the mission benchmark (e.g. Apollo 12 LM *Intrepid* at $(0, 0, 0)$), with $+X$ pointing East, $+Y$ pointing Up (local surface normal), and $+Z$ pointing South.
