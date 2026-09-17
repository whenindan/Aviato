// Illustrative Military Operating Area (MOA) data for the KPRC ↔ KHII demo route —
// boundaries and schedules are mock/simplified, not sourced from a current sectional
// or the Chart Supplement. See SOURCES.md.
export const moas = [
  {
    id: 'BAGDAD',
    name: 'Bagdad MOA',
    floor: '100 ft AGL',
    ceiling: '18,000 ft MSL',
    schedule: { days: [1, 2, 3, 4, 5], start: '07:00', end: '23:00', tz: 'America/Phoenix', note: 'Other times by NOTAM' },
    polygon: [[34.75, -113.35], [34.75, -112.95], [34.45, -112.95], [34.45, -113.35]],
  },
  {
    id: 'HUALAPAI',
    name: 'Hualapai MOA',
    floor: '3,000 ft AGL',
    ceiling: '17,000 ft MSL',
    schedule: { days: [1, 2, 3, 4, 5], start: '07:00', end: '21:00', tz: 'America/Phoenix', note: 'Other times by NOTAM' },
    polygon: [[34.72, -114.05], [34.72, -113.70], [34.42, -113.70], [34.42, -114.05]],
  },
];

// Standard ray-casting point-in-polygon test. `point` is [lat, lon]; `polygon` is an
// array of [lat, lon] vertices.
export function pointInPolygon([lat, lon], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i], [yj, xj] = polygon[j];
    const intersects = (yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Returns the subset of `moas` that the route (an array of {lat, lon} points) passes
// through, in the order given.
export function moasAlongRoute(routePoints, list = moas) {
  return list.filter(moa => routePoints.some(p => pointInPolygon([p.lat, p.lon], moa.polygon)));
}

// Hot/cold status of a MOA at a given date, evaluated in the MOA's own timezone.
export function moaStatus(moa, date) {
  const { days, start, end, tz, note } = moa.schedule;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date);
  const weekdayShort = parts.find(p => p.type === 'weekday').value;
  const hour = Number(parts.find(p => p.type === 'hour').value);
  const minute = Number(parts.find(p => p.type === 'minute').value);
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayShort);
  const mins = hour * 60 + minute;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const hot = days.includes(dayIndex) && mins >= startH * 60 + startM && mins < endH * 60 + endM;
  return { hot, hoursText: `${start}–${end} local, Mon–Fri${note ? ` · ${note}` : ''}` };
}
