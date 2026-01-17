import MicroDistributionCard from "@/components/cards/MicroDistributionCard";
import HowItWorksCard from "@/components/cards/HowItWorksCard";

const ImpactFeedSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Visual Stack */}
          <div className="flex-1 flex gap-4 justify-center">
            <div className="space-y-4">
              <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <MicroDistributionCard />
              </div>
              <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300 opacity-80 scale-95">
                <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span>🌱</span>
                    </div>
                    <span className="font-medium text-foreground">Your seed helped</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">$3</div>
                </div>
              </div>
              <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-300 opacity-60 scale-90">
                <div className="bg-white rounded-2xl shadow-lg p-4 max-w-xs border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span>🌱</span>
                    </div>
                    <span className="font-medium text-foreground">Your seed helped</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">$20</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block transform translate-y-12">
              <HowItWorksCard />
            </div>
          </div>
          
          {/* Right - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              See generosity spread
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Watch surplus move across people, places, and missions.<br /><br />
              Your impact may appear as $2, $7, or $20 — shared globally.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactFeedSection;
