import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Calendar, Package, TrendingUp, 
  Check, X, Clock, Send, Vote, ChevronRight,
  PieChart as PieChartIcon, ArrowUpRight, Lock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { KeyGatedCard } from '@/components/shared/KeyGatedCard';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TransparencyDashboardProps {
  viewMode: 'activator' | 'trustee';
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

export function TransparencyDashboard({ viewMode, className }: TransparencyDashboardProps) {
  const { isKeyActive } = useUser();
  const haptic = useHaptic();
  const hasBaseKey = isKeyActive('BaseKey');
  
  const [votes, setVotes] = useState(initialVotes);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  
  const totalPool = 12500;
  
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
      className={cn("space-y-6", className)}
    >
      {/* Allocation Pie Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border/50 p-5"
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
        className="bg-card rounded-2xl border border-border/50 p-5"
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
      
      {/* Activator view: Your Contribution Summary */}
      {viewMode === 'activator' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-primary/30 p-5"
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
