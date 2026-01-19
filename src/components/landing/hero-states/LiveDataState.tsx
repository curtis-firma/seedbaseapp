import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, Zap } from 'lucide-react';

const MISSIONS = [
  { name: 'Tanzania Schools', color: '#10B981' },
  { name: 'Philippines Relief', color: '#3B82F6' },
  { name: 'Guatemala Hope', color: '#F59E0B' },
  { name: 'Kenya Water', color: '#06B6D4' },
];

const USERS = [
  { name: 'Sarah K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { name: 'Marcus T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { name: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { name: 'David L.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
];

const LiveDataState = () => {
  const [totalSeeded, setTotalSeeded] = useState(4217893);
  const [activeMission, setActiveMission] = useState(0);
  const [activeUser, setActiveUser] = useState(0);
  const [progress, setProgress] = useState(72);
  const [recentAmount, setRecentAmount] = useState(50);

  // Animate counter incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 50) + 10;
      setTotalSeeded(prev => prev + increment);
      setRecentAmount(increment);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Rotate missions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMission(prev => (prev + 1) % MISSIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate users
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUser(prev => (prev + 1) % USERS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Animate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(100, prev + Math.random() * 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <pattern id="live-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill="none" stroke="black" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#live-grid)" />
        </svg>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[320px] overflow-hidden"
      >
        {/* LIVE indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-xs font-bold text-red-500 tracking-wider">LIVE</span>
        </div>

        {/* Total Seeded */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Total Seeded</span>
          </div>
          <motion.div
            key={totalSeeded}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {formatNumber(totalSeeded)}
          </motion.div>
        </div>

        {/* Recent activity */}
        <div className="bg-muted/50 rounded-xl p-3 mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeUser}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <img
                src={USERS[activeUser].avatar}
                alt={USERS[activeUser].name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {USERS[activeUser].name} just seeded
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-semibold">${recentAmount}</span> to{' '}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeMission}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ color: MISSIONS[activeMission].color }}
                      className="font-medium"
                    >
                      {MISSIONS[activeMission].name}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Monthly Goal</span>
            </div>
            <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: '60%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
      </motion.div>
    </div>
  );
};

export default LiveDataState;
