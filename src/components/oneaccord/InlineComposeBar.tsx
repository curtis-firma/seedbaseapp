import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { DollarSign, Send, Plus, Minus, X, Search, Edit, MessageCircle, Smile, Hash, ImageIcon, Mic, Play, Pause, ChevronLeft, Users } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { cn } from '@/lib/utils';
import { getAllCompletedUsers, searchUsers, getWalletByUserId, type DemoUser } from '@/lib/supabase/demoApi';
import { createTransfer } from '@/lib/supabase/transfersApi';
import { ChatBubbles, type ChatBubblesRef } from './ChatBubbles';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { GifStickerPicker } from './GifStickerPicker';
import { useUser } from '@/contexts/UserContext';

interface InlineComposeBarProps {
  onSuccess?: () => void;
  preselectedUser?: DemoUser | null;
  onBack?: () => void;
}

const PRESET_AMOUNTS = [10, 25, 50, 100];

// Smart tag options for @seedbasexyz/...
const SEEDBASE_TAGS = [
  { tag: '@seedbasexyz/transparency', label: 'Transparency', emoji: '📊', color: 'bg-blue-500' },
  { tag: '@seedbasexyz/mission', label: 'Mission Update', emoji: '🚀', color: 'bg-green-500' },
  { tag: '@seedbasexyz/harvest', label: 'Harvest Report', emoji: '🌾', color: 'bg-orange-500' },
  { tag: '@seedbasexyz/governance', label: 'Governance', emoji: '🗳️', color: 'bg-purple-500' },
];

// Format duration as MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Slide to cancel threshold
const CANCEL_THRESHOLD = -100;

// Swipe-to-exit threshold
const SWIPE_EXIT_THRESHOLD = 100;
const SWIPE_VELOCITY_THRESHOLD = 500;

