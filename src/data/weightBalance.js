// Pure weight & balance calculation for the passenger demo. Uses a single
// illustrative average-adult weight and assumes no baggage/luggage.
export const AVERAGE_ADULT_LB = 190; // illustrative standard-adult assumption, no luggage

export function computeWeightBalance({ aircraft, frontPax, rearLeftPax, rearRightPax, fuelGal }) {
  const wb = aircraft.wb;
  const fuelWeight = Math.min(fuelGal, aircraft.usableFuel) * wb.fuelLbPerGal;
  const rearCount = (rearLeftPax ? 1 : 0) + (rearRightPax ? 1 : 0);

  const rows = [
    { label: 'Empty aircraft', weight: wb.emptyWeight, arm: wb.emptyWeightArm },
    { label: 'Pilot (front)', weight: AVERAGE_ADULT_LB, arm: wb.stations.front.arm },
    { label: 'Front passenger', weight: frontPax ? AVERAGE_ADULT_LB : 0, arm: wb.stations.front.arm },
    { label: 'Rear passengers', weight: rearCount * AVERAGE_ADULT_LB, arm: wb.stations.rear.arm },
    { label: 'Fuel', weight: Math.round(fuelWeight * 10) / 10, arm: wb.fuelArm },
  ].map(r => ({ ...r, moment: Math.round(r.weight * r.arm) }));

  const totalWeight = Math.round(rows.reduce((s, r) => s + r.weight, 0) * 10) / 10;
  const totalMoment = rows.reduce((s, r) => s + r.moment, 0);
  const cg = totalMoment / totalWeight;

  const [lo, hi] = wb.envelope;
  const f = Math.min(1, Math.max(0, (totalWeight - lo.weight) / (hi.weight - lo.weight)));
  const fwdLimit = lo.fwd + f * (hi.fwd - lo.fwd);
  const aftLimit = lo.aft + f * (hi.aft - lo.aft);
  const withinEnvelope = cg >= fwdLimit && cg <= aftLimit;
  const overGross = totalWeight > aircraft.maxTakeoff;

  return { rows, totalWeight, totalMoment, cg, fwdLimit, aftLimit, withinEnvelope, overGross, maxTakeoff: aircraft.maxTakeoff };
}
