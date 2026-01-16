import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet as WalletIcon, Lock, Clock, ArrowDownRight, ArrowUpRight,
  Key, CheckCircle2, XCircle, Sprout, Shield, Rocket, ChevronRight,
  Layers, PiggyBank, Receipt, Users, Vote, AlertCircle, Plus, Banknote, Copy
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { trusteeWallets } from '@/data/mockData';
import { AddFundsModal } from '@/components/wallet/AddFundsModal';
import { WithdrawModal } from '@/components/wallet/WithdrawModal';
import { SendModal } from '@/components/wallet/SendModal';
import { truncateHexId, loadUserByPhone } from '@/lib/demoAuth';
import { getRecentTransfers, getPendingTransfersForUser, type Transfer } from '@/lib/demoTransfers';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function WalletPage() {
  const { user, activeRole, isKeyActive, walletDisplayId, keyDisplayId, keyType, phoneNumber } = useUser();
  const [activeTab, setActiveTab] = useState(0);
  const [walletBalance, setWalletBalance] = useState(25.00);
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  
  const isTrustee = activeRole === 'trustee' && isKeyActive('BaseKey');
  const tabs = isTrustee ? ['Personal', 'Missions', 'Provision'] : ['Wallet', 'Keys'];

  // Load real balance from localStorage
  useEffect(() => {
    if (phoneNumber) {
      const demoUser = loadUserByPhone(phoneNumber);
      if (demoUser) {
        setWalletBalance(demoUser.wallet.balance);
      }
      setPendingTransfers(getPendingTransfersForUser(phoneNumber));
    }
  }, [phoneNumber]);

  const handleCopyWallet = () => {
    if (walletDisplayId) {
      navigator.clipboard.writeText(walletDisplayId);
      toast.success('Wallet address copied!');
    }
  };

  const refreshBalance = () => {
    if (phoneNumber) {
      const demoUser = loadUserByPhone(phoneNumber);
      if (demoUser) {
        setWalletBalance(demoUser.wallet.balance);
      }
      setPendingTransfers(getPendingTransfersForUser(phoneNumber));
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl bg-muted"
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{activeRole} since Jan 2024</p>
            </div>
          </div>

          {/* Wallet Address Display */}
          {walletDisplayId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-muted/50 rounded-xl p-3 mb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
                <code className="text-sm font-mono">{truncateHexId(walletDisplayId)}</code>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyWallet}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            </motion.div>
          )}

          {/* Active Key Badge */}
          {keyType && keyDisplayId && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <div className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5",
                keyType === 'SeedKey' && "bg-seed/10 text-seed",
                keyType === 'BaseKey' && "bg-trust/10 text-trust",
                keyType === 'MissionKey' && "bg-envoy/10 text-envoy"
              )}>
                <Key className="h-3 w-3" />
                {keyType}
                <CheckCircle2 className="h-3 w-3" />
              </div>
              <code className="text-xs text-muted-foreground font-mono">
                {truncateHexId(keyDisplayId)}
              </code>
            </motion.div>
          )}

          <div className="mt-4">
            <SwipeTabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {isTrustee ? (
            <>
              {activeTab === 0 && <PersonalWalletView key="personal" balance={walletBalance} pendingTransfers={pendingTransfers} onRefresh={refreshBalance} />}
              {activeTab === 1 && <MissionsWalletView key="missions" />}
              {activeTab === 2 && <ProvisionPoolView key="provision" />}
            </>
          ) : (
            <>
              {activeTab === 0 && <PersonalWalletView key="personal" balance={walletBalance} pendingTransfers={pendingTransfers} onRefresh={refreshBalance} />}
              {activeTab === 1 && <KeysView key="keys" user={user} />}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PersonalWalletView({ balance, pendingTransfers, onRefresh }: { balance: number; pendingTransfers: Transfer[]; onRefresh: () => void }) {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const { activeRole, phoneNumber } = useUser();
  const isActivator = activeRole === 'activator';
  const [recentActivity, setRecentActivity] = useState<Transfer[]>([]);

  useEffect(() => {
    if (phoneNumber) {
      setRecentActivity(getRecentTransfers(phoneNumber, 5));
    }
  }, [phoneNumber, balance]);

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
        <div className="flex items-center gap-2 mb-1">
          <WalletIcon className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Personal Balance</span>
        </div>
        <p className="text-3xl font-bold mb-1">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm opacity-80 mb-3">USDC</p>
        
        {/* Activator sees distributions received */}
        {isActivator && (
          <div className="flex items-center gap-2 mb-3 text-sm opacity-90">
            <ArrowDownRight className="h-4 w-4" />
            <span>Distributions Received: $0.00</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddFunds(true)}
            className="flex items-center justify-center gap-2 py-3 bg-white/25 backdrop-blur-sm rounded-xl font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowWithdraw(true)}
            className="flex items-center justify-center gap-2 py-3 bg-white/25 backdrop-blur-sm rounded-xl font-medium"
          >
            <Banknote className="h-4 w-4" />
            Withdraw
          </motion.button>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/15 backdrop-blur-sm rounded-xl font-medium text-sm"
          >
            <ArrowDownRight className="h-4 w-4" />
            Receive
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSend(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/15 backdrop-blur-sm rounded-xl font-medium text-sm"
          >
            <ArrowUpRight className="h-4 w-4" />
            Send
          </motion.button>
        </div>
      </motion.div>

      {/* Modals */}
      <AddFundsModal 
        isOpen={showAddFunds} 
        onClose={() => setShowAddFunds(false)} 
      />
      <WithdrawModal 
        isOpen={showWithdraw} 
        onClose={() => setShowWithdraw(false)}
        balance={balance}
      />
      <SendModal
        isOpen={showSend}
        onClose={() => setShowSend(false)}
        onSuccess={onRefresh}
      />

      {/* Pending Transfers */}
      {pendingTransfers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg">Pending Transfers</h2>
            <span className="px-2 py-1 bg-seed/10 text-seed rounded-full text-xs font-medium">
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
                  <span className="font-medium">@{transfer.fromUsername}</span>
                  <span className="text-lg font-bold text-seed">${transfer.amount.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{transfer.purpose}</p>
                <p className="text-xs text-muted-foreground">
                  Accept in OneAccord to receive funds
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-lg mb-3">Recent Activity</h2>
          
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
            {recentActivity.map((tx, i) => {
              const isIncoming = tx.toPhone === phoneNumber;
              const isAccepted = tx.status === 'accepted';
              
              return (
                <div key={tx.id} className="p-4 flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isIncoming && isAccepted ? "bg-seed/10" : "bg-primary/10"
                  )}>
                    {isIncoming ? (
                      <ArrowDownRight className={cn(
                        "h-5 w-5",
                        isAccepted ? "text-seed" : "text-muted-foreground"
                      )} />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {isIncoming ? `From @${tx.fromUsername}` : `To @${tx.toUsername}`}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">{tx.status}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isIncoming && isAccepted ? "text-seed" : "text-foreground"
                    )}>
                      {isIncoming ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

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
              As a trustee, you can distribute funds to approved missions. All transactions are recorded on-chain.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Distributions */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Pending Distributions</h2>
        <div className="space-y-2">
          {[
            { mission: 'Kenya Water Project', envoy: 'Sarah K.', amount: 5000, status: 'Ready' },
            { mission: 'Guatemala Schools', envoy: 'Marcus O.', amount: 7500, status: 'Pending approval' },
          ].map((dist, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{dist.mission}</span>
                <span className="text-lg font-bold">${dist.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">To: {dist.envoy}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-envoy/10 text-envoy">{dist.status}</span>
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
        className="bg-gradient-to-br from-envoy to-orange-500 rounded-2xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <PiggyBank className="h-5 w-5 opacity-80" />
          <span className="text-sm opacity-80">Provision Pool</span>
        </div>
        <p className="text-3xl font-bold mb-2">
          ${pool.balance.toLocaleString()}
        </p>
        <p className="text-sm opacity-80 mb-4">
          ${pool.monthlyBudget.toLocaleString()}/mo budget
        </p>
        
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium flex items-center justify-center gap-2"
        >
          <Receipt className="h-4 w-4" />
          Request Withdrawal
        </motion.button>
      </motion.div>

      {/* Budget Categories */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Budget Categories</h2>
        <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
          {pool.categories.map((cat, i) => {
            const percentage = (cat.spent / cat.allocated) * 100;
            return (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${cat.spent} / ${cat.allocated}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      percentage > 90 ? "bg-destructive" :
                      percentage > 70 ? "bg-envoy" : "bg-seed"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voting */}
      <div className="bg-trust/5 rounded-2xl p-4 border border-trust/20">
        <div className="flex items-start gap-3">
          <Vote className="h-5 w-5 text-trust flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Multi-sig Required</p>
            <p className="text-sm text-muted-foreground">
              Provision pool withdrawals require approval from 2 of 3 trustees.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const keyConfig = {
  SeedKey: { icon: Sprout, gradient: 'gradient-seed', role: 'Activator' },
  BaseKey: { icon: Shield, gradient: 'gradient-trust', role: 'Trustee' },
  MissionKey: { icon: Rocket, gradient: 'gradient-envoy', role: 'Envoy' },
};
