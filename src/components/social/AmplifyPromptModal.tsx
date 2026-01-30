import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, Sparkles } from 'lucide-react';
import { triggerHaptic } from '@/hooks/useHaptic';
import { AmplifyModal } from './AmplifyModal';

interface AmplifyPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactSummary: string;
  content: string;
}

export function AmplifyPromptModal({
  isOpen,
  onClose,
  impactSummary,
  content,
}: AmplifyPromptModalProps) {
  const [showAmplifyModal, setShowAmplifyModal] = useState(false);
  
  const handleAmplify = () => {
    triggerHaptic('medium');
    setShowAmplifyModal(true);
  };
  
  const handleNotNow = () => {
    triggerHaptic('light');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <AnimatePresence>
        {!showAmplifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card rounded-2xl overflow-hidden"
            >
              {/* Header with animation */}
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-4 relative"
                >
                  <Megaphone className="h-8 w-8 text-primary-foreground" />
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-yellow-800" />
                  </motion.div>
                </motion.div>
                
                <h2 className="text-xl font-bold mb-2">Amplify this impact?</h2>
                <p className="text-muted-foreground text-sm">{impactSummary}</p>
              </div>
              
              {/* Actions */}
              <div className="p-4 pt-0 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAmplify}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg"
                >
                  <Megaphone className="h-5 w-5" />
                  Amplify
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNotNow}
                  className="w-full py-3 text-muted-foreground font-medium"
                >
                  Not now
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AmplifyModal
        isOpen={showAmplifyModal}
        onClose={() => {
          setShowAmplifyModal(false);
          onClose();
        }}
        content={content}
        impactSummary={impactSummary}
      />
    </>
  );
}

export default AmplifyPromptModal;
