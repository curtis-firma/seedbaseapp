import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Send, FileText, Sprout, DollarSign, 
  Search, AtSign, Upload, Megaphone, Heart, Rocket,
  Layers, Flag, Edit, Key, Sparkles, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { useLocation } from 'react-router-dom';
import { SendModal } from '@/components/wallet/SendModal';
import { ComingSoonModal, useComingSoon } from '@/components/shared/ComingSoonModal';
import { Slider } from '@/components/ui/slider';
import { createPost } from '@/lib/supabase/postsApi';
import { createCommitment } from '@/lib/supabase/commitmentsApi';
import { createKey, getKeyByUserId } from '@/lib/supabase/demoApi';
import { projectionData } from '@/data/mockData';
import { Confetti } from '@/components/shared/Confetti';
import { toast } from 'sonner';
import { useHaptic } from '@/hooks/useHaptic';

type ActionMode = 'menu' | 'quick-give' | 'new-post' | 'commit-seed' | 'launch-mission' | 'mission-update' | 'testimony';

export function QuickActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ActionMode>('menu');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'update' | 'testimony' | 'harvest'>('update');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [commitAmount, setCommitAmount] = useState(100);
  const [commitYears, setCommitYears] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { isOpen: isComingSoonOpen, featureName, showComingSoon, hideComingSoon } = useComingSoon();
  const { viewRole, refreshUserData } = useUser();
  const location = useLocation();
  const haptic = useHaptic();

  // Hide FAB on One Accord page (has its own compose bar)
  const isOneAccordPage = location.pathname === '/app/oneaccord';

  const getCurrentUserId = (): string | null => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  };

  // Projection calculations
  const projectedDistribution = commitAmount * 0.08 * commitYears;
  const impactMultiplier = projectionData.networkMultiplier;
  const livesImpacted = Math.round(commitAmount * projectionData.impactPerDollar / 100);
  const networkGrowth = commitAmount * impactMultiplier;

  // Listen for welcome walkthrough completion to show tooltip
  useEffect(() => {
    const handleWelcomeComplete = () => {
      if (!localStorage.getItem('seedbase-quickaction-tooltip-seen')) {
        setShowTooltip(true);
      }
    };

    window.addEventListener('welcome-walkthrough-complete', handleWelcomeComplete);
    return () => window.removeEventListener('welcome-walkthrough-complete', handleWelcomeComplete);
  }, []);
  // Auto-dismiss tooltip after 8 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        dismissTooltip();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);
  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('seedbase-quickaction-tooltip-seen', 'true');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMode('menu');
      setAmount('');
      setRecipient('');
      setPostContent('');
      setCommitAmount(100);
      setCommitYears(1);
    }, 300);
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'quick-give') {
      handleClose();
      setShowSendModal(true);
    } else if (actionId === 'launch-mission') {
      handleClose();
      showComingSoon('Launch Mission');
    } else if (actionId === 'commit-seed') {
      setMode('commit-seed');
    } else {
      setMode(actionId as ActionMode);
    }
  };

  const handleCommitSeed = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error('Please sign in first');
      return;
    }

    setIsSubmitting(true);
    haptic.medium();

    try {
      // Create the commitment
      const commitment = await createCommitment({
        user_id: userId,
        amount: commitAmount,
        years: commitYears,
      });

      if (!commitment) {
        throw new Error('Failed to create commitment');
      }

      // Check if user already has SeedKey
      const existingKey = await getKeyByUserId(userId);
      if (!existingKey || existingKey.key_type !== 'SeedKey') {
        // Create the SeedKey
        await createKey(userId, 'SeedKey');
      }

      // Refresh user data
      await refreshUserData();
      
      setShowConfetti(true);
      haptic.success();
      toast.success(`Committed $${commitAmount} for ${commitYears} year${commitYears > 1 ? 's' : ''}!`);
      
      setTimeout(() => {
        setShowConfetti(false);
        handleClose();
      }, 2500);

    } catch (err) {
      console.error('Error committing seed:', err);
      toast.error('Failed to commit seed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      toast.error('Please enter some content');
      return;
    }
    
    // Get user ID from session
    const sessionData = localStorage.getItem('seedbase-session');
    let userId: string | null = null;
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        userId = parsed.userId || null;
      } catch {}
    }

    if (!userId) {
      toast.error('Please sign in to post');
      return;
    }

    const post = await createPost({
      author_id: userId,
      body: postContent,
      post_type: mode === 'testimony' ? 'testimony' : mode === 'mission-update' ? 'update' : 'update',
    });

    if (post) {
      toast.success('Post created!');
      handleClose();
    } else {
      toast.error('Failed to create post');
    }
  };

  // Role-specific actions
  const getActionsForRole = () => {
    switch (viewRole) {
      case 'activator':
        return [
          { 
            id: 'quick-give', 
            icon: Send, 
            label: 'Quick Give', 
            description: 'Send USDC to a person or mission',
            gradient: 'gradient-seed'
          },
          { 
            id: 'new-post', 
            icon: FileText, 
            label: 'Post Update', 
            description: 'Share with the network',
            gradient: 'gradient-base'
          },
          { 
            id: 'commit-seed', 
            icon: Sprout, 
            label: 'Commit Seed', 
            description: 'Lock USDC for impact',
            gradient: 'gradient-trust'
          },
        ];
      case 'trustee':
        return [
          { 
            id: 'launch-mission', 
            icon: Rocket, 
            label: 'Launch Mission', 
            description: 'Create a new mission',
            gradient: 'gradient-trust'
          },
          { 
            id: 'new-post', 
            icon: FileText, 
            label: 'Post Update', 
            description: 'Share Seedbase news',
            gradient: 'gradient-base'
          },
          { 
            id: 'quick-give', 
            icon: Send, 
            label: 'Distribute', 
            description: 'Send funds to mission',
            gradient: 'gradient-seed'
          },
        ];
      case 'envoy':
        return [
          { 
            id: 'mission-update', 
            icon: Megaphone, 
            label: 'Mission Update', 
            description: 'Share progress on your mission',
            gradient: 'gradient-envoy'
          },
          { 
            id: 'testimony', 
            icon: Heart, 
            label: 'Testimony', 
            description: 'Share a story of impact',
            gradient: 'gradient-seed'
          },
          { 
            id: 'new-post', 
            icon: Upload, 
            label: 'Submit Harvest', 
            description: 'Report outcomes & metrics',
            gradient: 'gradient-base'
          },
        ];
      default:
        return [];
    }
  };

  const actions = getActionsForRole();

  const envoyPostTypes = [
    { id: 'update', label: 'Mission Update', icon: Megaphone },
    { id: 'testimony', label: 'Testimony', icon: Heart },
    { id: 'harvest', label: 'Harvest Report', icon: Upload },
  ];

  return (
    <>
      {showConfetti && <Confetti isActive={showConfetti} />}
      
      {/* Tooltip Highlight */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed z-50 bottom-40 right-4 md:bottom-24 md:right-8"
          >
            <div className="relative bg-card border border-border/50 rounded-2xl p-4 shadow-elevated max-w-[200px]">
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border/50 rotate-45" />
              
              <button
                onClick={dismissTooltip}
                className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80"
              >
                <X className="h-3 w-3" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg gradient-seed flex items-center justify-center flex-shrink-0">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Start here!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tap to send, post, or commit your first seed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pulsing ring around the actual button */}
            <motion.div
              className="absolute -bottom-[72px] right-0 w-14 h-14 rounded-2xl border-2 border-primary pointer-events-none"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.8, 0.4, 0.8]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button - hidden on One Accord page */}
      {!isOneAccordPage && (
        <motion.button
          data-tutorial="quick-action"
          onClick={() => {
            dismissTooltip();
            setIsOpen(true);
          }}
          className={cn(
            "fixed z-40 w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-elevated",
            "bottom-24 right-4 md:bottom-8 md:right-8",
            viewRole === 'activator' && "gradient-seed",
            viewRole === 'trustee' && "gradient-trust",
            viewRole === 'envoy' && "gradient-envoy"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      )}
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  handleClose();
                }
              }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md z-50"
            >
              <div className="bg-card rounded-t-3xl md:rounded-3xl border border-border/50 overflow-hidden shadow-elevated max-h-[85vh] overflow-y-auto">
                {/* Drag Handle - mobile only */}
                <div className="flex justify-center pt-3 pb-1 md:hidden">
                  <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                </div>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <h2 className="font-bold text-lg">
                      {mode === 'menu' && 'Quick Actions'}
                      {mode === 'quick-give' && 'Quick Give'}
                      {mode === 'new-post' && 'New Post'}
                      {mode === 'commit-seed' && 'Commit Seed'}
                      {mode === 'launch-mission' && 'Launch Mission'}
                      {mode === 'mission-update' && 'Mission Update'}
                      {mode === 'testimony' && 'Share Testimony'}
                    </h2>
                    <p className="text-sm text-muted-foreground capitalize">
                      {mode === 'menu' ? `${viewRole} actions` : 'Share with the network'}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {/* Menu Mode */}
                    {mode === 'menu' && (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {actions.map((action) => (
                          <motion.button
                            key={action.id}
                            initial={false}
                            onClick={() => handleActionClick(action.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all text-left"
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.gradient)}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">{action.label}</p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Quick Give Mode */}
                    {mode === 'quick-give' && (
                      <motion.div
                        key="quick-give"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Recipient */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Recipient</label>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                              placeholder="Search @user or @mission"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50"
                            />
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50 text-xl font-semibold"
                            />
                          </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex gap-2">
                          {[10, 25, 50, 100].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val.toString())}
                              className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium"
                            >
                              ${val}
                            </button>
                          ))}
                        </div>

                        {/* Info */}
                        <div className="bg-primary/5 rounded-xl p-3 text-sm">
                          <p className="text-muted-foreground">
                            Transfer will appear in recipient's <span className="font-medium text-foreground">OneAccord</span> for acceptance.
                          </p>
                        </div>

                        {/* Send Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 gradient-seed rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <Send className="h-5 w-5" />
                          Send USDC
                        </motion.button>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}

                    {/* New Post / Mission Update / Testimony Mode */}
                    {(mode === 'new-post' || mode === 'mission-update' || mode === 'testimony') && (
                      <motion.div
                        key="new-post"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Post Type for Envoys */}
                        {viewRole === 'envoy' && mode === 'new-post' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Post Type</label>
                            <div className="flex gap-2">
                              {envoyPostTypes.map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => setPostType(type.id as typeof postType)}
                                  className={cn(
                                    "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    postType === type.id
                                      ? "gradient-envoy text-white"
                                      : "bg-muted hover:bg-muted/80"
                                  )}
                                >
                                  <type.icon className="h-4 w-4" />
                                  {type.label.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attach to - REQUIRED */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Attach to Mission or Seedbase <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search @mission or @seedbase"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Posts must be attached to a mission or seedbase
                          </p>
                        </div>

                        {/* Content */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder={
                              mode === 'testimony' 
                                ? "Share a story of transformation..."
                                : mode === 'mission-update'
                                ? "What's happening with your mission..."
                                : "Share your update..."
                            }
                            className="w-full bg-muted rounded-xl p-4 outline-none focus:ring-2 ring-primary/50 min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Media Upload */}
                        <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                          <Upload className="h-5 w-5" />
                          Add Photo or Video
                        </button>

                        {/* Post Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2",
                            viewRole === 'envoy' ? "gradient-envoy" : "gradient-base"
                          )}
                        >
                          <FileText className="h-5 w-5" />
                          Post to Feed
                        </motion.button>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}

                    {/* Commit Seed Mode - Interactive */}
                    {mode === 'commit-seed' && (
                      <motion.div
                        key="commit-seed"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-2xl gradient-seed mx-auto mb-4 flex items-center justify-center">
                            <Sprout className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-muted-foreground text-sm">Lock seed for lasting impact</p>
                        </div>

                        {/* Amount Slider */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Commit Amount</label>
                            <span className="text-lg font-bold text-primary">${commitAmount}</span>
                          </div>
                          <Slider
                            value={[commitAmount]}
                            onValueChange={([val]) => setCommitAmount(val)}
                            min={10}
                            max={10000}
                            step={10}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>$10</span>
                            <span>$10,000</span>
                          </div>
                        </div>

                        {/* Years Slider */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Lock Period</label>
                            <span className="text-lg font-bold text-primary">{commitYears} year{commitYears > 1 ? 's' : ''}</span>
                          </div>
                          <Slider
                            value={[commitYears]}
                            onValueChange={([val]) => setCommitYears(val)}
                            min={1}
                            max={5}
                            step={1}
                            className="py-4"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 year</span>
                            <span>5 years</span>
                          </div>
                        </div>

                        {/* Projections */}
                        <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                          <h3 className="font-semibold text-sm flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Projected Impact
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-background rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Est. Distribution</p>
                              <p className="font-bold text-primary">${projectedDistribution.toFixed(2)}/yr</p>
                            </div>
                            <div className="bg-background rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Impact Multiplier</p>
                              <p className="font-bold text-primary">{impactMultiplier.toFixed(1)}x</p>
                            </div>
                            <div className="bg-background rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Lives Impacted</p>
                              <p className="font-bold text-primary">~{livesImpacted}</p>
                            </div>
                            <div className="bg-background rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Network Growth</p>
                              <p className="font-bold text-primary">+${networkGrowth.toFixed(0)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Commit Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCommitSeed}
                          disabled={isSubmitting}
                          className="w-full py-4 bg-[#0000ff] rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Committing...
                            </>
                          ) : (
                            <>
                              <Key className="h-5 w-5" />
                              Commit ${commitAmount} for {commitYears} Year{commitYears > 1 ? 's' : ''}
                            </>
                          )}
                        </motion.button>

                        <p className="text-xs text-center text-muted-foreground">
                          "Commitment creates capacity."
                        </p>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}

                    {/* Launch Mission Mode (Trustee) */}
                    {mode === 'launch-mission' && (
                      <motion.div
                        key="launch-mission"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="text-center py-4">
                          <div className="w-16 h-16 rounded-2xl gradient-trust mx-auto mb-4 flex items-center justify-center">
                            <Rocket className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">New Mission</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Mission Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Clean Water for Village X"
                            className="w-full bg-muted rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/50"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <textarea
                            placeholder="What will this mission accomplish?"
                            className="w-full bg-muted rounded-xl p-4 outline-none focus:ring-2 ring-primary/50 min-h-[80px] resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Funding Goal (USDC)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="number"
                              placeholder="10000"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50"
                            />
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 gradient-trust rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <Rocket className="h-5 w-5" />
                          Launch Mission
                        </motion.button>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Give SendModal */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={isComingSoonOpen} 
        onClose={hideComingSoon} 
        featureName={featureName} 
      />
    </>
  );
}
