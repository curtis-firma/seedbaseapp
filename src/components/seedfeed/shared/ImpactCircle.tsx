import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ImpactCircleProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-10 h-10 text-xs',
  md: 'w-14 h-14 text-sm',
  lg: 'w-20 h-20 text-base',
};

export function ImpactCircle({ amount, size = 'md', className = '' }: ImpactCircleProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, amount, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplayValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [amount, count]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={`
        ${sizeStyles[size]}
        rounded-full bg-gradient-to-br from-primary to-base
        flex items-center justify-center
        text-white font-bold shadow-lg
        ${className}
      `}
    >
      <span className="drop-shadow-sm">${displayValue.toLocaleString()}</span>
    </motion.div>
  );
}

export default ImpactCircle;
