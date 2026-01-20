import { motion } from 'framer-motion';
import SeedBlock from './SeedBlock';

export type BlockchainChainProps = {
  direction: 'left' | 'right';
  blockCount?: number;
};

/**
 * Animated blockchain chain with SeedBlocks extending from the logo.
 * Used in NetworkFlowState.
 */
const BlockchainChain = ({ direction, blockCount = 5 }: BlockchainChainProps) => {
  return (
    <>
      {/* Main chain line */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-[2px]"
        style={{
          [direction]: '50%',
          width: `${blockCount * 36 + 50}px`,
          background:
            direction === 'left'
              ? 'linear-gradient(to left, hsl(var(--primary-foreground) / 0.4), hsl(var(--primary-foreground) / 0.05))'
              : 'linear-gradient(to right, hsl(var(--primary-foreground) / 0.4), hsl(var(--primary-foreground) / 0.05))',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
      />

      {/* Seed blocks */}
      {Array.from({ length: blockCount }).map((_, i) => (
        <SeedBlock key={`${direction}-${i}`} index={i} direction={direction} totalBlocks={blockCount} />
      ))}
    </>
  );
};

export default BlockchainChain;
