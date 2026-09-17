// Pure functions — no React. Builds an illustrative VFR briefing from a route,
// aircraft profile and ETD. Nothing here is a substitute for a real briefing.
import { distanceNm, trueCourse } from './airports.js';
import { navaids, nearestNavaid, haversine } from './navaids.js';
import { moasAlongRoute, moaStatus } from './moas.js';

const ARTCC_FREQS = {
  ZOA: ['128.75', '132.45'], ZLA: ['133.0', '124.75'], ZDV: ['127.55', '134.65'],
  ZFW: ['128.45', '133.55'], ZAU: ['125.45', '134.55'], ZTL: ['126.4', '133.35'],
  ZNY: ['128.3', '135.35'], ZMA: ['128.5', '133.65'], ZBW: ['133.75', '127.7'],
  ZAB: ['128.75', '133.05'],
};

const TFR_POINTS = [
  { name: 'Stadium TFR (sample)', lat: 40.8296, lon: -73.9262, nm: 30 },
  { name: 'VIP movement TFR (sample)', lat: 38.9072, lon: -77.0369, nm: 30 },
  { name: 'Stadium TFR (sample)', lat: 33.7554, lon: -84.4009, nm: 30 },
  { name: 'Sporting event TFR (sample)', lat: 34.0141, lon: -118.2879, nm: 30 },
];

// Spherical interpolation along the great circle from `from` to `to`.
export function greatCirclePoints(from, to, n) {
  const rad = Math.PI / 180;
  const [lat1, lon1] = [from.lat * rad, from.lon * rad];
  const [lat2, lon2] = [to.lat * rad, to.lon * rad];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2));
  if (d === 0) return [{ lat: from.lat, lon: from.lon }];
  const points = [];
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    points.push({ lat: Math.atan2(z, Math.sqrt(x * x + y * y)) / rad, lon: Math.atan2(y, x) / rad });
  }
  return points;
}

// Crude linear magnetic-variation approximation across the CONUS: roughly 0°
// near the Great Lakes, growing east (E) and west (W) from there.
function magVar(lon) {
  const v = (lon + 87) * -0.32;
  return { value: Math.round(Math.abs(v)), east: v > 0 };
}

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => { h = (h * 1664525 + 1013904223) >>> 0; return h / 4294967296; };
}

