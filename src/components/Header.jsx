import { useEffect, useState } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark");
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try { localStorage.setItem("vysion-theme", next); } catch {}
    setTheme(next);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${isScrolled ? " is-scrolled" : ""}`}>
      <a className="header__logo" href="#top">
        <span className="brand-symbol" aria-hidden="true">⌁</span> VYSION
      </a>
      <div className="header__right">
        <nav className="header__nav" aria-label="Features">
          <a href="#far-aim">FAR/AIM</a>
          <a href="#preflight">Preflight</a>
          <a href="#logbook">Logbook</a>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          <svg key={theme} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {theme === "dark" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></> : <path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z" />}
          </svg>
        </button>
        <a className="btn btn--outlined" href="#waitlist">
          Join waitlist
        </a>
      </div>
    </header>
  );
}
