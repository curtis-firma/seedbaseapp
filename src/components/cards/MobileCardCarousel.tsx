import SeedCommitmentCard from "./SeedCommitmentCard";
import LedgerCard from "./LedgerCard";
import GrowthReportCard from "./GrowthReportCard";
import WalletCard from "./WalletCard";
import DashboardCard from "./DashboardCard";
import TitheAllocationCard from "./TitheAllocationCard";
import generositySpreadImage from "@/assets/generosity-spread.png";

type CardStyle = "crop" | "fit" | "image" | "square" | "wide";

// Animation wrapper component for carousel cards
const AnimatedWrapper = ({ children, animation }: { children: React.ReactNode; animation: string }) => (
  <div className={animation}>
    {children}
  </div>
);

const MobileCardCarousel = () => {
  // Cards matching exact desktop sections
  const cards: {
    id: number;
    component: React.ReactNode;
    bgColor: string;
    style: CardStyle;
    headline: string;
    animation?: string;
  }[] = [
    { 
      id: 1, 
      component: <WalletCard />, 
      bgColor: "bg-blue-400",
      style: "square",
      headline: "Wallet for giving",
      animation: "animate-gentle-bounce"
    },
    { 
      id: 2, 
      component: <SeedCommitmentCard />, 
      bgColor: "bg-emerald-400",
      style: "crop",
      headline: "See your impact",
      animation: "animate-number-tick"
    },
    { 
      id: 3, 
      component: <img src={generositySpreadImage} alt="Generosity spread" className="w-full h-full object-cover animate-ken-burns" />, 
      bgColor: "bg-teal-400",
      style: "image",
      headline: "Generosity spreads"
    },
    { 
      id: 4, 
      component: <LedgerCard />, 
      bgColor: "bg-[#FDDE02]",
      style: "fit",
      headline: "Shared ledgers",
      animation: "animate-subtle-pulse"
    },
    { 
      id: 5, 
      component: <DashboardCard />, 
      bgColor: "bg-violet-400",
      style: "fit",
      headline: "Steward together",
      animation: "animate-icon-wiggle"
    },
    { 
      id: 6, 
      component: <TitheAllocationCard />, 
      bgColor: "bg-amber-400",
      style: "wide",
      headline: "Transparent tithing",
      animation: "animate-progress-pulse"
    },
    { 
      id: 7, 
      component: <GrowthReportCard />, 
      bgColor: "bg-cyan-400",
      style: "fit",
      headline: "Built by generosity",
      animation: "animate-number-tick"
    },
  ];

  // Duplicate cards for seamless infinite scroll
  const allCards = [...cards, ...cards];

  const renderCardContent = (card: typeof cards[0]) => {
    const content = card.animation ? (
      <AnimatedWrapper animation={card.animation}>
        {card.component}
      </AnimatedWrapper>
    ) : card.component;

    switch (card.style) {
      case "square":
        return (
          <div className={`${card.bgColor} w-full h-full flex items-center justify-center p-2`}>
            <div className="transform scale-[0.55] origin-center">
              {content}
            </div>
          </div>
        );
      case "wide":
        return (
          <div className={`${card.bgColor} w-full h-full flex items-center justify-center p-2 overflow-hidden`}>
            <div className="w-full transform scale-[0.48] origin-center">
              {content}
            </div>
          </div>
        );
      case "crop":
        return (
          <div className={`${card.bgColor} w-full h-full flex items-center justify-center p-2 overflow-hidden`}>
            <div className="w-full transform scale-[0.50] origin-center">
              {content}
            </div>
          </div>
        );
      case "image":
        return (
          <div className={`${card.bgColor} w-full h-full overflow-hidden`}>
            {content}
          </div>
        );
      case "fit":
      default:
        return (
          <div className={`${card.bgColor} w-full h-full flex items-center justify-center p-2 overflow-hidden`}>
            <div className="w-full transform scale-[0.48] origin-center">
              {content}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full overflow-hidden my-2">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      {/* Scrolling track - continuous scroll, no pause */}
      <div className="flex animate-scroll-cards gap-4 py-2">
        {allCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="flex-shrink-0 flex flex-col items-center"
          >
            {/* Card */}
            <div className="w-[200px] h-[200px] overflow-hidden rounded-2xl shadow-lg">
              {renderCardContent(card)}
            </div>
            {/* Headline below card */}
            <p className="mt-2 text-sm font-medium text-muted-foreground text-center px-2 max-w-[200px]">
              {card.headline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCardCarousel;
