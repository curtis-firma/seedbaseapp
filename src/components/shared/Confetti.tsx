import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

export function Confetti({ isActive, duration = 2000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles using semantic colors
      const colors = [
        'hsl(var(--seed))',
        'hsl(var(--base))',
        'hsl(var(--trust))',
        'hsl(var(--envoy))',
        'hsl(var(--primary))',
      ];
      
      const newParticles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timeout);
    }
  }, [isActive, duration]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ 
                y: -20, 
                x: `${particle.x}vw`, 
                opacity: 1, 
                rotate: particle.rotation,
                scale: 0
              }}
              animate={{ 
                y: '100vh', 
                rotate: particle.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
                opacity: [1, 1, 0],
                scale: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2 + Math.random(), 
                delay: particle.delay,
                ease: 'easeOut'
              }}
              className="absolute rounded-sm"
              style={{ 
                backgroundColor: particle.color,
                width: particle.size,
                height: particle.size,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