function fmtHm(hours) {
  const h = Math.floor(hours), m = Math.round((hours - h) * 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function fmtClock(date, tz) {
  try {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(date);
  } catch { return date.toISOString().slice(11, 16); }
}

function fmtZulu(date) {
  return date.toISOString().slice(11, 16) + 'Z';
}

export function buildBriefing({ from, to, aircraft, etd }) {
  const distance = distanceNm(from, to);
  const course = trueCourse(from, to);
  const { value: varValue, east } = magVar((from.lon + to.lon) / 2);
  const magHeading = Math.round(((course + (east ? -varValue : varValue)) + 360) % 360);

  // Hemispheric VFR cruise rule (14 CFR § 91.159): odd magnetic course 0-179 -> odd
  // thousand +500, even 180-359 -> even thousand +500.
  const eastbound = magHeading < 180;
  let cruiseAlt = eastbound ? 5500 : 6500;
  if (aircraft.jet) cruiseAlt = eastbound ? 17500 : 18500;
  cruiseAlt = Math.min(cruiseAlt, aircraft.ceiling - 1000);
  if (distance < 60) cruiseAlt = Math.min(cruiseAlt, eastbound ? 3500 : 4500);

  const headwind = 8; // fixed mock headwind component
  const climbGS = Math.max(40, aircraft.climbSpeed - headwind);
  const climbDelta = Math.max(0, cruiseAlt - from.elevation);
  const tocTime = climbDelta / aircraft.climbRate / 60; // hours
  const tocDist = tocTime * climbGS;

  const descentRate = 500; // fpm, 3-degree-ish rule
  const descDelta = Math.max(0, cruiseAlt - to.elevation);
  const todTime = descDelta / descentRate / 60;
  const descentGS = Math.max(60, aircraft.cruiseTAS - headwind + 15);
  const todDist = todTime * descentGS;

  const cruiseDist = Math.max(0, distance - tocDist - todDist);
  const cruiseGS = Math.max(40, aircraft.cruiseTAS - headwind);
  const cruiseTime = cruiseDist / cruiseGS;
  const enrouteHours = tocTime + cruiseTime + todTime;

  const [etdH, etdM] = etd.split(':').map(Number);
  const etdDate = new Date();
  etdDate.setHours(etdH, etdM, 0, 0);
  const etaDate = new Date(etdDate.getTime() + enrouteHours * 3600 * 1000);

  // Fuel
  const taxiFuel = 1.4;
  const climbBurn = aircraft.climbBurn * tocTime;
  const cruiseBurnGal = aircraft.cruiseBurn * cruiseTime;
  const descentBurn = aircraft.cruiseBurn * 0.8 * todTime;
  const isNight = etaDate.getHours() >= 20 || etaDate.getHours() < 6;
  const reserve = (isNight ? 45 : 30) / 60 * aircraft.cruiseBurn;
  const subtotal = taxiFuel + climbBurn + cruiseBurnGal + descentBurn + reserve;
  const contingency = subtotal * 0.1;
  const required = Math.round((subtotal + contingency) * 10) / 10;
  const usable = aircraft.usableFuel;
  const fuelOk = required <= usable;

  let fuelStop = null;
  if (!fuelOk) {
    fuelStop = 'a fuel stop along the route';
  }

  // Waypoints
  const legCount = Math.max(2, Math.round(distance / Math.max(40, distance / 8)));
  const rawPoints = greatCirclePoints(from, to, legCount);
  let cumulative = 0;
  const waypoints = rawPoints.map((p, i) => {
    if (i === 0) return { ident: from.code, type: 'Airport', distFromPrev: 0, cumulative: 0, ete: 0, altitude: from.elevation, freq: null, lat: p.lat, lon: p.lon };
    if (i === rawPoints.length - 1) {
      const prev = rawPoints[i - 1];
      const d = haversine(prev.lat, prev.lon, p.lat, p.lon);
      cumulative += d;
      return { ident: to.code, type: 'Airport', distFromPrev: Math.round(d), cumulative: Math.round(cumulative), ete: Math.round(cumulative / cruiseGS * 60), altitude: to.elevation, freq: null, lat: p.lat, lon: p.lon };
    }
    const prev = rawPoints[i - 1];
    const d = haversine(prev.lat, prev.lon, p.lat, p.lon);
    cumulative += d;
    const nav = nearestNavaid(p.lat, p.lon, 40);
    const ident = nav ? nav.id : `WP${String(i).padStart(2, '0')}`;
    return {
      ident, type: nav ? 'VOR' : 'Fix', distFromPrev: Math.round(d), cumulative: Math.round(cumulative),
      ete: Math.round(cumulative / cruiseGS * 60), altitude: cruiseAlt, freq: nav ? nav.freq : null, lat: p.lat, lon: p.lon,
    };
  });

  // Frequencies
  const centers = [...new Set([from.center, to.center])].filter(Boolean);
  const enrouteFreqs = centers.flatMap(c => (ARTCC_FREQS[c] || []).map(f => ({ center: c, freq: f })));

  // NOTAMs / TFRs — deterministic per route
  const rand = seededRandom(`${from.code}-${to.code}`);
  const notams = [];
  if (rand() > 0.4) {
    notams.push({ id: `!${to.code.slice(1)} ${String(Math.floor(rand() * 9) + 1).padStart(2, '0')}/${String(Math.floor(rand() * 900) + 100)}`, type: 'Runway', severity: 'amber', text: `${to.code} RWY ${to.runways[1]?.id || to.runways[0].id} CLSD (mock)`, effective: 'Now → ETD +6h' });
  }
  if (rand() > 0.5) {
    const wp = waypoints[Math.min(waypoints.length - 2, Math.max(1, Math.floor(rand() * waypoints.length)))];
    notams.push({ id: `!OBST ${String(Math.floor(rand() * 900) + 100)}`, type: 'Obstruction', severity: 'amber', text: `Unlit tower near ${wp?.ident || 'route'}, up to ${Math.round(300 + rand() * 500)} ft AGL (mock)`, effective: 'Continuous' });
  }
  for (const tfr of TFR_POINTS) {
    const near = rawPoints.some(p => haversine(p.lat, p.lon, tfr.lat, tfr.lon) < tfr.nm);
    if (near) notams.push({ id: `!TFR ${String(Math.floor(rand() * 900) + 100)}`, type: 'TFR', severity: 'red', text: `${tfr.name} within ${tfr.nm} nm of route (mock)`, effective: 'ETD −1h → ETD +4h' });
  }
  if (rand() > 0.65) {
    const nav = navaids[Math.floor(rand() * navaids.length)];
    notams.push({ id: `!NAV ${String(Math.floor(rand() * 900) + 100)}`, type: 'NAVAID', severity: 'amber', text: `${nav.id} VOR OTS (mock)`, effective: 'Now → indefinite' });
  }
  if (!notams.length) notams.push({ id: '!NIL', type: 'Info', severity: 'green', text: 'No NOTAMs generated for this route (mock).', effective: '—' });

  // Airspace: MOAs the direct route passes through, with hot/cold status at ETD.
  // Sampled at a finer resolution than the display waypoints so a narrow MOA
  // isn't missed between two widely-spaced legs.
  const airspacePoints = greatCirclePoints(from, to, Math.max(20, legCount * 4));
  const airspace = {
    moas: moasAlongRoute(airspacePoints).map(moa => ({ ...moa, ...moaStatus(moa, etdDate) })),
  };

  const warnings = [];
  if (isNight) warnings.push('ETA after sunset — night currency applies');
  if (airspace.moas.some(m => m.hot)) warnings.push('Route crosses an active (hot) MOA at ETD — expect ATC routing or a course deviation');
  if (!fuelOk) warnings.push('Fuel stop recommended before destination');
  const classB = ['KSFO', 'KLAX', 'KORD', 'KJFK', 'KATL', 'KDFW', 'KDEN', 'KMIA', 'KSEA'];
  if (classB.includes(from.code) || classB.includes(to.code)) {
    warnings.push(`Class B transition: ${[from.code, to.code].filter(c => classB.includes(c)).join(' / ')}`);
  }

  return {
    distance, course: Math.round(course), magHeading, magVar: `${varValue}°${east ? 'E' : 'W'}`,
    cruiseAlt, toc: { time: tocTime, dist: Math.round(tocDist) }, tod: { time: todTime, dist: Math.round(todDist) },
    enrouteHours, etd: etdDate, eta: etaDate,
    etdLocal: fmtClock(etdDate, from.tz), etdZulu: fmtZulu(etdDate),
    etaLocal: fmtClock(etaDate, to.tz), etaZulu: fmtZulu(etaDate),
    fuel: { taxi: taxiFuel, climb: climbBurn, cruise: cruiseBurnGal, descent: descentBurn, reserve, contingency, required, usable, ok: fuelOk, reserveMinutes: isNight ? 45 : 30 },
    waypoints, frequencies: {
      departure: { atis: from.freqs.atis, gnd: from.freqs.gnd, twr: from.freqs.twr, dep: from.freqs.dep, ctaf: from.freqs.ctaf },
      enroute: enrouteFreqs,
      arrival: { atis: to.freqs.atis, app: to.freqs.app, twr: to.freqs.twr, gnd: to.freqs.gnd, ctaf: to.freqs.ctaf },
    },
    notams, warnings, fuelStop, airspace, eastbound,
  };
}
