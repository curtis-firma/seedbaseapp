import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Check, ChevronRight, Shield, Link2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccess?: (amount: number) => void;
}

const demoBanks = [
  { id: 'chase', name: 'Chase', logo: '🏦' },
  { id: 'bofa', name: 'Bank of America', logo: '🏛️' },
  { id: 'wells', name: 'Wells Fargo', logo: '🏦' },
  { id: 'citi', name: 'Citibank', logo: '🏛️' },
  { id: 'usbank', name: 'US Bank', logo: '🏦' },
  { id: 'pnc', name: 'PNC Bank', logo: '🏛️' },
];

export function WithdrawModal({ isOpen, onClose, balance, onSuccess }: WithdrawModalProps) {
  const [step, setStep] = useState<'bank' | 'connect' | 'amount' | 'processing' | 'success'>('bank');
  const [selectedBank, setSelectedBank] = useState<typeof demoBanks[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const withdrawAmount = Number(amount) || 0;

  const filteredBanks = demoBanks.filter(bank => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBank = (bank: typeof demoBanks[0]) => {
    setSelectedBank(bank);
    setStep('connect');
  };

  const handleConnect = () => {
    // Simulate Plaid connection
    setTimeout(() => {
      setStep('amount');
    }, 1500);
  };

  const handleWithdraw = () => {
    if (withdrawAmount > 0 && withdrawAmount <= balance) {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
      }, 2000);
    }
  };

  const handleClose = () => {
    if (step === 'success' && onSuccess) {
      onSuccess(withdrawAmount);
    }
    setStep('bank');
    setSelectedBank(null);
    setAmount('');
    setSearchQuery('');
    onClose();
  };

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
              <h2 className="text-lg font-bold">Withdraw</h2>
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
                    {/* Plaid-style header */}
                    <div className="text-center py-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-base-glow flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <p className="font-semibold text-lg">Connect your bank</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Securely link your bank account to withdraw funds
                      </p>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for your bank..."
                        className="w-full pl-10 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50"
                      />
                    </div>

                    {/* Bank list */}
                    <div className="space-y-2">
                      {filteredBanks.map((bank) => (
                        <motion.button
                          key={bank.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectBank(bank)}
                          className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-colors"
                        >
                          <span className="text-2xl">{bank.logo}</span>
                          <span className="flex-1 text-left font-medium">{bank.name}</span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-4 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Bank-level security with Plaid</span>
                    </div>
                  </motion.div>
                )}

                {step === 'connect' && (
                  <motion.div
                    key="connect"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-8 text-center"
                  >
                    <div className="flex items-center justify-center gap-4 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl">
                        {selectedBank?.logo}
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Link2 className="h-6 w-6 text-primary" />
                      </motion.div>
                      <div className="w-16 h-16 rounded-2xl gradient-seed flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    <p className="font-semibold text-lg mb-2">Connect to {selectedBank?.name}</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      You'll be redirected to securely log in to your bank
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConnect}
                      className="w-full py-4 gradient-seed text-white rounded-2xl font-semibold mb-3"
                    >
                      Continue to {selectedBank?.name}
                    </motion.button>

                    <button
                      onClick={() => setStep('bank')}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Choose different bank
                    </button>
                  </motion.div>
                )}

                {step === 'amount' && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Connected account */}
                    <div className="flex items-center gap-3 p-3 bg-seed/10 rounded-xl border border-seed/20">
                      <Check className="h-5 w-5 text-seed" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedBank?.name} connected</p>
                        <p className="text-xs text-muted-foreground">Checking ••••4589</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Amount to withdraw</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          max={balance}
                          className="text-5xl font-bold bg-transparent border-none outline-none text-center w-40"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Available: ${balance.toLocaleString()} USDC
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[25, 50, 100].map((pct) => (
                        <motion.button
                          key={pct}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setAmount(String(Math.floor(balance * pct / 100)))}
                          className="py-3 rounded-xl font-medium bg-muted hover:bg-muted/80"
                        >
                          {pct}%
                        </motion.button>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWithdraw}
                      disabled={withdrawAmount <= 0 || withdrawAmount > balance}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all",
                        withdrawAmount > 0 && withdrawAmount <= balance
                          ? "gradient-seed text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Withdraw ${withdrawAmount.toLocaleString()}
                    </motion.button>

                    <p className="text-xs text-center text-muted-foreground">
                      Typically arrives in 1-3 business days
                    </p>
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
                    <p className="text-lg font-semibold">Processing withdrawal...</p>
                    <p className="text-sm text-muted-foreground mt-2">This is a demo transaction</p>
                  </motion.div>
                )}

                {step === 'success' && (
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
                    <p className="text-2xl font-bold mb-2">Withdrawal Initiated!</p>
                    <p className="text-muted-foreground mb-2">
                      ${withdrawAmount.toLocaleString()} on the way to {selectedBank?.name}
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                      (Demo mode - no real transaction)
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
