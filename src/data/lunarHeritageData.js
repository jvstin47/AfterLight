/**
 * AFTERLIGHT — Global Lunar Heritage & Planetary Human Artifacts Registry
 * The definitive catalog of humanity's rovers, manned landing bases,
 * vanguard robotic soft-landers, and historic impact monuments across the Moon.
 */

// Apollo 12 Reference Coordinates (Statio Cognitum)
const A12_LAT = -3.01239;
const A12_LON = -23.42157;
const MOON_RADIUS_KM = 1737.4;

/**
 * Calculates great-circle lunar surface distance from Apollo 12 in kilometers
 */
function calcDistance(lat, lon) {
  const phi1 = (A12_LAT * Math.PI) / 180;
  const phi2 = (lat * Math.PI) / 180;
  const deltaLambda = ((lon - A12_LON) * Math.PI) / 180;

  const sinHalfPhi = Math.sin((phi2 - phi1) / 2);
  const sinHalfLam = Math.sin(deltaLambda / 2);
  const a = sinHalfPhi * sinHalfPhi + Math.cos(phi1) * Math.cos(phi2) * sinHalfLam * sinHalfLam;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(MOON_RADIUS_KM * c);
}

/**
 * Calculates compass bearing from Apollo 12 to target site in degrees
 */
