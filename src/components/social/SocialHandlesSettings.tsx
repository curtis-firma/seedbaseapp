import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, AtSign, Save, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';

interface SocialHandles {
  x_handle: string;
  base_handle: string;
}

const STORAGE_KEY = 'seedbase-social-handles';

const EXAMPLE_HANDLES = {
  x_handle: '0x_SeedbaseUser',
  base_handle: 'seeduser.base.eth',
};

export function SocialHandlesSettings() {
  const [xHandle, setXHandle] = useState('');
  const [baseHandle, setBaseHandle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const handles: SocialHandles = JSON.parse(stored);
      setXHandle(handles.x_handle || '');
      setBaseHandle(handles.base_handle || '');
    }
  }, []);
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const handles: SocialHandles = JSON.parse(stored);
      const changed = xHandle !== (handles.x_handle || '') || baseHandle !== (handles.base_handle || '');
      setHasChanges(changed);
    } else {
      setHasChanges(xHandle !== '' || baseHandle !== '');
    }
  }, [xHandle, baseHandle]);
  
  const handleSave = async () => {
    setIsSaving(true);
    triggerHaptic('light');
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const handles: SocialHandles = {
      x_handle: xHandle.replace('@', ''),
      base_handle: baseHandle.replace('@', ''),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    
    setIsSaving(false);
    setHasChanges(false);
    triggerHaptic('success');
    toast.success('Saved');
  };
  
  const handleConnectDemo = (platform: 'x' | 'base') => {
    triggerHaptic('light');
    if (platform === 'x') {
      setXHandle(EXAMPLE_HANDLES.x_handle);
    } else {
      setBaseHandle(EXAMPLE_HANDLES.base_handle);
    }
    toast.success(`Demo ${platform === 'x' ? 'X' : 'Base'} handle connected!`);
  };
  
  return (
    <div className="space-y-4">
      {/* X Handle */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Twitter className="h-4 w-4" />
          X Handle
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            type="text"
            value={xHandle}
            onChange={(e) => setXHandle(e.target.value.replace('@', ''))}
            placeholder="0x_Curtis"
            className="w-full pl-8 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-base outline-none focus:border-[#0000ff] transition-colors"
          />
        </div>
        {!xHandle && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnectDemo('x')}
            className="text-sm text-[#0000ff] font-medium flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Connect (demo)
          </motion.button>
        )}
      </div>
      
      {/* Base Handle */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <AtSign className="h-4 w-4" />
          Base Handle
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            type="text"
            value={baseHandle}
            onChange={(e) => setBaseHandle(e.target.value.replace('@', ''))}
            placeholder="0xcurtis.base.eth"
            className="w-full pl-8 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-base outline-none focus:border-[#0000ff] transition-colors"
          />
        </div>
        {!baseHandle && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnectDemo('base')}
            className="text-sm text-[#0000ff] font-medium flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Connect (demo)
          </motion.button>
        )}
      </div>
      
      {/* Display Preview */}
      {(xHandle || baseHandle) && (
        <div className="bg-muted/30 rounded-xl p-3 mt-4">
          <p className="text-xs text-muted-foreground mb-1">Preview on profile:</p>
          <p className="text-sm">
            {xHandle && <span>X: @{xHandle}</span>}
            {xHandle && baseHandle && <span className="text-muted-foreground"> · </span>}
            {baseHandle && <span>Base: @{baseHandle}</span>}
          </p>
        </div>
      )}
      
      {/* Save Button */}
      {hasChanges && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#0000ff] text-white rounded-xl font-medium disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Handles
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}

export default SocialHandlesSettings;
