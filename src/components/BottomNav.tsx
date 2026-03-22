import { Home, Gamepad2, Wallet, Trophy, User } from 'lucide-react';
import { motion } from 'motion/react';

export function BottomNav({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'play', icon: Gamepad2, label: 'Play' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 border-t border-slate-200 backdrop-blur-xl pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto relative px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-blue-50 rounded-xl shadow-inner"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.8, y: 2 }}
                animate={isActive ? { y: -2 } : { y: 0 }}
                className={`relative z-10 transition-colors duration-300 ${
                  isActive ? 'text-purple-600 drop-shadow-[0_2px_8px_rgba(147,51,234,0.4)]' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={isActive ? 24 : 22} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
