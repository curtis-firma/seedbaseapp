import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, ImageIcon, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { triggerHaptic } from '@/hooks/useHaptic';

interface GifStickerPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, type: 'gif' | 'sticker') => void;
}

// Recent stickers storage key
const RECENT_STICKERS_KEY = 'seedbase-recent-stickers';
const MAX_RECENT = 12;

// Helper to get recent stickers from localStorage
const getRecentStickers = (): string[] => {
  try {
    const stored = localStorage.getItem(RECENT_STICKERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save recent sticker
const saveRecentSticker = (sticker: string) => {
  try {
    const recent = getRecentStickers();
    const filtered = recent.filter(s => s !== sticker);
    const updated = [sticker, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_STICKERS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
};

// Expanded sticker packs - 10 categories, 170+ stickers
const STICKER_PACKS = [
  {
    name: 'Recent',
    icon: '🕐',
    color: 'from-gray-500 to-gray-600',
    stickers: [] as string[], // Populated dynamically
  },
  {
    name: 'Reactions',
    icon: '😊',
    color: 'from-yellow-400 to-orange-500',
    stickers: ['👍', '👎', '❤️', '🔥', '💯', '🙏', '😂', '😭', '🥺', '😍', '🤯', '💀', '🤩', '😤', '🥰', '🤔', '😱', '🙄', '😬', '🫡']
  },
  {
    name: 'Faith',
    icon: '✝️',
    color: 'from-purple-500 to-indigo-600',
    stickers: ['✝️', '🙏', '⛪', '📖', '🕊️', '💒', '🌅', '🌄', '🙌', '❤️‍🔥', '🤲', '👑', '⚓', '🪔', '🕯️', '🛐', '🌾', '🍞', '🍷', '🐑']
  },
  {
    name: 'Celebrate',
    icon: '🎉',
    color: 'from-pink-500 to-rose-500',
    stickers: ['🎉', '🎊', '🥳', '🎁', '🏆', '🌟', '✨', '💫', '🚀', '💰', '💵', '💎', '🎯', '🎖️', '🎗️', '🥇', '🎈', '🎂', '🍾', '🪅']
  },
  {
    name: 'Social',
    icon: '🤝',
    color: 'from-blue-500 to-cyan-500',
    stickers: ['🤝', '👥', '🫂', '💬', '🗣️', '📢', '🔗', '🌐', '🏠', '🏘️', '👨‍👩‍👧‍👦', '🧑‍🤝‍🧑', '❤️‍🔥', '💞', '🤗', '🫶']
  },
  {
    name: 'Money',
    icon: '💰',
    color: 'from-green-500 to-emerald-600',
    stickers: ['💵', '💰', '💎', '🪙', '💳', '🏦', '📈', '📊', '💸', '🤑', '🎰', '🏧', '💲', '📉', '🔒', '✅']
  },
  {
    name: 'Hands',
    icon: '🤚',
    color: 'from-amber-400 to-yellow-500',
    stickers: ['👆', '👇', '👈', '👉', '✋', '🤚', '🖐️', '✌️', '🤞', '🫰', '🤘', '🤙', '👊', '✊', '👋', '🖖', '💪', '👏', '🤌', '🫵']
  },
  {
    name: 'Hearts',
    icon: '❤️',
    color: 'from-red-500 to-pink-500',
    stickers: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💝', '💘', '🫀']
  },
  {
    name: 'Nature',
    icon: '🌿',
    color: 'from-green-400 to-teal-500',
    stickers: ['🌱', '🌿', '🌳', '🌻', '🌸', '🍀', '🌈', '☀️', '🌙', '⭐', '🌊', '🔥', '🌤️', '⛅', '🌧️', '⛈️', '❄️', '🌪️', '🌺', '🍂']
  },
  {
    name: 'Animals',
    icon: '🦁',
    color: 'from-orange-400 to-amber-500',
    stickers: ['🐑', '🦁', '🦅', '🕊️', '🐟', '🐋', '🦋', '🐝', '🐺', '🦌', '🐎', '🦜', '🐢', '🦉', '🐕', '🐈']
  },
  {
    name: 'Food',
    icon: '☕',
    color: 'from-amber-500 to-orange-600',
    stickers: ['☕', '🍵', '🧃', '🍞', '🍕', '🍔', '🌮', '🥗', '🍎', '🍇', '🍰', '🧁', '🍩', '🍪', '🥐', '🍿']
  }
];

// Popular GIF search terms for trending
const TRENDING_TERMS = ['thank you', 'celebrate', 'happy', 'love', 'excited', 'wow'];

export function GifStickerPicker({ isOpen, onClose, onSelect }: GifStickerPickerProps) {
  const [activeTab, setActiveTab] = useState<'stickers' | 'gifs'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<string[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [selectedPack, setSelectedPack] = useState(1); // Start on Reactions, not Recent
  const [recentStickers, setRecentStickers] = useState<string[]>([]);

  // Load recent stickers on mount
  useEffect(() => {
    if (isOpen) {
      setRecentStickers(getRecentStickers());
    }
  }, [isOpen]);

  // Build packs with recent stickers
  const packsWithRecent = STICKER_PACKS.map((pack, i) => {
    if (i === 0) {
      return { ...pack, stickers: recentStickers };
    }
    return pack;
  });

  // Simulated GIF search (since we don't have Tenor API key yet)
  const searchGifs = useCallback(async (query: string) => {
    setIsLoadingGifs(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const placeholderGifs = [
      'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
      'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
      'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
      'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
      'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
      'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif',
    ];
    
    setGifs(placeholderGifs);
    setIsLoadingGifs(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'gifs' && gifs.length === 0) {
      searchGifs('trending');
    }
  }, [activeTab, gifs.length, searchGifs]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery && activeTab === 'gifs') {
        searchGifs(searchQuery);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, activeTab, searchGifs]);

  const handleStickerSelect = (sticker: string) => {
    triggerHaptic('light');
    saveRecentSticker(sticker);
    setRecentStickers(getRecentStickers());
    onSelect(sticker, 'sticker');
    onClose();
  };

  const handleGifSelect = (gifUrl: string) => {
    triggerHaptic('light');
    onSelect(gifUrl, 'gif');
    onClose();
  };

  if (!isOpen) return null;

  const currentPack = packsWithRecent[selectedPack];
  const hasNoRecent = selectedPack === 0 && recentStickers.length === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[75vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('stickers')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === 'stickers'
                    ? "bg-gradient-to-r from-[#0000ff] to-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Sparkles className="h-4 w-4 inline-block mr-1" />
                Stickers
              </button>
              <button
                onClick={() => setActiveTab('gifs')}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === 'gifs'
                    ? "bg-gradient-to-r from-[#0000ff] to-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <ImageIcon className="h-4 w-4 inline-block mr-1" />
                GIFs
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search (GIFs only) */}
          {activeTab === 'gifs' && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search GIFs..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0000ff]/30"
                />
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {TRENDING_TERMS.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      searchGifs(term);
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 whitespace-nowrap"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sticker Pack Tabs - Scrollable with gradient indicators */}
          {activeTab === 'stickers' && (
            <div className="relative">
              {/* Scroll fade indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100 scrollbar-hide">
                {packsWithRecent.map((pack, i) => {
                  // Skip Recent if empty and not selected
                  if (i === 0 && recentStickers.length === 0 && selectedPack !== 0) {
                    return null;
                  }
                  
                  return (
                    <motion.button
                      key={pack.name}
                      onClick={() => setSelectedPack(i)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 min-w-fit",
                        selectedPack === i
                          ? "bg-gradient-to-r text-white shadow-md " + pack.color
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {i === 0 ? <Clock className="h-3 w-3" /> : <span>{pack.icon}</span>}
                      {pack.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'stickers' ? (
              <>
                {hasNoRecent ? (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No recent stickers</p>
                    <p className="text-sm">Stickers you use will appear here</p>
                    <button
                      onClick={() => setSelectedPack(1)}
                      className="mt-4 px-4 py-2 bg-[#0000ff]/10 text-[#0000ff] rounded-full text-sm font-medium hover:bg-[#0000ff]/20 transition-colors"
                    >
                      Browse Stickers
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {currentPack.stickers.map((sticker, i) => (
                      <motion.button
                        key={`${sticker}-${i}`}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleStickerSelect(sticker)}
                        className="w-14 h-14 flex items-center justify-center text-3xl rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {sticker}
                      </motion.button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {isLoadingGifs ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0000ff] mb-2" />
                    <p className="text-sm text-gray-500">Loading GIFs...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {gifs.map((gif, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGifSelect(gif)}
                        className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                      >
                        <img
                          src={gif}
                          alt="GIF"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
                
                {!isLoadingGifs && gifs.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No GIFs found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with count */}
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {activeTab === 'stickers' 
                ? `${currentPack.name} • ${currentPack.stickers.length} stickers` 
                : 'Powered by GIPHY'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
