import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, Search, Lock, Eye, EyeOff, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccess?: (amount: number, bankName: string) => void;
}

const popularBanks = [
  { id: 'chase', name: 'Chase', color: 'bg-blue-600' },
  { id: 'bofa', name: 'Bank of America', color: 'bg-red-600' },
  { id: 'wells', name: 'Wells Fargo', color: 'bg-yellow-600' },
  { id: 'citi', name: 'Citibank', color: 'bg-blue-500' },
  { id: 'usbank', name: 'US Bank', color: 'bg-indigo-600' },
  { id: 'pnc', name: 'PNC Bank', color: 'bg-orange-600' },
  { id: 'capital', name: 'Capital One', color: 'bg-red-500' },
  { id: 'td', name: 'TD Bank', color: 'bg-green-600' },
];

const quickAmounts = [25, 50, 100, 250];

export function WithdrawModal({ isOpen, onClose, balance, onSuccess }: WithdrawModalProps) {
  const [step, setStep] = useState<'bank' | 'login' | 'connected' | 'amount' | 'processing' | 'success'>('bank');
  const [selectedBank, setSelectedBank] = useState<typeof popularBanks[0] | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Simulated account info
  const accountLast4 = '4589';
  const routingLast4 = '0021';

  const handleSelectBank = (bank: typeof popularBanks[0]) => {
    setSelectedBank(bank);
    setStep('login');
  };

  const handleLogin = () => {
    if (username.length >= 3 && password.length >= 4) {
      setIsLoggingIn(true);
      // Simulate login
      setTimeout(() => {
        setIsLoggingIn(false);
        setStep('connected');
      }, 1500);
    }
  };

  const handleConfirmAccount = () => {
    setStep('amount');
  };

  const handleWithdraw = () => {
    if (amount > 0 && amount <= balance) {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
      }, 2000);
    }
  };

  const handleClose = () => {
    if (step === 'success' && onSuccess && selectedBank) {
      onSuccess(amount, selectedBank.name);
    }
    // Reset state
    setStep('bank');
    setSelectedBank(null);
    setAmount(0);
    setSearchQuery('');
    setUsername('');
    setPassword('');
    setShowPassword(false);
    setIsLoggingIn(false);
    onClose();
  };

  const filteredBanks = popularBanks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-bold">Withdraw to Bank</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-xl"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[70vh]">
              <AnimatePresence mode="wait">
                {step === 'bank' && (
                  <motion.div
                    key="bank"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">Available balance</p>
                      <p className="text-2xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for your bank"
                        className="w-full pl-11 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">Popular Banks</p>

                    <div className="space-y-2">
                      {filteredBanks.map((bank) => (
                        <motion.button
                          key={bank.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectBank(bank)}
                          className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-colors"
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            bank.color
                          )}>
                            <Landmark className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold">{bank.name}</p>
                            <p className="text-sm text-muted-foreground">Connect securely</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 'login' && selectedBank && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Bank Header */}
                    <div className="text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3",
                        selectedBank.color
                      )}>
                        <Landmark className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-lg font-bold">{selectedBank.name}</p>
                      <p className="text-sm text-muted-foreground">Sign in to connect your account</p>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Username or Email</label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          className="w-full p-4 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full p-4 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                      <Lock className="h-3 w-3" />
                      <span>Your credentials are never stored (Demo)</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogin}
                      disabled={username.length < 3 || password.length < 4 || isLoggingIn}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2",
                        username.length >= 3 && password.length >= 4 && !isLoggingIn
                          ? "gradient-seed text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isLoggingIn ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                          />
                          Connecting...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </motion.button>

                    <button
                      onClick={() => {
                        setStep('bank');
                        setUsername('');
                        setPassword('');
                      }}
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Back
                    </button>
                  </motion.div>
                )}

                {step === 'connected' && selectedBank && (
                  <motion.div
                    key="connected"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                        className="w-16 h-16 rounded-full bg-seed/10 flex items-center justify-center mx-auto mb-3"
                      >
                        <Check className="h-8 w-8 text-seed" />
                      </motion.div>
                      <p className="text-lg font-bold">Account Connected!</p>
                      <p className="text-sm text-muted-foreground">Select account for withdrawal</p>
                    </div>

                    {/* Account Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-muted to-muted/50 rounded-2xl p-5 border border-border"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          selectedBank.color
                        )}>
                          <Landmark className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold">{selectedBank.name}</p>
                          <p className="text-sm text-muted-foreground">Checking Account</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Account</p>
                          <p className="font-mono">••••{accountLast4}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Routing</p>
                          <p className="font-mono">••••{routingLast4}</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConfirmAccount}
                      className="w-full py-4 gradient-seed text-white rounded-2xl font-semibold"
                    >
                      Use This Account
                    </motion.button>

                    <button
                      onClick={() => {
                        setStep('bank');
                        setSelectedBank(null);
                      }}
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Choose Different Bank
                    </button>
                  </motion.div>
                )}

                {step === 'amount' && selectedBank && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Connected Account Mini */}
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        selectedBank.color
                      )}>
                        <Landmark className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedBank.name}</p>
                        <p className="text-xs text-muted-foreground">Checking ••••{accountLast4}</p>
                      </div>
                      <Check className="h-4 w-4 text-seed" />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Amount to withdraw</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={amount || ''}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          placeholder="0"
                          max={balance}
                          className="text-5xl font-bold bg-transparent border-none outline-none text-center w-40"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {quickAmounts.filter(amt => amt <= balance).map((amt) => (
                        <motion.button
                          key={amt}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAmount(amt)}
                          className={cn(
                            "py-3 rounded-xl font-medium transition-all text-sm",
                            amount === amt
                              ? "gradient-seed text-white"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          ${amt}
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAmount(balance)}
                      className="w-full py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium text-sm"
                    >
                      Withdraw All (${balance.toFixed(2)})
                    </motion.button>

                    {amount > balance && (
                      <p className="text-sm text-destructive text-center">
                        Exceeds available balance
                      </p>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWithdraw}
                      disabled={amount <= 0 || amount > balance}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all",
                        amount > 0 && amount <= balance
                          ? "gradient-seed text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Withdraw ${amount.toLocaleString()}
                    </motion.button>

                    <button
                      onClick={() => setStep('connected')}
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Back
                    </button>
                  </motion.div>
                )}

                {step === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary border-t-transparent"
                    />
                    <p className="text-lg font-semibold">Processing Withdrawal...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Transferring ${amount.toLocaleString()} to {selectedBank?.name}
                    </p>
                  </motion.div>
                )}

                {step === 'success' && selectedBank && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full gradient-seed flex items-center justify-center"
                    >
                      <Check className="h-10 w-10 text-white" />
                    </motion.div>
                    <p className="text-2xl font-bold mb-2">Withdrawal Complete!</p>
                    <p className="text-muted-foreground mb-2">
                      ${amount.toLocaleString()} sent to {selectedBank.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Checking ••••{accountLast4}
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                      Arrives in 1-3 business days (Demo)
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full py-4 gradient-seed text-white rounded-2xl font-semibold"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Demo Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-2 py-1 bg-envoy/10 text-envoy text-xs font-medium rounded-full">
                Demo Mode
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
