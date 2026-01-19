import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ChevronDown, ArrowRight } from "lucide-react";
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import SeedFeedCardPeek from "@/components/cards/SeedFeedCardPeek";
import SeedFeedCardPeekAlt from "@/components/cards/SeedFeedCardPeekAlt";
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import MobileScrollNarrative from "@/components/sections/MobileScrollNarrative";
import DashboardCard from "@/components/cards/DashboardCard";
import LedgerCard from "@/components/cards/LedgerCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import ImpactStatsCard from "@/components/cards/ImpactStatsCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import WalletCard from "@/components/cards/WalletCard";
import ImpactPreviewCard from "@/components/cards/ImpactPreviewCard";
import CampaignCard from "@/components/cards/CampaignCard";
import { Logo, seeddropTypeLight } from "@/components/shared/Logo";
import poweredByCik from "@/assets/powered-by-cik-text.png";
import generositySpread from "@/assets/generosity-spread.png";
import baseLogo from "@/assets/base-logo.png";
import LoginModal from "@/components/sections/LoginModal";
import { SeedbaseLoader } from "@/components/shared/SeedbaseLoader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
const sections = [{
  id: "wallet",
  headline: "A wallet built for giving",
  description: "Sign in with email or phone.\nGive instantly.\nWithdraw to your bank.\nSpend with a card.\n\nNo crypto required.",
  card: "wallet",
  bgColor: "bg-blue-400"
}, {
  id: "impact",
  headline: "See your impact as it happens",
  description: "A live social feed shows generosity in motion.",
  card: "impact",
  bgColor: "bg-emerald-400"
}, {
  id: "spread",
  headline: "See generosity spread",
  description: "Watch surplus move across people, places, and missions.",
  card: "campaign",
  bgColor: "bg-teal-400",
  bgImage: true
}, {
  id: "ledger",
  headline: "Built on shared ledgers",
  description: "Every seed. Every surplus. Every deployment.\n\nTrust you can see.",
  card: "ledger",
  bgColor: "bg-[#FDDE02]"
}, {
  id: "seedbases",
  headline: "Communities steward together",
  description: "Ministries and teams run seedbases.\n\nSteward seed. Track tithes. Vote on missions.\n\nSame numbers. Shared clarity.",
  card: "dashboard",
  bgColor: "bg-violet-400"
}, {
  id: "tithing",
  headline: "Transparent tithing",
  description: "Tithes go directly to a seedbase.\n\nSee allocations. Vote on priorities. Track impact.\n\nHeld in USDC or CIK.",
  card: "transparency",
  bgColor: "bg-amber-400"
}, {
  id: "movement",
  headline: "Built by generosity",
  description: "Every seed. Every surplus. Every deployment.\n\nTrust you can see.",
  card: "growth",
  bgColor: "bg-cyan-400"
}];
const ScrollingLandingPage = () => {
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const desktopSectionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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
    // Special scrolling social feed for impact section (desktop)
    if (sectionId === "impact" && !compact) {
      return <div className="relative w-full h-full overflow-hidden flex justify-center items-center p-8">
          <ImpactPreviewCard />
        </div>;
    }
    switch (cardType) {
      case "feed":
        return <div className={`aspect-square w-full ${compact ? 'max-w-xs' : 'max-w-sm'} rounded-2xl bg-white/20 border-2 border-white/40`} />;
      case "campaign":
        return <CampaignCard />;
      case "impact":
        return <ImpactPreviewCard />;
      case "commitment":
        return <SeedCommitmentCard />;
      case "ledger":
        return <div className="animate-slide-hint"><LedgerCard /></div>;
      case "dashboard":
        return <DashboardCard />;
      case "transparency":
        return <TitheAllocationCard />;
      case "growth":
        if (compact) {
          return <GrowthReportCard />;
        }
        return <div className="space-y-4">
            <GrowthReportCard />
            <ImpactStatsCard />
          </div>;
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
          {/* Seedbase wordmark logo at top - forceDark for light background */}
          <div className="w-32 lg:w-40 xl:w-48 h-auto mb-2 lg:mb-0">
            <img src={seeddropTypeLight} alt="Seedbase - Transparent Network of Generosity" className="w-full h-auto" />
          </div>
          
          <div className="max-w-sm flex flex-col flex-1">
            {/* Hero content centered vertically on desktop */}
            <div className="flex-1 flex items-center lg:justify-center">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 lg:mb-6 text-foreground leading-[1.05]">Where Generosity Grow.</h1>
                
                <div className="text-lg text-muted-foreground mb-3 lg:mb-8 leading-snug">
                  <span className="block opacity-0 animate-fade-in-stagger-1">Commit seed</span>
                  <span className="block opacity-0 animate-fade-in-stagger-2">Earn and watch it grow.</span>
                  <span className="block opacity-0 animate-fade-in-stagger-3">Track your impact—live.</span>
                  <span className="block opacity-0 animate-fade-in-stagger-4">Connect with others.</span>
                </div>
                
                {/* CTA Buttons - Desktop only in header */}
                <nav className="hidden lg:flex flex-col gap-3 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm" role="navigation" aria-label="Main actions">
                  {/* Enter App - Solid Blue Rectangle */}
                  <button onClick={() => setShowLoginModal(true)} className="relative w-full py-5 rounded-xl font-semibold text-lg bg-primary text-white flex items-center justify-center gap-2 hover:bg-primary/90 transition-all" aria-label="Enter SeedBase app">
                    Enter App
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {/* Desktop: scroll to content - Solid Blue Rectangle Outline */}
                  <Button variant="outline" onClick={scrollToContent} className="rounded-xl py-5 h-auto text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white min-h-[44px]" aria-label="Learn more about SeedBase">
                    Learn More
                    <ChevronDown className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </nav>
                
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Scroll Narrative - replaces carousel */}
        <div className="lg:hidden px-4 sm:px-6">
          <MobileScrollNarrative onEnterApp={() => setShowLoginModal(true)} />
        </div>

        {/* Login Modal */}
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onComplete={handleLoginComplete} />

        {/* Learn More Modal (Mobile) */}
        <Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
          <DialogContent className="sm:max-w-[420px] p-0 border-0 bg-transparent overflow-hidden">
            {/* Colored background container */}
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-4">
              {/* White floating card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center animate-scale-fade-in">
                    <span className="text-3xl">🌱</span>
                  </div>
                </div>
                <div className="opacity-0 animate-slide-fade-in">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-center mb-2">
                      What is SeedBase?
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <p className="text-muted-foreground leading-relaxed">
                      SeedBase is a social network where generosity compounds. Lock digital seeds, fund missions, or just show up—the surplus grows, the impact spreads, and trust rewards come back to everyone.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      It's a live feed of global blessing where every dollar is tracked and every seed grows.
                    </p>
                    <div className="pt-4">
                      <PrimaryButton onClick={() => {
                      setShowLearnMore(false);
                      setShowLoginModal(true);
                    }} className="w-full">
                        Get Started
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Right - Scrolling Content (desktop only) */}
        <main className="hidden lg:block lg:ml-[36%] lg:w-[64%] w-full pointer-events-none" ref={contentRef}>
          {/* Hero Card Section - Yellow with scrolling cards */}
          <section className="h-[620px] flex items-start pt-[32px] pl-0 pr-8 pointer-events-auto">
            <div className="bg-[#FDDE02] rounded-[48px] p-8 w-full h-full flex items-start justify-center relative overflow-hidden animate-content-reveal">
              <div className="animate-scroll-feed flex flex-col items-center gap-3 pt-4 w-full max-w-md">
                <div className="w-full">
                  <SeedFeedCard />
                </div>
                <div className="w-full">
                  <SeedFeedCardPeek />
                </div>
                <div className="w-full">
                  <SeedFeedCardPeekAlt />
                </div>
                <div className="w-full">
                  <SeedFeedCard />
                </div>
                <div className="w-full">
                  <SeedFeedCardPeek />
                </div>
                <div className="w-full">
                  <SeedFeedCardPeekAlt />
                </div>
              </div>
            </div>
          </section>

          {/* Scrolling Content Sections */}
          <div ref={desktopSectionsRef} className="scroll-mt-8" />
          {sections.map(section => <div key={section.id} className="flex items-start py-16 px-8 pointer-events-auto">
              <div className="flex flex-row gap-12 w-full">
                {/* Topic Text - Left side */}
                <div className="w-[45%] pt-16">
                  <div className="max-w-md">
                    <h2 className="font-heading text-3xl xl:text-4xl font-medium tracking-tight mb-6 text-foreground leading-[1.1]">
                      {section.headline}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-snug whitespace-pre-line">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                {/* Card - Right side */}
                <div className="flex justify-end flex-shrink-0">
                  <div className={`${section.bgImage ? 'bg-gradient-to-br from-teal-300 to-cyan-400' : section.bgColor} rounded-[32px] flex-shrink-0 flex justify-center min-w-[560px] w-[560px] min-h-[560px] h-[560px] overflow-hidden ${section.id === 'impact' ? 'items-start p-0' : 'items-center p-10'} ${section.id === 'wallet' ? 'animate-fade-in' : ''}`}>
                    <div className={`w-full max-w-md transform hover:scale-[1.01] transition-transform duration-300 ${section.id === 'wallet' ? 'animate-scale-in h-full' : ''}`}>
                      {renderCard(section.card, section.id)}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Full-width Seedbase Logo Above Footer */}
          <section className="py-12 px-8 flex justify-center pointer-events-auto">
            <button onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="cursor-pointer hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg w-full flex justify-center" aria-label="Scroll back to top of page">
              <img alt="Seedbase" className="w-full max-w-2xl h-auto transition-opacity duration-300 opacity-100" src={seeddropTypeLight} />
            </button>
          </section>

          {/* Footer Section */}
          <footer className="py-12 px-8 flex flex-col items-center gap-6 pointer-events-auto border-t border-gray-200">
            {/* Powered by CIK - Single, larger */}
            <img alt="Powered by Christ is King" className="h-8 object-contain" src={poweredByCik} />
            
            {/* Built on Base - logo same size as text */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Built on</span>
              <img src={baseLogo} alt="Base" className="h-3.5 w-auto" />
            </div>
            
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              © 2026 Christ is King Labs. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>;
};
export default ScrollingLandingPage;