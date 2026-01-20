import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Vote, TrendingUp } from "lucide-react";
import { Confetti } from "@/components/shared/Confetti";

/**
 * TransparentVotingCard - Standalone card for tithing/voting visualization
 * Designed to fit inside InnerCard (340x340px) and scale properly
 */

interface Allocation {
  id: string;
  label: string;
  percentage: number;
  color: string;
  votes: number;
}

const CHURCH_NAME = "Christ is King Community";
const TOTAL_MONTHLY = 45200;

const ALLOCATIONS: Allocation[] = [
  { id: "missions", label: "Missions", percentage: 40, color: "#3B82F6", votes: 234 },
  { id: "operations", label: "Operations", percentage: 25, color: "#10B981", votes: 156 },
  { id: "reserve", label: "Reserve", percentage: 15, color: "#F59E0B", votes: 89 },
  { id: "community", label: "Community", percentage: 20, color: "#8B5CF6", votes: 178 },
];

const TransparentVotingCard = () => {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [animatedVotes, setAnimatedVotes] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize votes from allocation data
  useEffect(() => {
    const initialVotes: Record<string, number> = {};
    ALLOCATIONS.forEach((a) => {
      initialVotes[a.id] = a.votes;
    });
    setVotes(initialVotes);
    setAnimatedVotes(initialVotes);
  }, []);

  // Simulate vote increases
  useEffect(() => {
    const interval = setInterval(() => {
      const allocationIds = ALLOCATIONS.map((a) => a.id);
      const randomId = allocationIds[Math.floor(Math.random() * allocationIds.length)];

      setVotes((prev) => ({
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
    setVotes((prev) => ({
      ...prev,
      [allocationId]: (prev[allocationId] || 0) + 1,
    }));

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  // Calculate donut chart segments
  const donutSegments = useMemo(() => {
    let cumulativePercentage = 0;
    return ALLOCATIONS.map((allocation) => {
      const startAngle = cumulativePercentage * 3.6;
      cumulativePercentage += allocation.percentage;
      const endAngle = cumulativePercentage * 3.6;
      return { ...allocation, startAngle, endAngle };
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl flex flex-col p-4 overflow-hidden relative">
      <Confetti isActive={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Vote className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Transparent Voting</span>
      </div>
      <p className="text-xs text-center text-muted-foreground mb-3">{CHURCH_NAME}</p>

      {/* Main content - stacked for card format */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {/* Donut Chart */}
        <div className="relative w-[120px] h-[120px] flex-shrink-0">
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
                  strokeWidth={isHovered ? 16 : 14}
                  strokeDasharray={`${strokeDasharray} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    transformOrigin: "50% 50%",
                    filter: isHovered ? "brightness(1.1)" : "none",
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
                <p className="text-lg font-bold text-foreground">
                  {donutSegments.find((s) => s.id === hoveredSegment)?.percentage}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {donutSegments.find((s) => s.id === hoveredSegment)?.label}
                </p>
              </motion.div>
            ) : (
              <motion.div key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-sm font-bold text-foreground">{formatCurrency(TOTAL_MONTHLY)}</p>
                <p className="text-[10px] text-muted-foreground">Monthly</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Allocation list */}
        <div className="w-full grid grid-cols-2 gap-2">
          {ALLOCATIONS.map((allocation) => (
            <motion.div
              key={allocation.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                hoveredSegment === allocation.id ? "bg-black/5" : "hover:bg-black/3"
              }`}
              onMouseEnter={() => setHoveredSegment(allocation.id)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => handleVote(allocation.id)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: allocation.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{allocation.label}</p>
              </div>
              <div className="flex items-center gap-1">
                <motion.span
                  key={animatedVotes[allocation.id]}
                  initial={{ y: -4, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[10px] font-medium text-muted-foreground"
                >
                  {animatedVotes[allocation.id] || allocation.votes}
                </motion.span>
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-[10px] text-center text-black/40 font-medium mt-2">Tap to vote • Live transparency</p>
    </div>
  );
};

export default TransparentVotingCard;
