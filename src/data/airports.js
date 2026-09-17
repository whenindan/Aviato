// Coordinates: https://github.com/datasets/airport-codes (OurAirports).
// Runway and frequency data below is illustrative for the briefing preview —
// verify with the current FAA Chart Supplement before any real-world use.
export const airports = [
  ['KSEA', 'Seattle', 'Seattle Tacoma International', 47.447943, -122.310276, 433, 'America/Los_Angeles',
    [{ id: '16L/34R', len: 11901, wid: 150 }, { id: '16C/34C', len: 9426, wid: 150 }],
    { atis: '118.0', gnd: '121.7', twr: '119.9', app: '119.2', dep: '121.0' }, 'ZSE'],
  ['KSFO', 'San Francisco', 'San Francisco International', 37.619806, -122.374821, 13, 'America/Los_Angeles',
    [{ id: '10L/28R', len: 11870, wid: 200 }, { id: '01L/19R', len: 7650, wid: 200 }],
    { atis: '118.85', gnd: '121.8', twr: '120.5', app: '135.65', dep: '135.65' }, 'ZOA'],
  ['KLAX', 'Los Angeles', 'Los Angeles International', 33.942501, -118.407997, 125, 'America/Los_Angeles',
    [{ id: '06L/24R', len: 10285, wid: 150 }, { id: '07L/25R', len: 12091, wid: 150 }],
    { atis: '133.8', gnd: '121.65', twr: '120.95', app: '124.5', dep: '124.5' }, 'ZLA'],
  ['KDEN', 'Denver', 'Denver International', 39.860027, -104.673792, 5431, 'America/Denver',
    [{ id: '16R/34L', len: 12000, wid: 150 }, { id: '08/26', len: 12000, wid: 150 }],
    { atis: '135.45', gnd: '121.9', twr: '124.3', app: '119.05', dep: '125.35' }, 'ZDV'],
  ['KDFW', 'Dallas', 'Dallas Fort Worth International', 32.896801, -97.038002, 607, 'America/Chicago',
    [{ id: '17R/35L', len: 13401, wid: 200 }, { id: '18L/36R', len: 13400, wid: 150 }],
    { atis: '128.4', gnd: '121.85', twr: '126.55', app: '124.35', dep: '124.35' }, 'ZFW'],
  ['KORD', 'Chicago', "Chicago O'Hare International", 41.9786, -87.9048, 680, 'America/Chicago',
    [{ id: '10L/28R', len: 13000, wid: 200 }, { id: '09L/27R', len: 7967, wid: 150 }],
    { atis: '135.15', gnd: '121.75', twr: '126.9', app: '120.05', dep: '125.0' }, 'ZAU'],
  ['KATL', 'Atlanta', 'Hartsfield Jackson International', 33.6367, -84.428101, 1026, 'America/New_York',
    [{ id: '08L/26R', len: 9000, wid: 150 }, { id: '09L/27R', len: 11890, wid: 150 }],
    { atis: '120.15', gnd: '121.75', twr: '119.5', app: '124.3', dep: '125.6' }, 'ZTL'],
  ['KJFK', 'New York', 'John F. Kennedy International', 40.639447, -73.779317, 13, 'America/New_York',
    [{ id: '13L/31R', len: 10000, wid: 150 }, { id: '04L/22R', len: 8400, wid: 150 }],
    { atis: '128.725', gnd: '121.9', twr: '119.1', app: '127.4', dep: '135.9' }, 'ZNY'],
  ['KMIA', 'Miami', 'Miami International', 25.796011, -80.289751, 8, 'America/New_York',
    [{ id: '08L/26R', len: 10506, wid: 150 }, { id: '09/27', len: 13016, wid: 150 }],
    { atis: '132.35', gnd: '121.8', twr: '118.3', app: '124.05', dep: '124.05' }, 'ZMA'],
  ['KHPN', 'White Plains', 'Westchester County', 41.067001, -73.707603, 439, 'America/New_York',
    [{ id: '16/34', len: 6549, wid: 150 }, { id: '11/29', len: 4451, wid: 150 }],
    { atis: '135.0', gnd: '121.8', twr: '119.7', app: '120.8', dep: '125.9' }, 'ZNY'],
  ['KTEB', 'Teterboro', 'Teterboro Airport', 40.850101, -74.060799, 9, 'America/New_York',
    [{ id: '01/19', len: 7000, wid: 150 }, { id: '06/24', len: 6015, wid: 150 }],
    { atis: '124.15', gnd: '121.9', twr: '119.5', app: '119.2', dep: '125.9' }, 'ZNY'],
  ['KFRG', 'East Farmingdale', 'Republic Airport', 40.728576, -73.414267, 82, 'America/New_York',
    [{ id: '01/19', len: 6473, wid: 150 }, { id: '14/32', len: 5516, wid: 100 }],
    { atis: '119.65', gnd: '121.6', twr: '118.8', app: '132.4', dep: '132.4' }, 'ZNY'],
  ['KPOU', 'Poughkeepsie', 'Dutchess County', 41.626598, -73.884201, 165, 'America/New_York',
    [{ id: '06/24', len: 5000, wid: 150 }, { id: '15/33', len: 3746, wid: 100 }],
    { ctaf: '118.4', twr: '118.4' }, 'ZNY'],
  ['KALB', 'Albany', 'Albany International', 42.748299, -73.801697, 285, 'America/New_York',
    [{ id: '01/19', len: 7200, wid: 150 }, { id: '10/28', len: 6303, wid: 150 }],
    { atis: '124.15', gnd: '121.9', twr: '119.5', app: '125.0', dep: '125.0' }, 'ZBW'],
  ['KPRC', 'Prescott', 'Ernest A. Love Field', 34.654499, -112.421198, 5045, 'America/Phoenix',
    [{ id: '21L/03R', len: 7615, wid: 150 }, { id: '12/30', len: 4848, wid: 75 }],
    { atis: '124.75', gnd: '121.9', twr: '118.5', dep: '126.0' }, 'ZAB'],
  ['KHII', 'Lake Havasu City', 'Lake Havasu City Airport', 34.571098, -114.357597, 783, 'America/Phoenix',
    [{ id: '14/32', len: 6001, wid: 75 }],
    { ctaf: '122.8' }, 'ZLA'],
].map(([code, city, name, lat, lon, elevation, tz, runways, freqs, center]) => ({
  code, city, name, lat, lon, elevation, tz, runways, freqs, center,
}));

export function distanceNm(a, b) {
  const rad = Math.PI / 180;
  const h = Math.sin((b.lat-a.lat)*rad/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin((b.lon-a.lon)*rad/2)**2;
  return Math.round(3440.065 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h)));
}

export function trueCourse(a, b) {
  const rad = Math.PI / 180;
  const y = Math.sin((b.lon-a.lon)*rad) * Math.cos(b.lat*rad);
  const x = Math.cos(a.lat*rad)*Math.sin(b.lat*rad) - Math.sin(a.lat*rad)*Math.cos(b.lat*rad)*Math.cos((b.lon-a.lon)*rad);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
