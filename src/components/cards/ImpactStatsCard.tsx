import { Zap, Heart, Church, Users, TreePine, Utensils, Droplets, Home } from "lucide-react";

const ImpactStatsCard = () => {
  const stats = [
    { icon: Church, value: "12", label: "Churches", color: "text-blue-400" },
    { icon: Users, value: "48.5K", label: "People", color: "text-emerald-400" },
    { icon: TreePine, value: "2.3K", label: "Trees", color: "text-green-400" },
    { icon: Utensils, value: "125.6K", label: "Meals", color: "text-amber-400" },
    { icon: Droplets, value: "34", label: "Water", color: "text-cyan-400" },
    { icon: Home, value: "156", label: "Families", color: "text-purple-400" },
  ];

  return (
    <div className="bg-[#0f0f0f] rounded-2xl p-5 max-w-sm text-white">
      {/* Total Seeded */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-medium">Total Seeded</span>
        </div>
        <span className="font-heading text-2xl font-bold">$85,000</span>
      </div>
      
      {/* Kingdom Impact */}
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Kingdom Impact
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <div className="font-heading text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactStatsCard;
