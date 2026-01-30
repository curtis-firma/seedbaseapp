import { Heart, MessageCircle, Share2 } from "lucide-react";

const HeroFeedCard = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center text-white font-bold text-sm">
          MT
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-tight">Michael Thompson</p>
          <p className="text-gray-500 text-xs">@michaelthompson_cik</p>
        </div>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3">
        <p className="text-gray-700 text-sm leading-relaxed">
          Just posted a seed to the Tanzania School Project
        </p>
      </div>

      {/* Amount Section */}
      <div className="px-4 pb-3">
        <p className="font-bold text-[36px] text-[#F97316] leading-none tracking-tight">$5,000</p>
        <p className="text-gray-500 text-sm mt-1">to Tanzania School Project</p>
      </div>

      {/* View Mission Button */}
      <div className="px-4 pb-3">
        <button className="w-full py-2.5 bg-[#FBBF24] text-gray-900 font-semibold rounded-xl text-sm hover:bg-[#F59E0B] transition-colors">
          View Mission
        </button>
      </div>

      {/* Your seed helped */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <p className="text-gray-500 text-sm">Your seed helped:</p>
        <p className="font-bold text-[#4ADE80] text-lg">$7</p>
      </div>

      {/* Engagement Row */}
      <div className="px-4 pb-3 flex items-center gap-4 border-t border-gray-100 pt-3 mt-auto">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-xs">128</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">24</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 flex items-center justify-between mt-auto">
        <span className="text-xs text-gray-500">Seedfeed</span>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Mint</span>
      </div>
    </div>
  );
};

export default HeroFeedCard;
