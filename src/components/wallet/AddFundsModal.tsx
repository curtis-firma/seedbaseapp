import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building2, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number) => void;
}

const paymentMethods = [
  { 
    id: 'apple-pay', 
    name: 'Apple Pay', 
    icon: Smartphone, 
    description: 'Instant transfer',
    gradient: 'bg-gradient-to-br from-gray-900 to-gray-700'
  },
  { 
    id: 'debit', 
    name: 'Debit Card', 
    icon: CreditCard, 
    description: 'No fees',
    gradient: 'bg-gradient-to-br from-primary to-base-glow'
  },
  { 
    id: 'credit', 
    name: 'Credit Card', 
    icon: CreditCard, 
    description: '2.9% fee',
    gradient: 'bg-gradient-to-br from-trust to-purple-400'
  },
];

const quickAmounts = [25, 50, 100, 250, 500, 1000];

export function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
  const [step, setStep] = useState<'amount' | 'method' | 'processing' | 'success'>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const amount = selectedAmount || Number(customAmount) || 0;

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    if (step === 'success' && onSuccess) {
      onSuccess(amount);
    }
    setStep('amount');
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedMethod(null);
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
              <h2 className="text-lg font-bold">Add Funds</h2>
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
                {step === 'amount' && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Amount to add</p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-muted-foreground">$</span>
                        <input
                          type="number"
                          value={selectedAmount || customAmount}
                          onChange={(e) => {
                            setSelectedAmount(null);
                            setCustomAmount(e.target.value);
                          }}
                          placeholder="0"
                          className="text-5xl font-bold bg-transparent border-none outline-none text-center w-40"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">in USDC</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {quickAmounts.map((amt) => (
                        <motion.button
                          key={amt}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount('');
                          }}
                          className={cn(
                            "py-3 rounded-xl font-medium transition-all",
                            selectedAmount === amt
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
                      onClick={() => amount > 0 && setStep('method')}
                      disabled={amount <= 0}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all",
                        amount > 0
                          ? "gradient-seed text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Continue
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}

                {step === 'method' && (
                  <motion.div
                    key="method"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <p className="text-sm text-muted-foreground">Adding</p>
                      <p className="text-3xl font-bold">${amount.toLocaleString()}</p>
                    </div>

                    <p className="text-sm font-medium text-muted-foreground">Select payment method</p>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <motion.button
                          key={method.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectMethod(method.id)}
                          className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-colors"
                        >
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            method.gradient
                          )}>
                            <method.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </motion.button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep('amount')}
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
                    <p className="text-lg font-semibold">Processing...</p>
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
                    <p className="text-2xl font-bold mb-2">Funds Added!</p>
                    <p className="text-muted-foreground mb-2">
                      ${amount.toLocaleString()} USDC added to your wallet
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
