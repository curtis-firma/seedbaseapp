import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Target, FileText, Upload, CheckCircle2
} from 'lucide-react';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
import { SwipeableTabContent } from '@/components/shared/SwipeableTabContent';
import { KeyGatedCard } from '@/components/shared/KeyGatedCard';
import { TransparencyDashboard } from '@/components/seedbase/TransparencyDashboard';
import { SeedbaseCommandBar } from '@/components/seedbase/SeedbaseCommandBar';
import { SeedbaseStatusPanel, type StatusData } from '@/components/seedbase/SeedbaseStatusPanel';
import { SeedbaseActivityStream, initialSeedbaseActivity, type ActivityItem } from '@/components/seedbase/SeedbaseActivityStream';
import { CommitSeedModal } from '@/components/seedbase/modals/CommitSeedModal';
import { GiveToProvisionModal } from '@/components/seedbase/modals/GiveToProvisionModal';
import { LaunchMissionModal } from '@/components/seedbase/modals/LaunchMissionModal';
import { AllocateProvisionModal } from '@/components/seedbase/modals/AllocateProvisionModal';
import { ApproveEnvoyModal } from '@/components/seedbase/modals/ApproveEnvoyModal';
import { PostUpdateModal } from '@/components/seedbase/modals/PostUpdateModal';
import { SubmitHarvestModal } from '@/components/seedbase/modals/SubmitHarvestModal';
import { RequestFundsModal } from '@/components/seedbase/modals/RequestFundsModal';
import { VotePendingModal } from '@/components/seedbase/modals/VotePendingModal';
import { MissionsDetailModal } from '@/components/seedbase/modals/MissionsDetailModal';
import { ProvisionDetailModal } from '@/components/seedbase/modals/ProvisionDetailModal';
import { CommitmentsDetailModal } from '@/components/seedbase/modals/CommitmentsDetailModal';
import { DistributionDetailModal } from '@/components/seedbase/modals/DistributionDetailModal';
import { useUser } from '@/contexts/UserContext';
import { mockSeedbases, mockMissions, demoProfiles } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  createCommitmentFeedItem, 
  createMissionFeedItem, 
  createAllocationFeedItem,
  createHarvestFeedItem,
  createEnvoyUpdateFeedItem
} from '@/lib/seedbaseFeedIntegration';

const roleTabs = {
  activator: ['Commit', 'Track', 'Giving'],
  trustee: ['Missions', 'Giving', 'Review'],
  envoy: ['My Missions', 'Submit', 'Giving'],
};

const STORAGE_KEY = 'seedbase-activity';
const STATUS_STORAGE_KEY = 'seedbase-status';

