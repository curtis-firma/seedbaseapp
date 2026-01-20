import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, TrendingUp, Target, Users, BarChart3, 
  FileText, Upload, CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import { SwipeTabs } from '@/components/shared/SwipeTabs';
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
import { useUser } from '@/contexts/UserContext';
import { mockSeedbases, mockMissions } from '@/data/mockData';
import { cn } from '@/lib/utils';

const roleTabs = {
  activator: ['Commit', 'Track', 'Giving'],
  trustee: ['Missions', 'Giving', 'Review'],
  envoy: ['My Missions', 'Submit', 'Giving'],
};

const STORAGE_KEY = 'seedbase-activity';
const STATUS_STORAGE_KEY = 'seedbase-status';

export default function SeedbasePage() {
  const { viewRole } = useUser();
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

  const handleTileClick = (tileId: string) => {
    if (tileId === 'votes') {
      setActiveModal('vote');
    }
    // Other tiles can open their own modals if needed
  };

  const addActivity = (newActivity: ActivityItem) => {
    setActivity(prev => [newActivity, ...prev]);
  };

  const handleMissionCreated = () => {
    setStatusData(prev => ({ ...prev, missions: prev.missions + 1 }));
  };

  const handleAllocationSuccess = (activity: ActivityItem, amount: number) => {
    addActivity(activity);
    setStatusData(prev => ({ ...prev, provisionPool: prev.provisionPool - amount }));
  };

  const handleVotesUpdated = (count: number) => {
    setStatusData(prev => ({ ...prev, votes: count }));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold">SeedBase Command Center</h1>
              <p className="text-sm text-muted-foreground capitalize">
                {viewRole} Control Panel
              </p>
            </div>
          </div>
        </div>
      </header>

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
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewRole}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {viewRole === 'activator' && <ActivatorContent tab={activeTab} />}
            {viewRole === 'trustee' && <TrusteeContent tab={activeTab} />}
            {viewRole === 'envoy' && <EnvoyContent tab={activeTab} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Activity Stream */}
      <SeedbaseActivityStream items={activity} />

      {/* Modals */}
      <CommitSeedModal 
        open={activeModal === 'commit-seed'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity} 
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
        onSuccess={addActivity} 
      />
      <SubmitHarvestModal 
        open={activeModal === 'submit-harvest'} 
        onClose={() => setActiveModal(null)} 
        onSuccess={addActivity} 
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
    </div>
  );
}

function ActivatorContent({ tab }: { tab: number }) {
  if (tab === 0) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
      className="bg-card rounded-2xl border border-border/50 p-5"
    >
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-primary">{change}</p>
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
