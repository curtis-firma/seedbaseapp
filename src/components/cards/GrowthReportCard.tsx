import { PartyPopper, ArrowRight } from "lucide-react";

const GrowthReportCard = () => {
  return (
    <div className="w-[320px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 shadow-lg text-white">
      {/* Milestone Banner */}
      <div className="flex items-center gap-2 mb-4 bg-emerald-500/20 rounded-xl px-3 py-2">
        <PartyPopper className="w-5 h-5 text-emerald-400" />
        <p className="text-sm text-emerald-300">
          Milestone: 1,000 seeders joined this week!
        </p>
      </div>

      {/* Header */}
      <h3 className="font-bold text-lg mb-4">Weekly Growth Report</h3>

      {/* Main Stat */}
      <div className="mb-4">
        <p className="text-4xl font-bold text-emerald-400">$4.2M</p>
        <p className="text-gray-400 text-sm">committed</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-2 text-center">
          <p className="font-bold text-lg">156</p>
          <p className="text-xs text-gray-400">missions funded</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2 text-center">
          <p className="font-bold text-lg">1,247</p>
          <p className="text-xs text-gray-400">new seeders</p>
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
          See dashboard
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default GrowthReportCard;
