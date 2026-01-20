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
    <div className="w-full h-full bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-500">Total Seeded</p>
          <p className="font-bold text-xl sm:text-2xl text-gray-900">{formatCurrency(displayValue)}</p>
        </div>
      </div>

      {/* Kingdom Impact Label */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-current animate-subtle-pulse" />
        <span className="text-[10px] sm:text-xs font-semibold text-gray-400 tracking-wider uppercase">Kingdom Impact</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 mt-auto">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-icon-wiggle" />
          <span className="text-xs sm:text-sm">Growth</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-icon-wiggle" />
          <span className="text-xs sm:text-sm">Goals</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 sm:px-3 border-2 border-emerald-200 rounded-lg sm:rounded-xl text-emerald-600 font-medium hover:bg-emerald-50 transition-colors group">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-icon-wiggle" />
          <span className="text-xs sm:text-sm">Impact</span>
        </button>
      </div>
    </div>
  );
};

export default ImpactStatsCard;
