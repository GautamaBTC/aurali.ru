"use client";

import { StickyMobileActions } from "@/components/effects/StickyMobileActions";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { BrandsSection } from "@/components/sections/BrandsSection";
import { CompareSection } from "@/components/sections/CompareSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PartnerBrandsSection } from "@/components/sections/PartnerBrandsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useGlobalReveal } from "@/hooks/useGlobalReveal";

export default function Home() {
  useGlobalReveal();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-3 focus:py-2 focus:font-semibold focus:text-black"
      >
        Перейти к содержимому
      </a>
      <ScrollProgress />
      <main id="main-content">
        <HeroSection />
        <StatsSection />
        <CompareSection />
        <ProductShowcase />
        <ServicesSection />
        <PartnerBrandsSection />
        <AdvantagesSection />
        <ProcessSection />
        <BrandsSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <StickyMobileActions />
      <ScrollToTop />
      <Footer />
    </>
  );
}
