import SeedCommitmentCard from "./SeedCommitmentCard";
import LedgerCard from "./LedgerCard";
import GrowthReportCard from "./GrowthReportCard";
import WalletCard from "./WalletCard";
import DashboardCard from "./DashboardCard";
import TitheAllocationCard from "./TitheAllocationCard";

type CardStyle = "crop" | "fit" | "square" | "wide";

const MobileCardCarousel = () => {
  const cards: {
    id: number;
    component: React.ReactNode;
    bgColor: string;
    style: CardStyle;
    headline: string;
  }[] = [
    { id: 1, component: <WalletCard />, bgColor: "bg-blue-400", style: "square", headline: "Wallet for giving" },
    { id: 2, component: <GrowthReportCard />, bgColor: "bg-emerald-400", style: "crop", headline: "See your impact" },
    { id: 3, component: <LedgerCard />, bgColor: "bg-yellow-400", style: "fit", headline: "Shared ledgers" },
    { id: 4, component: <DashboardCard />, bgColor: "bg-violet-400", style: "fit", headline: "Steward together" },
    { id: 5, component: <TitheAllocationCard />, bgColor: "bg-amber-400", style: "wide", headline: "Transparent tithing" },
    { id: 6, component: <SeedCommitmentCard />, bgColor: "bg-cyan-400", style: "fit", headline: "Built by generosity" },
  ];

  // Double cards for infinite scroll effect
  const allCards = [...cards, ...cards];

  const renderCardContent = (card: typeof cards[0]) => {
    switch (card.style) {
      case "square":
        return (
          <div className="w-[280px] h-[280px] flex items-center justify-center scale-[0.85] origin-center">
            {card.component}
          </div>
        );
      case "wide":
        return (
          <div className="w-[340px] h-[260px] flex items-center justify-center scale-[0.85] origin-center">
            {card.component}
          </div>
        );
      case "crop":
        return (
          <div className="w-[280px] h-[320px] flex items-start justify-center scale-[0.85] origin-top overflow-hidden">
            {card.component}
          </div>
        );
      case "fit":
      default:
        return (
          <div className="flex items-center justify-center scale-[0.85] origin-center">
            {card.component}
          </div>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden py-8">
      <div 
        className="flex gap-6 animate-scroll-cards"
        style={{
          width: 'max-content',
        }}
      >
        {allCards.map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className={`flex-shrink-0 ${card.bgColor} rounded-3xl p-4 flex flex-col items-center`}
          >
            {renderCardContent(card)}
            <p className="text-white font-semibold text-sm mt-2 text-center">
              {card.headline}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCardCarousel;
