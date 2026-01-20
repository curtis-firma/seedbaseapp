import { motion } from "framer-motion";
import seedBlue from "@/assets/seedbase-seed-blue.svg";
import seedbasePfp from "@/assets/seedbase-pfp-new.png";

/**
 * SeedGrowthBarCard - Standalone card showing the growing bar chart
 * Designed to fit inside InnerCard (340x340px) and scale properly
 */

// Growing squares bar chart component - builds UP from bottom with glow
const GrowingSquares = () => {
  const bars = [
    { height: 3, delay: 0.3 },
    { height: 5, delay: 0.4 },
    { height: 4, delay: 0.5 },
    { height: 7, delay: 0.6 },
    { height: 6, delay: 0.7 },
    { height: 8, delay: 0.8 },
    { height: 5, delay: 0.9 },
    { height: 9, delay: 1.0 },
    { height: 7, delay: 1.1 },
    { height: 6, delay: 1.2 },
    { height: 10, delay: 1.3 },
    { height: 8, delay: 1.4 },
    { height: 7, delay: 1.5 },
    { height: 11, delay: 1.6 },
    { height: 9, delay: 1.7 },
  ];

  return (
    <div className="flex items-end justify-center gap-1 w-full">
      {bars.map((bar, index) => {
        const animationDuration = bar.delay * 0.4 + bar.height * 0.06;
        
        return (
          <motion.div
            key={index}
            className="flex flex-col-reverse gap-0.5 items-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: bar.delay * 0.3, duration: 0.3 }}
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
              <motion.img
                key={squareIndex}
                src={seedBlue}
                alt=""
                className="w-3 h-3 relative z-10"
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: bar.delay * 0.3 + squareIndex * 0.06,
                  duration: 0.2,
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

const SeedGrowthBarCard = () => {
  return (
    <div className="w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Header */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        Generosity that grows
      </motion.p>
      
      {/* Center logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mb-6"
      >
        <motion.img 
          src={seedbasePfp} 
          alt=""
          className="w-24 h-24 rounded-full"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.div>

      {/* Growing bar chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full"
      >
        <GrowingSquares />
      </motion.div>
      
      {/* Footer stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"
      >
        <span>Seeds planted: <span className="font-semibold text-foreground">2,847</span></span>
        <span>Growth: <span className="font-semibold text-emerald-600">+12%</span></span>
      </motion.div>
    </div>
  );
};

export default SeedGrowthBarCard;
