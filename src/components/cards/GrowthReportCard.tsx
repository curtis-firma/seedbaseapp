import { BadgeCheck, MoreHorizontal, Sprout } from "lucide-react";

const GrowthReportCard = () => {
  return (
    <div className="bg-[#0f0f0f] rounded-2xl p-4 max-w-sm text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-[#0f0f0f]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-heading font-bold">SeedFeed</span>
              <BadgeCheck className="w-4 h-4 text-primary fill-primary" />
            </div>
            <span className="text-slate-400 text-sm">@seedfeedHQ · 12h</span>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
      </div>
      
      <p className="mb-4">
        🎉 Milestone: 1,000 seeders joined this week! The movement is growing.
      </p>
      
      {/* Report Card */}
      <div className="bg-[#1a1a2e] rounded-xl p-5">
        <h3 className="font-heading font-semibold mb-4">Weekly Growth Report</h3>
        
        <div className="font-heading text-4xl font-bold text-primary mb-1">$4.2M</div>
        <div className="text-slate-400 text-sm mb-4">committed</div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-heading text-xl font-bold">156</div>
            <div className="text-sm text-slate-400">missions funded</div>
          </div>
          <div>
            <div className="font-heading text-xl font-bold">1,247</div>
            <div className="text-sm text-slate-400">new seeders</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-heading text-xl font-bold">23</div>
          <div className="text-sm text-slate-400">countries reached</div>
        </div>
        
        <button className="w-full bg-slate-700/50 text-primary rounded-xl py-2.5 font-medium hover:bg-slate-700/70 transition-colors">
          See dashboard
        </button>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-1 text-slate-400">
          <span>TOTAL</span>
          <span className="text-primary font-bold">$42</span>
        </div>
        <div className="flex items-center gap-1 bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium">
          <Sprout className="w-4 h-4" />
          Your Seed: $47
        </div>
      </div>
    </div>
  );
};

export default GrowthReportCard;
