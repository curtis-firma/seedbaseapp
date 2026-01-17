import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Check, Sprout, Shield, Copy,
  Key, Sparkles, Users, Rocket, CheckCircle2, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { 
  normalizePhone, saveUser, makeHexId,
  getKeyTypeFromRole, truncateHexId, setSessionPhone, isUsernameTaken as isUsernameTakenLocal,
  formatPhoneDisplay, createDemoUser,
  type DemoUser 
} from '@/lib/demoAuth';
import { 
  findUserByPhone as findUserByPhoneDb,
  getWalletByUserId,
  getKeyByUserId,
  createUser as createUserDb,
  createWallet,
  createKey,
  updateUser,
  isUsernameTaken as isUsernameTakenDb,
  type DemoUser as DbDemoUser,
  type DemoWallet,
  type DemoKey,
} from '@/lib/supabase/demoApi';
import { toast } from 'sonner';
import seedbaseIcon from '@/assets/seedbase-icon.png';

interface PhoneAuthFlowProps {
  isOpen: boolean;
  onComplete: (isNewUser?: boolean) => void;
  forceDemo?: boolean;
  asModal?: boolean;
}

type Step = 
  | 'welcome' 
  | 'verifying' 
  | 'restoring'  // NEW: For returning users
  | 'creating-wallet' 
  | 'wallet-reveal' 
  | 'username' 
  | 'role-select' 
  | 'activating-key' 
  | 'key-reveal';

const WALLET_CREATION_STEPS = [
  { label: 'Deriving entropy...', duration: 700 },
  { label: 'Generating keypair...', duration: 800 },
  { label: 'Encrypting secrets...', duration: 700 },
  { label: 'Connecting to Base L2...', duration: 600 },
];

const KEY_ACTIVATION_STEPS = [
  { label: 'Initializing protocol...', duration: 500 },
  { label: 'Registering on-chain...', duration: 600 },
  { label: 'Confirming transaction...', duration: 500 },
];

