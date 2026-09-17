import { useState } from 'react';
import { computeWeightBalance, AVERAGE_ADULT_LB } from '../data/weightBalance.js';

const CG_MIN = 33, CG_MAX = 49; // inches aft of datum, chart domain

function cgX(inches) {
  return 10 + ((inches - CG_MIN) / (CG_MAX - CG_MIN)) * 280;
}

export default function WeightBalance({ aircraft, fuelGal }) {
  const [frontPax, setFrontPax] = useState(false);
  const [rearLeftPax, setRearLeftPax] = useState(false);
  const [rearRightPax, setRearRightPax] = useState(false);

  const wb = computeWeightBalance({ aircraft, frontPax, rearLeftPax, rearRightPax, fuelGal });
  const paxCount = (frontPax ? 1 : 0) + (rearLeftPax ? 1 : 0) + (rearRightPax ? 1 : 0);
  const ok = !wb.overGross && wb.withinEnvelope;

  return <div className="wb">
    <div className="wb__seats map-layers" role="group" aria-label="Add passengers">
      <button aria-pressed={frontPax} onClick={() => setFrontPax(v => !v)}>Front passenger</button>
      <button aria-pressed={rearLeftPax} onClick={() => setRearLeftPax(v => !v)}>Rear left</button>
      <button aria-pressed={rearRightPax} onClick={() => setRearRightPax(v => !v)}>Rear right</button>
    </div>
    <p className="wb__note">Assumes {AVERAGE_ADULT_LB} lb per adult (pilot + {paxCount} passenger{paxCount === 1 ? '' : 's'}), no baggage.</p>

    <div className="mock-table-wrap"><table className="mock-table">
      <thead><tr><th>Station</th><th>Weight</th><th>Arm</th><th>Moment</th></tr></thead>
      <tbody>
        {wb.rows.filter(r => r.weight > 0).map(r => <tr key={r.label}><td>{r.label}</td><td>{r.weight.toLocaleString()} lb</td><td>{r.arm}"</td><td>{r.moment.toLocaleString()}</td></tr>)}
        <tr className="wb__total"><td>Total</td><td>{wb.totalWeight.toLocaleString()} lb</td><td>{wb.cg.toFixed(1)}"</td><td>{Math.round(wb.totalMoment).toLocaleString()}</td></tr>
      </tbody>
    </table></div>

    <svg viewBox="0 0 300 40" className="wb-cg" role="img" aria-label="Center of gravity envelope">
      <line x1="10" y1="20" x2="290" y2="20" className="wb-cg__axis" />
      <rect x={cgX(wb.fwdLimit)} y="10" width={Math.max(1, cgX(wb.aftLimit) - cgX(wb.fwdLimit))} height="20" className="wb-cg__band" />
      <circle cx={cgX(wb.cg)} cy="20" r="4" className={`wb-cg__marker ${wb.withinEnvelope ? '' : 'is-out'}`} />
      <text x={cgX(wb.fwdLimit)} y="36" textAnchor="middle">{wb.fwdLimit.toFixed(1)}"</text>
      <text x={cgX(wb.aftLimit)} y="36" textAnchor="middle">{wb.aftLimit.toFixed(1)}"</text>
    </svg>

    {ok
      ? <p className="wb__status">{wb.totalWeight.toLocaleString()} lb · within CG envelope · {(wb.maxTakeoff - wb.totalWeight).toLocaleString()} lb under max gross ({wb.maxTakeoff.toLocaleString()} lb)</p>
      : <div className="briefing-warnings">
          {wb.overGross && <p>⚠ Over max gross weight by {(wb.totalWeight - wb.maxTakeoff).toLocaleString()} lb — remove a passenger or reduce fuel</p>}
          {!wb.withinEnvelope && <p>⚠ CG at {wb.cg.toFixed(1)}" is outside the {wb.fwdLimit.toFixed(1)}"–{wb.aftLimit.toFixed(1)}" envelope</p>}
        </div>}
  </div>;
}
