# AFTERLIGHT — Global Lunar Artifact & Engineering Registry

**Project:** AFTERLIGHT — The Living Archival Monument  
**Document ID:** DOC-LAR-007  
**Scope:** Exhaustive Engineering Catalog of Anthropogenic Hardware Resting on the Lunar Surface  
**Data Standards:** Grumman Aerospace, Hughes Aircraft, Boeing/Delco, Lavochkin Association, Bendix Systems Division, CNSA, ISRO  

---

## 1. Registry Architecture & Physical Distribution

Over 200 metric tons of human-manufactured machinery rests permanently on the Moon. These artifacts represent the pinnacle of mid-20th century to modern aerospace engineering, structural mechanics, vacuum lubrication, cryogenic propellants, and nuclear power systems.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CATEGORIES OF LUNAR ARTIFACTS                         │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ 1. SPACECRAFT STRUCTURES│ 2. SURFACE MOBILITY     │ 3. SCIENTIFIC PAYLOADS  │
│ Descent stages, vernier │ Manned LRVs, robotic    │ ALSEP stations, RTGs,   │
│ engines, landing legs   │ rovers, hopping probes  │ LRRR retroreflectors    │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ 4. CREW EXPLORATION GEAR│ 5. OPTICAL & COMM GEAR  │ 6. SYMBOLIC MONUMENTS   │
│ PLSS life support, boots│ Hasselblad cameras, S-  │ Plaques, flags, Fallen  │
│ tools, drill cores      │ band antennas, vidicons │ Astronaut, golf balls   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 2. Spacecraft Structures & Heavy Stages

### 2.1 Apollo Lunar Module Descent Stages (LM-5 through LM-12)
- **Primary Manufacturer:** Grumman Aerospace Corporation (Bethpage, Long Island, New York).
- **Physical Envelope:**
  - Height: $3.23\text{ m}$ (from engine bell skirt to upper deck).
  - Across Flats: $4.22\text{ m}$ (octagonal chassis).
  - Diagonal Landing Gear Span: $9.45\text{ m}$ (footpad to footpad).
  - Dry Structural Mass: $2,034\text{ to }2,211\text{ kg}$.
- **Structural Materials & Architecture:**
  - Octagonal welded centerbox constructed of 2024-T81 aluminum alloy sheet and machined stringers.
  - Thermal Insulation: Multilayer Kapton (aluminized polyimide) and amber/gold-colored aluminized Mylar blankets (up to 25 layers) shielded from micrometeorites by thin 0.004-inch outer Inconel/aluminum foils.
  - Landing Gear: Four deployable inverted tripod legs featuring primary tubular cylinders packed with crushable aluminum honeycomb cartridges capable of absorbing up to $3.05\text{ m/s}$ ($10\text{ ft/s}$) vertical touchdown velocities without rebound.
  - Footpads: Four $0.94\text{ m}$ ($37\text{ in}$) diameter shallow spherical dish footpads pressed from 7075-T6 aluminum sheet.
- **Descent Propulsion System (DPS):**
  - Engine: TRW throttled bipropellant rocket engine ($4,390\text{ to }43,900\text{ N}$ variable thrust) utilizing hypergolic Aerozine-50 fuel and Nitrogen Tetroxide ($\text{N}_2\text{O}_4$) oxidizer.
  - Columbium (niobium) alloy radiation-cooled nozzle extension bell ($1.52\text{ m}$ exit diameter).
- **Existing Asset Alignment:** Supported directly by `assets/3d_models/lunar_module/apollo_lunar_module.glb` and `intrepid_descent_stage_specs.json`.
- **Sites Remaining (6 Total):**
  1. LM-5 *Eagle* (Apollo 11, Statio Tranquillitatis)
  2. LM-6 *Intrepid* (Apollo 12, Statio Cognitum)
  3. LM-8 *Antares* (Apollo 14, Fra Mauro)
  4. LM-10 *Falcon* (Apollo 15, Hadley-Apennine)
  5. LM-11 *Orion* (Apollo 16, Descartes Highlands)
  6. LM-12 *Challenger* (Apollo 17, Taurus-Littrow)

---

### 2.2 Surveyor Robotic Spacecraft (Surveyor 1, 3, 5, 6, 7)
- **Primary Manufacturer:** Hughes Aircraft Company (El Segundo, California) for NASA JPL.
- **Physical Envelope:**
  - Height: $3.0\text{ m}$ (to top of solar panel mast).
  - Leg Span: $4.3\text{ m}$ (equilateral triangle).
  - Landed Dry Mass: $280\text{ to }294\text{ kg}$.
