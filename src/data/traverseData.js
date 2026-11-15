/**
 * AFTERLIGHT — Apollo 12 Traverse Routes & Geological Stations
 * Sourced from NASA EVA transcripts and USGS Astrogeology maps.
 */

export const TRAVERSE_DATA = {
  eva1: {
    id: 'eva1',
    name: 'EVA 1 — ALSEP Deployment & Flag',
    date: 'November 19, 1969',
    duration: '3 hours, 56 minutes',
    distanceMeters: 1050,
    astronauts: 'Charles "Pete" Conrad (CDR) & Alan L. Bean (LMP)',
    description: 'Initial egress, contingency sampling, MESA activation, television camera setup, ALSEP package deployment 130m northwest, SNAP-27 RTG nuclear fueling, and flag planting.',
    waypoints: [
      { name: 'Intrepid Egress Ladder', coords: [-23.42157, -3.01239], pos: [0, 0, 0], note: 'Conrad first step: "Whoopee! Man, that may have been a small one for Neil, but that\'s a long one for me!"' },
      { name: 'MESA Deployment', coords: [-23.42155, -3.01238], pos: [2.5, 0, 1.5], note: 'Modular Equipment Stowage Assembly lowered from Quad II.' },
      { name: 'US Flag Planting', coords: [-23.42157, -3.01245], pos: [0, 0, 7.0], note: 'Flag planted 7 meters south of Intrepid.' },
      { name: 'ALSEP Deployment Site', coords: [-23.42300, -3.01160], pos: [-106, 0.5, -75], note: 'Central Station, RTG, Seismometer, Magnetometer, Solar Wind Spectrometer, and SIDE/CCGE.' },
      { name: 'Solar Wind Composition Foil', coords: [-23.42180, -3.01210], pos: [-15, 0, -10], note: 'Swiss foil experiment deployed to trap solar wind particles.' }
    ]
  },
  eva2: {
    id: 'eva2',
    name: 'EVA 2 — The Surveyor Crater Traverse',
    date: 'November 20, 1969',
    duration: '3 hours, 49 minutes',
    distanceMeters: 1480,
    astronauts: 'Charles "Pete" Conrad (CDR) & Alan L. Bean (LMP)',
    description: 'A 1.5 km geological loop visiting a chain of impact craters to sample ejecta blankets, concluding with the historical descent into Surveyor Crater to inspect and sample Surveyor 3.',
    stations: [
      {
        id: 'station-1',
        name: 'Head Crater (East Rim)',
        diameterMeters: 140,
        pos: [-50, 0, 15],
        notes: 'Examined fresh ejecta blocks thrown from the crater basin.'
      },
      {
        id: 'station-2',
        name: 'Head Crater (West Rim)',
        diameterMeters: 140,
        pos: [-125, 0, 30],
        notes: 'Collected documented sample 12013—a unique granite-like lithology rich in potassium and uranium.'
      },
      {
        id: 'station-3',
        name: 'Bench Crater',
        diameterMeters: 70,
        pos: [-140, 0, 45],
        notes: 'Crater penetrates beneath the mare regolith into deeper sub-crustal basalt layers.'
      },
      {
        id: 'station-4',
        name: 'Sharp Crater',
        diameterMeters: 14,
        pos: [-210, 0, 95],
        notes: 'Turnaround point of the traverse. Distinct white ejecta ray indicating a very young impact.'
      },
      {
        id: 'station-5',
        name: 'Halo Crater',
        diameterMeters: 30,
        pos: [-100, 0, 130],
        notes: 'Dark halo surrounding crater rim caused by excavated glass-rich impact melt.'
      },
      {
        id: 'station-6',
        name: 'Surveyor Crater (Northwest Rim)',
        diameterMeters: 200,
        pos: [20, 0, 100],
        notes: 'First visual sighting of Surveyor 3 resting on the opposite crater wall.'
      },
      {
        id: 'station-7',
        name: 'Surveyor 3 Resting Site',
        diameterMeters: 200,
        pos: [72, -11.5, 150],
        notes: 'Descended 11.8° slope; unbolted TV camera, scoop bucket, and structural tubing.'
      },
      {
        id: 'station-8',
        name: 'Block Crater',
        diameterMeters: 15,
        pos: [60, 0, 85],
        notes: 'Small sharp impact on Surveyor Crater\'s north rim; coarse angular boulder samples collected.'
      }
    ]
  }
};
