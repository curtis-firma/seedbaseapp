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

/**
 * LiveDataState - Hero canvas state showing transparent voting
 * Uses percentage-based sizing to scale properly across viewports
 */
interface LiveDataStateProps {
  active?: boolean;
}

const LiveDataState = ({ active = true }: LiveDataStateProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [animatedVotes, setAnimatedVotes] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when becoming active
  useEffect(() => {
    if (active) {
      setAnimationKey(prev => prev + 1);
    }
  }, [active]);

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
    <div className="relative w-full h-full flex flex-col items-center justify-start p-[4%] pt-[3%] overflow-hidden bg-white">
      <Confetti isActive={showConfetti} />

      {/* Centered Header - compact */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-[2%]"
      >
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <Vote className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <span className="text-xs md:text-sm font-semibold text-foreground">Transparent Voting</span>
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground">{CHURCH_NAME}</p>
      </motion.div>

      {/* Main content - horizontal layout to fit in rectangle */}
      <div className="flex flex-row items-center justify-center gap-[4%] w-full flex-1">
        {/* Donut Chart - sized to fit */}
        <div className="relative w-[35%] max-w-[140px] aspect-square flex-shrink-0">
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
                  key={`${segment.id}-${animationKey}`}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={isHovered ? 16 : 14}
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
                <p className="text-base md:text-xl font-bold text-foreground">
                  {donutSegments.find(s => s.id === hoveredSegment)?.percentage}%
                </p>
                <p className="text-[8px] md:text-[10px] text-muted-foreground">
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
                <p className="text-sm md:text-base font-bold text-foreground">
                  {formatCurrency(TOTAL_MONTHLY)}
                </p>
                <p className="text-[8px] md:text-[10px] text-muted-foreground">Monthly</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Allocation list - vertical stack */}
        <div className="flex flex-col gap-1 md:gap-1.5 flex-shrink-0">
          {ALLOCATIONS.map((allocation) => (
            <motion.div
              key={allocation.id}
              className={`flex items-center gap-1.5 md:gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all ${
                hoveredSegment === allocation.id ? 'bg-black/5' : 'hover:bg-black/3'
              }`}
              onMouseEnter={() => setHoveredSegment(allocation.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => handleVote(allocation.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: allocation.color }}
              />
              <p className="text-[10px] md:text-xs font-medium text-foreground">
                {allocation.label}
              </p>
              <div className="flex items-center gap-0.5 md:gap-1">
                <motion.span
                  key={animatedVotes[allocation.id]}
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[9px] md:text-[10px] font-medium text-muted-foreground"
                >
                  {animatedVotes[allocation.id] || allocation.votes}
                </motion.span>
                <TrendingUp className="w-2 h-2 md:w-2.5 md:h-2.5 text-green-500" />
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
        className="text-[8px] md:text-[10px] text-black/40 font-medium mt-auto pt-1"
      >
        Tap to vote • Live transparency
      </motion.p>
    </div>
  );
};

export default LiveDataState;
