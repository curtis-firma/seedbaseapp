import { MoreHorizontal } from "lucide-react";

const SeedFeedCardPeek = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-sm">
      {/* User Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">SeedFeed</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground text-sm">12m</span>
          </div>
          <span className="text-muted-foreground text-sm">@seedfeedHQ</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <p className="text-foreground mb-3">
        Surplus just deployed 🌍
      </p>
      
      {/* Light Impact Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌱</span>
          <span className="font-heading font-semibold text-foreground">Tanzania School Project</span>
        </div>
        
        <div className="font-heading text-3xl font-bold text-foreground mb-3">$2</div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">Your share:</span>
          <span className="font-heading text-lg font-bold text-primary">$2</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-slate-200 rounded-full mt-3">
          <div className="h-full w-[25%] bg-primary rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SeedFeedCardPeek;
