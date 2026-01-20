import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import { OrbitalRing, GrowingSquares } from './shared';

interface BrandMomentStateProps {
  active?: boolean;
}

/**
 * BrandMomentState - Hero canvas state showing generosity growth.
 * White background with blue elements.
 */
const BrandMomentState = ({ active = true }: BrandMomentStateProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when becoming active
  useEffect(() => {
    if (active) {
      setAnimationKey(prev => prev + 1);
    }
  }, [active]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* "Generosity that grows" at the TOP */}
      <motion.p
        key={`title-${animationKey}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[8%] text-black/70 font-semibold tracking-wide z-20"
        style={{ fontSize: 'clamp(14px, 5%, 24px)' }}
      >
        Generosity that grows
      </motion.p>

      {/* Spinning orbital rings with seed icons */}
      <OrbitalRing radius="45%" duration={18} seedCount={3} opacity={0.15} />
      <OrbitalRing radius="65%" duration={24} reverse seedCount={4} opacity={0.12} />
      <OrbitalRing radius="85%" duration={30} seedCount={5} opacity={0.1} />

      {/* Grid dots pattern - blue on white */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="hero-dots-white" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(0, 0, 255, 0.4)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-dots-white)" />
        </svg>
      </div>

      {/* Seedbase circular logo with glow */}
      <motion.div
        key={`logo-${animationKey}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
        transition={{
          scale: { duration: 1.5, times: [0, 0.6, 1], ease: 'easeOut' },
          opacity: { duration: 0.8 },
        }}
        className="relative z-10 w-[25%] max-w-[160px] aspect-square"
      >
        <motion.img
          src={seedbasePfp}
          alt=""
          className="w-full h-full rounded-full ring-2 ring-[#0000ff]/20"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.div>

      {/* Growing squares bar chart at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 w-full pb-2"
      >
        <GrowingSquares key={`squares-${animationKey}`} />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
