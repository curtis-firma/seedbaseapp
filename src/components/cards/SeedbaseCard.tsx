import { BadgeCheck, MoreHorizontal } from "lucide-react";

const SeedbaseCard = () => {
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
              <span className="font-bold text-foreground">SeedFeed</span>
              <BadgeCheck className="w-4 h-4 text-primary fill-primary" />
            </div>
            <span className="text-muted-foreground text-sm">@seedfeedHQ · 47m</span>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <p className="text-foreground mb-3">
        🎉 A new SeedBase just launched!
      </p>
      
      {/* Seedbase Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-lg">⛪</span>
          </div>
          <div>
            <div className="font-bold">Hope Valley Church</div>
            <div className="text-sm text-white/70">Hope Valley Ministries</div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg px-3 py-2 my-3">
          <div className="text-sm font-medium">Early Seeder Bonus Active</div>
        </div>
        
        <div className="flex items-center gap-1 text-emerald-300 text-sm mb-4">
          <span>+</span>
          <span className="font-semibold">15% distribution weight</span>
        </div>
        
        <button className="w-full bg-primary text-primary-foreground rounded-[14px] py-2.5 font-medium hover:bg-primary/90 transition-colors">
          View SeedBase
        </button>
      </div>
    </div>
  );
};

export default SeedbaseCard;
