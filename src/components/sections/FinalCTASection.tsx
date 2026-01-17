import { Button } from "@/components/ui/button";

const FinalCTASection = () => {
  return (
    <section className="py-32 px-6 lg:px-16 bg-secondary/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Start seeding today
        </h2>
        <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
          Join a growing network choosing transparency, trust, and real-world impact.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="base" className="px-10 h-14 text-base font-medium">
            Get Started
          </Button>
          <Button size="base" variant="outline" className="px-10 h-14 text-base font-medium">
            Explore Seedbases
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
