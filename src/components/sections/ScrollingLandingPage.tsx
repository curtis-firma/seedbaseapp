import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import EnterAppButton from "@/components/ui/EnterAppButton";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import HeroVisualCanvas from "@/components/landing/HeroVisualCanvas";
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import MobileScrollNarrative from "@/components/sections/MobileScrollNarrative";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardCard from "@/components/cards/DashboardCard";
import LedgerCard from "@/components/cards/LedgerCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import WalletCard from "@/components/cards/WalletCard";
import ImpactPreviewCard from "@/components/cards/ImpactPreviewCard";
import CampaignCard from "@/components/cards/CampaignCard";
import { Logo, seedbaseCombinedBlack } from "@/components/shared/Logo";
import poweredByCik from "@/assets/powered-by-cik-text.png";
import baseLogo from "@/assets/base-logo.png";
import LoginModal from "@/components/sections/LoginModal";
import { SeedbaseLoader } from "@/components/shared/SeedbaseLoader";
import FeatureSquareCard from "@/components/landing/FeatureSquareCard";
import LearnMoreModal from "@/components/landing/LearnMoreModal";
import waterBackground from "@/assets/water-background.png";
const sections = [
{
  id: "wallet",
  headline: "A wallet built for giving",
  description: "Sign in with email or phone. Give instantly. Withdraw to your bank.",
  card: "wallet",
  bgColor: "bg-landing-wallet"
},
{
  id: "impact",
  headline: "See your impact",
  description: "A live social feed shows generosity in motion.",
  card: "impact",
  bgColor: "bg-landing-impact"
},
{
  id: "spread",
  headline: "See generosity spread",
  description: "Watch surplus move across people, places, and missions.",
  card: "campaign",
  bgColor: "bg-landing-spread",
  bgImage: true
},
{
  id: "ledger",
  headline: "Built on shared ledgers",
  description: "Every seed. Every surplus. Every deployment. Trust you can see.",
  card: "ledger",
  bgColor: "bg-landing-ledger"
},
{
  id: "seedbases",
  headline: "Communities steward together",
  description: "Ministries and teams run seedbases. Same numbers. Shared clarity.",
  card: "dashboard",
  bgColor: "bg-landing-seedbases"
},
{
  id: "tithing",
  headline: "Transparent tithing",
  description: "See allocations. Vote on priorities. Track impact.",
  card: "transparency",
  bgColor: "bg-landing-tithing"
},
{
  id: "movement",
  headline: "Built by generosity",
  description: "Every seed grows. Every surplus spreads. Trust rewards come back.",
  card: "growth",
  bgColor: "bg-landing-movement"
}];

