import { useEffect, useState } from 'react';

export function BannerAd({ id, type = 'banner' }: { id: string, type?: 'banner' | 'chart' }) {
  if (type === 'chart') {
    return (
      <div className="flex justify-center my-4 w-full">
        <div id={id} className="w-full max-w-[320px] rounded-xl overflow-hidden shadow-sm">
          <img src="https://i.ibb.co/6c257bNn/chart.jpg" alt="Chart" className="w-full h-auto object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-4 w-full">
      <div id={id} className="w-[300px] h-[250px] bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-medium rounded-xl overflow-hidden border border-slate-200 border-dashed shadow-sm text-center">
        Adsterra Banner ({id})<br/>300x250
      </div>
    </div>
  );
}

let lastInterstitialTime = 0;

export function InterstitialAd({ show, onClose }: { show: boolean, onClose: () => void }) {
  const [canSkip, setCanSkip] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (show) {
      setCanSkip(false);
      setTimeLeft(3);
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
