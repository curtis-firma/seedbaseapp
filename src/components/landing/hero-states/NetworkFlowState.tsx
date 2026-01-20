import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp.png';
import seedNodeIcon from '@/assets/seed-block-white-on-blue.png';
import { SegmentedOrbitalRing, BlockchainChain } from './shared';

/**
 * NetworkFlowState - Hero canvas state showing blockchain/network generosity flow.
 * Blue background with white elements.
 */
const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-base">
      {/* Centered "Generosity onchain" text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-6 md:top-8 left-0 right-0 text-center text-primary-foreground/70 font-medium text-base md:text-lg lg:text-xl tracking-wide z-20"
      >
        Generosity onchain
      </motion.p>

      {/* Spinning segmented orbital rings */}
      <SegmentedOrbitalRing radius={55} duration={15} segments={6} dotCount={2} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={85} duration={20} reverse segments={8} dotCount={3} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={115} duration={25} segments={10} dotCount={2} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={145} duration={30} reverse segments={12} dotCount={1} strokeWidth={1} />

      {/* Blockchain chains extending from logo */}
      <BlockchainChain direction="left" blockCount={5} />
      <BlockchainChain direction="right" blockCount={5} />

      {/* Central Seedbase logo */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Glow effect behind logo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary-foreground/20"
          style={{ width: 90, height: 90, left: '50%', top: '50%', marginLeft: -45, marginTop: -45 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Central logo */}
        <motion.img
          src={seedbasePfp}
          alt="Seedbase"
          className="rounded-full ring-3 ring-primary-foreground/30 shadow-xl"
          style={{ width: 72, height: 72 }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Pulsing nodes at chain ends */}
      <motion.img
        src={seedNodeIcon}
        alt=""
        className="absolute left-[8%] top-1/2 -translate-y-1/2 w-6 h-6 rounded-md ring-1 ring-primary-foreground/25"
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.img
        src={seedNodeIcon}
        alt=""
        className="absolute right-[8%] top-1/2 -translate-y-1/2 w-6 h-6 rounded-md ring-1 ring-primary-foreground/25"
        animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
    </div>
  );
};

export default NetworkFlowState;
