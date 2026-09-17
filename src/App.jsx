import SmoothNavigation from "./components/SmoothNavigation.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import RegChatSection from "./components/RegChatSection.jsx";
import StatsStrip from "./components/StatsStrip.jsx";
import FeatureSection from "./components/FeatureSection.jsx";
import WaitlistSection from "./components/WaitlistSection.jsx";
import Footer from "./components/Footer.jsx";
import RegChatModal from "./components/RegChatModal.jsx";
import { features } from "./data/features.js";
import { AircraftMock } from "./components/graphics/FeatureMocks.jsx";
import LogbookMock from "./components/graphics/LogbookMock.jsx";

const graphics = {
  aircraft: AircraftMock,
  logbook: LogbookMock,
};

export default function App() {
  return (
    <>
      <SmoothNavigation />
      <Header />
      <main>
        <Hero />
        <RegChatSection />
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
      <RegChatModal />
    </>
  );
}
