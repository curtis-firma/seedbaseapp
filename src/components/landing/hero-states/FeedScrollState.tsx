import { motion } from 'framer-motion';
import { Heart, TrendingUp, Users, Vote, PartyPopper, Zap, Gift, Sparkles, BookOpen, Droplets } from 'lucide-react';

// Unique avatar images - no duplicates
const AVATARS = {
  sarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  marcus: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  elena: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  david: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  maya: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  james: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
};

// Unique mission photos - no duplicates
const MISSION_PHOTOS = {
  tanzania: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
  water: "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=400",
  school: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400",
  farming: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400",
};

// 12 unique compact card variants
const SeededCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8 hover:shadow-2xl transition-shadow duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
        <Gift className="w-4 h-4 text-white" />
      </div>
      <span className="text-xs text-muted-foreground">New Seed</span>
    </div>
    <p className="text-sm font-medium">
      <span className="text-orange-500 font-bold">$5,000</span> seeded to Tanzania Schools
    </p>
    <div className="mt-2 text-xs text-emerald-600 font-medium">✓ SEEDED</div>
  </div>
);

const SurplusCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8 border-l-4 border-emerald-500">
    <div className="flex items-center gap-2 mb-2">
      <Zap className="w-5 h-5 text-emerald-500" />
      <span className="text-xs font-medium text-emerald-600">Surplus Deployed</span>
    </div>
    <p className="text-lg font-bold text-foreground">$1,200</p>
    <p className="text-xs text-muted-foreground">Auto-distributed to 3 missions</p>
  </div>
);

const MilestoneCard = () => (
  <div className="w-[260px] bg-gradient-to-br from-yellow-50 to-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-2 mb-2">
      <PartyPopper className="w-5 h-5 text-yellow-500" />
      <span className="text-xs font-bold text-yellow-600">MILESTONE!</span>
    </div>
    <p className="text-sm font-semibold">Goal reached: 100% funded</p>
    <div className="mt-2 h-2 bg-yellow-200 rounded-full overflow-hidden">
      <div className="h-full w-full bg-yellow-500 rounded-full" />
    </div>
  </div>
);

const JoinedCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-3">
      <img 
        src={AVATARS.sarah}
        alt="" 
        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary"
      />
      <div>
        <p className="text-sm font-medium">Sarah Kim joined</p>
        <p className="text-xs text-muted-foreground">Welcome to the network! 🎉</p>
      </div>
    </div>
  </div>
);

const ImpactCard = () => (
  <div className="w-[260px] bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-2 mb-2">
      <Heart className="w-4 h-4 text-rose-500" />
      <span className="text-xs text-muted-foreground">Your Impact</span>
    </div>
    <p className="text-sm">
      Your <span className="font-bold text-primary">$7</span> seed helped
    </p>
    <p className="text-lg font-bold text-foreground">3 students 📚</p>
  </div>
);

const VoteCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-2 mb-2">
      <Vote className="w-4 h-4 text-purple-500" />
      <span className="text-xs font-medium text-purple-600">Governance</span>
    </div>
    <p className="text-sm font-medium">Community voted</p>
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full w-[89%] bg-purple-500 rounded-full" />
      </div>
      <span className="text-xs font-bold text-purple-600">89%</span>
    </div>
  </div>
);

const ThankYouCard = () => (
  <div className="w-[260px] bg-white rounded-xl overflow-hidden shadow-xl shadow-black/8">
    <img 
      src={MISSION_PHOTOS.tanzania}
      alt="" 
      className="w-full h-24 object-cover"
    />
    <div className="p-3">
      <p className="text-sm font-medium">"Thank you from Tanzania! 🙏"</p>
      <p className="text-xs text-muted-foreground mt-1">From the students you helped</p>
    </div>
  </div>
);

const GrowthCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-500" />
        <span className="text-xs text-muted-foreground">Weekly Growth</span>
      </div>
      <Sparkles className="w-4 h-4 text-yellow-400" />
    </div>
    <p className="text-xl font-bold text-emerald-600">+12%</p>
    <p className="text-xs text-muted-foreground">Seed growth this week</p>
  </div>
);

const TestimonyCard = () => (
  <div className="w-[260px] bg-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-start gap-3">
      <img 
        src={AVATARS.marcus}
        alt="" 
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-xs font-medium">Marcus T.</p>
        <p className="text-xs text-muted-foreground mt-1">"First time seeing exactly where my giving went. Amazing!"</p>
      </div>
    </div>
  </div>
);

const DeploymentCard = () => (
  <div className="w-[260px] bg-gradient-to-br from-cyan-50 to-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-2 mb-2">
      <Users className="w-4 h-4 text-cyan-600" />
      <span className="text-xs font-medium text-cyan-600">Deployment</span>
    </div>
    <p className="text-sm font-medium">Guatemala Hope Mission</p>
    <p className="text-xs text-muted-foreground mt-1">$8,500 deployed to field</p>
  </div>
);

const SchoolCard = () => (
  <div className="w-[260px] bg-white rounded-xl overflow-hidden shadow-xl shadow-black/8">
    <img 
      src={MISSION_PHOTOS.school}
      alt="" 
      className="w-full h-24 object-cover"
    />
    <div className="p-3">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-primary">Education</span>
      </div>
      <p className="text-sm font-medium">New classroom built!</p>
    </div>
  </div>
);

const WaterCard = () => (
  <div className="w-[260px] bg-gradient-to-br from-sky-50 to-white rounded-xl p-4 shadow-xl shadow-black/8">
    <div className="flex items-center gap-2 mb-2">
      <Droplets className="w-4 h-4 text-sky-500" />
      <span className="text-xs font-medium text-sky-600">Clean Water</span>
    </div>
    <p className="text-sm font-medium">Well completed in Kenya</p>
    <p className="text-xs text-muted-foreground mt-1">500+ families now have clean water</p>
  </div>
);

// All cards with unique keys
const ALL_CARDS = [
  { id: 1, Component: SeededCard },
  { id: 2, Component: SurplusCard },
  { id: 3, Component: MilestoneCard },
  { id: 4, Component: JoinedCard },
  { id: 5, Component: ImpactCard },
  { id: 6, Component: VoteCard },
  { id: 7, Component: ThankYouCard },
  { id: 8, Component: GrowthCard },
  { id: 9, Component: TestimonyCard },
  { id: 10, Component: DeploymentCard },
  { id: 11, Component: SchoolCard },
  { id: 12, Component: WaterCard },
];

const FeedScrollState = () => {
  // Create two columns with different card distributions - no duplicates visible at same time
  const leftColumn = [ALL_CARDS[0], ALL_CARDS[2], ALL_CARDS[4], ALL_CARDS[6], ALL_CARDS[8], ALL_CARDS[10], ALL_CARDS[1], ALL_CARDS[3]];
  const rightColumn = [ALL_CARDS[1], ALL_CARDS[3], ALL_CARDS[5], ALL_CARDS[7], ALL_CARDS[9], ALL_CARDS[11], ALL_CARDS[0], ALL_CARDS[5]];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#FDDE02]">
      <div className="flex gap-4 items-start">
        {/* Left column - slower premium scroll */}
        <motion.div 
          className="flex flex-col gap-4"
          animate={{ y: [0, -900] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {leftColumn.map((card, index) => (
            <div key={`left-${card.id}-${index}`}>
              <card.Component />
            </div>
          ))}
        </motion.div>
        
        {/* Right column - slightly faster scroll, offset */}
        <motion.div 
          className="flex flex-col gap-4"
          animate={{ y: [-100, -1000] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {rightColumn.map((card, index) => (
            <div key={`right-${card.id}-${index}`}>
              <card.Component />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FeedScrollState;
