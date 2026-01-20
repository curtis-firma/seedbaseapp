import { motion } from 'framer-motion';

export type SegmentedOrbitalRingProps = {
  radius: number;
  duration: number;
  reverse?: boolean;
  segments?: number;
  gapRatio?: number;
  dotCount?: number;
  strokeWidth?: number;
};

/**
 * Segmented spinning ring with orbiting dots.
 * Used in NetworkFlowState (blue bg, white strokes/dots).
 */
const SegmentedOrbitalRing = ({
  radius,
  duration,
  reverse = false,
  segments = 8,
  gapRatio = 0.3,
  dotCount = 2,
  strokeWidth = 2,
}: SegmentedOrbitalRingProps) => {
  const circumference = 2 * Math.PI * radius;
  const segmentLength = circumference / segments;
  const dashLength = segmentLength * (1 - gapRatio);
  const gapLength = segmentLength * gapRatio;

  const dotPositions = Array.from({ length: dotCount }, (_, i) => (i / dotCount) * 360);

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
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      {/* Dashed ring */}
      <svg className="w-full h-full" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2}
          fill="none"
          stroke="hsl(var(--primary-foreground) / 0.25)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength} ${gapLength}`}
          strokeLinecap="round"
        />
      </svg>

      {/* Orbiting dots */}
      {dotPositions.map((angle, i) => (
        <div
          key={i}
          className="absolute bg-primary-foreground/50 rounded-full"
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

export default SegmentedOrbitalRing;
