// FAR/AIM chat answer bank. Illustrative summaries only — always confirm
// against the current 14 CFR / AIM text at the linked eCFR section.

// ---------------------------------------------------------------------------
// KPRC (Prescott, AZ) -> KHII (Lake Havasu City, AZ) scenario data, used to
// personalize the cost-sharing and night-currency answers below with real
// numbers instead of generic FAR text. Each field is dated/sourced — treat
// this block as a snapshot, not a live feed, and re-check anything money- or
// currency-related before using it for an actual flight.
// ---------------------------------------------------------------------------
const ROUTE_KPRC_KHII = {
  from: { icao: 'KPRC', name: 'Prescott Rgnl / Ernest A. Love Field', lat: 34.6546, lon: -112.4196, elevFt: 5045 },
  to: { icao: 'KHII', name: 'Lake Havasu City Airport', lat: 34.5711, lon: -114.3580, elevFt: 783 },
  distanceNm: 96, // great-circle KPRC -> KHII
  utcOffsetHrs: -7, // Arizona: fixed MST year-round, no DST
};

const AIRCRAFT_N9281A = {
  tail: 'N9281A',
  type: '2022 Cessna 172S Skyhawk SP',
  serial: '172S12787',
  engine: 'Lycoming IO-360-L2A, 180 hp',
  // Typical 172S POH cruise-planning numbers (~65-75% power). Confirm
  // against the actual POH/performance charts in the airplane, not this file.
  cruiseKtas: 120,
  cruiseGph: 10.0,
  sourceNote: 'FAA registry via FlightAware, checked Sep 2026',
};

// Fuel price at the departure FBO. Posted prices move often — snapshot only.
const FUEL_KPRC_CUTTER = {
  fbo: 'Cutter Aviation, KPRC',
  grade: '100LL',
  selfServePerGal: 9.80,
  asOf: '2026-07-28',
  sourceNote: 'AC-U-KWIK fuel finder',
};

// Leighnor Aircraft rate sheet for N9281A (Cessna 172S), confirmed by user
// Sep 2026. "Total Hourly" is built as Dry Rate + Consumable (fuel/oil) =
// Subtotal, plus tax — i.e. this is an all-inclusive wet rate, not a dry
// rate billed on top of separately-purchased fuel.
const RENTAL_N9281A = {
  operator: 'Leighnor Aircraft',
  phone: '(928) 499-3080',
  tail: 'N9281A',
  model: 'Cessna 172S',
  dryRatePerHr: 172.00,
  consumablePerHr: 60.75,
  subtotalPerHr: 232.75,
  taxPerHr: 16.00,
  wetRatePerHr: 248.75, // Total Hourly — treat as all-inclusive (fuel included)
  confirmed: true,
  sourceNote: 'Leighnor Aircraft rate sheet, confirmed by user Sep 2026',
};

function blockHoursOneWay(route, aircraft) {
  // Cruise time plus ~0.2 hr/leg for taxi, run-up, and climb.
  return route.distanceNm / aircraft.cruiseKtas + 0.2;
}

function roundTripFuelGal(route, aircraft) {
  return blockHoursOneWay(route, aircraft) * 2 * aircraft.cruiseGph;
}

function roundTripFuelCost(route, aircraft, fuel) {
  return roundTripFuelGal(route, aircraft) * fuel.selfServePerGal;
}

// --- Sunrise/sunset (for night-currency), computed for "today" so the FAQ
// answer never goes stale. Standard almanac sunrise/sunset algorithm,
// accurate to roughly +/-1-2 minutes — fine for FAQ purposes, not a
// substitute for an official source when currency actually matters.
function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

function dayOfYear(date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start;
  return Math.floor(diff / 86400000) + 1;
}

