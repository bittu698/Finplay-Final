import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, ChevronRight, User, Shield, CreditCard, Globe, Lock, HelpCircle, FileText, Mail, ChevronDown, X } from 'lucide-react';
import { apiService } from '../hooks/useGameData';

export function Profile({ data, setProfilePic }: { data: any, setProfilePic: (pic: string | null) => void }) {
  const winRate = data.matchesPlayed > 0 ? Math.round((data.wins / data.matchesPlayed) * 100) : 0;
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // New States for Forms & Modals
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210' });
  
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passStatus, setPassStatus] = useState({ error: '', success: '', loading: false });
  
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'support' | 'payment' | null>(null);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [supportStatus, setSupportStatus] = useState({ error: '', success: '', loading: false });
  
  const [paymentForm, setPaymentForm] = useState({ amount: '', upi: '' });
  const [paymentStatus, setPaymentStatus] = useState({ error: '', success: '', loading: false });

  const handleSaveProfile = async () => {
    if (!profileForm.name || !profileForm.email || !profileForm.phone) {
      alert('All fields are required');
      return;
    }
    try {
      await apiService.updateProfile(profileForm);
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (e) {
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    setPassStatus({ error: '', success: '', loading: true });
    if (passForm.new.length < 8) {
      setPassStatus({ error: 'New password must be at least 8 characters', success: '', loading: false });
      return;
    }
    if (passForm.new !== passForm.confirm) {
      setPassStatus({ error: 'Passwords do not match', success: '', loading: false });
      return;
    }
    try {
      await apiService.changePassword({ current: passForm.current, new: passForm.new });
      setPassStatus({ error: '', success: 'Password changed successfully!', loading: false });
      setPassForm({ current: '', new: '', confirm: '' });
    } catch (e: any) {
      setPassStatus({ error: e.message || 'Failed to change password.', success: '', loading: false });
    }
  };

  const handleSupportSubmit = async () => {
    setSupportStatus({ error: '', success: '', loading: true });
    if (!supportForm.subject || !supportForm.message) {
      setSupportStatus({ error: 'Please fill all fields', success: '', loading: false });
      return;
    }
    try {
      await apiService.submitSupport(supportForm);
      setSupportStatus({ error: '', success: 'Message sent successfully! We will contact you soon.', loading: false });
      setSupportForm({ subject: '', message: '' });
    } catch (e) {
      setSupportStatus({ error: 'Failed to send message', success: '', loading: false });
    }
  };

  const handlePaymentSubmit = async () => {
    setPaymentStatus({ error: '', success: '', loading: true });
    if (!paymentForm.amount || !paymentForm.upi) {
      setPaymentStatus({ error: 'Please fill all fields', success: '', loading: false });
      return;
    }
    try {
      await apiService.requestPayment(paymentForm);
      setPaymentStatus({ error: '', success: 'Payment request submitted successfully!', loading: false });
      setPaymentForm({ amount: '', upi: '' });
    } catch (e) {
      setPaymentStatus({ error: 'Failed to submit request', success: '', loading: false });
    }
  };

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
          onClick={() => setActiveModal('payment')}
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
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-slate-700">Your Information</h3>
                  <button onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)} className="text-purple-600 text-xs font-bold px-3 py-1 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors">
                    {isEditingProfile ? 'Save' : 'Edit'}
                  </button>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Name</label>
                  {isEditingProfile ? (
                    <input value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-white border border-purple-300 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">{profileForm.name}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email</label>
                  {isEditingProfile ? (
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-white border border-purple-300 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">{profileForm.email}</div>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone</label>
                  {isEditingProfile ? (
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-white border border-purple-300 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">{profileForm.phone}</div>
                  )}
                </div>
                {!isEditingProfile && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Username</label>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium text-slate-800">{data.userId}</div>
                  </div>
                )}
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
                <input type="password" placeholder="Current Password" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                <input type="password" placeholder="New Password (Min 8 chars)" value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                <input type="password" placeholder="Confirm New Password" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" />
                
                {passStatus.error && <p className="text-xs text-red-500 font-medium px-1">{passStatus.error}</p>}
                {passStatus.success && <p className="text-xs text-emerald-500 font-medium px-1">{passStatus.success}</p>}
                
                <button onClick={handleChangePassword} disabled={passStatus.loading} className="w-full bg-purple-600 text-white rounded-xl p-3 text-sm font-bold hover:bg-purple-700 transition-colors mt-2 disabled:opacity-70">
                  {passStatus.loading ? 'Updating...' : 'Update Password'}
                </button>
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
                <button onClick={() => setActiveModal('terms')} className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <FileText size={18} className="text-slate-400" />
                  <span>Terms & Conditions</span>
                </button>
                <button onClick={() => setActiveModal('privacy')} className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <Shield size={18} className="text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
                <button onClick={() => setActiveModal('support')} className="w-full flex items-center space-x-3 p-4 text-sm font-medium text-slate-600 hover:text-purple-600 hover:bg-purple-50/50 transition-colors">
                  <Mail size={18} className="text-slate-400" />
                  <span>Contact Support</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">
                  {activeModal === 'terms' && 'Terms & Conditions'}
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'support' && 'Contact Support'}
                  {activeModal === 'payment' && 'Request Payment'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 bg-slate-200 rounded-full text-slate-500 hover:bg-slate-300 transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {activeModal === 'terms' && (
                  <div className="space-y-4 text-sm text-slate-600">
                    <p><strong>1. Acceptance of Terms</strong><br/>By accessing and using Finplay, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    <p><strong>2. Reward System</strong><br/>Coins earned in-game hold no real-world monetary value until explicitly converted through our approved payment gateways. We reserve the right to modify reward rates at any time.</p>
                    <p><strong>3. Fair Play</strong><br/>Any use of bots, scripts, or exploits to manipulate match outcomes or ad views will result in immediate account termination and forfeiture of all coins.</p>
                    <p><strong>4. Ad Limits</strong><br/>Users are restricted to a maximum of 20 rewarded ads per day to ensure network quality and fair distribution of rewards.</p>
                  </div>
                )}
                
                {activeModal === 'privacy' && (
                  <div className="space-y-4 text-sm text-slate-600">
                    <p><strong>1. Data Collection</strong><br/>We collect information you provide directly to us, such as when you create or modify your account, contact customer support, or otherwise communicate with us.</p>
                    <p><strong>2. Use of Information</strong><br/>We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information.</p>
                    <p><strong>3. Data Security</strong><br/>We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access.</p>
                  </div>
                )}
                
                {activeModal === 'support' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 mb-4">Need help? Send us a message and our support team will get back to you within 24 hours.</p>
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      value={supportForm.subject}
                      onChange={e => setSupportForm({...supportForm, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors" 
                    />
                    <textarea 
                      placeholder="Describe your issue..." 
                      rows={4}
                      value={supportForm.message}
                      onChange={e => setSupportForm({...supportForm, message: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-purple-500 transition-colors resize-none" 
                    />
                    
                    {supportStatus.error && <p className="text-xs text-red-500 font-medium">{supportStatus.error}</p>}
                    {supportStatus.success && <p className="text-xs text-emerald-500 font-medium">{supportStatus.success}</p>}
                    
                    <button 
                      onClick={handleSupportSubmit}
                      disabled={supportStatus.loading}
                      className="w-full bg-purple-600 text-white rounded-xl p-3 text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-70"
                    >
                      {supportStatus.loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                )}

                {activeModal === 'payment' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500 mb-4">You are eligible to request payment for being in the top 3! Please enter your details below.</p>
                    <input 
                      type="number" 
                      placeholder="Amount (₹)" 
                      value={paymentForm.amount}
                      onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500 transition-colors" 
                    />
                    <input 
                      type="text" 
                      placeholder="UPI ID" 
                      value={paymentForm.upi}
                      onChange={e => setPaymentForm({...paymentForm, upi: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-amber-500 transition-colors" 
                    />
                    
                    {paymentStatus.error && <p className="text-xs text-red-500 font-medium">{paymentStatus.error}</p>}
                    {paymentStatus.success && <p className="text-xs text-emerald-500 font-medium">{paymentStatus.success}</p>}
                    
                    <button 
                      onClick={handlePaymentSubmit}
                      disabled={paymentStatus.loading}
                      className="w-full bg-amber-500 text-white rounded-xl p-3 text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-70"
                    >
                      {paymentStatus.loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
