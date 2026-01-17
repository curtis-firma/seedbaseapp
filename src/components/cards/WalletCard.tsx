import { useState, useRef } from "react";
import { DollarSign, ChevronRight, Info, Check, ArrowRight } from "lucide-react";

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

  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">Send</span>
        <span className="text-primary font-medium">USD</span>
      </div>

      {/* Send To */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
        <div>
          <p className="text-xs text-gray-500">Send to</p>
          <p className="font-medium text-gray-900">callie.base.eth</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </div>

      {/* Amount */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">Total</span>
          <Info className="w-3 h-3 text-gray-400" />
        </div>
        <p className="font-bold text-xl text-gray-900">$10.00</p>
      </div>

      {/* Slide to Send */}
      <div 
        ref={containerRef}
        className={`relative h-14 rounded-xl overflow-hidden transition-colors ${
          isSent ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-primary/80'
        }`}
      >
        {/* Slider Button */}
        <div
          className={`absolute top-1 left-1 w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing transition-all ${
            isDragging ? 'scale-95' : ''
          }`}
          style={{ 
            transform: `translateX(${sliderPosition}px)`,
            transition: sliderPosition > 0 && isSent ? 'none' : undefined
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
        <div className="absolute inset-0 flex items-center justify-center text-white font-medium pointer-events-none">
          {isSent ? 'Sent!' : 'Slide to Send'}
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