function sunTimesLocalHrs(date, lat, lon, utcOffsetHrs) {
  const zenith = 90.833; // official sunrise/sunset, corrected for refraction + solar radius
  const N = dayOfYear(date);
  const lngHour = lon / 15;

  function compute(isRise) {
    const t = N + ((isRise ? 6 : 18) - lngHour) / 24;
    const M = (0.9856 * t) - 3.289;
    let L = M + 1.916 * Math.sin(toRad(M)) + 0.020 * Math.sin(toRad(2 * M)) + 282.634;
    L = ((L % 360) + 360) % 360;

    let RA = toDeg(Math.atan(0.91764 * Math.tan(toRad(L))));
    RA = ((RA % 360) + 360) % 360;
    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = (RA + (Lquadrant - RAquadrant)) / 15;

    const sinDec = 0.39782 * Math.sin(toRad(L));
    const cosDec = Math.cos(Math.asin(sinDec));

    const cosH = (Math.cos(toRad(zenith)) - (sinDec * Math.sin(toRad(lat)))) / (cosDec * Math.cos(toRad(lat)));
    if (cosH > 1 || cosH < -1) return null; // no sunrise/sunset that day at this latitude

    let H = isRise ? 360 - toDeg(Math.acos(cosH)) : toDeg(Math.acos(cosH));
    H = H / 15;

    const T = H + RA - (0.06571 * t) - 6.622;
    let UT = T - lngHour;
    UT = ((UT % 24) + 24) % 24;

    return ((UT + utcOffsetHrs) % 24 + 24) % 24; // local decimal hours
  }

  return { sunriseHrs: compute(true), sunsetHrs: compute(false) };
}

function addHrs(decimalHours, delta) {
  return ((decimalHours + delta) % 24 + 24) % 24;
}

