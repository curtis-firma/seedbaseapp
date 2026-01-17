import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Card Components
import WalletCard from "@/components/cards/WalletCard";

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

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
      {/* Desktop Layout - Pixel Perfect */}
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

          {/* Two Column Layout */}
          <div 
            className="grid"
            style={{ 
              gridTemplateColumns: '480px 640px', 
              gap: '80px' 
            }}
          >
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center" style={{ minHeight: '420px' }}>
              {/* Headline */}
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

              {/* Subtext */}
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

              {/* CTAs */}
              <div className="space-y-3">
                <Button
                  onClick={handleEnterApp}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  style={{ 
                    width: '260px', 
                    height: '48px', 
                    borderRadius: '12px',
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
                    borderRadius: '12px',
                    fontSize: '16px'
                  }}
                >
                  Learn More
                  <ChevronDown className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Powered by */}
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
              {/* Partial Second Card Behind (peek) */}
              <div 
                className="absolute bg-white"
                style={{
                  width: '320px',
                  height: '360px',
                  borderRadius: '20px',
                  left: '120px',
                  top: '48px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                  opacity: 0.7
                }}
              />

              {/* Main Floating White Card */}
              <div 
                className="absolute bg-white overflow-hidden"
                style={{
                  width: '320px',
                  height: '360px',
                  borderRadius: '20px',
                  left: '160px',
                  top: '32px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                }}
              >
                <WalletCard />
              </div>
            </div>
          </div>
        </div>

        {/* Learn More Section */}
        <div id="learn-more" className="py-32 px-16 max-w-[1200px] mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-8">
            Learn More
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Seedbase is a platform for generosity. Seed digital dollars, watch them grow, 
            track your impact in real-time, and connect with others who share your values.
          </p>
        </div>

        {/* Footer */}
        <footer className="py-16 px-16 max-w-[1200px] mx-auto">
          <div className="space-y-6">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={seedbaseWordmark} 
                alt="Seedbase" 
                style={{ height: '32px' }}
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

      {/* Mobile/Tablet Layout */}
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
                <WalletCard />
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            onClick={handleEnterApp}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            style={{ height: '48px', borderRadius: '12px', fontSize: '16px' }}
          >
            Enter App
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEnterApp}
            className="w-full font-medium border-border hover:bg-muted"
            style={{ height: '44px', borderRadius: '12px', fontSize: '16px' }}
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
