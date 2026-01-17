import { TrendingUp, Vote, Eye } from "lucide-react";

const DashboardCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-bold text-foreground">Grace Community Seedbase</h3>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Active</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Seed</div>
          <div className="font-heading text-2xl font-bold text-foreground">$125K</div>
        </div>
        <div className="bg-secondary rounded-xl p-4">
          <div className="text-sm text-muted-foreground mb-1">Monthly Surplus</div>
          <div className="font-heading text-2xl font-bold text-emerald-600">$3,125</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Votes Open</span>
        </div>
        <span className="text-sm font-semibold text-primary">3</span>
      </div>
      
      <div className="flex items-center justify-between py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-foreground">Growth Rate</span>
        </div>
        <span className="text-sm font-semibold text-emerald-600">+2.5%</span>
      </div>
      
      <div className="flex items-center justify-between py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">Transparency</span>
        </div>
        <span className="text-sm font-semibold text-foreground">100%</span>
      </div>
    </div>
  );
};

export default DashboardCard;
