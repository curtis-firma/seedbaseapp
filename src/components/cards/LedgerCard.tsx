const LedgerCard = () => {
  const ledgerEntries = [
    { seedIn: "$500", surplus: "$12.50", mission: "Tanzania School" },
    { seedIn: "$1,200", surplus: "$30.00", mission: "Water Wells" },
    { seedIn: "$250", surplus: "$6.25", mission: "Food Program" },
  ];

  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <h3 className="font-bold text-gray-900 mb-4">Shared Ledger</h3>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Seed In</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Surplus</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Mission</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => (
              <tr key={index} className="border-t border-gray-50">
                <td className="py-2.5 px-3 font-medium text-gray-900">{entry.seedIn}</td>
                <td className="py-2.5 px-3 text-emerald-600 font-medium">{entry.surplus}</td>
                <td className="py-2.5 px-3 text-gray-600">{entry.mission}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerCard;
