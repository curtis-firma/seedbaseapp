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
  // Additional posts for richer feed
  {
    username: 'bob',
    body: 'Just witnessed the solar panel installation in rural Honduras. 12 homes now have electricity for the first time! ⚡',
    post_type: 'update',
    mission_tag: 'Solar Power Initiative',
  },
  {
    username: 'iris',
    body: 'My first distribution arrived today. Knowing exactly where my giving goes changes everything. 🙌',
    post_type: 'testimony',
    seedbase_tag: 'Hope Collective',
  },
  {
    username: 'jack',
    body: 'Been an activator for 6 months now. The transparency here is unlike anything I\'ve seen in traditional giving.',
    post_type: 'testimony',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'liam',
    body: 'Quarterly transparency report: 94% of all seeds went directly to mission work. Only 6% operational costs. 📊',
    post_type: 'transparency',
    seedbase_tag: 'Community Trust',
  },
  {
    username: 'mia',
    body: 'On the ground in Guatemala City. Medical supplies just arrived for the clinic renovation! 🏥',
    post_type: 'update',
    mission_tag: 'Health First Initiative',
  },
  {
    username: 'noah',
    body: 'Raised my monthly commitment from $25 to $100. When you see the impact, you want to do more.',
    post_type: 'update',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'olivia',
    body: 'The community garden project is thriving! 30 families now growing their own vegetables. 🥕🌽',
    post_type: 'update',
    mission_tag: 'Food Security Project',
  },
  {
    username: 'peter',
    body: 'New mission proposal under review: Youth Mentorship Program in Chicago. Voting opens next week!',
    post_type: 'announcement',
    seedbase_tag: 'Community Trust',
  },
  {
    username: 'quinn',
    body: 'Just received my SeedKey! Ready to start my giving journey with purpose. 🔑',
    post_type: 'update',
    seedbase_tag: 'Hope Collective',
  },
  {
    username: 'ruby',
    body: 'Thank you to all 47 activators who made the water well possible. Clean water now flows! 💧',
    post_type: 'thank_you',
    mission_tag: 'Clean Water Initiative',
  },
  {
    username: 'sam',
    body: 'The best part? I can track every dollar. No more wondering if my giving made a difference.',
    post_type: 'testimony',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'tina',
    body: 'First time voting on mission allocation. This is what participatory giving looks like! 🗳️',
    post_type: 'update',
    seedbase_tag: 'Community Trust',
  },
  {
    username: 'uma',
    body: 'End of month distribution: $8,750 to Education Forward, $6,200 to Health First, $4,100 to Food Security.',
    post_type: 'transparency',
    seedbase_tag: 'Community Trust',
  },
  {
    username: 'victor',
    body: 'Visited the school we helped build. The kids\' smiles say it all. This is why we seed. 📸',
    post_type: 'testimony',
    mission_tag: 'Education Forward',
  },
  {
    username: 'wendy',
    body: 'Breaking ground on the new community center next week! 18 months of planning, finally happening. 🏗️',
    post_type: 'announcement',
    mission_tag: 'Community Trust',
  },
  {
    username: 'xavier',
    body: 'Set up automatic monthly seeding. Set it and forget it - except I love checking in on the impact!',
    post_type: 'update',
    seedbase_tag: 'Hope Collective',
  },
  {
    username: 'yuki',
    body: 'The accountability here is refreshing. Every transaction visible, every impact measurable. 📈',
    post_type: 'testimony',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'zara',
    body: 'Mission milestone reached: 1,000 meals distributed this quarter! Thank you, activators! 🍲',
    post_type: 'transparency',
    mission_tag: 'Food Security Project',
  },
  {
    username: 'marco',
    body: 'Live from the field: Training session for local farmers on sustainable agriculture techniques. 🌾',
    post_type: 'update',
    mission_tag: 'Food Security Project',
  },
  {
    username: 'luna',
    body: 'Connected with @bob today about the solar project. Love how this community brings givers together!',
    post_type: 'update',
    seedbase_tag: 'Hope Collective',
  },
  {
    username: 'river',
    body: 'Three months in and I\'ve never felt more connected to my giving. This is the future of philanthropy.',
    post_type: 'testimony',
    seedbase_tag: 'Global Missions Fund',
  },
  {
    username: 'sky',
    body: 'Provision pool update: 15% allocated to emergency relief fund, ready for rapid deployment when needed.',
    post_type: 'transparency',
    seedbase_tag: 'Community Trust',
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
