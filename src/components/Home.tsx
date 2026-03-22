import { BannerAd } from './Adsterra';
import { motion } from 'motion/react';

const winners = [
  { name: 'Rahul S.', amount: '₹500 Recharge' },
  { name: 'Priya D.', amount: '₹300 Recharge' },
  { name: 'Amit K.', amount: '₹100 Recharge' },
];

export function Home({ navigateTo }: { navigateTo: (tab: string) => void }) {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeft = endOfMonth.getDate() - now.getDate();
  const hoursLeft = 23 - now.getHours();
  const minutesLeft = 59 - now.getMinutes();
  const currentMonth = now.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen"
    >
      <BannerAd id="ad-top" type="mini" />

      {/* Season Ends Banner */}
      <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-pink-200 shadow-md relative overflow-hidden mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-transparent"></div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="p-2 bg-pink-100 rounded-xl text-pink-600 border border-pink-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <h3 className="text-pink-600 font-bold text-xs uppercase tracking-wider mb-0.5">{currentMonth} Season Ends In</h3>
            <p className="text-slate-800 font-mono font-bold text-lg tracking-tight">
              {daysLeft.toString().padStart(2, '0')}d : {hoursLeft.toString().padStart(2, '0')}h : {minutesLeft.toString().padStart(2, '0')}m
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-xl relative overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <h1 className="text-3xl font-black mb-2 tracking-widest uppercase text-purple-600">Play Tic Tac Toe</h1>
        <p className="text-slate-500 mb-6 text-sm font-medium">Win matches, earn coins, and get free mobile recharges!</p>
        
        <button 
          onClick={() => navigateTo('play')}
          className="bg-purple-600 text-white px-6 py-4 rounded-full font-bold shadow-lg hover:bg-purple-700 transition-all w-full active:scale-95 relative z-10 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <span>Play Now</span>
            <span className="bg-white/20 px-2 py-1 rounded-lg text-xs ml-2">20 Coins</span>
          </span>
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
          <span>Last Month's Winners</span>
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          {winners.map((w, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 font-bold">
                  {w.name.charAt(0)}
                </div>
                <span className="font-medium text-slate-700">{w.name}</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                {w.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 flex items-center space-x-3 border border-pink-100 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-transparent"></div>
        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
        <p className="text-sm text-slate-600 font-medium relative z-10">Rahul won <span className="text-pink-600 font-bold">30 coins</span> just now!</p>
      </div>

      <BannerAd id="ad-bottom" type="mini" />
    </motion.div>
  );
}
