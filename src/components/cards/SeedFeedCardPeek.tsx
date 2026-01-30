const SeedFeedCardPeek = () => {
  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* User Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-trust flex items-center justify-center text-white font-bold text-sm">
          SF
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">SeedFeed</p>
          <p className="text-gray-500 text-xs">@seedfeedHQ · 12m</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 text-sm leading-relaxed">
        Surplus just deployed 🌍
      </p>

      {/* Mini Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌱</span>
          <span className="text-sm font-medium text-gray-700">Tanzania School Project</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Your share:</p>
            <p className="font-bold text-lg text-emerald-600">$2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedFeedCardPeek;
