import { PartyPopper, ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const GrowthReportCard = () => {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  // One-time counting animation on mount
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    const target = 4.2;
    const duration = 2500;
    const steps = 50;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(target * easeOut);

      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(target);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-5 shadow-lg text-white flex flex-col">
      {/* Milestone Banner */}
      <div className="flex items-center gap-2 mb-2 bg-emerald-500/20 rounded-lg px-2.5 py-1.5">
        <PartyPopper className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-emerald-300 leading-snug">
          1,000 seeders joined this week!
        </p>
      </div>

      {/* Header */}
      <h3 className="font-bold text-base sm:text-lg mb-2 text-white/90">Weekly Growth Report</h3>

      {/* Main Stat - CSS animation for glow pulse */}
      <div className="mb-3 flex-1 flex flex-col justify-center">
        <p className="text-4xl sm:text-5xl font-bold text-emerald-400 animate-glow-pulse">
          ${displayValue.toFixed(1)}M
        </p>
        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">committed</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
        <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-sm sm:text-base">156</p>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">missions</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-sm sm:text-base">1,247</p>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">seeders</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 sm:p-2.5 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-sm sm:text-base">23</p>
          <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">countries</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <p className="text-[10px] sm:text-xs text-gray-400">Verified on Base L2</p>
        <button className="flex items-center gap-1 text-primary text-xs sm:text-sm font-medium hover:underline group whitespace-nowrap">
          See dashboard
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default GrowthReportCard;
