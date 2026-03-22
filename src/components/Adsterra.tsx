import { useEffect, useState } from 'react';

export function BannerAd({ id }: { id: string }) {
  return (
    <div className="flex justify-center my-2 w-full">
      <div id={id} className="w-[320px] h-[50px] bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium rounded-lg overflow-hidden border border-gray-300 border-dashed">
        Adsterra Banner ({id}) 320x50
      </div>
    </div>
  );
}

let lastInterstitialTime = 0;

export function InterstitialAd({ show, onClose }: { show: boolean, onClose: () => void }) {
  const [canSkip, setCanSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (show) {
      setCanSkip(false);
      setTimeLeft(5);
    }
  }, [show]);

  useEffect(() => {
    let timer: any;
    if (show && !canSkip && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [show, canSkip, timeLeft]);

  useEffect(() => {
    if (show && !canSkip && timeLeft <= 0) {
      setCanSkip(true);
    }
  }, [show, canSkip, timeLeft]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div id="ad-interstitial" className="w-full max-w-sm aspect-[3/4] bg-gray-800 flex items-center justify-center text-gray-400">
        Adsterra Interstitial Ad
      </div>
      {canSkip ? (
        <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm">
          Skip Ad
        </button>
      ) : (
        <div className="absolute top-6 right-6 bg-black/50 text-white px-4 py-2 rounded-full font-medium backdrop-blur-sm">
          Skip in {timeLeft}s
        </div>
      )}
    </div>
  );
}

export function showInterstitialIfNeeded(callback: () => void) {
  const now = Date.now();
  if (now - lastInterstitialTime > 2 * 60 * 1000) {
    lastInterstitialTime = now;
    return true; // Should show
  }
  callback();
  return false;
}
