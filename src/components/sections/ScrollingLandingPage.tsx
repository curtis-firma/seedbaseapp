import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Card Components
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

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

const sections = [
  {
    id: "wallet",
    headline: "A wallet built for giving",
    description: "Sign in with email or phone.\nGive instantly.\nWithdraw to your bank.\nSpend with a card.\n\nNo crypto required.",
    card: "wallet",
    bgColor: "bg-blue-400"
  },
  {
    id: "impact",
    headline: "See your impact as it happens",
    description: "A live social feed shows generosity in motion.",
    card: "commitment",
    bgColor: "bg-emerald-400"
  },
  {
    id: "spread",
    headline: "See generosity spread",
    description: "Watch surplus move across people, places, and missions.",
    card: "campaign",
    bgColor: "bg-teal-400"
  },
  {
    id: "ledger",
    headline: "Built on shared ledgers",
    description: "Every seed. Every surplus. Every deployment.\n\nTrust you can see.",
    card: "ledger",
    bgColor: "bg-yellow-400"
  },
  {
    id: "steward",
    headline: "Communities steward together",
    description: "Ministries and teams run seedbases.\n\nSteward seed. Track tithes. Vote on missions.\n\nSame numbers. Shared clarity.",
    card: "dashboard",
    bgColor: "bg-violet-400"
  },
  {
    id: "tithe",
    headline: "Transparent tithing",
    description: "Tithes go directly to a seedbase.\n\nSee allocations. Vote on priorities. Track impact.\n\nHeld in USDC or CIK.",
    card: "tithe",
    bgColor: "bg-amber-400"
  },
  {
    id: "growth",
    headline: "Built by generosity",
    description: "Every seed. Every surplus. Every deployment.\n\nTrust you can see.",
    card: "growth",
    bgColor: "bg-cyan-400"
  }
];

const ScrollingLandingPage = () => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);

  const handleLaunchDemo = () => {
    navigate('/app');
  };

  const renderCard = (cardType: string, sectionId: string) => {
    switch (cardType) {
      case "wallet":
        return <WalletCard />;
      case "commitment":
        return <SeedCommitmentCard />;
      case "campaign":
        return <ImpactStatsCard />;
      case "ledger":
        return <LedgerCard />;
      case "dashboard":
        return <DashboardCard />;
      case "tithe":
        return <TitheAllocationCard />;
      case "growth":
        return <GrowthReportCard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={seedbaseWordmark} 
            alt="Seedbase" 
            className="h-10 md:h-12"
          />
        </div>

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight animate-fade-in">
            Where Generosity Grows.
          </h1>
          <div className="space-y-1 text-lg md:text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p>Seed digital dollars.</p>
            <p>Lock and watch it grow.</p>
            <p>Track your impact—live.</p>
            <p>Connect with others.</p>
          </div>
        </div>

        {/* Mobile Card Carousel */}
        <div className="w-full max-w-4xl mx-auto mb-8 lg:hidden">
          <MobileCardCarousel />
        </div>

        {/* Desktop Card Preview - Hidden on mobile */}
        <div className="hidden lg:flex items-center justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <SeedFeedCard />
          </div>
          <div className="transform rotate-3 hover:rotate-0 transition-transform duration-500 -translate-y-4">
            <SeedFeedCardPeek />
          </div>
          <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <SeedFeedCardPeekAlt />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <PrimaryButton 
            onClick={handleLaunchDemo}
            className="px-8 py-6 text-lg min-h-[56px]"
          >
            Launch Demo
          </PrimaryButton>
          
          <Button
            variant="outline"
            onClick={() => setShowLearnMore(true)}
            className="lg:hidden rounded-xl py-5 sm:py-6 text-base sm:text-lg font-medium border-border hover:bg-muted min-h-[56px]"
          >
            Learn More
            <ChevronDown className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="ghost"
            onClick={handleLaunchDemo}
            className="hidden lg:flex rounded-xl py-5 sm:py-6 text-base sm:text-lg font-medium hover:bg-muted min-h-[56px]"
          >
            Sign In
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Scroll Indicator - Desktop only */}
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground animate-bounce">
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* Desktop Scrolling Sections */}
      <div className="hidden lg:block">
        {sections.map((section, index) => (
          <section 
            key={section.id}
            className={`min-h-screen flex items-center ${section.bgColor} transition-colors duration-500`}
          >
            <div className="container mx-auto px-8 py-16">
              <div className={`flex items-center gap-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Text Content */}
                <div className="flex-1 text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {section.headline}
                  </h2>
                  <p className="text-xl md:text-2xl opacity-90 whitespace-pre-line leading-relaxed">
                    {section.description}
                  </p>
                </div>

                {/* Card */}
                <div className="flex-1 flex justify-center">
                  <div className="transform hover:scale-105 transition-transform duration-500">
                    {renderCard(section.card, section.id)}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start seeding?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the transparent network of generosity. Every seed grows, every gift is tracked, every impact is visible.
          </p>
          <PrimaryButton 
            onClick={handleLaunchDemo}
            className="px-8 py-6 text-lg"
          >
            Enter Demo
          </PrimaryButton>
        </div>

        {/* Logo Footer */}
        <div className="mt-16 flex justify-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-8 opacity-50 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </section>

      {/* Learn More Modal (Mobile) */}
      <Dialog open={showLearnMore} onOpenChange={setShowLearnMore}>
        <DialogContent className="sm:max-w-[420px] p-6 rounded-3xl">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">What is SeedBase?</h3>
            <p className="text-muted-foreground leading-relaxed">
              SeedBase is a social network where generosity compounds. Lock digital seeds, fund missions, or just show up—the surplus grows, the impact spreads, and trust rewards come back to everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              It's a live feed of global blessing where every dollar is tracked and every seed grows.
            </p>
            <PrimaryButton 
              onClick={() => {
                setShowLearnMore(false);
                handleLaunchDemo();
              }}
              className="w-full py-6"
            >
              Get Started
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScrollingLandingPage;
