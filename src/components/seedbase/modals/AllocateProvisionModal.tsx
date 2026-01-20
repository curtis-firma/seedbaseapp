import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Check, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockMissions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface AllocateProvisionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem, amount: number) => void;
  provisionBalance?: number;
}

const categories = [
  { id: 'operations', label: 'Operations' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'general', label: 'General' },
];

export function AllocateProvisionModal({ open, onClose, onSuccess, provisionBalance = 12500 }: AllocateProvisionModalProps) {
  const { toast } = useToast();
  const [missionId, setMissionId] = useState('');
  const [amount, setAmount] = useState<number | string>(1000);
  const [category, setCategory] = useState('general');
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
      title: "Funds Allocated!",
      description: `$${numAmount.toLocaleString()} sent to ${selectedMission?.title}`,
    });

    onSuccess({
      id: `allocate-${Date.now()}`,
      type: 'provision_allocated',
      title: 'Provision Allocated',
      description: `$${numAmount.toLocaleString()} allocated to ${selectedMission?.title}`,
      timestamp: new Date(),
      amount: numAmount,
    }, numAmount);

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setMissionId('');
    setAmount(1000);
    setCategory('general');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  const isValid = missionId && numAmount > 0 && numAmount <= provisionBalance;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Layers className="h-5 w-5 text-white" />
            </div>
            Allocate Provision
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
            <h3 className="text-xl font-bold mb-2">Funds Allocated! 💸</h3>
            <p className="text-muted-foreground">
              ${numAmount.toLocaleString()} is on its way.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Balance Display */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Available in Provision Pool</p>
              <p className="text-2xl font-bold">${provisionBalance.toLocaleString()}</p>
            </div>

            {/* Mission Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Mission *</label>
              <Select value={missionId} onValueChange={setMissionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mission..." />
                </SelectTrigger>
                <SelectContent>
                  {mockMissions.filter(m => m.status === 'active').map((mission) => (
                    <SelectItem key={mission.id} value={mission.id}>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{mission.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000"
                  className="pl-7"
                  max={provisionBalance}
                />
              </div>
              {numAmount > provisionBalance && (
                <p className="text-xs text-destructive mt-1">Amount exceeds available balance</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                      category === cat.id
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {selectedMission && numAmount > 0 && (
              <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">After Allocation</p>
                <p className="font-medium">
                  Provision Pool: ${(provisionBalance - numAmount).toLocaleString()}
                </p>
              </div>
            )}

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
              {isSubmitting ? 'Allocating...' : `Allocate $${numAmount.toLocaleString()}`}
            </motion.button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
