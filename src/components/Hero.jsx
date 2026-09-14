import HeroGraphic from "./graphics/HeroGraphic.jsx";
import AnimatedText from "./AnimatedText.jsx";

export default function Hero() {
  return (
    <section id="top" className="hero surface-dark">
      <div className="container hero__top">
        <p className="label hero__eyebrow">A clearer way to fly <span> / </span> Introducing VYSION</p>
        <h1 className="display-lg hero__title">
          <AnimatedText text="More sky." mode="type" delay={150} /><br /><span className="hero__accent"><AnimatedText text="Less guesswork." mode="type" delay={650} /></span>
        </h1>
        <p className="body-lg hero__lead">
          Your entire flight, brought together. Plan with clarity, prepare with
          confidence, and make every flight a little better.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#explore">
            Explore the workspace ↗
          </a>
          <a className="btn btn--text" href="#waitlist">
            Get early access →
          </a>
        </div>
      </div>
      <div className="hero__graphic container">
        <HeroGraphic />
      </div>
    </section>
  );
}
