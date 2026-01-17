import { Sprout } from "lucide-react";

const SeedStackCard = () => {
  return (
    <div className="relative w-[320px] h-[360px]">
      {/* Green vertical bar */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[280px] bg-[#4ADE80] rounded-full" />
      
      {/* Background peek card - $1,000 */}
      <div 
        className="absolute bg-white rounded-[20px] p-5 shadow-lg"
        style={{
          width: '280px',
          left: '16px',
          top: '0',
          boxShadow: '0 12px 24px rgba(0,0,0,0.06)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sprout className="w-4 h-4 text-[#4ADE80]" />
          <span className="text-xs font-semibold text-[#4ADE80] tracking-wide">SEEDED</span>
        </div>
        <p className="font-bold text-[32px] text-[#F97316] leading-none tracking-tight">$1,000</p>
        <p className="text-gray-500 text-sm mt-1">to Guatemala Hope Center</p>
      </div>

      {/* Main card - $5,000 */}
      <div 
        className="absolute bg-white rounded-[20px] p-5 shadow-xl"
        style={{
          width: '280px',
          left: '32px',
          top: '80px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            MT
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Michael Thompson</p>
            <p className="text-gray-500 text-xs">@michaelthompson_cik</p>
          </div>
        </div>

        {/* Seeded Label */}
        <div className="flex items-center gap-2 mb-3">
          <Sprout className="w-4 h-4 text-[#4ADE80]" />
          <span className="text-xs font-semibold text-[#4ADE80] tracking-wide">SEEDED</span>
        </div>

        {/* Amount */}
        <p className="font-bold text-[36px] text-[#F97316] leading-none tracking-tight mb-2">$5,000</p>
        <p className="text-gray-500 text-sm mb-4">to Tanzania School Project</p>

        {/* Divider */}
        <div className="h-1 bg-[#F97316] rounded-full mb-4" />

        {/* Your seed helped */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">Your seed helped:</p>
          <p className="font-bold text-[#4ADE80] text-lg">$7</p>
        </div>
      </div>
    </div>
  );
};

export default SeedStackCard;