const ScrollingLandingPage = () => {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const desktopSectionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const scrollToContent = () => {
    if (desktopSectionsRef.current) {
      desktopSectionsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };
  const handleLoginComplete = (isNewUser?: boolean) => {
    setShowLoginModal(false);
    setIsTransitioning(true);

    // Show loader for smooth transition
    setTimeout(() => {
      navigate('/app');
    }, 1500);
  };
  const renderCard = (cardType: string, sectionId: string, compact = false) => {
    // Desktop impact card should fill the canonical InnerCard (no extra padding wrappers)
    if (sectionId === "impact" && !compact) {
      return <ImpactPreviewCard />;
    }

    switch (cardType) {
      case "feed":
        return (
          <div
            className={`aspect-square w-full ${compact ? "max-w-xs" : "max-w-sm"} rounded-2xl bg-white/20 border-2 border-white/40`} />);


      case "campaign":
        return <CampaignCard />;
      case "impact":
        return <ImpactPreviewCard />;
      case "commitment":
        return <SeedCommitmentCard />;
      case "ledger":
        // Keep perfectly centered to preserve even padding inside the colored square
        return <LedgerCard />;
      case "dashboard":
        return <DashboardCard />;
      case "transparency":
        return <TitheAllocationCard />;
      case "growth":
        // One card per square on desktop (stacking caused peek-through/clipping)
        return <GrowthReportCard />;
      case "wallet":
        return <WalletCard />;
      default:
        return <SeedFeedCard />;
    }
  };

  // Show transition loader
  if (isTransitioning) {
    return <SeedbaseLoader message="Entering SeedBase..." />;
  }
  return <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left - Fixed Hero Text Column */}
        <header className="lg:w-[36%] lg:fixed lg:top-0 lg:left-0 lg:h-screen flex flex-col pt-8 lg:pt-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 bg-white z-20 pb-safe">
          {/* Seedbase combined logo at top - black text for light background */}
          <div className="mb-2 lg:mb-0">
            <Logo variant="combined" size="xl" />
          </div>
          
          <div className="max-w-sm flex flex-col flex-1">
            {/* Hero content centered vertically on desktop */}
            <div className="flex-1 flex items-center lg:justify-center">
              <div>
                <h1 className="text-hero lg:text-hero-lg font-semibold tracking-[-0.03em] mb-4 lg:mb-6 text-foreground leading-[0.95]">Where Generosity Grows.</h1>
                
                <div className="text-[18px] lg:text-[20px] text-muted-foreground mb-3 lg:mb-8 leading-[1.5] opacity-0 animate-fade-in-stagger-1 max-w-[34rem]">
                  <p className="mb-3">Social app where generosity becomes shared impact.</p>
                  <p>Plant a seed and watch it grow. Missions are funded in real-time and tracked through our agentic transparecny system. </p>
                </div>
                
                {/* CTA Buttons - Tablet + Desktop in header */}
                <nav className="hidden md:flex flex-col gap-3" role="navigation" aria-label="Main actions">
                  <EnterAppButton onClick={() => setShowLoginModal(true)} />
                  <LearnMoreButton onClick={() => setShowLearnMore(true)} />
                </nav>
                
              </div>
            </div>
          </div>
        </header>

        <div className="md:hidden px-4 sm:px-6">
          <MobileScrollNarrative
          onEnterApp={() => setShowLoginModal(true)}
          onLearnMore={() => setShowLearnMore(true)} />

        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onComplete={handleLoginComplete} />

        {/* Learn More Modal */}
        <LearnMoreModal
        open={showLearnMore}
        onOpenChange={setShowLearnMore}
        onGetStarted={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => setShowLoginModal(true), 300);
        }} />


        {/* Right - Scrolling Content (tablet and desktop) */}
        <main className="hidden md:block lg:ml-[36%] lg:w-[64%] w-full pointer-events-none" ref={contentRef}>
          {/* Hero Card Section - Dynamic Visual Canvas */}
          <section className="flex items-start pt-[32px] px-8 pointer-events-auto">
            <div className="w-full animate-content-reveal">
              {/* Only render on tablet/desktop to prevent double mounting */}
              {!isMobile && <HeroVisualCanvas />}
            </div>
          </section>

          {/* Scrolling Content Sections */}
          <div ref={desktopSectionsRef} className="scroll-mt-8" />
          {sections.map((section) => <section key={section.id} className="py-16 px-8 pointer-events-auto">
              {/* 
             Layout:
             - Tablet (md): Stacked vertically - card on top, text below (like mobile but larger)
             - Desktop (lg): Side-by-side grid - text left, card right
            */}
              <div className="flex flex-col lg:grid w-full gap-8 lg:gap-12 items-center lg:items-start content-start lg:grid-cols-[minmax(0,1fr)_auto]">
                {/* Card - Top on tablet, Right on desktop */}
                <div className="order-1 lg:order-2 w-full lg:w-auto">
                  <FeatureSquareCard
                bgColor={section.bgImage ? 'bg-gradient-to-br from-teal-300 to-cyan-400' : section.bgColor}
                bgImage={section.bgImage ? waterBackground : undefined}
                animate
                className={section.id === 'wallet' ? 'animate-fade-in' : ''}>

                    {renderCard(section.card, section.id)}
                  </FeatureSquareCard>
                </div>
                
                {/* Topic Text - Below on tablet, Left on desktop */}
                <div className="order-2 lg:order-1 min-w-0 max-w-md lg:pl-8 text-center lg:text-left">
                  <h2 className="text-section lg:text-section-lg font-semibold tracking-[-0.02em] mb-4 lg:mb-6 text-foreground leading-[1.05]">
                    {section.headline}
                  </h2>
                  <p className="text-body lg:text-body-lg text-muted-foreground leading-[1.5] max-w-[34rem] mx-auto lg:mx-0">
                    {section.description}
                  </p>
                </div>
              </div>
            </section>)}

          {/* Full-width Seedbase Logo Above Footer */}
          <section className="py-6 px-8 flex justify-center pointer-events-auto">
            <button onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="cursor-pointer hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg w-full flex justify-center" aria-label="Scroll back to top of page">
              <img src={seedbaseCombinedBlack} alt="Seedbase" className="w-full h-auto" />
            </button>
          </section>

          {/* Footer Section */}
          <footer className="py-8 px-8 flex flex-col items-center gap-4 pointer-events-auto border-t border-gray-200">
            {/* Powered by CIK - Top of footer */}
            <img alt="Powered by Christ is King" className="h-14 object-contain" src={poweredByCik} />
            
            {/* Desktop: Built on Base (left) + Copyright (right) on same line */}
            {/* Mobile: Stacked vertically, centered */}
            <div className="w-full flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-center">
              {/* Built on Base - left on desktop */}
              <div className="flex items-center gap-2 text-muted-foreground text-base md:text-lg">
                <span>Built on</span>
                <img src={baseLogo} alt="Base" className="h-6 md:h-8 w-auto" />
              </div>
              
              {/* Copyright - right on desktop */}
              <p className="text-muted-foreground text-sm md:text-base">
                © 2026 Christ is King Labs. All rights reserved.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>;
};
export default ScrollingLandingPage;