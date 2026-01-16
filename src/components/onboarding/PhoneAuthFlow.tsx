import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, ArrowRight, Check, Wallet, Sprout, Shield, Copy,
  Key, Loader2, Sparkles, Users, Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { 
  normalizePhone, loadUserByPhone, saveUser, makeHexId,
  getKeyTypeFromRole, truncateHexId, setSessionPhone, isUsernameTaken,
  type DemoUser 
} from '@/lib/demoAuth';
import { toast } from 'sonner';
import seedbaseIcon from '@/assets/seedbase-icon.png';

interface PhoneAuthFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  forceDemo?: boolean;
}

type Step = 'welcome' | 'verify' | 'creating-wallet' | 'wallet-reveal' | 'username' | 'role-select' | 'activating-key' | 'key-reveal';

const WALLET_CREATION_STEPS = [
  { label: 'Generating keys...', duration: 600 },
  { label: 'Creating wallet...', duration: 700 },
  { label: 'Securing account...', duration: 600 },
  { label: 'Finalizing...', duration: 500 },
];

const KEY_ACTIVATION_STEPS = [
  { label: 'Initializing...', duration: 400 },
  { label: 'Registering...', duration: 500 },
  { label: 'Confirming...', duration: 400 },
];

const ROLE_OPTIONS = [
  { 
    role: 'activator' as const, 
    keyType: 'SeedKey' as const,
    title: 'Activator',
    description: 'Commit capital, earn distributions',
    icon: Sprout,
    gradient: 'gradient-seed'
  },
  { 
    role: 'trustee' as const, 
    keyType: 'BaseKey' as const,
    title: 'Trustee',
    description: 'Govern funds, approve missions',
    icon: Shield,
    gradient: 'gradient-trust'
  },
  { 
    role: 'envoy' as const, 
    keyType: 'MissionKey' as const,
    title: 'Envoy',
    description: 'Execute missions on the ground',
    icon: Rocket,
    gradient: 'gradient-envoy'
  },
];

