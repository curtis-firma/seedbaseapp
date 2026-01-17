import { Heart, Zap, TrendingUp, Target } from "lucide-react";
import { useEffect, useState } from "react";

const ImpactStatsCard = () => {
  const [displayValue, setDisplayValue] = useState(0);

  // Counting animation
  useEffect(() => {
    const target = 85000;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(target * easeOut));

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(target);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Seeded</p>
            <p className="font-bold text-2xl text-gray-900">{formatCurrency(displayValue)}</p>
          </div>
        </div>
      </div>

      {/* Kingdom Impact Label */}
      <div className="flex items-center gap-2 mb-5">
        <Heart className="w-4 h-4 text-rose-500 fill-current animate-subtle-pulse" />
        <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Kingdom Impact</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <TrendingUp className="w-5 h-5 group-hover:animate-icon-wiggle" />
          <span className="text-sm">Growth</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <Target className="w-5 h-5 group-hover:animate-icon-wiggle" />
          <span className="text-sm">Goals</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-emerald-200 rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <Heart className="w-5 h-5 group-hover:animate-icon-wiggle" />
          <span className="text-sm">Impact</span>
        </button>
      </div>
    </div>
  );
};

export default ImpactStatsCard;
