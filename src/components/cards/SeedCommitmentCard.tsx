import { Sprout, Heart, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FeedItem {
  id: string;
  initials: string;
  name: string;
  handle: string;
  amount: string;
  recipient: string;
  quote: string;
  avatarGradient: string;
  total: string;
  yourSeed: string;
}

const feedItems: FeedItem[] = [
  {
    id: "1",
    initials: "SJ",
    name: "Sarah Johnson",
    handle: "@sarahjay_seeds",
    amount: "$1,000",
    recipient: "Guatemala Hope Center",
    quote: "Monthly commitment - excited to see the progress!",
    avatarGradient: "from-amber-400 to-orange-500",
    total: "$1,000",
    yourSeed: "$8"
  },
  {
    id: "2",
    initials: "MK",
    name: "Michael Kim",
    handle: "@mkim_giving",
    amount: "$500",
    recipient: "Kenya Water Project",
    quote: "Clean water changes everything 💧",
    avatarGradient: "from-blue-400 to-cyan-500",
    total: "$2,500",
    yourSeed: "$15"
  },
  {
    id: "3",
    initials: "ER",
    name: "Emily Rodriguez",
    handle: "@emily_seeds",
    amount: "$250",
    recipient: "Honduras School Build",
    quote: "Education is the foundation of hope 📚",
    avatarGradient: "from-purple-400 to-pink-500",
    total: "$4,200",
    yourSeed: "$12"
  }
];

const SeedCommitmentCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-scroll through feed items
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % feedItems.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = feedItems[activeIndex];
  const nextItem = feedItems[(activeIndex + 1) % feedItems.length];

  return (
    <div className="relative w-[320px]">
      {/* Peek card behind */}
      <div className="absolute -bottom-2 left-2 right-2 bg-white/70 rounded-3xl p-4 shadow-md border border-gray-100 scale-[0.98] blur-[0.5px]">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${nextItem.avatarGradient} flex items-center justify-center text-white font-bold text-xs`}>
            {nextItem.initials}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{nextItem.name}</p>
            <p className="text-gray-400 text-xs">{nextItem.handle}</p>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div 
        className={`relative bg-white rounded-3xl p-5 shadow-lg border border-gray-100 transition-all duration-300 ${
          isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* User Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${currentItem.avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
            {currentItem.initials}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{currentItem.name}</p>
            <p className="text-gray-500 text-xs">{currentItem.handle}</p>
          </div>
          <Sprout className="w-5 h-5 text-emerald-500" />
        </div>

        {/* Commitment Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              SEEDED
            </span>
          </div>
          <p className="font-bold text-2xl text-gray-900 mb-1">{currentItem.amount}</p>
          <p className="text-gray-600 text-sm mb-2">to {currentItem.recipient}</p>
          <p className="text-xs text-gray-500 italic mb-3">
            "{currentItem.quote}"
          </p>
          
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium">
              <Heart className="w-4 h-4" />
              Seed Too
            </button>
            <div className="text-right text-xs text-gray-500">
              <p>TOTAL <span className="font-bold text-gray-900">{currentItem.total}</span></p>
              <p>Your Seed: <span className="text-emerald-600 font-medium">{currentItem.yourSeed}</span></p>
            </div>
          </div>
        </div>

        {/* Engagement Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm">24</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">8</span>
            </button>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-400">2h ago</span>
        </div>
      </div>
    </div>
  );
};

export default SeedCommitmentCard;
