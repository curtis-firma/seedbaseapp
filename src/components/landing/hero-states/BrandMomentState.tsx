import { motion } from 'framer-motion';
import seedbasePfp from '@/assets/seedbase-pfp-new.png';
import seedBlue from '@/assets/seedbase-seed-blue.svg';

// Ethereum diamond SVG component (faded)
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

// Spinning orbital ring component
const OrbitalRing = ({ 
  radius, 
  duration, 
  reverse = false,
  dashArray = "8 12",
  opacity = 0.15
}: { 
  radius: number; 
  duration: number; 
  reverse?: boolean;
  dashArray?: string;
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
    <svg className="w-full h-full" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
      <circle
        cx={radius}
        cy={radius}
        r={radius - 2}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray={dashArray}
        className="text-black"
        style={{ opacity }}
      />
    </svg>
    {/* Nodes on the ring */}
    {[0, 90, 180, 270].map((angle) => (
      <motion.div
        key={angle}
        className="absolute w-2 h-2 rounded-full bg-blue-500/30"
        style={{
          left: radius + (radius - 2) * Math.cos((angle * Math.PI) / 180) - 4,
          top: radius + (radius - 2) * Math.sin((angle * Math.PI) / 180) - 4,
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: angle / 180 }}
      />
    ))}
  </motion.div>
);

// Growing squares bar chart component - builds UP from bottom
const GrowingSquares = () => {
  const bars = [
    { height: 3, delay: 0.8 },
    { height: 5, delay: 0.9 },
    { height: 4, delay: 1.0 },
    { height: 7, delay: 1.1 },
    { height: 6, delay: 1.2 },
    { height: 8, delay: 1.3 },
    { height: 5, delay: 1.4 },
    { height: 9, delay: 1.5 },
    { height: 7, delay: 1.6 },
    { height: 6, delay: 1.7 },
    { height: 10, delay: 1.8 },
    { height: 8, delay: 1.9 },
    { height: 7, delay: 2.0 },
    { height: 11, delay: 2.1 },
    { height: 9, delay: 2.2 },
    { height: 8, delay: 2.3 },
    { height: 12, delay: 2.4 },
    { height: 10, delay: 2.5 },
    { height: 9, delay: 2.6 },
    { height: 11, delay: 2.7 },
    { height: 13, delay: 2.8 },
    { height: 10, delay: 2.9 },
    { height: 12, delay: 3.0 },
    { height: 11, delay: 3.1 },
    { height: 14, delay: 3.2 },
  ];

  return (
    <div className="flex items-end justify-between w-full px-4 md:px-8">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className="flex flex-col-reverse gap-0.5 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: bar.delay * 0.4, duration: 0.3 }}
        >
          {Array.from({ length: bar.height }).map((_, squareIndex) => (
            <motion.img
              key={squareIndex}
              src={seedBlue}
              alt=""
              className="w-3 h-3 md:w-4 md:h-4"
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: bar.delay * 0.4 + squareIndex * 0.08,
                duration: 0.25,
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
      {/* "Generosity that grows" at the TOP */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-8 md:top-12 text-black/70 font-semibold text-xl md:text-2xl tracking-wide z-20"
      >
        Generosity that grows
      </motion.p>

      {/* Faded Ethereum diamonds orbiting in the background */}
      <motion.div
        className="absolute text-black/8"
        style={{ top: '15%', left: '10%' }}
        animate={{ 
          y: [0, -10, 0], 
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <EthereumDiamond className="w-10 h-14 md:w-12 md:h-16" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/10"
        style={{ top: '20%', right: '12%' }}
        animate={{ 
          y: [0, 8, 0], 
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <EthereumDiamond className="w-8 h-11 md:w-10 md:h-14" />
      </motion.div>
      <motion.div
        className="absolute text-black/6"
        style={{ bottom: '35%', left: '8%' }}
        animate={{ 
          y: [0, -6, 0],
          x: [0, 4, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <EthereumDiamond className="w-7 h-10 md:w-9 md:h-12" />
      </motion.div>
      <motion.div
        className="absolute text-blue-600/8"
        style={{ bottom: '40%', right: '10%' }}
        animate={{ 
          y: [0, 10, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <EthereumDiamond className="w-6 h-9 md:w-8 md:h-11" />
      </motion.div>

      {/* Spinning orbital rings */}
      <OrbitalRing radius={100} duration={20} dashArray="6 10" opacity={0.12} />
      <OrbitalRing radius={140} duration={25} reverse dashArray="10 8" opacity={0.1} />
      <OrbitalRing radius={180} duration={30} dashArray="4 12" opacity={0.08} />

      {/* Grid dots pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full">
          <pattern id="hero-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-dots)" />
        </svg>
      </div>
      
      {/* Seedbase circular logo with glow - CENTER */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.05, 1],
          opacity: 1
        }}
        transition={{ 
          scale: { duration: 1.5, times: [0, 0.6, 1], ease: "easeOut" },
          opacity: { duration: 0.8 }
        }}
        className="relative z-10"
      >
        <motion.img 
          src={seedbasePfp} 
          alt=""
          className="w-32 h-32 md:w-40 md:h-40 rounded-full"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          style={{
            filter: 'drop-shadow(0 0 40px rgba(0, 0, 255, 0.25))'
          }}
        />
      </motion.div>

      {/* Growing squares bar chart at bottom - builds UP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-4 left-0 right-0 w-full"
      >
        <GrowingSquares />
      </motion.div>
    </div>
  );
};

export default BrandMomentState;
