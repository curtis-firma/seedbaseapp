import { useState, useEffect } from "react";
import { Users, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Children image from Unsplash
const childrenImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop";

const CampaignCard = () => {
  const goal = 50000;
  const targetRaised = 43800;
  const [raised, setRaised] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  // Counting animation for raised amount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setRaised(Math.floor(targetRaised * easeOut));

      if (currentStep >= steps) {
        clearInterval(interval);
        setRaised(targetRaised);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(Math.round((targetRaised / goal) * 100));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.round((raised / goal) * 100);

  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Image with Active Badge - using children image */}
      <div 
        className="relative w-full flex-[1.2] bg-cover bg-center min-h-0"
        style={{ backgroundImage: `url(${childrenImage})` }}
      >
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Active
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-0.5 leading-tight">
          Emergency Relief: Kenya Drought Response
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-3">
          by Hope Foundation International
        </p>

        {/* Progress Bar - Animated */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressWidth}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-lg sm:text-xl text-gray-900">${(raised / 1000).toFixed(1)}K</span>
            <span className="text-xs sm:text-sm text-gray-500">of ${(goal / 1000).toFixed(0)}K</span>
          </div>
          <span className="font-semibold text-primary text-base sm:text-lg">{percentage}%</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>892</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>7 days</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Donate
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
