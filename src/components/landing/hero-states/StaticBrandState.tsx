import seedbaseIcon from '@/assets/seedbase-icon.png';

const StaticBrandState = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#FDDE02]">
      <div className="text-center">
        <img 
          src={seedbaseIcon} 
          alt="Seedbase"
          className="w-20 h-20 mx-auto mb-4 opacity-90"
        />
        <p className="text-black/70 font-medium text-base">
          Where Generosity Grows
        </p>
      </div>
    </div>
  );
};

export default StaticBrandState;
