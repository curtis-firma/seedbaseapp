import { Sprout } from "lucide-react";

const SeedCommitmentCard = () => {
  return (
    <div className="relative w-[280px]">
      {/* Background green bar (stacked behind) */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-3 h-[200px] bg-[#4ADE80] rounded-full" />
      
      {/* Main card */}
      <div className="relative bg-white rounded-3xl p-6 shadow-xl ml-4">
        {/* Header with sprout */}
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-[#4ADE80]" />
          <span className="text-xs font-semibold text-[#4ADE80] tracking-wide">SEEDED</span>
        </div>

        {/* Amount */}
        <p className="font-bold text-[42px] text-[#F97316] leading-none mb-2 tracking-tight">$5,000</p>
        
        {/* Recipient */}
        <p className="text-gray-600 text-base mb-4">to Tanzania School Project</p>

        {/* Divider */}
        <div className="h-1 bg-[#F97316] rounded-full mb-4" />

        {/* Your seed helped */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">Your seed helped:</p>
          <p className="font-bold text-xl text-[#4ADE80]">$7</p>
        </div>
      </div>
    </div>
  );
};

export default SeedCommitmentCard;