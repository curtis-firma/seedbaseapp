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
    <div className="w-full h-full bg-white p-6 flex flex-col rounded-2xl justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Outlined circle with $ and overlapping wallet icon */}
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center bg-white">
              <span className="text-primary text-xl font-bold">$</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xl leading-tight">Send</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>USDC</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Labels Row */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <span>Send to</span>
          <ChevronRight className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <span>Total</span>
          <Info className="w-4 h-4" />
        </div>
      </div>

      {/* Recipient Row */}
      <div className="flex items-center gap-4 flex-1 min-h-0">
        {/* DiceBear Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=callie&backgroundColor=ffdfbf"
            alt="callie"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-lg truncate">callie.base.eth</p>
        </div>
        <p className="font-bold text-2xl text-gray-900 flex-shrink-0">$10.00</p>
      </div>

      {/* Slide to Send - with spring physics */}
      <div 
        ref={containerRef}
        className={`relative h-16 rounded-xl overflow-hidden transition-colors duration-300 ${
          isSent 
            ? 'bg-emerald-500' 
            : 'bg-gray-100'
        }`}
      >
        {/* Gradient overlay on left side */}
        {!isSent && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cyan-100/50 to-transparent rounded-l-xl pointer-events-none" />
        )}

        {/* Slider Button with Seedbase Ring */}
        <motion.div
          className={`absolute top-1.5 left-1.5 w-11 h-11 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
            isSent ? 'bg-white' : 'bg-primary'
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
            <Check className="w-5 h-5 text-emerald-500" />
          ) : (
            <img src={seeddropIconLight} alt="" className="w-6 h-6 object-contain" />
          )}
        </motion.div>

        {/* Label */}
        <div className={`absolute inset-0 flex items-center justify-center font-medium text-base pointer-events-none ${
          isSent ? 'text-white' : 'text-gray-900'
        }`}>
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
