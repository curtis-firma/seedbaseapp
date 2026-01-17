import { Check } from "lucide-react";

const LedgerCard = () => {
  const entries = [
    { seedIn: "$500", surplus: "$12.50", mission: "Tanzania School", status: "complete" },
    { seedIn: "$1,200", surplus: "$30.00", mission: "Water Wells", status: "complete" },
    { seedIn: "$250", surplus: "$6.25", mission: "Food Program", status: "pending" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 max-w-sm border border-border">
      <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Shared Ledger
      </h3>
      
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Seed In</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Surplus</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Mission</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-3 px-4 font-medium text-foreground">{entry.seedIn}</td>
                <td className="py-3 px-4 text-emerald-600 font-medium">{entry.surplus}</td>
                <td className="py-3 px-4 text-muted-foreground">{entry.mission}</td>
                <td className="py-3 px-4">
                  {entry.status === "complete" ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        All transactions verified on Base L2
      </div>
    </div>
  );
};

export default LedgerCard;
