import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Check, Sprout, Shield, Copy,
  Key, Sparkles, Users, Rocket, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { 
  normalizePhone, loadUserByPhone, saveUser, makeHexId,
  getKeyTypeFromRole, truncateHexId, setSessionPhone, isUsernameTaken,
  formatPhoneDisplay, createDemoUser,
  type DemoUser 
} from '@/lib/demoAuth';
import { toast } from 'sonner';
import seedbaseIcon from '@/assets/seedbase-icon.png';

interface PhoneAuthFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  forceDemo?: boolean;
}

type Step = 
  | 'welcome' 
  | 'verifying' 
  | 'creating-wallet' 
  | 'wallet-reveal' 
  | 'username' 
  | 'role-select' 
  | 'activating-key' 
  | 'key-reveal';

const WALLET_CREATION_STEPS = [
  { label: 'Generating wallet...', duration: 600 },
  { label: 'Securing keys on Base...', duration: 700 },
  { label: 'Connecting to Seedbase...', duration: 600 },
];

const KEY_ACTIVATION_STEPS = [
  { label: 'Initializing...', duration: 400 },
  { label: 'Registering key...', duration: 500 },
  { label: 'Confirming on-chain...', duration: 400 },
];

const ROLE_OPTIONS = [
  { 
    role: 'activator' as const, 
    keyType: 'SeedKey' as const,
    title: 'Activator',
    description: 'Commit capital, earn distributions',
    bullets: ['Plant USDC into missions', 'Receive surplus distributions', 'Track your impact'],
    icon: Sprout,
    gradient: 'gradient-seed'
  },
  { 
    role: 'trustee' as const, 
    keyType: 'BaseKey' as const,
    title: 'Trustee',
    description: 'Govern funds, approve missions',
    bullets: ['Manage your Seedbase', 'Approve mission deployments', 'Oversee provision pool'],
    icon: Shield,
    gradient: 'gradient-trust'
  },
  { 
    role: 'envoy' as const, 
    keyType: 'MissionKey' as const,
    title: 'Envoy',
    description: 'Execute missions on the ground',
    bullets: ['Receive mission funding', 'Report milestones', 'Deliver impact'],
    icon: Rocket,
    gradient: 'gradient-envoy'
  },
];

