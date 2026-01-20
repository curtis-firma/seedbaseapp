import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Vote, TrendingUp } from 'lucide-react';
import { Confetti } from '@/components/shared/Confetti';

interface Allocation {
  id: string;
  label: string;
  percentage: number;
  color: string;
  votes: number;
}

const CHURCH_NAME = 'Christ is King Community';
const TOTAL_MONTHLY = 45200;

const ALLOCATIONS: Allocation[] = [
  { id: 'missions', label: 'Missions', percentage: 40, color: '#3B82F6', votes: 234 },
  { id: 'operations', label: 'Operations', percentage: 25, color: '#10B981', votes: 156 },
  { id: 'reserve', label: 'Reserve', percentage: 15, color: '#F59E0B', votes: 89 },
  { id: 'community', label: 'Community', percentage: 20, color: '#8B5CF6', votes: 178 },
];

const LiveDataState = () => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [animatedVotes, setAnimatedVotes] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize votes from allocation data
  useEffect(() => {
    const initialVotes: Record<string, number> = {};
    ALLOCATIONS.forEach(a => {
      initialVotes[a.id] = a.votes;
    });
    setVotes(initialVotes);
    setAnimatedVotes(initialVotes);
  }, []);

  // Simulate vote increases
  useEffect(() => {
    const interval = setInterval(() => {
      const allocationIds = ALLOCATIONS.map(a => a.id);
      const randomId = allocationIds[Math.floor(Math.random() * allocationIds.length)];
      
      setVotes(prev => ({
        ...prev,
        [randomId]: (prev[randomId] || 0) + 1,
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Animate vote count changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedVotes(votes);
    }, 100);
    return () => clearTimeout(timeout);
  }, [votes]);

  const handleVote = useCallback((allocationId: string) => {
    setVotes(prev => ({
      ...prev,
      [allocationId]: (prev[allocationId] || 0) + 1,
    }));
    
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  // Calculate donut chart segments
  const donutSegments = useMemo(() => {
    let cumulativePercentage = 0;
    return ALLOCATIONS.map(allocation => {
      const startAngle = cumulativePercentage * 3.6;
      cumulativePercentage += allocation.percentage;
      const endAngle = cumulativePercentage * 3.6;
      return { ...allocation, startAngle, endAngle };
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden">
      <Confetti isActive={showConfetti} />

      {/* Centered Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-0 right-0 text-center z-20"
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <Vote className="w-4 h-4 text-primary" />
          <span className="text-base font-semibold text-foreground">Transparent Voting</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{CHURCH_NAME}</p>
      </motion.div>

      {/* Main content - donut and voting side by side */}
      <div className="flex flex-row items-center gap-8 mt-8">
        {/* Larger Donut Chart - fixed size */}
        <div className="relative w-[180px] h-[180px] flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {donutSegments.map((segment, index) => {
              const radius = 38;
              const circumference = 2 * Math.PI * radius;
              const strokeDasharray = (segment.percentage / 100) * circumference;
              const strokeDashoffset = donutSegments
                .slice(0, index)
                .reduce((acc, s) => acc - (s.percentage / 100) * circumference, 0);
              
              const isHovered = hoveredSegment === segment.id;
              
              return (
                <motion.circle
                  key={segment.id}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? 18 : 16}
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-all duration-200"
                  style={{ 
                    transformOrigin: '50% 50%',
                    filter: isHovered ? 'brightness(1.1)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => handleVote(segment.id)}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${strokeDasharray} ${circumference}` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                />
              );
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {hoveredSegment ? (
              <motion.div
                key={hoveredSegment}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-2xl font-bold text-foreground">
                  {donutSegments.find(s => s.id === hoveredSegment)?.percentage}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {donutSegments.find(s => s.id === hoveredSegment)?.label}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="total"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(TOTAL_MONTHLY)}
                </p>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Allocation list with voting */}
        <div className="flex flex-col gap-3">
          {ALLOCATIONS.map((allocation) => (
            <motion.div
              key={allocation.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                hoveredSegment === allocation.id ? 'bg-black/5' : 'hover:bg-black/3'
              }`}
              onMouseEnter={() => setHoveredSegment(allocation.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => handleVote(allocation.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: allocation.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-foreground">
                  {allocation.label}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Vote className="w-3.5 h-3.5 text-muted-foreground" />
                <motion.span
                  key={animatedVotes[allocation.id]}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-sm font-medium text-muted-foreground min-w-[28px]"
                >
                  {animatedVotes[allocation.id] || allocation.votes}
                </motion.span>
                <TrendingUp className="w-3 h-3 text-green-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-black/40 font-medium whitespace-nowrap"
      >
        Tap to vote • Live transparency
      </motion.p>
    </div>
  );
};

export default LiveDataState;
