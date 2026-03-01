import { StickyMobileActions } from "@/components/effects/StickyMobileActions";
import { ParallaxSection } from "@/components/parallax/ParallaxSection";
import { Reveal } from "@/components/effects/Reveal";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import MultimeterElectronic from "@/components/multimeter-electronic/Multimeter";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2"
      >
        Перейти к содержимому
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content">
        <Reveal>
          <HeroSection />
        </Reveal>
        <ParallaxSection
          className="relative"
          layers={[
            {
              id: "stats-glow",
              speed: -0.2,
              z: 0,
              style: {
                background:
                  "radial-gradient(circle at 50% 50%, rgba(215,23,23,0.11) 0%, rgba(255,95,46,0.08) 42%, transparent 72%)",
                filter: "blur(80px)",
                transform: "translateZ(0)",
              },
            },
            {
              id: "stats-grid",
              speed: -0.08,
              z: 1,
              opacityRange: [0.12, 0.03],
              style: {
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              },
            },
          ]}
        >
          <Reveal>
            <StatsSection />
          </Reveal>
        </ParallaxSection>
        <ParallaxSection
          className="relative"
          layers={[
            {
              id: "cmp-bg",
              speed: -0.16,
              z: 0,
              style: {
                background:
                  "radial-gradient(ellipse at 20% 50%, rgba(231,76,60,0.09) 0%, transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(0,184,148,0.1) 0%, transparent 70%)",
              },
            },
            {
              id: "cmp-grid",
              speed: -0.06,
              z: 1,
              opacityRange: [0.1, 0.02],
              style: {
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                backgroundSize: "100px 100px",
              },
            },
          ]}
        >
          <Reveal>
            <CompareSection />
          </Reveal>
        </ParallaxSection>
        <Reveal>
          <ServicesSection />
        </Reveal>
        <Reveal>
          <AdvantagesSection />
        </Reveal>
        <Reveal>
          <ProcessSection />
        </Reveal>
        <Reveal>
          <BrandsSection />
        </Reveal>
        <Reveal>
          <ReviewsSection />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
        <MultimeterElectronic autoAnimate animationInterval={3200} />
      </main>
      <StickyMobileActions />
      <Footer />
    </>
  );
}
