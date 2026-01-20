import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, Heart, Megaphone, Bell, Layers, TrendingUp, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { createPost } from '@/lib/supabase/postsApi';
import { cn } from '@/lib/utils';
import type { ActivityItem } from '../SeedbaseActivityStream';

interface PostUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (activity: ActivityItem) => void;
}

const postTypesByRole = {
  activator: [
    { id: 'support', label: 'Support', icon: Heart },
    { id: 'amplify', label: 'Amplify', icon: Megaphone },
  ],
  trustee: [
    { id: 'announcement', label: 'Announcement', icon: Bell },
    { id: 'allocation', label: 'Allocation Notice', icon: Layers },
  ],
  envoy: [
    { id: 'update', label: 'Mission Update', icon: FileText },
    { id: 'testimony', label: 'Testimony', icon: Heart },
    { id: 'harvest', label: 'Harvest Report', icon: TrendingUp },
  ],
};

export function PostUpdateModal({ open, onClose, onSuccess }: PostUpdateModalProps) {
  const { viewRole, user } = useUser();
  const { toast } = useToast();
  const postTypes = postTypesByRole[viewRole];
  const [selectedType, setSelectedType] = useState(postTypes[0]?.id || 'update');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // Create real post in database
    const userId = localStorage.getItem('demo_user_id') || user?.id || 'demo-user';
    await createPost({
      author_id: userId,
      body: content,
      post_type: selectedType as any,
      seedbase_tag: 'Christ is King Seedbase',
      image_url: imageUrl || undefined,
    });
    
    setIsSuccess(true);
    
    const typeLabel = postTypes.find(t => t.id === selectedType)?.label || 'Update';
    
    toast({
      title: "Post Published!",
      description: `Your ${typeLabel.toLowerCase()} is now live`,
    });

    onSuccess({
      id: `post-${Date.now()}`,
      type: 'envoy_update',
      title: `${typeLabel} Posted`,
      description: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      timestamp: new Date(),
    });

    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setSelectedType(postTypes[0]?.id || 'update');
    setContent('');
    setImageUrl('');
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-envoy flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            Post Update
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
              className="w-16 h-16 mx-auto mb-4 rounded-full gradient-envoy flex items-center justify-center"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Posted! 📣</h3>
            <p className="text-muted-foreground">
              Your update is now visible in the feed.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Post Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Post Type</label>
              <div className="flex flex-wrap gap-2">
                {postTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      selectedType === type.id
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium mb-2 block">Content *</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your update with the Seedbase community..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {content.length}/500
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Image className="h-4 w-4" />
                Image URL (Optional)
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Auto-tag indicator */}
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              📍 Will be tagged to <span className="font-medium text-foreground">Christ is King Seedbase</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className={cn(
                "w-full py-3 rounded-xl gradient-envoy text-white font-medium",
                (isSubmitting || !content.trim()) && "opacity-70"
              )}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Update'}
            </motion.button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
