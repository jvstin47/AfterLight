# AFTERLIGHT — Global Lunar Location Database & Selenographic Registry

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-LLD-003  
**Datum:** Mean Earth / Polar Axis (ME) Coordinate System (IAU/IAG Working Group)  
**Reference Benchmark:** Statio Cognitum ($3.01239^\circ\text{ S}, 23.42157^\circ\text{ W}$, Lunar Radius $R = 1,737.4\text{ km}$)  

---

## 1. Selenodetic Coordinate Standards & Reference Frame

To ensure absolute scientific accuracy, all spatial locations in AFTERLIGHT are mapped using the **Mean Earth/Polar Axis (ME)** reference frame as established by the Lunar Reconnaissance Orbiter Camera (LROC) Science Operations Center and the USGS Astrogeology Science Center:
- **Latitude ($\phi$):** Positive North ($0^\circ\text{ to } +90^\circ$), Negative South ($0^\circ\text{ to } -90^\circ$).
- **Longitude ($\lambda$):** East positive ($0^\circ\text{ to } +180^\circ$), West negative ($0^\circ\text{ to } -180^\circ$).
- **Datum Radius ($R_{\text{Moon}}$):** $1,737.4\text{ km}$.
- **Spatial Uncertainty Radius ($r_u$):** Quantitative radius of uncertainty bounding the site. No precise coordinate is published without an associated $r_u$ value.

---

## 2. Definitive Location Catalog

### 2.1 Manned Apollo Landing Sites & Sub-Site Hardware Coordinates

