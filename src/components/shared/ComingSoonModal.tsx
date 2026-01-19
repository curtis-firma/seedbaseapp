import { motion, AnimatePresence } from 'framer-motion';
import { Construction, X } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function ComingSoonModal({ isOpen, onClose, featureName }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-6 max-w-sm w-full text-center border border-border/50"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </motion.button>

            <div className="w-16 h-16 rounded-2xl gradient-base mx-auto mb-4 flex items-center justify-center">
              <Construction className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground mb-6">
              {featureName ? (
                <>
                  <span className="font-medium text-foreground">{featureName}</span> is under development and will be available soon.
                </>
              ) : (
                'This feature is under development and will be available soon.'
              )}
            </p>
            
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold"
            >
              Got it
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for easy usage
import { useState, useCallback } from 'react';

export function useComingSoon() {
  const [isOpen, setIsOpen] = useState(false);
  const [featureName, setFeatureName] = useState<string | undefined>();

  const showComingSoon = useCallback((name?: string) => {
    setFeatureName(name);
    setIsOpen(true);
  }, []);

  const hideComingSoon = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    featureName,
    showComingSoon,
    hideComingSoon,
  };
}
