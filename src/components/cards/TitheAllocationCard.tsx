import { Church, Globe, Heart, Users } from "lucide-react";

const TitheAllocationCard = () => {
  const allocations = [
    { icon: Church, label: "Local Church", percentage: 40, amount: "$200", color: "bg-blue-500" },
    { icon: Globe, label: "Missions", percentage: 30, amount: "$150", color: "bg-emerald-500" },
    { icon: Heart, label: "Mercy Fund", percentage: 20, amount: "$100", color: "bg-rose-500" },
    { icon: Users, label: "Community", percentage: 10, amount: "$50", color: "bg-amber-500" },
  ];

  return (
    <div className="w-[380px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Tithe Allocation</h3>
        <div className="text-right">
          <p className="text-xs text-gray-500">Your Monthly</p>
          <p className="font-bold text-lg text-gray-900">$500</p>
        </div>
      </div>

      {/* Allocations */}
      <div className="space-y-3">
        {allocations.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
              <item.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-500">{item.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900 w-14 text-right">{item.amount}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">Held In</span>
        <span className="text-sm font-medium text-primary">USDC</span>
      </div>
    </div>
  );
};

export default TitheAllocationCard;
