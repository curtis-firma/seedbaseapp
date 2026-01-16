// Posts API - Supabase operations for demo posts
import { supabase } from '@/integrations/supabase/client';
import { getUserById, type DemoUser } from './demoApi';

export interface DemoPost {
  id: string;
  author_id: string | null;
  seedbase_tag: string | null;
  mission_tag: string | null;
  post_type: 'update' | 'testimony' | 'thank_you' | 'announcement' | 'transparency' | 'vote';
  body: string;
  image_url: string | null;
  likes: number;
  comments: number;
  created_at: string;
  // Joined data
  author?: DemoUser;
}

// Helper to cast database response to typed DemoPost
function castToDemoPost(data: any): DemoPost {
  return {
    ...data,
    post_type: data.post_type as 'update' | 'testimony' | 'thank_you' | 'announcement' | 'transparency' | 'vote',
  };
}

// Create a new post
export async function createPost(data: {
  author_id: string;
  body: string;
  post_type?: 'update' | 'testimony' | 'thank_you' | 'announcement' | 'transparency' | 'vote';
  seedbase_tag?: string;
  mission_tag?: string;
  image_url?: string;
}): Promise<DemoPost | null> {
  const { data: post, error } = await supabase
    .from('demo_posts')
    .insert({
      author_id: data.author_id,
      body: data.body,
      post_type: data.post_type || 'update',
      seedbase_tag: data.seedbase_tag,
      mission_tag: data.mission_tag,
      image_url: data.image_url,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  
  return castToDemoPost(post);
}

// Get posts with pagination
export async function getPosts(limit = 20, offset = 0): Promise<DemoPost[]> {
  const { data, error } = await supabase
    .from('demo_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error getting posts:', error);
    return [];
  }
  
  // Fetch author info for each post
  const posts = await Promise.all(
    (data || []).map(async (post) => {
      const author = post.author_id ? await getUserById(post.author_id) : null;
      return {
        ...castToDemoPost(post),
        author: author || undefined,
      };
    })
  );
  
  return posts;
}

// Get posts by author
export async function getPostsByAuthor(authorId: string, limit = 20): Promise<DemoPost[]> {
  const { data, error } = await supabase
    .from('demo_posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error getting posts by author:', error);
    return [];
  }
  
  const author = await getUserById(authorId);
  
  return (data || []).map(post => ({
    ...castToDemoPost(post),
    author: author || undefined,
  }));
}

// Like a post (simple increment without RPC)
export async function likePost(postId: string): Promise<boolean> {
  // Get current likes
  const { data: post, error: fetchError } = await supabase
    .from('demo_posts')
    .select('likes')
    .eq('id', postId)
    .single();
  
  if (fetchError || !post) {
    console.error('Error fetching post for like:', fetchError);
    return false;
  }
  
  // Increment likes
  const { error: updateError } = await supabase
    .from('demo_posts')
    .update({ likes: (post.likes || 0) + 1 })
    .eq('id', postId);
  
  if (updateError) {
    console.error('Error updating likes:', updateError);
    return false;
  }
  
  return true;
}

// Get post by ID
export async function getPostById(postId: string): Promise<DemoPost | null> {
  const { data, error } = await supabase
    .from('demo_posts')
    .select('*')
    .eq('id', postId)
    .single();
  
  if (error) {
    console.error('Error getting post:', error);
    return null;
  }
  
  const author = data.author_id ? await getUserById(data.author_id) : null;
  
  return {
    ...castToDemoPost(data),
    author: author || undefined,
  };
}

// Count posts
export async function countPosts(): Promise<number> {
  const { count, error } = await supabase
    .from('demo_posts')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error counting posts:', error);
    return 0;
  }
  
  return count || 0;
}
