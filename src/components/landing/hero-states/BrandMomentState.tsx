import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import seedBlue from '@/assets/seedbase-seed-blue.svg';

// Growing squares bar chart component - FULL WIDTH
const GrowingSquares = () => {
  // More bars to span the full width
  const bars = [
    { height: 3, delay: 0 },
    { height: 5, delay: 0.1 },
    { height: 4, delay: 0.2 },
    { height: 7, delay: 0.3 },
    { height: 6, delay: 0.4 },
    { height: 8, delay: 0.5 },
    { height: 5, delay: 0.6 },
    { height: 9, delay: 0.7 },
    { height: 7, delay: 0.8 },
    { height: 6, delay: 0.9 },
    { height: 10, delay: 1.0 },
    { height: 8, delay: 1.1 },
    { height: 7, delay: 1.2 },
    { height: 11, delay: 1.3 },
    { height: 9, delay: 1.4 },
    { height: 8, delay: 1.5 },
    { height: 12, delay: 1.6 },
    { height: 10, delay: 1.7 },
    { height: 9, delay: 1.8 },
    { height: 11, delay: 1.9 },
    { height: 13, delay: 2.0 },
    { height: 10, delay: 2.1 },
    { height: 12, delay: 2.2 },
    { height: 11, delay: 2.3 },
    { height: 14, delay: 2.4 },
  ];

  return (
    <div className="flex items-end justify-between w-full px-4 md:px-8">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-1 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: bar.delay * 0.3, duration: 0.3 }}
        >
          {Array.from({ length: bar.height }).map((_, squareIndex) => (
            <motion.img
              key={squareIndex}
              src={seedBlue}
              alt=""
              className="w-4 h-4 md:w-5 md:h-5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: bar.delay * 0.3 + squareIndex * 0.05,
                duration: 0.15,
                ease: "backOut"
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

const BrandMomentState = () => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Concentric circles */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full border border-black/10"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ 
            scale: [1, 3],
            opacity: [0.3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 1.2
          }}
        />
      ))}
      
      {/* Grid dots pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <pattern id="hero-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill="black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
      
      {/* Seedbase circular logo with glow - BIGGER with scale animation */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1
        }}
        transition={{ 
          scale: { duration: 2, times: [0, 0.6, 1], ease: "easeOut" },
          opacity: { duration: 1 }
        }}
        className="relative z-10"
      >
        <motion.img 
          src={seedbasePfp} 
          alt=""
          className="w-40 h-40 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            filter: 'drop-shadow(0 0 60px rgba(0, 0, 255, 0.3))'
          }}
        />
      </motion.div>
      
      {/* Tagline with fade animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0, 1, 1, 0], 
          y: [10, 0, 0, -10] 
        }}
        transition={{ 
          duration: 8, 
          times: [0, 0.2, 0.8, 1],
          repeat: Infinity
        }}
        className="text-black/60 font-medium text-xl mt-6 tracking-wide"
      >
        Generosity that grows
      </motion.p>

      {/* Growing squares bar chart at bottom - FULL WIDTH */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-4 left-0 right-0 w-full"
      >
        <GrowingSquares />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
