import { Heart, GraduationCap, Users } from "lucide-react";

const ImpactPreviewCard = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Your Impact</h3>
          <p className="text-xs text-gray-500">Mobile Classrooms Tanzania</p>
        </div>
      </div>

      {/* Main Impact Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 sm:p-4 mb-3 flex-shrink-0">
        <p className="text-white/70 text-xs sm:text-sm mb-0.5">Your Share</p>
        <div className="flex items-end justify-between">
          <p className="text-white font-bold text-2xl sm:text-3xl">$200</p>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
            <span className="text-white font-semibold text-sm sm:text-base">0.71%</span>
          </div>
        </div>
        <p className="text-white/70 text-xs mt-1">of $28,000 total raised</p>
      </div>

      {/* How Seeds Are Used - Title */}
      <p className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wide mb-2">HOW YOUR SEEDS ARE USED</p>

      {/* Breakdown Items */}
      <div className="space-y-2 flex-1 overflow-hidden">
        {/* Education */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="font-medium text-gray-900 text-xs sm:text-sm">Student Education</p>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">50%</p>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="w-1/2 h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Salaries */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="font-medium text-gray-900 text-xs sm:text-sm">Teacher Salaries</p>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">30%</p>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="w-[30%] h-full bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImpactPreviewCard;
