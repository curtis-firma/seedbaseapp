import { Heart, MessageCircle, Share2, Users, Clock } from "lucide-react";

const PhotoFeedCard = () => {
  return (
    <div className="w-[320px] bg-white rounded-[20px] overflow-hidden shadow-xl">
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
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

      {/* Photo */}
      <div className="relative aspect-video bg-gradient-to-br from-cyan-100 to-blue-100">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop"
          alt="Kenya Drought Response"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Campaign Title */}
        <h4 className="font-bold text-gray-900 mb-3">Emergency Relief: Kenya Drought Response</h4>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">$43.8K</span>
            <span className="text-sm text-gray-500">of $50.0K</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-cyan-500 rounded-full"
              style={{ width: '88%' }}
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

        {/* Engagement Row */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-rose-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="text-sm">156</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">24</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-500 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 ml-auto">Posted 2h ago</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoFeedCard;
