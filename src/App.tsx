import { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Play } from './components/Play';
import { Wallet } from './components/Wallet';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { useGameData } from './hooks/useGameData';
import { InterstitialAd, showInterstitialIfNeeded } from './components/Adsterra';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  
  const gameData = useGameData();

  // Show interstitial on app start
  useEffect(() => {
    showInterstitialIfNeeded(() => {});
    setShowInterstitial(true);
  }, []);

  const handleNavigate = (tab: string) => {
    if (tab === currentTab) return;
    
    const shouldShow = showInterstitialIfNeeded(() => {
      setCurrentTab(tab);
    });
    
    if (shouldShow) {
      setPendingTab(tab);
      setShowInterstitial(true);
    }
  };

  const handleCloseInterstitial = () => {
    setShowInterstitial(false);
    if (pendingTab) {
      setCurrentTab(pendingTab);
      setPendingTab(null);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-purple-500/30 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100 blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-100 blur-[120px] pointer-events-none"></div>

      <InterstitialAd show={showInterstitial} onClose={handleCloseInterstitial} />
      
      <main className="w-full h-full relative z-10">
        {currentTab === 'home' && <Home navigateTo={handleNavigate} />}
        {currentTab === 'play' && <Play {...gameData} navigateTo={handleNavigate} />}
        {currentTab === 'wallet' && <Wallet {...gameData} />}
        {currentTab === 'leaderboard' && <Leaderboard data={gameData.data} />}
        {currentTab === 'profile' && <Profile data={gameData.data} setProfilePic={gameData.setProfilePic} />}
      </main>

      <BottomNav currentTab={currentTab} setCurrentTab={handleNavigate} />
    </div>
  );
}
