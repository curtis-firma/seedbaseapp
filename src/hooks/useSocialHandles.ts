import { useState, useEffect } from 'react';

export interface SocialHandles {
  x_handle: string;
  base_handle: string;
}

const STORAGE_KEY = 'seedbase-social-handles';

export function useSocialHandles() {
  const [handles, setHandles] = useState<SocialHandles>({
    x_handle: '',
    base_handle: '',
  });
  
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHandles(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);
  
  const updateHandles = (newHandles: SocialHandles) => {
    setHandles(newHandles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHandles));
  };
  
  const hasHandles = handles.x_handle || handles.base_handle;
  
  return {
    handles,
    updateHandles,
    hasHandles,
    xHandle: handles.x_handle,
    baseHandle: handles.base_handle,
  };
}

export default useSocialHandles;
