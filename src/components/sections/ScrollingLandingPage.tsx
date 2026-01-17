import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ChevronDown, ArrowRight } from "lucide-react";
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import SeedFeedCardPeek from "@/components/cards/SeedFeedCardPeek";
import SeedFeedCardPeekAlt from "@/components/cards/SeedFeedCardPeekAlt";
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import MobileCardCarousel from "@/components/cards/MobileCardCarousel";
import DashboardCard from "@/components/cards/DashboardCard";
import LedgerCard from "@/components/cards/LedgerCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import ImpactStatsCard from "@/components/cards/ImpactStatsCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import WalletCard from "@/components/cards/WalletCard";
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";
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
  card: "commitment",
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
      return <div className="relative w-full h-full overflow-hidden flex justify-center">
          <div className={`animate-scroll-feed flex flex-col gap-3 pt-4 w-full max-w-sm`}>
            <SeedCommitmentCard />
            <SeedFeedCard />
            <SeedCommitmentCard />
            <SeedFeedCard />
          </div>
        </div>;
    }
    switch (cardType) {
      case "feed":
        return <div className={`aspect-square w-full ${compact ? 'max-w-xs' : 'max-w-sm'} rounded-2xl bg-white/20 border-2 border-white/40`} />;
      case "campaign":
        return <div className={`${compact ? 'max-w-xs' : 'max-w-sm'} w-full aspect-square rounded-2xl bg-cover bg-center flex items-center justify-center overflow-hidden`} style={{
          backgroundImage: `url(${generositySpread})`
        }} />;
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
          {/* Seedbase wordmark logo at top */}
          <img alt="Seedbase - Transparent Network of Generosity" className="w-32 lg:w-40 xl:w-48 h-auto mb-2 lg:mb-0" src="/lovable-uploads/52edf2f7-f6a7-464b-b0ff-d0e5d962e4d6.png" />
          
          <div className="max-w-sm flex flex-col flex-1">
            {/* Hero content centered vertically on desktop */}
            <div className="flex-1 flex items-center lg:justify-center">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 lg:mb-6 text-foreground leading-[1.05]">
                  Where Generosity Grows.
                </h1>
                
                <div className="text-lg text-muted-foreground mb-3 lg:mb-8 leading-snug">
                  <span className="block opacity-0 animate-fade-in-stagger-1">Seed digital dollars.</span>
                  <span className="block opacity-0 animate-fade-in-stagger-2">Lock and watch it grow.</span>
                  <span className="block opacity-0 animate-fade-in-stagger-3">Track your impact—live.</span>
                  <span className="block opacity-0 animate-fade-in-stagger-4">Connect with others.</span>
                </div>
                
                {/* Mobile Card Carousel - between tagline and buttons */}
                <div className="lg:hidden w-full overflow-hidden">
                  <MobileCardCarousel />
                </div>
                
                {/* CTA Buttons */}
                <nav className="flex flex-col gap-3 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm" role="navigation" aria-label="Main actions">
                  {/* Enter App - Blue with white ring glow */}
                  <button onClick={() => setShowLoginModal(true)} className="relative w-full py-6 rounded-full font-semibold text-base sm:text-lg bg-[hsl(221,83%,53%)] text-white flex items-center justify-center gap-2 hover:bg-[hsl(221,83%,48%)] transition-all shadow-[0_0_0_4px_white,0_0_20px_rgba(59,130,246,0.5)]" aria-label="Enter SeedBase app">
                    Enter App
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  {/* Mobile: open modal */}
                  <Button variant="outline" onClick={() => setShowLearnMore(true)} className="lg:hidden rounded-full py-6 text-base sm:text-lg font-medium bg-gray-50 border-gray-200 hover:bg-gray-100 min-h-[44px]" aria-label="Learn more about SeedBase">
                    Learn More
                    <ChevronDown className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                  
                  {/* Desktop: scroll to content */}
                  <Button variant="outline" onClick={scrollToContent} className="hidden lg:inline-flex rounded-full py-6 text-base sm:text-lg font-medium bg-gray-50 border-gray-200 hover:bg-gray-100 min-h-[44px]" aria-label="Learn more about SeedBase">
                    Learn More
                    <ChevronDown className="w-5 h-5 ml-2" aria-hidden="true" />
                  </Button>
                </nav>
                
                {/* Powered by CIK */}
                <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-sm flex justify-center lg:justify-start mt-3">
                  <img alt="Powered by Christ is King" className="h-4 opacity-0 animate-fade-in-stagger-5 object-contain" src="/lovable-uploads/77b981db-2bff-491e-bbe7-64c8bb64864f.png" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <footer className="lg:hidden mt-8 mb-8 flex flex-col items-center gap-5 w-full">
            {/* Divider */}
            <div className="w-full h-px bg-gray-200" />
            
            {/* Copyright */}
            <p className="text-muted-foreground text-sm">
              © 2026 Seedbase. All rights reserved.
            </p>
            
            {/* Built on Base */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Built on</span>
              <img src={baseLogo} alt="Base" className="h-5 w-auto" />
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            
            {/* Network pill */}
            <a href="https://seedbase.network" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gray-100 rounded-full text-foreground font-medium text-sm hover:bg-gray-200 transition-colors">
              seedbase.network
            </a>
          </footer>
        </header>

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
          {/* Hero Card Section */}
          <section className="h-[620px] flex items-start pt-[32px] pl-0 pr-8 pointer-events-auto">
            <div className="bg-[#FDDE02] rounded-[48px] p-8 w-full h-full flex items-start justify-center relative overflow-hidden animate-content-reveal">
              <div className="flex flex-col items-center gap-2 pt-4 w-full max-w-sm">
                <div className="w-full opacity-0 animate-card-appear-1">
                  <SeedFeedCard />
                </div>
                <div className="w-full opacity-0 animate-card-appear-2">
                  <SeedFeedCardPeek />
                </div>
                <div className="w-full opacity-0 animate-card-appear-3">
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
                  <div className={`${section.bgImage ? 'bg-gradient-to-br from-teal-300 to-cyan-400' : section.bgColor} rounded-[32px] flex-shrink-0 flex justify-center min-w-[560px] w-[560px] min-h-[560px] h-[560px] overflow-hidden ${section.id === 'impact' ? 'items-start p-0' : 'items-center p-8'} ${section.id === 'wallet' ? 'animate-fade-in' : ''}`}>
                    <div className={`transform hover:scale-[1.01] transition-transform duration-300 flex items-center justify-center ${section.id === 'wallet' ? 'animate-scale-in' : ''}`}>
                      {renderCard(section.card, section.id)}
                    </div>
                  </div>
                </div>
              </div>
            </div>)}

          {/* Closing Logo Section */}
          <section className="py-32 px-8 flex items-center justify-center pointer-events-auto" aria-label="Return to top">
            <button onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="cursor-pointer hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg" aria-label="Scroll back to top of page">
              <img alt="SeedBase" className="w-[700px] max-w-[95vw] h-auto transition-opacity duration-300 opacity-100" src="/lovable-uploads/5a45fcb7-88b5-46ce-85d2-9d32748b4fb8.png" />
            </button>
          </section>
        </main>
      </div>
    </div>;
};
export default ScrollingLandingPage;