import { useEffect, useRef, useState } from 'react';
import RegChat from './RegChat.jsx';

export default function RegChatModal() {
  const [open, setOpen] = useState(false);
  const backdrop = useRef(null);

  useEffect(() => {
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    const onToggle = () => setOpen(o => !o);
    document.addEventListener('keydown', onKey);
    window.addEventListener('regchat:toggle', onToggle);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('regchat:toggle', onToggle); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const input = backdrop.current?.querySelector('.reg-chat__input-row input');
    input?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return <div className="reg-chat-modal" ref={backdrop} onClick={e => { if (e.target === backdrop.current) setOpen(false); }}>
    <div className="reg-chat-modal__content">
      <RegChat compact />
      <button className="reg-chat-modal__close" aria-label="Close" onClick={() => setOpen(false)}>×</button>
    </div>
  </div>;
}

export function useRegChatModalHint() {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);
  return isMac ? '⌘K' : 'Ctrl K';
}
