import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Check, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockMissions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface RequestFundsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
}

const urgencyLevels = [
  { id: 'normal', label: 'Normal', color: 'text-muted-foreground' },
  { id: 'urgent', label: 'Urgent', color: 'text-orange-500' },
  { id: 'emergency', label: 'Emergency', color: 'text-destructive' },
];

export function RequestFundsModal({ open, onClose, onSuccess }: RequestFundsModalProps) {
  const { toast } = useToast();
  const [missionId, setMissionId] = useState('');
  const [amount, setAmount] = useState<number | string>(500);
  const [justification, setJustification] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedMission = mockMissions.find(m => m.id === missionId);
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  const handleSubmit = async () => {
    if (!missionId || !numAmount || numAmount <= 0) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSuccess(true);
    
    toast({
      title: "Request Submitted!",
      description: `$${numAmount.toLocaleString()} request sent to trustees`,
    });

    onSuccess({
      id: `request-${Date.now()}`,
      type: 'funds_requested',
      title: 'Funds Requested',
      description: `$${numAmount.toLocaleString()} requested for ${selectedMission?.title}`,
      timestamp: new Date(),
      amount: numAmount,
    });

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setMissionId('');
    setAmount(500);
    setJustification('');
    setUrgency('normal');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  const isValid = missionId && numAmount > 0 && justification.trim();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-base flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            Request Funds
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
            <h3 className="text-xl font-bold mb-2">Request Submitted! 📨</h3>
            <p className="text-muted-foreground">
              Pending trustee approval
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Awaiting Review
            </div>
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

            {/* Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Amount Requested *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="pl-7"
                />
              </div>
            </div>

            {/* Justification */}
            <div>
              <label className="text-sm font-medium mb-2 block">Justification *</label>
              <Textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain why these funds are needed..."
                rows={3}
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="text-sm font-medium mb-2 block">Urgency Level</label>
              <div className="flex gap-2">
                {urgencyLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUrgency(level.id)}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
                      urgency === level.id
                        ? level.id === 'emergency' 
                          ? "bg-destructive text-white"
                          : level.id === 'urgent'
                          ? "bg-orange-500 text-white"
                          : "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {level.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {urgency !== 'normal' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={cn(
                  "rounded-lg p-3 text-sm flex items-start gap-2",
                  urgency === 'emergency' ? "bg-destructive/10 text-destructive" : "bg-orange-500/10 text-orange-600"
                )}
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  {urgency === 'emergency' 
                    ? "Emergency requests are escalated immediately to all trustees."
                    : "Urgent requests are prioritized in the review queue."
                  }
                </span>
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
              {isSubmitting ? 'Submitting...' : `Request $${numAmount.toLocaleString()}`}
            </motion.button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
