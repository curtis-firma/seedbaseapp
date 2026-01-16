import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, ArrowRight, Check, Wallet, Sprout, Shield,
  Eye, BarChart3, Lock, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

interface PhoneAuthFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

type Step = 'phone' | 'verify' | 'username' | 'wallet-created' | 'intro';

export function PhoneAuthFlow({ isOpen, onComplete }: PhoneAuthFlowProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [username, setUsername] = useState('');
  const { login } = useUser();
  
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      setStep('verify');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when complete
    if (newCode.every(c => c !== '')) {
      setTimeout(() => setStep('username'), 300);
    }
  };

  const handleUsernameSubmit = () => {
    if (username.length >= 2) {
      login(phoneNumber, username);
      setStep('wallet-created');
    }
  };

  const handleComplete = () => {
    onComplete();
    // Reset for next time
    setTimeout(() => {
      setStep('phone');
      setPhoneNumber('');
      setVerificationCode(['', '', '', '', '', '']);
      setUsername('');
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Progress dots */}
      <div className="p-6 flex justify-center">
        <div className="flex gap-2">
          {['phone', 'verify', 'username', 'wallet-created', 'intro'].map((s, i) => (
            <div
              key={s}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                s === step ? "w-6 bg-primary" : 
                ['phone', 'verify', 'username', 'wallet-created', 'intro'].indexOf(step) > i 
                  ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* Phone Input Step */}
          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-seed mx-auto mb-6 flex items-center justify-center">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Enter your phone</h2>
              <p className="text-muted-foreground mb-8">
                We'll send you a verification code
              </p>
              
              <div className="mb-6">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="(555) 123-4567"
                  className="w-full text-center text-2xl font-medium bg-muted rounded-2xl py-4 outline-none focus:ring-2 ring-primary/50"
                  autoFocus
                />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 10}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                  phoneNumber.length >= 10 
                    ? "gradient-seed text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <p className="text-xs text-muted-foreground mt-6">
                Demo mode: any phone number works
              </p>
            </motion.div>
          )}

          {/* Verification Code Step */}
          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-base mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Enter code</h2>
              <p className="text-muted-foreground mb-8">
                Sent to {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
              </p>
              
              <div className="flex gap-2 justify-center mb-6">
                {verificationCode.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (codeInputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        codeInputRefs.current[i - 1]?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-2xl font-bold bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Demo mode: any 6 digits work
              </p>
            </motion.div>
          )}

          {/* Username Step */}
          {step === 'username' && (
            <motion.div
              key="username"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-trust mx-auto mb-6 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Choose your name</h2>
              <p className="text-muted-foreground mb-8">
                This is how others will @mention you
              </p>
              
              <div className="mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-medium text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="yourname"
                    className="w-full text-center text-2xl font-medium bg-muted rounded-2xl py-4 pl-10 outline-none focus:ring-2 ring-primary/50"
                    autoFocus
                  />
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleUsernameSubmit}
                disabled={username.length < 2}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                  username.length >= 2 
                    ? "gradient-trust text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Create Account
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Wallet Created Step */}
          {step === 'wallet-created' && (
            <motion.div
              key="wallet-created"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-2xl gradient-seed mx-auto mb-6 flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">Wallet Created!</h2>
              <p className="text-muted-foreground mb-8">
                You now have a Seed Wallet on Base
              </p>
              
              <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6 text-left space-y-4">
                <div className="flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Send & receive USDC instantly</p>
                    <p className="text-sm text-muted-foreground">Digital dollars for a digital world</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-trust flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Blockchain runs quietly underneath</p>
                    <p className="text-sm text-muted-foreground">No crypto jargon required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-seed flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Your keys, your funds</p>
                    <p className="text-sm text-muted-foreground">Self-custody by default</p>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('intro')}
                className="w-full py-4 gradient-seed rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Intro Step */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-base mx-auto mb-6 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Welcome to Seedbase</h2>
              <p className="text-muted-foreground mb-6">
                A social network for committed generosity
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                {[
                  { icon: Eye, label: 'Transparency', desc: 'See exactly where every dollar flows' },
                  { icon: BarChart3, label: 'Impact', desc: 'Real-time tracking of outcomes' },
                  { icon: Lock, label: 'Locked Principle', desc: 'Capital stays, surplus distributes' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 bg-muted/50 rounded-xl p-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="w-full py-4 gradient-base rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
              >
                Start Exploring
                <ChevronRight className="h-5 w-5" />
              </motion.button>
              
              <p className="text-xs text-muted-foreground mt-4 italic">
                "Commitment creates capacity."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
