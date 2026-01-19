import { motion } from 'framer-motion';
import { Logo } from '@/components/shared/Logo';

interface SeedbaseLoaderProps {
  message?: string;
}

export function SeedbaseLoader({ message = 'Loading...' }: SeedbaseLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50"
    >
      <div className="relative mb-6 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Logo variant="icon" size="xl" />
        </motion.div>
        {/* Spinning ring - centered around logo */}
        <motion.div
          className="absolute w-28 h-28 rounded-full border-4 border-primary/20 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground font-medium"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
