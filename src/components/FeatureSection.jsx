import { useEffect, useRef, useState } from "react";
import AnimatedText from "./AnimatedText.jsx";

export default function FeatureSection({
  id,
  label,
  title,
  description,
  dark,
  reverse,
  Graphic,
}) {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(false);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.08 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`section feature ${dark ? "surface-dark" : "surface-light"}${
        reverse ? " feature--reverse" : ""
      }${visible ? "" : " is-pending"}`}
    >
      <div className="container feature__grid">
        <div className="feature__copy">
          <p className="label feature__index"><AnimatedText text={label} /></p>
          <h2 className="heading feature__title">{title}</h2>
          <p className="body-lg feature__description">{description}</p>

        </div>
        {Graphic && (
          <div className="feature__mock">
            <Graphic />
          </div>
        )}
      </div>
    </section>
  );
}
