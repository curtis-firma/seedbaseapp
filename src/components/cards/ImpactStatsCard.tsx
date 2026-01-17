import { Heart, Church, Users, TreePine, Utensils, Droplets, Home } from "lucide-react";

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
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">Total Seeded</p>
          <p className="font-bold text-2xl text-gray-900">$85,000</p>
        </div>
        <div className="flex items-center gap-1 text-rose-500">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">Kingdom Impact</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="text-center p-2 bg-gray-50 rounded-xl">
            <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
            <p className="font-bold text-lg text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactStatsCard;
