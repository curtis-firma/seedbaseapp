import { Heart, MessageCircle, Share2, Users, Clock } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const FeedCard = () => {
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  // One-time progress animation on mount
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    
    const timer = setTimeout(() => {
      setProgress(88);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[320px] bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
      {/* Author Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-primary flex items-center justify-center text-white font-bold text-sm">
          HF
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-sm">Hope Foundation</p>
          <p className="text-gray-500 text-xs">@hope_intl</p>
        </div>
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
          ACTIVE
        </span>
      </div>

      {/* Image with CSS-only shimmer */}
      <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video bg-gradient-to-br from-cyan-100 to-primary/20">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop"
          alt="Kenya Drought Response"
          className="w-full h-full object-cover"
        />
        {/* CSS shimmer overlay - no JS needed */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer opacity-60 pointer-events-none" />
      </div>

      {/* Campaign Title */}
      <h4 className="font-bold text-gray-900 mb-2">Emergency Relief: Kenya Drought Response</h4>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900">$43.8K</span>
          <span className="text-sm text-gray-500">of $50.0K</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">892 donors</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">7 days left</span>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors mb-4">
        Donate Now
      </button>

      {/* Engagement Row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm">156</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">24</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-gray-400">Posted 2h ago</span>
      </div>
    </div>
  );
};

export default FeedCard;
