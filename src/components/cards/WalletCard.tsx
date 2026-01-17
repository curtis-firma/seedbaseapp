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
    <div className="w-[300px] bg-white rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Blue circle with $ */}
          <div className="w-11 h-11 rounded-full bg-[#3B82F6] flex items-center justify-center">
            <span className="text-white text-lg font-bold">$</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg leading-tight">Send</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <span>USDC</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Labels Row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <span>Send to</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <span>Total</span>
          <Info className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Recipient Row */}
      <div className="flex items-center gap-3 mb-6">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <span className="text-white text-xs font-medium">👤</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">callie.base.eth</p>
        </div>
        <p className="font-bold text-xl text-gray-900">$10.00</p>
      </div>

      {/* Slide to Send - Gray track with blue button */}
      <div 
        ref={containerRef}
        className={`relative h-[56px] rounded-2xl overflow-hidden transition-all duration-300 ${
          isSent 
            ? 'bg-emerald-500' 
            : 'bg-gray-100'
        }`}
      >
        {/* Slider Button - Blue rounded square with dots */}
        <div
          className={`absolute top-1 left-1 w-12 h-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
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
            <Check className="w-5 h-5 text-emerald-500" />
          ) : (
            /* Two dots icon */
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/60" />
            </div>
          )}
        </div>

        {/* Label */}
        <div className={`absolute inset-0 flex items-center justify-center font-medium pointer-events-none ${
          isSent ? 'text-white' : 'text-gray-900'
        }`}>
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;