import GrowthReportCard from "@/components/cards/GrowthReportCard";
import ImpactStatsCard from "@/components/cards/ImpactStatsCard";

const MovementSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Built by people
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A growing network choosing transparency and shared impact.<br /><br />
              Every seed matters.<br />
              Every surplus counts.
            </p>
          </div>
          
          {/* Right - Visual Grid */}
          <div className="flex-1 flex gap-4 justify-center">
            <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <GrowthReportCard />
            </div>
            <div className="hidden lg:block transform rotate-1 translate-y-12 hover:rotate-0 transition-transform duration-300">
              <ImpactStatsCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovementSection;
