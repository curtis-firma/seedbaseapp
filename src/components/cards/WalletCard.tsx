import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ChevronRight, ChevronDown, Check, Info, Wallet } from "lucide-react";
import { seeddropIconLight } from "@/components/shared/Logo";

const WalletCard = () => {
  const [isSent, setIsSent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Spring physics for smooth dragging
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 30, mass: 0.8 });
  
  // Calculate max drag distance
  const getMaxDrag = () => {
    if (!containerRef.current) return 200;
    return containerRef.current.offsetWidth - 52; // container width - button width - padding
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleDragStart = () => {
    if (isSent) return;
    setIsDragging(true);
    triggerHaptic(10);
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isSent) return;
    const maxDrag = getMaxDrag();
    const newX = Math.max(0, Math.min(info.offset.x, maxDrag));
    x.set(newX);
    
    // Haptic at 70% threshold
    if (newX > maxDrag * 0.7 && !isSent) {
      triggerHaptic(20);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const maxDrag = getMaxDrag();
    
    if (x.get() > maxDrag * 0.7) {
      // Success!
      x.set(maxDrag);
      setIsSent(true);
      triggerHaptic([30, 50, 30]);
    } else {
      // Snap back
      x.set(0);
    }
  };

  const resetSlider = () => {
    setIsSent(false);
    x.set(0);
  };

  // Auto-reset after sent
  useEffect(() => {
    if (isSent) {
      const timer = setTimeout(() => {
        resetSlider();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSent]);

  return (
    <div className="w-full h-full bg-white p-5 flex flex-col rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Outlined circle with $ and overlapping wallet icon */}
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-full border-2 border-[#3B82F6] flex items-center justify-center bg-white">
              <span className="text-[#3B82F6] text-base font-bold">$</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#3B82F6] rounded-md flex items-center justify-center">
              <Wallet className="w-3 h-3 text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-base leading-tight">Send</p>
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <span>USDC</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {/* Labels Row */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <span>Send to</span>
          <ChevronRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <span>Total</span>
          <Info className="w-3 h-3" />
        </div>
      </div>

      {/* Recipient Row */}
      <div className="flex items-center gap-3 mb-auto">
        {/* DiceBear Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=callie&backgroundColor=ffdfbf"
            alt="callie"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">callie.base.eth</p>
        </div>
        <p className="font-bold text-lg text-gray-900">$10.00</p>
      </div>

      {/* Slide to Send - with spring physics */}
      <div 
        ref={containerRef}
        className={`relative h-12 rounded-xl overflow-hidden transition-colors duration-300 mt-4 ${
          isSent 
            ? 'bg-emerald-500' 
            : 'bg-gray-100'
        }`}
      >
        {/* Gradient overlay on left side */}
        {!isSent && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-cyan-100/50 to-transparent rounded-l-xl pointer-events-none" />
        )}

        {/* Slider Button with Seedbase Ring */}
        <motion.div
          className={`absolute top-1 left-1 w-10 h-10 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
            isSent ? 'bg-white' : 'bg-[#3B82F6]'
          } ${!isDragging && !isSent ? 'animate-icon-wiggle hover:animate-none hover:scale-110' : ''}`}
          style={{ x: springX }}
          drag={!isSent ? "x" : false}
          dragConstraints={{ left: 0, right: getMaxDrag() }}
          dragElastic={0}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onClick={isSent ? resetSlider : undefined}
          whileHover={!isSent && !isDragging ? { scale: 1.05 } : {}}
          whileTap={!isSent ? { scale: 0.95 } : {}}
        >
          {isSent ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <img src={seeddropIconLight} alt="" className="w-5 h-5 object-contain" />
          )}
        </motion.div>

        {/* Label */}
        <div className={`absolute inset-0 flex items-center justify-center font-medium text-sm pointer-events-none ${
          isSent ? 'text-white' : 'text-gray-900'
        }`}>
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
