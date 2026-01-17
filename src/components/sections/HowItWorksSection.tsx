import { Sprout, Landmark, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Sprout,
      title: "Seed",
      subtitle: "Seed digital dollars",
      description: "Add USDC with Apple Pay, card, or bank. Your wallet is created instantly.",
      emoji: "🌱",
    },
    {
      icon: Landmark,
      title: "Store",
      subtitle: "Preserve capital",
      description: "Seed stays committed. Only surplus is used for impact.",
      emoji: "🧱",
    },
    {
      icon: Rocket,
      title: "Deploy",
      subtitle: "Fund missions",
      description: "Surplus flows to missions transparently — tracked on shared ledgers.",
      emoji: "🚀",
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-foreground">
            How it works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div 
              key={i} 
              className="bg-background rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-6">{step.emoji}</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{step.subtitle}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
