import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Check, X, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Confetti } from '@/components/shared/Confetti';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface ApproveEnvoyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
}

// Mock pending applications
const pendingApplications = [
  {
    id: 'app-1',
    name: 'Daniel Ochieng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    mission: 'Youth Education Program',
    credentials: 'Former teacher, 5 years community work',
    appliedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'app-2',
    name: 'Grace Wanjiku',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    mission: 'Healthcare Outreach',
    credentials: 'Registered nurse, mission trip leader',
    appliedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'app-3',
    name: 'Peter Mwangi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    mission: 'Agricultural Training',
    credentials: 'Agricultural engineer, local church leader',
    appliedAt: new Date(Date.now() - 43200000),
  },
];

export function ApproveEnvoyModal({ open, onClose, onSuccess }: ApproveEnvoyModalProps) {
  const { toast } = useToast();
  const [applications, setApplications] = useState(pendingApplications);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleApprove = (app: typeof pendingApplications[0]) => {
    setShowConfetti(true);
    
    toast({
      title: "Envoy Approved! 🎉",
      description: `${app.name} can now lead ${app.mission}`,
    });

    onSuccess({
      id: `approve-${Date.now()}`,
      type: 'envoy_approved',
      title: 'Envoy Approved',
      description: `${app.name} approved as Envoy for ${app.mission}`,
      timestamp: new Date(),
    });

    // Remove from list
    setApplications(prev => prev.filter(a => a.id !== app.id));

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleDeny = (app: typeof pendingApplications[0]) => {
    toast({
      title: "Application Declined",
      description: `${app.name}'s application was declined`,
    });

    setApplications(prev => prev.filter(a => a.id !== app.id));
  };

  return (
    <>
      <Confetti isActive={showConfetti} />
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-envoy flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              Approve Envoys
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center"
              >
                <Award className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No pending applications</p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {applications.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-card rounded-xl border border-border/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={app.avatar}
                        alt={app.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{app.name}</h4>
                        <p className="text-sm text-primary">{app.mission}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.credentials}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeny(app)}
                        className="flex-1 py-2 rounded-lg border border-border bg-background text-muted-foreground font-medium flex items-center justify-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApprove(app)}
                        className="flex-1 py-2 rounded-lg gradient-envoy text-white font-medium flex items-center justify-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
