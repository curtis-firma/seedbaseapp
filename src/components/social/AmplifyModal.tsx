import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, AlertCircle, Check, ExternalLink, Megaphone, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';

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
    toast.success(`Demo: Posted to ${selectedPlatform === 'x' ? 'X' : 'Base'}!`);
    setShowSendOutModal(false);
    onClose();
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
      {showSendOutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSendOutModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-card rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border text-center">
              <div className="w-12 h-12 rounded-full bg-[#0000ff]/10 flex items-center justify-center mx-auto mb-3">
                {selectedPlatform === 'x' ? (
                  <svg className="h-6 w-6 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-[#0052FF]" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
              <h2 className="font-semibold text-lg">Ready to send this out?</h2>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              <div className="bg-muted/50 rounded-xl p-3 max-h-32 overflow-y-auto">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{fullCaption}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-medium flex items-center gap-1">
                  {selectedPlatform === 'x' ? 'X (Twitter)' : 'Base Network'}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Referral link:</span>
                <span className="font-medium text-[#0000ff]">Included ✓</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-border space-y-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmSend}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#0000ff] text-white rounded-xl font-semibold"
              >
                <Check className="h-5 w-5" />
                Send
              </motion.button>
              
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyCaption}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-muted rounded-xl font-medium text-sm"
                >
                  <Copy className="h-4 w-4" />
                  Copy Caption
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSendOutModal(false)}
                  className="flex-1 py-3 bg-muted rounded-xl font-medium text-sm"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AmplifyModal;
