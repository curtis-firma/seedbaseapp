import { Heart, GraduationCap, Users } from "lucide-react";

const ImpactPreviewCard = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl p-5 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Your Impact</h3>
          <p className="text-sm text-gray-500">Mobile Classrooms Tanzania</p>
        </div>
      </div>

      {/* Main Impact Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 mb-4 flex-shrink-0">
        <p className="text-white/70 text-sm mb-1">Your Share</p>
        <div className="flex items-end justify-between">
          <p className="text-white font-bold text-4xl">$200</p>
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
            <span className="text-white font-semibold text-xl">0.71%</span>
          </div>
        </div>
        <p className="text-white/70 text-sm mt-2">of $28,000 total raised</p>
      </div>

      {/* How Seeds Are Used - Title */}
      <p className="text-sm font-semibold text-gray-500 tracking-wide mb-3">HOW YOUR SEEDS ARE USED</p>

      {/* Breakdown Items */}
      <div className="space-y-3 flex-1">
        {/* Education */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-900 text-base">Student Education</p>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-base">$14,000</p>
                <p className="text-sm text-gray-500">50%</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Supplies & materials</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
              <div className="w-1/2 h-full bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Salaries */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-gray-900 text-base">Teacher Salaries</p>
              <div className="text-right">
                <p className="font-semibold text-gray-900 text-base">$8,400</p>
                <p className="text-sm text-gray-500">30%</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Training & compensation</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1">
              <div className="w-[30%] h-full bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactPreviewCard;