const RESTORE_STEPS = [
  { label: 'Restoring your Seed Wallet...', duration: 800 },
  { label: 'Loading keys...', duration: 500 },
  { label: 'Syncing state...', duration: 400 },
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

export function PhoneAuthFlow({ isOpen, onComplete, forceDemo = false, asModal = false }: PhoneAuthFlowProps) {
  const [step, setStep] = useState<Step>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDemo, setIsDemo] = useState(forceDemo);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [returningUserPreview, setReturningUserPreview] = useState<DbDemoUser | null>(null);
  
  // User data being built (for new users)
  const [pendingUser, setPendingUser] = useState<DemoUser | null>(null);
  const [dbUser, setDbUser] = useState<DbDemoUser | null>(null);
  const [dbWallet, setDbWallet] = useState<DemoWallet | null>(null);
  const [dbKey, setDbKey] = useState<DemoKey | null>(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<DemoUser['role']>(null);
  
  // Animation state
  const [creationStep, setCreationStep] = useState(0);
  const [creationProgress, setCreationProgress] = useState(0);
  const [restoreStep, setRestoreStep] = useState(0);
  
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
    setReturningUserPreview(null);
    setPendingUser(null);
    setDbUser(null);
    setDbWallet(null);
    setDbKey(null);
    setUsername('');
    setDisplayName('');
    setSelectedRole(null);
    setCreationStep(0);
    setCreationProgress(0);
    setRestoreStep(0);
    setIsCheckingUser(false);
  };

  // Check for returning user in SUPABASE when phone changes
  useEffect(() => {
    if (phoneNumber.length < 10) {
      setReturningUserPreview(null);
      return;
    }

    const checkUser = async () => {
      try {
        setIsCheckingUser(true);
        const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
        const existingUser = await findUserByPhoneDb(normalizedPhone);
        
        if (existingUser?.onboarding_complete) {
          setReturningUserPreview(existingUser);
        } else {
          setReturningUserPreview(null);
        }
      } catch {
        setReturningUserPreview(null);
      } finally {
        setIsCheckingUser(false);
      }
    };

    const debounce = setTimeout(checkUser, 300);
    return () => clearTimeout(debounce);
  }, [phoneNumber, isDemo]);

  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) return;
    
    try {
      const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
      const formatted = formatPhoneDisplay(normalizedPhone);
      
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

  const handleVerificationComplete = async () => {
    try {
      const normalizedPhone = isDemo ? `demo:${phoneNumber}` : normalizePhone(phoneNumber);
      
      // Check Supabase for existing user
      const existingUser = await findUserByPhoneDb(normalizedPhone);
      
      if (existingUser?.onboarding_complete) {
        // RETURNING USER - Skip ALL onboarding!
        setDbUser(existingUser);
        setStep('restoring');
        return;
      }
      
      // NEW USER - Start onboarding
      let newUser: DemoUser;
      // Check localStorage for partial user (fallback)
      const localUser = (() => {
        try {
          const { loadUserByPhone } = require('@/lib/demoAuth');
          return loadUserByPhone(normalizedPhone);
        } catch { return null; }
      })();
      
      if (localUser) {
        // Partial user exists in localStorage, reuse wallet ID
        newUser = localUser;
      } else {
        // Create brand new user in memory
        newUser = createDemoUser(phoneNumber, isDemo);
      }
      
      setPendingUser(newUser);
      setStep('creating-wallet');
    } catch (e) {
      console.error('Verification failed:', e);
      toast.error('Verification failed');
      setStep('welcome');
    }
  };

  // RESTORING session animation for returning users
  useEffect(() => {
    if (step !== 'restoring' || !dbUser) return;
    
    let timeout: NodeJS.Timeout;
    
    const runRestore = async () => {
      // Animate restore steps
      for (let i = 0; i < RESTORE_STEPS.length; i++) {
        setRestoreStep(i);
        await new Promise(resolve => {
          timeout = setTimeout(resolve, RESTORE_STEPS[i].duration);
        });
      }
      
      // Load wallet and key from Supabase
      const [wallet, key] = await Promise.all([
        getWalletByUserId(dbUser.id),
        getKeyByUserId(dbUser.id),
      ]);
      
      // Update last_login_at
      await updateUser(dbUser.id, { last_login_at: new Date().toISOString() });
      
      // Convert DB user to local format and login
      const localUser: DemoUser = {
        phone: dbUser.phone,
        username: dbUser.username,
        displayName: dbUser.display_name || dbUser.username,
        role: dbUser.active_role,
        walletDisplayId: wallet?.display_id || makeHexId(16),
        keyType: key?.key_type || getKeyTypeFromRole(dbUser.active_role),
        keyDisplayId: key?.display_id || null,
        wallet: {
          balance: wallet?.balance || 25,
          distributionsBalance: 0,
        },
        onboardingComplete: true,
        createdAt: dbUser.created_at,
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage for session persistence
      saveUser(localUser);
      setSessionPhone(localUser.phone);
      
      // Login with the database user
      loginWithUser(dbUser, wallet, key);
      toast.success(`Welcome back, @${dbUser.username}!`);
      onComplete(false); // Returning user
    };
    
    runRestore();
    
    return () => clearTimeout(timeout);
  }, [step, dbUser]);

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

  const handleUsernameSubmit = async () => {
    if (username.length < 2) return;
    
    // Check for duplicate username in Supabase
    const taken = await isUsernameTakenDb(username);
    if (taken) {
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

  const handleComplete = async () => {
    if (!pendingUser || !selectedRole) return;
    
    const normalizedPhone = pendingUser.phone;
    const keyType = getKeyTypeFromRole(selectedRole);
    
    // Create user in Supabase
    const newDbUser = await createUserDb({
      phone: normalizedPhone,
      username: username.toLowerCase(),
      display_name: displayName || username,
      active_role: selectedRole,
    });
    
    if (!newDbUser) {
      toast.error('Failed to create account');
      return;
    }
    
    // Create wallet in Supabase (idempotent - only if none exists)
    let wallet = await getWalletByUserId(newDbUser.id);
    if (!wallet) {
      wallet = await createWallet(newDbUser.id, 'personal', 25);
    }
    
    // Create key in Supabase (idempotent - only if none exists)
    let key = await getKeyByUserId(newDbUser.id);
    if (!key) {
      key = await createKey(newDbUser.id, keyType);
    }
    
    // Mark onboarding complete
    await updateUser(newDbUser.id, { onboarding_complete: true });
    
    const finalUser: DemoUser = {
      ...pendingUser,
      username,
      displayName: displayName || username,
      role: selectedRole,
      keyType,
      keyDisplayId: key?.display_id || pendingUser.keyDisplayId || makeHexId(16),
      walletDisplayId: wallet?.display_id || pendingUser.walletDisplayId,
      onboardingComplete: true,
    };
    
    // Save user to localStorage
    saveUser(finalUser);
    setSessionPhone(finalUser.phone);
    
    // Login with the database user
    if (dbUser) {
      loginWithUser(dbUser, wallet, key);
    }
    toast.success(`Welcome to Seedbase, @${username}!`);
    onComplete(true); // New user - show welcome walkthrough
    
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
    step === 'activating-key' ? 'key-reveal' : 
    step === 'restoring' ? 'verifying' : step
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex flex-col",
        asModal 
          ? "bg-white rounded-3xl min-h-[500px]" 
          : "fixed inset-0 bg-background z-50"
      )}
    >
      {/* Progress dots - hide during animations */}
      {step !== 'creating-wallet' && step !== 'activating-key' && step !== 'verifying' && step !== 'restoring' && (
        <div className={cn("flex justify-center", asModal ? "pt-6 pb-2" : "p-6")}>
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

      <div className={cn(
        "flex-1 flex flex-col items-center justify-center",
        asModal ? "px-6 py-8" : "px-6 pb-12"
      )}>
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
              
              {/* Form container with subtle background */}
              <div className="bg-gray-50/50 rounded-3xl p-6 space-y-4 mb-4">
                {/* Phone input with visible border */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:border-gray-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="(555) 123-4567"
                    className="w-full text-center text-2xl font-semibold bg-transparent py-5 px-4 outline-none placeholder:text-gray-400"
                    autoFocus
                  />
                </div>

                {/* Returning user badge - enhanced */}
                {isCheckingUser && phoneNumber.length >= 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gray-100 rounded-xl flex items-center gap-2 justify-center"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  </motion.div>
                )}
                
                {returningUserPreview && !isCheckingUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full gradient-seed flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-emerald-800">Welcome back!</p>
                      <p className="text-sm text-emerald-600">@{returningUserPreview.username}</p>
                    </div>
                  </motion.div>
                )}
                
                {/* Continue button with shadow */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.length < 10}
                  className={cn(
                    "w-full py-5 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                    phoneNumber.length >= 10 
                      ? "gradient-seed text-white shadow-lg shadow-primary/25 hover:shadow-xl" 
                      : "bg-gray-100 border border-gray-200 text-gray-400"
                  )}
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
              
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
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">Verifying...</h2>
              <p className="text-muted-foreground">Checking your phone number</p>
            </motion.div>
          )}

          {/* RESTORING Step (for returning users) */}
          {step === 'restoring' && dbUser && (
            <motion.div
              key="restoring"
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
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-seed"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">
                Welcome back, @{dbUser.username}!
              </h2>
              
              <div className="space-y-2 mt-6">
                {RESTORE_STEPS.map((rs, i) => (
                  <motion.div
                    key={rs.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: restoreStep >= i ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 text-left"
                  >
                    {restoreStep > i ? (
                      <Check className="h-4 w-4 text-seed" />
                    ) : restoreStep === i ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={cn(
                      "text-sm font-mono",
                      restoreStep >= i ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {rs.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Creating Wallet Step */}
          {step === 'creating-wallet' && (
            <motion.div
              key="creating-wallet"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-8 gradient-seed rounded-2xl flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sprout className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2">Creating Seed Wallet</h2>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full gradient-seed"
                  initial={{ width: 0 }}
                  animate={{ width: `${creationProgress}%` }}
                />
              </div>
              
              {/* Console-style status lines */}
              <div className="space-y-2 text-left bg-muted/50 rounded-xl p-4 font-mono text-sm">
                {WALLET_CREATION_STEPS.map((ws, i) => (
                  <motion.div
                    key={ws.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: creationStep >= i ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {creationStep > i ? (
                      <Check className="h-3 w-3 text-seed" />
                    ) : creationStep === i ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <div className="w-3 h-3" />
                    )}
                    <span className={creationStep >= i ? 'text-foreground' : 'text-muted-foreground'}>
                      {ws.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Wallet Reveal Step */}
          {step === 'wallet-reveal' && pendingUser && (
            <motion.div
              key="wallet-reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 mx-auto mb-6 gradient-seed rounded-2xl flex items-center justify-center"
              >
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2">Seed Wallet Created!</h2>
              <p className="text-muted-foreground mb-6">Your wallet is ready on Base L2</p>
              
              {/* Wallet ID with typewriter effect */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted rounded-xl p-4 mb-6"
              >
                <p className="text-xs text-muted-foreground mb-2">Wallet Address</p>
                <div className="flex items-center justify-center gap-2">
                  <TypewriterText text={pendingUser.walletDisplayId} className="font-mono text-lg" />
                  <button onClick={handleCopyWallet} className="p-1.5 hover:bg-muted-foreground/10 rounded-lg">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('username')}
                className="w-full py-4 gradient-seed text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
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
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center"
              >
                <Users className="h-10 w-10 text-muted-foreground" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2">Create Your Profile</h2>
              <p className="text-muted-foreground mb-6">Choose a username for your Seedbase identity</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-left">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="yourname"
                      className="w-full pl-8 pr-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50"
                      autoFocus
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-left">Display Name (optional)</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50"
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
                    ? "gradient-seed text-white" 
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
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold mb-2">Choose Your Role</h2>
                <p className="text-muted-foreground">Select your primary role in the Seedbase ecosystem</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {ROLE_OPTIONS.map((option) => {
                  const isSelected = selectedRole === option.role;
                  const Icon = option.icon;
                  
                  return (
                    <motion.button
                      key={option.role}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect(option.role)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all text-left",
                        isSelected 
                          ? `border-primary ${option.gradient}` 
                          : "border-border hover:border-primary/50 bg-card"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          isSelected ? "bg-white/20" : option.gradient
                        )}>
                          <Icon className={cn("h-5 w-5", isSelected ? "text-white" : "text-white")} />
                        </div>
                        <div>
                          <p className={cn("font-semibold", isSelected && "text-white")}>{option.title}</p>
                          <p className={cn("text-sm", isSelected ? "text-white/80" : "text-muted-foreground")}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleActivateKey}
                disabled={!selectedRole}
                className={cn(
                  "w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all",
                  selectedRole 
                    ? "gradient-seed text-white" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                Activate {selectedRole ? ROLE_OPTIONS.find(r => r.role === selectedRole)?.keyType : 'Key'}
                <Key className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Activating Key Step */}
          {step === 'activating-key' && selectedRole && (
            <motion.div
              key="activating-key"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                className={cn("w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center",
                  ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient
                )}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Key className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2">
                Activating {ROLE_OPTIONS.find(r => r.role === selectedRole)?.keyType}
              </h2>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
                <motion.div
                  className={cn(ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient, "h-full")}
                  initial={{ width: 0 }}
                  animate={{ width: `${creationProgress}%` }}
                />
              </div>
              
              {/* Console-style status lines */}
              <div className="space-y-2 text-left bg-muted/50 rounded-xl p-4 font-mono text-sm">
                {KEY_ACTIVATION_STEPS.map((ks, i) => (
                  <motion.div
                    key={ks.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ 
                      opacity: creationStep >= i ? 1 : 0.3,
                      x: 0 
                    }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {creationStep > i ? (
                      <Check className="h-3 w-3 text-seed" />
                    ) : creationStep === i ? (
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    ) : (
                      <div className="w-3 h-3" />
                    )}
                    <span className={creationStep >= i ? 'text-foreground' : 'text-muted-foreground'}>
                      {ks.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Key Reveal Step */}
          {step === 'key-reveal' && pendingUser && selectedRole && (
            <motion.div
              key="key-reveal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={cn(
                  "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center",
                  ROLE_OPTIONS.find(r => r.role === selectedRole)?.gradient
                )}
              >
                <Sparkles className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="text-xl font-semibold mb-2">
                {ROLE_OPTIONS.find(r => r.role === selectedRole)?.keyType} Activated!
              </h2>
              <p className="text-muted-foreground mb-6">
                You're ready to {selectedRole === 'activator' ? 'plant seeds' : selectedRole === 'trustee' ? 'govern your Seedbase' : 'execute missions'}
              </p>
              
              {/* Key ID with typewriter effect */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted rounded-xl p-4 mb-6"
              >
                <p className="text-xs text-muted-foreground mb-2">Key ID</p>
                <div className="flex items-center justify-center gap-2">
                  <TypewriterText 
                    text={pendingUser.keyDisplayId || makeHexId(16)} 
                    className="font-mono text-lg" 
                  />
                  <button onClick={handleCopyKey} className="p-1.5 hover:bg-muted-foreground/10 rounded-lg">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleComplete}
                className="w-full py-4 gradient-seed text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                Enter Seedbase
                <Sparkles className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Typewriter text component for wallet/key ID reveal
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!text) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return (
    <span className={className}>
      {displayText}
      {displayText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
        />
      )}
    </span>
  );
}
