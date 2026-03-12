import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Check, AlertCircle, Loader2, Eye, EyeOff, X, 
  User, Mail, Phone, Globe, Shield, Bell, LogOut, Trash2, Camera, Save,
  LayoutDashboard, ChevronRight
} from "lucide-react";
import { authService } from "../../services/authService";

function Account() {
  // ── User State ───────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Profile Form ─────────────────────────────────────────
  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState("English");
  const [newsletter, setNewsletter] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // ── Change Password Modal ─────────────────────────────────
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState(null);

  // ── Fetch user khi mount ──────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = authService.getToken();
        if (!token) { window.location.href = '/auth'; return; }

        const res = await fetch('http://localhost:3001/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (res.status === 401) { authService.logout(); window.location.href = '/auth'; return; }
        if (!res.ok) throw new Error('Failed to fetch user');

        const data = await res.json();
        setUser(data);
        setFullName(data.fullName || '');
        setLanguage(data.language || 'English');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ── Lưu profile ──────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, language }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setUser(data.user);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Đổi password ─────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordError(null);

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const token = authService.getToken();
      const res = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to change password');

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  // ── Loading / Error screens ───────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 text-slate-500">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin absolute"></div>
          </div>
          <p className="text-sm font-semibold tracking-wide uppercase text-cyan-600">Loading Profile</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-sm w-full border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h3>
          <p className="text-slate-500 mb-8">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30">
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
      {/* ── Background Header ── */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-br from-cyan-400 to-cyan-600 overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="absolute top-[-20%] right-[-5%] w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-cyan-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        {/* ── Top Navigation ── */}
        <div className="flex items-center justify-between mb-8 text-white">
          <a href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm drop-shadow-sm">Back to Home</span>
          </a>
        </div>

        {/* ── Main Content Card ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col border border-slate-100"
        >

          {/* ── The Redesigned Dashboard Banner ── */}
          <div className="px-6 pt-6 sm:px-10 sm:pt-10 pb-0">
            <div
              onClick={() => window.location.href = '/dashboard'}
              className="group relative bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer overflow-hidden shadow-lg border border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-300"
            >
              {/* Decorative abstract shape */}
              <div className="absolute -right-10 -top-24 w-64 h-64 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-colors duration-500"></div>

              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                  <LayoutDashboard className="text-white w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1 group-hover:text-cyan-50 transition-colors">Go to Dashboard</h3>
                  <p className="text-cyan-100 text-sm">Manage CV history, view Fit Scores, and track analysis results.</p>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-0 relative z-10 flex items-center gap-2 text-cyan-900 font-semibold bg-white hover:bg-cyan-50 px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                Access Workspace <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* ── Profile Split Layout ── */}
          <div className="flex flex-col md:flex-row flex-1 mt-6">
            
            {/* Left Column: Profile Snapshot */}
            <div className="md:w-[35%] p-6 sm:p-10 border-r border-slate-100 bg-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-5 group cursor-pointer">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-4xl shadow-inner border border-cyan-200 overflow-hidden relative z-10 transition-transform group-hover:scale-105">
                    {fullName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <Camera className="text-white w-7 h-7" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">{fullName}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full text-green-600 text-xs font-semibold mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active Status
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm text-cyan-500 border border-slate-100"><Mail className="w-4 h-4" /></div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
                  </div>
                </div>

                {user?.phoneNumber && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-cyan-500 border border-slate-100"><Phone className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {user?.gender && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm text-cyan-500 border border-slate-100"><User className="w-4 h-4" /></div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Gender</p>
                      <p className="text-sm font-medium text-slate-700 capitalize">{user.gender}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Settings Form */}
            <div className="md:w-[65%] p-6 sm:p-10 bg-slate-50/30">
              <div className="max-w-xl mx-auto md:mx-0">
                
                {/* Section 1: Personal Info */}
                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wider">
                  <User className="w-4 h-4 text-cyan-500" /> Personal Details
                </h3>

                <div className="grid grid-cols-1 gap-5 mb-10">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 shadow-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Preferred Language</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 appearance-none focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all duration-200 shadow-sm"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Vietnamese</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Security & Preferences */}
                <h3 className="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2 uppercase tracking-wider">
                  <Shield className="w-4 h-4 text-cyan-500" /> Security & Settings
                </h3>

                <div className="space-y-4 mb-8">
                  {/* Password Setting */}
                  <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Password</p>
                      <p className="text-xs text-slate-500 mt-1">Keep your account secure</p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 transition-colors"
                    >
                      Update
                    </button>
                  </div>

                  {/* Newsletter Toggle */}
                  <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex gap-4">
                      <div className="mt-0.5"><Bell className="w-5 h-5 text-slate-400" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Email Notifications</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Receive resume tips and platform updates.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`${newsletter ? 'bg-cyan-500' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2`}
                      onClick={() => setNewsletter(!newsletter)}
                    >
                      <span className={`${newsletter ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
                  <div className="flex-1">
                    {saveError && (
                      <p className="text-red-500 text-sm font-medium flex items-center gap-1.5"><AlertCircle className="w-4 h-4"/> {saveError}</p>
                    )}
                    {saveSuccess && (
                      <p className="text-green-500 text-sm font-medium flex items-center gap-1.5"><Check className="w-4 h-4"/> Changes saved!</p>
                    )}
                    {!saveError && !saveSuccess && (
                      <p className="text-sm text-slate-500">Review your changes before saving.</p>
                    )}
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:bg-cyan-300 disabled:active:scale-100 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
                  >
                    {saveLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                  </button>
                </div>

                <div className="w-full h-px bg-slate-200 my-10"></div>

                {/* Danger Zone */}
                <div>
                  <h3 className="text-xs font-bold text-red-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Danger Zone
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => { authService.logout(); window.location.href = '/auth'; }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition border border-slate-200 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition border border-red-100 shadow-sm">
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Change Password Modal ── */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closePasswordModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 overflow-hidden border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">New Password</h2>
                  <p className="text-sm text-slate-500 mt-1">Ensure your account stays secure.</p>
                </div>
                <button onClick={closePasswordModal} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-cyan-600">
                  <X size={20} />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Success!</h3>
                  <p className="text-slate-500">Your password has been updated securely.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none pr-12 transition"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors">
                        {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none pr-12 transition"
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors">
                        {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmNewPassword: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none pr-12 transition"
                        placeholder="Re-enter new password"
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors">
                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3.5 rounded-xl text-sm font-medium border border-red-100">
                      <AlertCircle size={18} /> {passwordError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button onClick={closePasswordModal} className="flex-1 py-3.5 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition font-semibold">
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword}
                      className="flex-1 py-3.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white rounded-xl transition font-semibold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Account;