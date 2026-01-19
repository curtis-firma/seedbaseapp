import { motion } from 'framer-motion';
import baseLogo from '@/assets/base-logo.png';

// Ethereum diamond SVG component
const EthereumDiamond = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 784 1277" 
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M392.07 0L383.5 29.11v873.79l8.57 8.55 392.06-231.75z" opacity="0.6"/>
    <path d="M392.07 0L0 679.7l392.07 231.75V496.27z" opacity="0.45"/>
    <path d="M392.07 956.52l-4.83 5.89v300.87l4.83 14.1 392.3-552.49z" opacity="0.8"/>
    <path d="M392.07 1277.38V956.52L0 724.89z" opacity="0.45"/>
    <path d="M392.07 911.45l392.06-231.75-392.06-183.43z" opacity="0.6"/>
    <path d="M0 679.7l392.07 231.75V496.27z" opacity="0.8"/>
  </svg>
);

const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg 
        className="absolute inset-0 w-full h-full" 
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 500"
      >
        {/* Animated flow paths */}
        <motion.path
          d="M-50,200 Q150,80 350,200 T750,200"
          fill="none"
          stroke="rgba(0,0,255,0.15)"
          strokeWidth="3"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut" },
            pathOffset: { duration: 6, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M-50,300 Q200,420 400,300 T850,300"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.5 },
            pathOffset: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M100,400 Q300,250 500,400 T900,350"
          fill="none"
          stroke="rgba(0,0,255,0.1)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 3, ease: "easeInOut", delay: 1 },
            pathOffset: { duration: 10, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M-100,150 Q100,300 300,150 T700,180"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="2"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, -1] }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut", delay: 0.3 },
            pathOffset: { duration: 7, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Pulsing nodes at intersections */}
        <motion.circle
          cx="350"
          cy="200"
          r="8"
          fill="rgba(0,0,255,0.2)"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="6"
          fill="rgba(0,0,0,0.15)"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.circle
          cx="500"
          cy="400"
          r="5"
          fill="rgba(0,0,255,0.15)"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Hexagonal network hints */}
        <g opacity="0.08">
          <motion.polygon 
            points="400,180 430,200 430,240 400,260 370,240 370,200" 
            fill="none" 
            stroke="black" 
            strokeWidth="1"
            animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.polygon 
            points="550,280 580,300 580,340 550,360 520,340 520,300" 
            fill="none" 
            stroke="blue" 
            strokeWidth="1" 
            animate={{ opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.polygon 
            points="250,320 280,340 280,380 250,400 220,380 220,340" 
            fill="none" 
            stroke="black" 
            strokeWidth="1"
            animate={{ opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          />
        </g>
      </svg>

      {/* Base logos - floating and rotating dynamically */}
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-20 h-20 opacity-[0.12]"
        style={{ top: '12%', left: '15%' }}
        animate={{ 
          y: [0, -15, 0], 
          rotate: [0, 10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-14 h-14 opacity-[0.1]"
        style={{ top: '55%', right: '12%' }}
        animate={{ 
          y: [0, 12, 0], 
          rotate: [0, -8, 0],
          x: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-12 h-12 opacity-[0.08]"
        style={{ bottom: '20%', left: '25%' }}
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-16 h-16 opacity-[0.1]"
        style={{ top: '35%', right: '30%' }}
        animate={{ 
          y: [0, 10, 0],
          rotate: [-5, 5, -5],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Ethereum diamonds - scattered, floating, and pulsing */}
      <motion.div
        className="absolute text-blue-600/20"
        style={{ top: '18%', right: '22%' }}
        animate={{ 
          y: [0, -12, 0], 
          rotate: [0, 8, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <EthereumDiamond className="w-12 h-16" />
      </motion.div>
      <motion.div
        className="absolute text-black/15"
        style={{ top: '45%', left: '20%' }}
        animate={{ 
          y: [0, 10, 0], 
          rotate: [0, -6, 0],
          x: [0, -5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <EthereumDiamond className="w-10 h-14" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/15"
        style={{ bottom: '15%', right: '18%' }}
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <EthereumDiamond className="w-8 h-11" />
      </motion.div>
      <motion.div
        className="absolute text-black/10"
        style={{ top: '65%', left: '55%' }}
        animate={{ 
          y: [0, 8, 0], 
          rotate: [0, 6, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <EthereumDiamond className="w-9 h-12" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/12"
        style={{ top: '25%', left: '45%' }}
        animate={{ 
          y: [0, -6, 0],
          x: [0, 4, 0],
          rotate: [-3, 3, -3]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <EthereumDiamond className="w-7 h-10" />
      </motion.div>

      {/* Animated particles flowing along paths */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-500/30' : 'bg-black/25'}`}
          initial={{ 
            x: -20, 
            y: 180 + (i * 35),
            opacity: 0 
          }}
          animate={{ 
            x: [0, 850],
            y: [180 + (i * 35), 140 + (i * 40), 220 + (i * 25), 190 + (i * 30)],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 6 + i * 0.5,
            delay: i * 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Reverse direction particles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`reverse-${i}`}
          className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-black/20' : 'bg-blue-500/25'}`}
          initial={{ 
            x: 850, 
            y: 250 + (i * 40),
            opacity: 0 
          }}
          animate={{ 
            x: [850, -20],
            y: [250 + (i * 40), 280 + (i * 30), 230 + (i * 35), 260 + (i * 25)],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 7 + i * 0.4,
            delay: i * 1.2 + 0.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Central glowing node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-6 rounded-full bg-blue-500/20 blur-sm" />
        <motion.div
          className="absolute inset-0 w-6 h-6 rounded-full bg-blue-500/30"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default NetworkFlowState;
