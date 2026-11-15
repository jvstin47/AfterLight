/**
 * AFTERLIGHT — Artifact Data & Archival Narrative Dossiers
 * Verified primary historical documentation for the Apollo 12 landing site.
 */

export const ARTIFACTS = {
  'lm-intrepid': {
    id: 'lm-intrepid',
    index: '01',
    name: 'Apollo 12 Lunar Module Descent Stage',
    designation: 'LM-6 "Intrepid"',
    category: 'Manned Spacecraft Descent Stage',
    manufacturer: 'Grumman Aerospace Corporation',
    landingDate: 'November 19, 1969, 06:54:35 UTC',
    coordinates: '3.01239° S, 23.42157° W',
    region: 'Oceanus Procellarum (Ocean of Storms)',
    status: 'Permanent Extraterrestrial Monument',
    distanceMeters: 0,
    position: { x: 0, y: 0, z: 0 },
    cameraFocus: {
      position: { x: 14, y: 4.8, z: 18 },
      target: { x: 0, y: 1.8, z: 0 }
    },
    keySpecs: [
      { label: 'Height', value: '3.23 meters' },
      { label: 'Diagonal Span', value: '9.45 meters (31.0 ft)' },
      { label: 'Dry Mass', value: '2,211 kg (4,875 lb)' },
      { label: 'Landing Propellant', value: '8,248 kg (Aerozine 50 / N2O4)' },
      { label: 'Descent Engine', value: 'TRW DPS (43.9 kN throttleable)' },
      { label: 'Surface Stay', value: '31 hr 31 min 12 sec' }
    ],
    narrative: {
      origin: {
        title: 'ORIGIN — The Precision Landing Mandate',
        text: 'Following Apollo 11’s four-mile downrange overshoot in July 1969, NASA required unequivocal proof that astronauts could pinpoint land within walking distance of designated targets. Grumman engineered LM-6 with upgraded primary guidance algorithms (LGC Program Luminary 1C) and terrain-relative radar updates to transform the Lunar Module from a blind ballistic lander into a precision exploration vehicle.'
      },
      journey: {
        title: 'JOURNEY — The Storm and the Descent',
        text: 'Apollo 12 launched through an electrical rainstorm at Kennedy Space Center on November 14, 1969, surviving two lightning strikes that knocked the telemetry offline before John Aaron’s historic "SCE to AUX" call restored cabin systems. Five days later, Commander Pete Conrad piloted Intrepid manually during final pitchover, blowing away blinding dust sheets with the throttleable descent engine to touch down within 163 meters of Surveyor 3.'
      },
      mission: {
        title: 'MISSION — The Basecamp at Ocean of Storms',
        text: 'The descent stage served as the crew’s launch pad, life support supply hub, and communications relay for 31.5 hours on the lunar surface. It housed the Modular Equipment Stowage Assembly (MESA) in Quadrant II, the ALSEP scientific package in Quadrant IV, the contingency sampling gear, and the commemorative stainless steel plaque bearing the signatures of Conrad, Bean, Gordon, and President Nixon.'
      },
      discoveries: {
        title: 'DISCOVERIES — Proving Precision Planetary Exploration',
        text: 'Intrepid’s landing proved that future exploration missions could target complex lunar geological formations, crater floors, and rilles without risking blind touchdowns. The engine exhaust interaction with the surface regolith provided the first direct data on rocket-plume scouring velocity, scouring fine regolith outward at supersonic speeds across hundreds of meters.'
      },
      finalDays: {
        title: 'FINAL DAYS — The Severing of the Stages',
        text: 'On November 20, 1969, at 14:25:47 UTC, explosive guillotines severed the structural interstage bolts and umbilical cabling connecting Intrepid’s ascent and descent stages. The ascent stage engine fired directly against the top deck of the descent stage, leaving the gold-foil wrapped lower stage, landing gear, and engine nozzle permanently embedded in the regolith.'
      },
      legacy: {
        title: 'LEGACY — The Silent Foundation',
        text: 'Today, Intrepid’s descent stage stands uncorrupted in the hard vacuum at Statio Cognitum. The golden Kapton blankets, titanium tanks, and stainless steel plaque remain intact, flanked by the discarded backpacks, boots, and the American flag—testaments to humanity’s first deliberate return to a previously visited machine.'
      }
    },
    schematic: 'assets/schematics_and_diagrams/lm_schematics/lm_descent_stage_subsystems.svg',
    schematicTitle: 'LM-6 Descent Stage Subsystems & Component Layout',
    gallery: [
      {
        src: 'assets/photography/intrepid_lm/AS12-46-6749_Intrepid_Ladder_and_Plaque.jpg',
        caption: 'Forward landing gear strut, egress ladder, and commemorative stainless steel plaque (NASA AS12-46-6749).'
      },
      {
        src: 'assets/photography/intrepid_lm/AS12-47-6913_Conrad_MESA_Lunar_Module.jpg',
        caption: 'Commander Pete Conrad operating the Modular Equipment Stowage Assembly (MESA) in Quad II (NASA AS12-47-6913).'
      },
      {
        src: 'assets/photography/intrepid_lm/AS12-47-6988_Flag_LM_Shadow_Footprints.jpg',
        caption: 'The United States flag, deep razor-sharp shadow of Intrepid, and dark compacted footprint tracks (NASA AS12-47-6988).'
      },
      {
        src: 'assets/photography/intrepid_lm/AS12-51-7507_Intrepid_Descent_Stage_Landing_Config.jpg',
        caption: 'Intrepid photographed from the Command Module Yankee Clipper in landing configuration prior to descent (NASA AS12-51-7507).'
      }
    ]
  },

  'surveyor-3': {
    id: 'surveyor-3',
    index: '02',
    name: 'Surveyor 3 Robotic Lunar Lander',
    designation: 'Surveyor Model C (SC-3)',
    category: 'Unmanned Robotic Soft-Lander',
    manufacturer: 'Hughes Aircraft Company / NASA JPL',
    landingDate: 'April 20, 1967, 00:04:53 UTC',
    coordinates: '3.01520° S, 23.41890° W',
    region: 'Surveyor Crater, Oceanus Procellarum',
    status: 'Visited & Sampled by Apollo 12; Permanent Artifact',
    distanceMeters: 163,
    position: { x: 72, y: -11.5, z: 150 },
    cameraFocus: {
      position: { x: 79, y: -8.8, z: 158 },
      target: { x: 72, y: -10.8, z: 150 }
    },
    keySpecs: [
      { label: 'Height', value: '3.3 meters' },
      { label: 'Tripod Footprint', value: '4.3 meters diameter' },
      { label: 'Landed Mass', value: '294.3 kg (648.8 lb)' },
      { label: 'Crater Location', value: 'Surveyor Crater (11.8° slope)' },
      { label: 'TV Images (1967)', value: '6,315 frames returned' },
      { label: 'Soil Sampler Reach', value: '1.5 meters pantograph arm' }
    ],
    narrative: {
      origin: {
        title: 'ORIGIN — Paving the Way for Apollo',
        text: 'Built by Hughes Aircraft Company under JPL supervision, the Surveyor program was designed to answer the single most urgent question facing Apollo engineers: would a spacecraft landing on the Moon sink into meters of loose, fluffy dust, or could the lunar crust bear the structural weight of a multi-ton lunar module?'
      },
      journey: {
        title: 'JOURNEY — The Triple-Bounce Touchdown',
        text: 'Launched on April 17, 1967, Surveyor 3 approached the Moon on April 20. Highly reflective rocks confused its radar altimeter, causing the vernier braking engines to remain firing as it touched down. The probe bounced three consecutive times across the regolith before its engines were commanded shut from Earth, finally coming to rest on an 11.8-degree slope inside a 200-meter impact crater.'
      },
      mission: {
        title: 'MISSION — Digging Alien Soil for the First Time',
        text: 'Surveyor 3 carried a Vidicon television camera and an electric motor-driven pantograph soil mechanics surface sampler (SMSS). Over two weeks of lunar daylight, it dug four trenches up to 17.5 cm deep, measured soil bearing strength between 1.8 and 5.5 N/cm², returned 6,315 television images, and transmitted the first views of an eclipse of the Sun by the Earth.'
      },
      discoveries: {
        title: 'DISCOVERIES — The First Extraterrestrial Forensic Study',
        text: 'When Conrad and Bean descended into the crater on November 20, 1969, they inspected the machine after 31 months of lunar exposure. They unbolted its TV camera, scoop, and tubing. Earth laboratory analysis revealed that the white paint had browned under solar UV, micrometeoroids had pitted the optics, and engine dust from Intrepid 163m away had sandblasted the windward metal hulls.'
      },
      finalDays: {
        title: 'FINAL DAYS — The Freeze of the Lunar Night',
        text: 'Surveyor 3’s active mission concluded on May 4, 1967, when the first lunar night set in. Temperatures plunged to -180°C, freezing its silver-zinc battery and fracturing internal circuits. It fell silent, casting long shadows across the crater wall for 974 Earth days until the boots of Conrad and Bean arrived at its tripod footpads.'
      },
      legacy: {
        title: 'LEGACY — The Archeological Rendezvous',
        text: 'Surveyor 3 is the only robotic spacecraft on another celestial body ever visited, inspected, and sampled by human beings. Its severed limbs and camera mounting brackets remain visible today, resting on the crater slope as an enduring symbol of the partnership between robotic vanguard probes and human explorers.'
      }
    },
    schematic: 'assets/schematics_and_diagrams/surveyor_schematics/surveyor_spacecraft_configuration.svg',
    schematicTitle: 'Surveyor 3 Engineering Blueprint & Retrieved Hardware',
    gallery: [
      {
        src: 'assets/photography/surveyor_3_rendezvous/AS12-48-7134_Conrad_Surveyor_3_Intrepid_Background.jpg',
        caption: 'Pete Conrad inspecting Surveyor 3 with Lunar Module Intrepid visible across the crater rim in the background (NASA AS12-48-7134).'
      },
      {
        src: 'assets/photography/surveyor_3_rendezvous/AS12-48-7133_Conrad_Examining_Surveyor_Camera.jpg',
        caption: 'Conrad reaching toward the Surveyor television camera before cutting the mounting tubes (NASA AS12-48-7133).'
      },
      {
        src: 'assets/photography/surveyor_3_rendezvous/AS12-48-7099_Surveyor_Footpad_Lunar_Soil.jpg',
        caption: 'Engineering close-up of Surveyor 3 footpad 2 embedded in fine-grained lunar regolith (NASA AS12-48-7099).'
      },
      {
        src: 'assets/photography/surveyor_3_rendezvous/AS12-48-7121_Surveyor_In_Crater_Slope.jpg',
        caption: 'Wide-angle profile showing Surveyor 3 resting on the 11.8° inner wall of Surveyor Crater (NASA AS12-48-7121).'
      },
      {
        src: 'assets/photography/surveyor_3_rendezvous/AS12-48-7136_Surveyor_3_and_Intrepid_Panorama.jpg',
        caption: 'Expansive panoramic vista connecting the resting probe to the rim and the distant landing plain (NASA AS12-48-7136).'
      }
    ]
  },

  'alsep-array-a': {
    id: 'alsep-array-a',
    index: '03',
    name: 'Apollo Lunar Surface Experiments Package',
    designation: 'ALSEP Array A',
    category: 'Geophysical & Plasma Science Station',
    manufacturer: 'Bendix Aerospace / General Electric Space Division',
    landingDate: 'November 19, 1969, 14:45 UTC',
    coordinates: '3.01160° S, 23.42300° W',
    region: 'Oceanus Procellarum',
    status: 'Operational 1969–1977 (Deactivated by NASA Command)',
    distanceMeters: 130,
    position: { x: -106, y: 0.5, z: -75 },
    cameraFocus: {
      position: { x: -98, y: 3.2, z: -67 },
      target: { x: -106, y: 0.8, z: -75 }
    },
    keySpecs: [
      { label: 'Telemetry Link', value: 'S-band 1712.5 MHz (1.0W)' },
      { label: 'Data Bitrate', value: '1,060 bps PCM split-phase' },
      { label: 'Nuclear Generator', value: 'SNAP-27 RTG (Pu-238 / 73.5W)' },
      { label: 'Active Lifespan', value: '7 yr 10 mo (deactivated 1977)' },
      { label: 'Experiments', value: 'PSE, LSM, SWS, SIDE, CCGE' },
      { label: 'Distance to LM', value: '130 meters (Azimuth 305°)' }
    ],
    narrative: {
      origin: {
        title: 'ORIGIN — Transforming Apollo into Science',
        text: 'Contracted to Bendix Aerospace with nuclear engineering by General Electric, ALSEP was designed to turn short Apollo landings into decadal scientific research stations. Unlike Apollo 11’s battery-limited EASEP package, Apollo 12 carried Array A: a full suite of automated instruments powered by an atomic decay heat source capable of operating through the brutal 354-hour lunar night.'
      },
      journey: {
        title: 'JOURNEY — The Barbell Carry Across the Plain',
        text: 'During EVA-1, Alan Bean extracted the red-hot Plutonium-238 capsule from its graphite cask on the LM using a special Hanford tool. Connecting the two scientific pallets with a central mast, Bean carried the 120-kg assembly barbell-style 130 meters northwest of Intrepid, far enough to prevent the ascent stage liftoff blast from damaging the delicate instruments.'
      },
      mission: {
        title: 'MISSION — Continuous Planetary Telemetry',
        text: 'ALSEP Array A integrated five core geophysical experiments: the Passive Seismic Experiment (PSE) inside a reflective 10-sided Mylar skirt; the Lunar Surface Magnetometer (LSM) on three 1-meter boom arms; the Solar Wind Spectrometer (SWS); the Suprathermal Ion Detector (SIDE); and the Cold Cathode Gauge (CCGE) measuring ambient atmosphere down to 10⁻¹² torr.'
      },
      discoveries: {
        title: 'DISCOVERIES — The Moon That Rang Like a Bell',
        text: 'When Intrepid’s ascent stage was deorbited and crashed into the Moon on November 20, 1969, the PSE recorded vibrations resonating for over 60 minutes, prompting Dr. Maurice Ewing to declare that the Moon "rang like a bell." Over eight years, the station discovered that the Moon has a 60-km crust, recorded deep moonquakes triggered by Earth tides, and detected a permanent crustal magnetic field.'
      },
      finalDays: {
        title: 'FINAL DAYS — The Silent Command from Earth',
        text: 'Designed for a one-year design life, Array A performed without failure for 7 years and 10 months. Even in 1977, the SNAP-27 RTG was still generating 63 Watts of electrical power. On September 30, 1977, due to NASA budget cuts and shifting funding toward the Space Shuttle, Mission Control sent the final digital shutdown command, turning off the transmitter forever.'
      },
      legacy: {
        title: 'LEGACY — The Nuclear Heart Still Beating',
        text: 'The ALSEP Central Station, seismometer shroud, and magnetometer boom arms remain exactly where Bean leveled them in 1969. Although its radio transmitter is silent, the SNAP-27 RTG’s Plutonium-238 core (half-life: 87.7 years) continues to radiate heat into the vacuum of Oceanus Procellarum to this day.'
      }
    },
    schematic: 'assets/schematics_and_diagrams/alsep_schematics/alsep_array_a_layout_diagram.svg',
    schematicTitle: 'ALSEP Array A Surface Geometry & Instrument Separation',
    gallery: [
      {
        src: 'assets/photography/alsep_deployment/AS12-46-6790_Bean_Fueling_SNAP27_RTG.jpg',
        caption: 'Alan Bean extracting the Plutonium-238 fuel capsule from the LM graphite cask into the SNAP-27 generator (NASA AS12-46-6790).'
      },
      {
        src: 'assets/photography/alsep_deployment/AS12-46-6807_Bean_Carrying_ALSEP_Pallets.jpg',
        caption: 'Bean carrying the two ALSEP subpackages barbell-style across the lunar regolith to the deployment site (NASA AS12-46-6807).'
      },
      {
        src: 'assets/photography/alsep_deployment/AS12-47-6918_Deployed_ALSEP_Array.jpg',
        caption: 'Full overview of deployed ALSEP station: Central Station hub, RTG power cable, and instruments (NASA AS12-47-6918).'
      },
      {
        src: 'assets/photography/alsep_deployment/AS12-46-6813_Bean_Deploying_LSM_Magnetometer.jpg',
        caption: 'Alan Bean aligning the orthogonal boom arms of the Lunar Surface Magnetometer (NASA AS12-46-6813).'
      },
      {
        src: 'assets/photography/alsep_deployment/AS12-47-6919_Bean_Deploying_ALSEP_Subpackages.jpg',
        caption: 'Bean adjusting the alignment bubble and sun compass on the scientific subpackages (NASA AS12-47-6919).'
      }
    ]
  }
};
