import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrustScoreInline } from "@/components/mobile/TrustScoreBadge";
import { formatRewardAmount } from "@/lib/trust-rewards";
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Target
} from "lucide-react";

interface SeedBaseSurplusCardProps {
  seedbaseName: string;
  surplusBalance: number;
  trustScore: number;
  totalSeederCount: number;
  trustRewardsEarned: number;
  activeMissionCount?: number;
  onDistribute?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function SeedBaseSurplusCard({
  seedbaseName,
  surplusBalance,
  trustScore,
  totalSeederCount,
  trustRewardsEarned,
  activeMissionCount = 0,
  onDistribute,
  onViewDetails,
  className,
}: SeedBaseSurplusCardProps) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-200 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-emerald-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{seedbaseName}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Surplus Balance</span>
                <TrustScoreInline score={trustScore} />
              </div>
            </div>
          </div>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Demo</span>
        </div>
        
        {/* Main Balance */}
        <div className="mt-3">
          <motion.p 
            className="text-3xl font-bold text-emerald-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatRewardAmount(surplusBalance)}
          </motion.p>
          <p className="text-xs text-gray-500 mt-1">Available for mission funding</p>
        </div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-emerald-100 border-b border-emerald-100">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <Users className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold text-gray-900">{totalSeederCount}</p>
          <p className="text-[10px] text-gray-500">Seeders</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold text-emerald-600">{formatRewardAmount(trustRewardsEarned)}</p>
          <p className="text-[10px] text-gray-500">Rewards</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
            <Target className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold text-gray-900">{activeMissionCount}</p>
          <p className="text-[10px] text-gray-500">Missions</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 space-y-2">
        {onDistribute && surplusBalance > 0 && (
          <button
            onClick={onDistribute}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            Distribute to Missions
          </button>
        )}
        
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>View distribution history</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}