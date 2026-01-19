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
      {/* "Generosity onchain" text at top */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-black/50 font-medium text-lg md:text-xl tracking-wide z-20"
      >
        Generosity onchain
      </motion.p>

      <svg 
        className="absolute inset-0 w-full h-full" 
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 500"
      >
        {/* Animated flow paths - more dynamic */}
        <motion.path
          d="M-50,200 Q150,80 350,200 T750,200"
          fill="none"
          stroke="rgba(0,0,255,0.18)"
          strokeWidth="3"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 1.5, ease: "easeInOut" },
            pathOffset: { duration: 4, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M-50,300 Q200,420 400,300 T850,300"
          fill="none"
          stroke="rgba(0,0,0,0.12)"
          strokeWidth="2.5"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut", delay: 0.3 },
            pathOffset: { duration: 5, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M100,400 Q300,250 500,400 T900,350"
          fill="none"
          stroke="rgba(0,0,255,0.12)"
          strokeWidth="2"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut", delay: 0.6 },
            pathOffset: { duration: 6, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M-100,150 Q100,300 300,150 T700,180"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, -1] }}
          transition={{ 
            pathLength: { duration: 1.5, ease: "easeInOut", delay: 0.2 },
            pathOffset: { duration: 5, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.path
          d="M50,100 Q250,200 450,100 T850,120"
          fill="none"
          stroke="rgba(0,0,255,0.1)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: 1, pathOffset: [0, 1] }}
          transition={{ 
            pathLength: { duration: 2.5, ease: "easeInOut", delay: 0.8 },
            pathOffset: { duration: 7, repeat: Infinity, ease: "linear" }
          }}
        />
        
        {/* Pulsing nodes at intersections - more visible */}
        <motion.circle
          cx="350"
          cy="200"
          r="10"
          fill="rgba(0,0,255,0.25)"
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="8"
          fill="rgba(0,0,0,0.2)"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.45, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="500"
          cy="400"
          r="7"
          fill="rgba(0,0,255,0.2)"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.circle
          cx="250"
          cy="150"
          r="6"
          fill="rgba(0,0,255,0.18)"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.18, 0.35, 0.18]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        />
        
        {/* Hexagonal network hints - more visible */}
        <g opacity="0.12">
          <motion.polygon 
            points="400,180 430,200 430,240 400,260 370,240 370,200" 
            fill="none" 
            stroke="black" 
            strokeWidth="1.5"
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <motion.polygon 
            points="550,280 580,300 580,340 550,360 520,340 520,300" 
            fill="none" 
            stroke="blue" 
            strokeWidth="1.5" 
            animate={{ opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
          />
          <motion.polygon 
            points="250,320 280,340 280,380 250,400 220,380 220,340" 
            fill="none" 
            stroke="black" 
            strokeWidth="1.5"
            animate={{ opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: 0.8 }}
          />
        </g>
      </svg>

      {/* Base logos - more dynamic floating and rotating */}
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-20 h-20 md:w-24 md:h-24 opacity-[0.15]"
        style={{ top: '10%', left: '12%' }}
        animate={{ 
          y: [0, -18, 0], 
          rotate: [0, 15, 0],
          scale: [1, 1.08, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-16 h-16 md:w-18 md:h-18 opacity-[0.12]"
        style={{ top: '50%', right: '10%' }}
        animate={{ 
          y: [0, 15, 0], 
          rotate: [0, -12, 0],
          x: [0, 8, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-14 h-14 opacity-[0.1]"
        style={{ bottom: '18%', left: '22%' }}
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 8, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-18 h-18 md:w-20 md:h-20 opacity-[0.12]"
        style={{ top: '30%', right: '28%' }}
        animate={{ 
          y: [0, 12, 0],
          rotate: [-8, 8, -8],
          scale: [0.95, 1.08, 0.95]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-12 h-12 opacity-[0.08]"
        style={{ top: '65%', left: '45%' }}
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 6, 0]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Ethereum diamonds - more scattered, floating, pulsing */}
      <motion.div
        className="absolute text-blue-600/25"
        style={{ top: '15%', right: '18%' }}
        animate={{ 
          y: [0, -15, 0], 
          rotate: [0, 10, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <EthereumDiamond className="w-14 h-18 md:w-16 md:h-20" />
      </motion.div>
      <motion.div
        className="absolute text-black/18"
        style={{ top: '40%', left: '15%' }}
        animate={{ 
          y: [0, 12, 0], 
          rotate: [0, -8, 0],
          x: [0, -6, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <EthereumDiamond className="w-12 h-16 md:w-14 md:h-18" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/20"
        style={{ bottom: '12%', right: '15%' }}
        animate={{ 
          y: [0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <EthereumDiamond className="w-10 h-13 md:w-12 md:h-15" />
      </motion.div>
      <motion.div
        className="absolute text-black/12"
        style={{ top: '60%', left: '50%' }}
        animate={{ 
          y: [0, 10, 0], 
          rotate: [0, 8, 0]
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <EthereumDiamond className="w-11 h-14" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/15"
        style={{ top: '22%', left: '40%' }}
        animate={{ 
          y: [0, -8, 0],
          x: [0, 5, 0],
          rotate: [-4, 4, -4]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <EthereumDiamond className="w-9 h-12" />
      </motion.div>
      <motion.div
        className="absolute text-black/10"
        style={{ bottom: '25%', left: '8%' }}
        animate={{ 
          y: [0, 8, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <EthereumDiamond className="w-8 h-11" />
      </motion.div>

      {/* Animated particles flowing along paths - faster, more visible */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-2.5 h-2.5 rounded-full ${i % 2 === 0 ? 'bg-blue-500/40' : 'bg-black/30'}`}
          initial={{ 
            x: -20, 
            y: 160 + (i * 30),
            opacity: 0 
          }}
          animate={{ 
            x: [0, 850],
            y: [160 + (i * 30), 120 + (i * 35), 200 + (i * 20), 170 + (i * 25)],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 4 + i * 0.3,
            delay: i * 0.7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Reverse direction particles - faster */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={`reverse-${i}`}
          className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-black/25' : 'bg-blue-500/35'}`}
          initial={{ 
            x: 850, 
            y: 230 + (i * 35),
            opacity: 0 
          }}
          animate={{ 
            x: [850, -20],
            y: [230 + (i * 35), 260 + (i * 25), 210 + (i * 30), 240 + (i * 20)],
            opacity: [0, 0.9, 0.9, 0]
          }}
          transition={{
            duration: 5 + i * 0.3,
            delay: i * 0.9 + 0.3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Central glowing node - larger, more prominent */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 rounded-full bg-blue-500/25 blur-md" />
        <motion.div
          className="absolute inset-0 w-8 h-8 rounded-full bg-blue-500/40"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default NetworkFlowState;
