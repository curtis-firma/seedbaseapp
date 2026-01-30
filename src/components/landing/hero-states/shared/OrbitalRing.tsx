import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import seedbaseIcon from '@/assets/seedbase-icon-blue.png';

export type OrbitalRingProps = {
  /** Percentage-based radius (e.g., "45%") */
  radius: string;
  duration: number;
  reverse?: boolean;
  seedCount?: number;
  opacity?: number;
};

/**
 * Spinning orbital ring with seed icons positioned along the circumference.
 * Used in BrandMomentState (white bg, blue seeds).
 */
const OrbitalRing = forwardRef<HTMLDivElement, OrbitalRingProps>(function OrbitalRing(
  {
    radius,
    duration,
    reverse = false,
    seedCount = 4,
    opacity = 0.15,
  },
  ref
) {
  const angles = Array.from({ length: seedCount }, (_, i) => (360 / seedCount) * i);

  return (
    <motion.div
      ref={ref}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius, height: radius }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {/* Ring circle - blue on white */}
      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="hsl(var(--primary) / 0.2)"
          strokeWidth="0.5"
          strokeDasharray="3 5"
          style={{ opacity }}
        />
      </svg>

      {/* Seed icons positioned along the ring */}
      {angles.map((angle, i) => {
        const radian = (angle * Math.PI) / 180;
        const x = 50 + 48 * Math.cos(radian);
        const y = 50 + 48 * Math.sin(radian);
        return (
          <motion.div
            key={i}
            className="absolute w-[8%] h-[8%]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          >
            <img src={seedbaseIcon} alt="" className="w-full h-full opacity-80" />
          </motion.div>
        );
      })}
    </motion.div>
  );
});

export default OrbitalRing;
