import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp.png';
import seedbaseIconBlue from '@/assets/seedbase-icon-blue.png';

/**
 * NetworkFlowState - Hero canvas state showing blockchain/network generosity flow.
 * WHITE background with blue elements (on a colored container).
 */
const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
      {/* Centered "Generosity onchain" text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 md:top-8 left-0 right-0 text-center text-primary/70 font-medium text-base md:text-lg lg:text-xl tracking-wide z-20"
      >
        Generosity onchain
      </motion.p>

      {/* Blue orbital rings */}
      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="200" height="200" className="opacity-20">
          <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="8 12" />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="280" height="280" className="opacity-15">
          <circle cx="140" cy="140" r="100" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="12 18" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <svg width="360" height="360" className="opacity-10">
          <circle cx="180" cy="180" r="140" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="16 24" />
        </svg>
      </motion.div>

      {/* Blockchain chain - horizontal line with nodes */}
      <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 flex items-center justify-between z-5">
        {/* Left chain section */}
        <div className="flex items-center gap-2">
          <motion.img
            src={seedbaseIconBlue}
            alt=""
            className="w-6 h-6 md:w-8 md:h-8 rounded-md shadow-md"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="w-8 md:w-12 h-[2px] bg-primary/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.img
            src={seedbaseIconBlue}
            alt=""
            className="w-5 h-5 md:w-6 md:h-6 rounded-md shadow-md"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="w-6 md:w-10 h-[2px] bg-primary/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
        </div>

        {/* Central Seedbase logo */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Glow effect behind logo */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            style={{ width: 90, height: 90, left: '50%', top: '50%', marginLeft: -45, marginTop: -45 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Central logo */}
          <motion.img
            src={seedbasePfp}
            alt="Seedbase"
            className="rounded-full ring-2 ring-primary/20 shadow-lg"
            style={{ width: 64, height: 64 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Right chain section */}
        <div className="flex items-center gap-2">
          <motion.div
            className="w-6 md:w-10 h-[2px] bg-primary/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.img
            src={seedbaseIconBlue}
            alt=""
            className="w-5 h-5 md:w-6 md:h-6 rounded-md shadow-md"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.div
            className="w-8 md:w-12 h-[2px] bg-primary/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.img
            src={seedbaseIconBlue}
            alt=""
            className="w-6 h-6 md:w-8 md:h-8 rounded-md shadow-md"
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
        </div>
      </div>

      {/* Subtle grid dots pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="network-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1" fill="hsl(var(--primary))" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#network-dots)" />
        </svg>
      </div>
    </div>
  );
};

export default NetworkFlowState;
