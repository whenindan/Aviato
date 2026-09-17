// FAR/AIM chat answer bank. Illustrative summaries only — always confirm
// against the current 14 CFR / AIM text at the linked eCFR section.
export const faq = [
  {
    id: 'cost-sharing', question: 'Can I split fuel costs with my passengers?',
    keywords: ['split', 'share', 'cost', 'fuel', 'expense', 'gas', 'friend', 'passenger pay', 'compensation'],
    cite: '14 CFR § 61.113', url: 'https://www.ecfr.gov/current/title-14/section-61.113',
    summary: 'A private pilot may share the direct operating expenses of a flight with passengers, within limits.',
    bullets: ['Passengers must share a common purpose with the pilot for the flight', 'The pilot must pay at least a pro rata share, including fuel, oil, airport, and rental costs', 'Holding out to the public or acting as an air carrier is not allowed under this privilege'],
  },
  {
    id: 'night-currency', question: 'Am I current to carry passengers at night?',
    keywords: ['night', 'currency', 'passenger', 'landings', 'recent experience', 'current'],
    cite: '14 CFR § 61.57', url: 'https://www.ecfr.gov/current/title-14/section-61.57',
    summary: 'To carry passengers, you need 3 takeoffs and landings in the preceding 90 days — at night if the flight is at night.',
    bullets: ['Day currency: 3 T/Os and landings in the same category/class in the preceding 90 days', 'Night currency: same 3 T/Os and full-stop landings, but 1 hour after sunset to 1 hour before sunrise', 'Tailwheel aircraft require full-stop landings for both'],
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
