import { motion } from 'framer-motion';

const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg 
        className="absolute inset-0 w-full h-full" 
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 500"
      >
        {/* Flow paths */}
        <motion.path
          d="M-50,200 Q150,80 350,200 T750,200"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.path
          d="M-50,300 Q200,420 400,300 T850,300"
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: 1 }}
        />
        <motion.path
          d="M100,400 Q300,250 500,400 T900,350"
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 2 }}
        />
        
        {/* Hexagonal hints (very subtle) */}
        <g opacity="0.06">
          <polygon 
            points="400,180 430,200 430,240 400,260 370,240 370,200" 
            fill="none" 
            stroke="black" 
            strokeWidth="1" 
          />
          <polygon 
            points="550,280 580,300 580,340 550,360 520,340 520,300" 
            fill="none" 
            stroke="black" 
            strokeWidth="1" 
          />
          <polygon 
            points="250,320 280,340 280,380 250,400 220,380 220,340" 
            fill="none" 
            stroke="black" 
            strokeWidth="1" 
          />
        </g>
      </svg>

      {/* Animated particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-black/20"
          initial={{ 
            x: -20, 
            y: 200 + (i * 30),
            opacity: 0 
          }}
          animate={{ 
            x: [0, 800],
            y: [200 + (i * 30), 150 + (i * 40), 250 + (i * 20), 200 + (i * 35)],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 8,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Central node glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/10"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default NetworkFlowState;
