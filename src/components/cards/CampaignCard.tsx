import { Users, Clock, ArrowRight } from "lucide-react";
import generositySpread from "@/assets/generosity-spread.png";

const CampaignCard = () => {
  const raised = 43800;
  const goal = 50000;
  const percentage = Math.round((raised / goal) * 100);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Image with Active Badge - using children image */}
      <div 
        className="relative w-full aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: `url(${generositySpread})` }}
      >
        <div className="absolute top-4 left-4">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide">
            Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          Emergency Relief: Kenya Drought Response
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          by Hope Foundation International
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-xl text-gray-900">${(raised / 1000).toFixed(1)}K</span>
            <span className="text-sm text-gray-500">of ${(goal / 1000).toFixed(1)}K</span>
          </div>
          <span className="font-semibold text-primary text-lg">{percentage}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>892 donors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>7 days left</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Donate Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