export function PhoneAuthFlow({ isOpen, onComplete, forceDemo = false }: PhoneAuthFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDemo, setIsDemo] = useState(forceDemo);
  const [returningUser, setReturningUser] = useState<DemoUser | null>(null);
  
  // User data being built
  const [pendingUser, setPendingUser] = useState<DemoUser | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<DemoUser['role']>(null);
  
  // Animation state
  const [creationStep, setCreationStep] = useState(0);
  const [creationProgress, setCreationProgress] = useState(0);
  
  const { loginWithUser } = useUser();

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
    setReturningUser(null);
    setPendingUser(null);
    setUsername('');
    setDisplayName('');
    setSelectedRole(null);
    setCreationStep(0);
    setCreationProgress(0);
  };

  // Check for returning user on phone change
  useEffect(() => {
    if (phoneNumber.length >= 10) {
      try {
        const normalizedPhone = normalizePhone(phoneNumber);
        const existing = loadUserByPhone(normalizedPhone);
        if (existing?.onboardingComplete) {
          setReturningUser(existing);
        } else {
          setReturningUser(null);
        }
      } catch {
        setReturningUser(null);
      }
    } else {
      setReturningUser(null);
    }
  }, [phoneNumber]);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) return;
    
    try {
      const normalizedPhone = normalizePhone(phoneNumber);
      const formatted = formatPhoneDisplay(normalizedPhone);
      
      // Check for existing user
      const existingUser = loadUserByPhone(normalizedPhone);
      
      if (existingUser?.onboardingComplete) {
        // Returning user - skip to verification
        setReturningUser(existingUser);
      }
      
      toast.success(`Code sent to ${formatted}`);
      setStep('verifying');
    } catch (e) {
      toast.error('Invalid phone number');
    }
  };

  const handleTryDemo = () => {
    setIsDemo(true);
    setPhoneNumber(`${Date.now()}`);
    toast.success('Demo mode activated');
    setStep('verifying');
  };

  // Auto-verify after delay (Privy-style)
  useEffect(() => {
    if (step !== 'verifying') return;
    
    const timer = setTimeout(() => {
      handleVerificationComplete();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [step]);

  const handleVerificationComplete = () => {
    try {
      const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
      const existingUser = loadUserByPhone(normalizedPhone);
      
      if (existingUser?.onboardingComplete) {
        // Returning user - restore session and enter app
        setSessionPhone(normalizedPhone);
        loginWithUser(existingUser);
        toast.success(`Welcome back, @${existingUser.username}!`);
        onComplete();
        return;
      }
      
      // New user - create pending user with wallet ID
      let newUser: DemoUser;
      if (existingUser) {
        // Partial user exists, reuse wallet ID
        newUser = existingUser;
      } else {
        // Create brand new user
        newUser = createDemoUser(phoneNumber, isDemo);
      }
      
      setPendingUser(newUser);
      setStep('creating-wallet');
    } catch (e) {
      toast.error('Verification failed');
      setStep('welcome');
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
      
      setStep('wallet-reveal');
    };
    
    runSteps();
    
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [step]);

  // Key activation animation
  useEffect(() => {
    if (step !== 'activating-key' || !pendingUser) return;
    
    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;
    
    const runSteps = async () => {
      setCreationStep(0);
      setCreationProgress(0);
      
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
      if (pendingUser && selectedRole) {
        const keyType = getKeyTypeFromRole(selectedRole);
        setPendingUser({
          ...pendingUser,
          role: selectedRole,
          keyType,
          keyDisplayId: makeHexId(16),
        });
      }
      
      setStep('key-reveal');
    };
    
    runSteps();
    
    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [step, selectedRole]);

  const handleCopyWallet = () => {
    if (pendingUser?.walletDisplayId) {
      navigator.clipboard.writeText(pendingUser.walletDisplayId);
      toast.success('Wallet address copied!');
    }
  };

  const handleCopyKey = () => {
    if (pendingUser?.keyDisplayId) {
      navigator.clipboard.writeText(pendingUser.keyDisplayId);
      toast.success('Key ID copied!');
    }
  };

  const handleUsernameSubmit = () => {
    if (username.length < 2) return;
    
    // Check for duplicate username
    if (isUsernameTaken(username, pendingUser?.phone)) {
      toast.error('Username already taken');
      return;
    }
    
    if (pendingUser) {
      setPendingUser({
        ...pendingUser,
        username,
        displayName: displayName || username,
      });
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
    if (!pendingUser || !selectedRole) return;
    
    const finalUser: DemoUser = {
      ...pendingUser,
      username,
      displayName: displayName || username,
      role: selectedRole,
      keyType: getKeyTypeFromRole(selectedRole),
      keyDisplayId: pendingUser.keyDisplayId || makeHexId(16),
      onboardingComplete: true,
    };
    
    // Save user to localStorage
    saveUser(finalUser);
    setSessionPhone(finalUser.phone);
    
    loginWithUser(finalUser);
    toast.success(`Welcome to Seedbase, @${username}!`);
    onComplete();
    
    // Reset for next time
    setTimeout(resetFlow, 500);
  };

  if (!isOpen) return null;

  const getProgressSteps = () => {
    return ['welcome', 'verifying', 'wallet-reveal', 'username', 'role-select', 'key-reveal'];
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
      {step !== 'creating-wallet' && step !== 'activating-key' && step !== 'verifying' && (
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
                  placeholder="(555) 123-4567"
                  className="w-full text-center text-xl font-medium bg-muted rounded-2xl py-4 outline-none focus:ring-2 ring-primary/50"
                  autoFocus
                />
              </div>

              {/* Returning user badge */}
              {returningUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-seed/10 border border-seed/30 rounded-xl flex items-center gap-2 justify-center"
                >
                  <CheckCircle2 className="h-4 w-4 text-seed" />
                  <span className="text-sm font-medium text-seed">
                    Welcome back, @{returningUser.username}!
                  </span>
                </motion.div>
              )}
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length < 10}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all mb-4",
                  phoneNumber.length >= 10 
                    ? "gradient-seed text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Continue
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              {/* Secondary "Try demo" link */}
              <button
                onClick={handleTryDemo}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Try demo instead
              </button>
              
              <p className="text-xs text-muted-foreground mt-6">
                By continuing, you agree to our Terms of Service
              </p>
            </motion.div>
          )}

          {/* Verifying Step (auto-verify) */}
          {step === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
              
              <h2 className="text-2xl font-bold mb-2">Verifying phone...</h2>
              <p className="text-muted-foreground">
                {isDemo ? 'Demo mode • Auto-verifying' : 'Checking verification code'}
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
              <p className="text-muted-foreground mb-2">
                {WALLET_CREATION_STEPS[creationStep]?.label || 'Finalizing...'}
              </p>
              <p className="text-xs text-muted-foreground mb-8">
                Your wallet lets you send/receive USDC instantly.
              </p>
              
              {/* Progress stepper */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {WALLET_CREATION_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      i < creationStep ? "bg-primary text-white" :
                      i === creationStep ? "bg-primary/20 text-primary border-2 border-primary" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {i < creationStep ? <Check className="h-3 w-3" /> : i + 1}
                    </div>
                    {i < WALLET_CREATION_STEPS.length - 1 && (
                      <div className={cn(
                        "w-8 h-0.5",
                        i < creationStep ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                ))}
              </div>
              
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
          {step === 'wallet-reveal' && pendingUser && (
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
                    {truncateHexId(pendingUser.walletDisplayId)}
                  </code>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyWallet}
                    className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </motion.button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Starting balance: $25.00 USDC
                </p>
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
              <h2 className="text-2xl font-bold mb-2">Choose how you'll participate</h2>
              <p className="text-muted-foreground mb-6">
                Select your role in the Seedbase network
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
                      "w-full p-4 rounded-2xl border-2 text-left transition-all",
                      selectedRole === option.role
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        option.gradient
                      )}>
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{option.title}</p>
                          {selectedRole === option.role && (
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {option.bullets.map((bullet, j) => (
                            <li key={j} className="flex items-center gap-1">
                              <span className="text-primary">•</span> {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
                "relative w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center",
                ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient || 'gradient-base'
              )}>
                <Key className="h-10 w-10 text-white" />
                <div className="absolute inset-0 -m-2">
                  <motion.div
                    className={cn(
                      "w-24 h-24 rounded-full border-4 border-transparent",
                      selectedRole === 'activator' && "border-t-seed",
                      selectedRole === 'trustee' && "border-t-trust",
                      selectedRole === 'envoy' && "border-t-envoy"
                    )}
                    style={{ borderTopColor: 'currentColor' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
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
          {step === 'key-reveal' && selectedRole && pendingUser && (
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
                    {truncateHexId(pendingUser.keyDisplayId || '')}
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
