import { useEffect, useRef, useState } from 'react';

// Glides smoothly toward `target` instead of jump-cutting, so a progress
// readout climbs or falls in view rather than snapping between two values.
export function useAnimatedNumber(target, duration = 450) {
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
