import { useRef, useState } from 'react';
import { pastFlights, pendingTrack, detectFlight } from '../../data/logbook.js';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber.js';
import { CheckIcon } from './icons.jsx';

function Frame({ label, children, action }) {
  return <div className="mock interactive-mock"><div className="mock__chrome"><span className="module-dot" /><span className="label mock__label">{label}</span><span className="module-action">{action || 'Interactive preview'}</span></div>{children}</div>;
}

const SYNC_STEPS = [
  'Querying ADS-B feed for N172SP…',
  'Detected 1 flight · KHPN → KPOU',
  'Parsed takeoffs, landings & hours from track',
];

export default function LogbookMock() {
  const [flights, setFlights] = useState(pastFlights);
  const [autoLog, setAutoLog] = useState(true);
  const [syncStep, setSyncStep] = useState(-1);
  const [synced, setSynced] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detection, setDetection] = useState(null);
  const timers = useRef([]);

  const totalHours = flights.reduce((s, f) => s + f.hours, 0);
  const landingsDay = flights.reduce((s, f) => s + f.landingsDay, 0);
  const landingsNight = flights.reduce((s, f) => s + f.landingsNight, 0);
  const takeoffs = flights.reduce((s, f) => s + f.takeoffs, 0);

  const animHours = useAnimatedNumber(totalHours, 900);
  const animLandDay = useAnimatedNumber(landingsDay, 900);
  const animLandNight = useAnimatedNumber(landingsNight, 900);
  const animTakeoffs = useAnimatedNumber(takeoffs, 900);

  const runSync = () => {
    if (synced || syncStep >= 0) return;
    timers.current.forEach(clearTimeout);
    setSyncStep(0);
    timers.current = [
      setTimeout(() => setSyncStep(1), 900),
      setTimeout(() => setSyncStep(2), 1700),
      setTimeout(() => {
        const d = detectFlight(pendingTrack);
        setDetection(d);
        setFlights(fs => [...fs, {
          date: pendingTrack.date, tail: pendingTrack.tail, type: pendingTrack.type,
          from: pendingTrack.from, to: pendingTrack.to, route: 'Direct',
          blockOut: '—', blockIn: '—', hours: d.hours,
          landingsDay: d.landingsDay, landingsNight: d.landingsNight, takeoffs: d.takeoffs, source: 'ADS-B', justAdded: true,
        }]);
        setSyncStep(-1);
        setSynced(true);
      }, 2400),
    ];
  };

  const track = pendingTrack.points;
  const maxAlt = Math.max(...track.map(p => p.alt));
  const maxGs = Math.max(...track.map(p => p.gs));

  return <Frame label="Flight logbook" action={`${flights.length} flights logged`}>
    <div className="demo-padding">
      <div className="logbook-stats">
        <div><span>Total hours</span><strong>{animHours.toFixed(1)}</strong></div>
        <div><span>Landings (day)</span><strong>{Math.round(animLandDay)}</strong></div>
        <div><span>Landings (night)</span><strong>{Math.round(animLandNight)}</strong></div>
        <div><span>Takeoffs</span><strong>{Math.round(animTakeoffs)}</strong></div>
      </div>

      <div className="logbook-toolbar">
        <label className="logbook-toggle">
          <button role="switch" aria-checked={autoLog} onClick={() => setAutoLog(a => !a)}><i /></button>
          Auto-log from ADS-B
        </label>
        <button className="demo-link logbook-sync" disabled={syncStep >= 0 || synced} onClick={runSync}>
          {synced ? '✓ Synced' : syncStep >= 0 ? 'Syncing…' : 'Sync ADS-B'}<span>{synced ? '' : '↻'}</span>
        </button>
      </div>

      {syncStep >= 0 && <ol className="logbook-sync-timeline" aria-live="polite">
        {SYNC_STEPS.map((s, i) => <li key={s} className={i <= syncStep ? 'is-active' : ''}>{i < syncStep ? <CheckIcon size={11} /> : <span className="logbook-sync-dot" />}{s}</li>)}
      </ol>}

      {detection && synced && <div className="logbook-track">
        <span className="label">Detected track · N172SP</span>
        <svg viewBox="0 0 200 46" className="logbook-track__svg" aria-hidden="true">
          <polyline points={track.map((p, i) => `${(i / (track.length - 1)) * 200},${46 - (p.alt / maxAlt) * 40}`).join(' ')} className="logbook-track__alt" />
          <polyline points={track.map((p, i) => `${(i / (track.length - 1)) * 200},${46 - (p.gs / maxGs) * 40}`).join(' ')} className="logbook-track__gs" />
        </svg>
        <div className="logbook-track__legend"><span><i className="is-alt" />Altitude</span><span><i className="is-gs" />Groundspeed</span></div>
      </div>}

      <div className="logbook-table-wrap">
        <table className="mock-table">
          <thead><tr><th>Date</th><th>Route</th><th>Hrs</th><th>Ldg D/N</th><th>Source</th><th /></tr></thead>
          <tbody>
            {flights.slice().reverse().map((f, i) => {
              const key = `${f.date}-${f.from}-${f.to}-${i}`;
              return editing === key ? (
                <tr key={key} className="is-editing">
                  <td>{f.date}</td>
                  <td>{f.from} → {f.to}</td>
                  <td><input type="number" step="0.1" defaultValue={f.hours} aria-label="Edit hours" onBlur={e => {
                    const hours = parseFloat(e.target.value) || f.hours;
                    setFlights(fs => fs.map(x => x === f ? { ...x, hours, source: 'Manual' } : x));
                    setEditing(null);
                  }} autoFocus /></td>
                  <td>{f.landingsDay}/{f.landingsNight}</td>
                  <td>Manual</td>
                  <td><button aria-label="Done editing" onClick={() => setEditing(null)}><CheckIcon size={11} /></button></td>
                </tr>
              ) : (
                <tr key={key} className={f.justAdded ? 'is-new' : ''}>
                  <td>{f.date}</td>
                  <td>{f.from} → {f.to}</td>
                  <td>{f.hours.toFixed(1)}</td>
                  <td>{f.landingsDay}/{f.landingsNight}</td>
                  <td><span className={`logbook-chip logbook-chip--${f.source.toLowerCase().replace('-', '')}`}>{f.source === 'ADS-B' && <CheckIcon size={9} />}{f.source}</span></td>
                  <td><button className="logbook-edit" aria-label={`Edit ${f.date} flight`} onClick={() => setEditing(key)}>✎</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="demo-note">Simulated ADS-B feed. Logbook entries must be verified by the pilot.</p>
    </div>
  </Frame>;
}
