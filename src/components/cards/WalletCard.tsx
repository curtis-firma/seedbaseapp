import { ChevronRight, ChevronDown, Info, Check } from "lucide-react";
import { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import whiteRing from "@/assets/white-ring.png";

const currencies = [
  { symbol: "USDC", name: "USD Coin", icon: "$" },
  { symbol: "CIK", name: "CIK Token", icon: "◈" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
];

const WalletCard = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSent) return;
    setIsDragging(true);
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current || isSent) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPosition = Math.max(0, Math.min(clientX - containerRect.left - 24, containerRect.width - 52));
    setSliderPosition(newPosition);
  };

  const handleDragEnd = () => {
    if (!containerRef.current || isSent) return;
    setIsDragging(false);
    
    const containerWidth = containerRef.current.offsetWidth - 52;
    if (sliderPosition > containerWidth * 0.7) {
      setSliderPosition(containerWidth);
      setIsSent(true);
    } else {
      setSliderPosition(0);
    }
  };

  const resetSlider = () => {
    setIsSent(false);
    setSliderPosition(0);
  };

  return (
    <div className="bg-white rounded-3xl p-4 w-[320px] h-[320px] shadow-xl flex flex-col">
      {/* Send Header with Currency Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-200 transition-colors">
            <div className="flex items-center gap-3">
              {/* Currency Icon */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="text-primary text-lg font-bold">{selectedCurrency.icon}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded" />
              </div>
              <div>
                <div className="font-heading font-bold text-base text-foreground">Send</div>
                <div className="text-muted-foreground text-sm flex items-center gap-1">
                  {selectedCurrency.symbol}
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border border-border shadow-lg z-50">
          {currencies.map((currency) => (
            <DropdownMenuItem
              key={currency.symbol}
              onClick={() => setSelectedCurrency(currency)}
              className="flex items-center gap-3 cursor-pointer py-2"
            >
              <div className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center">
                <span className="text-primary font-bold">{currency.icon}</span>
              </div>
              <div>
                <div className="font-medium text-foreground text-sm">{currency.symbol}</div>
                <div className="text-xs text-muted-foreground">{currency.name}</div>
              </div>
              {selectedCurrency.symbol === currency.symbol && (
                <Check className="w-4 h-4 text-primary ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Send To Section */}
      <div className="mb-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            Send to <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            Total <Info className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=callie" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-medium text-foreground text-sm">callie.base.eth</span>
          </div>
          <span className="font-bold text-xl text-foreground">$10.00</span>
        </div>
      </div>
      
      {/* Slide to Send Button */}
      <div 
        ref={containerRef}
        className={`relative rounded-xl p-1.5 flex items-center overflow-hidden transition-colors duration-300 ${
          isSent ? 'bg-emerald-100' : 'bg-slate-100'
        }`}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDrag}
        onTouchEnd={handleDragEnd}
      >
        {/* Success background fill */}
        <div 
          className="absolute inset-0 bg-emerald-400 transition-all duration-300 ease-out"
          style={{ 
            width: isSent ? '100%' : `${sliderPosition + 48}px`,
            opacity: isSent ? 1 : 0.3
          }}
        />
        
        {/* Slider button */}
        <div
          ref={sliderRef}
          className={`relative z-10 w-12 h-12 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isSent ? 'bg-emerald-500' : 'bg-primary'
          } ${isDragging ? 'scale-110' : ''} ${!isSent && !isDragging && sliderPosition === 0 ? 'animate-slide-hint' : ''}`}
          style={{ 
            transform: `translateX(${sliderPosition}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            animation: isDragging || sliderPosition > 0 || isSent ? 'none' : undefined
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={isSent ? resetSlider : undefined}
        >
          {isSent ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <img src={whiteRing} alt="" className="w-5 h-5 animate-pulse-ring" />
          )}
        </div>
        
        {/* Text label */}
        <span 
          className={`flex-1 text-center font-medium text-sm relative z-10 transition-all duration-300 ${
            isSent ? 'text-emerald-700' : 'text-foreground'
          }`}
          style={{ opacity: isSent || sliderPosition < 50 ? 1 : 1 - (sliderPosition / 150) }}
        >
          {isSent ? 'Sent!' : 'Slide to Send'}
        </span>
      </div>
    </div>
  );
};

export default WalletCard;
