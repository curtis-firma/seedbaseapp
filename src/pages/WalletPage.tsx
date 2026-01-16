import { motion } from 'framer-motion';
import { 
  Wallet as WalletIcon, Lock, Clock, ArrowDownRight, ArrowUpRight,
  Key, CheckCircle2, XCircle, Sprout, Shield, Rocket, ChevronRight
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

export default function WalletPage() {
  const { user } = useUser();

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
              <p className="text-sm text-muted-foreground">Activator since Jan 2024</p>
            </div>
          </div>

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
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Balance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-sm text-primary font-medium"
              >
                View →
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg mb-3">Your Keys</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Power comes from Keys, not profiles.
          </p>
          
          <div className="space-y-3">
            {user.keys.map((key, i) => {
              const config = keyConfig[key.type];
              return (
                <motion.div
                  key={key.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground italic py-4"
        >
          "USDC in. USDC out. Value stays."
        </motion.p>
      </div>
    </div>
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
