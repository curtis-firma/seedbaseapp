import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface LedgerEntry {
  seedIn: string;
  surplus: string;
  mission: string;
  status: "verified" | "pending";
}

const ledgerEntries: LedgerEntry[] = [
  { seedIn: "$500", surplus: "$12.50", mission: "Tanzania School", status: "verified" },
  { seedIn: "$1,200", surplus: "$30.00", mission: "Water Wells", status: "verified" },
  { seedIn: "$250", surplus: "$6.25", mission: "Food Program", status: "pending" },
];

const LedgerCard = () => {
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const hasAnimated = useRef(false);

  // One-time sequential row animation on mount
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    ledgerEntries.forEach((_, index) => {
      setTimeout(() => {
        setVisibleRows(prev => [...prev, index]);
      }, index * 400);
    });
  }, []);

  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col">
      {/* Header */}
      <h3 className="text-sm font-semibold text-gray-400 tracking-wider mb-3">SHARED LEDGER</h3>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 flex-1">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-2 px-2 sm:px-3 text-xs font-semibold text-gray-500">Seed In</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs font-semibold text-gray-500">Surplus</th>
              <th className="text-left py-2 px-2 sm:px-3 text-xs font-semibold text-gray-500">Mission</th>
              <th className="text-center py-2 px-1.5 text-xs font-semibold text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => (
              <tr 
                key={index} 
                className={`border-t border-gray-50 transition-opacity duration-500 ${
                  visibleRows.includes(index) ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <td className="py-2.5 px-2 sm:px-3 font-medium text-gray-900">{entry.seedIn}</td>
                <td className="py-2.5 px-2 sm:px-3 text-emerald-600 font-semibold">{entry.surplus}</td>
                <td className="py-2.5 px-2 sm:px-3 text-gray-600 truncate max-w-[80px] sm:max-w-none">{entry.mission}</td>
                <td className="py-2.5 px-1.5 text-center">
                  {entry.status === "verified" ? (
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 flex items-center justify-center">
        <p className="text-xs text-gray-400">
          All transactions verified on <span className="font-medium text-gray-600">■ Base L2</span>
        </p>
      </div>
    </div>
  );
};

export default LedgerCard;
