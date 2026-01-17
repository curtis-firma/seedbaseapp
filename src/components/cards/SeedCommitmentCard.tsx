import { MessageCircle, TrendingUp, Send, Heart, DollarSign, MoreHorizontal, Sprout } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";

const SeedCommitmentCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm">
      {/* Main User Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" 
            alt="Sarah Johnson"
            className="w-12 h-12 rounded-full bg-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xs">+</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground">Sarah Johnson</span>
            <span className="text-muted-foreground text-sm">@sarahjay_...</span>
            <span className="text-muted-foreground text-sm">· 2d</span>
          </div>
          <p className="text-foreground mt-1">
            Monthly commitment complete! Excited to see the progress in Guatemala 🌱
          </p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
      </div>
      
      {/* Embedded Seed Card */}
      <div className="border border-border rounded-xl p-4 mb-4">
        {/* Card User Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" 
              alt="Sarah Johnson"
              className="w-10 h-10 rounded-full bg-slate-200"
            />
            <div>
              <div className="font-heading font-semibold text-foreground">Sarah Johnson</div>
              <div className="text-muted-foreground text-sm">@sarahjay_seeds</div>
            </div>
          </div>
          <Sprout className="w-5 h-5 text-emerald-500" />
        </div>
        
        {/* Amount Section */}
        <div className="text-center py-4 border-t border-b border-border mb-4">
          <div className="text-muted-foreground text-sm tracking-wide mb-1">SEEDED</div>
          <div className="font-heading text-4xl font-bold text-foreground mb-1">$1,000</div>
          <div className="text-muted-foreground">
            to <span className="text-primary font-medium">Guatemala Hope Center</span>
          </div>
        </div>
        
        {/* Quote */}
        <p className="text-muted-foreground italic text-center mb-4">
          "Monthly commitment - excited to see the progress!"
        </p>
        
        {/* Seed Too Button */}
        <PrimaryButton className="w-full py-3 mb-4" showRing={false}>
          Seed Too
        </PrimaryButton>
        
        {/* Total Row */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            TOTAL <span className="font-bold text-foreground ml-1">$1,000</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm">
            <Sprout className="w-4 h-4" />
            <span className="font-medium">Your Seed: $8</span>
          </div>
        </div>
      </div>
      
      {/* Engagement Actions */}
      <div className="flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
            <MessageCircle className="w-5 h-5" />
            8
          </span>
          <span className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
            <TrendingUp className="w-5 h-5" />
            $970
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

export default SeedCommitmentCard;
