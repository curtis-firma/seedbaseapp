import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Calendar, Package, TrendingUp, 
  Check, X, Clock, Send, Vote, ChevronRight,
  PieChart as PieChartIcon, ArrowUpRight, Lock,
  Sparkles, ChevronLeft, Eye
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { KeyGatedCard } from '@/components/shared/KeyGatedCard';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Confetti } from '@/components/shared/Confetti';

interface TransparencyDashboardProps {
  viewMode: 'activator' | 'trustee' | 'envoy';
  className?: string;
}

// Demo allocation data
const allocationData = [
  { name: 'Rent', value: 35, color: 'hsl(217, 91%, 60%)', icon: Home },
  { name: 'Salaries', value: 30, color: 'hsl(142, 71%, 45%)', icon: Users },
  { name: 'Events', value: 15, color: 'hsl(271, 81%, 56%)', icon: Calendar },
  { name: 'Outreach', value: 20, color: 'hsl(24, 94%, 50%)', icon: Package },
];

// Demo transaction history
const transactions = [
  { id: 1, category: 'Rent', description: 'Monthly Facility Rental', amount: 2800, date: '2 days ago' },
  { id: 2, category: 'Salaries', description: 'Staff Payroll Jan', amount: 4500, date: '5 days ago' },
  { id: 3, category: 'Events', description: 'Youth Retreat Venue', amount: 1200, date: '1 week ago' },
  { id: 4, category: 'Outreach', description: 'Community Food Drive', amount: 800, date: '2 weeks ago' },
  { id: 5, category: 'Salaries', description: 'Ministry Director', amount: 3200, date: '2 weeks ago' },
  { id: 6, category: 'Events', description: 'Worship Night Setup', amount: 450, date: '3 weeks ago' },
];

// Demo vote proposals
const initialVotes = [
  { id: 'v1', title: 'Increase Events Budget 5%', description: 'Allocate more to community events', yesVotes: 24, noVotes: 8, deadline: '3 days', hasVoted: false },
  { id: 'v2', title: 'New Outreach Partner', description: 'Partner with local food bank', yesVotes: 31, noVotes: 5, deadline: '1 week', hasVoted: false },
  { id: 'v3', title: 'Quarterly Staff Bonus', description: 'Approve performance bonus', yesVotes: 18, noVotes: 12, deadline: '5 days', hasVoted: false },
];

// Animated counter component
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

// Category color helper
function getCategoryColor(category: string): string {
  const cat = allocationData.find(a => a.name === category);
  return cat?.color || 'hsl(var(--muted))';
}

// Category icon helper
function getCategoryIcon(category: string) {
  const cat = allocationData.find(a => a.name === category);
  return cat?.icon || Package;
}

// Tour steps configuration
const tourSteps = [
  {
    id: 'allocation',
    title: 'Allocation Breakdown',
    description: 'See exactly how funds are distributed across categories like Rent, Salaries, Events, and Outreach.',
    icon: PieChartIcon,
  },
  {
    id: 'transactions',
    title: 'Transaction History',
    description: 'Every withdrawal is tagged and visible. Track exactly where funds go.',
    icon: Eye,
  },
  {
    id: 'voting',
    title: 'Governance Voting',
    description: 'Cast your vote on proposals to help shape how funds are allocated.',
    icon: Vote,
  },
  {
    id: 'contribution',
    title: 'Your Contribution',
    description: 'See how your seed grows and generates impact across the network.',
    icon: TrendingUp,
  },
];

const TOUR_STORAGE_KEY = 'transparency-dashboard-tour-completed';

