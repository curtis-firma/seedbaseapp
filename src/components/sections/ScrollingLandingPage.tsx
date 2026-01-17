import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect, useCallback, ReactNode } from "react";

// Card Components
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import DashboardCard from "@/components/cards/DashboardCard";
import WalletCard from "@/components/cards/WalletCard";
import ImpactStatsCard from "@/components/cards/ImpactStatsCard";
import LedgerCard from "@/components/cards/LedgerCard";
import GrowthReportCard from "@/components/cards/GrowthReportCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import FeedCard from "@/components/cards/FeedCard";

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

interface CarouselCard {
  id: string;
  component: ReactNode;
  bgColor: string;
  label: string;
}

// Card data for mobile carousel
const carouselCards: CarouselCard[] = [
  {
    id: "wallet",
    component: <WalletCard />,
    bgColor: "bg-[#6B9CFA]",
    label: "Built for giving"
  },
  {
    id: "commitment",
    component: <SeedCommitmentCard />,
    bgColor: "bg-[#4ADE80]",
    label: "See your impact"
  },
  {
    id: "feed",
    component: <FeedCard />,
    bgColor: "bg-[#67E8F9]",
    label: "Generosity spreads"
  },
  {
    id: "ledger",
    component: <LedgerCard />,
    bgColor: "bg-[#FBBF24]",
    label: "Shared ledgers"
  },
  {
    id: "dashboard",
    component: <DashboardCard />,
    bgColor: "bg-[#A78BFA]",
    label: "Steward together"
  },
  {
    id: "tithe",
    component: <TitheAllocationCard />,
    bgColor: "bg-[#FBBF24]",
    label: "Transparent tithing"
  },
  {
    id: "growth",
    component: <GrowthReportCard />,
    bgColor: "bg-[#67E8F9]",
    label: "Built by generosity"
  }
];

// Mobile Carousel Component with auto-scroll
const MobileCarousel = ({ cards }: { cards: CarouselCard[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardWidth = 296;
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const nextIndex = (activeIndex + 1) % cards.length;
        const scrollPosition = nextIndex * cardWidth;
        
        scrollRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
        
        setActiveIndex(nextIndex);
      }
    }, 3500);
    
    return () => clearInterval(interval);
  }, [isPaused, activeIndex, cards.length]);
  
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < cards.length) {
        setActiveIndex(newIndex);
      }
    }
  }, [activeIndex, cards.length]);
  
  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const scrollPosition = index * cardWidth;
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };
  
  return (
    <div 
      className="flex-1 mb-6"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 5000)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cards.map((card, index) => (
          <div 
            key={card.id} 
            className="flex-shrink-0 snap-center transition-transform duration-300"
            style={{ 
              transform: activeIndex === index ? 'scale(1)' : 'scale(0.95)',
              opacity: activeIndex === index ? 1 : 0.7
            }}
          >
            <div className={`${card.bgColor} rounded-3xl p-4 w-[280px] h-[400px] flex items-center justify-center shadow-lg`}>
              <div className="transform scale-[0.8] origin-center">
                {card.component}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3 font-medium">{card.label}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === index 
                ? 'bg-primary w-6' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to card ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Section component for desktop
interface SectionProps {
  headline: string;
  subtext: React.ReactNode;
  card: ReactNode;
  islandColor: string;
  reverse?: boolean;
  hasWaterTexture?: boolean;
}

const Section = ({ headline, subtext, card, islandColor, reverse = false, hasWaterTexture = false }: SectionProps) => {
  return (
    <div className="grid grid-cols-[1fr_1fr] items-stretch min-h-[560px]">
      {/* Text Column */}
      <div className={`flex flex-col justify-center px-10 xl:px-16 ${reverse ? 'order-2' : 'order-1'}`}>
        <h2 className="text-[36px] xl:text-[40px] font-semibold text-foreground leading-[1.15] mb-5 tracking-[-0.01em]">
          {headline}
        </h2>
        <div className="text-muted-foreground text-[17px] leading-[1.6] space-y-1">
          {subtext}
        </div>
      </div>
      
      {/* Island Column - extends to viewport edge */}
      <div className={`${reverse ? 'order-1' : 'order-2'} relative`}>
        <div 
          className={`${islandColor} ${reverse ? 'rounded-r-[40px] ml-0' : 'rounded-l-[40px] mr-0'} h-full min-h-[560px] flex items-center justify-center px-10 xl:px-16 relative overflow-hidden`}
          style={{ 
            marginRight: reverse ? undefined : 'calc(-50vw + 50%)',
            marginLeft: reverse ? 'calc(-50vw + 50%)' : undefined,
            paddingRight: reverse ? undefined : 'calc(50vw - 50% + 40px)',
            paddingLeft: reverse ? 'calc(50vw - 50% + 40px)' : undefined
          }}
        >
          {/* Water caustics texture for cyan sections */}
          {hasWaterTexture && (
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.3)_0%,_transparent_70%)] animate-pulse-slow" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.2)_0%,_transparent_50%)] animate-float" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.2)_0%,_transparent_50%)] animate-float" style={{ animationDelay: '2s' }} />
            </div>
          )}
          <div className="relative z-10">
            {card}
          </div>
        </div>
      </div>
    </div>
  );
};

