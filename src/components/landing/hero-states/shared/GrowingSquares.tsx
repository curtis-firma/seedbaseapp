import { motion } from 'framer-motion';
import seedSquareNode from '@/assets/seed-square-node.png';

const BARS = [
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

/**
 * Animated bar chart made of blue square seed icons stacking up.
 * Used in BrandMomentState (growth visual).
 */
const GrowingSquares = () => {
  return (
    <div className="flex items-end justify-center gap-[0.5%] w-full px-[2%] pb-0">
      {BARS.map((bar, index) => {
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
                scale: [0.8, 1, 1.2, 1],
              }}
              transition={{
                delay: animationDuration + 0.2,
                duration: 1,
                times: [0, 0.3, 0.6, 1],
              }}
            />

            {Array.from({ length: bar.height }).map((_, squareIndex) => (
              <motion.div
                key={squareIndex}
                className="w-[clamp(8px,2vw,14px)] aspect-square relative z-10"
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: bar.delay * 0.4 + squareIndex * 0.08,
                  duration: 0.25,
                  ease: 'backOut',
                }}
              >
                <img src={seedSquareNode} alt="" className="w-full h-full" />
              </motion.div>
            ))}
          </motion.div>
        );
      })}
    </div>
  );
};

export default GrowingSquares;
