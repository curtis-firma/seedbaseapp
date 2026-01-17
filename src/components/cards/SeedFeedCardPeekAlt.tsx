import { MoreHorizontal } from "lucide-react";

const SeedFeedCardPeekAlt = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-sm">
      {/* User Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
          JR
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">Julia Reyes</span>
            <span className="text-muted-foreground text-sm">28m</span>
          </div>
          <span className="text-muted-foreground text-sm">@julia_gives</span>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      <p className="text-foreground mb-3">
        My first seed is growing! 🌿
      </p>
    </div>
  );
};

export default SeedFeedCardPeekAlt;
