import { Heart, MessageCircle, Bookmark, ThumbsUp } from "lucide-react";

const SeedFeedCard = () => {
  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
          MJ
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Maria Johnson</p>
          <p className="text-gray-500 text-xs">@mariaj_seeds · 5m</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 text-sm leading-relaxed">
        Just planted a seed for the Tanzania School Project 🌱
      </p>

      {/* Embedded Seed Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 mb-4 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
            🌱 SEEDED
          </span>
        </div>
        <p className="font-bold text-2xl text-gray-900 mb-1">$5,000</p>
        <p className="text-gray-600 text-sm mb-3">to Tanzania School Project</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div>
            <span className="text-emerald-600 font-semibold">Your seed helped: $7</span>
          </div>
          <div className="text-right">
            <span>0.5% of this mission</span>
          </div>
        </div>
      </div>

      {/* Engagement Row */}
      <div className="flex items-center gap-4 text-gray-500">
        <button className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-xs">76</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">14</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-xs">89</span>
        </button>
        <button className="ml-auto hover:text-amber-500 transition-colors">
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeedFeedCard;
