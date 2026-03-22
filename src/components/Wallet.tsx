import { useState } from 'react';
import { BannerAd } from './Adsterra';
import { motion } from 'motion/react';

export function Wallet({ data, addCoins, setLastDailyBonusTime }: any) {
  const canClaimBonus = Date.now() - data.lastDailyBonusTime > 24 * 60 * 60 * 1000;
  const [adsWatched, setAdsWatched] = useState(0);

  const handleDailyBonus = () => {
    if (canClaimBonus) {
      addCoins(50, 'Daily Bonus');
      setLastDailyBonusTime(Date.now());
    }
  };

  const handleWatchAd = () => {
    if (adsWatched < 29) {
      addCoins(20, 'Rewarded Ad');
      setAdsWatched(prev => prev + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen"
    >
      <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-xl relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-50 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <p className="text-slate-500 text-sm font-medium mb-1 relative z-10">Total Balance</p>
        <div className="flex items-end space-x-2 mb-6 relative z-10">
          <span className="text-5xl font-black text-purple-600 drop-shadow-sm">{data.coins}</span>
          <span className="text-slate-400 font-bold mb-1">Coins</span>
        </div>
        
        <button 
          onClick={handleDailyBonus}
          disabled={!canClaimBonus}
          className={`w-full py-4 rounded-2xl font-bold transition-all relative z-10 overflow-hidden group border-2 ${
            canClaimBonus 
              ? 'bg-purple-600 border-purple-600 text-white shadow-md hover:bg-purple-700 active:scale-95' 
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <span className="relative z-10">{canClaimBonus ? 'Claim Daily Bonus (50 Coins)' : 'Bonus Claimed Today'}</span>
        </button>
      </div>

      <BannerAd id="ad-wallet" />

      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800">Watch Ads</h3>
          <p className="text-xs text-slate-500">Earn 20 coins per ad ({29 - adsWatched}/29 left)</p>
        </div>
        <button 
          onClick={handleWatchAd}
          disabled={adsWatched >= 29}
          className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            adsWatched < 29 
              ? 'bg-purple-100 text-purple-600 hover:bg-purple-200 active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Watch (20)
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
          <span>Transaction History</span>
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          {data.transactions.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No transactions yet</div>
          ) : (
            data.transactions.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-700">{t.title}</p>
                  <p className="text-xs text-slate-400">{new Date(t.date).toLocaleString()}</p>
                </div>
                <span className={`font-bold px-3 py-1 rounded-full text-xs border ${t.amount > 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-pink-600 bg-pink-50 border-pink-100'}`}>
                  {t.amount > 0 ? '+' : ''}{t.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
