import { Church, Globe, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Allocation {
  icon: typeof Church;
  label: string;
  percentage: number;
  amount: string;
  color: string;
  bgColor: string;
}

const allocations: Allocation[] = [
  { icon: Globe, label: "Missions", percentage: 40, amount: "$200", color: "bg-blue-500", bgColor: "bg-blue-100" },
  { icon: Church, label: "Operations", percentage: 25, amount: "$125", color: "bg-emerald-500", bgColor: "bg-emerald-100" },
  { icon: Heart, label: "Reserve", percentage: 15, amount: "$75", color: "bg-amber-500", bgColor: "bg-amber-100" },
  { icon: Users, label: "Community", percentage: 20, amount: "$100", color: "bg-purple-500", bgColor: "bg-purple-100" },
];

const TitheAllocationCard = () => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>(allocations.map(() => 0));
  const [isGlowing, setIsGlowing] = useState(false);

  // Animate progress bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidths(allocations.map(a => a.percentage));
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Pulsing glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalPercentage = allocations.reduce((sum, a) => sum + a.percentage, 0);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full bg-white rounded-2xl p-4 shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
          <Church className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">Tithe Allocation</h3>
          <p className="text-xs text-gray-500 truncate">Christ is King Community</p>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="h-2.5 rounded-full overflow-hidden flex mb-3">
        {allocations.map((item, i) => (
          <div
            key={i}
            className={`${item.color} transition-all duration-1000 ease-out`}
            style={{ width: `${(animatedWidths[i] / totalPercentage) * 100}%` }}
          />
        ))}
      </div>

      {/* Allocations List */}
      <div className="space-y-1.5 flex-1 overflow-hidden">
        {allocations.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 truncate">{item.label}</span>
                <span className="text-xs font-semibold text-gray-900 ml-1">{item.percentage}%</span>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500 w-12 text-right flex-shrink-0">{item.amount}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Your Monthly</p>
          <p className="font-bold text-lg text-gray-900">$500</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Held in</p>
          <p className="text-xs font-semibold text-primary">USDC</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TitheAllocationCard;
