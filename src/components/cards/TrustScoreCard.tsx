import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrustScoreBadge } from "@/components/mobile/TrustScoreBadge";
import { TrustScoreBreakdown, getTrustTierColor, TrustTier } from "@/lib/trust-score";
import { formatRewardAmount } from "@/lib/trust-rewards";
import { TrendingUp, Clock, DollarSign, Users, Target, ChevronRight, Info } from "lucide-react";

interface TrustScoreCardProps {
  breakdown: TrustScoreBreakdown;
  totalRewardsEarned: number;
  onViewDetails?: () => void;
  className?: string;
}

const factorLabels = [
  { key: 'durationScore', label: 'Commitment Duration', icon: Clock, description: 'Years committed to SeedBases' },
  { key: 'amountScore', label: 'Seed Amount', icon: DollarSign, description: 'Relative to average commitment' },
  { key: 'activityScore', label: 'Participation', icon: Users, description: 'Posts, messages, and votes' },
  { key: 'growthScore', label: 'Growth Impact', icon: Target, description: 'Community and mission growth' },
];

export function TrustScoreCard({ 
  breakdown, 
  totalRewardsEarned,
  onViewDetails,
  className 
}: TrustScoreCardProps) {
  const tierColor = getTrustTierColor(breakdown.tier);
  
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrustScoreBadge score={breakdown.score} size="lg" showProgress />
            <div>
              <h3 className="font-semibold text-gray-900">Trust Score</h3>
              <p className={cn("text-sm font-medium capitalize", tierColor.text)}>
                {breakdown.tier} Tier
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Rewards Earned</p>
            <p className="text-lg font-bold text-emerald-600">
              {formatRewardAmount(totalRewardsEarned)}
            </p>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Demo</span>
          </div>
        </div>
      </div>
      
      {/* Score Breakdown */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Info className="w-3 h-3" />
          <span>Score breakdown</span>
        </div>
        
        {factorLabels.map(({ key, label, icon: Icon }) => {
          const value = breakdown[key as keyof TrustScoreBreakdown] as number;
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{label}</span>
                  <span className="text-sm font-medium text-gray-900">{Math.round(value)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <motion.div 
                    className={cn("h-full rounded-full", 
                      value >= 70 ? "bg-emerald-500" : 
                      value >= 40 ? "bg-amber-500" : "bg-gray-400"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full flex items-center justify-between p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>View reward history</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}