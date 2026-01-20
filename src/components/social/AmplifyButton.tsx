import { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';
import { triggerHaptic } from '@/hooks/useHaptic';
import { AmplifyModal } from './AmplifyModal';

interface AmplifyButtonProps {
  content: string;
  impactSummary?: string;
  variant?: 'default' | 'small' | 'inline';
  className?: string;
}

export function AmplifyButton({
  content,
  impactSummary,
  variant = 'default',
  className = '',
}: AmplifyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  
  const handleClick = () => {
    triggerHaptic('light');
    setShowModal(true);
  };
  
  const variants = {
    default: 'flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0000ff] text-white rounded-xl font-medium text-sm hover:bg-[#0000dd] shadow-[0_0_16px_rgba(0,0,255,0.3)] hover:shadow-[0_0_24px_rgba(0,0,255,0.5)] transition-all',
    small: 'flex items-center gap-1.5 px-3 py-1.5 bg-[#0000ff] text-white rounded-lg text-xs font-medium hover:bg-[#0000dd] shadow-[0_0_12px_rgba(0,0,255,0.25)] hover:shadow-[0_0_20px_rgba(0,0,255,0.4)] transition-all',
    inline: 'flex items-center gap-1 text-white dark:text-[#0000ff] text-sm font-medium hover:text-white/80 dark:hover:text-[#0000dd] transition-colors',
  };
  
  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`${variants[variant]} ${className}`}
      >
        <Megaphone className={variant === 'small' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        <span>Amplify</span>
      </motion.button>
      
      <AmplifyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        content={content}
        impactSummary={impactSummary}
      />
    </>
  );
}

export default AmplifyButton;
