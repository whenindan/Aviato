// A small set of real VORs used only to label mock waypoints along a route.
// Idents/frequencies are illustrative reference points, not for navigation.
export const navaids = [
  { id: 'SFO', name: 'San Francisco', lat: 37.6197, lon: -122.3745, freq: '115.8' },
  { id: 'OAK', name: 'Oakland', lat: 37.7212, lon: -122.2247, freq: '116.8' },
  { id: 'SAC', name: 'Sacramento', lat: 38.5566, lon: -121.5219, freq: '116.2' },
  { id: 'MVA', name: 'Mustang', lat: 39.2986, lon: -119.8964, freq: '114.6' },
  { id: 'RNO', name: 'Reno', lat: 39.4991, lon: -119.7681, freq: '116.8' },
  { id: 'BCE', name: 'Bryce Canyon', lat: 37.7061, lon: -112.1444, freq: '117.3' },
  { id: 'DVC', name: 'Dove Creek', lat: 37.7708, lon: -108.905, freq: '112.9' },
  { id: 'DEN', name: 'Denver', lat: 39.7625, lon: -104.7581, freq: '117.9' },
  { id: 'FQF', name: 'Fort Riley', lat: 39.0511, lon: -96.7719, freq: '112.7' },
  { id: 'TUL', name: 'Tulsa', lat: 36.1808, lon: -95.9033, freq: '116.0' },
  { id: 'DFW', name: 'Dallas Fort Worth', lat: 32.8481, lon: -97.0522, freq: '117.0' },
  { id: 'JOT', name: 'Joliet', lat: 41.5178, lon: -88.2044, freq: '113.9' },
  { id: 'ORD', name: "O'Hare", lat: 41.9808, lon: -87.9061, freq: '113.9' },
  { id: 'FWA', name: 'Fort Wayne', lat: 40.9958, lon: -85.2011, freq: '110.0' },
  { id: 'DJB', name: 'Wheeling', lat: 40.1758, lon: -80.6503, freq: '113.4' },
  { id: 'JST', name: 'Johnstown', lat: 40.3169, lon: -78.8339, freq: '110.6' },
  { id: 'HAR', name: 'Harrisburg', lat: 40.2436, lon: -76.7625, freq: '113.4' },
  { id: 'ETX', name: 'Allentown', lat: 40.6522, lon: -75.4483, freq: '117.0' },
  { id: 'SBJ', name: 'Solberg', lat: 40.6142, lon: -74.7017, freq: '117.4' },
  { id: 'CMK', name: 'Carmel', lat: 41.4419, lon: -73.7228, freq: '112.4' },
  { id: 'HUO', name: 'Huguenot', lat: 41.4869, lon: -74.7069, freq: '116.3' },
  { id: 'ALB', name: 'Albany', lat: 42.7469, lon: -73.7975, freq: '115.3' },
  { id: 'LGA', name: 'La Guardia', lat: 40.7867, lon: -73.8819, freq: '113.1' },
  { id: 'ATL', name: 'Atlanta', lat: 33.7789, lon: -84.5211, freq: '116.9' },
  { id: 'MIA', name: 'Miami', lat: 25.8467, lon: -80.3494, freq: '117.3' },
];

export function nearestNavaid(lat, lon, maxNm = 40) {
  let best = null, bestD = Infinity;
  for (const n of navaids) {
    const d = haversine(lat, lon, n.lat, n.lon);
    if (d < bestD) { bestD = d; best = n; }
  }
  return bestD <= maxNm ? best : null;
}

export function haversine(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  const h = Math.sin((lat2 - lat1) * rad / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin((lon2 - lon1) * rad / 2) ** 2;
  return 3440.065 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
