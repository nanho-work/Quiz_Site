import { useState } from "react";
import html2canvas from "html2canvas";

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
        if (navigator.canShare && navigator.canShare({ files: [] })) {
          try {
            const element = document.querySelector('.result-card') as HTMLElement | null;
            if (element) {
              const canvas = await html2canvas(element);
              const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
              if (blob) {
                const file = new File([blob], "result.png", { type: "image/png" });
                await navigator.share({ ...shareData, files: [file] });
                setIsSharing(false);
                return;
              }
            }
          } catch (error) {
            // If capturing or sharing file fails, fallback to sharing url/text
          }
        }
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
