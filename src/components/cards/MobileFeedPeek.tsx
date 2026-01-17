import { ThumbsUp, MessageCircle, Heart, Bookmark } from "lucide-react";

const MobileFeedPeek = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 w-full">
      {/* Amber impact section - the "seeded" preview */}
      <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌱</span>
          <span className="font-heading font-semibold text-sm">Tanzania School Project</span>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm">
            Your seed helped: <span className="font-bold text-lg">$7</span>
          </div>
          <div className="text-xs opacity-90">0.5% of this mission</div>
        </div>
        
        <button className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
          View Mission
        </button>
      </div>
      
      {/* Engagement row */}
      <div className="flex items-center justify-between mt-4 text-muted-foreground">
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">76</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">14</span>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4" />
          <span className="text-sm">89</span>
        </div>
        <Bookmark className="w-4 h-4" />
      </div>
    </div>
  );
};

export default MobileFeedPeek;
