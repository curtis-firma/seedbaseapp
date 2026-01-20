import { useMemo } from 'react';
import { motion } from 'framer-motion';
import cikMeme from '@/assets/products/cik-meme-hoodie.png';

const MatrixMemeState = () => {
  // Generate columns with stable random values using useMemo
  const columns = useMemo(() => 
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (i / 28) * 100,
      delay: (i * 0.15) % 2.5, // Staggered but deterministic
      duration: 4 + (i % 4), // 4-7s fall time
      size: 28 + (i % 5) * 6, // 28-52px size variation
      opacity: 0.5 + (i % 3) * 0.15, // Vary opacity for depth
    })),
  []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Matrix rain of memes */}
      {columns.map((col) => (
        <motion.div
          key={col.id}
          className="absolute"
          style={{ left: `${col.x}%` }}
          initial={{ y: '-15%', opacity: 0 }}
          animate={{ 
            y: ['0%', '115%'],
            opacity: [0, col.opacity, col.opacity, 0]
          }}
          transition={{
            duration: col.duration,
            delay: col.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <img 
            src={cikMeme} 
            alt="" 
            style={{ width: col.size, height: col.size }}
            className="object-contain drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]"
          />
        </motion.div>
      ))}
      
      {/* CRT scanline overlay for retro effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)'
        }}
      />
      
      {/* Subtle green glow overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-green-500/5 via-transparent to-green-500/10" />
      
      {/* Center text */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <span 
          className="text-green-400 font-mono text-lg md:text-2xl lg:text-3xl tracking-[0.3em] font-bold"
          style={{
            textShadow: '0 0 20px rgba(74, 222, 128, 0.8), 0 0 40px rgba(74, 222, 128, 0.4)'
          }}
        >
          CHRIST IS KING
        </span>
      </motion.div>
    </div>
  );
};

export default MatrixMemeState;
