import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import WalletCard from "@/components/cards/WalletCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import LedgerCard from "@/components/cards/LedgerCard";
import DashboardCard from "@/components/cards/DashboardCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import ImpactPreviewCard from "@/components/cards/ImpactPreviewCard";
import CampaignCard from "@/components/cards/CampaignCard";
import { Logo, seeddropTypeLight } from "@/components/shared/Logo";
import baseLogo from "@/assets/base-logo.png";
import poweredByCik from "@/assets/powered-by-cik-text.png";
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import SeedFeedCardPeek from "@/components/cards/SeedFeedCardPeek";
import SeedFeedCardPeekAlt from "@/components/cards/SeedFeedCardPeekAlt";

interface MobileSection {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  card: React.ReactNode;
}

interface MobileScrollNarrativeProps {
  onEnterApp: () => void;
}

const MobileScrollNarrative = ({ onEnterApp }: MobileScrollNarrativeProps) => {
  const navigate = useNavigate();

  const scrollToSections = () => {
    const firstSection = document.getElementById('mobile-sections');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections: MobileSection[] = [
    {
      id: "wallet",
      title: "A wallet built for giving",
      description: "Sign in with email or phone. Give instantly. Withdraw to your bank.",
      bgColor: "bg-blue-400",
      card: <WalletCard />,
    },
    {
      id: "impact",
      title: "See your impact",
      description: "A live social feed shows generosity in motion.",
      bgColor: "bg-emerald-400",
      card: <ImpactPreviewCard />,
    },
    {
      id: "spread",
      title: "See generosity spread",
      description: "Watch surplus move across people, places, and missions.",
      bgColor: "bg-teal-400",
      card: <CampaignCard />,
    },
    {
      id: "ledger",
      title: "Built on shared ledgers",
      description: "Every seed. Every surplus. Every deployment. Trust you can see.",
      bgColor: "bg-[#FDDE02]",
      card: <LedgerCard />,
    },
    {
      id: "steward",
      title: "Communities steward together",
      description: "Ministries and teams run seedbases. Same numbers. Shared clarity.",
      bgColor: "bg-violet-400",
      card: <DashboardCard />,
    },
    {
      id: "tithing",
      title: "Transparent tithing",
      description: "See allocations. Vote on priorities. Track impact.",
      bgColor: "bg-amber-400",
      card: <TitheAllocationCard />,
    },
    {
      id: "movement",
      title: "Built by generosity",
      description: "Every seed grows. Every surplus spreads. Trust rewards come back.",
      bgColor: "bg-cyan-400",
      card: <GrowthReportCard />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* CTA Buttons - After hero */}
      <div className="flex flex-col gap-3 w-full">
        {/* Enter App - Solid Blue Rectangle */}
        <button
          onClick={onEnterApp}
          className="w-full py-5 rounded-xl font-semibold text-lg bg-primary text-white flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
          aria-label="Enter SeedBase app"
        >
          Enter App
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Learn More - Solid Blue Outline */}
        <Button
          variant="outline"
          onClick={scrollToSections}
          className="w-full rounded-xl py-5 h-auto text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white"
        >
          Learn More
          <ChevronDown className="w-5 h-5 ml-2" />
        </Button>
      </div>

      {/* Yellow Hero Card Section - with scrolling cards */}
      <div className="bg-[#FDDE02] rounded-3xl p-4 overflow-hidden h-[400px]">
        <div className="animate-scroll-feed flex flex-col gap-3 pt-2">
          <SeedFeedCard />
          <SeedFeedCardPeek />
          <SeedFeedCardPeekAlt />
          <SeedFeedCard />
          <SeedFeedCardPeek />
        </div>
      </div>

      {/* Sections */}
      <div id="mobile-sections" className="flex flex-col gap-16">
        {sections.map((section, index) => (
          <section
            key={section.id}
            className="flex flex-col gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Section title and description */}
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </div>

            {/* Card with colored background */}
            <div className={`${section.bgColor} rounded-3xl p-4 flex items-center justify-center`}>
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
                {section.card}
              </div>
            </div>
          </section>
        ))}
      </div>

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
          {/* Primary CTA - Enter App - Solid Blue Rectangle */}
          <button
            onClick={onEnterApp}
            className="w-full py-5 rounded-xl font-semibold text-lg bg-primary text-white flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
            aria-label="Enter SeedBase app"
          >
            Enter the App
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary CTA - Create Account - Blue Outline */}
          <Button
            variant="outline"
            onClick={onEnterApp}
            className="w-full rounded-xl py-5 h-auto text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white"
          >
            Create an Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center gap-5 pt-4">
        {/* Divider */}
        <div className="w-full h-px bg-gray-200" />

        {/* Powered by CIK - 3x */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <img alt="Powered by Christ is King" className="h-3 object-contain opacity-60" src={poweredByCik} />
          <img alt="Powered by Christ is King" className="h-3 object-contain opacity-60" src={poweredByCik} />
          <img alt="Powered by Christ is King" className="h-3 object-contain opacity-60" src={poweredByCik} />
        </div>

        {/* Built on Base */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>Built on</span>
          <img src={baseLogo} alt="Base" className="h-5 w-auto" />
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-sm text-center">
          © 2026 Christ is King Labs. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>

        {/* Network pill */}
        <a
          href="https://seedbase.network"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gray-100 rounded-full text-foreground font-medium text-sm hover:bg-gray-200 transition-colors"
        >
          seedbase.network
        </a>
      </footer>
    </div>
  );
};

export default MobileScrollNarrative;
