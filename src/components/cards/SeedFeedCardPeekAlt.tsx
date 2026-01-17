import { Sprout } from "lucide-react";

const SeedFeedCardPeekAlt = () => {
  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
          AK
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Anna Kim</p>
          <p className="text-gray-500 text-xs">@annak · 1h</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 text-sm leading-relaxed">
        My first seed is growing! 🌿
      </p>

      {/* Growth Indicator */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Seed Growth</p>
            <p className="font-bold text-xl text-emerald-600">+12%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedFeedCardPeekAlt;