const ScrollingLandingPage = () => {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    navigate('/app');
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sticky Sidebar */}
        <div className="w-[420px] xl:w-[480px] flex-shrink-0 sticky top-0 h-screen flex flex-col justify-between py-12 px-12 xl:px-16">
          {/* Top Content */}
          <div className="space-y-10">
            {/* Logo */}
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-7"
            />

            {/* Headline */}
            <h1 className="text-[52px] xl:text-[60px] font-black text-foreground leading-[1.0] tracking-[-0.02em]">
              Where<br />
              Generosity<br />
              Grows.
            </h1>

            {/* Subtext */}
            <div className="space-y-0.5 text-[15px] text-muted-foreground leading-relaxed">
              <p>Seed digital dollars.</p>
              <p>Lock and watch it grow.</p>
              <p>Track your impact—live.</p>
              <p>Connect with others.</p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleEnterApp}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14 text-base font-semibold"
              >
                Enter App
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button
                variant="outline"
                onClick={scrollToContent}
                className="w-full rounded-full h-14 text-base font-medium border-gray-200 bg-white hover:bg-gray-50 text-foreground"
              >
                Learn More
                <ChevronDown className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Bottom - Powered by CIK */}
          <div className="text-sm font-semibold text-foreground">
            Powered by CIK
          </div>
        </div>

        {/* Right Scrollable Column */}
        <div className="flex-1 overflow-y-auto">
          {/* Section 1 - Wallet (Blue) */}
          <Section 
            headline="A wallet built for giving"
            subtext={
              <div className="space-y-1">
                <p>Sign in with email or phone.</p>
                <p>Give instantly.</p>
                <p>Withdraw to your bank.</p>
                <p>Spend with a card.</p>
                <p className="pt-3">No crypto required.</p>
              </div>
            }
            card={<WalletCard />}
            islandColor="bg-[#6B9CFA]"
          />

          {/* Section 2 - Impact Feed (Green) */}
          <Section 
            headline="See your impact as it happens"
            subtext={
              <p>A live social feed shows generosity in motion.</p>
            }
            card={<SeedCommitmentCard />}
            islandColor="bg-[#4ADE80]"
            reverse
          />

          {/* Section 3 - Generosity Spreads (Cyan with water texture) */}
          <Section 
            headline="See generosity spread"
            subtext={
              <p>Watch surplus move across people, places, and missions.</p>
            }
            card={<FeedCard />}
            islandColor="bg-[#67E8F9]"
            hasWaterTexture
          />

          {/* Section 4 - Shared Ledgers (Yellow) */}
          <Section 
            headline="Built on shared ledgers"
            subtext={
              <>
                <p>Every seed. Every surplus. Every deployment.</p>
                <p className="font-semibold text-foreground">Trust you can see.</p>
              </>
            }
            card={<LedgerCard />}
            islandColor="bg-[#FBBF24]"
            reverse
          />

          {/* Section 5 - Community Dashboard (Purple) */}
          <Section 
            headline="Communities steward together"
            subtext={
              <>
                <p>Ministries and teams run seedbases.</p>
                <p>Steward seed. Track tithes. Vote on missions.</p>
                <p className="font-semibold text-foreground">Same numbers. Shared clarity.</p>
              </>
            }
            card={<DashboardCard />}
            islandColor="bg-[#A78BFA]"
          />

          {/* Section 6 - Tithe Allocation (Yellow) */}
          <Section 
            headline="Transparent tithing"
            subtext={
              <>
                <p>Tithes go directly to a seedbase.</p>
                <p>See allocations. Vote on priorities. Track impact.</p>
                <p className="font-semibold text-foreground">Held in USDC or CIK.</p>
              </>
            }
            card={<TitheAllocationCard />}
            islandColor="bg-[#FBBF24]"
            reverse
          />

          {/* Section 7 - Growth Report (Cyan with water texture) */}
          <Section 
            headline="Built by generosity"
            subtext={
              <>
                <p>Every seed. Every surplus. Every deployment.</p>
                <p className="font-semibold text-foreground">Trust you can see.</p>
              </>
            }
            card={
              <div className="space-y-4">
                <GrowthReportCard />
                <ImpactStatsCard />
              </div>
            }
            islandColor="bg-[#67E8F9]"
            hasWaterTexture
          />

          {/* Footer within scrollable area */}
          <footer className="py-20 px-8 xl:px-16">
            <div className="max-w-xl space-y-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img 
                  src={seedbaseWordmark} 
                  alt="Seedbase" 
                  className="h-12"
                />
              </button>

              <p className="text-sm text-muted-foreground">
                © 2026 Seedbase. All rights reserved.
              </p>

              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Built on <span className="font-medium text-foreground">■ base</span>
              </p>

              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </footer>
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-[1.05] tracking-tight mb-4">
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
        <MobileCarousel cards={carouselCards} />

        {/* CTAs */}
        <div className="space-y-3 mt-auto">
          <Button
            onClick={handleEnterApp}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6 text-base font-semibold shadow-lg shadow-primary/20"
          >
            Enter App
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEnterApp}
            className="w-full rounded-xl py-6 text-base font-medium border-border hover:bg-muted"
          >
            Sign in
          </Button>
        </div>

        {/* Powered by */}
        <div className="text-center text-sm font-medium text-foreground mt-6">
          Powered by CIK
        </div>
      </div>

      {/* Mobile Footer */}
      <footer className="lg:hidden bg-background py-12 px-6 border-t border-border">
        <div className="text-center space-y-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer mx-auto block"
          >
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-8 mx-auto"
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
