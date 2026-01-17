import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Card Components
import HeroFeedCard from "@/components/cards/HeroFeedCard";
import WalletCard from "@/components/cards/WalletCard";
import SeedStackCard from "@/components/cards/SeedStackCard";
import PhotoFeedCard from "@/components/cards/PhotoFeedCard";
import LedgerCard from "@/components/cards/LedgerCard";
import DashboardCard from "@/components/cards/DashboardCard";
import TitheAllocationCard from "@/components/cards/TitheAllocationCard";
import ImpactDualCard from "@/components/cards/ImpactDualCard";

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

// Section wrapper component for consistent styling
const Section = ({ 
  id,
  headline, 
  subtext, 
  panelColor, 
  children,
  reverse = false 
}: { 
  id?: string;
  headline: string;
  subtext: string;
  panelColor: string;
  children: React.ReactNode;
  reverse?: boolean;
}) => (
  <section 
    id={id}
    className="grid"
    style={{ 
      gridTemplateColumns: reverse ? '640px 480px' : '480px 640px', 
      gap: '80px',
      marginBottom: '120px'
    }}
  >
    {reverse ? (
      <>
        {/* Right: Colored Panel First */}
        <div 
          className="relative flex items-center justify-center"
          style={{ 
            width: '640px', 
            height: '420px', 
            backgroundColor: panelColor,
            borderRadius: '48px',
            padding: '32px'
          }}
        >
          {children}
        </div>
        {/* Left: Text Content */}
        <div className="flex flex-col justify-center">
          <h2 
            className="font-bold text-foreground"
            style={{ 
              fontSize: '40px', 
              lineHeight: '48px', 
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}
          >
            {headline}
          </h2>
          <p 
            className="text-muted-foreground"
            style={{ fontSize: '16px', lineHeight: '1.6' }}
          >
            {subtext}
          </p>
        </div>
      </>
    ) : (
      <>
        {/* Left: Text Content */}
        <div className="flex flex-col justify-center">
          <h2 
            className="font-bold text-foreground"
            style={{ 
              fontSize: '40px', 
              lineHeight: '48px', 
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}
          >
            {headline}
          </h2>
          <p 
            className="text-muted-foreground"
            style={{ fontSize: '16px', lineHeight: '1.6' }}
          >
            {subtext}
          </p>
        </div>
        {/* Right: Colored Panel */}
        <div 
          className="relative flex items-center justify-center"
          style={{ 
            width: '640px', 
            height: '420px', 
            backgroundColor: panelColor,
            borderRadius: '48px',
            padding: '32px'
          }}
        >
          {children}
        </div>
      </>
    )}
  </section>
);

const ScrollingLandingPage = () => {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    navigate('/app');
  };

  const scrollToLearnMore = () => {
    document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div 
          className="mx-auto relative"
          style={{ 
            maxWidth: '1200px', 
            paddingLeft: '64px', 
            paddingRight: '64px', 
            paddingTop: '72px' 
          }}
        >
          {/* Logo - absolute positioned */}
          <img 
            src={seedbaseWordmark} 
            alt="Seedbase" 
            className="absolute"
            style={{ 
              left: '48px', 
              top: '32px',
              height: '28px'
            }}
          />

          {/* ========== HERO SECTION ========== */}
          <section 
            className="grid"
            style={{ 
              gridTemplateColumns: '480px 640px', 
              gap: '80px',
              marginBottom: '160px'
            }}
          >
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center" style={{ minHeight: '420px' }}>
              <h1 
                className="font-bold text-foreground"
                style={{ 
                  fontSize: '64px', 
                  lineHeight: '72px', 
                  letterSpacing: '-0.02em',
                  marginBottom: '24px'
                }}
              >
                Where<br />
                Generosity<br />
                Grows.
              </h1>

              <div 
                className="text-muted-foreground"
                style={{ 
                  fontSize: '16px', 
                  lineHeight: '1.6',
                  marginBottom: '32px'
                }}
              >
                <p>Seed digital dollars.</p>
                <p>Lock and watch it grow.</p>
                <p>Track your impact—live.</p>
                <p>Connect with others.</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleEnterApp}
                  className="bg-[#FBBF24] text-gray-900 hover:bg-[#F59E0B] font-semibold"
                  style={{ 
                    width: '260px', 
                    height: '48px', 
                    borderRadius: '24px',
                    fontSize: '16px'
                  }}
                >
                  Enter App
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={scrollToLearnMore}
                  className="font-medium border-gray-200 bg-white hover:bg-gray-50 text-foreground"
                  style={{ 
                    width: '260px', 
                    height: '44px', 
                    borderRadius: '24px',
                    fontSize: '16px'
                  }}
                >
                  Learn More
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div 
                className="font-semibold text-foreground"
                style={{ marginTop: '48px', fontSize: '14px' }}
              >
                Powered by CIK
              </div>
            </div>

            {/* Right Column - Yellow Panel */}
            <div 
              className="relative"
              style={{ 
                width: '640px', 
                height: '420px', 
                backgroundColor: '#FBBF24',
                borderRadius: '48px',
                padding: '48px'
              }}
            >
              {/* Peek Card */}
              <div 
                className="absolute bg-white rounded-[20px]"
                style={{
                  width: '320px',
                  height: '360px',
                  left: '120px',
                  top: '48px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                  opacity: 0.7
                }}
              />

              {/* Main Card */}
              <div 
                className="absolute bg-white rounded-[20px] overflow-hidden"
                style={{
                  width: '320px',
                  height: '360px',
                  left: '160px',
                  top: '32px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                }}
              >
                <HeroFeedCard />
              </div>
            </div>
          </section>

          {/* ========== SECTION 2: SEND INSTANTLY (Blue) ========== */}
          <Section
            id="learn-more"
            headline="Send instantly. Track forever."
            subtext="Transfer USDC to anyone, anywhere. Every transaction is recorded on-chain, giving you a permanent, transparent record of your generosity."
            panelColor="#3B82F6"
          >
            <div 
              className="bg-white rounded-[20px] overflow-hidden"
              style={{
                width: '320px',
                height: '360px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
              }}
            >
              <WalletCard />
            </div>
          </Section>

          {/* ========== SECTION 3: COMMIT & GROW (Green) ========== */}
          <Section
            headline="Commit. Watch it grow."
            subtext="Make seed commitments that compound over time. See your impact multiply as your generosity inspires others to join the mission."
            panelColor="#4ADE80"
            reverse
          >
            <SeedStackCard />
          </Section>

          {/* ========== SECTION 4: IMPACT STORIES (Cyan) ========== */}
          <Section
            headline="Impact as it happens."
            subtext="Follow the stories behind your seeds. See real photos, updates, and testimonials from the missions you support around the world."
            panelColor="#67E8F9"
          >
            <PhotoFeedCard />
          </Section>

          {/* ========== SECTION 5: SHARED LEDGER (Yellow) ========== */}
          <Section
            headline="Every seed, every surplus."
            subtext="Full transparency on every transaction. See exactly where funds flow, how surpluses are generated, and which missions benefit."
            panelColor="#FBBF24"
            reverse
          >
            <LedgerCard />
          </Section>

          {/* ========== SECTION 6: COMMUNITY STEWARDSHIP (Purple) ========== */}
          <Section
            headline="Community-led stewardship."
            subtext="Join a seedbase governed by its members. Vote on allocations, track growth rates, and maintain 100% transparency on all decisions."
            panelColor="#A78BFA"
          >
            <DashboardCard />
          </Section>

          {/* ========== SECTION 7: TRANSPARENT TITHING (Yellow) ========== */}
          <Section
            headline="Tithing, reimagined."
            subtext="See exactly how your tithe is allocated. Track distributions across missions, operations, reserves, and community initiatives—all held in stable USDC."
            panelColor="#FBBF24"
            reverse
          >
            <TitheAllocationCard />
          </Section>

          {/* ========== SECTION 8: BUILT BY GENEROSITY (Cyan) ========== */}
          <Section
            headline="Built by generosity."
            subtext="Join thousands of seeders making an impact across the globe. Together, we're funding missions, tracking outcomes, and growing a movement."
            panelColor="#67E8F9"
          >
            <ImpactDualCard />
          </Section>

          {/* ========== FOOTER ========== */}
          <footer className="py-24 flex flex-col items-center text-center">
            {/* Large Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer hover:scale-105 transition-transform duration-300 mb-8"
            >
              <img 
                src={seedbaseWordmark} 
                alt="Seedbase" 
                style={{ height: '48px' }}
              />
            </button>

            <p className="text-sm text-muted-foreground mb-2">
              © 2025 Seedbase. All rights reserved.
            </p>

            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
              Built on <span className="font-medium text-foreground">■ base</span>
            </p>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </footer>
        </div>
      </div>

      {/* ========== MOBILE LAYOUT ========== */}
      <div className="lg:hidden min-h-screen flex flex-col px-6 py-8">
        {/* Logo */}
        <img 
          src={seedbaseWordmark} 
          alt="Seedbase" 
          className="h-7 mb-6"
        />

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight mb-4">
          Where Generosity Grows.
        </h1>

        {/* Subtext */}
        <div className="text-base text-muted-foreground mb-8 space-y-0.5">
          <p>Seed digital dollars.</p>
          <p>Lock and watch it grow.</p>
          <p>Track your impact—live.</p>
          <p>Connect with others.</p>
        </div>

        {/* Mobile Card Preview */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div 
            className="relative"
            style={{ 
              width: '320px', 
              height: '380px', 
              backgroundColor: '#FBBF24',
              borderRadius: '32px',
              padding: '24px'
            }}
          >
            {/* Peek card */}
            <div 
              className="absolute bg-white"
              style={{
                width: '240px',
                height: '280px',
                borderRadius: '16px',
                left: '24px',
                top: '60px',
                boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                opacity: 0.7
              }}
            />
            {/* Main card */}
            <div 
              className="absolute bg-white overflow-hidden"
              style={{
                width: '240px',
                height: '280px',
                borderRadius: '16px',
                left: '56px',
                top: '40px',
                boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
              }}
            >
              <div className="transform scale-[0.75] origin-top-left">
                <HeroFeedCard />
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            onClick={handleEnterApp}
            className="w-full bg-[#FBBF24] text-gray-900 hover:bg-[#F59E0B] font-semibold"
            style={{ height: '48px', borderRadius: '24px', fontSize: '16px' }}
          >
            Enter App
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEnterApp}
            className="w-full font-medium border-border hover:bg-muted"
            style={{ height: '44px', borderRadius: '24px', fontSize: '16px' }}
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
            © 2025 Seedbase. All rights reserved.
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
