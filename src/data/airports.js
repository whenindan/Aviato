// Coordinates: https://github.com/datasets/airport-codes (OurAirports).
// Supplementary preview values are illustrative, not navigation data.
export const airports = [
  ['KSEA', 'Seattle', 'Seattle Tacoma International', 47.447943, -122.310276, 433],
  ['KSFO', 'San Francisco', 'San Francisco International', 37.619806, -122.374821, 13],
  ['KLAX', 'Los Angeles', 'Los Angeles International', 33.942501, -118.407997, 125],
  ['KDEN', 'Denver', 'Denver International', 39.860027, -104.673792, 5431],
  ['KDFW', 'Dallas', 'Dallas Fort Worth International', 32.896801, -97.038002, 607],
  ['KORD', 'Chicago', "Chicago O'Hare International", 41.9786, -87.9048, 680],
  ['KATL', 'Atlanta', 'Hartsfield Jackson International', 33.6367, -84.428101, 1026],
  ['KJFK', 'New York', 'John F. Kennedy International', 40.639447, -73.779317, 13],
  ['KMIA', 'Miami', 'Miami International', 25.796011, -80.289751, 8],
  ['KHPN', 'White Plains', 'Westchester County', 41.067001, -73.707603, 439],
  ['KTEB', 'Teterboro', 'Teterboro Airport', 40.850101, -74.060799, 9],
  ['KFRG', 'East Farmingdale', 'Republic Airport', 40.728576, -73.414267, 82],
  ['KPOU', 'Poughkeepsie', 'Dutchess County', 41.626598, -73.884201, 165],
  ['KALB', 'Albany', 'Albany International', 42.748299, -73.801697, 285],
].map(([code, city, name, lat, lon, elevation]) => ({code, city, name, lat, lon, elevation}));

export function distanceNm(a, b) {
  const rad = Math.PI / 180;
  const h = Math.sin((b.lat-a.lat)*rad/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin((b.lon-a.lon)*rad/2)**2;
  return Math.round(3440.065 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h)));
}
