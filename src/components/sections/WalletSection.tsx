import WalletCard from "@/components/cards/WalletCard";

const WalletSection = () => {
  return (
    <section className="py-24 px-6 lg:px-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          {/* Right - Text */}
          <div className="flex-1 max-w-lg">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-foreground">
              A wallet built for giving
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Sign in with email or phone.<br />
              Give instantly.<br />
              Withdraw to your bank.<br />
              Spend with a card.<br /><br />
              No crypto required.
            </p>
          </div>
          
          {/* Left - Visual */}
          <div className="flex-1 flex justify-center">
            <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <WalletCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WalletSection;
