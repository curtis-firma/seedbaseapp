import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, Send, FileText, Sprout, DollarSign, 
  Search, AtSign, Upload, Megaphone, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

type ActionMode = 'menu' | 'quick-give' | 'new-post' | 'commit-seed';

export function QuickActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ActionMode>('menu');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'update' | 'testimony' | 'harvest'>('update');
  const { activeRole } = useUser();

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setMode('menu');
      setAmount('');
      setRecipient('');
      setPostContent('');
    }, 300);
  };

  const actions = [
    { 
      id: 'quick-give', 
      icon: Send, 
      label: 'Quick Give', 
      description: 'Send USDC to a person or mission',
      gradient: 'gradient-seed'
    },
    { 
      id: 'new-post', 
      icon: FileText, 
      label: 'New Post', 
      description: 'Share an update or testimony',
      gradient: 'gradient-base'
    },
    { 
      id: 'commit-seed', 
      icon: Sprout, 
      label: 'Commit Seed', 
      description: 'Lock USDC for impact',
      gradient: 'gradient-trust'
    },
  ];

  const postTypes = [
    { id: 'update', label: 'Mission Update', icon: Megaphone },
    { id: 'testimony', label: 'Testimony', icon: Heart },
    { id: 'harvest', label: 'Harvest Report', icon: Upload },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-40 w-14 h-14 rounded-2xl gradient-base text-white flex items-center justify-center shadow-elevated",
          "bottom-24 right-4 md:bottom-8 md:right-8"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleClose}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md z-50"
            >
              <div className="bg-card rounded-t-3xl md:rounded-3xl border border-border/50 overflow-hidden shadow-elevated max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <div>
                    <h2 className="font-bold text-lg">
                      {mode === 'menu' && 'Quick Actions'}
                      {mode === 'quick-give' && 'Quick Give'}
                      {mode === 'new-post' && 'New Post'}
                      {mode === 'commit-seed' && 'Commit Seed'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mode === 'menu' && 'What would you like to do?'}
                      {mode === 'quick-give' && 'Send USDC instantly'}
                      {mode === 'new-post' && 'Share with the network'}
                      {mode === 'commit-seed' && 'Lock value for impact'}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-2 hover:bg-muted rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <AnimatePresence mode="wait">
                    {/* Menu Mode */}
                    {mode === 'menu' && (
                      <motion.div
                        key="menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        {actions.map((action, i) => (
                          <motion.button
                            key={action.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setMode(action.id as ActionMode)}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border/50 hover:border-primary/30 transition-all text-left"
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", action.gradient)}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold">{action.label}</p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Quick Give Mode */}
                    {mode === 'quick-give' && (
                      <motion.div
                        key="quick-give"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Recipient */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Recipient</label>
                          <div className="relative">
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="text"
                              value={recipient}
                              onChange={(e) => setRecipient(e.target.value)}
                              placeholder="Search @user or @mission"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50"
                            />
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Amount (USDC)</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50 text-xl font-semibold"
                            />
                          </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex gap-2">
                          {[10, 25, 50, 100].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val.toString())}
                              className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium"
                            >
                              ${val}
                            </button>
                          ))}
                        </div>

                        {/* Info */}
                        <div className="bg-primary/5 rounded-xl p-3 text-sm">
                          <p className="text-muted-foreground">
                            Transfer will appear in recipient's <span className="font-medium text-foreground">OneAccord</span> for acceptance.
                          </p>
                        </div>

                        {/* Send Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 gradient-seed rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <Send className="h-5 w-5" />
                          Send USDC
                        </motion.button>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}

                    {/* New Post Mode */}
                    {mode === 'new-post' && (
                      <motion.div
                        key="new-post"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Post Type */}
                        {activeRole === 'envoy' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Post Type</label>
                            <div className="flex gap-2">
                              {postTypes.map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => setPostType(type.id as typeof postType)}
                                  className={cn(
                                    "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    postType === type.id
                                      ? "gradient-envoy text-white"
                                      : "bg-muted hover:bg-muted/80"
                                  )}
                                >
                                  <type.icon className="h-4 w-4" />
                                  {type.label.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attach to */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Attach to Mission or Seedbase</label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search @mission or @seedbase"
                              className="w-full bg-muted rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 ring-primary/50"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Content</label>
                          <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Share your update, testimony, or report..."
                            className="w-full bg-muted rounded-xl p-4 outline-none focus:ring-2 ring-primary/50 min-h-[120px] resize-none"
                          />
                        </div>

                        {/* Media Upload */}
                        <button className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                          <Upload className="h-5 w-5" />
                          Add Photo or Video
                        </button>

                        {/* Post Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 gradient-base rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <FileText className="h-5 w-5" />
                          Post to Feed
                        </motion.button>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}

                    {/* Commit Seed Mode */}
                    {mode === 'commit-seed' && (
                      <motion.div
                        key="commit-seed"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Amount */}
                        <div className="text-center py-4">
                          <div className="w-16 h-16 rounded-2xl gradient-seed mx-auto mb-4 flex items-center justify-center">
                            <Sprout className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Commit Amount</p>
                          <div className="relative inline-block">
                            <span className="text-4xl font-bold">$</span>
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="0"
                              className="text-4xl font-bold bg-transparent outline-none w-32 text-center"
                            />
                          </div>
                        </div>

                        {/* Quick Amounts */}
                        <div className="flex gap-2">
                          {[100, 500, 1000, 5000].map((val) => (
                            <button
                              key={val}
                              onClick={() => setAmount(val.toString())}
                              className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium"
                            >
                              ${val.toLocaleString()}
                            </button>
                          ))}
                        </div>

                        {/* Info */}
                        <div className="bg-seed/5 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Lock Period</span>
                            <span className="font-medium">12 months</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Expected Impact</span>
                            <span className="font-medium text-seed">High</span>
                          </div>
                        </div>

                        {/* Commit Button */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 gradient-seed rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                        >
                          <Sprout className="h-5 w-5" />
                          Commit Seed
                        </motion.button>

                        <p className="text-xs text-center text-muted-foreground">
                          "Commitment creates capacity."
                        </p>

                        <button
                          onClick={() => setMode('menu')}
                          className="w-full py-2 text-muted-foreground text-sm"
                        >
                          ← Back to menu
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
