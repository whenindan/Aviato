import { useEffect, useRef, useState } from 'react';
import { airports, distanceNm } from '../../data/airports.js';
import USMap from './USMap.jsx';
import { CheckIcon } from './icons.jsx';

function Frame({label,children,action}) { return <div className="mock interactive-mock"><div className="mock__chrome"><span className="module-dot"/><span className="label mock__label">{label}</span><span className="module-action">{action||'Interactive preview'}</span></div>{children}</div>; }
// Glides smoothly toward `target` instead of jump-cutting, so a progress
// readout climbs or falls in view rather than snapping between two values.
function useAnimatedNumber(target, duration = 450) {
  const [value, setValue] = useState(target);
  const frame = useRef(), from = useRef(target);
  useEffect(() => {
    cancelAnimationFrame(frame.current);
    // Honor reduced-motion by shortening the animation, not deleting it —
    // this is direct feedback on a click, not decorative motion.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const runDuration = reduced ? duration * 0.3 : duration;
    const start = performance.now(), startValue = from.current;
    // Ease-in-out: gentle at both ends instead of springing off fast, which
    // is what read as "too fast" even after the overall duration grew.
    const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / runDuration);
      const eased = easeInOutCubic(t);
      const next = startValue + (target - startValue) * eased;
      setValue(t < 1 ? next : target);
      if (t < 1) frame.current = requestAnimationFrame(tick); else from.current = target;
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return value;
}
function CraftSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null), trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return <div className="craft-select" ref={root}>
    <span className="craft-select__label">{label}</span>
    <button type="button" ref={trigger} className="craft-select__trigger" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)}>
      <span>{value}</span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className="craft-select__chevron"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    {open && <div className="craft-select__menu" role="listbox" aria-label={label}>
      {options.map(o => <button type="button" role="option" aria-selected={o === value} key={o} className={o === value ? 'is-selected' : ''} onClick={() => { onChange(o); setOpen(false); }}>
        {o}{o === value && <CheckIcon size={11}/>}
      </button>)}
    </div>}
  </div>;
}
function Tabs({items,value,onChange,label}) { return <div className="demo-tabs" role="group" aria-label={label} style={{'--tab-count':items.length,'--tab-index':items.indexOf(value)}}><span className="tab-indicator" aria-hidden="true"/>{items.map(item=><button key={item} aria-pressed={value===item} onClick={()=>onChange(item)}>{item}</button>)}</div>; }
function AircraftDrawing({code}) { return <div className="aircraft-blueprint"><svg viewBox="0 0 320 150" fill="none" aria-label={`${code} stylized aircraft plan view`} role="img"><path className="blueprint-guide" d="M20 75h280M160 10v130M45 115h230"/><g className="blueprint-plane"><path d="M160 17c-6 0-9 13-9 26v15L48 82v12l104-8 3 32-29 12v8l34-5 34 5v-8l-29-12 3-32 104 8V82L169 58V43c0-13-3-26-9-26Z" fill="var(--raised)" stroke="currentColor" strokeWidth="1.5"/><path d="M153 47h14M160 23v99M57 85l95-13m16 0 95 13M144 31h32" stroke="currentColor" strokeOpacity=".5"/></g><text x="20" y="25">{code}</text><text x="225" y="140">PLAN VIEW / DEMO</text></svg></div>; }
function DetailRows({rows}) { return <dl className="profile-rows">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>; }


export function MapMock() {
  const [code,setCode]=useState('KHPN'),[query,setQuery]=useState(''),[saved,setSaved]=useState([]);
  const a=airports.find(a=>a.code===code);
  const results=airports.filter(a=>`${a.code} ${a.city} ${a.name}`.toLowerCase().includes(query.toLowerCase()));
  return <Frame label="Airport explorer" action={`${airports.length} airports to explore`}><div className="airport-explorer"><div className="explorer-sidebar"><label className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Search airport directory" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find an airport…"/></label><div className="airport-directory">{results.map(a=><button key={a.code} aria-pressed={code===a.code} onClick={()=>setCode(a.code)}><span><strong>{a.code}</strong><small>{a.city}</small></span><span>↗</span></button>)}{!results.length&&<p className="empty-state">No airports found.</p>}</div></div><div className="explorer-main"><USMap destination={code} onSelect={setCode}/><div className="airport-detail" key={code}><div className="detail-heading"><div><span className="label">Airport profile</span><h3>{a.code} <span>{a.city}</span></h3></div><button className="save-airport" aria-label={`${saved.includes(code)?'Unsave':'Save'} ${code}`} aria-pressed={saved.includes(code)} onClick={()=>setSaved(saved.includes(code)?saved.filter(x=>x!==code):[...saved,code])}>{saved.includes(code)?'★ Saved':'☆ Save'}</button></div><p>{a.name}</p><div className="detail-metrics"><div><span>Elevation</span><strong>{a.elevation.toLocaleString()} <small>ft</small></strong></div><div><span>Latitude</span><strong>{a.lat.toFixed(3)}°</strong></div><div><span>Longitude</span><strong>{a.lon.toFixed(3)}°</strong></div></div></div></div></div></Frame>;
}

