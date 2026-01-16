// Seed Demo Data - Populate database with demo users on first run
import { supabase } from '@/integrations/supabase/client';
import { generateDisplayId, getKeyTypeFromRole, countDemoUsers } from './demoApi';

const DEMO_USERS = [
  { username: 'alice', display_name: 'Alice Chen', role: 'activator' },
  { username: 'bob', display_name: 'Bob Martinez', role: 'activator' },
  { username: 'carol', display_name: 'Carol Williams', role: 'trustee' },
  { username: 'david', display_name: 'David Kim', role: 'envoy' },
  { username: 'emma', display_name: 'Emma Johnson', role: 'activator' },
  { username: 'frank', display_name: 'Frank Brown', role: 'trustee' },
  { username: 'grace', display_name: 'Grace Lee', role: 'activator' },
  { username: 'henry', display_name: 'Henry Davis', role: 'envoy' },
  { username: 'iris', display_name: 'Iris Wilson', role: 'activator' },
  { username: 'jack', display_name: 'Jack Taylor', role: 'activator' },
  { username: 'kate', display_name: 'Kate Anderson', role: 'trustee' },
  { username: 'liam', display_name: 'Liam Thomas', role: 'activator' },
  { username: 'mia', display_name: 'Mia Jackson', role: 'envoy' },
  { username: 'noah', display_name: 'Noah White', role: 'activator' },
  { username: 'olivia', display_name: 'Olivia Harris', role: 'activator' },
  { username: 'peter', display_name: 'Peter Martin', role: 'trustee' },
  { username: 'quinn', display_name: 'Quinn Garcia', role: 'activator' },
  { username: 'ruby', display_name: 'Ruby Robinson', role: 'envoy' },
  { username: 'sam', display_name: 'Sam Clark', role: 'activator' },
  { username: 'tina', display_name: 'Tina Lewis', role: 'activator' },
  { username: 'uma', display_name: 'Uma Rodriguez', role: 'trustee' },
  { username: 'victor', display_name: 'Victor Walker', role: 'activator' },
  { username: 'wendy', display_name: 'Wendy Hall', role: 'envoy' },
  { username: 'xavier', display_name: 'Xavier Allen', role: 'activator' },
  { username: 'yuki', display_name: 'Yuki Young', role: 'activator' },
  { username: 'zara', display_name: 'Zara King', role: 'trustee' },
  { username: 'marco', display_name: 'Marco Polo', role: 'envoy' },
  { username: 'luna', display_name: 'Luna Star', role: 'activator' },
  { username: 'river', display_name: 'River Stone', role: 'activator' },
  { username: 'sky', display_name: 'Sky Blue', role: 'trustee' },
] as const;

const DEMO_POSTS = [
  {
    username: 'alice',
    body: 'Just planted my first seed! Excited to see this mission grow and impact lives in Kenya. 🌱',
    post_type: 'update',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'carol',
    body: 'Our water project in Guatemala reached 500 families this month. Every drop counts! 💧',
    post_type: 'transparency',
    mission_tag: 'Clean Water Initiative',
  },
  {
    username: 'david',
    body: 'Thank you @alice for your generous seed! We distributed food supplies to 50 families today.',
    post_type: 'thank_you',
    mission_tag: 'Food Security Project',
  },
  {
    username: 'emma',
    body: 'Seeing real impact from my contribution. This is what giving should feel like! ✨',
    post_type: 'testimony',
    seedbase_tag: 'Hope Collective',
  },
  {
    username: 'frank',
    body: 'Monthly distribution complete: $12,500 deployed across 3 active missions.',
    post_type: 'transparency',
    seedbase_tag: 'Community Trust',
  },
  {
    username: 'henry',
    body: 'Just completed the school renovation! 200 students now have proper classrooms. 📚',
    post_type: 'update',
    mission_tag: 'Education Forward',
  },
  {
    username: 'grace',
    body: 'Committed another $50 this month. Small seeds, big dreams.',
    post_type: 'update',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'kate',
    body: 'Approved 2 new missions this week. Exciting things coming for healthcare access!',
    post_type: 'announcement',
    seedbase_tag: 'Health First Initiative',
  },
];

// Generate avatar URL using DiceBear API
function getAvatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

// Generate a fake phone number for demo users
function generateDemoPhone(index: number): string {
  return `+1555${String(1000 + index).padStart(4, '0')}`;
}

// Seed demo users if database is empty
export async function seedDemoDataIfEmpty(): Promise<boolean> {
  try {
    const count = await countDemoUsers();
    
    if (count >= 20) {
      console.log('Demo data already seeded, skipping...');
      return false;
    }
    
    console.log('Seeding demo data...');
    
    // Insert demo users
    for (let i = 0; i < DEMO_USERS.length; i++) {
      const userData = DEMO_USERS[i];
      const phone = generateDemoPhone(i);
      const avatarUrl = getAvatarUrl(userData.username);
      
      // Insert user
      const { data: user, error: userError } = await supabase
        .from('demo_users')
        .insert({
          phone,
          username: userData.username,
          display_name: userData.display_name,
          avatar_url: avatarUrl,
          active_role: userData.role,
          onboarding_complete: true,
        })
        .select()
        .single();
      
      if (userError) {
        console.error(`Error creating demo user ${userData.username}:`, userError);
        continue;
      }
      
      // Create wallet
      const walletDisplayId = generateDisplayId(crypto.randomUUID());
      await supabase
        .from('demo_wallets')
        .insert({
          user_id: user.id,
          wallet_type: 'personal',
          display_id: walletDisplayId,
          balance: 25 + Math.floor(Math.random() * 100), // Random balance 25-125
        });
      
      // Create key
      const keyType = getKeyTypeFromRole(userData.role);
      const keyDisplayId = generateDisplayId(crypto.randomUUID());
      await supabase
        .from('demo_keys')
        .insert({
          user_id: user.id,
          key_type: keyType,
          display_id: keyDisplayId,
          status: 'active',
        });
    }
    
    // Get user IDs for posts
    const { data: users } = await supabase
      .from('demo_users')
      .select('id, username');
    
    const userMap = new Map(users?.map(u => [u.username, u.id]) || []);
    
    // Insert demo posts
    for (const postData of DEMO_POSTS) {
      const authorId = userMap.get(postData.username);
      if (!authorId) continue;
      
      await supabase
        .from('demo_posts')
        .insert({
          author_id: authorId,
          body: postData.body,
          post_type: postData.post_type,
          seedbase_tag: postData.seedbase_tag,
          mission_tag: postData.mission_tag,
        });
    }
    
    console.log('Demo data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return false;
  }
}