```
APOLLO 11 — Statio Tranquillitatis (Mare Tranquillitatis)
├── Benchmark (LM-5 Eagle Descent Stage): 0.67408° N, 23.47297° E | ru: ±1 m | LROC M102360489LE
│   ├── Distance from Apollo 12: 1,424 km | Bearing: 088° E
├── EASEP PSEP Seismometer: 0.67385° N, 23.47320° E | ru: ±2 m (17m south-southeast of LM)
├── Apollo 11 LRRR Retroreflector: 0.67340° N, 23.47310° E | ru: ±1 m (Active station)
├── Apollo 11 US Flag Deployment: 0.67400° N, 23.47320° E | ru: ±2 m (8m south-southeast of LM)
└── Apollo 11 S-IVB Saturn V Booster Kinetic Impact: 1.26° N, 83.33° E | ru: ±10 km

APOLLO 12 — Statio Cognitum (Oceanus Procellarum) [AFTERLIGHT Primary Monument Anchor]
├── Benchmark (LM-6 Intrepid Descent Stage): 3.01239° S, 23.42157° W | ru: ±1 m | LROC M120005333
│   ├── Distance from Apollo 12: 0 km (Origin Datum)
├── Surveyor 3 Spacecraft: 3.01520° S, 23.41890° W | ru: ±1 m (163m southeast of Intrepid)
├── ALSEP Array A Central Station: 3.01160° S, 23.42300° W | ru: ±1 m (130m northwest of Intrepid)
├── SNAP-27 Nuclear RTG: 3.01170° S, 23.42310° W | ru: ±1 m
├── Passive Seismic Experiment: 3.01150° S, 23.42310° W | ru: ±1 m
├── Lunar Surface Magnetometer: 3.01180° S, 23.42280° W | ru: ±1 m
├── Solar Wind Spectrometer: 3.01140° S, 23.42290° W | ru: ±1 m
├── Apollo 12 US Flag Deployment: 3.01245° S, 23.42157° W | ru: ±1 m (7m south of Intrepid)
├── Solar Wind Composition Foil: 3.01210° S, 23.42180° W | ru: ±2 m
└── Apollo 12 S-IVB Booster Impact: 3.94° S, 21.20° W | ru: ±5 km (73 km ESE, rung Moon for 55 min)

APOLLO 14 — Fra Mauro Formation
├── Benchmark (LM-8 Antares Descent Stage): 3.64530° S, 17.47136° W | ru: ±2 m | LROC M114165453LE
│   ├── Distance from Apollo 12: 181 km | Bearing: 096° E
├── ALSEP Array C Central Station: 3.64490° S, 17.47350° W | ru: ±2 m (178m west-northwest of LM)
├── Apollo 14 LRRR Retroreflector: 3.64400° S, 17.47200° W | ru: ±2 m (Active station)
├── Alan Shepard Golf Ball Strikes: 3.64540° S, 17.47120° W | ru: ±5 m (Immediate vicinity of LM)
├── Cone Crater Rim Peak Traverse: 3.64300° S, 17.45800° W | ru: ±10 m (Station C1, 1.4 km east)
└── Apollo 14 S-IVB Booster Impact: 8.09° S, 26.02° W | ru: ±5 km

APOLLO 15 — Hadley-Apennine
├── Benchmark (LM-10 Falcon Descent Stage): 26.13222° N, 3.63386° E | ru: ±2 m | LROC M111578606LE
│   ├── Distance from Apollo 12: 1,221 km | Bearing: 047° NE
├── Lunar Roving Vehicle 1 Final Parking Spot: 26.13400° N, 3.63500° E | ru: ±2 m (160m east of LM)
├── "Fallen Astronaut" Memorial & Plaque: 26.13410° N, 3.63510° E | ru: ±3 m (Immediately adjacent to LRV)
├── ALSEP Array A-2: 26.13400° N, 3.63200° E | ru: ±2 m (110m west-northwest of LM)
├── Apollo 15 LRRR Retroreflector (300-corner-cube array): 26.13340° N, 3.63300° E | ru: ±1 m (Largest LRRR)
├── Hadley Rille Gorge Overlook (Station 9): 26.12500° N, 3.61800° E | ru: ±5 m
└── Apollo 15 S-IVB Booster Impact: 1.51° S, 11.81° W | ru: ±5 km

APOLLO 16 — Descartes Highlands
├── Benchmark (LM-11 Orion Descent Stage): 8.97301° S, 15.49812° E | ru: ±2 m | LROC M109134835LE
│   ├── Distance from Apollo 12: 1,192 km | Bearing: 099° E
├── Lunar Roving Vehicle 2 Final Parking Spot: 8.97400° S, 15.49900° E | ru: ±2 m (95m east of LM)
├── Far UV Camera / Spectrograph (First Lunar Observatory): 8.97320° S, 15.49790° E | ru: ±2 m (In shadow of LM)
├── Charles Duke Family Photograph: 8.97350° S, 15.49850° E | ru: ±4 m
├── ALSEP Array: 8.97200° S, 15.49600° E | ru: ±2 m (95m west-southwest of LM)
└── Apollo 16 S-IVB Booster Impact: 1.30° N, 23.90° W | ru: ±5 km

APOLLO 17 — Taurus-Littrow Valley
├── Benchmark (LM-12 Challenger Descent Stage): 20.19080° N, 30.77168° E | ru: ±2 m | LROC M109081977RE
│   ├── Distance from Apollo 12: 1,770 km | Bearing: 060° ENE
├── Lunar Roving Vehicle 3 Final Parking Spot: 20.19200° N, 30.77300° E | ru: ±2 m (VIP camera site)
├── Shorty Crater Orange Soil Discovery (Station 4): 20.18000° N, 30.70700° E | ru: ±5 m (4 km west of LM)
├── ALSEP Array: 20.18900° N, 30.76900° E | ru: ±2 m (185m west-northwest of LM)
├── Gene Cernan Last Footprint Location: 20.19070° N, 30.77160° E | ru: ±2 m (At base of LM ladder)
└── Apollo 17 S-IVB Booster Impact: 4.21° S, 12.31° W | ru: ±5 km
```

---

### 2.2 Soviet Luna Program (Soft Landers, Rovers & Impact Points)

