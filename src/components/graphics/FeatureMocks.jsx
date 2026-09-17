import { useState } from 'react';
import CraftSelect from '../CraftSelect.jsx';
import { outlines } from './AircraftOutlines.jsx';
import { aircraft } from '../../data/aircraft.js';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber.js';
import { CheckIcon } from './icons.jsx';

function Frame({label,children,action}) { return <div className="mock interactive-mock"><div className="mock__chrome"><span className="module-dot"/><span className="label mock__label">{label}</span><span className="module-action">{action||'Interactive preview'}</span></div>{children}</div>; }
function Tabs({items,value,onChange,label}) { return <div className="demo-tabs" role="group" aria-label={label} style={{'--tab-count':items.length,'--tab-index':items.indexOf(value)}}><span className="tab-indicator" aria-hidden="true"/>{items.map(item=><button key={item} aria-pressed={value===item} onClick={()=>onChange(item)}>{item}</button>)}</div>; }
function DetailRows({rows}) { return <dl className="profile-rows">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>; }

export function AircraftMock() {
  const [name,setName]=useState('Cessna 172S');
  const p = aircraft.find(a => a.name === name);
  const Outline = outlines[p.code];
  return <Frame label="Aircraft workspace" action="Sample profiles"><div className="demo-padding">
    <CraftSelect label="Aircraft" value={name} onChange={setName} options={aircraft.map(a=>a.name)}/>
    <Outline key={p.code} />
    <div className="profile-content content-enter" key={name}>
      <div className="panel-heading"><span className="label">{p.code} / {p.class}</span><h3>{p.name}</h3></div>
      <DetailRows rows={[
        ['Typical cruise', `${p.cruiseTAS} kt`],
        ['Typical fuel burn', `${p.cruiseBurn} gph · ${p.fuelType}`],
        ['Cabin', `${p.seats} seats`],
        ['Max takeoff weight', `${p.maxTakeoff.toLocaleString()} lb`],
        ['Service ceiling', `${p.ceiling.toLocaleString()} ft`],
        ...(p.caps ? [['Safety system', 'CAPS']] : []),
      ]}/>
    </div>
    <p className="demo-note">Sample figures. Performance varies by model and conditions.</p>
  </div></Frame>;
}

const checks=['Aircraft documents reviewed','Fuel quantity & quality checked','Control surfaces inspected','Weather briefing reviewed','Weight & balance verified'];
export function ChecklistMock(){ const [done,setDone]=useState([0,1]); const complete=done.length===checks.length; const pct=Math.round(done.length/checks.length*100); const animatedPct=useAnimatedNumber(pct, 1100); return <Frame label="Preflight flow" action={`${done.length} / ${checks.length} complete`}><div className="demo-padding"><div className="checklist-heading"><div><span className="label">Before you fly</span><h3>Ready is a process.</h3></div></div><div className="check-progress"><i style={{width:`${animatedPct}%`}}/></div><div className="interactive-checks">{checks.map((text,i)=><button key={text} role="checkbox" aria-checked={done.includes(i)} onClick={()=>setDone(done.includes(i)?done.filter(x=>x!==i):[...done,i])}><span className="check-box"><CheckIcon size={11} className="check-mark"/></span><span className="check-text">{text}</span><small>{String(i+1).padStart(2,'0')}</small></button>)}</div><div className="checklist-footer"><span aria-live="polite">{complete?'All demo checks complete.':'A little care goes a long way.'}</span><button className="checklist-reset" onClick={()=>setDone([])} disabled={!done.length}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 1 3 6.7M3 12v6h6"/></svg>Reset</button></div></div></Frame>; }

export function DebriefMock(){ const [tab,setTab]=useState('Overview'),[reviewed,setReviewed]=useState(false); return <Frame label="Post-flight reflection"><div className="demo-padding"><div className="debrief-heading"><span className="label">Flight 024 / C172</span><h3>Every flight teaches you.</h3><p>KHPN → KPOU · 42 minutes</p></div><Tabs items={['Overview','Landings','Next flight']} value={tab} onChange={setTab} label="Debrief sections"/><div className="debrief-content" key={tab}>{tab==='Overview'?<><div className="flight-bars" aria-label="Illustrative flight altitude profile">{[15,24,40,58,73,78,80,80,79,81,77,64,48,30,16,12].map((h,i)=><i key={i} style={{height:`${h}%`,'--bar-delay':`${i*25}ms`}}/>)}</div><span className="label">A steady flight, from climb to cruise.</span><p>Your sample flight maintained a consistent cruise altitude. Review the approach to find your next improvement.</p></>:tab==='Landings'?<><div className="debrief-score">3 <small>landings reviewed</small></div><p>Centerline tracking looked consistent. Aim for a more stable airspeed on the final approach.</p></>:<><div className="debrief-score">01 <small>focus for next time</small></div><p>Brief your target approach speed before departure. Practice a stable descent with a consistent configuration.</p></>}</div><button className="demo-link" onClick={()=>setReviewed(!reviewed)}>{reviewed?'✓ Reflection saved':'Save reflection'}<span>↗</span></button><p className="demo-note">Sample analysis, no flight has been uploaded.</p></div></Frame>; }
