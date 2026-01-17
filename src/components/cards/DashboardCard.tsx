import { Vote, TrendingUp, Eye } from "lucide-react";
import { useEffect, useState } from "react";

const DashboardCard = () => {
  const [totalSeed, setTotalSeed] = useState(0);
  const [surplus, setSurplus] = useState(0);

  // Counting animation
  useEffect(() => {
    const targetTotal = 125000;
    const targetSurplus = 3125;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Easing function for smooth counting
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setTotalSeed(Math.floor(targetTotal * easeOut));
      setSurplus(Math.floor(targetSurplus * easeOut));

      if (currentStep >= steps) {
        clearInterval(interval);
        setTotalSeed(targetTotal);
        setSurplus(targetSurplus);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="w-[320px] bg-white rounded-[20px] p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Grace Community Seedbase</h3>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Total Seed</p>
          <p className="font-bold text-xl text-gray-900">{formatCurrency(totalSeed)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Monthly Surplus</p>
          <p className="font-bold text-xl text-gray-900">${surplus.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-primary">
            <Vote className="w-4 h-4" />
            <span className="text-sm">Votes Open</span>
          </div>
          <span className="font-bold text-gray-900">3</span>
        </div>
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Growth Rate</span>
          </div>
          <span className="font-bold text-emerald-600">+2.5%</span>
        </div>
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Transparency</span>
          </div>
          <span className="font-bold text-gray-900">100%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
