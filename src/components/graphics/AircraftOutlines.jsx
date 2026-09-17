import c172Top from '../../../aircraft-outline/cessna-172/c172-top.png';
import pa28Top from '../../../aircraft-outline/piper-pa-28/pa28-top.png';
import sr22Top from '../../../aircraft-outline/cirrus-sr22/sr22-top.png';
import sf50Top from '../../../aircraft-outline/cirrus-sf50/sf50-top.png';

const topViews = {
  C172: { src: c172Top, alt: 'Cessna 172 top view', rotation: 180 },
  PA28: { src: pa28Top, alt: 'Piper PA-28 top view', rotation: 180 },
  SR22: { src: sr22Top, alt: 'Cirrus SR22 top view', rotation: 180 },
  SF50: { src: sf50Top, alt: 'Cirrus Vision Jet SF50 top view', rotation: 90 },
};

function TopView({ code }) {
  const view = topViews[code];
  return <div className="aircraft-blueprint">
    <div className="aircraft-blueprint__guide" aria-hidden="true" />
    <img
      className="aircraft-blueprint__image"
      src={view.src}
      alt={view.alt}
      style={{ '--aircraft-rotation': `${view.rotation}deg` }}
    />
  </div>;
}

export const outlines = Object.fromEntries(
  Object.keys(topViews).map(code => [code, () => <TopView code={code} />]),
);
