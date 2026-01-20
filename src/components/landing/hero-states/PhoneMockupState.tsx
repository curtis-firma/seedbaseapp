import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Mini feed cards for inside the phone
const MiniSeededCard = () => (
  <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
      <span className="text-[8px] font-medium text-gray-900">Sarah M.</span>
      <span className="text-[7px] text-gray-400">2m ago</span>
    </div>
    <p className="text-[8px] text-gray-600 leading-tight">Just seeded $50 to Tanzania Schools 🌱</p>
    <div className="mt-1.5 flex items-center gap-2">
      <span className="text-[7px] text-emerald-600 font-medium">+12 lives impacted</span>
    </div>
  </div>
);

const MiniMilestoneCard = () => (
  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-2 shadow-sm border border-amber-100">
    <div className="flex items-center gap-1.5 mb-1.5">
      <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
        <span className="text-[8px]">🎯</span>
      </div>
      <span className="text-[8px] font-semibold text-amber-800">Milestone Reached!</span>
    </div>
    <p className="text-[8px] text-amber-700 leading-tight">Clean Water Kenya hit 500 wells funded</p>
  </div>
);

const MiniImpactCard = () => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 shadow-sm border border-blue-100">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
      <span className="text-[8px] font-medium text-gray-900">Mission Update</span>
    </div>
    <p className="text-[8px] text-gray-600 leading-tight">Your seed helped 3 families access clean water today</p>
    <div className="mt-1.5 h-1 bg-blue-100 rounded-full overflow-hidden">
      <div className="h-full w-3/4 bg-blue-500 rounded-full" />
    </div>
  </div>
);

const MiniTestimonyCard = () => (
  <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-pink-500" />
      <span className="text-[8px] font-medium text-gray-900">Marcus T.</span>
    </div>
    <p className="text-[8px] text-gray-600 leading-tight italic">"Seeing my seed multiply through others is incredible"</p>
  </div>
);

const MiniVoteCard = () => (
  <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-2 shadow-sm border border-violet-100">
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-[10px]">🗳️</span>
      <span className="text-[8px] font-semibold text-violet-800">Community Vote</span>
    </div>
    <p className="text-[8px] text-violet-700 leading-tight">Should we expand to Guatemala?</p>
    <div className="mt-1.5 flex gap-1">
      <div className="flex-1 h-3 bg-violet-200 rounded text-[6px] flex items-center justify-center text-violet-700">78% Yes</div>
      <div className="flex-1 h-3 bg-gray-200 rounded text-[6px] flex items-center justify-center text-gray-500">22% No</div>
    </div>
  </div>
);

const MiniDistributionCard = () => (
  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-2 shadow-sm border border-emerald-100">
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-[10px]">💚</span>
      <span className="text-[8px] font-semibold text-emerald-800">Distribution</span>
    </div>
    <p className="text-[8px] text-emerald-700 leading-tight">$2,500 deployed to Philippines Relief</p>
  </div>
);

// All mini cards for scrolling
const FEED_CARDS = [
  MiniSeededCard,
  MiniMilestoneCard,
  MiniImpactCard,
  MiniTestimonyCard,
  MiniVoteCard,
  MiniDistributionCard,
];

const PhoneMockupState = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax tilt based on scroll position
  const rotateX = useTransform(scrollY, [0, 500], [5, -5]);
  const rotateY = useTransform(scrollY, [0, 500], [-3, 3]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.02]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center w-full h-full"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="relative"
      >
        {/* Phone Frame */}
        <div className="relative w-[160px] md:w-[200px] lg:w-[240px] h-[320px] md:h-[400px] lg:h-[480px] bg-black rounded-[32px] md:rounded-[40px] lg:rounded-[48px] p-1.5 md:p-2 shadow-2xl">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2 md:top-3 left-1/2 -translate-x-1/2 w-16 md:w-20 lg:w-24 h-4 md:h-5 lg:h-6 bg-black rounded-full z-10" />
          
          {/* Screen */}
          <div className="w-full h-full bg-gray-50 rounded-[26px] md:rounded-[34px] lg:rounded-[42px] overflow-hidden relative">
            {/* Status Bar */}
            <div className="h-6 md:h-7 lg:h-8 bg-white flex items-center justify-between px-4 pt-1">
              <span className="text-[8px] md:text-[9px] font-medium text-gray-900">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1.5 bg-gray-900 rounded-sm" />
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
              </div>
            </div>
            
            {/* Feed Header */}
            <div className="h-8 md:h-10 bg-white border-b border-gray-100 flex items-center px-3">
              <span className="text-[10px] md:text-[11px] font-semibold text-gray-900">Feed</span>
            </div>
            
            {/* Scrolling Feed Content */}
            <div className="absolute inset-x-0 top-14 md:top-[68px] bottom-0 overflow-hidden">
              <motion.div
                className="flex flex-col gap-2 p-2"
                animate={{
                  y: [0, -600],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Render cards twice for seamless loop */}
                {[...FEED_CARDS, ...FEED_CARDS, ...FEED_CARDS].map((Card, index) => (
                  <Card key={index} />
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 w-20 md:w-24 lg:w-28 h-1 bg-white/30 rounded-full" />
        </div>
        
        {/* Reflection/Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-black/20 blur-xl rounded-full" />
      </motion.div>
    </div>
  );
};

export default PhoneMockupState;
