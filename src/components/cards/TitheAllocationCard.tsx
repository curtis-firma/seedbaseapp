import { ChurchIcon, Globe, Building2, PiggyBank } from "lucide-react";

const TitheAllocationCard = () => {
  const allocations = [
    { label: "Missions", percentage: 40, icon: Globe, color: "from-blue-500 to-blue-600" },
    { label: "Operations", percentage: 25, icon: Building2, color: "from-emerald-500 to-emerald-600" },
    { label: "Reserve", percentage: 15, icon: PiggyBank, color: "from-amber-500 to-amber-600" },
    { label: "Community", percentage: 20, icon: ChurchIcon, color: "from-violet-500 to-violet-600" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
          <span className="text-lg">⛪</span>
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">Tithe Allocation</h3>
          <p className="text-xs text-muted-foreground">Christ is King</p>
        </div>
      </div>
      
      {/* Visual Breakdown - Pie-style segments */}
      <div className="relative mb-6">
        <div className="flex h-3 rounded-full overflow-hidden">
          {allocations.map((item, i) => (
            <div 
              key={i}
              className={`bg-gradient-to-r ${item.color}`}
              style={{ width: `${item.percentage}%` }}
            />
          ))}
        </div>
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2.5s infinite linear'
          }}
        />
      </div>
      
      {/* Allocation List */}
      <div className="space-y-2 mb-auto">
        {allocations.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-foreground">{item.percentage}%</span>
            </div>
          );
        })}
      </div>
      
      {/* Footer Stats */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Your Monthly</div>
            <div className="font-heading text-xl font-bold text-foreground">$500</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Held In</div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="font-semibold text-foreground">USDC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitheAllocationCard;