export function TransparencyDashboard({ viewMode, className }: TransparencyDashboardProps) {
  const { isKeyActive } = useUser();
  const haptic = useHaptic();
  const hasBaseKey = isKeyActive('BaseKey');
  
  const [votes, setVotes] = useState(initialVotes);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  
  // Tour state
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Breakdown modal state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  
  const totalPool = 12500;
  
  // Check if tour should show on mount
  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      // Delay to let dashboard animate in first
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Animate total on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = totalPool / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalPool) {
        setAnimatedTotal(totalPool);
        clearInterval(timer);
      } else {
        setAnimatedTotal(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update highlighted section when tour step changes
  useEffect(() => {
    if (showTour && tourSteps[tourStep]) {
      setHighlightedSection(tourSteps[tourStep].id);
      haptic.light();
    } else {
      setHighlightedSection(null);
    }
  }, [tourStep, showTour]);
  
  const handleNextStep = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      completeTour();
    }
  };
  
  const handlePrevStep = () => {
    if (tourStep > 0) {
      setTourStep(prev => prev - 1);
    }
  };
  
  const completeTour = () => {
    haptic.success();
    setShowTour(false);
    setHighlightedSection(null);
    setShowConfetti(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    toast.success('Tour completed! Explore the dashboard.');
    setTimeout(() => setShowConfetti(false), 3000);
  };
  
  const handleCategoryClick = (categoryName: string) => {
    haptic.light();
    setSelectedCategory(categoryName);
    setShowBreakdownModal(true);
  };
  
  const categoryTransactions = selectedCategory
    ? transactions.filter(tx => tx.category === selectedCategory)
    : [];
  
  const categoryTotal = categoryTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const skipTour = () => {
    setShowTour(false);
    setHighlightedSection(null);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  };
  
  const restartTour = () => {
    setTourStep(0);
    setShowTour(true);
  };
  
  const handleVote = (voteId: string, choice: 'yes' | 'no') => {
    haptic.medium();
    setVotes(prev => prev.map(v => {
      if (v.id === voteId && !v.hasVoted) {
        return {
          ...v,
          hasVoted: true,
          yesVotes: choice === 'yes' ? v.yesVotes + 1 : v.yesVotes,
          noVotes: choice === 'no' ? v.noVotes + 1 : v.noVotes,
        };
      }
      return v;
    }));
    toast.success(`Vote recorded: ${choice === 'yes' ? 'Yes' : 'No'}`);
  };
  
  const handlePostUpdate = () => {
    haptic.medium();
    toast.success('Transparency update published to feed!');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-6 relative", className)}
    >
      {/* Confetti on tour completion */}
      <Confetti isActive={showConfetti} />
      
      {/* Category Breakdown Modal */}
      <AnimatePresence>
        {showBreakdownModal && selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBreakdownModal(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card rounded-2xl border border-border/50 shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div 
                className="p-5 border-b border-border/50"
                style={{ backgroundColor: `${getCategoryColor(selectedCategory)}10` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${getCategoryColor(selectedCategory)}20` }}
                    >
                      {(() => {
                        const Icon = getCategoryIcon(selectedCategory);
                        return <Icon className="h-6 w-6" style={{ color: getCategoryColor(selectedCategory) }} />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{selectedCategory}</h3>
                      <p className="text-sm text-muted-foreground">{categoryTransactions.length} transactions</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBreakdownModal(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>
                
                {/* Category Total */}
                <div className="mt-4 p-4 rounded-xl bg-card">
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-3xl font-bold" style={{ color: getCategoryColor(selectedCategory) }}>
                    <AnimatedCounter value={categoryTotal} prefix="$" />
                  </p>
                </div>
              </div>
              
              {/* Transactions List */}
              <div className="p-5 max-h-[400px] overflow-y-auto">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">All Transactions</h4>
                <div className="space-y-3">
                  {categoryTransactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                    >
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                      <p className="font-semibold" style={{ color: getCategoryColor(selectedCategory) }}>
                        -${tx.amount.toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tour Overlay */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={skipTour} />
            
            {/* Tour Card */}
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute bottom-24 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-card rounded-2xl border border-border/50 shadow-2xl p-5 pointer-events-auto z-[60]"
            >
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {tourSteps.map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      i === tourStep ? "bg-primary" : "bg-muted"
                    )}
                    animate={i === tourStep ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
              
              {/* Step content */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                >
                  {tourSteps[tourStep] && (() => {
                    const StepIcon = tourSteps[tourStep].icon;
                    return <StepIcon className="h-8 w-8 text-primary" />;
                  })()}
                </motion.div>
                <h3 className="font-bold text-xl mb-2">{tourSteps[tourStep]?.title}</h3>
                <p className="text-muted-foreground">{tourSteps[tourStep]?.description}</p>
              </div>
              
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={skipTour}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip Tour
                </motion.button>
                
                <div className="flex items-center gap-2">
                  {tourStep > 0 && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevStep}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2"
                  >
                    <span>{tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}</span>
                    {tourStep === tourSteps.length - 1 ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Restart Tour Button */}
      {!showTour && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={restartTour}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Take the Tour</span>
        </motion.button>
      )}
      
      {/* Allocation Pie Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "bg-card rounded-2xl border border-border/50 p-5 transition-all duration-300",
          highlightedSection === 'allocation' && "ring-2 ring-primary ring-offset-2 ring-offset-background relative z-[55]"
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <PieChartIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Allocation Breakdown</h3>
            <p className="text-sm text-muted-foreground">How funds are distributed</p>
          </div>
        </div>
        
        {/* Chart and Legend */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={(_, index) => setHoveredSegment(allocationData[index].name)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {allocationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke={hoveredSegment === entry.name ? 'hsl(var(--background))' : 'transparent'}
                      strokeWidth={hoveredSegment === entry.name ? 3 : 0}
                      onClick={() => handleCategoryClick(entry.name)}
                      style={{
                        filter: hoveredSegment === entry.name ? 'brightness(1.1)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border/50 rounded-lg px-3 py-2 shadow-lg">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-sm text-muted-foreground">{data.value}% of pool</p>
                          <p className="text-sm font-medium">${Math.round(totalPool * data.value / 100).toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold">
                <AnimatedCounter value={animatedTotal} prefix="$" />
              </p>
              <p className="text-xs text-muted-foreground">Total Pool</p>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {allocationData.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer",
                    hoveredSegment === item.name ? "bg-muted" : "hover:bg-muted/50"
                  )}
                  onMouseEnter={() => setHoveredSegment(item.name)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => handleCategoryClick(item.name)}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.value}%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
      
      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "bg-card rounded-2xl border border-border/50 p-5 transition-all duration-300",
          highlightedSection === 'transactions' && "ring-2 ring-primary ring-offset-2 ring-offset-background relative z-[55]"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Recent Transactions</h3>
          <span className="text-sm text-muted-foreground">Tagged withdrawals</span>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {transactions.map((tx, i) => {
            const Icon = getCategoryIcon(tx.category);
            const color = getCategoryColor(tx.category);
            
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{tx.description}</p>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {tx.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{tx.date}</span>
                  </div>
                </div>
                <p className="font-semibold text-sm">-${tx.amount.toLocaleString()}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Voting Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "transition-all duration-300",
          highlightedSection === 'voting' && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl relative z-[55]"
        )}
      >
        <KeyGatedCard requiredKey="BaseKey" unlockMessage="Get BaseKey to vote on governance proposals">
          <div className="bg-card rounded-2xl border border-border/50 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Vote className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Active Votes</h3>
                <p className="text-sm text-muted-foreground">Cast your vote on proposals</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {votes.map((vote, i) => {
                const totalVotes = vote.yesVotes + vote.noVotes;
                const yesPercentage = totalVotes > 0 ? (vote.yesVotes / totalVotes) * 100 : 50;
                
                return (
                  <motion.div
                    key={vote.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{vote.title}</p>
                        <p className="text-sm text-muted-foreground">{vote.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{vote.deadline}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${yesPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-500 font-medium">
                          Yes: {vote.yesVotes}
                        </span>
                        <span className="text-red-500 font-medium">
                          No: {vote.noVotes}
                        </span>
                      </div>
                      
                      {vote.hasVoted ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Voted</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVote(vote.id, 'yes')}
                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors"
                          >
                            Yes
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVote(vote.id, 'no')}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors"
                          >
                            No
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </KeyGatedCard>
      </motion.div>
      
      {/* Trustee-only: Post Update */}
      {viewMode === 'trustee' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handlePostUpdate}
            className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2"
          >
            <Send className="h-5 w-5" />
            <span>Post Transparency Update to Feed</span>
          </motion.button>
        </motion.div>
      )}
      
      {/* Activator/Envoy view: Your Contribution Summary */}
      {(viewMode === 'activator' || viewMode === 'envoy') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "bg-card rounded-2xl border border-primary/30 p-5 transition-all duration-300",
            highlightedSection === 'contribution' && "ring-2 ring-primary ring-offset-2 ring-offset-background relative z-[55]"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Your Contribution</h3>
              <p className="text-sm text-muted-foreground">How your seed is deployed</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                <AnimatedCounter value={5000} prefix="$" />
              </p>
              <p className="text-sm text-muted-foreground">Your Locked Value</p>
            </div>
            <div className="bg-muted/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                <AnimatedCounter value={125} prefix="$" />
              </p>
              <p className="text-sm text-muted-foreground">Generated This Cycle</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Your share of allocations:</p>
            <div className="flex flex-wrap gap-2">
              {allocationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ${Math.round(125 * item.value / 100)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default TransparencyDashboard;
