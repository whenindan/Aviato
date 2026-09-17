import { useEffect, useRef, useState } from 'react';
import SectionalMap from './SectionalMap.jsx';
import BriefingPanel from '../BriefingPanel.jsx';
import { airports, distanceNm } from '../../data/airports.js';
import { findAircraft } from '../../data/aircraft.js';
import { buildBriefing, greatCirclePoints } from '../../data/briefing.js';
import { moasAlongRoute, moaStatus } from '../../data/moas.js';
import { PlaneIcon } from './icons.jsx';

const CRAFT = 'C172';
const DEPARTURE = 'KPRC';
const DESTINATION = 'KHII';

function nextHour() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return `${String(d.getHours()).padStart(2, '0')}:00`;
}

function etdToDate(etd) {
  const [h, m] = etd.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatEtd(etd) {
  const [h, m] = etd.split(':').map(Number);
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function HeroGraphic() {
  const [status, setStatus] = useState('idle');
  const etd = useRef(nextHour()).current; // fixed at mount — not user-editable
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const from = airports.find(a => a.code === DEPARTURE), to = airports.find(a => a.code === DESTINATION);
  const distance = distanceNm(from, to);
  const selectedAircraft = findAircraft(CRAFT);
  const briefing = status === 'ready' ? buildBriefing({ from, to, aircraft: selectedAircraft, etd }) : null;

  const routeMoas = moasAlongRoute(greatCirclePoints(from, to, 20))
    .map(moa => ({ ...moa, ...moaStatus(moa, etdToDate(etd)) }));

  return <div className="flight-console" id="explore">
    <div className="console-toolbar"><div className="console-brand"><PlaneIcon size={16}/> Flight workspace <span className="preview-badge">Interactive demo</span></div><span className="console-status"><i/> Ready when you are</span></div>
    <div className="console-content"><aside className="route-panel">
      <p className="label">01 / Flight planning</p><h2>Prescott to Lake Havasu City.</h2><p className="route-intro">One VFR route, worked end to end.</p>
      <div className="route-locked">
        <div className="route-locked__item"><span className="picker-label">Departure</span><span className="picker-code">{DEPARTURE}</span><span className="picker-city">{from.city}, AZ</span></div>
        <div className="route-locked__item"><span className="picker-label">Arrival</span><span className="picker-code">{DESTINATION}</span><span className="picker-city">{to.city}, AZ</span></div>
      </div>
      <div className="route-locked__item route-locked__etd">
        <span className="picker-label">ETD</span>
        <span className="route-locked__etd-value"><span className="route-locked__time">{formatEtd(etd)}</span><span className="picker-city">{from.tz.split('/').pop().replace('_', ' ')}</span></span>
      </div>
      <p className="route-craft">Aircraft <strong>{selectedAircraft.name}</strong></p>
      <div className="route-summary"><div><span>Direct distance</span><strong key={distance}>{distance.toLocaleString()} <small>nm</small></strong></div><div><span>Flight rules</span><strong>VFR</strong></div></div>
      <button className="btn btn--primary briefing-button" disabled={status === 'loading'} onClick={() => { setStatus('loading'); timer.current = setTimeout(() => setStatus('ready'), 1000); }}><span className="briefing-button__label">{status === 'loading' && <span className="briefing-spinner" aria-hidden="true"/>}{status === 'loading' ? 'Building your briefing…' : 'Preview briefing'}</span>{status !== 'loading' && <span className="briefing-button__icon" aria-hidden="true">↗</span>}</button><p className="demo-note">Illustrative briefing · No live flight data</p>
    </aside><div className="us-map">
      <SectionalMap departure={DEPARTURE} destination={DESTINATION} waypoints={briefing?.waypoints} moas={briefing?.airspace.moas ?? routeMoas} focus="route" />
      <div className="map-bottom"><span><i/>FAA VFR Sectional · ArcGIS</span><span>{to.lat.toFixed(3)}° N · {Math.abs(to.lon).toFixed(3)}° W</span></div>
    </div></div>
    {status === 'ready' && <BriefingPanel briefing={briefing} departure={DEPARTURE} destination={DESTINATION} aircraft={selectedAircraft} aircraftName={selectedAircraft.name} onClose={() => setStatus('idle')} />}
  </div>;
}
