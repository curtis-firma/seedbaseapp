import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart as PieChartIcon, TrendingUp, ArrowUpRight, DollarSign,
  Home, Users, Plane, Calendar, Package, Lock, Vote, Check, X,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { ComingSoonModal, useComingSoon } from '@/components/shared/ComingSoonModal';

const allocationData = [
  { name: 'Rent/Facility', value: 35, color: 'hsl(221, 83%, 53%)', icon: Home },
  { name: 'Salaries', value: 30, color: 'hsl(142, 76%, 36%)', icon: Users },
  { name: 'Travel', value: 15, color: 'hsl(262, 83%, 58%)', icon: Plane },
  { name: 'Events', value: 12, color: 'hsl(25, 95%, 53%)', icon: Calendar },
  { name: 'Outreach', value: 8, color: 'hsl(215, 20%, 65%)', icon: Package },
];

const balanceHistory = [
  { date: 'Jan', value: 5000 },
  { date: 'Feb', value: 6200 },
  { date: 'Mar', value: 5800 },
  { date: 'Apr', value: 7100 },
  { date: 'May', value: 8500 },
  { date: 'Jun', value: 8200 },
];

const recentActivity = [
  { type: 'contribution', from: 'Weekly Tithe', amount: 1200, date: 'Today' },
  { type: 'withdrawal', to: 'Staff Salaries', amount: 2500, date: 'Yesterday', category: 'Salaries' },
  { type: 'contribution', from: 'Special Offering', amount: 500, date: '3 days ago' },
  { type: 'withdrawal', to: 'Venue Rental', amount: 800, date: '5 days ago', category: 'Events' },
];

const pendingVotes = [
  {
    id: 'vote-1',
    title: 'Increase Travel Budget',
    description: 'Proposal to increase travel allocation by 5% for Q2 missions',
    yesVotes: 12,
    noVotes: 3,
    deadline: 'Ends in 2 days',
  },
  {
    id: 'vote-2',
    title: 'New Staff Hire',
    description: 'Approve hiring of part-time outreach coordinator',
    yesVotes: 8,
    noVotes: 7,
    deadline: 'Ends in 5 days',
  },
];

interface ProvisionDashboardProps {
  className?: string;
}

export function ProvisionDashboard({ className }: ProvisionDashboardProps) {
  const { viewRole, isKeyActive } = useUser();
  const { isOpen, featureName, showComingSoon, hideComingSoon } = useComingSoon();
  
  const isActivator = viewRole === 'activator';
  const isTrustee = viewRole === 'trustee';
  const hasBaseKey = isKeyActive('BaseKey');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn("space-y-4", className)}
    >
      {/* Balance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-base-glow rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <PieChartIcon className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Provision Pool</span>
        </div>
        <p className="text-3xl font-bold mb-1">$8,500</p>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <TrendingUp className="h-4 w-4" />
          <span>+12% this month</span>
        </div>
      </motion.div>

      {/* Allocation Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border/50 p-5"
      >
        <h3 className="font-semibold mb-4">Allocation Breakdown</h3>
        
        <div className="flex items-center gap-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-2">
            {allocationData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Balance Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border/50 p-5"
      >
        <h3 className="font-semibold mb-4">Balance History</h3>
        
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceHistory}>
              <defs>
                <linearGradient id="colorProvision" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(221, 83%, 53%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProvision)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Action Buttons - Role Specific */}
      {isActivator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { label: 'Tithe', icon: DollarSign, gradient: 'gradient-seed' },
            { label: 'Donation', icon: DollarSign, gradient: 'gradient-base' },
            { label: 'Offer', icon: DollarSign, gradient: 'gradient-trust' },
          ].map((action) => (
            <motion.button
              key={action.label}
              whileTap={{ scale: 0.98 }}
              onClick={() => showComingSoon(action.label)}
              className={cn(
                "py-3 rounded-xl text-white font-medium flex flex-col items-center gap-1",
                action.gradient
              )}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {isTrustee && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => showComingSoon('Withdraw')}
            className="w-full py-4 gradient-trust rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          >
            <ArrowUpRight className="h-5 w-5" />
            Withdraw from Pool
          </motion.button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Select a purpose category when withdrawing
          </p>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card rounded-2xl border border-border/50 p-5"
      >
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                activity.type === 'contribution' ? "bg-seed/10" : "bg-primary/10"
              )}>
                {activity.type === 'contribution' ? (
                  <TrendingUp className="h-5 w-5 text-seed" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {activity.type === 'contribution' ? activity.from : activity.to}
                </p>
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              <span className={cn(
                "font-semibold",
                activity.type === 'contribution' ? "text-seed" : "text-foreground"
              )}>
                {activity.type === 'contribution' ? '+' : '-'}${activity.amount.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Voting Cards - Key Gated */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="font-semibold flex items-center gap-2">
          <Vote className="h-5 w-5 text-trust" />
          Active Votes
        </h3>
        
        {pendingVotes.map((vote, i) => (
          <motion.div
            key={vote.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className={cn(
              "bg-card rounded-2xl border p-4 relative overflow-hidden",
              hasBaseKey ? "border-border/50" : "border-dashed border-muted"
            )}
          >
            {/* Locked Overlay */}
            {!hasBaseKey && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Lock className="h-6 w-6" />
                  <span className="text-sm font-medium">BaseKey Required</span>
                </div>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{vote.title}</h4>
              <span className="text-xs text-muted-foreground">{vote.deadline}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{vote.description}</p>
            
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-seed" />
                <span className="text-sm font-medium">{vote.yesVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <X className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium">{vote.noVotes}</span>
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-seed"
                  style={{ width: `${(vote.yesVotes / (vote.yesVotes + vote.noVotes)) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!hasBaseKey}
                onClick={() => showComingSoon('Vote Yes')}
                className="py-2 rounded-lg bg-seed/10 text-seed font-medium text-sm disabled:opacity-50"
              >
                Vote Yes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!hasBaseKey}
                onClick={() => showComingSoon('Vote No')}
                className="py-2 rounded-lg bg-destructive/10 text-destructive font-medium text-sm disabled:opacity-50"
              >
                Vote No
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ComingSoonModal isOpen={isOpen} onClose={hideComingSoon} featureName={featureName} />
    </motion.div>
  );
}
