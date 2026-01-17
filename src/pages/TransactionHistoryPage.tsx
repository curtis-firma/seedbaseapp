import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownRight, ArrowUpRight, ArrowLeft, Filter, Search,
  Banknote, CreditCard, Building2, Users, Calendar, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getTransfersForUser, type DemoTransfer } from '@/lib/supabase/transfersApi';
import { formatDistanceToNow, format, isWithinInterval, subDays, startOfDay, endOfDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
type DateRange = 'all' | '7d' | '30d' | '90d';
type StatusFilter = 'all' | 'accepted' | 'pending' | 'declined';

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<DemoTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get current user ID
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

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    
    setLoading(true);
    try {
      const transfers = await getTransfersForUser(userId, 100);
      setTransactions(transfers);
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Categorize transaction type
  const getTransactionType = (tx: DemoTransfer): TransactionType => {
    if (!tx.from_user_id && tx.to_user_id === currentUserId) return 'deposit';
    if (tx.from_user_id === currentUserId && !tx.to_user_id) return 'withdrawal';
    if (tx.to_user_id === currentUserId) return 'transfer_in';
    return 'transfer_out';
  };

  // Get transaction display info
  const getTransactionDisplay = (tx: DemoTransfer) => {
    const type = getTransactionType(tx);
    
    switch (type) {
      case 'deposit':
        return {
          icon: CreditCard,
          label: 'Deposit',
          description: tx.purpose || 'Added funds',
          color: 'text-seed',
          bgColor: 'bg-seed/10',
          sign: '+',
        };
      case 'withdrawal':
        return {
          icon: Building2,
          label: 'Withdrawal',
          description: tx.purpose || 'Withdrew to bank',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          sign: '-',
        };
      case 'transfer_in':
        return {
          icon: ArrowDownRight,
          label: 'Received',
          description: `From @${tx.from_user?.username || 'user'}`,
          color: 'text-seed',
          bgColor: 'bg-seed/10',
          sign: '+',
        };
      case 'transfer_out':
        return {
          icon: ArrowUpRight,
          label: 'Sent',
          description: `To @${tx.to_user?.username || 'user'}`,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          sign: '-',
        };
    }
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txType = getTransactionType(tx);
      
      // Type filter
      if (typeFilter !== 'all' && txType !== typeFilter) return false;
      
      // Status filter
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      
      // Date range filter
      if (dateRange !== 'all') {
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
        const txDate = new Date(tx.created_at);
        const startDate = startOfDay(subDays(new Date(), days));
        const endDate = endOfDay(new Date());
        if (!isWithinInterval(txDate, { start: startDate, end: endDate })) return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const display = getTransactionDisplay(tx);
        const matchesAmount = tx.amount.toString().includes(query);
        const matchesPurpose = tx.purpose?.toLowerCase().includes(query);
        const matchesUser = tx.from_user?.username?.toLowerCase().includes(query) || 
                          tx.to_user?.username?.toLowerCase().includes(query);
        const matchesLabel = display.label.toLowerCase().includes(query);
        
        if (!matchesAmount && !matchesPurpose && !matchesUser && !matchesLabel) return false;
      }
      
      return true;
    });
  }, [transactions, typeFilter, statusFilter, dateRange, searchQuery, currentUserId]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, tx) => {
        const type = getTransactionType(tx);
        if (tx.status === 'accepted') {
          if (type === 'deposit' || type === 'transfer_in') {
            acc.incoming += tx.amount;
          } else {
            acc.outgoing += tx.amount;
          }
        }
        return acc;
      },
      { incoming: 0, outgoing: 0 }
    );
  }, [filteredTransactions, currentUserId]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="glass-strong border-b border-border/50 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/wallet')}
              className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl font-bold">Transaction History</h1>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-border/50"
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span>Filters</span>
              {(typeFilter !== 'all' || dateRange !== 'all' || statusFilter !== 'all') && (
                <Badge variant="secondary" className="text-xs">Active</Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              showFilters && "rotate-180"
            )} />
          </motion.button>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-2 pt-3">
                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType)}>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="transfer_in">Received</SelectItem>
                      <SelectItem value="transfer_out">Sent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="accepted">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-seed/10 rounded-xl p-4 border border-seed/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <ArrowDownRight className="h-4 w-4 text-seed" />
              <span className="text-sm text-seed">Incoming</span>
            </div>
            <p className="text-xl font-bold text-seed">
              +${totals.incoming.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-primary/10 rounded-xl p-4 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <ArrowUpRight className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Outgoing</span>
            </div>
            <p className="text-xl font-bold text-primary">
              -${totals.outgoing.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </motion.div>
        </div>

        {/* Transaction List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border/50 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-32 bg-muted rounded" />
                  </div>
                  <div className="h-5 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg font-medium mb-1">No transactions found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery || typeFilter !== 'all' || dateRange !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your transactions will appear here'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((tx, i) => {
              const display = getTransactionDisplay(tx);
              const Icon = display.icon;
              
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-card rounded-xl p-4 border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      display.bgColor
                    )}>
                      <Icon className={cn("h-5 w-5", display.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{display.label}</p>
                        <Badge 
                          variant={tx.status === 'accepted' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs capitalize"
                        >
                          {tx.status === 'accepted' ? 'Completed' : tx.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {display.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn(
                        "font-semibold",
                        tx.status === 'accepted' && display.sign === '+' ? "text-seed" : 
                        tx.status === 'declined' ? "text-muted-foreground line-through" : ""
                      )}>
                        {display.sign}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  {tx.purpose && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">{tx.purpose}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Results Count */}
        {filteredTransactions.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