| Mission Name | Latitude ($\phi$) | Longitude ($\lambda$) | Region / Geological Feature | Outcome Class | Spatial Uncertainty ($r_u$) | Dist. from A12 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Luna 2** | $29.1000^\circ\text{ N}$ | $0.0000^\circ\text{ E}$ | Palus Putredinis | `HARD_IMPACT_INTENTIONAL` | $\pm 30\text{ km}$ | $1,192\text{ km}$ |
| **Luna 9** | $7.0800^\circ\text{ N}$ | $64.3700^\circ\text{ W}$ | Oceanus Procellarum | `SOFT_LANDING_SUCCESS` | $\pm 5\text{ km}$ | $1,283\text{ km}$ |
| **Luna 13** | $18.8700^\circ\text{ N}$ | $62.0500^\circ\text{ W}$ | Oceanus Procellarum | `SOFT_LANDING_SUCCESS` | $\pm 3\text{ km}$ | $1,348\text{ km}$ |
| **Luna 16** | $0.6800^\circ\text{ S}$ | $56.3000^\circ\text{ E}$ | Mare Fecunditatis | `SOFT_LANDING_SUCCESS` | $\pm 100\text{ m}$ | $2,423\text{ km}$ |
| **Luna 17 / Lunokhod 1** | $38.2830^\circ\text{ N}$ | $35.0020^\circ\text{ W}$ | Mare Imbrium | `SOFT_LANDING_SUCCESS` | $\pm 2\text{ m}$ | $1,291\text{ km}$ |
| **Luna 20** | $3.5700^\circ\text{ N}$ | $56.5000^\circ\text{ E}$ | Apollonius Highlands | `SOFT_LANDING_SUCCESS` | $\pm 100\text{ m}$ | $2,434\text{ km}$ |
| **Luna 21 / Lunokhod 2** | $25.8500^\circ\text{ N}$ | $30.4500^\circ\text{ E}$ | Le Monnier Crater | `SOFT_LANDING_SUCCESS` | $\pm 2\text{ m}$ | $1,876\text{ km}$ |
| **Luna 24** | $12.7500^\circ\text{ N}$ | $62.2000^\circ\text{ E}$ | Mare Crisium | `SOFT_LANDING_SUCCESS` | $\pm 50\text{ m}$ | $2,624\text{ km}$ |
| **Luna 25** | $57.8650^\circ\text{ S}$ | $61.3440^\circ\text{ E}$ | Pontecoulant G Crater | `HARD_IMPACT_UNINTENTIONAL`| $\pm 5\text{ m}$ (LROC) | $2,780\text{ km}$ |

---

### 2.3 American Robotic Precursor Sites (Surveyor Program)

| Mission Name | Latitude ($\phi$) | Longitude ($\lambda$) | Region | Outcome Class | Spatial Uncertainty ($r_u$) | Dist. from A12 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Surveyor 1** | $2.4740^\circ\text{ S}$ | $43.3390^\circ\text{ W}$ | Flamsteed Crater | `SOFT_LANDING_SUCCESS` | $\pm 10\text{ m}$ | $604\text{ km}$ |
| **Surveyor 3** | $3.0152^\circ\text{ S}$ | $23.4189^\circ\text{ W}$ | Surveyor Crater (A12) | `SOFT_LANDING_SUCCESS` | $\pm 1\text{ m}$ | $0.163\text{ km}$ |
| **Surveyor 5** | $1.4610^\circ\text{ N}$ | $23.1950^\circ\text{ E}$ | Mare Tranquillitatis | `SOFT_LANDING_SUCCESS` | $\pm 10\text{ m}$ | $1,417\text{ km}$ |
| **Surveyor 6** | $0.4730^\circ\text{ N}$ | $1.4270^\circ\text{ W}$ | Sinus Medii | `SOFT_LANDING_SUCCESS` | $\pm 10\text{ m}$ | $674\text{ km}$ |
| **Surveyor 7** | $40.9760^\circ\text{ S}$ | $11.4380^\circ\text{ W}$ | Tycho Crater Rim | `SOFT_LANDING_SUCCESS` | $\pm 10\text{ m}$ | $1,202\text{ km}$ |

