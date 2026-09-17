import { useSyncExternalStore } from 'react';
import { answer, faq } from '../data/faq.js';

// Module-level store so chat consumers share the same transcript
// without lifting state up through App.jsx.
let state = { messages: [], saved: [], pending: false };
const listeners = new Set();
function emit() { listeners.forEach(l => l()); }
function subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
function getState() { return state; }

export function askRegChat(query) {
  const q = query.trim();
  if (!q) return;
  const userMsg = { id: crypto.randomUUID(), role: 'user', text: q };
  state = { ...state, messages: [...state.messages, userMsg], pending: true };
  emit();
  const delay = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 60 : 600;
  setTimeout(() => {
    const match = answer(q);
    const reply = match
      ? { id: crypto.randomUUID(), role: 'assistant', entryId: match.id, summary: match.summary, cite: match.cite, url: match.url, bullets: match.bullets }
      : { id: crypto.randomUUID(), role: 'assistant', fallback: true, suggestions: faq.slice(0, 3).map(f => f.id) };
    state = { ...state, messages: [...state.messages, reply], pending: false };
    emit();
  }, delay);
}

export function saveToNotes(entryId) {
  if (state.saved.includes(entryId)) return;
  state = { ...state, saved: [...state.saved, entryId] };
  emit();
}

export function useRegChat() {
  return useSyncExternalStore(subscribe, getState);
}