function calcBearing(lat, lon) {
  const phi1 = (A12_LAT * Math.PI) / 180;
  const phi2 = (lat * Math.PI) / 180;
  const deltaLambda = ((lon - A12_LON) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

export const LUNAR_HERITAGE_SITES = [
  // ==========================================
  // 1. MANNED EXPEDITIONS (APOLLO PROGRAM)
  // ==========================================
  {
    id: 'apollo-11',
    code: 'APOLLO 11',
    name: 'Apollo 11 — Tranquility Base',
    designation: 'Statio Tranquillitatis (LM-5 "Eagle")',
    category: 'Manned Landing Base',
    group: 'manned',
    agency: 'NASA (United States)',
    astronauts: 'Neil Armstrong & Buzz Aldrin',
    landingDate: 'July 20, 1969, 20:17:40 UTC',
    coordinates: '0.67408° N, 23.47297° E',
    region: 'Mare Tranquillitatis (Sea of Tranquility)',
    lat: 0.67408,
    lon: 23.47297,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,420 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~85° E
    status: 'Permanent Extraterrestrial Monument & World Heritage Site',
    isActiveSite: false,
    keyArtifacts: [
      'LM-5 Eagle Descent Stage & Landing Gear',
      'Lunar Laser Ranging Retroreflector (LRRR - Still active & pinged today)',
      'Early Apollo Scientific Experiments Package (EASEP)',
      'Apollo 11 United States Surface Flag & Staff',
      'Commemorative Plaque ("Here men from the planet Earth first set foot...")',
      'Silicon disc etched with goodwill messages from 73 world leaders',
      'Gold olive branch pin (symbol of universal peace)'
    ],
    technicalSpecs: [
      { label: 'Surface Stay', value: '21 hr 36 min' },
      { label: 'EVA Traverse', value: '1.0 km total walking radius' },
      { label: 'Sample Return', value: '21.55 kg of basalt and breccia' },
      { label: 'Descent Stage Mass', value: '2,034 kg dry structure' }
    ],
    description: 'The monumental first human landing on another world. Neil Armstrong and Buzz Aldrin explored the immediate lunar regolith, deployed the first passive seismometer and the laser retroreflector array that continues to measure the Earth-Moon distance down to millimeter precision over 55 years later.'
  },

  {
    id: 'apollo-12',
    code: 'APOLLO 12',
    name: 'Apollo 12 — Statio Cognitum',
    designation: 'LM-6 "Intrepid" & Surveyor 3 Rendezvous',
    category: 'Manned Landing Base & Robotic Rendezvous',
    group: 'manned',
    agency: 'NASA (United States)',
    astronauts: 'Pete Conrad & Alan Bean',
    landingDate: 'November 19, 1969, 06:54:35 UTC',
    coordinates: '3.01239° S, 23.42157° W',
    region: 'Oceanus Procellarum (Ocean of Storms)',
    lat: -3.01239,
    lon: -23.42157,
    distanceKm: 0,
    bearingDeg: 0,
    status: 'ACTIVE 3D EXPLORATION VIEWPORT',
    isActiveSite: true,
    keyArtifacts: [
      'LM-6 Intrepid Descent Stage with bent contact wands & plaque',
      'Surveyor 3 Robotic Lander (visited & sampled after 31 months)',
      'ALSEP Array A (SNAP-27 RTG, Seismometer, Magnetometer, SWS)',
      'Solar Wind Composition (SWC) experiment mast',
      'Westinghouse Color Vidicon Surface TV Camera on tripod',
      'Apollo 12 US Surface Flag & discarded PLSS backpacks and overshoes'
    ],
    technicalSpecs: [
      { label: 'Surface Stay', value: '31 hr 31 min' },
      { label: 'EVA Traverse', value: '2.44 km across 2 EVAs' },
      { label: 'Sample Return', value: '34.35 kg (plus Surveyor 3 parts)' },
      { label: 'Surveyor Distance', value: '163 meters (precision landing)' }
    ],
    description: 'The centerpiece of AFTERLIGHT. Humanity\'s first precision touchdown, landing within walking distance of the robotic Surveyor 3 lander, proving that astronauts could execute targeted exploration missions across alien craters and recover long-exposed machinery for terrestrial laboratory analysis.'
  },

  {
    id: 'apollo-14',
    code: 'APOLLO 14',
    name: 'Apollo 14 — Fra Mauro Highlands',
    designation: 'LM-8 "Antares"',
    category: 'Manned Landing Base & Handcart Traverse',
    group: 'manned',
    agency: 'NASA (United States)',
    astronauts: 'Alan Shepard & Edgar Mitchell',
    landingDate: 'February 5, 1971, 09:18:11 UTC',
    coordinates: '3.64530° S, 17.47136° W',
    region: 'Fra Mauro Formation',
    lat: -3.64530,
    lon: -17.47136,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~180 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~96° ESE
    status: 'Permanent Extraterrestrial Monument',
    isActiveSite: false,
    keyArtifacts: [
      'LM-8 Antares Descent Stage',
      'Modular Equipment Transporter (MET - The "Lunar Rickshaw" handcart)',
      'Alan Shepard\'s two Wilson 6-iron golf balls ("miles and miles and miles")',
      'Apollo 14 Laser Ranging Retroreflector (LRRR - Active)',
      'Active Seismic Experiment (ASE) mortar package & thumper',
      'Suprathermal Ion Detector & Cold Cathode Gauge'
    ],
    technicalSpecs: [
      { label: 'Surface Stay', value: '33 hr 31 min' },
      { label: 'EVA Traverse', value: '3.45 km with the two-wheeled MET' },
      { label: 'Cone Crater Climb', value: 'Climbed within 30m of 300m-wide crater rim' },
      { label: 'Sample Return', value: '42.28 kg of Imbrium ejecta' }
    ],
    description: 'Alan Shepard and Edgar Mitchell explored the rugged Fra Mauro impact blanket, utilizing the two-wheeled Modular Equipment Transporter (MET) handcart to haul heavy sampling gear up the steep slopes of Cone Crater. Before departure, Shepard attached a 6-iron head to a contingency sample handle and struck two golf balls across the cratered plain.'
  },

  {
    id: 'apollo-15',
    code: 'APOLLO 15',
    name: 'Apollo 15 — Hadley-Apennine',
    designation: 'LM-10 "Falcon" & LRV-1',
    category: 'Manned Base & First Motorized Rover',
    group: 'rovers',
    agency: 'NASA (United States)',
    astronauts: 'David Scott & James Irwin',
    landingDate: 'July 30, 1971, 22:16:29 UTC',
    coordinates: '26.13222° N, 3.63386° E',
    region: 'Hadley Rille / Montes Apenninus',
    lat: 26.13222,
    lon: 3.63386,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,220 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~38° NE
    status: 'Permanent Extraterrestrial Monument & Rover Site',
    isActiveSite: false,
    keyArtifacts: [
      'Boeing / GM Lunar Roving Vehicle (LRV-1 - First car on the Moon)',
      'LM-10 Falcon Descent Stage',
      '"Fallen Astronaut" statuette & plaque (The only art installation on the Moon)',
      'Genesis Rock (4.1-billion-year-old anorthosite)',
      'Apollo 15 Laser Retroreflector (Largest array: 300 corner cubes)',
      'Galileo gravity experiment hammer & falcon feather'
    ],
    technicalSpecs: [
      { label: 'Rover Traverse', value: '27.9 km driven across 3 EVAs' },
      { label: 'Drive Motors', value: '4x 0.25 hp DC series electric motors' },
      { label: 'Max Speed', value: '12 km/h' },
      { label: 'Canyon Depth', value: '300 meters (Hadley Rille gorge)' },
      { label: 'Sample Return', value: '77.31 kg' }
    ],
    description: 'The monumental debut of the Boeing/GM Lunar Roving Vehicle (LRV-1). David Scott and James Irwin transformed lunar exploration from short localized foot walks into planetary expeditions, driving 28 kilometers along the sheer 300-meter chasm of Hadley Rille and ascending the Apennine Front to discover the primordial Genesis Rock. Before departing, Scott placed Paul Van Hoeydonck’s "Fallen Astronaut" aluminum sculpture and memorial plaque silently into the soil.'
  },

  {
    id: 'apollo-16',
    code: 'APOLLO 16',
    name: 'Apollo 16 — Descartes Highlands',
    designation: 'LM-11 "Orion" & LRV-2',
    category: 'Manned Base & Rover Expedition',
    group: 'rovers',
    agency: 'NASA (United States)',
    astronauts: 'John Young & Charles Duke',
    landingDate: 'April 21, 1972, 02:23:35 UTC',
    coordinates: '8.97301° S, 15.49812° E',
    region: 'Descartes Crater Highlands',
    lat: -8.97301,
    lon: 15.49812,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,190 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~98° ESE
    status: 'Permanent Extraterrestrial Monument & Observatory',
    isActiveSite: false,
    keyArtifacts: [
      'Lunar Roving Vehicle 2 (LRV-2 - "Grand Prix" speed test)',
      'LM-11 Orion Descent Stage',
      'Far Ultraviolet Camera / Spectrograph (First astronomical observatory on the Moon)',
      'Charles Duke\'s family photograph in plastic shrink-wrap',
      'Ultra-heavy deep drill core stem (2.6 meters depth)',
      'Heat Flow Experiment (cables accidentally severed during EVA)'
    ],
    technicalSpecs: [
      { label: 'Rover Traverse', value: '26.7 km driven across 3 EVAs' },
      { label: 'Rover Top Speed', value: '18 km/h ("Grand Prix" test)' },
      { label: 'Elevation Climb', value: 'Stone Mountain (highland ridge)' },
      { label: 'Sample Return', value: '95.71 kg (including Big Muley rock)' }
    ],
    description: 'Humanity\'s first exploration of the central lunar highlands. John Young and Charlie Duke drove LRV-2 across the Cayley plains and up the steep boulder fields of Stone Mountain. Dr. George Carruthers\' Far Ultraviolet Camera was deployed in the shadow of Orion, operating as the first astronomical telescope on another celestial body to photograph the Earth\'s geocorona and distant interstellar nebulae.'
  },

  {
    id: 'apollo-17',
    code: 'APOLLO 17',
    name: 'Apollo 17 — Taurus-Littrow Valley',
    designation: 'LM-12 "Challenger" & LRV-3',
    category: 'Manned Base & Longest Human Traverse',
    group: 'rovers',
    agency: 'NASA (United States)',
    astronauts: 'Gene Cernan & Harrison Schmitt',
    landingDate: 'December 11, 1972, 19:54:57 UTC',
    coordinates: '20.19080° N, 30.77168° E',
    region: 'Taurus-Littrow Valley',
    lat: 20.19080,
    lon: 30.77168,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,780 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~56° NE
    status: 'Permanent Extraterrestrial Monument & Final Apollo Site',
    isActiveSite: false,
    keyArtifacts: [
      'LRV-3 "The Challenger Rover" with duct-tape laminated map fender repair',
      'LM-12 Challenger Descent Stage',
      'Orange pyroclastic glass deposit site at Shorty Crater',
      'Traverse Gravimeter Experiment (TGE)',
      'Apollo 17 Commemorative Plaque ("May the spirit of peace in which we came...")',
      'Final human footprints on the Moon (Gene Cernan, Dec 14, 1972)'
    ],
    technicalSpecs: [
      { label: 'Rover Traverse', value: '35.7 km (longest human drive in history)' },
      { label: 'Max Range from LM', value: '7.6 km' },
      { label: 'Surface Stay', value: '75 hours (3 full EVAs: 22h 4m)' },
      { label: 'Sample Return', value: '110.5 kg (record haul)' }
    ],
    description: 'The final and most scientifically expansive Apollo mission. Commander Gene Cernan and professional geologist Harrison "Jack" Schmitt spent over three days living in Taurus-Littrow, driving LRV-3 for 35.7 km, and discovering pristine orange volcanic glass beads erupted 3.6 billion years ago. When Schmitt accidentally sheared off the rover\'s rear fender, Cernan famously clamped four paper flight maps together with grey duct tape, saving the crew from blinding rooster-tails of abrasive regolith.'
  },

  // ==========================================
  // 2. ROBOTIC WHEELED ROVERS
  // ==========================================
  {
    id: 'luna-17',
    code: 'LUNA 17',
    name: 'Luna 17 — Lunokhod 1',
    designation: 'First Robotic Wheeled Planetary Rover',
    category: 'Robotic Autonomous Rover',
    group: 'rovers',
    agency: 'Lavochkin / Soviet Space Program (USSR)',
    landingDate: 'November 17, 1970, 03:47 UTC',
    coordinates: '38.2800° N, 35.0000° W',
    region: 'Mare Imbrium (Sea of Rains)',
    lat: 38.2800,
    lon: -35.0000,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,290 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~342° NNW
    status: 'Permanent Robotic Monument (Laser Reflector Active)',
    isActiveSite: false,
    keyArtifacts: [
      'Lunokhod 1 8-Wheeled Self-Propelled Rover (756 kg)',
      'Luna 17 Descent & Ramp Stage',
      'French-built Corner-Cube Laser Retroreflector (relocated by LRO in 2010)',
      'Polonium-210 radioisotope thermal heater unit',
      'RIFMA X-ray fluorescence spectrometer',
      '500 penetrometer regolith test indentations'
    ],
    technicalSpecs: [
      { label: 'Operational Life', value: '322 Earth days (planned: 90 days)' },
      { label: 'Total Distance', value: '10.54 km driven' },
      { label: 'TV Telemetry', value: '20,000+ photos, 206 panoramas' },
      { label: 'Chassis', value: '8 independently driven mesh wheels' }
    ],
    description: 'Humanity\'s first successful robotic wheeled rover on another world. Driven remotely by a 5-man crew in the Soviet Union using real-time television feeds, Lunokhod 1 navigated 10.5 kilometers of craters and ridges in Mare Imbrium. In 2010, the NASA Lunar Reconnaissance Orbiter located the lost rover, allowing Apache Point Observatory to ping its French laser reflector for the first time in nearly 40 years.'
  },

  {
    id: 'luna-21',
    code: 'LUNA 21',
    name: 'Luna 21 — Lunokhod 2',
    designation: 'Heavy Robotic Wheeled Exploration Rover',
    category: 'Robotic Autonomous Rover',
    group: 'rovers',
    agency: 'Lavochkin / Soviet Space Program (USSR)',
    landingDate: 'January 15, 1973, 23:35 UTC',
    coordinates: '25.8500° N, 30.4500° E',
    region: 'Le Monnier Crater, Mare Serenitatis',
    lat: 25.8500,
    lon: 30.4500,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,840 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~50° NE
    status: 'Permanent Robotic Monument (Longest Drive Record until 2014)',
    isActiveSite: false,
    keyArtifacts: [
      'Lunokhod 2 8-Wheeled Rover (840 kg)',
      'Luna 21 Landing Stage & Egress Ramps',
      'French Laser Retroreflector Array',
      'Astrophotometer (first measurements of lunar sky brightness)',
      'Magnetometer boom array'
    ],
    technicalSpecs: [
      { label: 'Total Distance', value: '39.0 km driven across 4 months' },
      { label: 'Off-World Record', value: 'Held planetary driving distance record for 41 years' },
      { label: 'Images Returned', value: '80,000+ TV frames, 86 panoramas' },
      { label: 'Termination', value: 'Regolith dust entered open solar lid in May 1973' }
    ],
    description: 'Lunokhod 2 explored the floor of Le Monnier crater and the Taurus mountains, driving an extraordinary 39 kilometers in just four months—a distance that stood as the all-time extraterrestrial driving record until NASA’s Mars Opportunity rover surpassed it in 2014. The mission ended when the rover accidentally scooped regolith dust onto its open solar lid, overheating its electronics.'
  },

  {
    id: 'change-3',
    code: 'CHANGE 3',
    name: 'Chang\'e 3 — Yutu ("Jade Rabbit")',
    designation: 'First Chinese Soft-Lander & Rover',
    category: 'Robotic Autonomous Rover',
    group: 'rovers',
    agency: 'CNSA (China National Space Administration)',
    landingDate: 'December 14, 2013, 13:11 UTC',
    coordinates: '44.1214° N, 19.5125° W',
    region: 'Mare Imbrium (Sea of Rains)',
    lat: 44.1214,
    lon: -19.5125,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,430 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~4° N
    status: 'Permanent Robotic Monument',
    isActiveSite: false,
    keyArtifacts: [
      'Yutu 6-Wheeled Rover (140 kg)',
      'Chang\'e 3 Landing Platform',
      'Lunar-based Optical Telescope (LUT - First near-UV telescope on Moon)',
      'Lunar Penetrating Radar (ground-penetrating radar to 400m depth)'
    ],
    technicalSpecs: [
      { label: 'First in 37 Years', value: 'First soft lunar landing since Luna 24 in 1976' },
      { label: 'Traverse', value: '114 meters (mechanical drive jammed; instruments operated for 31 months)' },
      { label: 'Radar Depth', value: 'Detected 9 distinct subsurface basalt layers down to 400m' }
    ],
    description: 'Marking humanity\'s return to the lunar surface after a 37-year hiatus, Chang\'e 3 deployed the 6-wheeled Yutu rover in northern Mare Imbrium. While mechanical drive issues halted mobility after two months, its ground-penetrating radar and instruments continued operating for 31 months, discovering entirely new compositional classes of young lunar basalts.'
  },

  {
    id: 'change-4',
    code: 'CHANGE 4',
    name: 'Chang\'e 4 — Yutu-2 ("Farside Vanguard")',
    designation: 'First Spacecraft on the Lunar Farside',
    category: 'Farside Robotic Rover',
    group: 'rovers',
    agency: 'CNSA (China National Space Administration)',
    landingDate: 'January 3, 2019, 02:26 UTC',
    coordinates: '45.457° S, 177.589° E',
    region: 'Von Kármán Crater (South Pole–Aitken Basin)',
    lat: -45.457,
    lon: 177.589,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~2,950 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~205° SSW
    status: 'ACTIVE ON THE LUNAR FARSIDE (Over 5 Years of Continuous Operation)',
    isActiveSite: false,
    keyArtifacts: [
      'Yutu-2 6-Wheeled Rover (Still roving across the farside)',
      'Chang\'e 4 Landed Station',
      'Queqiao Relay Satellite Link (L2 halo orbit communication)',
      'Lunar Micro Ecosystem (Germinated first seeds on the Moon)'
    ],
    technicalSpecs: [
      { label: 'Historic Milestone', value: 'First touchdown on the farside in human history' },
      { label: 'Active Traverse', value: 'Over 1,600 meters driven to date' },
      { label: 'Farside Radio Quiet', value: 'Radio astronomy shielded from Earth electromagnetic noise' }
    ],
    description: 'Humanity\'s historic first landing on the mysterious lunar farside. Communicating via the Queqiao relay satellite parked at the Earth-Moon L2 Lagrangian point, Yutu-2 touched down inside the ancient South Pole–Aitken Basin, probing primordial mantle material excavated by massive cosmic impacts billions of years ago.'
  },

  {
    id: 'chandrayaan-3',
    code: 'CH-3',
    name: 'Chandrayaan-3 — Pragyan Rover',
    designation: 'Shiv Shakti Point (High Southern Latitude)',
    category: 'Southern Polar Robotic Rover',
    group: 'rovers',
    agency: 'ISRO (Indian Space Research Organisation)',
    landingDate: 'August 23, 2023, 12:32 UTC',
    coordinates: '69.373° S, 32.319° E',
    region: 'Shiv Shakti Point (High Southern Latitude)',
    lat: -69.373,
    lon: 32.319,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~2,190 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~148° SSE
    status: 'Permanent Southern Polar Monument',
    isActiveSite: false,
    keyArtifacts: [
      'Pragyan 6-Wheeled Rover (26 kg)',
      'Vikram Lander & Deployment Ramp',
      'Laser-Induced Breakdown Spectroscope (LIBS)',
      'Alpha Particle X-Ray Spectrometer (APXS)',
      'ChaSTE Thermal Probe (measured 60°C temperature gradient across 10cm depth)'
    ],
    technicalSpecs: [
      { label: 'Polar First', value: 'First successful landing in high southern polar territory' },
      { label: 'Traverse', value: '101.3 meters across 12 Earth days' },
      { label: 'Discovery', value: 'Direct spectroscopic confirmation of elemental sulfur' }
    ],
    description: 'India\'s historic August 2023 landing near the rugged southern polar region of the Moon. Deploying down a folding ramp, the 6-wheeled Pragyan rover utilized laser spectroscopy to discover unambiguous elemental sulfur in the polar soil, while the Vikram lander\'s thermal probe detected an extraordinary 60°C temperature gradient within just 10 centimeters of the surface.'
  },

  {
    id: 'slim-jaxa',
    code: 'SLIM',
    name: 'SLIM — LEV-1 & LEV-2 (SORA-Q)',
    designation: 'Japan Pinpoint Lander & Spherical Rover',
    category: 'Robotic Pinpoint Lander & Micro-Rovers',
    group: 'rovers',
    agency: 'JAXA (Japan Aerospace Exploration Agency)',
    landingDate: 'January 19, 2024, 15:20 UTC',
    coordinates: '13.3160° S, 25.2510° E',
    region: 'Shioli Crater, Mare Nectaris',
    lat: -13.3160,
    lon: 25.2510,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,490 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~102° ESE
    status: 'Permanent Robotic Monument (Survived Multiple Lunar Nights)',
    isActiveSite: false,
    keyArtifacts: [
      'Smart Lander for Investigating Moon (SLIM)',
      'LEV-1 Hopping Robot',
      'LEV-2 SORA-Q (250-gram transformable spherical rover)',
      'Multi-band spectroscopic camera for olivine mantle rocks'
    ],
    technicalSpecs: [
      { label: 'Landing Accuracy', value: '55 meters from target (record pinpoint precision)' },
      { label: 'SORA-Q Mass', value: '250 grams (toy-inspired transforming sphere)' },
      { label: 'Iconic Picture', value: 'LEV-2 photographed inverted SLIM lander on slope' }
    ],
    description: 'Japan\'s landmark January 2024 mission achieved the most precise planetary landing in human history, touching down just 55 meters from its target on the crater slope. Just prior to touchdown, SLIM ejected two micro-robots: LEV-1 (a direct-to-Earth hopping transceiver) and LEV-2 "SORA-Q" (a 250-gram transformable spherical robot co-developed with Takara Tomy toy company), which rolled across the regolith and transmitted the legendary photograph of the inverted SLIM lander.'
  },

  // ==========================================
  // 3. VANGUARD ROBOTIC SOFT-LANDERS & SAMPLE RETURNS
  // ==========================================
  {
    id: 'luna-9',
    code: 'LUNA 9',
    name: 'Luna 9 — First Soft Landing in History',
    designation: 'First Survivable Touchdown on Another World',
    category: 'Robotic Soft-Lander',
    group: 'vanguard',
    agency: 'OKB-1 / Soviet Space Program (USSR)',
    landingDate: 'February 3, 1966, 18:45:30 UTC',
    coordinates: '7.0800° N, 64.3700° W',
    region: 'Oceanus Procellarum',
    lat: 7.0800,
    lon: -64.3700,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,290 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~284° WNW
    status: 'Historic Monument (First Object to Land Intact)',
    isActiveSite: false,
    keyArtifacts: [
      'Luna 9 Petal-Shelled Capsule (99 kg)',
      'Airbag cushion deployment shell',
      'Facsimile television scanner & rotating mirror',
      'Radiation detector'
    ],
    technicalSpecs: [
      { label: 'First in History', value: 'First spacecraft to soft-land on any celestial body' },
      { label: 'Scientific Proof', value: 'Proved the Moon is not covered in meters of loose dust' },
      { label: 'Panoramas', value: 'Transmitted first close-up photos of lunar soil rocks' }
    ],
    description: 'The historic Soviet probe that proved humanity could land on the Moon. Before Luna 9, scientists feared that any spacecraft would sink hopelessly into deep meters of powdery lunar dust. Protected by an inflated airbag that bounced across the plain before four spring-loaded petals opened, Luna 9 transmitted the first circular panoramic television images of the jagged rocks and firm soil of Oceanus Procellarum.'
  },

  {
    id: 'surveyor-1',
    code: 'SURVEYOR 1',
    name: 'Surveyor 1 — First US Soft Landing',
    designation: 'Surveyor Model A (SC-1)',
    category: 'Robotic Soft-Lander',
    group: 'vanguard',
    agency: 'Hughes Aircraft / NASA JPL',
    landingDate: 'June 2, 1966, 06:17:36 UTC',
    coordinates: '2.4740° S, 43.3390° W',
    region: 'Flamsteed Crater, Oceanus Procellarum',
    lat: -2.4740,
    lon: -43.3390,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~600 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~268° W
    status: 'Permanent Robotic Monument',
    isActiveSite: false,
    keyArtifacts: [
      'Surveyor 1 Triangular Aluminum Spaceframe',
      'Vidicon television camera & optical filters',
      'Planar radar altimeter antenna',
      'Solar panel mast'
    ],
    technicalSpecs: [
      { label: 'Landing Accuracy', value: 'Landed within 14 km of target on first US attempt' },
      { label: 'Photos Returned', value: '11,238 high-resolution television pictures' },
      { label: 'Soil Bearing Test', value: 'Confirmed soil supports 3.5 to 5.5 N/cm²' }
    ],
    description: 'America\'s first soft landing on the Moon, touching down flawlessly just four months after Luna 9. Over six weeks of operation, Surveyor 1 returned 11,238 television frames, providing NASA with the empirical soil bearing data required to commit astronauts to the Apollo Lunar Module landing design.'
  },

  {
    id: 'luna-16',
    code: 'LUNA 16',
    name: 'Luna 16 — First Automated Sample Return',
    designation: 'Robotic Drilling & Ascent Vehicle',
    category: 'Robotic Sample Return',
    group: 'vanguard',
    agency: 'Lavochkin / Soviet Space Program (USSR)',
    landingDate: 'September 20, 1970, 05:18 UTC',
    coordinates: '0.6800° S, 56.3600° E',
    region: 'Mare Fecunditatis (Sea of Fertility)',
    lat: -0.6800,
    lon: 56.3600,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~2,420 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~88° E
    status: 'Permanent Robotic Monument (Descent Stage In Situ)',
    isActiveSite: false,
    keyArtifacts: [
      'Luna 16 Descent Base Stage & Landing Legs',
      'Rotary core drill assembly (drilled to 35 cm depth)',
      'Photometric calibration targets',
      'Thermal sensors'
    ],
    technicalSpecs: [
      { label: 'Automated Sample', value: 'Returned 101 grams of regolith to Kazakhstan' },
      { label: 'Zero Human Crew', value: 'First fully robotic sample return from any planet/moon' },
      { label: 'Launch from Moon', value: 'Ascent stage launched directly back to Earth' }
    ],
    description: 'The Soviet Union\'s technological triumph: the world\'s first fully automated robotic extraterrestrial sample return mission. Touching down in darkness in Mare Fecunditatis, a robotic rotary drill bored 35 centimeters into the lunar soil, transferred the core into a spherical return capsule, and fired an ascent rocket directly back to Earth, parachuting safely into Kazakhstan.'
  },

  {
    id: 'change-6',
    code: 'CHANGE 6',
    name: 'Chang\'e 6 — First Farside Sample Return',
    designation: 'Historic Farside Mantle Core Return',
    category: 'Farside Robotic Sample Return',
    group: 'vanguard',
    agency: 'CNSA (China National Space Administration)',
    landingDate: 'June 1, 2024, 22:23 UTC',
    coordinates: '41.6385° S, 153.9852° W',
    region: 'Apollo Basin (South Pole–Aitken Farside)',
    lat: -41.6385,
    lon: -153.9852,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~2,840 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~230° SW
    status: 'Permanent Robotic Monument & Farside Base',
    isActiveSite: false,
    keyArtifacts: [
      'Chang\'e 6 Descent Stage & Drilling Rig',
      'Basalt drill core & robotic scooper mechanism',
      'Basalt fiber Chinese flag (high-durability inorganic fabric)',
      'Autonomous mini-rover that photographed the lander'
    ],
    technicalSpecs: [
      { label: 'World First', value: 'First samples returned from the farside of the Moon' },
      { label: 'Sample Return', value: '1,935.3 grams of farside mantle ejecta' },
      { label: 'Liftoff from Farside', value: 'Ascent stage rendezvoused in lunar orbit' }
    ],
    description: 'A historic milestone in human space exploration. On June 1, 2024, Chang\'e 6 soft-landed inside the giant Apollo impact basin on the lunar farside. Using a drill and robotic arm, it collected 1.93 kilograms of previously unreached farside soil and rock, unfurled an inorganic basalt-fiber flag, and successfully launched into lunar orbit, landing safely on Earth on June 25, 2024.'
  },

  // ==========================================
  // 4. HISTORIC IMPACTS & ARTIFICIAL MOONQUAKE CHARGES
  // ==========================================
  {
    id: 'luna-2',
    code: 'LUNA 2',
    name: 'Luna 2 — First Human Object on the Moon',
    designation: 'Sphere of Titanium & Stainless Steel Pennants',
    category: 'Historic Pioneer Impact',
    group: 'impacts',
    agency: 'OKB-1 / Soviet Space Program (USSR)',
    landingDate: 'September 13, 1959, 21:02:24 UTC',
    coordinates: '29.1000° N, 0.0000° E',
    region: 'Palus Putredinis (Marsh of Decay)',
    lat: 29.1000,
    lon: 0.0000,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~1,200 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~31° NNE
    status: 'Historic Monument (First Human Impact on Another World)',
    isActiveSite: false,
    keyArtifacts: [
      'Stainless steel spherical pennants with the USSR state coat of arms',
      'Scintillation counters & Geiger tubes',
      'Vaporized impact crater in Palus Putredinis'
    ],
    technicalSpecs: [
      { label: 'First in History', value: 'First human artifact to touch another celestial body' },
      { label: 'Impact Speed', value: '3.3 km/second (hypervelocity impact)' },
      { label: 'Discovery', value: 'Proved the Moon has no significant dipole magnetic field' }
    ],
    description: 'On September 13, 1959, Luna 2 became the very first human-made object to reach another celestial body. Traveling at 3.3 kilometers per second, the spherical probe released sodium vapor clouds to track its trajectory before impacting near Archimedes crater. Inside, explosive charges scattered hundreds of stainless steel pentagonal pennants bearing the Soviet emblem across the lunar soil.'
  },

  {
    id: 'saturn-v-s4b',
    code: 'S-IVB-12',
    name: 'Apollo 12 Saturn V S-IVB Third Stage',
    designation: 'Seismic Impact Calibration Charge (14,000 kg)',
    category: 'Artificial Seismic Impact Monument',
    group: 'impacts',
    agency: 'NASA / Chrysler / Douglas Aircraft',
    landingDate: 'November 20, 1969, 22:17:17 UTC',
    coordinates: '3.9400° S, 21.2000° W',
    region: 'Oceanus Procellarum (73 km East of Statio Cognitum)',
    lat: -3.9400,
    lon: -21.2000,
    get distanceKm() { return calcDistance(this.lat, this.lon); }, // ~73 km
    get bearingDeg() { return calcBearing(this.lat, this.lon); },  // ~113° ESE
    status: 'Fresh Hypervelocity Impact Crater (30m wide, 4m deep)',
    isActiveSite: false,
    keyArtifacts: [
      '30-meter crater created by 14-ton rocket body impacting at 2.5 km/s',
      'Vaporized J-2 cryogenic rocket engine & aluminum fuel tanks',
      'Seismic source that vibrated the Moon for over 60 minutes'
    ],
    technicalSpecs: [
      { label: 'Impact Energy', value: 'Equiv. to 10 tons of TNT explosive' },
      { label: 'Distance to ALSEP', value: '73 km East of Conrad & Bean\'s seismometer' },
      { label: 'Seismic Wave Duration', value: 'Resonated for 1 hr 12 min' }
    ],
    description: 'To calibrate the seismometers deployed by Apollo astronauts, NASA deliberately commanded the massive 14,000 kg Saturn V third-stage booster rocket to plunge directly into the lunar surface. Hitting 73 km east of Apollo 12 at 2.5 km/s, the shockwave resonated through the dry lunar crust for over an hour, leading geophysicists to famously declare that the Moon "rang like a bell."'
  }
];