export default function SeedbasePage() {
  const { viewRole, user, displayName, username, avatarUrl } = useUser();
  const tabs = roleTabs[viewRole];
  const [activeTab, setActiveTab] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Activity stream state with persistence
  const [activity, setActivity] = useState<ActivityItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialSeedbaseActivity;
  });

  // Status panel state with persistence
  const [statusData, setStatusData] = useState<StatusData>(() => {
    const stored = localStorage.getItem(STATUS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      missions: 5,
      votes: 2,
      nextDistribution: '~$450',
      provisionPool: 12500,
      recentCommitments: 2400,
    };
  });

  // Persist activity
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
  }, [activity]);

  // Persist status
  useEffect(() => {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statusData));
  }, [statusData]);

  const handleAction = (actionId: string) => {
    setActiveModal(actionId);
  };

  // User info for feed integration
  const userInfo = {
    userName: displayName || username || 'User',
    userAvatar: avatarUrl || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`,
    userHandle: username || 'user',
  };

  const handleTileClick = (tileId: string) => {
    // Map tile IDs to detail modals
    const tileModalMap: Record<string, string> = {
      'missions': 'missions-detail',
      'votes': 'vote',
      'distribution': 'distribution-detail',
      'provision': 'provision-detail',
      'commitments': 'commitments-detail',
    };
    setActiveModal(tileModalMap[tileId] || null);
  };

  const addActivity = (newActivity: ActivityItem) => {
    setActivity(prev => [newActivity, ...prev]);
  };

  // Enhanced handlers with feed integration
  const handleCommitSuccess = (activity: ActivityItem) => {
    addActivity(activity);
    if (activity.amount) {
      setStatusData(prev => ({ ...prev, recentCommitments: prev.recentCommitments + activity.amount! }));
      // Add to global feed
      createCommitmentFeedItem({
        amount: activity.amount,
        years: 3, // Default
        ...userInfo,
      });
    }
  };

  const handleMissionCreated = (mission?: { name: string; goal: number; envoy: string }) => {
    setStatusData(prev => ({ ...prev, missions: prev.missions + 1 }));
    if (mission) {
      createMissionFeedItem({
        missionName: mission.name,
        goal: mission.goal,
        envoyName: mission.envoy,
        ...userInfo,
      });
    }
  };

  const handleAllocationSuccess = (activity: ActivityItem, amount: number) => {
    addActivity(activity);
    setStatusData(prev => ({ ...prev, provisionPool: prev.provisionPool - amount }));
    // Extract mission name from activity description
    const missionMatch = activity.description.match(/to (.+)$/);
    createAllocationFeedItem({
      missionName: missionMatch ? missionMatch[1] : 'a mission',
      amount,
      ...userInfo,
    });
  };

  const handleHarvestSuccess = (activity: ActivityItem) => {
    addActivity(activity);
    const weekMatch = activity.description.match(/Week (\d+)/);
    createHarvestFeedItem({
      missionName: 'Active Mission',
      weekNumber: weekMatch ? weekMatch[1] : '1',
      ...userInfo,
    });
  };

  const handlePostSuccess = (activity: ActivityItem) => {
    addActivity(activity);
    createEnvoyUpdateFeedItem({
      postType: 'update',
      content: activity.description,
      ...userInfo,
    });
  };

  const handleVotesUpdated = (count: number) => {
    setStatusData(prev => ({ ...prev, votes: count }));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Page Title - bold and confident */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold">Command Center</h1>
        <p className="text-sm text-muted-foreground capitalize">{viewRole} Control Panel</p>
      </div>

      {/* Command Bar */}
      <SeedbaseCommandBar onAction={handleAction} activeVotes={statusData.votes} />

      {/* Status Panel */}
      <SeedbaseStatusPanel data={statusData} onTileClick={handleTileClick} />

      {/* Tabs */}
      <div className="px-4 py-2">
        <SwipeTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <SwipeableTabContent
          activeTab={activeTab}
          tabCount={tabs.length}
          onTabChange={setActiveTab}
        >
          <div className="space-y-4">
            {viewRole === 'activator' && <ActivatorContent tab={activeTab} />}
            {viewRole === 'trustee' && <TrusteeContent tab={activeTab} />}
            {viewRole === 'envoy' && <EnvoyContent tab={activeTab} />}
          </div>
        </SwipeableTabContent>
      </div>

      {/* Activity Stream */}
      <SeedbaseActivityStream items={activity} />

      {/* Modals */}
      <CommitSeedModal 
        open={activeModal === 'commit-seed'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={handleCommitSuccess} 
      />
      <GiveToProvisionModal 
        open={activeModal === 'give-provision'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity} 
      />
      <LaunchMissionModal 
        open={activeModal === 'launch-mission'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity}
        onMissionCreated={handleMissionCreated}
      />
      <AllocateProvisionModal 
        open={activeModal === 'allocate-provision'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={handleAllocationSuccess}
        provisionBalance={statusData.provisionPool}
      />
      <ApproveEnvoyModal 
        open={activeModal === 'approve-envoy'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity} 
      />
      <PostUpdateModal 
        open={activeModal === 'post-update'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={handlePostSuccess} 
      />
      <SubmitHarvestModal 
        open={activeModal === 'submit-harvest'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={handleHarvestSuccess} 
      />
      <RequestFundsModal 
        open={activeModal === 'request-funds'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity} 
      />
      <VotePendingModal 
        open={activeModal === 'vote'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity}
        onVotesUpdated={handleVotesUpdated}
      />

      {/* Detail Modals */}
      <MissionsDetailModal
        open={activeModal === 'missions-detail'}
        onClose={() => setActiveModal(null)}
        onLaunchMission={() => setActiveModal('launch-mission')}
      />
      <ProvisionDetailModal
        open={activeModal === 'provision-detail'}
        onClose={() => setActiveModal(null)}
        balance={statusData.provisionPool}
        onAllocate={() => setActiveModal('allocate-provision')}
        onGive={() => setActiveModal('give-provision')}
      />
      <CommitmentsDetailModal
        open={activeModal === 'commitments-detail'}
        onClose={() => setActiveModal(null)}
        recentTotal={statusData.recentCommitments}
        onCommitSeed={() => setActiveModal('commit-seed')}
      />
      <DistributionDetailModal
        open={activeModal === 'distribution-detail'}
        onClose={() => setActiveModal(null)}
        estimatedAmount={statusData.nextDistribution}
      />
    </div>
  );
}

function ActivatorContent({ tab }: { tab: number }) {
  if (tab === 0) {
    return (
      <div className="space-y-4">
        {/* Transparency Summary at TOP for Activators (Bug #14) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 to-trust/5 rounded-2xl border border-primary/20 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Transparency Overview</h3>
            <span className="text-xs text-muted-foreground">See all in "Giving" tab</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-card rounded-xl p-2">
              <p className="text-lg font-bold text-primary">$12.5K</p>
              <p className="text-[10px] text-muted-foreground">Pool</p>
            </div>
            <div className="bg-card rounded-xl p-2">
              <p className="text-lg font-bold text-seed">2</p>
              <p className="text-[10px] text-muted-foreground">Votes Open</p>
            </div>
            <div className="bg-card rounded-xl p-2">
              <p className="text-lg font-bold text-trust">5</p>
              <p className="text-[10px] text-muted-foreground">Missions</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/50 shadow-card p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Your Commitment</h3>
              <p className="text-sm text-muted-foreground">Locked for impact</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Total Committed</span>
              <span className="font-semibold">$5,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Total</span>
              <span className="font-semibold">$429,000</span>
            </div>
          </div>
        </motion.div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Active Seedbases</h3>
          <div className="space-y-3">
            {mockSeedbases.map((sb, i) => (
              <motion.div
                key={sb.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4"
              >
                <div className="text-3xl">{sb.logo}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{sb.name}</h4>
                  <p className="text-sm text-muted-foreground">{sb.activeMissions} active missions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${sb.totalCommitted.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">committed</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === 1) {
    return (
      <div className="space-y-4">
        <StatCard label="Total Committed" value="$5,000" change="+12%" />
        <StatCard label="Distributions Received" value="$450" change="+$125 this month" />
        <StatCard label="Impact Score" value="847" change="Top 15%" />
      </div>
    );
  }

  return <TransparencyDashboard viewMode="activator" />;
}

function TrusteeContent({ tab }: { tab: number }) {
  const { isKeyActive } = useUser();
  const hasBaseKey = isKeyActive('BaseKey');

  if (tab === 0) {
    return (
      <div className="space-y-4">
        {hasBaseKey ? (
          <>
            <h3 className="font-semibold text-lg">Active Missions</h3>
            {mockMissions.map((mission, i) => (
              <MissionCard key={mission.id} mission={mission} index={i} />
            ))}
          </>
        ) : (
          <KeyGatedCard requiredKey="BaseKey">
            <div className="p-8">
              <MissionCard mission={mockMissions[0]} index={0} />
            </div>
          </KeyGatedCard>
        )}
      </div>
    );
  }

  if (tab === 1) {
    return <TransparencyDashboard viewMode="trustee" />;
  }

  return (
    <KeyGatedCard requiredKey="BaseKey">
      <div className="space-y-4 p-5">
        <h3 className="font-semibold text-lg">Harvest Reviews</h3>
        <div className="bg-muted/30 rounded-xl p-4 text-center">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No pending reviews</p>
        </div>
      </div>
    </KeyGatedCard>
  );
}

function EnvoyContent({ tab }: { tab: number }) {
  if (tab === 0) {
    return (
      <KeyGatedCard requiredKey="MissionKey" unlockMessage="Get approved as an Envoy to execute missions">
        <div className="space-y-4 p-5">
          <h3 className="font-semibold text-lg">My Active Missions</h3>
          <MissionCard mission={mockMissions[0]} index={0} showProgress />
        </div>
      </KeyGatedCard>
    );
  }

  if (tab === 1) {
    return (
      <KeyGatedCard requiredKey="MissionKey">
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-envoy flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Submit Harvest</h3>
              <p className="text-sm text-muted-foreground">Report your impact</p>
            </div>
          </div>
        </div>
      </KeyGatedCard>
    );
  }

  return <TransparencyDashboard viewMode="envoy" />;
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl border border-border/50 p-5 transition-shadow hover:shadow-card cursor-pointer"
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{value}</p>
      <p className="text-sm text-primary font-medium">{change}</p>
    </motion.div>
  );
}

function MissionCard({ mission, index, showProgress = false }: { mission: any; index: number; showProgress?: boolean }) {
  const completedMilestones = mission.milestones.filter((m: any) => m.isCompleted).length;
  const progress = (mission.fundingRaised / mission.fundingGoal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-2xl border border-border/50 p-5"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl gradient-base flex items-center justify-center">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{mission.title}</h4>
          <p className="text-sm text-muted-foreground">{mission.seedbaseName}</p>
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          mission.status === 'active' && "bg-primary/10 text-primary",
          mission.status === 'completed' && "bg-muted text-muted-foreground"
        )}>
          {mission.status}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Funding Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full gradient-base rounded-full"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>${mission.fundingRaised.toLocaleString()}</span>
          <span>${mission.fundingGoal.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">
          {completedMilestones}/{mission.milestones.length} milestones completed
        </span>
      </div>
    </motion.div>
  );
}
