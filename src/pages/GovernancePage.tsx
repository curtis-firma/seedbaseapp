import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, Megaphone, Users, TrendingUp, Lock, Check, 
  ChevronRight, Share2, Copy, ExternalLink, Calendar
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useHaptic } from '@/hooks/useHaptic';
import { useSocialHandles } from '@/hooks/useSocialHandles';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { mockVotes, activatedUsers, projectionData, voteHistory } from '@/data/mockData';
import { ShareVoteModal } from '@/components/governance/ShareVoteModal';

export default function GovernancePage() {
  const { user } = useUser();
  const haptic = useHaptic();
  const navigate = useNavigate();
  const { xHandle, baseHandle, hasHandles } = useSocialHandles();
  
  const [votes, setVotes] = useState(mockVotes);
  const [seedAmount, setSeedAmount] = useState(100);
  const [showShareModal, setShowShareModal] = useState(false);
  const [lastVotedProposal, setLastVotedProposal] = useState<{ title: string; voteType: 'yes' | 'no' } | null>(null);
  
  const hasBaseKey = user?.keys?.some(k => k.type === 'BaseKey' && k.isActive) ?? false;

  const handleVote = (voteId: string, voteType: 'yes' | 'no') => {
    if (!hasBaseKey) return;
    haptic.medium();
    
    const vote = votes.find(v => v.id === voteId);
    
    setVotes(prev => prev.map(v => {
      if (v.id === voteId) {
        return {
          ...v,
          hasVoted: true,
          userVote: voteType,
          yesVotes: voteType === 'yes' ? v.yesVotes + 1 : v.yesVotes,
          noVotes: voteType === 'no' ? v.noVotes + 1 : v.noVotes,
        };
      }
      return v;
    }));
    
    toast.success(`Vote cast for ${voteType === 'yes' ? 'Yes' : 'No'}!`);
    
    // Show share modal after voting
    if (vote) {
      setLastVotedProposal({ title: vote.title, voteType });
      setTimeout(() => setShowShareModal(true), 500);
    }
  };

  const handleCopyReferralLink = () => {
    haptic.light();
    const referralCode = user?.id?.slice(0, 8) || 'SEED123';
    navigator.clipboard.writeText(`https://seedbase.app/join?ref=${referralCode}`);
    toast.success('Referral link copied!');
  };

  // Projection calculation
  const projectedImpact = seedAmount * projectionData.impactPerDollar;
  const projectedGrowth = seedAmount * projectionData.networkMultiplier;

  // Chart data for projections
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    value: seedAmount * Math.pow(1 + projectionData.monthlyGrowthRate, i + 1),
    impact: (seedAmount * projectionData.impactPerDollar) * (1 + i * 0.15),
  }));

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0000ff]/10 flex items-center justify-center">
              <Vote className="h-5 w-5 text-[#0000ff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Governance</h1>
              <p className="text-sm text-muted-foreground">Vote, amplify, and grow your network</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="votes" className="w-full">
        <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-2">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="votes" className="text-xs">Votes</TabsTrigger>
            <TabsTrigger value="amplify" className="text-xs">Amplify</TabsTrigger>
            <TabsTrigger value="network" className="text-xs">Network</TabsTrigger>
            <TabsTrigger value="projections" className="text-xs">Projections</TabsTrigger>
          </TabsList>
        </div>

        {/* Votes Tab */}
        <TabsContent value="votes" className="px-4 py-4 space-y-4">
          {!hasBaseKey && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-muted/50 border border-border/50 flex items-center gap-3"
            >
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">BaseKey Required</p>
                <p className="text-xs text-muted-foreground">Get your BaseKey to vote on proposals</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app/wallet')}
                className="px-3 py-1.5 rounded-lg bg-[#0000ff] text-white text-sm font-medium"
              >
                Get Key
              </motion.button>
            </motion.div>
          )}

          <h2 className="font-semibold text-lg">Active Proposals</h2>
          
          {votes.map((vote, i) => {
            const totalVotes = vote.yesVotes + vote.noVotes;
            const yesPercent = totalVotes > 0 ? (vote.yesVotes / totalVotes) * 100 : 50;
            
            return (
              <motion.div
                key={vote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-card border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold">{vote.title}</h3>
                    {vote.description && (
                      <p className="text-sm text-muted-foreground mt-1">{vote.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{vote.deadline}</span>
                </div>

                {/* Progress */}
                <div className="h-3 rounded-full overflow-hidden flex bg-muted mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${yesPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#0000ff]"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - yesPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-destructive"
                  />
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-[#0000ff] font-medium">Yes: {vote.yesVotes}</span>
                  <span className="text-destructive font-medium">No: {vote.noVotes}</span>
                </div>

                {/* Vote Buttons */}
                {vote.hasVoted ? (
                  <div className="text-center py-2 text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Check className="h-4 w-4 text-[#0000ff]" />
                    You voted <span className={vote.userVote === 'yes' ? 'text-[#0000ff]' : 'text-destructive'}>
                      {vote.userVote === 'yes' ? 'Yes' : 'No'}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: hasBaseKey ? 0.95 : 1 }}
                      onClick={() => handleVote(vote.id, 'yes')}
                      disabled={!hasBaseKey}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all",
                        hasBaseKey
                          ? "bg-[#0000ff] text-white shadow-[0_0_12px_rgba(0,0,255,0.3)] hover:shadow-[0_0_20px_rgba(0,0,255,0.5)]"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Vote Yes
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: hasBaseKey ? 0.95 : 1 }}
                      onClick={() => handleVote(vote.id, 'no')}
                      disabled={!hasBaseKey}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl font-medium text-sm transition-all",
                        hasBaseKey
                          ? "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      )}
                    >
                      Vote No
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Vote History */}
          <h2 className="font-semibold text-lg pt-4">Vote History</h2>
          {voteHistory.map((vote, i) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl bg-muted/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  vote.result === 'passed' ? "bg-[#0000ff]/10" : "bg-destructive/10"
                )}>
                  {vote.result === 'passed' ? (
                    <Check className="h-4 w-4 text-[#0000ff]" />
                  ) : (
                    <span className="text-destructive text-xs">✗</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{vote.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {vote.yesVotes} yes · {vote.noVotes} no · {vote.date}
                  </p>
                </div>
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                vote.result === 'passed' ? "bg-[#0000ff]/10 text-[#0000ff]" : "bg-destructive/10 text-destructive"
              )}>
                {vote.result === 'passed' ? 'Passed' : 'Failed'}
              </span>
            </motion.div>
          ))}
        </TabsContent>

        {/* Amplify Tab */}
        <TabsContent value="amplify" className="px-4 py-4 space-y-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-[#0000ff]/20 to-[#0000ff]/5 border border-[#0000ff]/20 text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0000ff]/20 flex items-center justify-center mb-4">
              <Megaphone className="h-8 w-8 text-[#0000ff]" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Amplify Impact</h2>
            <p className="text-muted-foreground mb-4">
              Share your generosity journey and invite others to join the movement
            </p>
          </motion.div>

          {/* Referral Link */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Your Referral Link
            </h3>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm truncate">
                seedbase.app/join?ref={user?.id?.slice(0, 8) || 'SEED123'}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyReferralLink}
                className="px-3 py-2 rounded-lg bg-[#0000ff] text-white"
              >
                <Copy className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Your Stats */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-3">Your Amplification Stats</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-[#0000ff]">12</p>
                <p className="text-xs text-muted-foreground">Posts Shared</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-[#0000ff]">89</p>
                <p className="text-xs text-muted-foreground">Link Clicks</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-2xl font-bold text-[#0000ff]">{activatedUsers.length}</p>
                <p className="text-xs text-muted-foreground">Activated</p>
              </div>
            </div>
          </div>

          {/* Social Handles */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-3">Connected Platforms</h3>
            {hasHandles ? (
              <div className="space-y-2">
                {xHandle && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <span className="font-bold">𝕏</span>
                    <span className="text-sm">@{xHandle.replace('@', '')}</span>
                  </div>
                )}
                {baseHandle && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <span className="text-[#0000ff] font-bold">◆</span>
                    <span className="text-sm">@{baseHandle.replace('@', '')}</span>
                  </div>
                )}
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/app/settings')}
                className="w-full p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                Connect your social handles
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Quick Share Templates */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-3">Quick Share Templates</h3>
            <div className="space-y-2">
              {[
                "Just voted on @seedbase! Shaping how generosity flows 🌱",
                "My seed is growing... Watch my impact at seedbase.app 🚀",
                "Generosity onchain. Transparency everywhere. Join me 💙",
              ].map((template, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    haptic.light();
                    navigator.clipboard.writeText(template);
                    toast.success('Caption copied!');
                  }}
                  className="w-full p-3 rounded-lg bg-muted/30 text-sm text-left hover:bg-muted/50 transition-colors"
                >
                  {template}
                </motion.button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="px-4 py-4 space-y-4">
          {/* Leaderboard Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0000ff]/10 to-[#0000ff]/5 border border-[#0000ff]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0000ff]/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#0000ff]" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Top Activators</h2>
                <p className="text-xs text-muted-foreground">Leaderboard by network impact</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {[...activatedUsers]
                .sort((a, b) => b.seedCommitted - a.seedCommitted)
                .slice(0, 3)
                .map((user, i) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "p-3 rounded-xl flex items-center gap-3",
                      i === 0 ? "bg-[#FFD700]/20 border border-[#FFD700]/30" :
                      i === 1 ? "bg-[#C0C0C0]/20 border border-[#C0C0C0]/30" :
                      "bg-[#CD7F32]/20 border border-[#CD7F32]/30"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      i === 0 ? "bg-[#FFD700] text-black" :
                      i === 1 ? "bg-[#C0C0C0] text-black" :
                      "bg-[#CD7F32] text-white"
                    )}>
                      {i + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-[#0000ff]/10 text-[#0000ff]">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.handle}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0000ff]">${user.seedCommitted.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">seed value</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">People You've Activated</h2>
            <span className="text-sm text-muted-foreground">{activatedUsers.length} total</span>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <p className="text-3xl font-bold text-[#0000ff]">
                ${activatedUsers.reduce((sum, u) => sum + u.seedCommitted, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Network Seed Value</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <p className="text-3xl font-bold text-[#0000ff]">2.3x</p>
              <p className="text-sm text-muted-foreground">Network Multiplier</p>
            </div>
          </div>

          {/* Activated Users List */}
          <div className="space-y-2">
            {activatedUsers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-xl bg-card border border-border/50 flex items-center gap-3"
              >
                <Avatar className="h-11 w-11">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#0000ff]/10 text-[#0000ff]">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.handle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm text-[#0000ff]">${user.seedCommitted.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {activatedUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No activations yet</p>
              <p className="text-sm text-muted-foreground">Share your referral link to grow your network</p>
            </div>
          )}
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="px-4 py-4 space-y-4">
          <h2 className="font-semibold text-lg">Impact Projections</h2>

          {/* Seed Amount Selector */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-medium mb-3">If you commit...</h3>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSeedAmount(Math.max(10, seedAmount - 50))}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg font-bold"
              >
                −
              </motion.button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-[#0000ff]">${seedAmount}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setSeedAmount(seedAmount + 50)}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg font-bold"
              >
                +
              </motion.button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {[50, 100, 250, 500].map((amt) => (
                <motion.button
                  key={amt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic.light();
                    setSeedAmount(amt);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    seedAmount === amt 
                      ? "bg-[#0000ff] text-white" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  ${amt}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Projection Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0000ff]/10 to-transparent border border-[#0000ff]/20">
              <TrendingUp className="h-5 w-5 text-[#0000ff] mb-2" />
              <p className="text-2xl font-bold">${projectedGrowth.toFixed(0)}</p>
              <p className="text-sm text-muted-foreground">Projected Value (12mo)</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#0000ff]/10 to-transparent border border-[#0000ff]/20">
              <Users className="h-5 w-5 text-[#0000ff] mb-2" />
              <p className="text-2xl font-bold">{Math.round(projectedImpact)}</p>
              <p className="text-sm text-muted-foreground">Lives Impacted</p>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h3 className="font-semibold mb-4">12-Month Growth Projection</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0000ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0000ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(0)}`, 'Value']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0000ff" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Multiplier Explanation */}
          <div className="p-4 rounded-xl bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Based on <span className="font-semibold text-foreground">{(projectionData.monthlyGrowthRate * 100).toFixed(0)}% monthly growth</span> and a{' '}
              <span className="font-semibold text-foreground">{projectionData.networkMultiplier}x network multiplier</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Vote Modal */}
      {lastVotedProposal && (
        <ShareVoteModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          voteType={lastVotedProposal.voteType}
          proposalTitle={lastVotedProposal.title}
        />
      )}
    </div>
  );
}
