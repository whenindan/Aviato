// Illustrative POH-ish performance figures for preview only — not for flight planning.
// Shared by the aircraft section (§4) and the mock briefing generator (§2).
export const aircraft = [
  {
    code: 'C172', name: 'Cessna 172S', class: 'Piston', engine: 'Lycoming IO-360, 180 hp',
    fuelType: 'Avgas 100LL', cruiseTAS: 122, climbRate: 730, climbSpeed: 74, climbBurn: 10.5,
    cruiseBurn: 8.5, usableFuel: 53, ceiling: 14000, range: 640, seats: 4, maxTakeoff: 2550,
    wingspan: `36'1"`, length: `27'2"`, notes: 'The trainer most pilots learn on — high wing, forgiving handling.',
    // Illustrative weight & balance figures, approximating a C172S POH — for the
    // passenger/W&B demo only, not for real flight planning.
    wb: {
      emptyWeight: 1691, emptyWeightArm: 39.6,
      stations: { front: { arm: 37.0, seats: 2 }, rear: { arm: 73.0, seats: 2 } },
      fuelArm: 48.0, fuelLbPerGal: 6,
      envelope: [{ weight: 1500, fwd: 35.0, aft: 47.3 }, { weight: 2550, fwd: 38.4, aft: 47.3 }],
    },
  },
  {
    code: 'PA28', name: 'Piper Archer PA-28-181', class: 'Piston', engine: 'Lycoming O-360, 180 hp',
    fuelType: 'Avgas 100LL', cruiseTAS: 128, climbRate: 667, climbSpeed: 76, climbBurn: 11,
    cruiseBurn: 9.5, usableFuel: 48, ceiling: 13236, range: 522, seats: 4, maxTakeoff: 2550,
    wingspan: `35'5"`, length: `24'8"`, notes: 'Low-wing four-seater with a stabilator and semi-tapered wing.',
  },
  {
    code: 'SR22', name: 'Cirrus SR22 (G6)', class: 'Piston', engine: 'Continental IO-550, 310 hp',
    fuelType: 'Avgas 100LL', cruiseTAS: 183, climbRate: 1270, climbSpeed: 101, climbBurn: 19,
    cruiseBurn: 17.5, usableFuel: 92, ceiling: 17500, range: 1040, seats: 5, maxTakeoff: 3600,
    wingspan: `38'4"`, length: `26'0"`, caps: true,
    notes: 'Composite low-wing single with the Cirrus Airframe Parachute System (CAPS).',
  },
  {
    code: 'SF50', name: 'Cirrus Vision Jet SF50 (G2)', class: 'Turbofan', engine: 'Williams FJ33-5A, 1,846 lbf',
    fuelType: 'Jet-A', cruiseTAS: 305, climbRate: 1800, climbSpeed: 150, climbBurn: 55,
    cruiseBurn: 65, usableFuel: 296, ceiling: 31000, range: 1275, seats: 7, maxTakeoff: 6000,
    wingspan: `38'7"`, length: `30'11"`, caps: true, jet: true,
    notes: 'Single-engine personal jet with a dorsal-mounted engine, V-tail, and CAPS + Safe Return autoland.',
  },
];

export function findAircraft(code) {
  return aircraft.find(a => a.code === code) || aircraft[0];
}
