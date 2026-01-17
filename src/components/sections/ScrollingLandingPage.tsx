import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Card Components
import SeedFeedCard from "@/components/cards/SeedFeedCard";
import SeedCommitmentCard from "@/components/cards/SeedCommitmentCard";
import DashboardCard from "@/components/cards/DashboardCard";
import WalletCard from "@/components/cards/WalletCard";

// Assets
import seedbaseWordmark from "@/assets/seedbase-wordmark.svg";

const ScrollingLandingPage = () => {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Split-Screen Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sticky Column */}
        <div className="w-[45%] sticky top-0 h-screen flex flex-col justify-between p-12 xl:p-16">
          {/* Top Content */}
          <div className="space-y-8">
            {/* Logo */}
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-10"
            />

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1]">
                Where
              </h1>
              <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1]">
                Generosity
              </h1>
              <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-[1.1]">
                Grows.
              </h1>
            </div>

            {/* Subtext */}
            <div className="space-y-1 text-lg text-muted-foreground">
              <p>Seed digital dollars.</p>
              <p>Lock and watch it grow.</p>
              <p>Track your impact—live.</p>
              <p>Connect with others.</p>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-4">
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
          <div className="text-sm text-muted-foreground">
            Powered by CIK
          </div>
        </div>

        {/* Right Scrollable Column */}
        <div className="w-[55%] overflow-y-auto">
          {/* Section 1 - Yellow - Hero/Feed */}
          <section className="min-h-screen bg-yellow-400 flex items-center justify-center p-12">
            <div className="transform hover:scale-[1.02] transition-transform duration-500">
              <SeedFeedCard />
            </div>
          </section>

          {/* Section 2 - Blue - Wallet */}
          <section className="min-h-screen bg-blue-500 flex items-center p-12">
            <div className="flex-1 space-y-8">
              <div className="text-white">
                <h2 className="text-4xl xl:text-5xl font-bold mb-4">
                  A wallet built for giving
                </h2>
                <div className="text-xl opacity-90 space-y-1">
                  <p>Sign in with email or phone.</p>
                  <p>Give instantly.</p>
                  <p>Withdraw to your bank.</p>
                  <p>Spend with a card.</p>
                  <p className="pt-2 font-medium">No crypto required.</p>
                </div>
              </div>
              <div className="transform hover:scale-[1.02] transition-transform duration-500">
                <WalletCard />
              </div>
            </div>
          </section>

          {/* Section 3 - Green - Impact */}
          <section className="min-h-screen bg-emerald-500 flex items-center p-12">
            <div className="flex-1 space-y-8">
              <div className="text-white">
                <h2 className="text-4xl xl:text-5xl font-bold mb-4">
                  See your impact as it happens
                </h2>
                <p className="text-xl opacity-90">
                  A live social feed shows generosity in motion.
                </p>
              </div>
              <div className="transform hover:scale-[1.02] transition-transform duration-500">
                <SeedCommitmentCard />
              </div>
            </div>
          </section>

          {/* Section 4 - Cyan - Dashboard */}
          <section className="min-h-screen bg-cyan-500 flex items-center p-12">
            <div className="flex-1 space-y-8">
              <div className="text-white">
                <h2 className="text-4xl xl:text-5xl font-bold mb-4">
                  Communities steward together
                </h2>
                <div className="text-xl opacity-90 space-y-1">
                  <p>Ministries and teams run seedbases.</p>
                  <p>Steward seed. Track tithes. Vote on missions.</p>
                  <p>Same numbers. Shared clarity.</p>
                </div>
              </div>
              <div className="transform hover:scale-[1.02] transition-transform duration-500">
                <DashboardCard />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Hero */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-yellow-400">
          {/* Logo */}
          <img 
            src={seedbaseWordmark} 
            alt="Seedbase" 
            className="h-8 mb-8"
          />

          {/* Headline */}
          <h1 className="text-4xl font-bold text-foreground text-center leading-tight mb-4">
            Where Generosity Grows.
          </h1>

          {/* Subtext */}
          <div className="text-center text-muted-foreground space-y-1 mb-8">
            <p>Seed digital dollars.</p>
            <p>Lock and watch it grow.</p>
            <p>Track your impact—live.</p>
            <p>Connect with others.</p>
          </div>

          {/* Card Preview */}
          <div className="w-full max-w-sm mb-8">
            <SeedFeedCard />
          </div>

          {/* CTAs */}
          <div className="w-full max-w-sm space-y-3">
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
              className="w-full rounded-xl py-6 text-base font-medium border-border bg-background hover:bg-muted"
            >
              Sign in as someone else
            </Button>
          </div>

          {/* Powered by */}
          <div className="mt-8 text-sm text-muted-foreground">
            Powered by CIK
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-background py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer hover:scale-105 transition-transform duration-300 mx-auto block"
          >
            <img 
              src={seedbaseWordmark} 
              alt="Seedbase" 
              className="h-12 mx-auto"
            />
          </button>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2026 Seedbase. All rights reserved.
          </p>

          {/* Built on Base */}
          <p className="text-sm text-muted-foreground">
            Built on ■ base
          </p>

          {/* Links */}
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
