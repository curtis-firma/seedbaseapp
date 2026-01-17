const TransparencyCard = () => {
  const allocations = [
    { label: "Missions", percentage: 45, color: "bg-primary" },
    { label: "Staff", percentage: 25, color: "bg-emerald-500" },
    { label: "Rent", percentage: 15, color: "bg-amber-500" },
    { label: "Programs", percentage: 15, color: "bg-purple-500" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm border border-border">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-heading font-bold text-foreground">Your Tithe</h3>
        <p className="text-sm text-muted-foreground">Monthly contribution breakdown</p>
      </div>
      
      {/* Amount Display */}
      <div className="text-center py-4 border-t border-b border-border mb-4">
        <div className="text-muted-foreground text-sm tracking-wide mb-1">MONTHLY</div>
        <div className="font-heading text-4xl font-bold text-foreground">$500</div>
        <div className="text-muted-foreground text-sm mt-1">
          to <span className="text-primary font-medium">Grace Community Church</span>
        </div>
      </div>
      
      {/* Allocation Bars */}
      <div className="space-y-3 mb-4">
        {allocations.map((item, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Toggle */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between bg-secondary rounded-lg p-1">
          <button className="flex-1 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md">
            Hold in USDC
          </button>
          <button className="flex-1 py-2 text-sm font-medium text-muted-foreground">
            Hold in CIK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransparencyCard;
