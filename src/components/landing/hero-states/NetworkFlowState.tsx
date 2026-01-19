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

      {/* Base logos - floating subtly */}
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-16 h-16 opacity-[0.08]"
        style={{ top: '15%', left: '20%' }}
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-12 h-12 opacity-[0.06]"
        style={{ top: '60%', right: '15%' }}
        animate={{ y: [0, 6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.img
        src={baseLogo}
        alt=""
        className="absolute w-10 h-10 opacity-[0.05]"
        style={{ bottom: '25%', left: '10%' }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Ethereum diamonds - scattered and floating */}
      <motion.div
        className="absolute text-black/[0.07]"
        style={{ top: '20%', right: '25%' }}
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <EthereumDiamond className="w-10 h-14" />
      </motion.div>
      <motion.div
        className="absolute text-black/[0.05]"
        style={{ top: '50%', left: '30%' }}
        animate={{ y: [0, 8, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <EthereumDiamond className="w-8 h-11" />
      </motion.div>
      <motion.div
        className="absolute text-black/[0.06]"
        style={{ bottom: '20%', right: '20%' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <EthereumDiamond className="w-6 h-8" />
      </motion.div>
      <motion.div
        className="absolute text-black/[0.04]"
        style={{ top: '70%', left: '60%' }}
        animate={{ y: [0, 5, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <EthereumDiamond className="w-7 h-10" />
      </motion.div>

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