---

### 2.4 Chinese Lunar Exploration Program Sites (CLEP)

| Mission Name | Latitude ($\phi$) | Longitude ($\lambda$) | Hemisphere / Geological Feature | Outcome Class | Spatial Uncertainty ($r_u$) | Dist. from A12 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Chang'e 3 & Yutu** | $44.1214^\circ\text{ N}$ | $19.5125^\circ\text{ W}$ | Near Side / Mare Imbrium | `SOFT_LANDING_SUCCESS` | $\pm 2\text{ m}$ | $1,432\text{ km}$ |
| **Chang'e 4 & Yutu-2**| $45.4570^\circ\text{ S}$ | $177.5880^\circ\text{ E}$| Far Side / Von Kármán Crater | `SOFT_LANDING_SUCCESS` | $\pm 2\text{ m}$ | $3,582\text{ km}$ |
| **Chang'e 5** | $43.0576^\circ\text{ N}$ | $51.9161^\circ\text{ W}$ | Near Side / Mons Rümker | `SOFT_LANDING_SUCCESS` | $\pm 2\text{ m}$ | $1,617\text{ km}$ |
| **Chang'e 6** | $41.6385^\circ\text{ S}$ | $153.9852^\circ\text{ W}$| Far Side / Apollo Basin | `SOFT_LANDING_SUCCESS` | $\pm 5\text{ m}$ | $3,140\text{ km}$ |

---

### 2.5 Indian Lunar Exploration Program Sites (ISRO)

| Mission Name | Latitude ($\phi$) | Longitude ($\lambda$) | Feature Name | Outcome Class | Spatial Uncertainty ($r_u$) | Dist. from A12 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Chandrayaan-1 MIP**| $89.7600^\circ\text{ S}$ | $39.4000^\circ\text{ W}$ | Shackleton Point (South Pole) | `HARD_IMPACT_INTENTIONAL` | $\pm 1\text{ km}$ | $2,633\text{ km}$ |
| **Chandrayaan-2 Vikram**| $70.8810^\circ\text{ S}$ | $22.7840^\circ\text{ E}$ | Southern High Latitudes | `HARD_IMPACT_UNINTENTIONAL`| $\pm 5\text{ m}$ | $2,427\text{ km}$ |
| **Chandrayaan-3 Vikram & Pragyan**| $69.3730^\circ\text{ S}$ | $32.3190^\circ\text{ E}$ | Shiv Shakti Point | `SOFT_LANDING_SUCCESS` | $\pm 3\text{ m}$ | $2,580\text{ km}$ |

---

### 2.6 Japanese, Commercial & Emerging Lunar Landing Sites

| Mission Name | Latitude ($\phi$) | Longitude ($\lambda$) | Geological Feature | Outcome Class | Spatial Uncertainty ($r_u$) | Dist. from A12 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SLIM (JAXA) & LEV-1/2**| $13.3160^\circ\text{ S}$ | $25.2510^\circ\text{ E}$ | Shioli Crater (Near Side) | `SOFT_LANDING_SUCCESS` | $\pm 3\text{ m}$ | $1,507\text{ km}$ |
| **Beresheet (SpaceIL)** | $32.5956^\circ\text{ N}$ | $19.3496^\circ\text{ E}$ | Mare Serenitatis | `HARD_IMPACT_UNINTENTIONAL`| $\pm 5\text{ m}$ | $1,595\text{ km}$ |
| **HAKUTO-R M1 (ispace)** | $47.5810^\circ\text{ N}$ | $44.0940^\circ\text{ E}$ | Atlas Crater Rim | `HARD_IMPACT_UNINTENTIONAL`| $\pm 5\text{ m}$ | $2,382\text{ km}$ |
| **IM-1 Odysseus (CLPS)** | $80.1300^\circ\text{ S}$ | $1.4400^\circ\text{ E}$ | Malapert A Crater Rim | `SOFT_LANDING_SUCCESS` | $\pm 5\text{ m}$ | $2,390\text{ km}$ |
