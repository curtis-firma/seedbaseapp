import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, BadgeCheck, Heart, MapPin, Zap } from "lucide-react";

interface FeedItem {
  id: number;
  type: 'seed' | 'mission' | 'distribution' | 'milestone';
  user: string;
  handle: string;
  avatar: string;
  message: string;
  amount?: string;
  mission?: string;
  location?: string;
  timestamp: string;
}

const mockFeedItems: Omit<FeedItem, 'id' | 'timestamp'>[] = [
  {
    type: 'seed',
    user: 'Sarah Chen',
    handle: '@sarahseeds',
    avatar: 'SC',
    message: 'Just committed my first seed 🌱',
    amount: '$500',
    mission: 'Clean Water Initiative',
    location: 'Kenya',
  },
  {
    type: 'distribution',
    user: 'SeedFeed',
    handle: '@seedfeedHQ',
    avatar: 'SF',
    message: 'Surplus deployed to 3 missions 🌍',
    amount: '$1,247',
  },
  {
    type: 'mission',
    user: 'Hope Village',
    handle: '@hopevillage',
    avatar: 'HV',
    message: 'Update: 12 families housed this week! 🏠',
    location: 'Guatemala',
  },
  {
    type: 'seed',
    user: 'Marcus Johnson',
    handle: '@marcusj',
    avatar: 'MJ',
    message: 'Renewed my 3-year commitment 💪',
    amount: '$2,000',
  },
  {
    type: 'milestone',
    user: 'Tanzania Schools',
    handle: '@tzschools',
    avatar: 'TS',
    message: '10,000 students reached! 📚',
    location: 'Tanzania',
  },
  {
    type: 'distribution',
    user: 'SeedFeed',
    handle: '@seedfeedHQ',
    avatar: 'SF',
    message: 'Your share just grew 🌿',
    amount: '$3.42',
  },
  {
    type: 'seed',
    user: 'Community Church',
    handle: '@communitychurch',
    avatar: 'CC',
    message: 'Our seedbase just hit 50 members! 🎉',
    amount: '$25,000',
  },
];

const avatarColors: Record<string, string> = {
  SC: 'from-pink-500 to-rose-600',
  SF: 'from-blue-500 to-indigo-600',
  HV: 'from-emerald-500 to-teal-600',
  MJ: 'from-amber-500 to-orange-600',
  TS: 'from-violet-500 to-purple-600',
  CC: 'from-cyan-500 to-blue-600',
};

const typeColors: Record<string, string> = {
  seed: 'bg-emerald-100 text-emerald-700',
  distribution: 'bg-blue-100 text-blue-700',
  mission: 'bg-amber-100 text-amber-700',
  milestone: 'bg-purple-100 text-purple-700',
};

const typeLabels: Record<string, string> = {
  seed: '🌱 Seeded',
  distribution: '⚡ Deployed',
  mission: '📢 Update',
  milestone: '🏆 Milestone',
};

const GlobalImpactFeedPreview = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [totalImpact, setTotalImpact] = useState(847293);

  // Initialize with first 3 items
  useEffect(() => {
    const initial = mockFeedItems.slice(0, 3).map((item, i) => ({
      ...item,
      id: i,
      timestamp: `${i + 1}m`,
    }));
    setFeedItems(initial);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomItem = mockFeedItems[Math.floor(Math.random() * mockFeedItems.length)];
      const newItem: FeedItem = {
        ...randomItem,
        id: Date.now(),
        timestamp: 'now',
      };

      setFeedItems(prev => [newItem, ...prev.slice(0, 4)]);
      setTotalImpact(prev => prev + Math.floor(Math.random() * 50) + 10);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 max-w-sm overflow-hidden shadow-2xl border border-slate-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white">Global Feed</h3>
            <div className="flex items-center gap-1 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Total Impact</div>
          <motion.div 
            className="font-heading font-bold text-white"
            key={totalImpact}
            initial={{ scale: 1.1, color: '#34d399' }}
            animate={{ scale: 1, color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            ${totalImpact.toLocaleString()}
          </motion.div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="space-y-3 max-h-[320px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {feedItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[item.avatar] || 'from-slate-500 to-slate-600'} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-white text-sm truncate">{item.user}</span>
                    {item.handle === '@seedfeedHQ' && (
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    )}
                    <span className="text-slate-500 text-xs">{item.handle}</span>
                    <span className="text-slate-600 text-xs">· {item.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-1">{item.message}</p>
                  
                  {/* Amount or Location badges */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                    {item.amount && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                        {item.amount}
                      </span>
                    )}
                    {item.location && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer pulse */}
      <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>Seeds spreading across 47 countries</span>
      </div>
    </div>
  );
};

export default GlobalImpactFeedPreview;
