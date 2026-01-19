import { motion } from 'framer-motion';
import { X, Sprout, Users, BookOpen, GraduationCap, Home, Heart, TrendingUp } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ImpactCategory } from '@/types/seedbase';
import { cn } from '@/lib/utils';

interface ImpactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  missionName: string;
  yourSeed: number;
  totalRaised: number;
  yourImpactPercentage: number;
  impactCategories?: ImpactCategory[];
}

const categoryIcons: Record<string, React.ElementType> = {
  students: GraduationCap,
  classrooms: Home,
  teachers: Users,
  supplies: BookOpen,
  healthcare: Heart,
  default: TrendingUp,
};

export function ImpactDrawer({
  isOpen,
  onClose,
  missionName,
  yourSeed,
  totalRaised,
  yourImpactPercentage,
  impactCategories = [],
}: ImpactDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl bg-card border-t border-border/50">
        <SheetHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-seed flex items-center justify-center">
                <Sprout className="h-5 w-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-left">Your Impact</SheetTitle>
                <p className="text-sm text-muted-foreground">{missionName}</p>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl gradient-seed text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm">Your Share</p>
                <p className="text-3xl font-bold">${yourSeed.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-2xl font-bold">{yourImpactPercentage}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>of ${totalRaised.toLocaleString()} total raised</span>
            </div>
          </motion.div>

          {/* How Your Seeds Are Used */}
          {impactCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                How Your Seeds Are Used
              </h3>
              
              <div className="space-y-3">
                {impactCategories.map((category, index) => {
                  const IconComponent = categoryIcons[category.icon] || categoryIcons.default;
                  return (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{category.name}</p>
                            {category.description && (
                              <p className="text-xs text-muted-foreground">{category.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${category.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{category.percentage}%</p>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${category.percentage}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          className={cn(
                            "h-full rounded-full",
                            index % 3 === 0 && "gradient-seed",
                            index % 3 === 1 && "gradient-base",
                            index % 3 === 2 && "gradient-trust",
                          )}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Impact Summary */}
          <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-seed" />
              <span className="text-sm font-semibold">Your Impact Number</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ${yourSeed} impact number represents {yourImpactPercentage}% of the total funds raised for {missionName}. 
              Every seed you plant creates tangible, measurable impact.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
