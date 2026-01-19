import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Vote, TrendingUp } from 'lucide-react';

interface Allocation {
  id: string;
  label: string;
  percentage: number;
  color: string;
  votes: number;
}

interface Church {
  id: string;
  name: string;
  allocations: Allocation[];
  totalMonthly: number;
}

const CHURCHES: Church[] = [
  {
    id: 'cik',
    name: 'Christ is King Community',
    totalMonthly: 45200,
    allocations: [
      { id: 'missions', label: 'Missions', percentage: 40, color: '#3B82F6', votes: 234 },
      { id: 'operations', label: 'Operations', percentage: 25, color: '#10B981', votes: 156 },
      { id: 'reserve', label: 'Reserve', percentage: 15, color: '#F59E0B', votes: 89 },
      { id: 'community', label: 'Community', percentage: 20, color: '#8B5CF6', votes: 178 },
    ],
  },
  {
    id: 'grace',
    name: 'Grace Fellowship',
    totalMonthly: 32800,
    allocations: [
      { id: 'missions', label: 'Missions', percentage: 35, color: '#3B82F6', votes: 189 },
      { id: 'operations', label: 'Operations', percentage: 30, color: '#10B981', votes: 145 },
      { id: 'reserve', label: 'Reserve', percentage: 10, color: '#F59E0B', votes: 67 },
      { id: 'community', label: 'Community', percentage: 25, color: '#8B5CF6', votes: 203 },
    ],
  },
  {
    id: 'hope',
    name: 'Hope Church',
    totalMonthly: 28500,
    allocations: [
      { id: 'missions', label: 'Missions', percentage: 45, color: '#3B82F6', votes: 312 },
      { id: 'operations', label: 'Operations', percentage: 20, color: '#10B981', votes: 98 },
      { id: 'reserve', label: 'Reserve', percentage: 15, color: '#F59E0B', votes: 76 },
      { id: 'community', label: 'Community', percentage: 20, color: '#8B5CF6', votes: 124 },
    ],
  },
];

const LiveDataState = () => {
  const [selectedChurchId, setSelectedChurchId] = useState(CHURCHES[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [animatedVotes, setAnimatedVotes] = useState<Record<string, number>>({});

  const selectedChurch = useMemo(() => 
    CHURCHES.find(c => c.id === selectedChurchId) || CHURCHES[0],
    [selectedChurchId]
  );

  // Initialize votes from church data
  useEffect(() => {
    const initialVotes: Record<string, number> = {};
    selectedChurch.allocations.forEach(a => {
      initialVotes[a.id] = a.votes;
    });
    setVotes(initialVotes);
    setAnimatedVotes(initialVotes);
  }, [selectedChurch]);

  // Simulate vote increases
  useEffect(() => {
    const interval = setInterval(() => {
      const allocationIds = selectedChurch.allocations.map(a => a.id);
      const randomId = allocationIds[Math.floor(Math.random() * allocationIds.length)];
      
      setVotes(prev => ({
        ...prev,
        [randomId]: (prev[randomId] || 0) + 1,
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedChurch]);

  // Animate vote count changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedVotes(votes);
    }, 100);
    return () => clearTimeout(timeout);
  }, [votes]);

  const handleVote = (allocationId: string) => {
    setVotes(prev => ({
      ...prev,
      [allocationId]: (prev[allocationId] || 0) + 1,
    }));
  };

  // Calculate donut chart segments
  const donutSegments = useMemo(() => {
    let cumulativePercentage = 0;
    return selectedChurch.allocations.map(allocation => {
      const startAngle = cumulativePercentage * 3.6; // Convert to degrees
      cumulativePercentage += allocation.percentage;
      const endAngle = cumulativePercentage * 3.6;
      return { ...allocation, startAngle, endAngle };
    });
  }, [selectedChurch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 md:p-4">
      {/* Church Selector Dropdown */}
      <div className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-black/5 text-xs md:text-sm font-medium text-foreground hover:bg-white transition-colors"
          >
            <span className="truncate max-w-[140px] md:max-w-[180px]">{selectedChurch.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden min-w-[180px] z-30"
              >
                {CHURCHES.map(church => (
                  <button
                    key={church.id}
                    onClick={() => {
                      setSelectedChurchId(church.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs md:text-sm flex items-center justify-between hover:bg-muted/50 transition-colors ${
                      church.id === selectedChurchId ? 'bg-muted/30' : ''
                    }`}
                  >
                    <span className="truncate">{church.name}</span>
                    {church.id === selectedChurchId && (
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-3 md:gap-6 mt-6">
        {/* Donut Chart */}
        <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px]">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {donutSegments.map((segment, index) => {
              const radius = 40;
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
                  strokeWidth={isHovered ? 14 : 12}
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
            <AnimatePresence mode="wait">
              {hoveredSegment ? (
                <motion.div
                  key={hoveredSegment}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    {donutSegments.find(s => s.id === hoveredSegment)?.percentage}%
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">
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
                    {formatCurrency(selectedChurch.totalMonthly)}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">Monthly</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Allocation list with voting */}
        <div className="flex flex-col gap-1.5 md:gap-2">
          {selectedChurch.allocations.map((allocation) => (
            <motion.div
              key={allocation.id}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all ${
                hoveredSegment === allocation.id ? 'bg-black/5' : 'hover:bg-black/3'
              }`}
              onMouseEnter={() => setHoveredSegment(allocation.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => handleVote(allocation.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: allocation.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-foreground truncate">
                  {allocation.label}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Vote className="w-3 h-3 text-muted-foreground" />
                <motion.span
                  key={animatedVotes[allocation.id]}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[10px] md:text-xs font-medium text-muted-foreground min-w-[24px]"
                >
                  {animatedVotes[allocation.id] || allocation.votes}
                </motion.span>
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
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
        className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-black/40 font-medium"
      >
        Tap to vote • Live transparency
      </motion.p>
    </div>
  );
};

export default LiveDataState;
