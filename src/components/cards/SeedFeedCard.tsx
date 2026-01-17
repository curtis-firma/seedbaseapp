import { ThumbsUp, MessageCircle, Heart, Bookmark } from "lucide-react";

const SeedFeedCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full max-w-sm">
      {/* User Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold">
          MT
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">Michael Thompson</span>
            <span className="text-muted-foreground text-sm">2m</span>
          </div>
          <span className="text-muted-foreground text-sm">@mike_seeds</span>
        </div>
      </div>
      
      <p className="text-foreground mb-3">
        Just planted a seed for the Tanzania School Project 🌱
      </p>
      
      {/* Impact Card */}
      <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 text-amber-900 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-800 text-sm font-medium">🌱 SEEDED</span>
        </div>
        
        <div className="font-heading text-4xl font-bold mb-1">$5,000</div>
        <div className="text-amber-800 text-sm mb-4">to Tanzania School Project</div>
        
        {/* Progress bar */}
        <div className="h-1 bg-amber-600/30 rounded-full mb-4">
          <div className="h-full w-[65%] bg-white rounded-full" />
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-amber-800">Your seed helped:</span>
          <span className="text-2xl font-bold">$7</span>
        </div>
        
        <div className="text-amber-700 text-sm mb-4">0.5% of this mission</div>
        
        <button className="w-full bg-primary text-primary-foreground rounded-[14px] py-2.5 font-medium hover:bg-primary/90 transition-colors">
          View Mission
        </button>
      </div>
      
      {/* Engagement */}
      <div className="flex items-center gap-6 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="w-4 h-4 text-emerald-500" />
          76
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4" />
          14
        </span>
        <span className="flex items-center gap-1.5">
          <Heart className="w-4 h-4" />
          89
        </span>
        <Bookmark className="w-4 h-4 ml-auto" />
      </div>
    </div>
  );
};

export default SeedFeedCard;
