import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet as WalletIcon, Lock, Clock, ArrowDownRight, ArrowUpRight,
  Key, CheckCircle2, XCircle, Sprout, Shield, Rocket, ChevronRight,
  Layers, PiggyBank, Receipt, Users, Vote, AlertCircle
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { trusteeWallets, pendingTransfers } from '@/data/mockData';

export default function WalletPage() {
  const { user, activeRole, isKeyActive } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  
  const isTrustee = activeRole === 'trustee' && isKeyActive('BaseKey');
  const tabs = isTrustee ? ['Personal', 'Missions', 'Provision'] : ['Wallet', 'Keys'];

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl bg-muted"
            />
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{activeRole} since Jan 2024</p>
            </div>
          </div>

          <SwipeTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </header>

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {isTrustee ? (
            <>
              {activeTab === 0 && <PersonalWalletView key="personal" user={user} />}
              {activeTab === 1 && <MissionsWalletView key="missions" />}
              {activeTab === 2 && <ProvisionPoolView key="provision" />}
            </>
          ) : (
            <>
              {activeTab === 0 && <PersonalWalletView key="personal" user={user} />}
              {activeTab === 1 && <KeysView key="keys" user={user} />}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PersonalWalletView({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary to-base-glow rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <WalletIcon className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Available Balance</span>
        </div>
        <p className="text-3xl font-bold mb-4">
          ${user.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium"
          >
            <ArrowDownRight className="h-4 w-4" />
            Receive
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium"
          >
            <ArrowUpRight className="h-4 w-4" />
            Send
          </motion.button>
        </div>
      </motion.div>

      {/* Pending Transfers */}
      {pendingTransfers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Pending Transfers</h2>
            <span className="px-2 py-1 bg-envoy/10 text-envoy rounded-full text-xs font-medium">
              {pendingTransfers.length} pending
            </span>
          </div>
          <div className="space-y-2">
            {pendingTransfers.map((transfer, i) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-seed/30 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{transfer.from}</span>
                  <span className="text-lg font-bold text-seed">${transfer.amount}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{transfer.purpose}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 gradient-seed rounded-xl text-white font-medium text-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-muted rounded-xl text-sm"
                  >
                    Decline
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Balance Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50"
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-seed/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-seed" />
            </div>
            <div>
              <p className="font-medium">Locked Seed</p>
              <p className="text-sm text-muted-foreground">Committed capital</p>
            </div>
          </div>
          <p className="font-semibold">${user.lockedSeed.toLocaleString()}</p>
        </div>
        
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-envoy/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-envoy" />
            </div>
            <div>
              <p className="font-medium">Pending Distributions</p>
              <p className="text-sm text-muted-foreground">Accept in OneAccord</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${user.pendingDistributions.toLocaleString()}</p>
            <span className="text-sm text-primary font-medium">View →</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-semibold text-lg mb-3">Recent Activity</h2>
        
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {[
            { type: 'distribution', amount: 125, from: 'Clean Water Initiative', date: '2 days ago' },
            { type: 'commit', amount: -1500, from: 'Healthcare Access', date: '1 week ago' },
            { type: 'distribution', amount: 89, from: 'Education Forward', date: '2 weeks ago' },
          ].map((tx, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                tx.amount > 0 ? "bg-seed/10" : "bg-primary/10"
              )}>
                {tx.amount > 0 ? (
                  <ArrowDownRight className="h-5 w-5 text-seed" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {tx.type === 'distribution' ? 'Distribution Received' : 'Seed Committed'}
                </p>
                <p className="text-sm text-muted-foreground">{tx.from}</p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold",
                  tx.amount > 0 ? "text-seed" : "text-foreground"
                )}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-muted-foreground italic py-4"
      >
        "USDC in. USDC out. Value stays."
      </motion.p>
    </motion.div>
  );
}

function KeysView({ user }: { user: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
        <p className="text-sm">
          <span className="font-semibold">Power comes from Keys, not profiles.</span> Keys are earned through commitment, application, or approval.
        </p>
      </div>

      <div className="space-y-3">
        {user.keys.map((key: any, i: number) => {
          const config = keyConfig[key.type as keyof typeof keyConfig];
          return (
            <motion.div
              key={key.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-card rounded-2xl border p-4 flex items-center gap-4",
                key.isActive ? "border-border/50" : "border-dashed border-border"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                key.isActive ? config.gradient : "bg-muted"
              )}>
                <config.icon className={cn(
                  "h-6 w-6",
                  key.isActive ? "text-white" : "text-muted-foreground"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{key.type}</p>
                  {key.isActive ? (
                    <CheckCircle2 className="h-4 w-4 text-seed" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{config.role}</p>
              </div>
              {!key.isActive && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium text-white",
                    config.gradient
                  )}
                >
                  Activate
                </motion.button>
              )}
              {key.isActive && (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function MissionsWalletView() {
  const wallet = trusteeWallets.missionsWallet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-trust to-purple-500 rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <Layers className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Missions Wallet</span>
        </div>
        <p className="text-3xl font-bold mb-2">
          ${wallet.balance.toLocaleString()}
        </p>
        <p className="text-sm opacity-80 mb-4">
          ${wallet.pendingDistributions.toLocaleString()} pending distribution
        </p>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" />
          Distribute to Mission
        </motion.button>
      </motion.div>

      {/* Info */}
      <div className="bg-trust/5 rounded-2xl p-4 border border-trust/20">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-trust flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Trustee View</p>
            <p className="text-sm text-muted-foreground">
              As a Trustee, you can view mission funds and initiate distributions to approved Envoys. You do not have custody—all transactions are governed by smart contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Distributions */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Pending Distributions</h3>
        <div className="space-y-2">
          {[
            { mission: 'Solar-Powered Wells', envoy: 'Sarah Kimani', amount: 5000, status: 'awaiting_approval' },
            { mission: 'Mobile Classrooms', envoy: 'Marcus Okonkwo', amount: 3500, status: 'ready' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border/50 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.mission}</span>
                <span className="font-bold">${item.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To: {item.envoy}</span>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  item.status === 'ready' ? "bg-seed/10 text-seed" : "bg-envoy/10 text-envoy"
                )}>
                  {item.status === 'ready' ? 'Ready' : 'Awaiting Approval'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProvisionPoolView() {
  const pool = trusteeWallets.provisionPool;
  const totalSpent = pool.categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalAllocated = pool.categories.reduce((sum, cat) => sum + cat.allocated, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-envoy to-amber-400 rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Provision Pool</span>
        </div>
        <p className="text-3xl font-bold mb-2">
          ${pool.balance.toLocaleString()}
        </p>
        <div className="flex items-center gap-4 text-sm opacity-80">
          <span>Budget: ${pool.monthlyBudget}/mo</span>
          <span>Spent: ${totalSpent}</span>
        </div>
      </motion.div>

      {/* Info Banner */}
      <div className="bg-envoy/5 rounded-2xl p-4 border border-envoy/20">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-envoy flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Activator Visibility</p>
            <p className="text-sm text-muted-foreground">
              Connected Activators can view how Provision Pool funds are used. Transparency builds trust.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-lg mb-3">Budget Categories</h3>
        <div className="space-y-3">
          {pool.categories.map((cat, i) => {
            const progress = (cat.spent / cat.allocated) * 100;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border/50 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm">
                    <span className="font-semibold">${cat.spent}</span>
                    <span className="text-muted-foreground"> / ${cat.allocated}</span>
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                    className={cn(
                      "h-full rounded-full",
                      progress > 90 ? "bg-destructive" : "gradient-envoy"
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Withdraw Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 gradient-envoy rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
      >
        <Receipt className="h-5 w-5" />
        Request Withdrawal
      </motion.button>

      {/* Voting Coming Soon */}
      <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Vote className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Activator Voting</p>
            <p className="text-sm text-muted-foreground">Vote on budget allocations</p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            Coming Soon
          </span>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-muted-foreground italic py-4"
      >
        "Governed by rules, not people."
      </motion.p>
    </motion.div>
  );
}

const keyConfig = {
  SeedKey: {
    icon: Sprout,
    gradient: 'gradient-seed',
    role: 'Activator',
  },
  BaseKey: {
    icon: Shield,
    gradient: 'gradient-trust',
    role: 'Trustee',
  },
  MissionKey: {
    icon: Rocket,
    gradient: 'gradient-envoy',
    role: 'Envoy',
  },
};
