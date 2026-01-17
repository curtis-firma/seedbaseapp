import { Sprout, Heart } from "lucide-react";

const SeedCommitmentCard = () => {
  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
          SJ
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Sarah Johnson</p>
          <p className="text-gray-500 text-xs">@sarahjay_seeds</p>
        </div>
        <Sprout className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 text-sm leading-relaxed">
        Monthly commitment complete! Excited to see the progress in Guatemala 🌱
      </p>

      {/* Commitment Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            SEEDED
          </span>
        </div>
        <p className="font-bold text-2xl text-gray-900 mb-1">$1,000</p>
        <p className="text-gray-600 text-sm mb-2">to Guatemala Hope Center</p>
        <p className="text-xs text-gray-500 italic mb-3">
          "Monthly commitment - excited to see the progress!"
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium">
              <Heart className="w-4 h-4" />
              Seed Too
            </button>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>TOTAL <span className="font-bold text-gray-900">$1,000</span></p>
            <p>Your Seed: <span className="text-emerald-600">$8</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedCommitmentCard;
