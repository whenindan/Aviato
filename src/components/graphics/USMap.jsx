import { useState } from 'react';
import geography from '../../data/us-states.json';
import { airports } from '../../data/airports.js';

// Albers equal-area conic projection, shared by boundaries and airport coordinates.
const rad = Math.PI/180, n = (Math.sin(29.5*rad)+Math.sin(45.5*rad))/2;
const c = Math.cos(29.5*rad)**2 + 2*n*Math.sin(29.5*rad);
const rho0 = Math.sqrt(c-2*n*Math.sin(38*rad))/n;
function raw(lon, lat) { const rho = Math.sqrt(c-2*n*Math.sin(lat*rad))/n, theta = n*(lon+96)*rad; return [rho*Math.sin(theta), rho0-rho*Math.cos(theta)]; }
const states = geography.features.filter(f => !['Alaska','Hawaii','Puerto Rico'].includes(f.properties.name));
const points = states.flatMap(f => f.geometry.coordinates.flat(f.geometry.type === 'MultiPolygon' ? 2 : 1)).map(([lon,lat]) => raw(lon,lat));
const minX = Math.min(...points.map(p=>p[0])), maxX = Math.max(...points.map(p=>p[0])), minY = Math.min(...points.map(p=>p[1])), maxY = Math.max(...points.map(p=>p[1]));
const scale = Math.min(840/(maxX-minX), 460/(maxY-minY));
export function project(lon, lat) { const [x,y] = raw(lon,lat); return [450+(x-(minX+maxX)/2)*scale,260-(y-(minY+maxY)/2)*scale]; }
const paths = states.map(f => ({ name:f.properties.name, d:(f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map(poly => poly.map(ring => ring.map(([lon,lat],i) => `${i?'L':'M'}${project(lon,lat).map(v=>v.toFixed(2)).join(',')}`).join(' ')+'Z').join(' ')).join(' ') }));

export default function USMap({ departure, destination, onSelect, weather = false }) {
  const [zoom, setZoom] = useState(1);
  const selected = airports.find(a=>a.code===destination);
  const from = airports.find(a=>a.code===departure);
  const visibleAirports = airports.filter((a,i)=>i<9 || a.code===destination || a.code===departure);
  const [cx,cy] = selected ? project(selected.lon,selected.lat) : [450,260];
  const [fx,fy] = from ? project(from.lon,from.lat) : [cx,cy];
  return <div className="geographic-map">
    <svg viewBox="0 0 900 520" aria-label="United States airport map, contiguous states" className="geographic-svg">
      <g style={{transform: `translate(${zoom > 1 ? 450-cx*zoom : 0}px, ${zoom > 1 ? 260-cy*zoom : 0}px) scale(${zoom})`}} className="map-geography">
        {paths.map(s=><path key={s.name} d={s.d} className="state-outline"><title>{s.name}</title></path>)}
        {from && selected && from.code !== selected.code && <path key={`${departure}-${destination}`} d={`M${fx},${fy} Q${(fx+cx)/2},${Math.min(fy,cy)-65} ${cx},${cy}`} className="geo-route" />}
        {visibleAirports.map((a,i) => { const [x,y]=project(a.lon,a.lat); const active = a.code===destination || a.code===departure; const showLabel = active || !selected || Math.hypot(x-cx,y-cy)>28; return <g key={a.code} transform={`translate(${x},${y})`} className={`geo-airport${active?' is-active':''}`} role="button" tabIndex="0" aria-label={`Select ${a.city} as destination`} onClick={()=>onSelect(a.code)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(a.code);}}}>
          <circle r="15" className="geo-hit"/><circle r="10" className="geo-halo"/><circle r={active ? 4 : 2.8} className="geo-point"/>
          <text className={showLabel ? '' : 'is-hidden'} x={a.lon > -80 ? -10 : 10} y={-10} textAnchor={a.lon > -80 ? 'end' : 'start'}>{a.code}</text>
          {weather && <text className="geo-weather" x="0" y="22" textAnchor="middle">{i%3 ? 'VFR' : 'MVFR'}</text>}
        </g>; })}
      </g>
    </svg>
    <div className="geo-controls"><button aria-label="Zoom in map" disabled={zoom===2} onClick={()=>setZoom(Math.min(2,zoom+.5))}>+</button><button aria-label="Zoom out map" disabled={zoom===1} onClick={()=>setZoom(Math.max(1,zoom-.5))}>−</button><button aria-label="Reset map view" onClick={()=>setZoom(1)}>⌖</button></div>
    <span className="geo-caption">Albers projection · Contiguous US</span>
  </div>;
}
