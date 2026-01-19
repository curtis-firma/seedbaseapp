import SeedFeedCard from '@/components/cards/SeedFeedCard';
import SeedFeedCardPeek from '@/components/cards/SeedFeedCardPeek';
import SeedFeedCardPeekAlt from '@/components/cards/SeedFeedCardPeekAlt';

const FeedScrollState = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Gradient mask for fade edges */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, #FDDE02 0%, transparent 12%, transparent 88%, #FDDE02 100%)'
        }}
      />
      
      {/* Parallax container with perspective */}
      <div 
        className="flex gap-4 items-start"
        style={{ perspective: '1000px' }}
      >
        {/* Left column - slower scroll */}
        <div 
          className="flex flex-col gap-3 animate-[hero-scroll-slow_25s_linear_infinite]"
          style={{ transform: 'rotateY(-2deg)' }}
        >
          <div className="scale-[0.85] origin-top">
            <SeedFeedCard />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeek />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeekAlt />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCard />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeek />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeekAlt />
          </div>
        </div>
        
        {/* Right column - faster scroll, offset */}
        <div 
          className="flex flex-col gap-3 animate-[hero-scroll-fast_18s_linear_infinite]"
          style={{ transform: 'rotateY(2deg) translateY(-100px)' }}
        >
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeekAlt />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCard />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeek />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeekAlt />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCard />
          </div>
          <div className="scale-[0.85] origin-top">
            <SeedFeedCardPeek />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedScrollState;
