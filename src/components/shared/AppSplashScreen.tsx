import { motion } from 'framer-motion';
import { Logo } from '@/components/shared/Logo';

interface AppSplashScreenProps {
  onComplete?: () => void;
}

export function AppSplashScreen({ onComplete }: AppSplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[100]"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(221 83% 97%) 25%, hsl(var(--background)) 50%, hsl(221 83% 97%) 75%, hsl(var(--background)) 100%)',
          backgroundSize: '400% 400%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Logo with entrance animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        className="mb-8"
      >
        <Logo variant="full" size="xl" forceDark />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-muted-foreground font-medium mb-12"
      >
        Commitment creates capacity.
      </motion.p>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          {/* Pulsing ring */}
          <motion.div
            className="w-12 h-12 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Spinning ring */}
          <motion.div
            className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <motion.span
          className="text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading...
        </motion.span>
      </motion.div>

      {/* Bottom branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-xs text-muted-foreground">
          Where Generosity Grows
        </p>
      </motion.div>
    </motion.div>
  );
}
