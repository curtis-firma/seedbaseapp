import { useState, useRef, useEffect } from "react";
import { motion, useSpring, useMotionValue, PanInfo } from "framer-motion";
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
    return containerRef.current.offsetWidth - 52;
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
    
    if (newX > maxDrag * 0.7 && !isSent) {
      triggerHaptic(20);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const maxDrag = getMaxDrag();
    
    if (x.get() > maxDrag * 0.7) {
      x.set(maxDrag);
      setIsSent(true);
      triggerHaptic([30, 50, 30]);
    } else {
      x.set(0);
    }
  };

  const resetSlider = () => {
    setIsSent(false);
    x.set(0);
  };

  useEffect(() => {
    if (isSent) {
      const timer = setTimeout(() => {
        resetSlider();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSent]);

  return (
    <div className="w-full h-full bg-white p-4 sm:p-5 flex flex-col rounded-2xl shadow-lg justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary flex items-center justify-center bg-white">
              <span className="text-primary text-lg sm:text-xl font-bold">$</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg sm:text-xl leading-tight">Send</p>
            <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
              <span>USDC</span>
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Labels Row */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
          <span>Send to</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
          <span>Total</span>
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Recipient Row */}
      <div className="flex items-center gap-3 flex-1 min-h-0">
        <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=callie&backgroundColor=ffdfbf"
            alt="callie"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 text-sm sm:text-lg truncate">callie.base.eth</p>
        </div>
        <p className="font-bold text-xl sm:text-2xl text-gray-900 flex-shrink-0">$10.00</p>
      </div>

      {/* Slide to Send */}
      <div 
        ref={containerRef}
        className={`relative h-14 sm:h-16 rounded-xl overflow-hidden transition-colors duration-300 mt-3 ${
          isSent ? 'bg-emerald-500' : 'bg-gray-100'
        }`}
      >
        {!isSent && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-cyan-100/50 to-transparent rounded-l-xl pointer-events-none" />
        )}

        <motion.div
          className={`absolute top-1.5 left-1.5 w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
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
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
          ) : (
            <img src={seeddropIconLight} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          )}
        </motion.div>

        <div className={`absolute inset-0 flex items-center justify-center font-medium text-sm sm:text-base pointer-events-none ${
          isSent ? 'text-white' : 'text-gray-900'
        }`}>
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
