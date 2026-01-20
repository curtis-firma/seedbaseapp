import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import seedBlue from '@/assets/seedbase-seed-blue.svg';

// Spinning orbital ring component with seed icons
const OrbitalRing = ({ 
  radius, 
  duration, 
  reverse = false,
  seedCount = 4,
  opacity = 0.15
}: { 
  radius: number; 
  duration: number; 
  reverse?: boolean;
  seedCount?: number;
  opacity?: number;
}) => {
  const angles = Array.from({ length: seedCount }, (_, i) => (360 / seedCount) * i);
  
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
      {/* Ring circle */}
      <svg className="w-full h-full absolute" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="text-black"
          style={{ opacity }}
        />
      </svg>
      
      {/* Seed icons positioned along the ring */}
      {angles.map((angle, i) => {
        const x = radius + (radius - 2) * Math.cos((angle * Math.PI) / 180) - 8;
        const y = radius + (radius - 2) * Math.sin((angle * Math.PI) / 180) - 8;
        return (
          <motion.img
            key={i}
            src={seedBlue}
            alt=""
            className="absolute w-4 h-4"
            style={{ left: x, top: y }}
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
          />
        );
      })}
    </motion.div>
  );
};

// Growing squares bar chart component - builds UP from bottom with glow
const GrowingSquares = () => {
  const bars = [
    { height: 3, delay: 0.8 },
    { height: 5, delay: 0.9 },
    { height: 4, delay: 1.0 },
    { height: 7, delay: 1.1 },
    { height: 6, delay: 1.2 },
    { height: 8, delay: 1.3 },
    { height: 5, delay: 1.4 },
    { height: 9, delay: 1.5 },
    { height: 7, delay: 1.6 },
    { height: 6, delay: 1.7 },
    { height: 10, delay: 1.8 },
    { height: 8, delay: 1.9 },
    { height: 7, delay: 2.0 },
    { height: 11, delay: 2.1 },
    { height: 9, delay: 2.2 },
    { height: 8, delay: 2.3 },
    { height: 12, delay: 2.4 },
    { height: 10, delay: 2.5 },
    { height: 9, delay: 2.6 },
    { height: 11, delay: 2.7 },
    { height: 13, delay: 2.8 },
    { height: 10, delay: 2.9 },
    { height: 12, delay: 3.0 },
    { height: 11, delay: 3.1 },
    { height: 14, delay: 3.2 },
  ];

  return (
    <div className="flex items-end justify-between w-full px-8">
      {bars.map((bar, index) => {
        const animationDuration = bar.delay * 0.4 + bar.height * 0.08;
        
        return (
          <motion.div
            key={index}
            className="flex flex-col-reverse gap-0.5 items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bar.delay * 0.4, duration: 0.3 }}
          >
            {/* Glow effect when complete (no blur to avoid fuzzy edges) */}
            <motion.div
              className="absolute -inset-1 bg-blue-400/20 rounded-full shadow-glow"
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
              <motion.img
                key={squareIndex}
                src={seedBlue}
                alt=""
                className="w-4 h-4 relative z-10"
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: bar.delay * 0.4 + squareIndex * 0.08,
                  duration: 0.25,
                  ease: "backOut"
                }}
              />
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
        className="absolute top-12 text-black/70 font-semibold text-2xl tracking-wide z-20"
      >
        Generosity that grows
      </motion.p>

      {/* Spinning orbital rings with seed icons - single set of desktop sizes */}
      <OrbitalRing radius={80} duration={18} seedCount={3} opacity={0.12} />
      <OrbitalRing radius={115} duration={24} reverse seedCount={4} opacity={0.1} />
      <OrbitalRing radius={150} duration={30} seedCount={5} opacity={0.08} />

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
        className="relative z-10"
      >
        <motion.img 
          src={seedbasePfp} 
          alt=""
          className="w-40 h-40 rounded-full"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.div>

      {/* Growing squares bar chart at bottom - builds UP with glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-4 left-0 right-0 w-full"
      >
        <GrowingSquares />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
