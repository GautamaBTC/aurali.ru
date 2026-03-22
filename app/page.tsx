import { Footer } from '@/components/layout/footer'
import { AtmosphereToggle } from '@/components/ui/atmosphere-toggle'
import { SectionRevealController } from '@/components/ui/section-reveal-controller'
import { BookingSection } from '@/components/sections/booking-section'
import { ContactsSection } from '@/components/sections/contacts-section'
import { FaqSection } from '@/components/sections/faq-section'
import { FinalCtaSection } from '@/components/sections/final-cta-section'
import { HeroSection } from '@/components/sections/hero-section'
import { MasterSection } from '@/components/sections/master-section'
import { OfferSection } from '@/components/sections/offer-section'
import { ReviewsSection } from '@/components/sections/reviews-section'
import { ServicesSection } from '@/components/sections/services-section'
import { TouristSection } from '@/components/sections/tourist-section'
import { TrustSection } from '@/components/sections/trust-section'
import { siteContent } from '@/data/site-content'

export default function HomePage() {
  return (
    <>
      <main>
        <HeroSection
          title={siteContent.heroTitle}
          subtitle={siteContent.heroSubtitle}
          description={siteContent.heroDescription}
          offer={siteContent.firstVisitOffer}
          whatsappUrl={siteContent.contact.whatsappUrl}
        />
        <TrustSection stats={siteContent.stats} />
        <ServicesSection categories={siteContent.categories} services={siteContent.services} />
        <MasterSection title='Точность прикосновения и персональный подход' />
        <BookingSection contact={siteContent.contact} />
        <OfferSection text={siteContent.firstVisitOffer} whatsappUrl={siteContent.contact.whatsappUrl} />
        <ReviewsSection />
        <FaqSection items={siteContent.faq} />
        <TouristSection title={siteContent.touristBlockTitle} text={siteContent.touristBlockText} />
        <ContactsSection contact={siteContent.contact} />
        <FinalCtaSection
          title={siteContent.finalCtaTitle}
          text={siteContent.finalCtaText}
          phoneDisplay={siteContent.contact.phoneDisplay}
          phoneDigits={siteContent.contact.phoneDigits}
          whatsappUrl={siteContent.contact.whatsappUrl}
        />
      </main>
      <Footer domain={siteContent.domain} />
      <SectionRevealController />
      <AtmosphereToggle />
    </>
  )
}
