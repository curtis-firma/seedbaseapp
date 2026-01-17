import { PartyPopper, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const GrowthReportCard = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Counting animation for main stat
  useEffect(() => {
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

  // Glow pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-[320px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 shadow-lg text-white">
      {/* Milestone Banner */}
      <div className="flex items-center gap-2 mb-4 bg-emerald-500/20 rounded-xl px-3 py-2">
        <PartyPopper className="w-5 h-5 text-emerald-400 animate-icon-wiggle" />
        <p className="text-sm text-emerald-300">
          Milestone: 1,000 seeders joined this week!
        </p>
      </div>

      {/* Header */}
      <h3 className="font-bold text-lg mb-4 text-white/90">Weekly Growth Report</h3>

      {/* Main Stat */}
      <div className="mb-4">
        <p 
          className={`text-4xl font-bold text-emerald-400 transition-all duration-500 ${
            isGlowing 
              ? 'drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]' 
              : 'drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          }`}
        >
          ${displayValue.toFixed(1)}M
        </p>
        <p className="text-gray-400 text-sm">committed</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-xl p-2 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-lg animate-number-tick">156</p>
          <p className="text-xs text-gray-400">missions funded</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-lg animate-number-tick" style={{ animationDelay: '0.2s' }}>1,247</p>
          <p className="text-xs text-gray-400">new seeders</p>
        </div>
        <div className="bg-white/5 rounded-xl p-2 text-center hover:bg-white/10 transition-colors">
          <p className="font-bold text-lg animate-number-tick" style={{ animationDelay: '0.4s' }}>23</p>
          <p className="text-xs text-gray-400">countries</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">All transactions verified on Base L2</p>
        <button className="flex items-center gap-1 text-primary text-sm font-medium hover:underline group">
          See dashboard
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default GrowthReportCard;
