import { Sprout, Shield, Rocket } from "lucide-react";

const HowItWorksCard = () => {
  return (
    <div className="bg-secondary/50 rounded-2xl p-6 max-w-xs border border-border">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-6">
        How Seedbase Works
      </h3>
      
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Sprout className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-foreground">You seed digital dollars</div>
            <div className="text-sm text-muted-foreground">(USDC via card or bank)</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-foreground">Capital stays preserved</div>
            <div className="text-sm text-muted-foreground">Only surplus is used</div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="font-semibold text-foreground">Surplus funds missions</div>
            <div className="text-sm text-muted-foreground">Tracked in real time</div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Built on shared <span className="font-semibold text-foreground">digital ledgers</span>
        </span>
      </div>
    </div>
  );
};

export default HowItWorksCard;
