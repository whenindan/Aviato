import SmoothNavigation from "./components/SmoothNavigation.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import StatsStrip from "./components/StatsStrip.jsx";
import FeatureSection from "./components/FeatureSection.jsx";
import WaitlistSection from "./components/WaitlistSection.jsx";
import Footer from "./components/Footer.jsx";
import { features } from "./data/features.js";
import {
  MapMock,
  AircraftMock,
  RegMock,
  AirspaceMock,
  LibraryMock,
  NavLogMock,
  ChecklistMock,
  DebriefMock,
} from "./components/graphics/FeatureMocks.jsx";

const graphics = {
  map: MapMock,
  aircraft: AircraftMock,
  "far-aim": RegMock,
  "ifr-commercial": AirspaceMock,
  "ga-library": LibraryMock,
  "nav-log": NavLogMock,
  preflight: ChecklistMock,
  debrief: DebriefMock,
};

export default function App() {
  return (
    <>
      <SmoothNavigation />
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.id}
            id={feature.id}
            label={feature.label}
            title={feature.title}
            description={feature.description}
            dark={false}
            reverse={index % 2 === 1}
            Graphic={graphics[feature.id]}
          />
        ))}
        <WaitlistSection />
      </main>
      <Footer />
    </>
  );
}
