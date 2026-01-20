import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import seedBlue from '@/assets/seedbase-seed-blue.svg';

/**
 * BrandMomentState - Hero canvas state showing generosity growth
 * Uses percentage-based sizing to scale properly across viewports
 */

// Spinning orbital ring component with seed icons
const OrbitalRing = ({ 
  radius, 
  duration, 
  reverse = false,
  seedCount = 4,
  opacity = 0.15
}: { 
  radius: string; // Percentage-based (e.g., "25%")
  duration: number; 
  reverse?: boolean;
  seedCount?: number;
  opacity?: number;
}) => {
  const angles = Array.from({ length: seedCount }, (_, i) => (360 / seedCount) * i);
  
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: radius,
        height: radius,
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {/* Ring circle */}
      <svg className="w-full h-full absolute" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="3 5"
          className="text-black"
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
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          >
            <img src={seedBlue} alt="" className="w-full h-full" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Growing squares bar chart component
const GrowingSquares = () => {
  const bars = [
    { height: 2, delay: 0.6 },
    { height: 3, delay: 0.65 },
    { height: 4, delay: 0.7 },
    { height: 3, delay: 0.75 },
    { height: 5, delay: 0.8 },
    { height: 4, delay: 0.85 },
    { height: 6, delay: 0.9 },
    { height: 5, delay: 0.95 },
    { height: 7, delay: 1.0 },
    { height: 6, delay: 1.05 },
    { height: 8, delay: 1.1 },
    { height: 5, delay: 1.15 },
    { height: 7, delay: 1.2 },
    { height: 9, delay: 1.25 },
    { height: 6, delay: 1.3 },
    { height: 8, delay: 1.35 },
    { height: 7, delay: 1.4 },
    { height: 10, delay: 1.45 },
    { height: 8, delay: 1.5 },
    { height: 6, delay: 1.55 },
    { height: 9, delay: 1.6 },
    { height: 11, delay: 1.65 },
    { height: 7, delay: 1.7 },
    { height: 8, delay: 1.75 },
    { height: 10, delay: 1.8 },
    { height: 9, delay: 1.85 },
    { height: 12, delay: 1.9 },
    { height: 8, delay: 1.95 },
    { height: 10, delay: 2.0 },
    { height: 11, delay: 2.05 },
    { height: 9, delay: 2.1 },
    { height: 13, delay: 2.15 },
  ];

  return (
    <div className="flex items-end justify-center gap-[0.5%] w-full px-[2%] pb-0">
      {bars.map((bar, index) => {
        const animationDuration = bar.delay * 0.4 + bar.height * 0.08;
        
        return (
          <motion.div
            key={index}
            className="flex flex-col-reverse gap-[2px] items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bar.delay * 0.4, duration: 0.3 }}
          >
            {/* Glow effect when complete */}
            <motion.div
              className="absolute -inset-1 bg-blue-400/20 rounded-full"
              animate={{ 
                opacity: [0, 0, 0.6, 0],
                scale: [0.8, 1, 1.2, 1]
              }}
              transition={{
                delay: animationDuration + 0.2,
                duration: 1,
                times: [0, 0.3, 0.6, 1]
              }}
            />
            
            {Array.from({ length: bar.height }).map((_, squareIndex) => (
              <motion.div
                key={squareIndex}
                className="w-[clamp(6px,1.5vw,12px)] aspect-square relative z-10"
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: bar.delay * 0.4 + squareIndex * 0.08,
                  duration: 0.25,
                  ease: "backOut"
                }}
              >
                <img src={seedBlue} alt="" className="w-full h-full" />
              </motion.div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

const BrandMomentState = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* "Generosity that grows" at the TOP */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[8%] text-black/70 font-semibold tracking-wide z-20"
        style={{ fontSize: 'clamp(14px, 5%, 24px)' }}
      >
        Generosity that grows
      </motion.p>

      {/* Spinning orbital rings with seed icons - percentage-based */}
      <OrbitalRing radius="45%" duration={18} seedCount={3} opacity={0.12} />
      <OrbitalRing radius="65%" duration={24} reverse seedCount={4} opacity={0.1} />
      <OrbitalRing radius="85%" duration={30} seedCount={5} opacity={0.08} />

      {/* Grid dots pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="hero-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
      
      {/* Seedbase circular logo with glow - CENTER */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.05, 1],
          opacity: 1
        }}
        transition={{ 
          scale: { duration: 1.5, times: [0, 0.6, 1], ease: "easeOut" },
          opacity: { duration: 0.8 }
        }}
        className="relative z-10 w-[25%] max-w-[160px] aspect-square"
      >
        <motion.img 
          src={seedbasePfp} 
          alt=""
          className="w-full h-full rounded-full"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.div>

      {/* Growing squares bar chart at bottom - touches bottom edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-0 left-0 right-0 w-full pb-2"
      >
        <GrowingSquares />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
