import { MessageCircle, TrendingUp, Send, Heart, DollarSign, MoreHorizontal, Users, Clock, BadgeCheck } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

const CampaignCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-5 max-w-sm animate-bounce-subtle">
      {/* Main User Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=hope" 
            alt="Hope Foundation"
            className="w-12 h-12 rounded-full bg-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-heading font-bold text-foreground">Hope Foundati...</span>
            <BadgeCheck className="w-4 h-4 text-primary fill-primary" />
            <span className="text-muted-foreground text-sm">@hope_intl</span>
            <span className="text-muted-foreground text-sm">· Jan 6</span>
          </div>
          <p className="text-foreground mt-1">
            We're so close to our goal! Help us cross the finish line 🏁
          </p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      {/* Campaign Image */}
      <div className="relative rounded-xl overflow-hidden mb-4">
        <img 
          src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=200&fit=crop"
          alt="Kenya children"
          className="w-full h-40 object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
          ACTIVE
        </span>
      </div>
      
      {/* Campaign Info */}
      <div className="mb-4">
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          Emergency Relief: Kenya Drought Response
        </h3>
        <p className="text-muted-foreground text-sm">
          by Hope Foundation International
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div className="h-full w-[88%] bg-primary rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-heading text-2xl font-bold text-foreground">$43.8K</span>
            <span className="text-muted-foreground text-sm ml-1">of $50.0K</span>
          </div>
          <span className="text-primary font-bold text-lg">88%</span>
        </div>
      </div>
      
      {/* Stats and CTA */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            892 donors
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            7 days left
          </span>
        </div>
        <PrimaryButton className="px-4 py-2 text-sm" showRing={false}>
          Donate Now
        </PrimaryButton>
      </div>
      
      {/* Engagement Actions */}
      <div className="flex items-center justify-between text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
            <MessageCircle className="w-5 h-5" />
            123
          </span>
          <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
            <TrendingUp className="w-5 h-5" />
            $30.2K
          </span>
          <Send className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
          <Heart className="w-5 h-5 hover:text-foreground cursor-pointer transition-colors" />
        </div>
        <div className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors">
          <DollarSign className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
