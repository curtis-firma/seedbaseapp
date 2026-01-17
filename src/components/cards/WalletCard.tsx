import { useState, useRef, useEffect } from "react";
import { DollarSign, ChevronDown, Check, ArrowRight } from "lucide-react";

const WalletCard = () => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSent) return;
    setIsDragging(true);
    
    const handleDrag = (moveEvent: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
      const newPosition = Math.max(0, Math.min(clientX - containerRect.left - 24, containerRect.width - 52));
      setSliderPosition(newPosition);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth - 52;
      if (sliderPosition > containerWidth * 0.7) {
        setSliderPosition(containerWidth);
        setIsSent(true);
      } else {
        setSliderPosition(0);
      }
      
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', handleDragEnd);
  };

  const resetSlider = () => {
    setIsSent(false);
    setSliderPosition(0);
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
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">Send</span>
        <div className="flex items-center gap-1 ml-auto bg-gray-100 rounded-full px-3 py-1.5 cursor-pointer hover:bg-gray-200 transition-colors">
          <span className="text-sm font-medium text-primary">USDC</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </div>
      </div>

      {/* Recipient */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
          C
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">Send to</p>
          <p className="font-semibold text-gray-900">callie.base.eth</p>
        </div>
        <p className="font-bold text-xl text-gray-900">$10.00</p>
      </div>

      {/* Slide to Send */}
      <div 
        ref={containerRef}
        className={`relative h-14 rounded-xl overflow-hidden transition-all duration-300 ${
          isSent 
            ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
            : 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        }`}
      >
        {/* Animated glow effect on track */}
        {!isSent && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
        
        {/* Slider Button */}
        <div
          className={`absolute top-1 left-1 w-12 h-12 rounded-lg bg-white shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
            isDragging ? 'scale-95' : ''
          } ${!isSent ? 'animate-icon-wiggle' : ''}`}
          style={{ 
            transform: `translateX(${sliderPosition}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={isSent ? resetSlider : undefined}
        >
          {isSent ? (
            <Check className="w-5 h-5 text-emerald-500" />
          ) : (
            <ArrowRight className="w-5 h-5 text-primary" />
          )}
        </div>

        {/* Label */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-semibold pointer-events-none">
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
