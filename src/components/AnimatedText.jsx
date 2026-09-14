import { useEffect, useRef, useState } from "react";

// Keep the full text in layout and the accessibility tree during animation.
export default function AnimatedText({ text, mode = "scramble", delay = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    let timer;
    let frame;
    let observer;
    const stop = () => { clearTimeout(timer); cancelAnimationFrame(frame); setDisplay(text); setRunning(false); };
    const start = () => {
      observer?.disconnect();
      timer = setTimeout(() => {
        const started = performance.now();
        setRunning(true);
        const tick = now => {
          const progress = Math.min((now - started) / (mode === "type" ? text.length * 48 : 700), 1);
          const count = Math.floor(progress * text.length);
          setDisplay(mode === "type" ? text.slice(0, count) : [...text].map((char, i) => i < count || char === " " ? char : "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[(i * 7 + Math.floor((now - started) / 45)) % 36]).join(""));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else { setDisplay(text); setRunning(false); }
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    };
    if (mode === "type") { setDisplay(""); start(); }
    else if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start(); }, { threshold: 0.5 });
      observer.observe(ref.current);
    }
    const onMotion = () => { if (motion.matches) { observer?.disconnect(); stop(); } };
    motion.addEventListener("change", onMotion);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); observer?.disconnect(); motion.removeEventListener("change", onMotion); };
  }, [text, mode, delay]);
  return <span ref={ref} className={`animated-text animated-text--${mode}${running ? " is-animating" : ""}`}><span className="animated-text__original">{text}</span><span className="animated-text__visual" aria-hidden="true">{display}</span></span>;
}
