import { useEffect } from 'react';

// Give long jumps a deliberate duration and let wheel/touch input interrupt.
export default function SmoothNavigation() {
  useEffect(() => {
    let frame;
    let previousBehavior;
    const cancel = () => {
      cancelAnimationFrame(frame);
      if (previousBehavior !== undefined) {
        document.documentElement.style.scrollBehavior = previousBehavior;
        previousBehavior = undefined;
      }
    };
    const navigate = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      cancel();
      const start = window.scrollY;
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const end = Math.max(0, Math.min(start + target.getBoundingClientRect().top - offset, document.documentElement.scrollHeight - window.innerHeight));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduced ? 0 : Math.min(1100, 480 + Math.abs(end - start) * .09);
      previousBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      history.pushState(null, '', link.hash);
      const started = performance.now();
      // Decisive deceleration (easeOutQuint) reads smoother than an ease-in-out
      // for a click-to-arrive jump: it leaves immediately and settles gently.
      const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5);
      const tick = (now) => {
        const t = duration ? Math.min(1, (now - started) / duration) : 1;
        window.scrollTo(0, start + (end - start) * easeOutQuint(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          cancel();
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.removeAttribute('tabindex');
          target.classList.add('nav-arrived');
          setTimeout(() => target.classList.remove('nav-arrived'), 900);
        }
      };
      frame = requestAnimationFrame(tick);
    };
    const onKey = (event) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Escape', ' '].includes(event.key)) cancel();
    };
    document.addEventListener('click', navigate);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', cancel);
    return () => {
      cancel();
      document.removeEventListener('click', navigate);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', cancel);
    };
  }, []);
  return null;
}
