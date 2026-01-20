import { useMemo } from 'react';
import { motion } from 'framer-motion';
import cikMemeFront from '@/assets/products/cik-meme-hoodie.png';
import cikMemeBack from '@/assets/products/og-cik-meme-hoodie-back.jpg';

type MemeDrop = {
  id: number;
  leftPct: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotate: number;
  opacity: number;
  src: string;
};

const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const MatrixMemeState = () => {
  // Randomized (but deterministic) meme rain: CIK + OG meme photos
  const drops = useMemo<MemeDrop[]>(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const r = mulberry32(9000 + i * 97);
      const leftPct = r() * 100;
      const size = 34 + r() * 58; // 34-92px
      const delay = r() * 2.2;
      const duration = 4.8 + r() * 4.2; // 4.8-9s
      const drift = (r() - 0.5) * 80; // px
      const rotate = (r() - 0.5) * 26; // deg
      const opacity = 0.45 + r() * 0.4;
      const src = i % 2 === 0 ? cikMemeFront : cikMemeBack;

      return {
        id: i,
        leftPct,
        size,
        delay,
        duration,
        drift,
        rotate,
        opacity,
        src,
      };
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-foreground">
      {/* Subtle vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background/0 via-background/0 to-background/10" />

      {drops.map((d) => (
        <motion.div
          key={d.id}
          className="absolute top-0"
          style={{ left: `${d.leftPct}%` }}
          initial={{ y: '-25%', x: 0, rotate: d.rotate, opacity: 0 }}
          animate={{
            y: ['-20%', '120%'],
            x: [0, d.drift],
            opacity: [0, d.opacity, d.opacity, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: 'linear',
          }}
        >
          <img
            src={d.src}
            alt=""
            className="object-contain rounded-md will-change-transform"
            style={{
              width: d.size,
              height: d.size,
              boxShadow: '0 10px 30px hsl(var(--background) / 0.08)',
            }}
            loading="eager"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MatrixMemeState;

