import { useEffect, useRef, useState } from 'react';
import AirportPicker from '../AirportPicker.jsx';
import USMap from './USMap.jsx';
import { airports, distanceNm } from '../../data/airports.js';
import { PlaneIcon } from './icons.jsx';

export default function HeroGraphic() {
  const [departure,setDeparture]=useState('KSFO'), [destination,setDestination]=useState('KJFK');
  const [layer,setLayer]=useState('Airports'), [status,setStatus]=useState('idle');
  const timer=useRef();
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const from=airports.find(a=>a.code===departure), to=airports.find(a=>a.code===destination);
  const distance=distanceNm(from,to);
  const change=(setter,value)=>{clearTimeout(timer.current);setter(value);setStatus('idle');};
  return <div className="flight-console" id="explore">
    <div className="console-toolbar"><div className="console-brand"><PlaneIcon size={16}/> Flight workspace <span className="preview-badge">Interactive demo</span></div><span className="console-status"><i/> Ready when you are</span></div>
    <div className="console-content"><aside className="route-panel">
      <p className="label">01 / Flight planning</p><h2>Find your next horizon.</h2><p className="route-intro">Two airports. Endless possibilities.</p>
      <div className="route-pickers"><AirportPicker label="Departure" value={departure} onChange={v=>change(setDeparture,v)}/><button className="route-swap" aria-label="Swap departure and destination" onClick={()=>{change(setDeparture,destination);setDestination(departure);}}>⇅</button><AirportPicker label="Arrival" value={destination} onChange={v=>change(setDestination,v)}/></div>
      <div className="route-summary"><div><span>Direct distance</span><strong key={distance}>{distance.toLocaleString()} <small>nm</small></strong></div><div><span>Flight rules</span><strong>VFR</strong></div></div>
      <button className="btn btn--primary briefing-button" disabled={departure===destination||status==='loading'} onClick={()=>{setStatus('loading');timer.current=setTimeout(()=>setStatus('ready'),1000);}}><span className="briefing-button__label">{status==='loading'&&<span className="briefing-spinner" aria-hidden="true"/>}{status==='loading'?'Building your briefing…':'Preview briefing'}</span>{status!=='loading'&&<span className="briefing-button__icon" aria-hidden="true">↗</span>}</button><p className="demo-note">Illustrative briefing · No live flight data</p>
    </aside><div className="us-map"><div className="map-toolbar"><div className="map-layers">{['Airports','Weather'].map(x=><button key={x} aria-pressed={layer===x} onClick={()=>setLayer(x)}>{x}</button>)}</div><span className="map-country">US airport network</span></div>
      <USMap departure={departure} destination={destination} weather={layer==='Weather'} onSelect={v=>change(setDestination,v)}/>
      <div className="map-bottom"><span><i/>{layer==='Weather'?'Simulated weather conditions':'Select an airport to set your arrival'}</span><span>{to.lat.toFixed(3)}° N · {Math.abs(to.lon).toFixed(3)}° W</span></div>
      {status==='ready'&&<div className="briefing-result" role="status"><button aria-label="Close briefing" onClick={()=>setStatus('idle')}>×</button><span className="label">Your route / preview</span><h3>{departure} <span>→</span> {destination}</h3><p>{distance.toLocaleString()} nm direct · {Math.floor(distance/120)}h {Math.round(distance/120%1*60)}m at 120 kt</p><div className="briefing-lines"><span>Route overview <b>✓</b></span><span>Airport information <b>✓</b></span><span>Weather & fuel planning <b>Demo</b></span></div><p>Sample briefing. Review live weather, aircraft limits, and fuel stops before flight.</p></div>}
    </div></div>
  </div>;
}
