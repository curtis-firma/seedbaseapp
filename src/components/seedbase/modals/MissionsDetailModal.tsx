import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ArrowRight, TrendingUp, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { mockMissions } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface MissionsDetailModalProps {
  open: boolean;
  onClose: () => void;
  onLaunchMission?: () => void;
}

export function MissionsDetailModal({ open, onClose, onLaunchMission }: MissionsDetailModalProps) {
  const navigate = useNavigate();
  const activeMissions = mockMissions.filter(m => m.status === 'active');
  
  const handleViewMission = (missionId: string) => {
    onClose();
    navigate('/app/vault');
  };

  const handleLaunchNew = () => {
    onClose();
    onLaunchMission?.();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            Active Missions
            <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              {activeMissions.length} active
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {activeMissions.map((mission, i) => {
            const progress = (mission.fundingRaised / mission.fundingGoal) * 100;
            const completedMilestones = mission.milestones.filter(m => m.isCompleted).length;
            
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border/50 p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg gradient-base flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{mission.title}</h4>
                    <p className="text-xs text-muted-foreground">{mission.seedbaseName}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Funding</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-base"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    <span>{completedMilestones}/{mission.milestones.length} milestones</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewMission(mission.id)}
                    className="flex items-center gap-1 text-primary font-medium"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}

          {activeMissions.length === 0 && (
            <div className="py-8 text-center">
              <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground">No active missions</p>
            </div>
          )}

          {/* Quick Action */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLaunchNew}
            className="w-full py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-medium hover:bg-primary/5 transition-colors"
          >
            + Launch New Mission
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
