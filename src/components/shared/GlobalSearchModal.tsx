import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Users, Layers, Flag, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchUsers, type DemoUser } from '@/lib/supabase/demoApi';
import { mockSeedbases, mockMissions } from '@/data/mockData';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SeedbaseResult {
  id: string;
  name: string;
  description: string;
  logo: string;
  totalCommitted: number;
}

interface MissionResult {
  id: string;
  title: string;
  description: string;
  status: string;
  raised: number;
  goal: number;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isSearching, setIsSearching] = useState(false);
  const [userResults, setUserResults] = useState<DemoUser[]>([]);
  const [seedbaseResults, setSeedbaseResults] = useState<SeedbaseResult[]>([]);
  const [missionResults, setMissionResults] = useState<MissionResult[]>([]);
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

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUserResults([]);
      setSeedbaseResults([]);
      setMissionResults([]);
      return;
    }

    setIsSearching(true);
    const userId = getCurrentUserId();
    const lowerQuery = searchQuery.toLowerCase();

    try {
      // Search users from database
      const users = await searchUsers(searchQuery, userId || undefined, 20);
      setUserResults(users);

      // Search seedbases (mock data)
      const seedbases = mockSeedbases.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery)
      );
      setSeedbaseResults(seedbases);

      // Search missions (mock data)
      const missions = mockMissions
        .filter(m =>
          m.title.toLowerCase().includes(lowerQuery) ||
          m.description.toLowerCase().includes(lowerQuery)
        )
        .map(m => ({
          id: m.id,
          title: m.title,
          description: m.description,
          status: m.status,
          raised: m.fundingRaised || 0,
          goal: m.fundingGoal || 0,
        }));
      setMissionResults(missions);

    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setUserResults([]);
      setSeedbaseResults([]);
      setMissionResults([]);
    }
  }, [isOpen]);

  const handleResultClick = (type: string, id: string) => {
    haptic.light();
    // For now, just close the modal
    // In a full implementation, this would navigate to the profile/seedbase/mission
    onClose();
  };

  const totalResults = userResults.length + seedbaseResults.length + missionResults.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        {/* Search Input */}
        <div className="p-4 border-b border-border/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, seedbases, missions..."
              className="w-full pl-10 pr-10 py-3 bg-muted rounded-xl outline-none focus:ring-2 ring-primary/50"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted-foreground/20 rounded-full"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-border/50 px-4">
            <TabsList className="w-full grid grid-cols-3 h-10 bg-transparent">
              <TabsTrigger value="users" className="text-xs flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Users ({userResults.length})
              </TabsTrigger>
              <TabsTrigger value="seedbases" className="text-xs flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Seedbases ({seedbaseResults.length})
              </TabsTrigger>
              <TabsTrigger value="missions" className="text-xs flex items-center gap-1.5">
                <Flag className="h-3.5 w-3.5" />
                Missions ({missionResults.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !query ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">Start typing to search</p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No results for "{query}"</p>
              </div>
            ) : (
              <>
                {/* Users Tab */}
                <TabsContent value="users" className="mt-0 p-4 space-y-2">
                  <AnimatePresence>
                    {userResults.map((user, i) => (
                      <motion.button
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleResultClick('user', user.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                      >
                        <Avatar className="h-10 w-10">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.display_name || ''} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(user.display_name || user.username).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.display_name || user.username}</p>
                          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          user.active_role === 'trustee' && "bg-trust/10 text-trust",
                          user.active_role === 'envoy' && "bg-envoy/10 text-envoy",
                          user.active_role === 'activator' && "bg-seed/10 text-seed"
                        )}>
                          {user.active_role}
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                {/* Seedbases Tab */}
                <TabsContent value="seedbases" className="mt-0 p-4 space-y-2">
                  <AnimatePresence>
                    {seedbaseResults.map((seedbase, i) => (
                      <motion.button
                        key={seedbase.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleResultClick('seedbase', seedbase.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                          {seedbase.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{seedbase.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{seedbase.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          ${(seedbase.totalCommitted / 1000).toFixed(0)}K committed
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </TabsContent>

                {/* Missions Tab */}
                <TabsContent value="missions" className="mt-0 p-4 space-y-2">
                  <AnimatePresence>
                    {missionResults.map((mission, i) => (
                      <motion.button
                        key={mission.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleResultClick('mission', mission.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-envoy/10 flex items-center justify-center">
                          <Flag className="h-5 w-5 text-envoy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{mission.title}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              ${(mission.raised / 1000).toFixed(1)}K / ${(mission.goal / 1000).toFixed(0)}K
                            </span>
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              mission.status === 'active' && "bg-seed/10 text-seed",
                              mission.status === 'completed' && "bg-trust/10 text-trust",
                              mission.status === 'pending' && "bg-muted text-muted-foreground"
                            )}>
                              {mission.status}
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}