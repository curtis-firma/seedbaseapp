import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnterAppButton from "@/components/ui/EnterAppButton";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import WalletCard from "@/components/cards/WalletCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import LedgerCard from "@/components/cards/LedgerCard";
import DashboardCard from "@/components/cards/DashboardCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import ImpactPreviewCard from "@/components/cards/ImpactPreviewCard";
import CampaignCard from "@/components/cards/CampaignCard";
import { seeddropTypeLight } from "@/components/shared/Logo";
import baseLogo from "@/assets/base-logo.png";
import poweredByCik from "@/assets/powered-by-cik-text.png";
import waterBackground from "@/assets/water-background.png";
import HeroVisualCanvas from "@/components/landing/HeroVisualCanvas";
import { useInView } from "@/hooks/useInView";
import FeatureSquareCard from "@/components/landing/FeatureSquareCard";
import LearnMoreModal from "@/components/landing/LearnMoreModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileSection {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  bgImage?: string;
  card: React.ReactNode;
}

interface MobileScrollNarrativeProps {
  onEnterApp: () => void;
}

// Animated section component with scroll-triggered entrance
const AnimatedSection = ({ section, index }: { section: MobileSection; index: number }) => {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2, triggerOnce: true });
  
  return (
    <section
      ref={ref}
      className={`flex flex-col gap-4 transition-all duration-700 ease-out ${
        isInView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      {/* Card with colored background - Using canonical FeatureSquareCard */}
      <div 
        className={`flex items-center justify-center transition-all duration-700 ${
          isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ transitionDelay: `${index * 50 + 100}ms` }}
      >
        <FeatureSquareCard 
          bgColor={section.bgColor} 
          bgImage={section.bgImage}
          animate
        >
          {section.card}
        </FeatureSquareCard>
      </div>

      {/* Section title and description - SECOND (below card, left-aligned) */}
      <div className={`space-y-2 text-left transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
           style={{ transitionDelay: `${index * 50 + 300}ms` }}>
        <h2 className="text-section font-semibold tracking-[-0.02em] text-foreground">
          {section.title}
        </h2>
        <p className="text-body text-muted-foreground leading-[1.5]">
          {section.description}
        </p>
      </div>
    </section>
  );
};

const MobileScrollNarrative = ({ onEnterApp }: MobileScrollNarrativeProps) => {
  const navigate = useNavigate();
  const [showLearnMore, setShowLearnMore] = useState(false);
  const isMobile = useIsMobile();

  const sections: MobileSection[] = [
    {
      id: "wallet",
      title: "A wallet built for giving",
      description: "Sign in with email or phone. Give instantly. Withdraw to your bank.",
      bgColor: "bg-landing-wallet",
      card: <WalletCard />,
    },
    {
      id: "impact",
      title: "See your impact",
      description: "A live social feed shows generosity in motion.",
      bgColor: "bg-landing-impact",
      card: <ImpactPreviewCard />,
    },
    {
      id: "spread",
      title: "See generosity spread",
      description: "Watch surplus move across people, places, and missions.",
      bgColor: "bg-landing-spread",
      bgImage: waterBackground,
      card: <CampaignCard />,
    },
    {
      id: "ledger",
      title: "Built on shared ledgers",
      description: "Every seed. Every surplus. Every deployment. Trust you can see.",
      bgColor: "bg-landing-ledger",
      card: <LedgerCard />,
    },
    {
      id: "seedbases",
      title: "Communities steward together",
      description: "Ministries and teams run seedbases. Same numbers. Shared clarity.",
      bgColor: "bg-landing-seedbases",
      card: <DashboardCard />,
    },
    {
      id: "tithing",
      title: "Transparent tithing",
      description: "See allocations. Vote on priorities. Track impact.",
      bgColor: "bg-landing-tithing",
      card: <TitheAllocationCard />,
    },
    {
      id: "movement",
      title: "Built by generosity",
      description: "Every seed grows. Every surplus spreads. Trust rewards come back.",
      bgColor: "bg-landing-movement",
      card: <GrowthReportCard />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* CTA Buttons - After hero */}
      <div className="flex flex-col gap-3 w-full">
        <EnterAppButton onClick={onEnterApp} fullWidth />
        <LearnMoreButton onClick={() => setShowLearnMore(true)} fullWidth variant="black" />
      </div>

      {/* Yellow Hero Card Section - only render on mobile */}
      <div className="flex items-center justify-center">
        <div className="w-full">
          {isMobile && <HeroVisualCanvas />}
        </div>
      </div>

      {/* Sections */}
      <div id="mobile-sections" className="flex flex-col gap-16">
        {sections.map((section, index) => (
          <AnimatedSection key={section.id} section={section} index={index} />
        ))}
      </div>

      {/* Seedbase Logo Above Footer - All Views */}
      <section className="py-12 flex justify-center">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="cursor-pointer hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg w-full flex justify-center"
          aria-label="Scroll back to top of page"
        >
          <img 
            alt="Seedbase" 
            className="w-full max-w-md h-auto transition-opacity duration-300 opacity-100" 
            src={seeddropTypeLight} 
          />
        </button>
      </section>

      {/* Mobile-only CTA Section */}
      <section className="flex flex-col items-center gap-6 py-8 border-t border-gray-200">
        <div className="text-center space-y-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Ready to enter the app?
          </h2>
          <p className="text-base text-muted-foreground">
            Join the Seedfeed and start tracking impact.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <EnterAppButton onClick={onEnterApp} fullWidth />
          <LearnMoreButton onClick={() => setShowLearnMore(true)} fullWidth variant="black" />
        </div>

        {/* Powered by CIK */}
        <img alt="Powered by Christ is King" className="h-12 object-contain" src={poweredByCik} />
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-4 pt-4">
        {/* Divider */}
        <div className="w-full h-px bg-gray-200" />

        {/* Built on Base - larger logo matching text size */}
        <div className="flex items-center gap-2 text-muted-foreground text-lg">
          <span>Built on</span>
          <img src={baseLogo} alt="Base" className="h-8 w-auto" />
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-sm text-center">
          © 2026 Christ is King Labs. All rights reserved.
        </p>
      </footer>

      {/* Learn More Modal */}
      <LearnMoreModal 
        open={showLearnMore} 
        onOpenChange={setShowLearnMore}
        onGetStarted={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => onEnterApp(), 300);
        }}
      />
    </div>
  );
};

export default MobileScrollNarrative;