- **Materials & Mechanisms:**
  - Tubular thin-walled 7075-T6 aluminum alloy open truss space frame.
  - Three hinged landing legs equipped with crushable aluminum honeycomb footpads ($0.29\text{ m}$ diameter) and hydraulic shock absorbers.
  - Solid Thiokol retrorocket jettison ring.
  - Three throttled vernier liquid rocket engines (monomethylhydrazine hydrate / MON-10) for mid-course and terminal descent braking.
  - Planar array high-gain antenna ($0.80\text{ m} \times 0.50\text{ m}$) and 3,960-cell solar panel gimbaled on mast.
  - Soil Mechanics Surface Sampler: Motorized scissor-arm pantograph scoop with tungsten carbide cutting blades (Surveyor 3 and 7).
- **Existing Asset Alignment:** Supported directly by `assets/3d_models/surveyor_3/surveyor_3_lander.obj` and `surveyor_3_specs.json`.

---

## 3. Surface Mobility & Robotic Rovers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LUNAR ROVER REGISTRY (9 VEHICLES)                    │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ APOLLO MANNED LRVs      │ SOVIET LUNOKHODS        │ MODERN ROBOTIC ROVERS   │
│ • Apollo 15 LRV-1 (28km)│ • Lunokhod 1 (10.5 km)  │ • Yutu 1 (Chang'e 3)    │
│ • Apollo 16 LRV-2 (27km)│ • Lunokhod 2 (39.0 km)  │ • Yutu-2 (Chang'e 4)    │
│ • Apollo 17 LRV-3 (36km)│                         │ • Pragyan (Ch-3)        │
│                         │                         │ • SORA-Q / LEV-1 (SLIM) │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 3.1 Apollo Lunar Roving Vehicle (LRV-1, LRV-2, LRV-3)
- **Manufacturer:** The Boeing Company (Aerospace Group, Kent, Washington) & Delco Electronics (General Motors).
- **Dimensions & Mass:**
  - Length: $3.10\text{ m}$ | Width: $2.06\text{ m}$ | Wheelbase: $2.29\text{ m}$.
  - Empty Mass: $210\text{ kg}$ ($462\text{ lb}$) | Payload Capacity: $490\text{ kg}$ ($1,080\text{ lb}$, two astronauts with suits, tools, and samples).
- **Propulsion & Wheel Architecture:**
  - Four independent 0.25-horsepower DC electric brush motors ($10,000\text{ RPM}$) housed inside each wheel hub, driving harmonic drive reduction gears (80:1 ratio).
  - Wheels: Open-mesh woven zinc-coated steel piano wire (0.033-inch diameter) with titanium chevron treads riveted to the outer contact surface for traction in powder regolith.
  - Dual Ackerman electric steering (front and rear independent steering servos, turning radius $3.1\text{ m}$).
- **Power System:** Two 36-volt non-rechargeable silver-zinc potassium hydroxide batteries (capacity $121\text{ Ah}$ each).
- **Navigation & Telemetry:** Inertial dead-reckoning navigation system (directional gyroscope and wheel odometers) accurate to within 100 meters across 30 km traverses.

### 3.2 Lunokhod 1 & Lunokhod 2 (USSR)
- **Manufacturer:** Lavochkin Design Bureau (Chassis: VNII Transmash, Leningrad).
- **Dimensions & Mass:**
  - Length: $2.22\text{ m}$ (tub hull) | Width: $1.60\text{ m}$ | Height: $1.35\text{ m}$.
  - Mass: Lunokhod 1 ($756\text{ kg}$), Lunokhod 2 ($840\text{ kg}$).
- **Mobility System:**
  - Eight independently suspended, electrically driven wire-mesh wheels ($51\text{ cm}$ diameter) with transverse titanium grousers.
  - Pressurized magnesium-aluminum alloy sealed bathtub chassis containing electronics.
  - Thermal control via radioisotope heater unit (RHU) containing Polonium-210 isotope ($^{210}\text{Po}$).
  - Solar array lid that opened during the day and closed at night to insulate instruments.

### 3.3 Yutu & Yutu-2 (China / CLEP)
- **Manufacturer:** China Aerospace Science and Technology Corporation (CASC).
- **Dimensions & Mass:** Length: $1.5\text{ m}$ | Width: $1.0\text{ m}$ | Height: $1.1\text{ m}$ | Mass: $140\text{ kg}$.
- **Chassis & Payloads:** 6-wheel rocker-bogie suspension with aluminum cleated mesh wheels. Two deployable solar wings; mast camera; Ground Penetrating Radar (GPR); Alpha Particle X-ray Spectrometer. Yutu-2 remains active on the far side after 5+ years.

### 3.4 Pragyan (India / ISRO)
- **Manufacturer:** ISRO Satellite Centre (URSC, Bengaluru).
- **Mass & Dimensions:** $26\text{ kg}$ | $0.91\text{ m} \times 0.75\text{ m} \times 0.39\text{ m}$.
- **Features:** 6-wheel rocker-bogie chassis powered by a 50W solar panel; carried LIBS (Laser-Induced Breakdown Spectroscopy) and APXS instruments; custom wheel treads embossing Indian state emblems.

### 3.5 LEV-1 & LEV-2 SORA-Q (Japan / JAXA)
- **Co-Developers:** JAXA, Sony, Takara Tomy, Doshisha University.
- **SORA-Q (LEV-2):**
  - Dimensions: Spherical shell $8.0\text{ cm}$ diameter | Mass: $250\text{ grams}$.
  - Mechanism: Symmetrical sphere manufactured of duralumin that pops open into two hemispherical wheels driven by micro-servos, crawling across regolith like a sea turtle; twin micro-cameras front and back.
- **LEV-1:** $2.1\text{ kg}$ hopping rover using direct piston spring-actuated jumps.

---

## 4. Scientific Surface Stations & Power Systems

### 4.1 ALSEP Central Station (CS)
- **Manufacturer:** The Bendix Corporation (Aerospace Systems Division, Ann Arbor, Michigan).
- **Scale:** $0.64\text{ m} \times 0.61\text{ m} \times 0.58\text{ m}$ aluminum enclosure. Mass: $25\text{ kg}$.
- **Subsystems:** S-band command receiver (2119 MHz), 1.0-watt PCM telemetry transmitter (2275.5 MHz), data multiplexer processor, power distribution unit (PDU), and 1.2-meter helical dish antenna pointed toward Earth.
- **Existing Asset Alignment:** `assets/3d_models/alsep_instruments/alsep_central_station.obj`.

### 4.2 SNAP-27 Radioisotope Thermoelectric Generator (RTG)
- **Manufacturer:** General Electric Company (Missile and Space Division) for the US Atomic Energy Commission (AEC).
- **Scale:** Cylindrical beryllium casing with 8 radial cooling fins; height $0.46\text{ m}$, diameter $0.40\text{ m}$. Mass: $17\text{ kg}$ (generator) + $6.0\text{ kg}$ (fuel capsule).
- **Nuclear Source:** $3.78\text{ kg}$ of Plutonium-238 dioxide ($\text{PuO}_2$) microspheres encapsulated in a superalloy Hastelloy-C/graphite cask.
- **Thermal-Electric Performance:**
  - Thermal Output: $1,480\text{ W}_{\text{th}}$.
  - Thermopile: 442 lead telluride (PbTe) thermocouples wired in series-parallel.
  - Electrical Output: $73.5\text{ W}_{\text{e}}$ continuous DC at 16 volts (operated without degradation for 8 years).
- **Existing Asset Alignment:** `assets/3d_models/alsep_instruments/snap27_rtg.obj`.

---

## 5. Optical Cameras & Surface Exploration Equipment

### 5.1 Apollo Hasselblad 500EL Electric Data Cameras
- **Manufacturer:** Victor Hasselblad AB (Göteborg, Sweden) with optics by Carl Zeiss (Oberkochen, Germany).
- **Modifications for Lunar Vacuum:**
  - Silver anti-radiation paint; internal lubricants replaced with solid fluorocarbon dry film to avoid vacuum outgassing and optical fogging.
  - Reseau Plate: High-precision optical glass plate installed immediately in front of the film plane, engraved with a 5x5 grid of 25 fiducial calibration crosses ($0.025\text{ mm}$ width) to allow photogrammetric distortion correction.
  - Lens: Zeiss Biogon $60\text{ mm } f/5.6$ wide-angle lens with polarizing filter.
  - Film: 70mm thin-base Kodak Estar film (160 to 200 exposures per magazine).
- **Status:** **Left on Lunar Surface.** To conserve return mass for rock samples, camera bodies and lenses were removed from film magazines and jettisoned down the LM ladder prior to ascent stage liftoff. (12 camera bodies remain across the six Apollo landing sites).

### 5.2 Portable Life Support System (PLSS) Backpacks
- **Manufacturer:** Hamilton Standard Division of United Aircraft Corporation (Windsor Locks, Connecticut).
- **Dimensions & Mass:** $0.66\text{ m} \times 0.48\text{ m} \times 0.24\text{ m}$ | Earth Mass: $38.5\text{ kg}$ ($85\text{ lb}$).
- **Life Support Functions:** Circulated pressurized pure oxygen ($25.5\text{ kPa} / 3.7\text{ psia}$); removed carbon dioxide via lithium hydroxide (LiOH) canisters; regulated astronaut body temperature via sublimator ice-boiler circulating water through the Liquid Cooling Garment (LCG); housed VHF telemetry transceivers.
- **Status:** Jettisoned out the LM forward hatch onto the regolith along with lunar overshoes (silicone-rubber Galoshes) and waste bags prior to lunar liftoff. (10 PLSS backpacks remain at Apollo sites).
