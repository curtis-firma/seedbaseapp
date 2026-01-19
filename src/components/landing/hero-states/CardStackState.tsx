import { motion } from 'framer-motion';
import SeedStackCard from '@/components/cards/SeedStackCard';

const CardStackState = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background card - furthest back */}
      <motion.div
        className="absolute opacity-50"
        animate={{ 
          y: [0, -4, 0],
          rotate: [-0.5, 0.5, -0.5]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{ 
          left: 'calc(50% - 120px)', 
          top: 'calc(50% - 100px)',
          transform: 'scale(0.85)'
        }}
      >
        <div className="w-[240px] bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-seed/20" />
            <div className="flex-1">
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-2 bg-muted/50 rounded w-16 mt-1" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-seed">$500</span>
            <span className="text-xs text-muted-foreground ml-1">SEEDED</span>
          </div>
        </div>
      </motion.div>
      
      {/* Middle card */}
      <motion.div
        className="absolute opacity-70"
        animate={{ 
          y: [0, -6, 0],
          rotate: [0.3, -0.3, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5 
        }}
        style={{ 
          left: 'calc(50% - 130px)', 
          top: 'calc(50% - 80px)',
          transform: 'scale(0.9)'
        }}
      >
        <div className="w-[260px] bg-white rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-base/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-base">TK</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Tanzania Schools</div>
              <div className="text-xs text-muted-foreground">Mission Fund</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-base">$2,500</span>
            <span className="text-xs text-muted-foreground ml-1">SEEDED</span>
          </div>
        </div>
      </motion.div>
      
      {/* Front card - main focus with SeedStackCard */}
      <motion.div
        className="relative z-10"
        animate={{ 
          y: [0, -8, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1 
        }}
      >
        <div className="scale-90">
          <SeedStackCard />
        </div>
        {/* Glow overlay on impact number */}
        <motion.div 
          className="absolute bottom-16 right-6"
          animate={{
            filter: [
              'drop-shadow(0 0 0px rgba(74, 222, 128, 0))',
              'drop-shadow(0 0 12px rgba(74, 222, 128, 0.6))',
              'drop-shadow(0 0 0px rgba(74, 222, 128, 0))'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-bold text-seed text-lg">$7</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CardStackState;
