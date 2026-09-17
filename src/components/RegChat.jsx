import { useEffect, useRef, useState } from 'react';
import { faq } from '../data/faq.js';
import { useRegChat, askRegChat, saveToNotes } from '../hooks/useRegChat.js';

function TypingDots() {
  return <span className="reg-chat__typing" aria-label="Assistant is typing"><i /><i /><i /></span>;
}

function AssistantAnswer({ msg }) {
  const { saved } = useRegChat();
  if (msg.fallback) {
    return <div className="reg-chat__answer reg-chat__answer--fallback">
      <p>I couldn't match that to a reference in this preview. Try one of these:</p>
      <div className="reg-chat__chips">
        {msg.suggestions.map(id => {
          const f = faq.find(x => x.id === id);
          return <button key={id} onClick={() => askRegChat(f.question)}>{f.question}</button>;
        })}
      </div>
    </div>;
  }
  const isSaved = saved.includes(msg.entryId);
  return <div className="reg-chat__answer">
    <p>{msg.summary}</p>
    <a className="reg-chat__cite" href={msg.url} target="_blank" rel="noreferrer">{msg.cite} <span>↗</span></a>
    <ul className="reg-chat__bullets">{msg.bullets.map(b => <li key={b}>{b}</li>)}</ul>
    <button className="reg-chat__save" aria-pressed={isSaved} onClick={() => saveToNotes(msg.entryId)}>
      {isSaved ? '✓ Saved to flight notes' : '＋ Save to flight notes'}
    </button>
  </div>;
}

export default function RegChat({ compact = false, onSubmitFocus }) {
  const { messages, pending } = useRegChat();
  const [draft, setDraft] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, pending]);

  const submit = (e) => {
    e?.preventDefault();
    if (!draft.trim()) return;
    askRegChat(draft);
    setDraft('');
  };

  return <div className={`reg-chat${compact ? ' reg-chat--compact' : ''}`}>
    <div className="reg-chat__header">
      <span className="reg-chat__dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="reg-chat__title">vysion · far/aim</span>
    </div>
    <div className="reg-chat__log" ref={logRef} aria-live="polite">
      {!messages.length && <div className="reg-chat__empty">
        <p><span className="reg-chat__prompt">❯</span> Ask about privileges, currency, airspace, maintenance…</p>
      </div>}
      {messages.map(m => m.role === 'user'
        ? <div className="reg-chat__bubble reg-chat__bubble--user" key={m.id}>{m.text}</div>
        : <div className="reg-chat__row" key={m.id}><span className="reg-chat__prompt">❯</span><AssistantAnswer msg={m} /></div>
      )}
      {pending && <div className="reg-chat__row"><span className="reg-chat__prompt">❯</span><TypingDots /></div>}
    </div>
    <div className="reg-chat__chips reg-chat__chips--faq" role="group" aria-label="Common questions">
      {faq.slice(0, 8).map(f => <button key={f.id} onClick={() => askRegChat(f.question)}>{f.question}</button>)}
    </div>
    <form className="reg-chat__input-row" onSubmit={submit}>
      <span className="reg-chat__prompt" aria-hidden="true">❯</span>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={onSubmitFocus}
        placeholder="Ask about privileges, currency, airspace, maintenance…"
        aria-label="Ask the FAR/AIM chat"
      />
      <button type="submit" className="reg-chat__send" aria-label="Send" disabled={!draft.trim()}>↵</button>
    </form>
  </div>;
}
