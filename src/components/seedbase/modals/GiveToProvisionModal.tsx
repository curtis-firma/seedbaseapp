import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface GiveToProvisionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
}

const quickAmounts = [25, 50, 100, 250, 500];
const purposes = [
  { id: 'tithe', label: 'Tithe' },
  { id: 'donation', label: 'Donation' },
  { id: 'offering', label: 'Special Offering' },
];

export function GiveToProvisionModal({ open, onClose, onSuccess }: GiveToProvisionModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number | string>(100);
  const [purpose, setPurpose] = useState('tithe');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (!numAmount || numAmount <= 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSuccess(true);
    
    toast({
      title: "Gift Received!",
      description: `$${numAmount.toLocaleString()} added to Provision Pool`,
    });

    onSuccess({
      id: `give-${Date.now()}`,
      type: 'provision_allocated',
      title: 'Gave to Provision Pool',
      description: `You contributed $${numAmount.toLocaleString()} as ${purposes.find(p => p.id === purpose)?.label}`,
      timestamp: new Date(),
      amount: numAmount,
    });

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setAmount(100);
    setPurpose('tithe');
    setNote('');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            Give to Provision Pool
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
            <h3 className="text-xl font-bold mb-2">Gift Received! 💝</h3>
            <p className="text-muted-foreground">
              Thank you for your generosity.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Quick Amount Chips */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Amount</label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((amt) => (
                  <motion.button
                    key={amt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(amt)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                      amount === amt
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    ${amt}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">Or Enter Custom Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="pl-7"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-sm font-medium mb-2 block">Purpose</label>
              <div className="flex gap-2">
                {purposes.map((p) => (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPurpose(p.id)}
                    className={cn(
                      "flex-1 py-2 rounded-lg font-medium text-sm transition-all",
                      purpose === p.id
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {p.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-sm font-medium mb-2 block">Note (Optional)</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a memo..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !amount || Number(amount) <= 0}
              className={cn(
                "w-full py-3 rounded-xl bg-primary text-white font-medium",
                (isSubmitting || !amount || Number(amount) <= 0) && "opacity-70"
              )}
            >
              {isSubmitting ? 'Processing...' : `Give $${Number(amount).toLocaleString()}`}
            </motion.button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
