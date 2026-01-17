import LedgerCard from "@/components/cards/LedgerCard";

const LedgerSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Built on shared ledgers
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every seed.<br />
              Every surplus.<br />
              Every deployment.<br /><br />
              Trust you can see.
            </p>
          </div>
          
          {/* Right - Visual */}
          <div className="flex-1 flex justify-center">
            <div className="transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <LedgerCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LedgerSection;
