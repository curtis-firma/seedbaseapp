import { Button } from "@/components/ui/button";
import SeedFeedCard from "@/components/cards/SeedFeedCard";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative">
      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Sticky */}
        <div className="lg:w-[45%] lg:h-screen lg:sticky lg:top-0 flex items-center px-6 lg:px-16 py-20 lg:py-0">
          <div className="max-w-md">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-8">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]">
              The Transparent Network of Generosity
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Seed digital dollars.<br />
              Preserve principal.<br />
              Deploy surplus.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="base" className="text-base font-medium">
                Get Started
              </Button>
              <Button size="base" variant="ghost" className="text-base font-medium text-muted-foreground">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right Side - Scrollable */}
        <div className="lg:w-[55%] bg-secondary/30 px-6 lg:px-16 py-20 flex items-center justify-center min-h-screen">
          <div className="transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <SeedFeedCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
