import { Vote, TrendingUp, Eye } from "lucide-react";

const DashboardCard = () => {
  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Grace Community Seedbase</h3>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Total Seed</p>
          <p className="font-bold text-xl text-gray-900">$125K</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">Monthly Surplus</p>
          <p className="font-bold text-xl text-gray-900">$3,125</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-primary">
          <Vote className="w-4 h-4" />
          <span>Votes Open</span>
          <span className="font-bold">3</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-500">
          <TrendingUp className="w-4 h-4" />
          <span>+2.5%</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Eye className="w-4 h-4" />
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
