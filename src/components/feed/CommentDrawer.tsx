import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Heart, Loader2, X } from 'lucide-react';
import { 
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose 
} from '@/components/ui/drawer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getComments, createComment, likeComment, type DemoComment } from '@/lib/supabase/commentsApi';
import { useHaptic } from '@/hooks/useHaptic';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  commentCount: number;
  onCommentAdded?: () => void;
}

export function CommentDrawer({ isOpen, onClose, postId, commentCount, onCommentAdded }: CommentDrawerProps) {
  const [comments, setComments] = useState<DemoComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const haptic = useHaptic();

  const getCurrentUserId = (): string | null => {
    const sessionData = localStorage.getItem('seedbase-session');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        return parsed.userId || null;
      } catch {}
    }
    return null;
  };

  // Load comments when drawer opens
  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    haptic.medium();

    try {
      const comment = await createComment(postId, userId, newComment.trim());
      if (comment) {
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        haptic.success();
        toast.success('Comment added!');
        onCommentAdded?.();
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    haptic.light();
    
    if (likedComments.has(commentId)) {
      return; // Already liked
    }

    setLikedComments(prev => new Set([...prev, commentId]));
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ));

    try {
      await likeComment(commentId);
    } catch (err) {
      // Revert on error
      setLikedComments(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes: c.likes - 1 } : c
      ));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comments ({commentCount})
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="p-2 hover:bg-muted rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-[60vh]">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No comments yet</p>
                <p className="text-muted-foreground/60 text-xs mt-1">Be the first to comment!</p>
              </div>
            ) : (
              <AnimatePresence>
                {comments.map((comment, i) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      {comment.author?.avatar_url ? (
                        <AvatarImage src={comment.author.avatar_url} alt={comment.author.display_name || ''} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {(comment.author?.display_name || comment.author?.username || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {comment.author?.display_name || comment.author?.username || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.body}</p>
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-1 mt-2 text-xs transition-colors ${
                          likedComments.has(comment.id) 
                            ? 'text-rose-500' 
                            : 'text-muted-foreground hover:text-rose-500'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitComment}
                disabled={isSubmitting || !newComment.trim()}
                className="p-3 bg-primary text-white rounded-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}