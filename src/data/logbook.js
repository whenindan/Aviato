// Seeded mock flight history plus one pending ADS-B-detected flight with a
// synthetic track used to demonstrate the auto-log parsing logic.
export const pastFlights = [
  { date: '2026-08-02', tail: 'N172SP', type: 'C172', from: 'KHPN', to: 'KALB', route: 'Direct', blockOut: '13:05', blockIn: '14:10', hours: 1.1, landingsDay: 1, landingsNight: 0, takeoffs: 1, source: 'ADS-B' },
  { date: '2026-08-09', tail: 'N172SP', type: 'C172', from: 'KALB', to: 'KHPN', route: 'Direct', blockOut: '16:40', blockIn: '17:42', hours: 1.0, landingsDay: 1, landingsNight: 0, takeoffs: 1, source: 'ADS-B' },
  { date: '2026-08-16', tail: 'N172SP', type: 'C172', from: 'KHPN', to: 'KHPN', route: 'Local — pattern work', blockOut: '10:00', blockIn: '11:15', hours: 1.3, landingsDay: 5, landingsNight: 0, takeoffs: 5, source: 'Manual' },
  { date: '2026-08-23', tail: 'N172SP', type: 'C172', from: 'KHPN', to: 'KFRG', route: 'Direct', blockOut: '18:30', blockIn: '19:20', hours: 0.8, landingsDay: 0, landingsNight: 1, takeoffs: 1, source: 'ADS-B' },
  { date: '2026-08-30', tail: 'N172SP', type: 'C172', from: 'KFRG', to: 'KHPN', route: 'Direct', blockOut: '20:05', blockIn: '20:55', hours: 0.8, landingsDay: 0, landingsNight: 1, takeoffs: 1, source: 'ADS-B' },
  { date: '2026-09-06', tail: 'N172SP', type: 'C172', from: 'KHPN', to: 'KTEB', route: 'Direct', blockOut: '09:15', blockIn: '10:00', hours: 0.75, landingsDay: 1, landingsNight: 0, takeoffs: 1, source: 'ADS-B' },
];

// Synthetic ADS-B track: N172SP, KHPN -> KPOU, 20 points of lat/lon/alt/gs/time.
export const pendingTrack = {
  tail: 'N172SP', type: 'C172', from: 'KHPN', to: 'KPOU', date: 'Today',
  points: [
    { t: 0, lat: 41.067, lon: -73.7076, alt: 439, gs: 0 },
    { t: 1, lat: 41.067, lon: -73.7076, alt: 439, gs: 18 },
    { t: 2, lat: 41.070, lon: -73.7090, alt: 460, gs: 55 },
    { t: 3, lat: 41.078, lon: -73.7130, alt: 780, gs: 92 },
    { t: 5, lat: 41.095, lon: -73.7220, alt: 1450, gs: 104 },
    { t: 8, lat: 41.130, lon: -73.7420, alt: 2400, gs: 112 },
    { t: 12, lat: 41.200, lon: -73.7750, alt: 3000, gs: 118 },
    { t: 16, lat: 41.290, lon: -73.8000, alt: 3000, gs: 118 },
    { t: 20, lat: 41.380, lon: -73.8200, alt: 3000, gs: 118 },
    { t: 24, lat: 41.470, lon: -73.8400, alt: 3000, gs: 117 },
    { t: 28, lat: 41.540, lon: -73.8600, alt: 2800, gs: 115 },
    { t: 32, lat: 41.580, lon: -73.8700, alt: 2200, gs: 108 },
    { t: 35, lat: 41.600, lon: -73.8780, alt: 1600, gs: 98 },
    { t: 37, lat: 41.612, lon: -73.8810, alt: 1100, gs: 85 },
    { t: 39, lat: 41.620, lon: -73.8830, alt: 700, gs: 68 },
    { t: 41, lat: 41.624, lon: -73.8838, alt: 400, gs: 50 },
    { t: 42, lat: 41.626, lon: -73.8842, alt: 250, gs: 35 },
    { t: 43, lat: 41.6266, lon: -73.8842, alt: 180, gs: 20 },
    { t: 44, lat: 41.6266, lon: -73.8842, alt: 165, gs: 8 },
    { t: 45, lat: 41.6266, lon: -73.8842, alt: 165, gs: 0 },
  ],
};

// Detection logic run against the mock track — mirrors what an ADS-B ingest
// pipeline would do: find takeoff (GS > 40kt & climbing) and landing
// (GS < 40kt after descending below field elevation + 50 ft).
export function detectFlight(track, fieldElevOut = 439, fieldElevIn = 165) {
  const pts = track.points;
  const takeoffIdx = pts.findIndex((p, i) => p.gs > 40 && i > 0 && p.alt > pts[i - 1].alt);
  let landingIdx = -1;
  for (let i = pts.length - 1; i >= 0; i--) {
    if (pts[i].gs < 40 && pts[i].alt < fieldElevIn + 50) landingIdx = i; else break;
  }
  const firstLanding = pts.findIndex((p, i) => i > takeoffIdx && p.gs < 40 && p.alt < fieldElevIn + 50);
  const landing = firstLanding === -1 ? pts.length - 1 : firstLanding;
  const takeoffT = pts[takeoffIdx]?.t ?? 0;
  const landingT = pts[landing]?.t ?? pts[pts.length - 1].t;
  const hours = Math.round(((landingT - takeoffT) / 60) * 10) / 10;
  const isNight = false;
  return {
    takeoffIdx, landingIdx: landing, hours,
    takeoffs: 1, landingsDay: isNight ? 0 : 1, landingsNight: isNight ? 1 : 0,
  };
}