function fmtClock(decimalHours) {
  if (decimalHours == null) return 'n/a';
  let h = Math.floor(decimalHours);
  let m = Math.round((decimalHours - h) * 60);
  if (m === 60) { m = 0; h += 1; }
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// Today's KPRC night-currency window: 1 hr after sunset to 1 hr before
// sunrise (14 CFR 61.57(b)). Recomputed on every load/request.
function nightCurrencyWindowKPRC(date = new Date()) {
  const { lat, lon } = ROUTE_KPRC_KHII.from;
  const { sunriseHrs, sunsetHrs } = sunTimesLocalHrs(date, lat, lon, ROUTE_KPRC_KHII.utcOffsetHrs);
  if (sunriseHrs == null || sunsetHrs == null) return null;
  return {
    sunset: fmtClock(sunsetHrs),
    sunrise: fmtClock(sunriseHrs),
    nightStart: fmtClock(addHrs(sunsetHrs, 1)),
    nightEnd: fmtClock(addHrs(sunriseHrs, -1)),
  };
}

const TODAY_KPRC_NIGHT = nightCurrencyWindowKPRC();
const RT_FUEL_GAL = roundTripFuelGal(ROUTE_KPRC_KHII, AIRCRAFT_N9281A);
const RT_FUEL_COST = roundTripFuelCost(ROUTE_KPRC_KHII, AIRCRAFT_N9281A, FUEL_KPRC_CUTTER); // reference only — Leighnor's rate already includes fuel
const RT_BLOCK_HRS = blockHoursOneWay(ROUTE_KPRC_KHII, AIRCRAFT_N9281A) * 2;
const RT_RENTAL_COST = RENTAL_N9281A.wetRatePerHr * RT_BLOCK_HRS;

export const faq = [
  {
    id: 'cost-sharing', question: 'Can I split fuel costs with my passengers?',
    keywords: ['split', 'share', 'cost', 'fuel', 'expense', 'gas', 'friend', 'passenger pay', 'compensation'],
    cite: '14 CFR § 61.113', url: 'https://www.ecfr.gov/current/title-14/section-61.113',
    summary: `Yes, under your private pilot privileges (14 CFR § 61.113) — N9281A round-trip KPRC→KHII (~${ROUTE_KPRC_KHII.distanceNm} nm, ~${RT_BLOCK_HRS.toFixed(1)} block hr) runs ≈$${RT_RENTAL_COST.toFixed(2)} at Leighnor's confirmed $${RENTAL_N9281A.wetRatePerHr.toFixed(2)}/hr wet rate; split that evenly among everyone on board, including you.`,
    bullets: [
      `Route: KPRC → KHII is ≈${ROUTE_KPRC_KHII.distanceNm} nm direct; N9281A cruises around ${AIRCRAFT_N9281A.cruiseKtas} KTAS, so each leg is ≈${blockHoursOneWay(ROUTE_KPRC_KHII, AIRCRAFT_N9281A).toFixed(1)} block hr — ≈${RT_BLOCK_HRS.toFixed(1)} hr round trip with taxi/climb`,
      `Leighnor's confirmed rate for ${RENTAL_N9281A.tail} (${RENTAL_N9281A.model}): $${RENTAL_N9281A.dryRatePerHr.toFixed(2)} dry + $${RENTAL_N9281A.consumablePerHr.toFixed(2)} consumable = $${RENTAL_N9281A.subtotalPerHr.toFixed(2)} subtotal, + $${RENTAL_N9281A.taxPerHr.toFixed(2)} tax = $${RENTAL_N9281A.wetRatePerHr.toFixed(2)}/hr all-in (fuel included — no separate pump stop needed for the flight itself)`,
      `Round-trip total: ≈${RT_BLOCK_HRS.toFixed(1)} hr × $${RENTAL_N9281A.wetRatePerHr.toFixed(2)}/hr ≈ $${RT_RENTAL_COST.toFixed(2)}`,
      `For reference, Cutter Aviation's self-serve 100LL at KPRC runs $${FUEL_KPRC_CUTTER.selfServePerGal.toFixed(2)}/gal (as of ${FUEL_KPRC_CUTTER.asOf}) — ≈$${RT_FUEL_COST.toFixed(2)} worth of gas for the trip, already folded into the $${RENTAL_N9281A.wetRatePerHr.toFixed(2)}/hr rate, so don't add it again unless you top off away from KPRC`,
      'Pro rata means an equal share per occupant (pilot included) — with 1 passenger, that\'s a 50/50 split of the ≈$' + RT_RENTAL_COST.toFixed(2) + ' total; you can charge up to that even split, never more, and never a profit',
      'This only works if the passengers share your common purpose for going to KHII — flying them there just because they asked and paid you isn\'t a private-pilot-privilege flight',
    ],
  },
  {
    id: 'night-currency', question: 'Am I current to carry passengers at night?',
    keywords: ['night', 'currency', 'passenger', 'landings', 'recent experience', 'current'],
    cite: '14 CFR § 61.57', url: 'https://www.ecfr.gov/current/title-14/section-61.57',
    summary: TODAY_KPRC_NIGHT
      ? `Tonight at KPRC, sunset is ≈${TODAY_KPRC_NIGHT.sunset} and sunrise is ≈${TODAY_KPRC_NIGHT.sunrise}, so your 3 T/Os and full-stop landings for night-passenger currency have to happen between ≈${TODAY_KPRC_NIGHT.nightStart} and ≈${TODAY_KPRC_NIGHT.nightEnd}.`
      : 'To carry passengers, you need 3 takeoffs and landings in the preceding 90 days — at night if the flight is at night.',
    bullets: TODAY_KPRC_NIGHT ? [
      `KPRC sunset ≈${TODAY_KPRC_NIGHT.sunset} local today — the § 61.57(b) definition of "night" starts 1 hr later, ≈${TODAY_KPRC_NIGHT.nightStart}`,
      `KPRC sunrise ≈${TODAY_KPRC_NIGHT.sunrise} local — your window closes 1 hr earlier, ≈${TODAY_KPRC_NIGHT.nightEnd}`,
      `Do 3 T/Os and full-stop landings (single-engine land, same category/class as N9281A) anytime in that ≈${TODAY_KPRC_NIGHT.nightStart}–${TODAY_KPRC_NIGHT.nightEnd} window and you're current to carry passengers at night for the next 90 days from that flight`,
      'These times are computed from a standard sunrise/sunset formula (±1-2 min) for KPRC\'s coordinates — cross-check against an official source (e.g. a current AF/D or apps like ForeFlight) before you rely on it for currency',
      'Day currency only needs 3 T/Os and landings (touch-and-go OK) in the preceding 90 days — no clock restriction',
    ] : ['Day currency: 3 T/Os and landings in the same category/class in the preceding 90 days', 'Night currency: same 3 T/Os and full-stop landings, but 1 hour after sunset to 1 hour before sunrise', 'Tailwheel aircraft require full-stop landings for both'],
  },
  {
    id: 'flight-review', question: 'When is my flight review due?',
    keywords: ['flight review', 'biennial', 'bfr', 'due', 'expire', 'currency'],
    cite: '14 CFR § 61.56', url: 'https://www.ecfr.gov/current/title-14/section-61.56',
    summary: 'A flight review is required every 24 calendar months to act as pilot in command.',
    bullets: ['Minimum 1 hour of flight training and 1 hour of ground training', 'Due by the end of the 24th month after your last review, or checkride', 'Some training or certificates (e.g. a new rating) can reset the clock'],
  },
  {
    id: 'vfr-minimums', question: 'What are the VFR weather minimums for my airspace?',
    keywords: ['vfr minimums', 'weather minimums', 'visibility', 'cloud clearance', 'ceiling'],
    cite: '14 CFR § 91.155', url: 'https://www.ecfr.gov/current/title-14/section-91.155',
    summary: 'VFR visibility and cloud clearance minimums vary by airspace class and altitude.',
    bullets: ['Class B: clear of clouds, 3 SM visibility', 'Class C/D/E below 10,000 MSL: 3 SM, 500 below / 1,000 above / 2,000 horizontal from clouds', 'Class G varies by day/night and altitude — check the table for your specific case'],
  },
  {
    id: 'cruising-altitude', question: 'What VFR cruising altitude should I fly?',
    keywords: ['cruising altitude', 'hemispheric', 'altitude rule', 'odd even'],
    cite: '14 CFR § 91.159', url: 'https://www.ecfr.gov/current/title-14/section-91.159',
    summary: 'VFR cruising altitude follows the hemispheric rule based on magnetic course.',
    bullets: ['Magnetic course 0–179°: odd thousands + 500 ft (e.g. 5,500)', 'Magnetic course 180–359°: even thousands + 500 ft (e.g. 6,500)', 'Applies above 3,000 ft AGL in level cruise flight'],
  },
  {
    id: 'required-equipment', question: 'What equipment is required for VFR day flight?',
    keywords: ['required equipment', 'equipment list', 'atomatoflames', 'instruments required'],
    cite: '14 CFR § 91.205', url: 'https://www.ecfr.gov/current/title-14/section-91.205',
    summary: 'Day VFR requires a specific instrument and equipment list, often remembered as ATOMATOFLAMES.',
    bullets: ['Airspeed, Tachometer, Oil pressure/temp gauges, Manifold pressure (if applicable)', 'Altimeter, Temperature gauge, Oil pressure, Fuel gauge, Landing gear indicator', 'ELT, Anti-collision lights, Magnetic compass, Engine gauges, Seat belts'],
  },
  {
    id: 'inspections', question: 'What inspection does my aircraft need?',
    keywords: ['inspection', 'annual', '100 hour', 'maintenance', 'airworthy'],
    cite: '14 CFR § 91.409', url: 'https://www.ecfr.gov/current/title-14/section-91.409',
    summary: 'Most aircraft need an annual inspection; aircraft used for hire also need a 100-hour inspection.',
    bullets: ['Annual inspection required every 12 calendar months for all aircraft', '100-hour inspection required for aircraft used to carry passengers for hire or for flight instruction for hire', 'An annual can substitute for a 100-hour, but not the reverse'],
  },
  {
    id: 'fuel-reserves', question: 'How much fuel reserve do I need for VFR?',
    keywords: ['fuel reserve', 'fuel requirement', 'reserve', '30 minute', '45 minute'],
    cite: '14 CFR § 91.151', url: 'https://www.ecfr.gov/current/title-14/section-91.151',
    summary: 'VFR flights require enough fuel to reach the destination plus a reserve — 30 minutes day, 45 minutes night.',
    bullets: ['Day VFR: fly to first point of intended landing, then 30 minutes at normal cruise', 'Night VFR: same, but 45 minutes reserve', 'Plan for normal cruising speed and expected conditions'],
  },
  {
    id: 'preflight-action', question: 'What am I required to check before every flight?',
    keywords: ['preflight action', 'preflight', 'weather briefing required', 'required preflight'],
    cite: '14 CFR § 91.103', url: 'https://www.ecfr.gov/current/title-14/section-91.103',
    summary: 'Before any flight, the pilot in command must become familiar with all available information about that flight.',
    bullets: ['Weather reports and forecasts, fuel requirements, alternatives if the flight cannot be completed', 'Runway lengths at airports of intended use', 'Takeoff and landing distance data for the aircraft and conditions'],
  },
  {
    id: 'right-of-way', question: 'Who has the right of way in the air?',
    keywords: ['right of way', 'right-of-way', 'collision avoidance', 'yield'],
    cite: '14 CFR § 91.113', url: 'https://www.ecfr.gov/current/title-14/section-91.113',
    summary: 'Right-of-way rules set priority by category, with the general rule that the aircraft to the right has the right of way.',
    bullets: ['Priority order: balloons, gliders, airships, airplanes/rotorcraft (roughly, least maneuverable first)', 'Converging aircraft of the same category: the one to the other\'s right has the right of way', 'Head-on: both alter course to the right; overtaking: pass to the right'],
  },
  {
    id: 'class-b-c', question: 'What do I need to enter Class B or Class C airspace?',
    keywords: ['class b', 'class c', 'airspace requirements', 'clearance', 'transponder'],
    cite: '14 CFR § 91.131 / § 91.130', url: 'https://www.ecfr.gov/current/title-14/section-91.131',
    summary: 'Class B requires an explicit ATC clearance; Class C requires two-way radio contact before entry.',
    bullets: ['Class B: private pilot certificate (student pilots need specific endorsements), Mode C transponder, explicit "cleared into Class B" clearance', 'Class C: establish two-way radio communication before entering', 'Both require an operating transponder with Mode C/ADS-B in most cases'],
  },
  {
    id: 'oxygen', question: 'When do I need supplemental oxygen?',
    keywords: ['oxygen', 'supplemental oxygen', 'altitude requirement', 'cabin altitude'],
    cite: '14 CFR § 91.211', url: 'https://www.ecfr.gov/current/title-14/section-91.211',
    summary: 'Supplemental oxygen requirements scale with cabin pressure altitude and duration.',
    bullets: ['12,500–14,000 ft MSL: required after 30 minutes for the required minimum crew', '14,000+ ft MSL: required at all times for required minimum crew', '15,000+ ft MSL: must be provided to each occupant'],
  },
  {
    id: 'medical-basicmed', question: 'Do I need a medical certificate, or can I fly under BasicMed?',
    keywords: ['medical', 'basicmed', 'medical certificate', 'aeromedical'],
    cite: '14 CFR § 61.23', url: 'https://www.ecfr.gov/current/title-14/section-61.23',
    summary: 'Most private pilots need a medical certificate or can qualify to fly under BasicMed instead.',
    bullets: ['BasicMed requires a comprehensive medical exam, an online course, and meeting specific aircraft/operating limits', 'Aircraft limited to 6 seats or fewer and 6,000 lb or less under BasicMed', 'A held medical certificate at any point after July 2006 is generally required to first qualify'],
  },
  {
    id: 'nontowered-ops', question: 'What are the recommended radio calls at a non-towered airport?',
    keywords: ['non-towered', 'nontowered', 'ctaf', 'unicom', 'traffic pattern calls'],
    cite: 'AIM 4-1-9', url: 'https://www.faa.gov/air_traffic/publications/atpubs/aim_html/chap4_section_1.html',
    summary: 'The AIM recommends self-announcing position and intentions on CTAF at airports without an operating tower.',
    bullets: ['Announce 10 miles out, entering downwind, base, and final', 'State airport name, position, altitude, and intentions each time', 'Monitor CTAF continuously in the traffic pattern and on the ground'],
  },
];

const SYNONYMS = { gas: 'fuel', friend: 'passenger', 'friends': 'passenger', bfr: 'flight review', due: 'expire' };

export function answer(query) {
  const words = query.toLowerCase().match(/[a-z0-9']+/g) || [];
  const norm = words.map(w => SYNONYMS[w] || w);
  let best = null, bestScore = 0;
  for (const entry of faq) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwWords = kw.split(' ');
      if (kwWords.length === 1) { if (norm.includes(kwWords[0])) score += 2; }
      else if (query.toLowerCase().includes(kw)) score += 3;
    }
    if (score > bestScore) { bestScore = score; best = entry; }
  }
  if (best && bestScore >= 2) return best;
  return null;
}

export const suggestedChips = ['cost-sharing', 'night-currency', 'vfr-minimums', 'fuel-reserves'];
