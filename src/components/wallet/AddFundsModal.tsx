import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Check, ChevronRight, Lock, ScanFace } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number, method: string) => void;
}

const paymentMethods = [
  { 
    id: 'apple-pay', 
    name: 'Apple Pay', 
    icon: Smartphone, 
    description: 'Instant • Face ID',
    gradient: 'bg-gradient-to-br from-gray-900 to-gray-700'
  },
  { 
    id: 'debit', 
    name: 'Debit Card', 
    icon: CreditCard, 
    description: 'No fees • Instant',
    gradient: 'bg-gradient-to-br from-primary to-base-glow'
  },
  { 
    id: 'credit', 
    name: 'Credit Card', 
    icon: CreditCard, 
    description: '2.9% fee • Instant',
    gradient: 'bg-gradient-to-br from-trust to-purple-400'
  },
];

const quickAmounts = [25, 50, 100, 250, 500, 1000];

export function AddFundsModal({ isOpen, onClose, onSuccess }: AddFundsModalProps) {
  const [step, setStep] = useState<'amount' | 'method' | 'card' | 'biometric' | 'processing' | 'success'>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const amount = selectedAmount || Number(customAmount) || 0;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    if (methodId === 'apple-pay') {
      setStep('biometric');
      // Auto-proceed after Face ID animation
      setTimeout(() => {
        setStep('processing');
        setTimeout(() => setStep('success'), 1500);
      }, 2000);
    } else {
      setStep('card');
    }
  };

  const handleCardSubmit = () => {
    if (cardNumber.replace(/\s/g, '').length >= 15 && cardExpiry.length >= 5 && cardCvv.length >= 3) {
      setStep('processing');
      setTimeout(() => setStep('success'), 2000);
    }
  };

  const handleClose = () => {
    if (step === 'success' && onSuccess) {
      onSuccess(amount, selectedMethod || 'card');
    }
    // Reset state
    setStep('amount');
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedMethod(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    onClose();
  };

  const getMethodName = () => {
    return paymentMethods.find(m => m.id === selectedMethod)?.name || 'Card';
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

                {step === 'card' && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">Pay with {getMethodName()}</p>
                      <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
                    </div>

                    {/* Card Preview */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
                      <div className="flex justify-between items-start mb-8">
                        <CreditCard className="h-8 w-8 opacity-60" />
                        <div className="text-right text-xs opacity-60">
                          {selectedMethod === 'credit' ? 'CREDIT' : 'DEBIT'}
                        </div>
                      </div>
                      <p className="font-mono text-lg tracking-wider mb-4">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="opacity-60">{cardExpiry || 'MM/YY'}</span>
                        <span className="opacity-60">•••</span>
                      </div>
                    </div>

                    {/* Card Inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-4 bg-muted rounded-xl text-lg font-mono outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="w-full p-4 bg-muted rounded-xl text-lg font-mono outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            className="w-full p-4 bg-muted rounded-xl text-lg font-mono outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                      <Lock className="h-3 w-3" />
                      <span>Secured with 256-bit encryption (Demo)</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCardSubmit}
                      disabled={cardNumber.replace(/\s/g, '').length < 15 || cardExpiry.length < 5 || cardCvv.length < 3}
                      className={cn(
                        "w-full py-4 rounded-2xl font-semibold text-lg transition-all",
                        cardNumber.replace(/\s/g, '').length >= 15 && cardExpiry.length >= 5 && cardCvv.length >= 3
                          ? "gradient-seed text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      Pay ${amount.toLocaleString()}
                    </motion.button>

                    <button
                      onClick={() => setStep('method')}
                      className="w-full py-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Back
                    </button>
                  </motion.div>
                )}

                {step === 'biometric' && (
                  <motion.div
                    key="biometric"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center"
                    >
                      <ScanFace className="h-12 w-12 text-white" />
                    </motion.div>
                    <p className="text-lg font-semibold mb-2">Confirm with Face ID</p>
                    <p className="text-sm text-muted-foreground">
                      Authenticate to pay ${amount.toLocaleString()} via Apple Pay
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2 }}
                      className="h-1 bg-primary rounded-full mt-6 mx-auto max-w-[200px]"
                    />
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
                    <p className="text-lg font-semibold">Processing Payment...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Confirming ${amount.toLocaleString()} via {getMethodName()}
                    </p>
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
                    <p className="text-2xl font-bold mb-2">Payment Complete!</p>
                    <p className="text-muted-foreground mb-2">
                      ${amount.toLocaleString()} USDC added via {getMethodName()}
                    </p>
                    <p className="text-xs text-muted-foreground mb-6">
                      Transaction ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
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
