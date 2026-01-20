import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Key, FileText, TrendingUp, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPostsByAuthor, DemoPost } from '@/lib/supabase/postsApi';
import { getCommitmentsByUserId, DemoCommitment } from '@/lib/supabase/commitmentsApi';
import { getAllKeysByUserId, DemoKey } from '@/lib/supabase/demoApi';
import { format } from 'date-fns';

// Stats card component
function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center p-3 bg-muted/50 rounded-xl">
      <Icon className="w-4 h-4 text-muted-foreground mb-1" />
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

// Post item component
function PostItem({ post }: { post: DemoPost }) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <p className="text-sm text-foreground">{post.body}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
          <span>·</span>
          <span>{post.likes} likes</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Commitment item component
function CommitmentItem({ commitment }: { commitment: DemoCommitment }) {
  const impactPerDollar = 0.45;
  const estimatedImpact = Math.round(commitment.amount * impactPerDollar);
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-primary">${commitment.amount}</span>
          <Badge variant={commitment.status === 'active' ? 'default' : 'secondary'}>
            {commitment.status}
          </Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Committed for {commitment.years} year{commitment.years > 1 ? 's' : ''}</p>
          {commitment.unlocks_at && (
            <p>Unlocks: {format(new Date(commitment.unlocks_at), 'MMM yyyy')}</p>
          )}
          <p className="text-emerald-600 font-medium">Est. Impact: {estimatedImpact} lives</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Key item component
function KeyItem({ keyData }: { keyData: DemoKey }) {
  const keyColors = {
    SeedKey: 'from-emerald-400 to-green-500',
    BaseKey: 'from-blue-400 to-indigo-500',
    MissionKey: 'from-orange-400 to-amber-500',
  };
  
  const keyEmojis = {
    SeedKey: '🌱',
    BaseKey: '🔵',
    MissionKey: '🟠',
  };
  
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${keyColors[keyData.key_type]} flex items-center justify-center text-lg`}>
              {keyEmojis[keyData.key_type]}
            </div>
            <div>
              <p className="font-semibold">{keyData.key_type}</p>
              <p className="text-xs text-muted-foreground">{keyData.display_id}</p>
            </div>
          </div>
          <Badge variant={keyData.status === 'active' ? 'default' : 'outline'}>
            {keyData.status === 'active' ? '✓ Active' : 'Inactive'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, username, displayName, avatarUrl, activeRole } = useUser();
  
  const [posts, setPosts] = useState<DemoPost[]>([]);
  const [commitments, setCommitments] = useState<DemoCommitment[]>([]);
  const [keys, setKeys] = useState<DemoKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      if (!user?.id) return;
      
      setLoading(true);
      const [postsData, commitmentsData, keysData] = await Promise.all([
        getPostsByAuthor(user.id),
        getCommitmentsByUserId(user.id),
        getAllKeysByUserId(user.id),
      ]);
      
      setPosts(postsData);
      setCommitments(commitmentsData);
      setKeys(keysData);
      setLoading(false);
    }
    
    loadProfileData();
  }, [user?.id]);

  // Calculate stats
  const totalCommitted = commitments.reduce((sum, c) => sum + c.amount, 0);
  const impactPerDollar = 0.45;
  const totalImpact = Math.round(totalCommitted * impactPerDollar);
  const postsCount = posts.length;
  const activeKeysCount = keys.filter(k => k.status === 'active').length;

  const displayAvatar = avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;

  const roleBadgeColors = {
    activator: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    trustee: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    envoy: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold">Profile</span>
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/settings')}>
            <Edit2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-6 py-8"
      >
        <Avatar className="w-24 h-24 border-4 border-primary/20 mb-4">
          <AvatarImage src={displayAvatar} alt={displayName || username} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {(displayName || username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <h1 className="text-xl font-bold">{displayName || username}</h1>
        <p className="text-muted-foreground">@{username}</p>
        
        <Badge 
          variant="outline" 
          className={`mt-2 capitalize ${roleBadgeColors[activeRole as keyof typeof roleBadgeColors] || roleBadgeColors.activator}`}
        >
          {activeRole}
        </Badge>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2 px-4 mb-6"
      >
        <StatCard label="Committed" value={`$${totalCommitted}`} icon={Sparkles} />
        <StatCard label="Impact" value={totalImpact} icon={TrendingUp} />
        <StatCard label="Posts" value={postsCount} icon={FileText} />
        <StatCard label="Keys" value={activeKeysCount} icon={Key} />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4"
      >
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="commitments">Commitments</TabsTrigger>
            <TabsTrigger value="keys">Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostItem key={post.id} post={post} />)
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No posts yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="commitments" className="mt-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 bg-muted/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : commitments.length > 0 ? (
              commitments.map((commitment) => (
                <CommitmentItem key={commitment.id} commitment={commitment} />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No commitments yet</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/app/wallet')}
                >
                  Make Your First Commitment
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="keys" className="mt-0">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : keys.length > 0 ? (
              keys.map((key) => <KeyItem key={key.id} keyData={key} />)
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No keys activated yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
