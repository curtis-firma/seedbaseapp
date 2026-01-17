import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Check, Info } from "lucide-react";

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
      const newPosition = Math.max(0, Math.min(clientX - containerRect.left - 28, containerRect.width - 60));
      setSliderPosition(newPosition);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth - 60;
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
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Blue circle with $ */}
          <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <span className="text-white text-base font-bold">$</span>
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
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden">
          <span className="text-white text-xs">👤</span>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">callie.base.eth</p>
        </div>
        <p className="font-bold text-lg text-gray-900">$10.00</p>
      </div>

      {/* Slide to Send - Gray track with blue button */}
      <div 
        ref={containerRef}
        className={`relative h-12 rounded-xl overflow-hidden transition-all duration-300 mt-4 ${
          isSent 
            ? 'bg-emerald-500' 
            : 'bg-gray-100'
        }`}
      >
        {/* Slider Button - Blue rounded square with dots */}
        <div
          className={`absolute top-1 left-1 w-10 h-10 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
            isSent ? 'bg-white' : 'bg-[#3B82F6]'
          } ${isDragging ? 'scale-95' : ''}`}
          style={{ 
            transform: `translateX(${sliderPosition}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={isSent ? resetSlider : undefined}
        >
          {isSent ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            /* Two dots icon */
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
          )}
        </div>

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
