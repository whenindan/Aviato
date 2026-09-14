import { useEffect, useId, useRef, useState } from 'react';
import { airports } from '../data/airports.js';

export default function AirportPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  // Kept mounted a beat past `open` turning false so the popover can play a
  // closing transition instead of vanishing on the spot, and only marked
  // `entered` a frame after mount so the opening transition has a start state
  // to animate from rather than snapping straight to its open class.
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef(null), input = useRef(null), trigger = useRef(null);
  const id = useId();
  const airport = airports.find(a => a.code === value);
  const results = airports.filter(a => `${a.code} ${a.city} ${a.name}`.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    if (open) { setMounted(true); input.current?.focus(); return; }
    setEntered(false);
    if (!mounted) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setMounted(false), reduced ? 0 : 160);
    return () => clearTimeout(timer);
  }, [open]);
  useEffect(() => {
    if (!mounted || !open) return;
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted, open]);
  useEffect(() => {
    if (!open) return;
    const outside = e => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const choose = a => { onChange(a.code); setOpen(false); trigger.current?.focus(); };
  return <div className="airport-picker" ref={root} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
    <button ref={trigger} className="airport-trigger" aria-label={`${label}: ${airport.city}, ${value}`} aria-expanded={open} aria-haspopup="listbox" onClick={() => { setOpen(!open); setQuery(''); setActive(0); }}>
      <span className="picker-label">{label}<span aria-hidden="true">↗</span></span>
      <span className="picker-code">{value}<span aria-hidden="true">⌄</span></span>
      <span className="picker-city">{airport.city}</span>
    </button>
    {mounted && <div className={`airport-popover${entered ? ' is-open' : ''}`}>
      <div className="picker-search"><span aria-hidden="true">⌕</span><input ref={input} placeholder="City or airport code" aria-label={`Search ${label.toLowerCase()} airport`} role="combobox" aria-expanded="true" aria-controls={id} aria-autocomplete="list" aria-activedescendant={results[active] ? `${id}-${active}` : undefined} value={query} onChange={e => { setQuery(e.target.value); setActive(0); }} onKeyDown={e => {
        if (e.key === 'Escape') { setOpen(false); trigger.current.focus(); }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const next = Math.max(0, Math.min(results.length-1, active + (e.key === 'ArrowDown' ? 1 : -1))); setActive(next); document.getElementById(`${id}-${next}`)?.scrollIntoView({block:'nearest'}); }
        if (e.key === 'Enter' && results[active]) { e.preventDefault(); choose(results[active]); }
      }}/></div>
      <div id={id} role="listbox" aria-label={`${label} airports`} className="picker-results">{results.map((a,i) => <button type="button" role="option" aria-selected={a.code === value} id={`${id}-${i}`} key={a.code} tabIndex={-1} className={i === active ? 'is-highlighted' : ''} onPointerDown={e => e.preventDefault()} onClick={() => choose(a)} onPointerMove={() => setActive(i)}><span className="picker-code-chip">{a.code}</span><span>{a.city}<small>{a.name}</small></span>{a.code === value && <span>✓</span>}</button>)}{!results.length && <p className="empty-state">No matching airports in this preview.</p>}</div>
      <span className="picker-hint">↑ ↓ Navigate · Enter to select</span>
    </div>}
  </div>;
}
