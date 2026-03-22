import { BannerAd } from './Adsterra';
import { motion } from 'motion/react';

const aiPlayers = [
  { name: 'Arjun P.', level: 42, coins: 15420 },
  { name: 'Neha S.', level: 38, coins: 12350 },
  { name: 'Vikram M.', level: 35, coins: 11200 },
  { name: 'Riya K.', level: 31, coins: 9800 },
  { name: 'Aditya R.', level: 29, coins: 8500 },
  { name: 'Kavya T.', level: 27, coins: 7900 },
  { name: 'Rohan B.', level: 25, coins: 7100 },
  { name: 'Sneha J.', level: 22, coins: 6400 },
  { name: 'Karan V.', level: 20, coins: 5800 },
  { name: 'Pooja N.', level: 19, coins: 5200 },
  { name: 'Aman D.', level: 17, coins: 4900 },
  { name: 'Isha G.', level: 15, coins: 4100 },
  { name: 'Rahul C.', level: 14, coins: 3800 },
  { name: 'Meera L.', level: 12, coins: 3200 },
  { name: 'Varun H.', level: 10, coins: 2500 },
  { name: 'Nisha M.', level: 9, coins: 2100 },
  { name: 'Ravi T.', level: 8, coins: 1800 },
  { name: 'Sonia P.', level: 7, coins: 1500 },
  { name: 'Kunal S.', level: 6, coins: 1200 },
  { name: 'Anjali K.', level: 5, coins: 900 },
];

export function Leaderboard({ data }: { data: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col pb-24 pt-6 max-w-md mx-auto relative min-h-screen bg-slate-50"
    >
      <div className="px-4 mb-6 text-center">
        <h1 className="text-3xl font-black text-purple-600 tracking-widest uppercase mb-1">Leaderboard</h1>
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Top 20 Rank Holders</p>
        <div className="mt-2 inline-block bg-purple-100 border border-purple-200 rounded-full px-4 py-1 text-xs font-bold text-purple-600">
          March
        </div>
      </div>

      <div className="flex justify-center items-end space-x-2 sm:space-x-4 mb-8 px-2 sm:px-4 mt-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center relative w-[30%]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 border-4 border-slate-300 flex items-center justify-center text-xl sm:text-2xl font-bold text-slate-500 shadow-md z-10">
            {aiPlayers[1].name.charAt(0)}
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-2 pb-4 pt-3 mt-[-10px] text-center z-0 w-full shadow-sm">
            <p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">{aiPlayers[1].name}</p>
            <p className="text-[10px] sm:text-xs font-black text-amber-500">{aiPlayers[1].coins}</p>
          </div>
          <div className="absolute -bottom-3 w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-white z-20 shadow-sm">2</div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center relative -translate-y-4 w-[35%]">
          <div className="absolute -top-6 text-3xl z-20 drop-shadow-md">👑</div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-2xl sm:text-3xl font-bold text-amber-500 shadow-lg z-10">
            {aiPlayers[0].name.charAt(0)}
          </div>
          <div className="bg-white border border-amber-200 rounded-lg px-2 pb-4 pt-3 mt-[-10px] text-center z-0 w-full shadow-md">
            <p className="text-[11px] sm:text-sm font-bold text-slate-800 truncate">{aiPlayers[0].name}</p>
            <p className="text-[11px] sm:text-sm font-black text-amber-500">{aiPlayers[0].coins}</p>
          </div>
          <div className="absolute -bottom-3 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm font-black text-white border-2 border-white z-20 shadow-sm">1</div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center relative w-[30%]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-50 border-4 border-orange-300 flex items-center justify-center text-xl sm:text-2xl font-bold text-orange-400 shadow-md z-10">
            {aiPlayers[2].name.charAt(0)}
          </div>
          <div className="bg-white border border-orange-200 rounded-lg px-2 pb-4 pt-3 mt-[-10px] text-center z-0 w-full shadow-sm">
            <p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate">{aiPlayers[2].name}</p>
            <p className="text-[10px] sm:text-xs font-black text-amber-500">{aiPlayers[2].coins}</p>
          </div>
          <div className="absolute -bottom-3 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs font-black text-white border-2 border-white z-20 shadow-sm">3</div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <BannerAd id="ad-leaderboard" />
      </div>

      <div className="flex-1 overflow-hidden mx-4 space-y-2">
        {aiPlayers.slice(3, 20).map((p, i) => (
          <div key={i} className="flex items-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="w-8 text-center font-black text-slate-400">
              {i + 4}
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-600 mx-3">
              {p.name.charAt(0)}
            </div>
            <div className="flex-1 font-bold text-slate-700">
              {p.name}
            </div>
            <div className="text-right font-black text-amber-500">
              {p.coins.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 border-2 border-purple-200 flex items-center justify-center font-bold text-white text-xl shadow-md overflow-hidden">
              {data.profilePic ? (
                <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                data.userId.charAt(0)
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Your Rank</p>
              <p className="font-black text-slate-800 text-xl">16</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Coins</p>
            <p className="font-black text-amber-500 text-xl">{data.coins.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
