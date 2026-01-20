import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Confetti } from '@/components/shared/Confetti';
import { useToast } from '@/hooks/use-toast';
import { demoProfiles } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface LaunchMissionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
  onMissionCreated?: (mission: { name: string; goal: number; envoy: string }) => void;
}

export function LaunchMissionModal({ open, onClose, onSuccess, onMissionCreated }: LaunchMissionModalProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<number | string>(5000);
  const [envoyId, setEnvoyId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !goal || !envoyId) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowConfetti(true);
    setIsSuccess(true);
    
    const envoy = demoProfiles.envoys.find(e => e.id === envoyId);
    const numGoal = typeof goal === 'string' ? parseFloat(goal) : goal;
    
    toast({
      title: "Mission Launched! 🚀",
      description: `${name} is now active`,
    });

    onSuccess({
      id: `mission-${Date.now()}`,
      type: 'mission_launched',
      title: 'Mission Launched',
      description: `${name} launched with $${numGoal.toLocaleString()} goal`,
      timestamp: new Date(),
      amount: numGoal,
    });

    onMissionCreated?.({ name, goal: numGoal, envoy: envoy?.name || 'Unknown' });

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setGoal(5000);
    setEnvoyId('');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  const isValid = name.trim() && goal && Number(goal) > 0 && envoyId;

  return (
    <>
      <Confetti isActive={showConfetti} />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-base flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              Launch Mission
            </DialogTitle>
          </DialogHeader>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full gradient-base flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Mission Launched! 🚀</h3>
              <p className="text-muted-foreground">
                {name} is now active and ready for impact.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl gradient-base text-white font-medium"
              >
                Done
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Mission Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Water Wells Uganda Phase 2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mission's goals and impact..."
                  rows={3}
                />
              </div>

              {/* Goal Amount */}
              <div>
                <label className="text-sm font-medium mb-2 block">Funding Goal *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="5000"
                    className="pl-7"
                  />
                </div>
              </div>

              {/* Envoy Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Assign Envoy *</label>
                <Select value={envoyId} onValueChange={setEnvoyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an envoy..." />
                  </SelectTrigger>
                  <SelectContent>
                    {demoProfiles.envoys.map((envoy) => (
                      <SelectItem key={envoy.id} value={envoy.id}>
                        <div className="flex items-center gap-2">
                          <img 
                            src={envoy.avatar} 
                            alt={envoy.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{envoy.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {isValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-muted/50 rounded-xl p-4"
                >
                  <p className="text-sm text-muted-foreground mb-2">Preview</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg gradient-base flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${Number(goal).toLocaleString()} goal • {demoProfiles.envoys.find(e => e.id === envoyId)?.name}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                className={cn(
                  "w-full py-3 rounded-xl gradient-base text-white font-medium",
                  (isSubmitting || !isValid) && "opacity-70"
                )}
              >
                {isSubmitting ? 'Launching...' : 'Launch Mission'}
              </motion.button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