const profiles = {
  'Cessna 172': {code:'C172', cruise:122, range:640, seats:4, fuel:8.5},
  'Piper Archer': {code:'PA28', cruise:128, range:522, seats:4, fuel:9.5},
  'Cessna 182': {code:'C182', cruise:145, range:915, seats:4, fuel:12.5},
};
export function AircraftMock() {
  const [name,setName]=useState('Cessna 172'),[view,setView]=useState('Overview'); const p=profiles[name];
  return <Frame label="Aircraft workspace" action="Sample profile"><div className="demo-padding"><CraftSelect label="Aircraft" value={name} onChange={setName} options={Object.keys(profiles)}/><AircraftDrawing key={p.code} code={p.code}/><Tabs items={['Overview','POH index','Preflight']} value={view} onChange={setView} label="Aircraft information"/><div className="profile-content content-enter" key={name+view}>{view==='Overview'?<><div className="panel-heading"><span className="label">{p.code} / Single engine</span><h3>{name}</h3></div><DetailRows rows={[["Typical cruise",`${p.cruise} kt`],["Typical fuel burn",`${p.fuel} gph`],["Cabin",`${p.seats} seats`]]}/></>:view==='POH index'?<><div className="panel-heading"><span className="label">Find the right chapter</span><h3>A place for every answer.</h3></div><DetailRows rows={[["Section 2","Limitations"],["Section 3","Emergency procedures"],["Section 5","Performance charts"]]}/></>:<><div className="panel-heading"><span className="label">Prepare your profile</span><h3>Know the airplane you’ll fly.</h3></div><DetailRows rows={[["01","Match model and year"],["02","Review aircraft-specific POH"],["03","Confirm loading and conditions"]]}/></>}</div><p className="demo-note">Sample figures. Performance varies by model and conditions.</p></div></Frame>;
}

const topics={
  'Privileges': {cite:'61.113',title:'Sharing a flight with friends?',body:'Find the private pilot rules relevant to sharing expenses with passengers.',notes:['Passenger cost sharing','Compensation and operating limitations'],source:'https://www.ecfr.gov/current/title-14/section-61.113'},
  'Currency': {cite:'61.57',title:'Ready to carry passengers?',body:'Bring recent experience requirements into your preflight research.',notes:['Passenger and night currency','Instrument experience'],source:'https://www.ecfr.gov/current/title-14/section-61.57'},
  'Maintenance': {cite:'91.409',title:'What inspection is due next?',body:'Start with the inspection rule, then review the records for your aircraft.',notes:['Inspection applicability','Aircraft logbook review'],source:'https://www.ecfr.gov/current/title-14/section-91.409'}
};
export function RegMock(){ const [topic,setTopic]=useState('Privileges'),[saved,setSaved]=useState([]); const t=topics[topic],isSaved=saved.includes(topic); return <Frame label="Reference desk" action={`${saved.length} saved`}><div className="demo-padding"><Tabs items={Object.keys(topics)} value={topic} onChange={setTopic} label="Regulation topics"/><div className="reference-page content-enter" key={topic}><div className="reference-source"><span>14 CFR</span><span>§ {t.cite}</span></div><h3>{t.title}</h3><p>{t.body}</p><div className="reference-topics"><span className="label">In this reference</span>{t.notes.map(n=><div key={n}><span>↳</span>{n}</div>)}</div><a className="source-link" href={t.source} target="_blank" rel="noreferrer">Read the official regulation <span>↗</span></a></div><button className="demo-link" aria-pressed={isSaved} onClick={()=>setSaved(isSaved?saved.filter(x=>x!==topic):[...saved,topic])}>{isSaved?'✓ Saved to flight notes':'＋ Save to flight notes'}<span>{isSaved?'−':'→'}</span></button><div className="saved-notes" aria-live="polite">{saved.length?`Flight notes · ${saved.map(x=>'§ '+topics[x].cite).join(' / ')}`:'Keep useful references together for your next briefing.'}</div></div></Frame>; }

