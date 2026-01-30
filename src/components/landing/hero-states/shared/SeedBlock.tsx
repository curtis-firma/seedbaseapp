import { motion } from 'framer-motion';
import seedbaseIcon from '@/assets/seedbase-icon-blue.png';

export type SeedBlockProps = {
  index: number;
  direction: 'left' | 'right';
  totalBlocks: number;
};

/**
 * Single animated seed block along the blockchain chain.
 * Used in NetworkFlowState.
 */
const SeedBlock = ({ index, direction, totalBlocks }: SeedBlockProps) => {
  const delay = index * 0.12;
  const distance = (index + 1) * 36;

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      style={{ [direction]: `calc(50% + 45px + ${distance}px)` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.8, 0.6], scale: [0, 1.1, 1] }}
      transition={{ delay: 0.5 + delay, duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -2, 0, 2, 0] }}
        transition={{
          delay,
          duration: 2 + index * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.img
          src={seedbaseIcon}
          alt=""
          className="w-6 h-6 md:w-7 md:h-7 rounded-md ring-1 ring-primary-foreground/25"
          style={{
            opacity: 0.9 - index * 0.06,
            boxShadow: `0 0 ${6 + index}px hsl(var(--primary-foreground) / 0.25)`,
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Connecting line to next block */}
      {index < totalBlocks - 1 && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-primary-foreground/30 to-primary-foreground/10"
          style={{
            width: 28,
            [direction === 'left' ? 'right' : 'left']: '-30px',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6 + delay, duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default SeedBlock;
