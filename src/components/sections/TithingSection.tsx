import titheAllocationImage from "@/assets/tithe-allocation.png";

const TithingSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Right - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Transparent tithing
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Tithes go directly to a seedbase.<br /><br />
              See allocations.<br />
              Vote on priorities.<br />
              Track impact.<br /><br />
              Held in USDC or CIK.
            </p>
          </div>
          
          {/* Left - Visual */}
          <div className="flex-1 flex justify-center">
            <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <img 
                src={titheAllocationImage} 
                alt="Tithe Allocation showing Missions 40%, Operations 25%, Reserve 15%" 
                className="max-w-sm w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TithingSection;
