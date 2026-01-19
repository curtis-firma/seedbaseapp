import { motion } from 'framer-motion';
import seedbaseLeaf from '@/assets/seedbase-leaf-blue.png';

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
      <div className="relative mb-6">
        <motion.img
          src={seedbaseLeaf}
          alt="Seedbase"
          className="w-20 h-20"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        {/* Spinning ring */}
        <div className="absolute inset-0 -m-2">
          <motion.div
            className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>
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
