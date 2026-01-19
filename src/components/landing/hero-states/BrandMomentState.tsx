import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';

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
            scale: [1, 2.5],
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
      
      {/* Seedbase circular logo with glow */}
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <img 
          src={seedbasePfp} 
          alt=""
          className="w-28 h-28 rounded-full"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(0, 0, 255, 0.25))'
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
        className="text-black/60 font-medium text-lg mt-6 tracking-wide"
      >
        Generosity in motion
      </motion.p>
    </div>
  );
};

export default BrandMomentState;