const lessons={Instrument:{label:'Approach preparation',title:'Build your approach briefing.',question:'You’re preparing for an unfamiliar approach. Where do you start?',options:['Review the chart and brief the procedure','Wait until the final approach'],answer:0,explanation:'A useful briefing connects the chart, navigation setup, and missed approach plan before the workload increases.',steps:['Review the procedure','Set up navigation','Brief the missed approach']},Commercial:{label:'Scenario practice',title:'Think beyond the maneuver.',question:'Before practicing a commercial maneuver, what comes first?',options:['Enter the maneuver immediately','Brief the area, setup, and recovery'],answer:1,explanation:'Prepare the practice area, aircraft configuration, and recovery plan with your instructor before beginning the maneuver.',steps:['Choose a practice area','Brief the setup','Review the recovery']}};
export function AirspaceMock(){ const [track,setTrack]=useState('Instrument'),[answer,setAnswer]=useState(null);const lesson=lessons[track];return <Frame label="Training workspace" action="Try a study card"><div className="demo-padding"><Tabs items={Object.keys(lessons)} value={track} onChange={v=>{setTrack(v);setAnswer(null);}} label="Training track"/><div className="lesson-content content-enter" key={track}><div className="panel-heading"><span className="label">01 / {lesson.label}</span><h3>{lesson.title}</h3></div><ol className="lesson-steps">{lesson.steps.map((s,i)=><li key={s}><span>0{i+1}</span>{s}</li>)}</ol><p className="lesson-question">{lesson.question}</p><div className="lesson-options">{lesson.options.map((o,i)=><button aria-pressed={answer===i} key={o} onClick={()=>setAnswer(i)}><span>{answer===i?'●':'○'}</span>{o}</button>)}</div><div className="lesson-feedback" aria-live="polite">{answer===null?'Choose an answer to explore the reasoning.':<span className="content-enter" key={answer}><strong>{answer===lesson.answer?'That’s the idea.':'Take a step back.'}</strong> {lesson.explanation}</span>}</div></div></div></Frame>; }

export function LibraryMock(){ const [filter,setFilter]=useState('All'),[selected,setSelected]=useState('Cessna 172'),[added,setAdded]=useState([]); const names=Object.keys(profiles).filter(n=>filter==='All'||(filter==='Trainers'?n!=='Cessna 182':n==='Cessna 182')); const p=profiles[selected];return <Frame label="Aircraft library" action={`${added.length} in your hangar`}><div className="demo-padding"><Tabs items={['All','Trainers','Touring']} value={filter} onChange={f=>{setFilter(f);if(f==='Touring')setSelected('Cessna 182');else if(f==='Trainers'&&selected==='Cessna 182')setSelected('Cessna 172');}} label="Aircraft categories"/><div className="aircraft-list">{names.map(n=><button aria-pressed={selected===n} key={n} onClick={()=>setSelected(n)}><span className="aircraft-code">{profiles[n].code}</span><span><strong>{n}</strong><small>{n==='Cessna 182'?'Touring':'Trainer'} · Single engine</small></span><span>{selected===n?'●':'↗'}</span></button>)}</div><div className="hangar-detail content-enter" key={selected}><span className="label">Profile preview</span><h3>{selected}</h3><DetailRows rows={[["Cruise",`${p.cruise} kt`],["Seating",`${p.seats} people`],["Workspace","Overview · POH index · Preflight"]]}/></div><button className="demo-link" aria-pressed={added.includes(selected)} onClick={()=>setAdded(added.includes(selected)?added.filter(n=>n!==selected):[...added,selected])}>{added.includes(selected)?'✓ In your demo hangar':'＋ Add to demo hangar'}<span>{added.includes(selected)?'−':'→'}</span></button><p className="demo-note">Explore sample profiles. Aircraft details vary by model.</p></div></Frame>; }

