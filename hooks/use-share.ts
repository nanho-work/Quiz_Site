import { useState } from "react";

export function useShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const shareResult = async (title: string, text: string, url?: string) => {
    setIsSharing(true);
    
    const shareData = {
      title,
      text,
      url: url || window.location.href
    };

    try {
      // Check if native sharing is available (mobile)
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await copyToClipboard(shareData.url);
      }
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback to clipboard on error
      await copyToClipboard(shareData.url);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  return {
    shareResult,
    copyToClipboard,
    isSharing,
    shareSuccess
  };
}
