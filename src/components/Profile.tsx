import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ChevronRight, User, Shield, CreditCard, Globe, Lock, HelpCircle, FileText, Mail, ChevronDown } from 'lucide-react';

export function Profile({ data, setProfilePic }: { data: any, setProfilePic: (pic: string | null) => void }) {
  const winRate = data.matchesPlayed > 0 ? Math.round((data.wins / data.matchesPlayed) * 100) : 0;
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock checking if user is in top 3
  const isTop3 = true; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6 pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen bg-slate-50"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-50 rounded-full blur-2xl"></div>

        <div className="relative mb-4 z-10">
          <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-white shadow-md flex items-center justify-center text-4xl font-black text-purple-600 overflow-hidden">
            {data.profilePic ? (
              <img src={data.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              data.userId.charAt(0)
            )}
          </div>
          <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm hover:bg-purple-700 transition-colors active:scale-95 cursor-pointer">
            <Camera size={14} />
            <input type="file" id="profile-pic-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>
        
        <h2 className="text-xl font-bold text-slate-800 relative z-10">{data.userId}</h2>
        <p className="text-sm text-purple-600 font-medium bg-purple-50 border border-purple-100 px-3 py-1 rounded-full mt-2 mb-6 relative z-10">Finplay Member</p>
        
        <div className="grid grid-cols-3 gap-4 w-full relative z-10">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Matches</p>
            <p className="text-lg font-black text-slate-800">{data.matchesPlayed}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Wins</p>
            <p className="text-lg font-black text-emerald-500">{data.wins}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1">Win Rate</p>
            <p className="text-lg font-black text-pink-500">{winRate}%</p>
          </div>
        </div>
      </div>

      {/* Request Payment (Top 3 Only) */}
      {isTop3 && (
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-md border border-amber-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <CreditCard size={20} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Request Payment</p>
              <p className="text-[10px] text-amber-100 font-medium">(If you are top 3 leaderboard holder)</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-white/80 relative z-10" />
        </motion.button>
      )}

      {/* Personal Details Accordion */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <button 
          onClick={() => setShowPersonalDetails(!showPersonalDetails)}
          className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
              <User size={20} />
            </div>
            <span className="font-bold text-slate-700">Personal Details</span>
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${showPersonalDetails ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showPersonalDetails && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-slate-100 space-y-4 bg-slate-50/50">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Name</label>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">Rahul Sharma</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Username</label>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">{data.userId}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">UPI ID</label>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800 flex items-center justify-between">
                    <span>rahul@upi</span>
                    <button className="text-purple-600 text-xs font-bold">Edit</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-purple-600 text-white border border-purple-600 rounded-xl p-2 text-sm font-bold text-center">English</button>
                    <button className="bg-white text-slate-600 border border-slate-200 rounded-xl p-2 text-sm font-bold text-center hover:bg-slate-50">Hindi</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Change Password Accordion */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <button 
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Lock size={20} />
            </div>
            <span className="font-bold text-slate-700">Change Password</span>
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${showChangePassword ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showChangePassword && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
                <input type="password" placeholder="Current Password" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                <input type="password" placeholder="New Password" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                <input type="password" placeholder="Confirm New Password" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                <button className="w-full bg-purple-600 text-white rounded-xl p-3 text-sm font-bold hover:bg-purple-700 transition-colors mt-2">Update Password</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings & Support Accordion */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <Shield size={20} />
            </div>
            <span className="font-bold text-slate-700">Settings & Support</span>
          </div>
          <ChevronDown size={20} className={`text-slate-400 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <HelpCircle size={18} className="text-slate-400" />
                  <span>How to Play</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <FileText size={18} className="text-slate-400" />
                  <span>Terms & Conditions</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <Shield size={18} className="text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <Mail size={18} className="text-slate-400" />
                  <span>Contact Support</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