export function NavLogMock(){ const [speed,setSpeed]=useState(115),[wind,setWind]=useState(8),[generated,setGenerated]=useState(false); const gs=Math.max(1,speed-wind); const legs=[['KHPN','KPOU'],['KPOU','KALB'],['KALB','KHPN']].map(([a,b])=>({a,b,d:distanceNm(airports.find(x=>x.code===a),airports.find(x=>x.code===b))})); return <Frame label="Navigation log"><div className="demo-padding"><div className="nav-inputs"><label>True airspeed <span><input aria-label="True airspeed" type="number" min="60" max="250" value={speed} onChange={e=>{setSpeed(Math.max(60,Math.min(250,+e.target.value)));setGenerated(false);}}/> kt</span></label><label>Headwind <span><input aria-label="Headwind" type="number" min="0" max="50" value={wind} onChange={e=>{setWind(Math.max(0,Math.min(50,+e.target.value)));setGenerated(false);}}/> kt</span></label></div><div className="nav-route-strip">KHPN <span>→</span> KPOU <span>→</span> KALB</div><div className="nav-table-wrap"><table className="mock-table"><thead><tr><th>Leg</th><th>Distance</th><th>GS</th><th>Time</th></tr></thead><tbody>{legs.map(l=><tr key={l.a}><td>{l.a} → {l.b}</td><td>{l.d} nm</td><td>{gs} kt</td><td>{Math.round(l.d/gs*60)} min</td></tr>)}</tbody></table></div><button className="demo-link" onClick={()=>setGenerated(true)}>{generated?'✓ Nav log added to your demo flight':'Generate nav log'}<span>↗</span></button><p className="demo-note">Illustrative direct legs and constant wind.</p></div></Frame>; }

const checks=['Aircraft documents reviewed','Fuel quantity & quality checked','Control surfaces inspected','Weather briefing reviewed','Weight & balance verified'];
export function ChecklistMock(){ const [done,setDone]=useState([0,1]); const complete=done.length===checks.length; const pct=Math.round(done.length/checks.length*100); const animatedPct=useAnimatedNumber(pct, 1100); return <Frame label="Preflight flow" action={`${done.length} / ${checks.length} complete`}><div className="demo-padding"><div className="checklist-heading"><div><span className="label">Before you fly</span><h3>Ready is a process.</h3></div></div><div className="check-progress"><i style={{width:`${animatedPct}%`}}/></div><div className="interactive-checks">{checks.map((text,i)=><button key={text} role="checkbox" aria-checked={done.includes(i)} onClick={()=>setDone(done.includes(i)?done.filter(x=>x!==i):[...done,i])}><span className="check-box"><CheckIcon size={11} className="check-mark"/></span><span className="check-text">{text}</span><small>{String(i+1).padStart(2,'0')}</small></button>)}</div><div className="checklist-footer"><span aria-live="polite">{complete?'All demo checks complete.':'A little care goes a long way.'}</span><button className="checklist-reset" onClick={()=>setDone([])} disabled={!done.length}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 1 3 6.7M3 12v6h6"/></svg>Reset</button></div></div></Frame>; }

export function DebriefMock(){ const [tab,setTab]=useState('Overview'),[reviewed,setReviewed]=useState(false); return <Frame label="Post-flight reflection"><div className="demo-padding"><div className="debrief-heading"><span className="label">Flight 024 / C172</span><h3>Every flight teaches you.</h3><p>KHPN → KPOU · 42 minutes</p></div><Tabs items={['Overview','Landings','Next flight']} value={tab} onChange={setTab} label="Debrief sections"/><div className="debrief-content" key={tab}>{tab==='Overview'?<><div className="flight-bars" aria-label="Illustrative flight altitude profile">{[15,24,40,58,73,78,80,80,79,81,77,64,48,30,16,12].map((h,i)=><i key={i} style={{height:`${h}%`,'--bar-delay':`${i*25}ms`}}/>)}</div><span className="label">A steady flight, from climb to cruise.</span><p>Your sample flight maintained a consistent cruise altitude. Review the approach to find your next improvement.</p></>:tab==='Landings'?<><div className="debrief-score">3 <small>landings reviewed</small></div><p>Centerline tracking looked consistent. Aim for a more stable airspeed on the final approach.</p></>:<><div className="debrief-score">01 <small>focus for next time</small></div><p>Brief your target approach speed before departure. Practice a stable descent with a consistent configuration.</p></>}</div><button className="demo-link" onClick={()=>setReviewed(!reviewed)}>{reviewed?'✓ Reflection saved':'Save reflection'}<span>↗</span></button><p className="demo-note">Sample analysis, no flight has been uploaded.</p></div></Frame>; }