export function InlineComposeBar({ onSuccess, preselectedUser, onBack }: InlineComposeBarProps) {
  const { avatarUrl: currentUserAvatar, username: currentUsername } = useUser();
  // If a preselected user is provided, jump straight to compose mode
  const [mode, setMode] = useState<'idle' | 'user-select' | 'compose'>(preselectedUser ? 'compose' : 'idle');
  
  const [message, setMessage] = useState('');
  const [attachUsdc, setAttachUsdc] = useState(false);
  const [amount, setAmount] = useState(25);
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(preselectedUser || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<DemoUser[]>([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [attachedMedia, setAttachedMedia] = useState<{ url: string; type: 'gif' | 'sticker' } | null>(null);
  const [showVoicePreview, setShowVoicePreview] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  
  // Swipe-to-exit state
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Typing indicator handlers from ChatBubbles
  const typingHandlersRef = useRef<{ onKeystroke: () => void; stopTyping: () => void } | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const chatBubblesRef = useRef<ChatBubblesRef>(null);

  // Voice recorder hook
  const {
    isRecording,
    duration,
    audioBlob,
    audioUrl,
    volume,
    startRecording,
    stopRecording,
    cancelRecording,
    clearRecording
  } = useVoiceRecorder();

  // Keyboard awareness - detect iOS keyboard
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const diff = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(diff > 100 ? diff : 0);
      }
    };
    
    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const sessionData = localStorage.getItem('seedbase-session');
      let userId: string | null = null;
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          userId = parsed.userId || null;
        } catch {}
      }
      
      setCurrentUserId(userId);
      
      const users = await getAllCompletedUsers(userId || undefined);
      setAvailableUsers(users);
      
      if (userId) {
        const wallet = await getWalletByUserId(userId);
        if (wallet) {
          setCurrentBalance(wallet.balance);
        }
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers(searchQuery, currentUserId || undefined).then(setAvailableUsers);
    } else if (searchQuery.length === 0) {
      getAllCompletedUsers(currentUserId || undefined).then(setAvailableUsers);
    }
  }, [searchQuery, currentUserId]);

  // Check for @ mentions to show tag suggestions
  useEffect(() => {
    const lastAtIndex = message.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = message.slice(lastAtIndex + 1);
      if (textAfterAt.startsWith('seed') || textAfterAt === '') {
        setShowTagSuggestions(true);
        setTagFilter(textAfterAt);
      } else {
        setShowTagSuggestions(false);
      }
    } else {
      setShowTagSuggestions(false);
    }
  }, [message]);

  const filteredUsers = availableUsers.filter(u => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().replace(/^@/, '');
    return u.username?.toLowerCase().includes(query) || 
           u.display_name?.toLowerCase().includes(query);
  });

  const filteredTags = SEEDBASE_TAGS.filter(t => 
    t.tag.toLowerCase().includes(tagFilter.toLowerCase()) ||
    t.label.toLowerCase().includes(tagFilter.toLowerCase())
  );

  const handleAmountChange = (delta: number) => {
    const newAmount = Math.max(1, Math.min(10000, amount + delta));
    setAmount(newAmount);
    triggerHaptic('light');
  };

  const handlePresetClick = (preset: number) => {
    setAmount(preset);
    triggerHaptic('light');
  };

  const handleSelectUser = (user: DemoUser) => {
    setSelectedUser(user);
    setSearchQuery('');
    setMode('compose');
    triggerHaptic('light');
  };

  const handleCancel = () => {
    // If we have an onBack callback (thread mode), use it instead of resetting to idle
    if (onBack) {
      onBack();
      return;
    }
    setMode('idle');
    setSelectedUser(null);
    setSearchQuery('');
    setMessage('');
    setAttachUsdc(false);
    setSelectedTags([]);
    setAttachedMedia(null);
    setShowExtras(false);
    setIsFocused(false);
    // Clear voice recording
    clearRecording();
    setShowVoicePreview(false);
    setIsPlayingPreview(false);
  };

  const handleMediaSelect = (url: string, type: 'gif' | 'sticker') => {
    if (type === 'sticker') {
      // For stickers, append to message
      setMessage(prev => prev + url);
    } else {
      // For GIFs, attach as media
      setAttachedMedia({ url, type });
    }
  };

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.slice(0, start) + emojiData.emoji + message.slice(end);
      setMessage(newMessage);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
        textarea.focus();
      }, 0);
    } else {
      setMessage(prev => prev + emojiData.emoji);
    }
    setShowEmojiPicker(false);
    setShowExtras(false);
    triggerHaptic('light');
  };

  const handleTagSelect = (tag: string) => {
    // Replace the @... with the full tag
    const lastAtIndex = message.lastIndexOf('@');
    const newMessage = message.slice(0, lastAtIndex) + tag + ' ';
    setMessage(newMessage);
    setSelectedTags(prev => [...prev, tag]);
    setShowTagSuggestions(false);
    textareaRef.current?.focus();
    triggerHaptic('light');
  };

  const handleSend = async () => {
    if (!selectedUser) {
      toast.error('Please select a recipient');
      return;
    }
    
    // Allow voice message as valid content
    const hasVoiceMessage = audioBlob !== null;
    // Check for attached media (GIF) as valid content
    const hasAttachedMedia = attachedMedia !== null;
    
    if (!message.trim() && !attachUsdc && !hasVoiceMessage && !hasAttachedMedia) {
      toast.error('Please enter a message, record audio, attach media, or attach USDC');
      return;
    }

    if (attachUsdc && amount > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSending(true);
    triggerHaptic('medium');

    try {
      // Build message content including voice message indicator and GIF
      let messageContent = '';
      
      if (hasVoiceMessage) {
        messageContent = `🎤 Voice message (${formatDuration(duration)})${message.trim() ? ` - ${message.trim()}` : ''}`;
      } else if (hasAttachedMedia) {
        // Include GIF URL in message with [GIF] prefix
        messageContent = attachedMedia.type === 'gif' 
          ? `[GIF]${attachedMedia.url}${message.trim() ? ` ${message.trim()}` : ''}`
          : message.trim() || 'Direct transfer';
      } else {
        messageContent = message.trim() || 'Direct transfer';
      }

      if ((attachUsdc && amount > 0 && currentUserId) || hasVoiceMessage || message.trim() || hasAttachedMedia) {
        await createTransfer(
          currentUserId!,
          selectedUser.id,
          attachUsdc ? amount : 0,
          messageContent
        );
      }

      triggerHaptic('success');
      
      const successMessage = hasVoiceMessage
        ? `Voice message sent to @${selectedUser.username}${attachUsdc ? ` with $${amount} USDC` : ''}`
        : attachUsdc && amount > 0
          ? `Sent $${amount} USDC to @${selectedUser.username}`
          : `Message sent to @${selectedUser.username}`;
      
      toast.success(successMessage);
      
      // Refresh chat bubbles immediately
      chatBubblesRef.current?.refresh();
      
      // Stop typing indicator
      typingHandlersRef.current?.stopTyping();
      
      // Reset form but stay in compose mode with same user
      setMessage('');
      setAttachUsdc(false);
      setSelectedTags([]);
      setAttachedMedia(null);
      setShowExtras(false);
      clearRecording();
      setShowVoicePreview(false);
      setIsPlayingPreview(false);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error sending:', error);
      toast.error('Failed to send');
    } finally {
      setIsSending(false);
    }
  };

  const canSend = selectedUser && (message.trim() || (attachUsdc && amount > 0) || audioBlob || attachedMedia);
  
  // Show mic button when no content and no USDC and no media
  const showMicButton = !message.trim() && !attachUsdc && !attachedMedia && !audioBlob;
  
  // Handle voice preview playback
  const handlePlayPreview = () => {
    if (!audioUrl) return;
    
    if (isPlayingPreview && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current.currentTime = 0;
      setIsPlayingPreview(false);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioPreviewRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.play();
      setIsPlayingPreview(true);
    }
    triggerHaptic('light');
  };
  
  // Handle recording start (pointer down) with slide tracking
  const handleRecordStart = async (e: React.PointerEvent) => {
    e.preventDefault();
    setDragStartX(e.clientX);
    setDragOffset(0);
    triggerHaptic('medium');
    await startRecording();
  };
  
  // Handle pointer move for slide-to-cancel
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isRecording && dragStartX !== null) {
      const offset = e.clientX - dragStartX;
      setDragOffset(offset);
      
      if (offset < CANCEL_THRESHOLD) {
        cancelRecording();
        setDragStartX(null);
        setDragOffset(0);
        triggerHaptic('error');
      }
    }
  };
  
  // Handle recording stop (pointer up)
  const handleRecordStop = () => {
    if (isRecording) {
      stopRecording();
      triggerHaptic('success');
      setShowVoicePreview(true);
    }
    setDragStartX(null);
    setDragOffset(0);
  };
  
  // Handle recording cancel (pointer leaves)
  const handleRecordCancel = () => {
    if (isRecording) {
      cancelRecording();
      triggerHaptic('error');
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  // Handle swipe-to-exit gesture
  const handleSwipeDrag = (event: any, info: PanInfo) => {
    // Only allow swiping right (positive x)
    if (info.offset.x > 0) {
      setSwipeX(info.offset.x);
      setIsDragging(true);
    }
  };

  const handleSwipeDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Check if swipe should trigger exit
    if (info.offset.x > SWIPE_EXIT_THRESHOLD || info.velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      triggerHaptic('light');
      handleCancel();
    } else {
      // Spring back
      setSwipeX(0);
    }
  };

  // IDLE MODE: Show pencil FAB with gradient (like X/Twitter)
  if (mode === 'idle') {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setMode('user-select');
          triggerHaptic('light');
        }}
        className="fixed bottom-20 right-4 md:right-8 z-40 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
      >
        <Edit className="h-6 w-6" />
      </motion.button>
    );
  }

  // USER-SELECT MODE: Dark X/Twitter style full-screen
  if (mode === 'user-select') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black flex flex-col"
        style={{ top: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <button
            onClick={handleCancel}
            className="text-white font-medium hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
          <h1 className="font-bold text-lg text-white">New message</h1>
          <div className="w-14" />
        </div>

        {/* To: field */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">To:</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=""
              autoFocus
              className="flex-1 bg-transparent text-white outline-none text-base"
            />
          </div>
        </div>

        {/* Create group option (disabled/demo) */}
        <button className="flex items-center gap-3 px-4 py-4 border-b border-white/10 opacity-50 cursor-not-allowed">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <span className="text-blue-400 font-medium">Create a group</span>
        </button>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.slice(0, 20).map((user) => (
            <motion.button
              key={user.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectUser(user)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.display_name || user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {user.display_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-left">
                <p className="font-semibold text-white">{user.display_name || user.username}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </motion.button>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // COMPOSE MODE: Full-screen dark with swipe-to-exit gesture
  const isKeyboardOpen = keyboardHeight > 0;
  const showCollapsedUI = isFocused || message.length > 0;

  // Calculate dynamic bottom for chat container
  const chatBottomOffset = isKeyboardOpen 
    ? `${keyboardHeight + 90}px`  // Above keyboard + compose bar
    : '140px';                     // Above compose bar + bottom nav

  // Calculate peek-through opacity based on swipe
  const peekOpacity = Math.min(swipeX / (SWIPE_EXIT_THRESHOLD * 2), 0.5);

  return (
    <>
      {/* Peek-through background (shows inbox behind during swipe) */}
      {isDragging && (
        <motion.div
          className="fixed inset-0 z-30 bg-gray-50"
          style={{ opacity: peekOpacity }}
        />
      )}

      {/* Swipeable compose container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.3 }}
        onDrag={handleSwipeDrag}
        onDragEnd={handleSwipeDragEnd}
        animate={{ x: isDragging ? swipeX : 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-0 z-40 bg-black touch-pan-y"
        style={{ touchAction: 'pan-y' }}
      >
        {/* Swipe indicator edge */}
        <div className="absolute left-0 top-0 bottom-0 w-4 z-50" />

        {/* Persistent Recipient Header - Telegram Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="absolute top-0 left-0 right-0 bg-black border-b border-white/10 pt-12"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-white"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-blue-400">Back</span>
            </button>
            
            {/* Recipient info - centered */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                {selectedUser?.avatar_url ? (
                  <img 
                    src={selectedUser.avatar_url}
                    className="w-8 h-8 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedUser?.display_name?.[0]?.toUpperCase() || selectedUser?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-white">
                  {selectedUser?.display_name || selectedUser?.username}
                </span>
              </div>
              <span className="text-xs text-gray-400">@{selectedUser?.username}</span>
            </div>
            
            {/* Placeholder for symmetry */}
            <div className="w-16" />
          </div>
        </motion.div>

        {/* Chat History Bubbles */}
        <div 
          className="absolute top-28 left-0 right-0 bg-black overflow-hidden"
          style={{ bottom: chatBottomOffset }}
        >
          <ChatBubbles
            ref={chatBubblesRef}
            currentUserId={currentUserId}
            currentUserAvatar={currentUserAvatar}
            currentUsername={currentUsername}
            selectedUser={selectedUser}
            className="h-full"
            onTypingChange={(onKeystroke, stopTyping) => {
              typingHandlersRef.current = { onKeystroke, stopTyping };
            }}
          />
        </div>

        {/* Tag Suggestions Dropdown */}
        <AnimatePresence>
          {showTagSuggestions && filteredTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed left-3 right-3 z-50 bg-[#1e1e1e] rounded-2xl p-3 shadow-xl border border-white/10"
              style={{ 
                bottom: isKeyboardOpen 
                  ? `${keyboardHeight + 80}px` 
                  : '144px' 
              }}
            >
              <p className="text-xs font-medium text-gray-400 px-2 mb-2">Tag a Seedbase Channel</p>
              <div className="space-y-1">
                {filteredTags.map((tag) => (
                  <motion.button
                    key={tag.tag}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTagSelect(tag.tag)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", tag.color)}>
                      {tag.emoji}
                    </span>
                    <div className="text-left">
                      <p className="font-medium text-white text-sm">{tag.label}</p>
                      <p className="text-xs text-gray-500">{tag.tag}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compose Bar Container */}
        <div 
          className="fixed left-0 right-0 z-50 px-3 pb-3"
          style={{ 
            bottom: isKeyboardOpen ? `${keyboardHeight + 12}px` : '12px'
          }}
        >
          {/* Dark pill container */}
          <div className="bg-[#2b2b2b] rounded-[28px] shadow-2xl border border-white/5 overflow-hidden">
            
            {/* Voice Preview Banner (inside pill) */}
            {audioBlob && showVoicePreview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="border-b border-white/10"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={handlePlayPreview}
                      className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md"
                    >
                      {isPlayingPreview ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </motion.button>
                    <div>
                      <span className="text-sm font-medium text-white">
                        Voice Message
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatDuration(duration)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      clearRecording();
                      setShowVoicePreview(false);
                      setIsPlayingPreview(false);
                      if (audioPreviewRef.current) {
                        audioPreviewRef.current.pause();
                      }
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* USDC Amount Row (inline when attached) */}
            <AnimatePresence>
              {attachUsdc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/10 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto">
                    {/* Amount controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAmountChange(-5)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        <Minus className="h-4 w-4 text-white" />
                      </motion.button>
                      <div className="flex items-center gap-1 min-w-[80px] justify-center">
                        <span className="text-xl font-bold text-white">${amount}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAmountChange(5)}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </motion.button>
                    </div>
                    
                    {/* Preset buttons - horizontal scroll */}
                    <div className="flex gap-2 overflow-x-auto flex-nowrap">
                      {PRESET_AMOUNTS.map((preset) => (
                        <motion.button
                          key={preset}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePresetClick(preset)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0",
                            amount === preset
                              ? "bg-green-500 text-white"
                              : "bg-white/10 text-white hover:bg-white/20"
                          )}
                        >
                          ${preset}
                        </motion.button>
                      ))}
                    </div>
                    
                    {/* Close USDC */}
                    <button
                      onClick={() => setAttachUsdc(false)}
                      className="p-1.5 hover:bg-white/10 rounded-lg flex-shrink-0 ml-auto"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 px-4 pb-2 text-center">
                    Balance: ${currentBalance.toFixed(2)} USDC
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attached Media Preview */}
            <AnimatePresence>
              {attachedMedia && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-white/10 overflow-hidden"
                >
                  <div className="p-3 relative">
                    <img 
                      src={attachedMedia.url} 
                      alt="Attached media"
                      className="max-h-24 rounded-lg"
                    />
                    <button
                      onClick={() => setAttachedMedia(null)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice Recording UI - replaces input when recording */}
            {isRecording ? (
              <div 
                className="flex items-center gap-3 px-4 py-3"
                onPointerMove={handlePointerMove}
                onPointerUp={handleRecordStop}
                onPointerLeave={handleRecordCancel}
              >
                {/* Waveform visualization */}
                <div className="flex-1 flex items-center gap-1 h-8">
                  <div 
                    className="w-3 h-3 rounded-full bg-red-500 animate-pulse"
                    style={{ transform: `scale(${0.8 + volume * 0.5})` }}
                  />
                  <div className="flex-1 flex items-end gap-0.5 h-6 px-2">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-red-400/80 rounded-full"
                        animate={{
                          height: `${20 + Math.random() * volume * 80}%`,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-red-400 ml-2">
                    {formatDuration(duration)}
                  </span>
                </div>
                
                {/* Slide to cancel indicator */}
                <motion.div 
                  className="flex items-center gap-2 text-gray-400"
                  animate={{ x: dragOffset * 0.3, opacity: 1 - Math.abs(dragOffset) / 150 }}
                >
                  <span className="text-sm">← Slide to cancel</span>
                </motion.div>
              </div>
            ) : (
              /* Main input row */
              <div className="flex items-end gap-2 p-2">
                {/* Left action buttons */}
                <div className="flex items-center gap-1 pb-1">
                  {/* USDC toggle */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAttachUsdc(!attachUsdc);
                      triggerHaptic('light');
                    }}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                      attachUsdc 
                        ? "bg-green-500 text-white" 
                        : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
                    )}
                  >
                    <DollarSign className="h-5 w-5" />
                  </motion.button>

                  {/* GIF/Media button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowGifPicker(true);
                      triggerHaptic('light');
                    }}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <ImageIcon className="h-5 w-5" />
                  </motion.button>

                  {/* Emoji button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      triggerHaptic('light');
                    }}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <Smile className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Text input - 16px font to prevent zoom */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      // Trigger typing indicator
                      typingHandlersRef.current?.onKeystroke();
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Message..."
                    rows={1}
                    className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none text-[16px] py-2 px-1 max-h-24"
                    style={{ fontSize: '16px' }} // Prevent iOS zoom
                  />
                </div>

                {/* Right action: Mic or Send */}
                <div className="pb-1">
                  {showMicButton ? (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onPointerDown={handleRecordStart}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      <Mic className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSend}
                      disabled={!canSend || isSending}
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                        canSend && !isSending
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-gray-500"
                      )}
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Emoji Picker - Swipeable Drawer */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setShowEmojiPicker(false);
                }
              }}
              className="fixed left-0 right-0 bottom-0 z-50 bg-[#1e1e1e] rounded-t-3xl max-h-[50vh] overflow-hidden"
            >
              {/* Drag handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                width="100%"
                height={300}
                searchDisabled
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* GIF/Sticker Picker */}
        <AnimatePresence>
          {showGifPicker && (
            <GifStickerPicker
              isOpen={showGifPicker}
              onSelect={handleMediaSelect}
              onClose={() => setShowGifPicker(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}