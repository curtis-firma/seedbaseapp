import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Card Components
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import SeedFeedCardPeek from "@/components/cards/SeedFeedCardPeek";
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import DashboardCard from "@/components/cards/DashboardCard";
import WalletCard from "@/components/cards/WalletCard";
import ImpactStatsCard from "@/components/cards/ImpactStatsCard";
import LedgerCard from "@/components/cards/LedgerCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

// Card data for mobile carousel
const carouselCards = [
  {
    id: "commitment",
    component: <SeedCommitmentCard />,
    bgColor: "bg-emerald-400",
    label: "See your impact"
  },
  {
    id: "impact",
    component: <ImpactStatsCard />,
    bgColor: "bg-emerald-400",
    label: "Generosity spreads"
  },
  {
    id: "wallet",
    component: <WalletCard />,
    bgColor: "bg-blue-500",
    label: "Built for giving"
  },
  {
    id: "dashboard",
    component: <DashboardCard />,
    bgColor: "bg-violet-500",
    label: "Steward together"
  },
  {
    id: "ledger",
    component: <LedgerCard />,
    bgColor: "bg-yellow-400",
    label: "Shared ledgers"
  },
  {
    id: "tithe",
    component: <TitheAllocationCard />,
    bgColor: "bg-amber-400",
    label: "Transparent tithing"
  },
  {
    id: "growth",
    component: <GrowthReportCard />,
    bgColor: "bg-cyan-500",
    label: "Built by generosity"
  }
];

const ScrollingLandingPage = () => {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sticky Column */}
        <div className="w-[40%] xl:w-[35%] sticky top-0 h-screen flex flex-col justify-between p-10 xl:p-16">
          {/* Top Content */}
          <div className="space-y-6">
            {/* Logo */}
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-8"
            />

            {/* Headline */}
            <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1]">
              Where<br />
              Generosity<br />
              Grows.
            </h1>

            {/* Subtext */}
            <div className="space-y-0.5 text-base text-muted-foreground">
              <p>Seed digital dollars.</p>
              <p>Lock and watch it grow.</p>
              <p>Track your impact—live.</p>
              <p>Connect with others.</p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2 max-w-sm">
              <Button
                onClick={handleDemoLogin}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-base font-semibold"
              >
                Continue as Demo King
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full rounded-xl py-6 text-base font-medium border-border hover:bg-muted"
              >
                Sign in as someone else
              </Button>
            </div>
          </div>

          {/* Bottom - Powered by CIK */}
          <div className="text-sm font-medium text-foreground">
            Powered by CIK
          </div>
        </div>

        {/* Right Scrollable Column */}
        <div className="flex-1 overflow-y-auto py-8 pr-8">
          {/* Section 1 - Yellow Island with SeedFeed */}
          <div className="mb-8">
            <div className="bg-yellow-400 rounded-[2.5rem] p-8 xl:p-12 min-h-[600px] flex items-start justify-center relative overflow-hidden">
              <div className="relative z-10 pt-4">
                <SeedFeedCard />
              </div>
              {/* Peek card at bottom */}
              <div className="absolute bottom-4 left-8 right-8">
                <SeedFeedCardPeek />
              </div>
            </div>
          </div>

          {/* Section 2 - Wallet */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                A wallet built for giving
              </h2>
              <div className="text-muted-foreground space-y-0.5">
                <p>Sign in with email or phone.</p>
                <p>Give instantly.</p>
                <p>Withdraw to your bank.</p>
                <p>Spend with a card.</p>
                <p className="pt-2 font-medium text-foreground">No crypto required.</p>
              </div>
            </div>
            <div className="bg-blue-500 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <WalletCard />
            </div>
          </div>

          {/* Section 3 - Impact */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="bg-emerald-400 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <SeedCommitmentCard />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                See your impact as it happens
              </h2>
              <p className="text-muted-foreground">
                A live social feed shows generosity in motion.
              </p>
            </div>
          </div>

          {/* Section 4 - Generosity Spreads */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                See generosity spread
              </h2>
              <p className="text-muted-foreground">
                Watch surplus move across people, places, and missions.
              </p>
            </div>
            <div className="bg-teal-400 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <ImpactStatsCard />
            </div>
          </div>

          {/* Section 5 - Ledger */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="bg-yellow-400 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <LedgerCard />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Built on shared ledgers
              </h2>
              <div className="text-muted-foreground space-y-1">
                <p>Every seed. Every surplus. Every deployment.</p>
                <p className="font-medium text-foreground">Trust you can see.</p>
              </div>
            </div>
          </div>

          {/* Section 6 - Dashboard */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Communities steward together
              </h2>
              <div className="text-muted-foreground space-y-0.5">
                <p>Ministries and teams run seedbases.</p>
                <p>Steward seed. Track tithes. Vote on missions.</p>
                <p className="font-medium text-foreground">Same numbers. Shared clarity.</p>
              </div>
            </div>
            <div className="bg-violet-500 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <DashboardCard />
            </div>
          </div>

          {/* Section 7 - Tithe */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="bg-amber-400 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <TitheAllocationCard />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Transparent tithing
              </h2>
              <div className="text-muted-foreground space-y-0.5">
                <p>Tithes go directly to a seedbase.</p>
                <p>See allocations. Vote on priorities. Track impact.</p>
                <p className="font-medium text-foreground">Held in USDC or CIK.</p>
              </div>
            </div>
          </div>

          {/* Section 8 - Growth */}
          <div className="mb-8 grid grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Built by generosity
              </h2>
              <div className="text-muted-foreground space-y-1">
                <p>Every seed. Every surplus. Every deployment.</p>
                <p className="font-medium text-foreground">Trust you can see.</p>
              </div>
            </div>
            <div className="bg-cyan-500 rounded-[2.5rem] p-8 flex items-center justify-center min-h-[400px]">
              <GrowthReportCard />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen flex flex-col px-6 py-8">
        {/* Logo */}
        <img 
          src={seedbaseWordmark} 
          alt="Seedbase" 
          className="h-7 mb-6"
        />

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-[1.1] mb-4">
          Where Generosity Grows.
        </h1>

        {/* Subtext */}
        <div className="space-y-0.5 text-base text-muted-foreground mb-8">
          <p>Seed digital dollars.</p>
          <p>Lock and watch it grow.</p>
          <p>Track your impact—live.</p>
          <p>Connect with others.</p>
        </div>

        {/* Mobile Card Carousel */}
        <div className="flex-1 mb-8 -mx-6">
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
            {carouselCards.map((card) => (
              <div key={card.id} className="flex-shrink-0 snap-center">
                <div className={`${card.bgColor} rounded-3xl p-4 w-[280px] h-[360px] flex items-center justify-center`}>
                  <div className="transform scale-[0.75] origin-center">
                    {card.component}
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-3">{card.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 mt-auto">
          <Button
            onClick={handleDemoLogin}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-base font-semibold"
          >
            Continue as Demo King
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDemoLogin}
            className="w-full rounded-xl py-6 text-base font-medium border-border hover:bg-muted"
          >
            Sign in as someone else
          </Button>
        </div>

        {/* Powered by */}
        <div className="text-center text-sm font-medium text-foreground mt-6">
          Powered by CIK
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background py-16 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer hover:scale-105 transition-transform duration-300 mx-auto block"
          >
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-10 mx-auto"
            />
          </button>

          <p className="text-sm text-muted-foreground">
            © 2026 Seedbase. All rights reserved.
          </p>

          <p className="text-sm text-muted-foreground">
            Built on ■ base
          </p>

          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScrollingLandingPage;
