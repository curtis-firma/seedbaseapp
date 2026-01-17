import { MoreHorizontal, BadgeCheck } from "lucide-react";

const MicroDistributionCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xs border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-background" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-heading font-bold text-foreground">SeedFeed</span>
              <BadgeCheck className="w-4 h-4 text-primary fill-primary" />
            </div>
            <span className="text-muted-foreground text-sm">@seedfeedHQ · 12m</span>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <p className="text-foreground mb-3">
        Surplus just deployed 🌍
      </p>
      
      {/* Mission Card */}
      <div className="bg-secondary rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌱</span>
          <span className="font-heading font-semibold text-foreground">Tanzania School Project</span>
        </div>
        
        <div className="text-center mb-3">
          <div className="font-heading text-4xl font-bold text-foreground">$2</div>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-muted-foreground">Your share:</span>
          <span className="font-bold text-primary">$2</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full mb-4">
          <div className="h-full w-[45%] bg-emerald-400 rounded-full" />
        </div>
        
        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors">
          See Impact
        </button>
      </div>
    </div>
  );
};

export default MicroDistributionCard;
