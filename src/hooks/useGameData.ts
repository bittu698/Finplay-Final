import { useState, useEffect } from 'react';

// Helper to encode/decode base64
const encode = (data: any) => btoa(JSON.stringify(data));
const decode = (str: string) => JSON.parse(atob(str));

const STORAGE_KEY = 'finplay_data';

const defaultData = {
  userId: 'FP' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
  coins: 100, // Initial coins
  matchesPlayed: 0,
  wins: 0,
  lastRewardedAdTime: 0,
  lastDailyBonusTime: 0,
  dailyAdsWatched: 0,
  lastAdResetDate: new Date().toDateString(),
  profilePic: null as string | null,
  transactions: [{ id: 1, type: 'bonus', amount: 100, date: Date.now(), title: 'Welcome Bonus' }]
};

export function useGameData() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultData, ...decode(stored) };
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }
    return defaultData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, encode(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }, [data]);

  const addCoins = (amount: number, title: string) => {
    setData(prev => ({
      ...prev,
      coins: prev.coins + amount,
      transactions: [{ id: Date.now(), type: 'earn', amount, date: Date.now(), title }, ...prev.transactions].slice(0, 50)
    }));
  };

  const deductCoins = (amount: number, title: string) => {
    setData(prev => ({
      ...prev,
      coins: prev.coins - amount,
      transactions: [{ id: Date.now(), type: 'spend', amount: -amount, date: Date.now(), title }, ...prev.transactions].slice(0, 50)
    }));
  };

  const updateStats = (won: boolean) => {
    setData(prev => ({
      ...prev,
      matchesPlayed: prev.matchesPlayed + 1,
      wins: prev.wins + (won ? 1 : 0)
    }));
  };

  const setLastRewardedAdTime = (time: number) => setData(prev => ({ ...prev, lastRewardedAdTime: time }));
  const setLastDailyBonusTime = (time: number) => setData(prev => ({ ...prev, lastDailyBonusTime: time }));
  const setProfilePic = (pic: string | null) => setData(prev => ({ ...prev, profilePic: pic }));

  const incrementDailyAds = () => {
    setData(prev => {
      const today = new Date().toDateString();
      if (prev.lastAdResetDate !== today) {
        return { ...prev, dailyAdsWatched: 1, lastAdResetDate: today };
      }
      return { ...prev, dailyAdsWatched: prev.dailyAdsWatched + 1 };
    });
  };

  // Check and reset daily ads on load
  useEffect(() => {
    const today = new Date().toDateString();
    if (data.lastAdResetDate !== today) {
      setData(prev => ({ ...prev, dailyAdsWatched: 0, lastAdResetDate: today }));
    }
  }, []);

  return { data, addCoins, deductCoins, updateStats, setLastRewardedAdTime, setLastDailyBonusTime, setProfilePic, incrementDailyAds };
}

// --- API CALL STRUCTURE (As requested for secure state management) ---
const API_BASE_URL = 'https://api.finplay.example.com/v1';

export const apiService = {
  getHeaders: () => ({
    'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'mock_token'}`,
    'Content-Type': 'application/json'
  }),
  
  fetchSecureGameData: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/game/data`, { headers: apiService.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (e) {
      console.warn('Backend not connected, using local state.');
      return null;
    }
  },
  
  updateProfile: async (data: any) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
  },

  changePassword: async (data: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data.current === 'wrong') reject(new Error('Incorrect current password'));
        else resolve({ success: true });
      }, 800);
    });
  },

  submitSupport: async (data: any) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
  },

  requestPayment: async (data: any) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }
};
// -------------------------------------------------------------------
