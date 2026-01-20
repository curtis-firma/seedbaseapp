import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Check, Users, Utensils, DollarSign, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Confetti } from '@/components/shared/Confetti';
import { useToast } from '@/hooks/use-toast';
import { mockMissions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface SubmitHarvestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
}

export function SubmitHarvestModal({ open, onClose, onSuccess }: SubmitHarvestModalProps) {
  const { toast } = useToast();
  const [missionId, setMissionId] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [peopleServed, setPeopleServed] = useState('');
  const [mealsDistributed, setMealsDistributed] = useState('');
  const [fundsUsed, setFundsUsed] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const selectedMission = mockMissions.find(m => m.id === missionId);

  const handleSubmit = async () => {
    if (!missionId || !weekNumber) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowConfetti(true);
    setIsSuccess(true);
    
    toast({
      title: "Harvest Report Submitted! 🌾",
      description: `Week ${weekNumber} report for ${selectedMission?.title}`,
    });

    onSuccess({
      id: `harvest-${Date.now()}`,
      type: 'harvest_submitted',
      title: 'Harvest Report Submitted',
      description: `Week ${weekNumber} report: ${peopleServed || '0'} people served`,
      timestamp: new Date(),
      amount: fundsUsed ? parseFloat(fundsUsed) : undefined,
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleClose = () => {
    setMissionId('');
    setWeekNumber('');
    setPeopleServed('');
    setMealsDistributed('');
    setFundsUsed('');
    setSummary('');
    setImageUrl('');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  const isValid = missionId && weekNumber;

  return (
    <>
      <Confetti isActive={showConfetti} />
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Submit Harvest Report
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
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">Report Submitted! 🌾</h3>
              <p className="text-muted-foreground">
                Your harvest is being reviewed by trustees.
              </p>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="mt-6 px-6 py-3 rounded-xl bg-primary text-white font-medium"
              >
                Done
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Mission Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Select Mission *</label>
                <Select value={missionId} onValueChange={setMissionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your mission..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMissions.filter(m => m.status === 'active').map((mission) => (
                      <SelectItem key={mission.id} value={mission.id}>
                        {mission.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Week Number */}
              <div>
                <label className="text-sm font-medium mb-2 block">Week Number *</label>
                <Input
                  type="number"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  placeholder="e.g., 12"
                  min={1}
                />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    People
                  </label>
                  <Input
                    type="number"
                    value={peopleServed}
                    onChange={(e) => setPeopleServed(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <Utensils className="h-3 w-3" />
                    Meals
                  </label>
                  <Input
                    type="number"
                    value={mealsDistributed}
                    onChange={(e) => setMealsDistributed(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Funds
                  </label>
                  <Input
                    type="number"
                    value={fundsUsed}
                    onChange={(e) => setFundsUsed(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="text-sm font-medium mb-2 block">Summary</label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describe this week's activities and impact..."
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  Photo URL (Optional)
                </label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={isSubmitting || !isValid}
                className={cn(
                  "w-full py-3 rounded-xl bg-primary text-white font-medium",
                  (isSubmitting || !isValid) && "opacity-70"
                )}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Harvest Report'}
              </motion.button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
