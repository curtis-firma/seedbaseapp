import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import seedBlue from '@/assets/seedbase-seed-blue.svg';

// Growing squares bar chart component
const GrowingSquares = () => {
  const bars = [
    { height: 6, delay: 0 },
    { height: 4, delay: 0.2 },
    { height: 8, delay: 0.4 },
    { height: 5, delay: 0.6 },
    { height: 7, delay: 0.8 },
    { height: 3, delay: 1.0 },
    { height: 9, delay: 1.2 },
    { height: 6, delay: 1.4 },
    { height: 4, delay: 1.6 },
    { height: 7, delay: 1.8 },
    { height: 5, delay: 2.0 },
    { height: 8, delay: 2.2 },
  ];

  return (
    <div className="flex items-end justify-center gap-1.5">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="flex flex-col gap-0.5 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: bar.delay * 0.5, duration: 0.3 }}
        >
          {Array.from({ length: bar.height }).map((_, squareIndex) => (
            <motion.img
              key={squareIndex}
              src={seedBlue}
              alt=""
              className="w-3 h-3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: bar.delay * 0.5 + squareIndex * 0.1,
                duration: 0.2,
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
      
      {/* Tagline with fade animation - UPDATED */}
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

      {/* Growing squares bar chart at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <GrowingSquares />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
