import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, AlertCircle, Check, ExternalLink, Megaphone, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';
import { Confetti } from '@/components/shared/Confetti';

interface AmplifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  impactSummary?: string;
  referralCode?: string;
}

export function AmplifyModal({
  isOpen,
  onClose,
  content,
  impactSummary,
  referralCode = 'SEED2025',
}: AmplifyModalProps) {
  const navigate = useNavigate();
  const { username } = useUser();
  const [showSendOutModal, setShowSendOutModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'x' | 'base' | null>(null);
  const [showSuccessScene, setShowSuccessScene] = useState(false);
  
  // Get stored handles
  const [xHandle, setXHandle] = useState<string>('');
  const [baseHandle, setBaseHandle] = useState<string>('');
  
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('seedbase-social-handles');
      if (stored) {
        const handles = JSON.parse(stored);
        setXHandle(handles.x_handle || '');
        setBaseHandle(handles.base_handle || '');
      }
    }
  }, [isOpen]);
  
  const hasHandles = xHandle || baseHandle;
  
  const referralLink = `https://seedbaseapp.lovable.app/?ref=${referralCode}`;
  
  const fullCaption = `${content}\n\n🔗 Join the movement: ${referralLink}`;
  
  const handleShareToX = () => {
    triggerHaptic('light');
    setSelectedPlatform('x');
    setShowSendOutModal(true);
  };
  
  const handleShareToBase = () => {
    triggerHaptic('light');
    setSelectedPlatform('base');
    setShowSendOutModal(true);
  };
  
  const handleCopyCaption = async () => {
    await navigator.clipboard.writeText(fullCaption);
    triggerHaptic('light');
    toast.success('Caption copied to clipboard!');
  };
  
  const handleConfirmSend = () => {
    triggerHaptic('success');
    setShowSendOutModal(false);
    setShowSuccessScene(true);
    
    // Auto-close after 2.5s
    setTimeout(() => {
      setShowSuccessScene(false);
      onClose();
    }, 2500);
  };
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Main Amplify Modal */}
      {!showSendOutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#0000ff]/10 flex items-center justify-center">
                  <Megaphone className="h-5 w-5 text-[#0000ff]" />
                </div>
                <div>
                  <h2 className="font-semibold">Amplify Impact</h2>
                  <p className="text-xs text-muted-foreground">Share to your network</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </div>
            
            {/* Identity Section */}
            <div className="px-4 pt-4">
              {hasHandles ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">
                  <Share2 className="h-4 w-4 flex-shrink-0" />
                  <span>Posting as: </span>
                  {xHandle && <span className="font-medium text-foreground">X @{xHandle.replace('@', '')}</span>}
                  {xHandle && baseHandle && <span>·</span>}
                  {baseHandle && <span className="font-medium text-foreground">Base @{baseHandle.replace('@', '')}</span>}
                </div>
              ) : (
                <div className="flex items-start gap-2 text-sm bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-600 dark:text-amber-400">
                      Add your handles in Settings to preview sharing identity
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        navigate('/app/settings');
                      }}
                      className="text-xs text-[#0000ff] font-medium mt-1 flex items-center gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Go to Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Caption Preview */}
            <div className="flex-1 overflow-y-auto p-4">
              {impactSummary && (
                <div className="mb-4 p-3 bg-[#0000ff]/5 border border-[#0000ff]/20 rounded-xl">
                  <p className="text-sm font-medium text-[#0000ff]">{impactSummary}</p>
                </div>
              )}
              
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm font-medium mb-2">Caption Preview</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{fullCaption}</p>
              </div>
              
              {/* Referral Link */}
              <div className="mt-4 flex items-center justify-between bg-muted/30 rounded-xl p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Your referral code</p>
                  <p className="font-mono font-medium text-[#0000ff]">{referralCode}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    triggerHaptic('light');
                    toast.success('Referral link copied!');
                  }}
                  className="p-2 bg-muted rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-border space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareToX}
                  className="flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-xl font-medium"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share to X
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShareToBase}
                  className="flex items-center justify-center gap-2 py-3.5 bg-[#0052FF] text-white rounded-xl font-medium"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Share to Base
                </motion.button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyCaption}
                className="w-full flex items-center justify-center gap-2 py-3 bg-muted rounded-xl font-medium"
              >
                <Copy className="h-4 w-4" />
                Copy Caption
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Send Out Confirmation Modal */}
      {showSendOutModal && !showSuccessScene && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowSendOutModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-card rounded-t-3xl sm:rounded-2xl overflow-hidden"
          >
            {/* Platform Header */}
            <div className={`p-6 text-center ${
              selectedPlatform === 'x' ? 'bg-black' : 'bg-[#0052FF]'
            }`}>
              {selectedPlatform === 'x' ? (
                <svg className="h-10 w-10 text-white mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ) : (
                <div className="h-10 w-10 rounded-full bg-white mx-auto flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-[#0052FF]" />
                </div>
              )}
              <p className="text-white font-medium mt-3">
                {selectedPlatform === 'x' ? 'Post to X' : 'Send on Base'}
              </p>
            </div>
            
            {/* Confirmation content */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                This will share your impact to {selectedPlatform === 'x' ? 'X (Twitter)' : 'Base'}
              </p>
              
              <div className="bg-muted/50 rounded-xl p-3 text-center text-sm">
                <span className="text-muted-foreground">Posting as: </span>
                <span className="font-medium">
                  @{selectedPlatform === 'x' 
                    ? (xHandle || 'your-handle').replace('@', '') 
                    : (baseHandle || 'your-handle').replace('@', '')}
                </span>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="p-4 border-t border-border space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmSend}
                className={`w-full py-3.5 rounded-xl font-medium text-white ${
                  selectedPlatform === 'x' ? 'bg-black' : 'bg-[#0052FF]'
                }`}
              >
                Confirm & Send
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSendOutModal(false)}
                className="w-full py-3 bg-muted rounded-xl font-medium"
              >
                Back
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Success Scene - Cinematic Amplify Confirmation */}
      {showSuccessScene && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            setShowSuccessScene(false);
            onClose();
          }}
        >
          {/* Platform-colored background */}
          <motion.div 
            className={`absolute inset-0 ${
              selectedPlatform === 'x' 
                ? 'bg-black' 
                : 'bg-gradient-to-br from-[#0052FF] to-[#0033AA]'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Success content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated checkmark circle */}
            <motion.div 
              className="relative w-32 h-32 md:w-40 md:h-40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              {/* Outer ring */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <motion.circle 
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </svg>
              
              {/* Platform logo in center */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
              >
                {selectedPlatform === 'x' ? (
                  <motion.svg 
                    className="h-12 w-12 md:h-16 md:w-16 text-white" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </motion.svg>
                ) : (
                  <motion.div
                    className="h-14 w-14 md:h-18 md:w-18 rounded-full bg-white flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#0052FF]" />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
            
            {/* Success text */}
            <motion.h2 
              className="text-white text-3xl md:text-4xl font-bold mt-8 tracking-tight"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              Amplified!
            </motion.h2>
            
            {/* Platform subtitle */}
            <motion.p 
              className="text-white/70 text-lg mt-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              {selectedPlatform === 'x' ? 'Posted to X' : 'Sent on Base'}
            </motion.p>
            
            {/* Handle */}
            <motion.p 
              className="text-white/50 mt-2 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              {selectedPlatform === 'x' && xHandle && `@${xHandle.replace('@', '')}`}
              {selectedPlatform === 'base' && baseHandle && `@${baseHandle.replace('@', '')}`}
            </motion.p>
            
            {/* Tap to dismiss hint */}
            <motion.p 
              className="text-white/30 text-xs mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.4 }}
            >
              Tap to dismiss
            </motion.p>
          </div>
          
          {/* Confetti overlay */}
          <Confetti isActive={true} duration={2500} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AmplifyModal;
