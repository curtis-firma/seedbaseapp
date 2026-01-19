import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp.png';

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

// Spinning ring with Ethereum diamonds
const OrbitalRing = ({ 
  radius, 
  duration, 
  reverse = false, 
  diamondCount = 4,
  opacity = 0.2 
}: { 
  radius: number; 
  duration: number; 
  reverse?: boolean;
  diamondCount?: number;
  opacity?: number;
}) => (
  <motion.div
    className="absolute left-1/2 top-1/2"
    style={{ 
      width: radius * 2, 
      height: radius * 2,
      marginLeft: -radius,
      marginTop: -radius,
    }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
  >
    {/* Ring circle */}
    <div 
      className="absolute inset-0 rounded-full border border-black/10"
      style={{ opacity }}
    />
    
    {/* Ethereum diamonds on the ring */}
    {Array.from({ length: diamondCount }).map((_, i) => {
      const angle = (i / diamondCount) * 360;
      const radian = (angle * Math.PI) / 180;
      const x = Math.cos(radian) * radius;
      const y = Math.sin(radian) * radius;
      
      return (
        <motion.div
          key={i}
          className="absolute text-blue-600"
          style={{
            left: '50%',
            top: '50%',
            x: x - 8,
            y: y - 10,
            opacity: 0.25 + (i * 0.1),
          }}
          animate={{ rotate: reverse ? 360 : -360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <EthereumDiamond className="w-4 h-5 md:w-5 md:h-6" />
        </motion.div>
      );
    })}
  </motion.div>
);

const NetworkFlowState = () => {
  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
      {/* "Generosity onchain" text at top */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 text-black/60 font-medium text-base md:text-lg lg:text-xl tracking-wide z-20"
      >
        Generosity onchain
      </motion.p>

      {/* Concentric spinning orbital rings */}
      <OrbitalRing radius={60} duration={12} diamondCount={3} opacity={0.15} />
      <OrbitalRing radius={95} duration={18} reverse diamondCount={4} opacity={0.12} />
      <OrbitalRing radius={130} duration={24} diamondCount={5} opacity={0.1} />
      <OrbitalRing radius={165} duration={30} reverse diamondCount={6} opacity={0.08} />

      {/* Central Seedbase logo */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Glow effect behind logo */}
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
          style={{ width: 80, height: 80, marginLeft: -40, marginTop: -40 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Central logo */}
        <motion.img
          src={seedbasePfp}
          alt="Seedbase"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-2 ring-white/50 shadow-lg"
          animate={{ 
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Subtle floating Ethereum diamonds in corners */}
      <motion.div
        className="absolute text-blue-600/15"
        style={{ top: '15%', right: '12%' }}
        animate={{ y: [0, -8, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <EthereumDiamond className="w-8 h-10 md:w-10 md:h-12" />
      </motion.div>
      
      <motion.div
        className="absolute text-black/10"
        style={{ bottom: '18%', left: '10%' }}
        animate={{ y: [0, 6, 0], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <EthereumDiamond className="w-6 h-8 md:w-8 md:h-10" />
      </motion.div>
      
      <motion.div
        className="absolute text-blue-600/12"
        style={{ bottom: '12%', right: '15%' }}
        animate={{ y: [0, -5, 0], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <EthereumDiamond className="w-5 h-7" />
      </motion.div>

      <motion.div
        className="absolute text-black/8"
        style={{ top: '20%', left: '15%' }}
        animate={{ y: [0, 5, 0], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <EthereumDiamond className="w-6 h-8" />
      </motion.div>
    </div>
  );
};

export default NetworkFlowState;
