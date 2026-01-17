import DashboardCard from "@/components/cards/DashboardCard";
import SeedbaseCard from "@/components/cards/SeedbaseCard";

const SeedbasesSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Communities steward together
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Churches, ministries, and teams run seedbases.<br /><br />
              Steward seed.<br />
              Track tithes.<br />
              Vote on missions.<br /><br />
              Same numbers. Shared clarity.
            </p>
          </div>
          
          {/* Right - Visual */}
          <div className="flex-1 flex gap-4 justify-center">
            <div className="transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <DashboardCard />
            </div>
            <div className="hidden md:block transform rotate-2 translate-y-8 hover:rotate-0 transition-transform duration-300">
              <SeedbaseCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeedbasesSection;
