import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Users, Layers, Target } from 'lucide-react';
import { mockVaultMetrics } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

export default function VaultPage() {
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-base flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vault</h1>
              <p className="text-sm text-muted-foreground">Network Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {mockVaultMetrics.slice(0, 4).map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>

        {/* Supply Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/50 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Total Locked Value</h3>
              <p className="text-2xl font-bold">$429,000</p>
            </div>
            <span className="flex items-center gap-1 text-sm text-seed">
              <TrendingUp className="h-4 w-4" />
              +12.5%
            </span>
          </div>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockVaultMetrics[0].chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
                <YAxis 
                  hide
                  domain={['dataMin - 50000', 'dataMax + 50000']}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Allocation Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border/50 p-5"
        >
          <h3 className="font-semibold mb-4">Allocation by Seedbase</h3>
          
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
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
                </RePieChart>
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

        {/* Distribution Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl border border-border/50 p-5"
        >
          <h3 className="font-semibold mb-4">Recent Distributions</h3>
          
          <div className="space-y-4">
            {distributionData.map((dist, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                  {dist.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{dist.seedbase}</p>
                  <p className="text-sm text-muted-foreground">{dist.mission}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${dist.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{dist.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-seed to-seed-glow rounded-2xl p-5 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6" />
            <h3 className="font-semibold">Network Efficiency</h3>
          </div>
          <p className="text-4xl font-bold mb-2">98.5%</p>
          <p className="text-white/80 text-sm">
            of committed capital reaches missions. Zero overhead, maximum impact.
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground italic py-4"
        >
          "Governed by rules, not people."
        </motion.p>
      </div>
    </div>
  );
}

function MetricCard({ metric, index }: { metric: typeof mockVaultMetrics[0]; index: number }) {
  const isPositive = metric.change > 0;
  const formatValue = (val: number) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    if (metric.id === 'vm-5') return `${val}%`;
    return val.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl border border-border/50 p-4"
    >
      <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
      <p className="text-xl font-bold mb-1">{formatValue(metric.value)}</p>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="h-3 w-3 text-seed" />
        ) : (
          <TrendingDown className="h-3 w-3 text-destructive" />
        )}
        <span className={cn(
          "text-xs",
          isPositive ? "text-seed" : "text-destructive"
        )}>
          {isPositive ? '+' : ''}{metric.change}{typeof metric.change === 'number' && metric.id !== 'vm-5' ? '%' : ''}
        </span>
      </div>
    </motion.div>
  );
}

const allocationData = [
  { name: 'Clean Water', value: 35, color: 'hsl(221, 83%, 53%)' },
  { name: 'Healthcare', value: 30, color: 'hsl(142, 76%, 36%)' },
  { name: 'Education', value: 25, color: 'hsl(262, 83%, 58%)' },
  { name: 'Other', value: 10, color: 'hsl(215, 20%, 65%)' },
];

const distributionData = [
  { seedbase: 'Clean Water Initiative', mission: 'Solar Wells Kenya', amount: 5000, date: 'Today', icon: '💧' },
  { seedbase: 'Healthcare Access', mission: 'Medical Supplies', amount: 8000, date: 'Yesterday', icon: '🏥' },
  { seedbase: 'Education Forward', mission: 'Mobile Classrooms', amount: 3500, date: '3 days ago', icon: '📚' },
];
