import { Heart, Zap, TrendingUp, Target, ArrowRight, PartyPopper } from "lucide-react";

const ImpactDualCard = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Dark Card - Growth Report */}
      <div className="w-[320px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[20px] p-5 text-white">
        {/* Milestone Banner */}
        <div className="flex items-center gap-2 mb-4 bg-emerald-500/20 rounded-xl px-3 py-2">
          <PartyPopper className="w-5 h-5 text-emerald-400" />
          <p className="text-sm text-emerald-300">
            Milestone: 1,000 seeders joined this week!
          </p>
        </div>

        {/* Header */}
        <h3 className="font-bold text-base mb-3 text-white/90">Weekly Growth Report</h3>

        {/* Main Stat */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-emerald-400">
            $4.2M
          </p>
          <p className="text-gray-400 text-sm">committed</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">156</p>
            <p className="text-xs text-gray-400">missions</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">1,247</p>
            <p className="text-xs text-gray-400">seeders</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2 text-center">
            <p className="font-bold text-lg">23</p>
            <p className="text-xs text-gray-400">countries</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">All transactions verified on Base L2</p>
          <button className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
            Dashboard
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Bottom White Card - Impact Stats */}
      <div className="w-[320px] bg-white rounded-[20px] p-5 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Seeded</p>
              <p className="font-bold text-xl text-gray-900">$85,000</p>
            </div>
          </div>
        </div>

        {/* Kingdom Impact Label */}
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Kingdom Impact</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Growth</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors">
            <Target className="w-4 h-4" />
            <span className="text-sm">Goals</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm">Impact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImpactDualCard;
