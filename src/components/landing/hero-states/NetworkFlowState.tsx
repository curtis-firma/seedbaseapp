import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp.png';
import seedbaseBlock from '@/assets/seedbase-block.svg';

// Seed square block component for the blockchain chain
const SeedBlock = ({ 
  index, 
  direction, 
  totalBlocks 
}: { 
  index: number; 
  direction: 'left' | 'right';
  totalBlocks: number;
}) => {
  const delay = index * 0.12;
  const distance = (index + 1) * 36; // spacing between blocks
  
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2"
      style={{
        [direction]: `calc(50% + 45px + ${distance}px)`, // Start from center + logo radius
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0.5],
        scale: [0, 1.1, 1],
      }}
      transition={{ 
        delay: 0.5 + delay,
        duration: 0.4,
        ease: "easeOut",
      }}
    >
      {/* Seed icon as block */}
      <motion.div
        className="relative"
        animate={{ 
          y: [0, -2, 0, 2, 0],
        }}
        transition={{ 
          delay: delay,
          duration: 2 + (index * 0.3),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img 
          src={seedbaseBlock}
          alt=""
          className="w-6 h-6 md:w-7 md:h-7"
          style={{ 
            opacity: 0.7 - (index * 0.08),
            filter: `drop-shadow(0 0 ${4 + index}px rgba(0, 0, 255, 0.3))`,
          }}
        />
      </motion.div>
      
      {/* Connecting line to next block */}
      {index < totalBlocks - 1 && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-blue-400/30 to-blue-400/10"
          style={{
            width: '28px',
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

// Blockchain chain extending from logo
const BlockchainChain = ({ direction, blockCount = 5 }: { direction: 'left' | 'right'; blockCount?: number }) => {
  return (
    <>
      {/* Main chain line */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 h-[2px]"
        style={{
          [direction]: '50%',
          width: `${blockCount * 36 + 50}px`,
          background: direction === 'left' 
            ? 'linear-gradient(to left, rgba(0, 0, 255, 0.3), rgba(0, 0, 255, 0.05))'
            : 'linear-gradient(to right, rgba(0, 0, 255, 0.3), rgba(0, 0, 255, 0.05))',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Seed blocks */}
      {Array.from({ length: blockCount }).map((_, i) => (
        <SeedBlock 
          key={`${direction}-${i}`}
          index={i} 
          direction={direction}
          totalBlocks={blockCount}
        />
      ))}
    </>
  );
};

// Base-style segmented orbital ring with orbiting dots
const SegmentedOrbitalRing = ({
  radius,
  duration,
  reverse = false,
  segments = 8,
  gapRatio = 0.3,
  dotCount = 2,
  strokeWidth = 2,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  segments?: number;
  gapRatio?: number;
  dotCount?: number;
  strokeWidth?: number;
}) => {
  // Calculate dash array for segmented effect
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / segments;
  const dashLength = segmentLength * (1 - gapRatio);
  const gapLength = segmentLength * gapRatio;
  
  // Generate dot positions evenly around the ring
  const dotPositions = Array.from({ length: dotCount }).map((_, i) => {
    const angle = (i / dotCount) * 360;
    return angle;
  });
  
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ 
        width: radius * 2, 
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {/* SVG for dashed ring */}
      <svg className="w-full h-full" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="rgba(0, 0, 255, 0.35)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Orbiting dots */}
      {dotPositions.map((angle, i) => (
        <div
          key={i}
          className="absolute bg-[#0000ff]/60 rounded-full"
          style={{
            width: 6,
            height: 6,
            left: '50%',
            top: '50%',
            transform: `rotate(${angle}deg) translateY(-${radius - 3}px) translateX(-50%)`,
          }}
        />
      ))}
    </motion.div>
  );
};

const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white">
      {/* Centered "Generosity onchain" text */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-6 md:top-8 left-0 right-0 text-center text-black/60 font-medium text-base md:text-lg lg:text-xl tracking-wide z-20"
      >
        Generosity onchain
      </motion.p>

      {/* Base-style spinning segmented orbital rings */}
      <SegmentedOrbitalRing radius={55} duration={15} segments={6} dotCount={2} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={85} duration={20} reverse segments={8} dotCount={3} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={115} duration={25} segments={10} dotCount={2} strokeWidth={1.5} />
      <SegmentedOrbitalRing radius={145} duration={30} reverse segments={12} dotCount={1} strokeWidth={1} />

      {/* Blockchain chains extending from logo in both directions */}
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
          className="absolute inset-0 rounded-full bg-[#0000ff]/20"
          style={{ 
            width: 90, 
            height: 90, 
            left: '50%',
            top: '50%',
            marginLeft: -45, 
            marginTop: -45,
          }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Central logo */}
        <motion.img
          src={seedbasePfp}
          alt="Seedbase"
          className="w-18 h-18 md:w-20 md:h-20 rounded-full ring-3 ring-[#0000ff]/30 shadow-xl"
          style={{ width: 72, height: 72 }}
          animate={{ 
            scale: [1, 1.03, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Subtle pulsing nodes at chain ends */}
      <motion.div
        className="absolute left-[8%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0000ff]/30"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute right-[8%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0000ff]/30"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
};

export default NetworkFlowState;
