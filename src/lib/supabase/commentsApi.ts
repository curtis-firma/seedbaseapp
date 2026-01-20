// Comments API - Supabase operations for post comments
import { supabase } from '@/integrations/supabase/client';
import { getUserById, type DemoUser } from './demoApi';

export interface DemoComment {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  likes: number;
  created_at: string;
  // Joined data
  author?: DemoUser;
}

// Create a new comment
export async function createComment(
  postId: string, 
  authorId: string, 
  body: string
): Promise<DemoComment | null> {
  const { data: comment, error } = await supabase
    .from('demo_comments')
    .insert({
      post_id: postId,
      author_id: authorId,
      body,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  // Also increment the post's comment count
  await incrementPostCommentCount(postId);

  // Fetch author info
  const author = await getUserById(authorId);

  return {
    ...comment,
    author: author || undefined,
  };
}

// Get comments for a post
export async function getComments(postId: string, limit = 50): Promise<DemoComment[]> {
  const { data, error } = await supabase
    .from('demo_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting comments:', error);
    return [];
  }

  // Fetch author info for each comment
  const comments = await Promise.all(
    (data || []).map(async (comment) => {
      const author = await getUserById(comment.author_id);
      return {
        ...comment,
        author: author || undefined,
      };
    })
  );

  return comments;
}

// Like a comment
export async function likeComment(commentId: string): Promise<boolean> {
  // Get current likes
  const { data: comment, error: fetchError } = await supabase
    .from('demo_comments')
    .select('likes')
    .eq('id', commentId)
    .single();

  if (fetchError || !comment) {
    console.error('Error fetching comment for like:', fetchError);
    return false;
  }

  // Increment likes
  const { error: updateError } = await supabase
    .from('demo_comments')
    .update({ likes: (comment.likes || 0) + 1 })
    .eq('id', commentId);

  if (updateError) {
    console.error('Error updating likes:', updateError);
    return false;
  }

  return true;
}

// Increment post comment count
async function incrementPostCommentCount(postId: string): Promise<void> {
  // Get current count
  const { data: post, error: fetchError } = await supabase
    .from('demo_posts')
    .select('comments')
    .eq('id', postId)
    .single();

  if (fetchError || !post) {
    console.error('Error fetching post for comment count:', fetchError);
    return;
  }

  // Increment
  const { error: updateError } = await supabase
    .from('demo_posts')
    .update({ comments: (post.comments || 0) + 1 })
    .eq('id', postId);

  if (updateError) {
    console.error('Error updating comment count:', updateError);
  }
}

// Get comment count for a post
export async function getCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('demo_comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) {
    console.error('Error counting comments:', error);
    return 0;
  }

  return count || 0;
}