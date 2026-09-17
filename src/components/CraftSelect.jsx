import { useEffect, useRef, useState } from 'react';
import { CheckIcon } from './graphics/icons.jsx';

export default function CraftSelect({ label, value, onChange, options }) {
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
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className="craft-select__chevron"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {open && <div className="craft-select__menu" role="listbox" aria-label={label}>
      {options.map(o => <button type="button" role="option" aria-selected={o === value} key={o} className={o === value ? 'is-selected' : ''} onClick={() => { onChange(o); setOpen(false); }}>
        {o}{o === value && <CheckIcon size={11} />}
      </button>)}
    </div>}
  </div>;
}