export function PhoneAuthFlow({ isOpen, onComplete, forceDemo = false }: PhoneAuthFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<DemoUser['role'] | null>(null);
  const [isDemo, setIsDemo] = useState(forceDemo);
  
  // Wallet/Key data (generated once per user)
  const [walletDisplayId, setWalletDisplayId] = useState('');
  const [keyDisplayId, setKeyDisplayId] = useState('');
  
  // Animation state
  const [creationStep, setCreationStep] = useState(0);
  const [creationProgress, setCreationProgress] = useState(0);
  
  const { loginWithUser } = useUser();
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset on forceDemo change
  useEffect(() => {
    if (forceDemo) {
      setIsDemo(true);
      resetFlow();
    }
  }, [forceDemo]);

  const resetFlow = () => {
    setStep('welcome');
    setPhoneNumber('');
    setVerificationCode(['', '', '', '', '', '']);
    setUsername('');
    setDisplayName('');
    setSelectedRole(null);
    setWalletDisplayId('');
    setKeyDisplayId('');
    setCreationStep(0);
    setCreationProgress(0);
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length >= 10) {
      setStep('verify');
    }
  };

  const handleTryDemo = () => {
    setIsDemo(true);
    setPhoneNumber(`demo${Date.now()}`);
    setStep('verify');
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
      handleVerificationComplete();
    }
  };

  const handleVerificationComplete = () => {
    try {
      const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
      const existingUser = loadUserByPhone(normalizedPhone);
      
      if (existingUser?.onboardingComplete && !isDemo) {
        // Returning user - restore session and skip onboarding
        setSessionPhone(normalizedPhone);
        loginWithUser(existingUser);
        onComplete();
        return;
      }
      
      // New user or demo - proceed with wallet creation
      // If existing user has wallet ID, reuse it
      if (existingUser?.walletDisplayId) {
        setWalletDisplayId(existingUser.walletDisplayId);
      }
      
      setTimeout(() => setStep('creating-wallet'), 300);
    } catch (e) {
      toast.error('Invalid phone number');
    }
  };

  // Wallet creation animation
  useEffect(() => {
    if (step !== 'creating-wallet') return;
    
    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    const runSteps = async () => {
      for (let i = 0; i < WALLET_CREATION_STEPS.length; i++) {
        setCreationStep(i);
        const startProgress = (i / WALLET_CREATION_STEPS.length) * 100;
        const endProgress = ((i + 1) / WALLET_CREATION_STEPS.length) * 100;
        
        // Animate progress
        const duration = WALLET_CREATION_STEPS[i].duration;
        const startTime = Date.now();
        
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          setCreationProgress(startProgress + (endProgress - startProgress) * progress);
        }, 16);
        
        await new Promise(resolve => {
          timeout = setTimeout(resolve, duration);
        });
        
        clearInterval(progressInterval);
      }
      
      // Generate wallet ID if not already set
      if (!walletDisplayId) {
        setWalletDisplayId(makeHexId(16));
      }
      
      setStep('wallet-reveal');
    };
    
    runSteps();
    
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [step, walletDisplayId]);

  // Key activation animation
  useEffect(() => {
    if (step !== 'activating-key') return;
    
    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    const runSteps = async () => {
      for (let i = 0; i < KEY_ACTIVATION_STEPS.length; i++) {
        setCreationStep(i);
        const startProgress = (i / KEY_ACTIVATION_STEPS.length) * 100;
        const endProgress = ((i + 1) / KEY_ACTIVATION_STEPS.length) * 100;
        
        const duration = KEY_ACTIVATION_STEPS[i].duration;
        const startTime = Date.now();
        
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          setCreationProgress(startProgress + (endProgress - startProgress) * progress);
        }, 16);
        
        await new Promise(resolve => {
          timeout = setTimeout(resolve, duration);
        });
        
        clearInterval(progressInterval);
      }
      
      // Generate key ID
      setKeyDisplayId(makeHexId(16));
      setStep('key-reveal');
    };
    
    runSteps();
    
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [step]);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletDisplayId);
    toast.success('Wallet address copied!');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(keyDisplayId);
    toast.success('Key ID copied!');
  };

  const handleUsernameSubmit = () => {
    if (username.length < 2) return;
    
    const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
    
    // Check for duplicate username (skip for demo)
    if (!isDemo && isUsernameTaken(username, normalizedPhone)) {
      toast.error('Username already taken');
      return;
    }
    
    setStep('role-select');
  };

  const handleRoleSelect = (role: DemoUser['role']) => {
    setSelectedRole(role);
  };

  const handleActivateKey = () => {
    if (!selectedRole) return;
    setCreationStep(0);
    setCreationProgress(0);
    setStep('activating-key');
  };

  const handleComplete = () => {
    if (!selectedRole) return;
    
    const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
    const keyType = getKeyTypeFromRole(selectedRole);
    
    const user: DemoUser = {
      phone: normalizedPhone,
      username,
      displayName: displayName || username,
      role: selectedRole,
      walletDisplayId,
      keyType,
      keyDisplayId,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save user (skip for pure demo mode to not pollute storage)
    if (!isDemo) {
      saveUser(user);
      setSessionPhone(normalizedPhone);
    }
    
    loginWithUser(user);
    onComplete();
    
    // Reset for next time
    setTimeout(resetFlow, 500);
  };

  if (!isOpen) return null;

  const getProgressSteps = () => {
    return ['welcome', 'verify', 'wallet-reveal', 'username', 'role-select', 'key-reveal'];
  };

  const progressSteps = getProgressSteps();
  const currentStepIndex = progressSteps.indexOf(
    step === 'creating-wallet' ? 'wallet-reveal' : 
    step === 'activating-key' ? 'key-reveal' : step
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Progress dots - hide during animations */}
      {step !== 'creating-wallet' && step !== 'activating-key' && (
        <div className="p-6 flex justify-center">
          <div className="flex gap-2">
            {progressSteps.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === currentStepIndex ? "w-6 bg-primary" : 
                  i < currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* Welcome / Phone Input Step */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.img
                src={seedbaseIcon}
                alt="Seedbase"
                className="w-20 h-20 mx-auto mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              />
              <h2 className="text-2xl font-bold mb-2">Welcome to Seedbase</h2>
              <p className="text-muted-foreground mb-8">
                Enter your phone to create or access your Seed Wallet
              </p>
              
              <div className="mb-4">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="+1 (555) 123-4567"
                  className="w-full text-center text-xl font-medium bg-muted rounded-2xl py-4 outline-none focus:ring-2 ring-primary/50"
                  autoFocus
                />
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 10}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all mb-3",
                  phoneNumber.length >= 10 
                    ? "gradient-seed text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Send Code
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleTryDemo}
                className="w-full py-4 rounded-2xl font-semibold bg-transparent border border-border text-foreground hover:bg-muted transition-colors"
              >
                Try Demo
              </motion.button>
              
              <p className="text-xs text-muted-foreground mt-6">
                By continuing, you agree to our Terms of Service
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
              <h2 className="text-2xl font-bold mb-2">Enter verification code</h2>
              <p className="text-muted-foreground mb-8">
                {isDemo ? 'Demo mode: enter any 6 digits' : `Sent to ${phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}`}
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
                Didn't receive a code? <button className="text-primary font-medium">Resend</button>
              </p>
            </motion.div>
          )}

          {/* Creating Wallet Animation */}
          {step === 'creating-wallet' && (
            <motion.div
              key="creating-wallet"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm text-center"
            >
              <div className="relative w-20 h-20 mx-auto mb-8">
                <motion.img
                  src={seedbaseIcon}
                  alt="Seedbase"
                  className="w-20 h-20"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="absolute inset-0 -m-2">
                  <motion.div
                    className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Creating your Seed Wallet</h2>
              <p className="text-muted-foreground mb-8">
                {WALLET_CREATION_STEPS[creationStep]?.label || 'Finalizing...'}
              </p>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-seed"
                  style={{ width: `${creationProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Wallet Reveal Step */}
          {step === 'wallet-reveal' && (
            <motion.div
              key="wallet-reveal"
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
              
              <h2 className="text-2xl font-bold mb-2">Seed Wallet Created!</h2>
              <p className="text-muted-foreground mb-6">
                Your on-chain identity is ready
              </p>
              
              {/* Wallet Address Card */}
              <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Wallet Address</span>
                  <Sparkles className="h-4 w-4 text-seed" />
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-medium truncate">
                    {truncateHexId(walletDisplayId)}
                  </code>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyWallet}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('username')}
                className="w-full py-4 gradient-seed rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </motion.button>
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
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Create your profile</h2>
              <p className="text-muted-foreground mb-6">
                Choose how others will find you
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-muted-foreground">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="username"
                    className="w-full text-xl font-medium bg-muted rounded-2xl py-4 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50"
                    autoFocus
                  />
                </div>
                
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name (optional)"
                  className="w-full text-lg bg-muted rounded-2xl py-4 px-4 outline-none focus:ring-2 ring-primary/50"
                />
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
                Continue
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Role Selection Step */}
          {step === 'role-select' && (
            <motion.div
              key="role-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-base mx-auto mb-6 flex items-center justify-center">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Choose your role</h2>
              <p className="text-muted-foreground mb-6">
                Select how you'll participate in Seedbase
              </p>
              
              <div className="space-y-3 mb-6">
                {ROLE_OPTIONS.map((option, i) => (
                  <motion.button
                    key={option.role}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect(option.role)}
                    className={cn(
                      "w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all",
                      selectedRole === option.role
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      option.gradient
                    )}>
                      <option.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{option.title}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    {selectedRole === option.role && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleActivateKey}
                disabled={!selectedRole}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                  selectedRole 
                    ? "gradient-base text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Activate Key
                <Key className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Activating Key Animation */}
          {step === 'activating-key' && (
            <motion.div
              key="activating-key"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm text-center"
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center",
                ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient || 'gradient-base'
              )}>
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">
                Activating your {ROLE_OPTIONS.find(r => r.role === selectedRole)?.keyType}
              </h2>
              <p className="text-muted-foreground mb-8">
                {KEY_ACTIVATION_STEPS[creationStep]?.label || 'Confirming...'}
              </p>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full",
                    ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient || 'gradient-base'
                  )}
                  style={{ width: `${creationProgress}%` }}
                />
              </div>
            </motion.div>
          )}

          {/* Key Reveal Step */}
          {step === 'key-reveal' && selectedRole && (
            <motion.div
              key="key-reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={cn(
                  "w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center",
                  ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient
                )}
              >
                <Key className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
                {ROLE_OPTIONS.find(r => r.role === selectedRole)?.keyType} Activated!
              </h2>
              <p className="text-muted-foreground mb-6">
                You're now a {ROLE_OPTIONS.find(r => r.role === selectedRole)?.title}
              </p>
              
              {/* Key Card */}
              <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Key ID</span>
                  <span className="px-2 py-1 rounded-full bg-seed/10 text-seed text-xs font-medium flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono font-medium truncate">
                    {truncateHexId(keyDisplayId)}
                  </code>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyKey}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className={cn(
                  "w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2",
                  ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient
                )}
              >
                Enter Seedbase
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
