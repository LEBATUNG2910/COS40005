import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Check, AlertCircle, Loader2, Eye, EyeOff, X, 
  User, Mail, Phone, Globe, Shield, Bell, LogOut, Trash2, Camera, Save 
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-slate-500">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-sm font-medium tracking-wide uppercase text-cyan-600">Loading Profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Connection Error</h3>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition shadow-md shadow-cyan-500/20">
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
      {/* ── Background Header ── */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-cyan-400 to-cyan-600 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-black/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        {/* ── Top Navigation ── */}
        <div className="flex items-center justify-between mb-8 text-white">
          <a href="/" className="flex items-center gap-2 hover:bg-white/10 px-4 py-2 rounded-full transition backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </a>
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>

        {/* ── Main Content Card ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100"
        >
          {/* Left Column: Profile Snapshot */}
          <div className="md:w-1/3 bg-slate-50/50 p-8 border-r border-slate-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-5xl border-4 border-white shadow-lg overflow-hidden relative z-10">
                  {fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-20">
                  <Camera className="text-white w-8 h-8" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mb-1">{fullName}</h2>
              <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Status
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500"><Mail className="w-4 h-4" /></div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-400 font-medium uppercase">Email</p>
                  <p className="text-sm font-medium text-slate-700 truncate">{user?.email}</p>
                </div>
              </div>

              {user?.phoneNumber && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500"><Phone className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">Phone</p>
                    <p className="text-sm font-medium text-slate-700">{user.phoneNumber}</p>
                  </div>
                </div>
              )}

              {user?.gender && (
                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <div className="bg-cyan-50 p-2 rounded-lg text-cyan-500"><User className="w-4 h-4" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase">Gender</p>
                    <p className="text-sm font-medium text-slate-700 capitalize">{user.gender}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="md:w-2/3 p-8 lg:p-12">
            <div className="max-w-xl">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-500" /> Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-6 mb-10">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Language</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="text-black w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all duration-200"
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

              <div className="w-full h-px bg-slate-100 mb-10"></div>

              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-500" /> Security & Preferences
              </h3>

              <div className="space-y-6 mb-10">
                {/* Password Setting */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Password</p>
                    <p className="text-xs text-slate-500 mt-1">Last changed: Never</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:text-cyan-600 hover:border-cyan-300 transition shadow-sm"
                  >
                    Update
                  </button>
                </div>

                {/* Newsletter Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex gap-3">
                    <div className="mt-1"><Bell className="w-5 h-5 text-slate-400" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Get inspiring resume examples and advice with our newsletter.</p>
                    </div>
                  </div>
                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    className={`${newsletter ? 'bg-cyan-500' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
                    onClick={() => setNewsletter(!newsletter)}
                  >
                    <span className={`${newsletter ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex flex-col items-end">
                {saveError && (
                  <p className="text-red-500 text-sm mb-3 font-medium flex items-center gap-1"><AlertCircle className="w-4 h-4"/> {saveError}</p>
                )}
                <button
                  onClick={handleSaveProfile}
                  disabled={saveLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 active:scale-95 disabled:bg-cyan-300 disabled:active:scale-100 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
                >
                  {saveLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                  ) : saveSuccess ? (
                    <><Check className="w-5 h-5" /> Saved Successfully</>
                  ) : (
                    <><Save className="w-5 h-5" /> Save Changes</>
                  )}
                </button>
              </div>

              <div className="w-full h-px bg-slate-100 my-10"></div>

              {/* Danger Zone */}
              <div>
                <h3 className="text-sm font-bold text-red-500 mb-4 uppercase tracking-wider">Danger Zone</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => { authService.logout(); window.location.href = '/auth'; }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition border border-slate-200"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition border border-red-100">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden"
            >
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-cyan-500"></div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">New Password</h2>
                <button onClick={closePasswordModal} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              {passwordSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
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
                        className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none pr-12 transition"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
                        className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none pr-12 transition"
                        placeholder="Min. 8 characters"
                      />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
                        className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none pr-12 transition"
                        placeholder="Re-enter new password"
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-sm font-medium">
                      <AlertCircle size={16} /> {passwordError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button onClick={closePasswordModal} className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition font-semibold">
                      Cancel
                    </button>
                    <button
                      onClick={handleChangePassword}
                      disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword}
                      className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 disabled:cursor-not-allowed text-white rounded-xl transition font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
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