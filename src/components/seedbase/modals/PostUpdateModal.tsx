import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Check, Heart, Megaphone, Bell, Layers, TrendingUp, Image, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { createPost } from '@/lib/supabase/postsApi';
import { cn } from '@/lib/utils';
import { mockSeedbases, demoProfiles } from '@/data/mockData';
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

// Combine all demo users for mention search
const allDemoUsers = [
  ...demoProfiles.activators,
  ...demoProfiles.trustees,
  ...demoProfiles.envoys,
];

export function PostUpdateModal({ open, onClose, onSuccess }: PostUpdateModalProps) {
  const { viewRole, user } = useUser();
  const { toast } = useToast();
  const postTypes = postTypesByRole[viewRole];
  const [selectedType, setSelectedType] = useState(postTypes[0]?.id || 'update');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Search state
  const [selectedSeedbase, setSelectedSeedbase] = useState('Christ is King Seedbase');
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [showMentionResults, setShowMentionResults] = useState(false);

  // Filter users based on search
  const filteredUsers = mentionSearch.length >= 1
    ? allDemoUsers.filter(u => 
        u.name.toLowerCase().includes(mentionSearch.toLowerCase()) ||
        u.handle.toLowerCase().includes(mentionSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleAddMention = (handle: string) => {
    if (!mentionedUsers.includes(handle)) {
      setMentionedUsers(prev => [...prev, handle]);
    }
    setMentionSearch('');
    setShowMentionResults(false);
  };

  const handleRemoveMention = (handle: string) => {
    setMentionedUsers(prev => prev.filter(h => h !== handle));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    
    // Build content with mentions
    const mentionsText = mentionedUsers.length > 0 
      ? `\n\ncc: ${mentionedUsers.map(h => `@${h}`).join(' ')}`
      : '';
    const fullContent = content + mentionsText;
    
    // Create real post in database
    const userId = localStorage.getItem('demo_user_id') || user?.id || 'demo-user';
    await createPost({
      author_id: userId,
      body: fullContent,
      post_type: selectedType as any,
      seedbase_tag: selectedSeedbase,
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
    setSelectedSeedbase('Christ is King Seedbase');
    setMentionSearch('');
    setMentionedUsers([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
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

            {/* Seedbase Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tag Seedbase</label>
              <Select value={selectedSeedbase} onValueChange={setSelectedSeedbase}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Seedbase..." />
                </SelectTrigger>
                <SelectContent>
                  {mockSeedbases.map((sb) => (
                    <SelectItem key={sb.id} value={sb.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{sb.logo}</span>
                        <span>{sb.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {/* Mention Users */}
            <div className="relative">
              <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                <Search className="h-4 w-4" />
                Mention Users (Optional)
              </label>
              <Input
                value={mentionSearch}
                onChange={(e) => {
                  setMentionSearch(e.target.value);
                  setShowMentionResults(e.target.value.length >= 1);
                }}
                onFocus={() => setShowMentionResults(mentionSearch.length >= 1)}
                placeholder="Search @username to mention..."
              />
              
              {/* Search Results Dropdown */}
              {showMentionResults && filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleAddMention(user.handle)}
                      className="w-full p-2 hover:bg-muted flex items-center gap-2 text-left"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.handle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Selected Mentions as Chips */}
              {mentionedUsers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {mentionedUsers.map(handle => (
                    <span 
                      key={handle} 
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      @{handle}
                      <button 
                        onClick={() => handleRemoveMention(handle)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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

            {/* Selected Seedbase indicator */}
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
              📍 Will be tagged to <span className="font-medium text-foreground">{selectedSeedbase}</span>
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
