import SectionalMap from './graphics/SectionalMap.jsx';
import WeightBalance from './WeightBalance.jsx';

function DetailRows({ rows }) {
  return <dl className="profile-rows">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

const SEV_LABEL = { red: 'TFR', amber: 'Notice', green: 'Info' };

export default function BriefingPanel({ briefing, departure, destination, aircraft, aircraftName, onClose }) {
  if (!briefing) return null;
  const b = briefing;
  return <div className="briefing-panel" role="region" aria-label="Flight briefing">
    <div className="briefing-panel__header">
      <div>
        <span className="label">Illustrative briefing</span>
        <h3>{departure} <span>→</span> {destination}</h3>
        <p>{aircraftName} · ETD {b.etdLocal} ({b.etdZulu}) → ETA {b.etaLocal} ({b.etaZulu}) · {b.distance} nm · FL{Math.round(b.cruiseAlt / 100)}</p>
      </div>
      <button aria-label="Close briefing" onClick={onClose}>×</button>
    </div>

    <div className="briefing-panel__section briefing-altitude">
      <span className="label">VFR cruising altitude</span>
      <p>Magnetic course {b.magHeading}° ({b.eastbound ? 'eastbound' : 'westbound'}) → {b.eastbound ? 'odd' : 'even'} thousand + 500 ft = <strong>{b.cruiseAlt.toLocaleString()} ft</strong>.</p>
      <p className="demo-note">Hemispheric rule — 14 CFR § 91.159</p>
    </div>

    <div className="briefing-panel__section">
      <span className="label">Climb / cruise / descent</span>
      <div className="briefing-profile__meta">
        <span>TOC <strong>{b.toc.dist} nm</strong> · {Math.round(b.toc.time * 60)} min</span>
        <span>Cruise <strong>{b.cruiseAlt.toLocaleString()} ft</strong></span>
        <span>TOD <strong>{b.tod.dist} nm</strong> · {Math.round(b.tod.time * 60)} min</span>
      </div>
    </div>

    <details className="briefing-panel__section briefing-more">
      <summary>Show full briefing</summary>

      <div className="briefing-panel__section briefing-panel__airports">
        {[{ code: departure, label: 'Departure' }, { code: destination, label: 'Arrival' }].map(({ code, label }) => (
          <div key={code} className="briefing-airport">
            <span className="label">{label} · {code}</span>
            <SectionalMap departure={departure} destination={destination} focus={code} interactive={false} height="140px" />
          </div>
        ))}
      </div>

      <div className="briefing-panel__section briefing-panel__freqs">
        <div><span className="label">Departure</span><DetailRows rows={[['ATIS', b.frequencies.departure.atis || '—'], ['Ground', b.frequencies.departure.gnd || '—'], ['Tower', b.frequencies.departure.twr || b.frequencies.departure.ctaf || '—'], ['Departure', b.frequencies.departure.dep || '—']]} /></div>
        <div><span className="label">En route</span><DetailRows rows={b.frequencies.enroute.length ? b.frequencies.enroute.map(f => [f.center, f.freq]) : [['—', '—']]} /></div>
        <div><span className="label">Arrival</span><DetailRows rows={[['ATIS', b.frequencies.arrival.atis || '—'], ['Approach', b.frequencies.arrival.app || '—'], ['Tower', b.frequencies.arrival.twr || b.frequencies.arrival.ctaf || '—'], ['Ground', b.frequencies.arrival.gnd || '—']]} /></div>
      </div>

      <div className="briefing-panel__section">
        <span className="label">Fuel</span>
        <DetailRows rows={[
          ['Taxi / run-up', `${b.fuel.taxi.toFixed(1)} gal`],
          ['Climb', `${b.fuel.climb.toFixed(1)} gal`],
          ['Cruise', `${b.fuel.cruise.toFixed(1)} gal`],
          ['Descent', `${b.fuel.descent.toFixed(1)} gal`],
          [`Reserve (${b.fuel.reserveMinutes} min)`, `${b.fuel.reserve.toFixed(1)} gal`],
          ['Contingency (10%)', `${b.fuel.contingency.toFixed(1)} gal`],
          ['Required / Usable', `${b.fuel.required.toFixed(1)} / ${b.fuel.usable} gal`],
        ]} />
        <div className="briefing-fuel-bar"><i style={{ width: `${Math.min(100, (b.fuel.required / b.fuel.usable) * 100)}%` }} className={b.fuel.ok ? '' : 'is-over'} /></div>
      </div>

      <div className="briefing-panel__section">
        <span className="label">Airspace · MOAs</span>
        {b.airspace.moas.length
          ? <ul className="briefing-notams">{b.airspace.moas.map(m => <li key={m.id}><i className={`briefing-sev briefing-sev--${m.hot ? 'red' : 'green'}`} />{m.name} · {m.hot ? 'HOT' : 'COLD'} — {m.floor} to {m.ceiling} <small>{m.hoursText}</small></li>)}</ul>
          : <p className="demo-note">Direct route clears all charted MOAs (mock).</p>}
      </div>

      {aircraft?.wb && <div className="briefing-panel__section">
        <span className="label">Passengers &amp; weight and balance</span>
        <WeightBalance aircraft={aircraft} fuelGal={b.fuel.required} />
      </div>}

      <div className="briefing-panel__section">
        <span className="label">NOTAMs / TFRs</span>
        <ul className="briefing-notams">{b.notams.map(n => <li key={n.id}><i className={`briefing-sev briefing-sev--${n.severity}`} />{n.id} · {SEV_LABEL[n.severity]} — {n.text} <small>{n.effective}</small></li>)}</ul>
      </div>

      <div className="briefing-panel__section">
        <span className="label">Waypoints</span>
        <div className="mock-table-wrap"><table className="mock-table">
          <thead><tr><th>Ident</th><th>Type</th><th>Dist</th><th>Cum.</th><th>ETE</th><th>Alt</th><th>Freq</th></tr></thead>
          <tbody>{b.waypoints.map(w => <tr key={w.ident + w.cumulative}><td>{w.ident}</td><td>{w.type}</td><td>{w.distFromPrev} nm</td><td>{w.cumulative} nm</td><td>{w.ete} min</td><td>{w.altitude.toLocaleString()} ft</td><td>{w.freq || '—'}</td></tr>)}</tbody>
        </table></div>
      </div>

      {!!b.warnings.length && <div className="briefing-panel__section briefing-warnings">
        {b.warnings.map(w => <p key={w}>⚠ {w}</p>)}
      </div>}

      <p className="demo-note">Sample briefing. Review live weather, aircraft limits, and fuel stops before flight.</p>
    </details>
  </div>;
}
